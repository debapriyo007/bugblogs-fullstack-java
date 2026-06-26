package com.blogapp.service.impl;

import com.blogapp.service.interfaces.EmailService;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import java.nio.charset.StandardCharsets;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @org.springframework.beans.factory.annotation.Value("${spring.mail.from:${spring.mail.username:noreply@bugblogs.com}}")
    private String fromEmail;

    @Override
    @org.springframework.scheduling.annotation.Async
    public void sendOtpEmail(String toEmail, String username, String otp) {
        String subject = "Verify Your bugblogs Account";
        String htmlContent = loadOtpTemplate(username, otp);

        boolean emailSent = false;

        if (mailSender != null) {
            try {
                MimeMessage mimeMessage = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
                helper.setFrom(fromEmail, "bugblogs");
                helper.setTo(toEmail);
                helper.setSubject(subject);
                helper.setText(htmlContent, true);
                mailSender.send(mimeMessage);
                logger.info("Verification OTP HTML email successfully dispatched to: {}", toEmail);
                emailSent = true;
            } catch (Exception e) {
                logger.warn("Could not dispatch SMTP email: {}. Logging OTP directly.", e.getMessage());
            }
        }

        // Print the OTP in fallback console logs so user can easily sign in even if mail config fails
        logger.info("\n==================================================\n" +
                    "FALLBACK OTP CODE FOR {}:\n" +
                    "OTP: {}\n" +
                    "==================================================", toEmail, otp);
    }

    private String loadOtpTemplate(String username, String otp) {
        try {
            ClassPathResource resource = new ClassPathResource("mail-templates/otp-template.html");
            String template = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
            return template.replace("${username}", username).replace("${otp}", otp);
        } catch (Exception e) {
            logger.error("Failed to load email template, falling back to basic text", e);
            return "Hello " + username + ",\n\nTo verify your account, please enter the following OTP code: " + otp;
        }
    }

    @Override
    @org.springframework.scheduling.annotation.Async
    public void sendResetPasswordOtpEmail(String toEmail, String username, String otp) {
        String subject = "Reset Your Password";
        String htmlContent = loadResetPasswordTemplate(username, otp);

        if (mailSender != null) {
            try {
                MimeMessage mimeMessage = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
                helper.setFrom(fromEmail, "bugblogs");
                helper.setTo(toEmail);
                helper.setSubject(subject);
                helper.setText(htmlContent, true);
                mailSender.send(mimeMessage);
                logger.info("Password reset OTP HTML email successfully dispatched to: {}", toEmail);
            } catch (Exception e) {
                logger.warn("Could not dispatch password reset SMTP email: {}. Logging OTP directly.", e.getMessage());
            }
        }

        // Print the OTP in fallback console logs so user can reset password even if mail config fails
        logger.info("\n==================================================\n" +
                    "FALLBACK PASSWORD RESET OTP CODE FOR {}:\n" +
                    "OTP: {}\n" +
                    "==================================================", toEmail, otp);
    }

    private String loadResetPasswordTemplate(String username, String otp) {
        try {
            ClassPathResource resource = new ClassPathResource("mail-templates/reset-password-template.html");
            String template = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
            return template.replace("${username}", username).replace("${otp}", otp);
        } catch (Exception e) {
            logger.error("Failed to load reset password template, falling back to basic text", e);
            return "Hello " + username + ",\n\nWe received a request to reset your password. Use the following OTP code: " + otp;
        }
    }
}
