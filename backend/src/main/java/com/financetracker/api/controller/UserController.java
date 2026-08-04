package com.financetracker.api.controller;

import static com.financetracker.api.dto.AuthDtos.*;
import static com.financetracker.api.dto.UserDtos.*;

import com.financetracker.api.security.AuthenticatedUser;
import com.financetracker.api.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users/me")
@SecurityRequirement(name = "bearerAuth")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) { this.userService = userService; }

    @GetMapping
    UserResponse getMe(@AuthenticationPrincipal AuthenticatedUser user) {
        return userService.getMe(user.id());
    }

    @PutMapping
    UserResponse updateMe(
        @AuthenticationPrincipal AuthenticatedUser user,
        @Valid @RequestBody UpdateUserRequest request
    ) {
        return userService.updateMe(user.id(), request);
    }

    @PatchMapping("/password")
    MessageResponse changePassword(
        @AuthenticationPrincipal AuthenticatedUser user,
        @Valid @RequestBody ChangePasswordRequest request
    ) {
        return userService.changePassword(user.id(), request);
    }
}
