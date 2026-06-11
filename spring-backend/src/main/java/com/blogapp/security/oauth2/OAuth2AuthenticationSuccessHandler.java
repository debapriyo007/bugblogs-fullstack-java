package com.blogapp.security.oauth2;

import com.blogapp.entity.User;
import com.blogapp.enums.Role;
import com.blogapp.repository.UserRepository;
import com.blogapp.security.jwt.JwtService;
import com.blogapp.security.service.CustomUserDetails;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public OAuth2AuthenticationSuccessHandler(
            JwtService jwtService,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        if (response.isCommitted()) {
            return;
        }

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        if (email == null) {
            throw new ServletException("Email not found from OAuth provider");
        }

        // 1. Load or register the user
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> registerNewOAuthUser(oAuth2User, email));

        // 2. Generate custom application JWT
        CustomUserDetails userDetails = new CustomUserDetails(user);
        String jwtToken = jwtService.generateToken(userDetails);

        // 3. Set jwt_token in HttpOnly cookie (matches AuthController logic)
        ResponseCookie cookie = ResponseCookie.from("jwt_token", jwtToken)
                .httpOnly(true)
                .secure(false) // Set to true in production over HTTPS
                .path("/")
                .maxAge(jwtService.getJwtExpirationInSeconds())
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // 4. Redirect to the React frontend OAuth2 success handler route
        String targetUrl = "http://localhost:5173/oauth2/redirect";
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    private User registerNewOAuthUser(OAuth2User oAuth2User, String email) {
        String name = oAuth2User.getAttribute("name");
        String username = email.split("@")[0];

        // Ensure username is unique in database
        if (userRepository.existsByUsername(username)) {
            username = username + "_" + UUID.randomUUID().toString().substring(0, 5);
        }

        User user = User.builder()
                .email(email)
                .username(username)
                .password(passwordEncoder.encode(UUID.randomUUID().toString())) // Safe random password
                .role(Role.USER)
                .verified(true)
                .build();

        return userRepository.save(user);
    }
}
