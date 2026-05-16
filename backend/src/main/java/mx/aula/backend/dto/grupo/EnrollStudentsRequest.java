package mx.aula.backend.dto.grupo;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record EnrollStudentsRequest(
    @NotNull(message = "La lista de alumnos es requerida")
    @NotEmpty(message = "Debes incluir al menos un alumno")
    List<UUID> studentIds
) {}
