package com.financetracker.api.service;

import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.util.HtmlUtils;
import org.springframework.web.util.UriComponentsBuilder;

import com.financetracker.api.entity.User;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class SendEmailService {
    private static final Logger LOGGER = LoggerFactory.getLogger(SendEmailService.class);

    private final JavaMailSender mailSender;
    private final ResourceLoader resourceLoader;
    private final String sender;
    private final String frontendBaseUrl;

    public SendEmailService(
            JavaMailSender mailSender,
            ResourceLoader resourceLoader,
            @Value("${spring.mail.username}") String sender,
            @Value("${app.frontend.base-url}") String frontendBaseUrl) {
        this.mailSender = mailSender;
        this.resourceLoader = resourceLoader;
        this.sender = sender;
        this.frontendBaseUrl = frontendBaseUrl;
    }

    public void sendWelcomeEmail(User user) {
        sendHtml(
                user.getEmail(),
                "Bem-vindo ao Finance Tracker",
                "welcome.html",
                Map.of("name", user.getName()));
    }

    public void sendPasswordResetEmail(User user, String token) {
        String resetUrl = UriComponentsBuilder.fromUriString(frontendBaseUrl)
                .path("/redefinir-senha/{token}")
                .buildAndExpand(token)
                .encode()
                .toUriString();

        sendHtml(
                user.getEmail(),
                "Redefinição de senha do Finance Tracker",
                "password-reset.html",
                Map.of("name", user.getName(), "resetUrl", resetUrl));
    }

    private void sendHtml(String recipient, String subject, String templateName, Map<String, String> variables) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, StandardCharsets.UTF_8.name());
            helper.setFrom(sender);
            helper.setTo(recipient);
            helper.setSubject(subject);
            helper.setText(render(templateName, variables), true);
            mailSender.send(message);
        } catch (MailException | MessagingException | IOException exception) {
            LOGGER.error("Falha ao enviar e-mail com o assunto '{}'", subject, exception);
        }
    }

    private String render(String templateName, Map<String, String> variables) throws IOException {
        Resource template = resourceLoader.getResource("classpath:templates/email/" + templateName);
        String content;
        try (InputStreamReader reader = new InputStreamReader(template.getInputStream(), StandardCharsets.UTF_8)) {
            content = FileCopyUtils.copyToString(reader);
        }

        for (Map.Entry<String, String> variable : variables.entrySet()) {
            content = content.replace(
                    "{{" + variable.getKey() + "}}",
                    HtmlUtils.htmlEscape(variable.getValue()));
        }

        return content;
    }
}
