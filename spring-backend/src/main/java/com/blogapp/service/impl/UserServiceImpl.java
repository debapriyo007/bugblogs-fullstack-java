package com.blogapp.service.impl;

import com.blogapp.dto.request.LoginRequest;
import com.blogapp.dto.request.RegisterRequest;
import com.blogapp.dto.request.UserUpdateRequest;
import com.blogapp.dto.request.ResetPasswordRequest;
import com.blogapp.dto.request.VerifyOtpRequest;
import com.blogapp.dto.response.AuthResponse;
import com.blogapp.dto.response.UserResponse;
import com.blogapp.entity.User;
import com.blogapp.enums.Role;
import com.blogapp.exception.ResourceNotFoundException;
import com.blogapp.exception.UserAlreadyExistsException;
import com.blogapp.mapper.UserMapper;
import com.blogapp.repository.UserRepository;
import com.blogapp.security.jwt.JwtService;
import com.blogapp.security.service.CustomUserDetails;
import com.blogapp.service.interfaces.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private static class PendingUser {
        private final String username;
        private final String email;
        private final String encodedPassword;
        private String otp;
        private java.time.LocalDateTime otpExpiryTime;

        public PendingUser(String username, String email, String encodedPassword, String otp, java.time.LocalDateTime otpExpiryTime) {
            this.username = username;
            this.email = email;
            this.encodedPassword = encodedPassword;
            this.otp = otp;
            this.otpExpiryTime = otpExpiryTime;
        }

        public String getUsername() { return username; }
        public String getEmail() { return email; }
        public String getEncodedPassword() { return encodedPassword; }
        public String getOtp() { return otp; }
        public void setOtp(String otp) { this.otp = otp; }
        public java.time.LocalDateTime getOtpExpiryTime() { return otpExpiryTime; }
        public void setOtpExpiryTime(java.time.LocalDateTime otpExpiryTime) { this.otpExpiryTime = otpExpiryTime; }
    }

    private final java.util.concurrent.ConcurrentHashMap<String, PendingUser> pendingUsers = new java.util.concurrent.ConcurrentHashMap<>();

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;
    private final com.blogapp.service.interfaces.EmailService emailService;

    public UserServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            UserMapper userMapper,
            com.blogapp.service.interfaces.EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userMapper = userMapper;
        this.emailService = emailService;
    }

    @Override
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername()) || 
            pendingUsers.values().stream().anyMatch(u -> u.getUsername().equalsIgnoreCase(request.getUsername()))) {
            throw new UserAlreadyExistsException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail()) || 
            pendingUsers.containsKey(request.getEmail().toLowerCase())) {
            throw new UserAlreadyExistsException("Email is already registered");
        }

        Role assignedRole = request.getEmail().toLowerCase().contains("admin") ? Role.ADMIN : Role.USER;

        String otp = String.format("%06d", new java.util.Random().nextInt(1000000));
        java.time.LocalDateTime expiry = java.time.LocalDateTime.now().plusMinutes(5);

        pendingUsers.put(request.getEmail().toLowerCase(), new PendingUser(
                request.getUsername(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                otp,
                expiry
        ));

        emailService.sendOtpEmail(request.getEmail(), request.getUsername(), otp);

        return UserResponse.builder()
                .id(null)
                .username(request.getUsername())
                .email(request.getEmail())
                .role(assignedRole)
                .verified(false)
                .createdAt(java.time.LocalDateTime.now())
                .updatedAt(java.time.LocalDateTime.now())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        if (pendingUsers.containsKey(request.getEmail().toLowerCase())) {
            throw new com.blogapp.exception.UserNotVerifiedException("Your account is not verified. Please verify your email first.");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (org.springframework.security.authentication.DisabledException e) {
            throw new com.blogapp.exception.UserNotVerifiedException("Your account is not verified. Please verify your email first.");
        } catch (org.springframework.security.core.AuthenticationException e) {
            throw new com.blogapp.exception.UnauthorizedException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String jwtToken = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(jwtToken)
                .user(userMapper.toResponse(user))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(User currentUser) {
        return userMapper.toResponse(currentUser);
    }

    @Override
    public UserResponse updateCurrentUser(UserUpdateRequest request, User currentUser) {
        if (!currentUser.getUsername().equals(request.getUsername()) && userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username is already taken");
        }
        if (!currentUser.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email is already registered");
        }

        currentUser.setUsername(request.getUsername());
        currentUser.setEmail(request.getEmail());

        User updatedUser = userRepository.save(currentUser);
        return userMapper.toResponse(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(userMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public long countAllUsers() {
        return userRepository.count();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> searchUsers(String keyword, Pageable pageable) {
        return userRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(keyword, keyword, pageable)
                .map(userMapper::toResponse);
    }

    @Override
    public AuthResponse verifyOtp(com.blogapp.dto.request.VerifyOtpRequest request) {
        String emailKey = request.getEmail().toLowerCase();
        PendingUser pending = pendingUsers.get(emailKey);

        if (pending == null) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Account is already verified");
            }
            throw new ResourceNotFoundException("No pending registration found for email: " + request.getEmail());
        }

        if (pending.getOtp() == null || !pending.getOtp().equals(request.getOtp())) {
            throw new IllegalArgumentException("Invalid OTP code");
        }

        if (pending.getOtpExpiryTime() == null || pending.getOtpExpiryTime().isBefore(java.time.LocalDateTime.now())) {
            throw new IllegalArgumentException("OTP code has expired. Please request a new one.");
        }

        Role assignedRole = pending.getEmail().toLowerCase().contains("admin") ? Role.ADMIN : Role.USER;
        User user = User.builder()
                .username(pending.getUsername())
                .email(pending.getEmail())
                .password(pending.getEncodedPassword())
                .role(assignedRole)
                .verified(true)
                .build();

        User savedUser = userRepository.save(user);
        pendingUsers.remove(emailKey);

        CustomUserDetails userDetails = new CustomUserDetails(savedUser);
        String jwtToken = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(jwtToken)
                .user(userMapper.toResponse(savedUser))
                .build();
    }

    @Override
    public void resendOtp(String email) {
        String emailKey = email.toLowerCase();
        PendingUser pending = pendingUsers.get(emailKey);

        if (pending == null) {
            if (userRepository.existsByEmail(email)) {
                throw new IllegalArgumentException("Account is already verified");
            }
            throw new ResourceNotFoundException("No pending registration found for email: " + email);
        }

        String otp = String.format("%06d", new java.util.Random().nextInt(1000000));
        java.time.LocalDateTime expiry = java.time.LocalDateTime.now().plusMinutes(5);

        pending.setOtp(otp);
        pending.setOtpExpiryTime(expiry);

        emailService.sendOtpEmail(pending.getEmail(), pending.getUsername(), otp);
    }

    @Override
    public void changePassword(com.blogapp.dto.request.ChangePasswordRequest request, User currentUser) {
        if (!passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPassword())) {
            throw new IllegalArgumentException("Current password does not match");
        }
        currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(currentUser);
    }

    @Override
    public void sendForgotPasswordOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        String otp = String.format("%06d", new java.util.Random().nextInt(1000000));
        java.time.LocalDateTime expiry = java.time.LocalDateTime.now().plusMinutes(5);

        user.setVerificationOtp(otp);
        user.setOtpExpiryTime(expiry);
        userRepository.save(user);

        emailService.sendResetPasswordOtpEmail(user.getEmail(), user.getUsername(), otp);
    }

    @Override
    public void verifyForgotPasswordOtp(VerifyOtpRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        if (user.getVerificationOtp() == null || !user.getVerificationOtp().equals(request.getOtp())) {
            throw new IllegalArgumentException("Invalid OTP code");
        }

        if (user.getOtpExpiryTime() == null || user.getOtpExpiryTime().isBefore(java.time.LocalDateTime.now())) {
            throw new IllegalArgumentException("OTP code has expired. Please request a new one.");
        }
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        if (user.getVerificationOtp() == null || !user.getVerificationOtp().equals(request.getOtp())) {
            throw new IllegalArgumentException("Invalid OTP code");
        }

        if (user.getOtpExpiryTime() == null || user.getOtpExpiryTime().isBefore(java.time.LocalDateTime.now())) {
            throw new IllegalArgumentException("OTP code has expired. Please request a new one.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setVerificationOtp(null);
        user.setOtpExpiryTime(null);
        userRepository.save(user);
    }
}
