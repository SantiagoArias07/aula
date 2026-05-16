package mx.aula.backend.dto.auth;

import mx.aula.backend.dto.user.UserDto;

public record LoginResponse(String token, String type, UserDto user) {
    public LoginResponse(String token, UserDto user) {
        this(token, "Bearer", user);
    }
}
