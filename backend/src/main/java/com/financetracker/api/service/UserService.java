package com.financetracker.api.service;

import com.financetracker.api.dto.common.MessageResponse;
import com.financetracker.api.dto.user.ChangePasswordRequest;
import com.financetracker.api.dto.user.UpdateUserRequest;
import com.financetracker.api.dto.user.UserResponse;
import com.financetracker.api.entity.User;
import com.financetracker.api.exception.ApiException;
import com.financetracker.api.mapper.UserMapper;
import com.financetracker.api.repository.UserRepository;
import com.financetracker.api.util.EmailNormalizer;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserAccessService userAccessService;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            UserAccessService userAccessService,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userAccessService = userAccessService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public UserResponse getMe(Long userId) {
        return UserMapper.toResponse(userAccessService.requireUser(userId));
    }

    @Transactional
    public UserResponse updateMe(Long userId, UpdateUserRequest request) {
        User user = userAccessService.requireUser(userId);
        String email = EmailNormalizer.normalize(request.email());
        if (userRepository.existsByEmailAndIdNot(email, userId)) {
            throw new ApiException(HttpStatus.CONFLICT, "Este e-mail já está cadastrado");
        }
        user.setName(request.name().trim());
        user.setEmail(email);
        return UserMapper.toResponse(user);
    }

    @Transactional
    public MessageResponse changePassword(Long userId, ChangePasswordRequest request) {
        User user = userAccessService.requireUser(userId);
        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new ApiException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "A senha atual está incorreta",
                    Map.of("currentPassword", "A senha atual está incorreta"));
        }
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        return new MessageResponse("Senha alterada com sucesso.");
    }
}
