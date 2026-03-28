package com.buildit.store.auth.application;

public record UserInfoResponse(
        String email,
        String role
) {
}
