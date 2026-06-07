package com.blogapp.service.interfaces;

public interface EmailService {
    void sendOtpEmail(String toEmail, String username, String otp);
    void sendResetPasswordOtpEmail(String toEmail, String username, String otp);
}
