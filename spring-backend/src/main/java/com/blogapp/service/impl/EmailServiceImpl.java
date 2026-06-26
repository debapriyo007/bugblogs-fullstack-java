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

    @org.springframework.beans.factory.annotation.Value("${spring.mail.host:}")
    private String mailHost;

    @org.springframework.beans.factory.annotation.Value("${spring.mail.password:}")
    private String mailPassword;

    @org.springframework.beans.factory.annotation.Value("${brevo.api-key:${BREVO_API_KEY:}}")
    private String brevoApiKey;

    private String getBrevoApiKey() {
        if (brevoApiKey != null && !brevoApiKey.isBlank()) {
            return brevoApiKey;
        }
        if (mailPassword != null && mailPassword.startsWith("xkeysib-")) {
            return mailPassword;
        }
        return null;
    }

    private boolean shouldSendViaHttp() {
        return getBrevoApiKey() != null;
    }

    private boolean sendViaBrevoApi(String toEmail, String subject, String htmlContent) {
        try {
            String payload = String.format(
                "{\"sender\":{\"name\":\"bugblogs\",\"email\":\"%s\"},\"to\":[{\"email\":\"%s\"}],\"subject\":\"%s\",\"htmlContent\":\"%s\"}",
                fromEmail,
                toEmail,
                escapeJson(subject),
                escapeJson(htmlContent)
            );

            java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
            java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create("https://api.brevo.com/v3/smtp/email"))
                    .header("accept", "application/json")
                    .header("content-type", "application/json")
                    .header("api-key", getBrevoApiKey())
                    .POST(java.net.http.HttpRequest.BodyPublishers.ofString(payload, java.nio.charset.StandardCharsets.UTF_8))
                    .build();

            java.net.http.HttpResponse<String> response = client.send(request, java.net.http.HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                logger.info("Email successfully sent via Brevo HTTP API to: {}", toEmail);
                return true;
            } else {
                logger.error("Failed to send email via Brevo HTTP API. Status: {}, Response: {}", response.statusCode(), response.body());
                return false;
            }
        } catch (Exception e) {
            logger.error("Error occurred while sending email via Brevo HTTP API", e);
            return false;
        }
    }

    private String escapeJson(String input) {
        if (input == null) return "";
        return input.replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\b", "\\b")
                    .replace("\f", "\\f")
                    .replace("\n", "\\n")
                    .replace("\r", "\\r")
                    .replace("\t", "\\t");
    }

    @Override
    @org.springframework.scheduling.annotation.Async
    public void sendOtpEmail(String toEmail, String username, String otp) {
        String subject = "Verify Your bugblogs Account";
        String htmlContent = loadOtpTemplate(username, otp);

        boolean emailSent = false;

        if (shouldSendViaHttp()) {
            emailSent = sendViaBrevoApi(toEmail, subject, htmlContent);
        }

        if (!emailSent && mailSender != null) {
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
                if (mailPassword != null && mailPassword.startsWith("xsmtpsib-")) {
                    logger.warn("WARNING: You are using a Brevo SMTP key (xsmtpsib-...) on a restricted environment (like Railway) which blocks SMTP ports 25, 465, and 587. " +
                                "To fix this and send emails via HTTPS, please generate a Brevo REST API Key (starting with 'xkeysib-') " +
                                "and configure it in the BREVO_API_KEY environment variable.");
                }
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

        boolean emailSent = false;

        if (shouldSendViaHttp()) {
            emailSent = sendViaBrevoApi(toEmail, subject, htmlContent);
        }

        if (!emailSent && mailSender != null) {
            try {
                MimeMessage mimeMessage = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
                helper.setFrom(fromEmail, "bugblogs");
                helper.setTo(toEmail);
                helper.setSubject(subject);
                helper.setText(htmlContent, true);
                mailSender.send(mimeMessage);
                logger.info("Password reset OTP HTML email successfully dispatched to: {}", toEmail);
                emailSent = true;
            } catch (Exception e) {
                logger.warn("Could not dispatch password reset SMTP email: {}. Logging OTP directly.", e.getMessage());
                if (mailPassword != null && mailPassword.startsWith("xsmtpsib-")) {
                    logger.warn("WARNING: You are using a Brevo SMTP key (xsmtpsib-...) on a restricted environment (like Railway) which blocks SMTP ports 25, 465, and 587. " +
                                "To fix this and send emails via HTTPS, please generate a Brevo REST API Key (starting with 'xkeysib-') " +
                                "and configure it in the BREVO_API_KEY environment variable.");
                }
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
