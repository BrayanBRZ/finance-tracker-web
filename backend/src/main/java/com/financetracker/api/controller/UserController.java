package com.financetracker.api.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.financetracker.api.Routes;
import com.financetracker.api.dto.common.MessageResponse;
import com.financetracker.api.dto.user.ChangePasswordRequest;
import com.financetracker.api.dto.user.UpdateUserRequest;
import com.financetracker.api.dto.user.UserResponse;
import com.financetracker.api.security.AuthenticatedUser;
import com.financetracker.api.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping(Routes.Users.BASE)
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Perfil")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping(Routes.Users.ME)
    @Operation(summary = "Retorna o perfil do usuario autenticado")
    UserResponse getMe(@AuthenticationPrincipal AuthenticatedUser user) {
        return userService.getMe(user.id());
    }

    @PutMapping(Routes.Users.ME)
    @Operation(summary = "Atualiza o perfil do usuario autenticado")
    UserResponse updateMe(
            @AuthenticationPrincipal AuthenticatedUser user,
            @Valid @RequestBody UpdateUserRequest request) {
        return userService.updateMe(user.id(), request);
    }

    @PatchMapping(Routes.Users.PASSWORD)
    @Operation(summary = "Altera a senha do usuario autenticado")
    MessageResponse changePassword(
            @AuthenticationPrincipal AuthenticatedUser user,
            @Valid @RequestBody ChangePasswordRequest request) {
        return userService.changePassword(user.id(), request);
    }
}
