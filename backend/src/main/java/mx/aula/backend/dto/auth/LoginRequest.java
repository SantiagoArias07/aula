package mx.aula.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
    @NotBlank(message = "El correo electrónico es requerido")
    @Email(message = "Ingresa un correo electrónico válido")
    String email,

    @NotBlank(message = "La contraseña es requerida")
    String password
) {}
