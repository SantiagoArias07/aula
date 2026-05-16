package mx.aula.backend.dto.grade;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record GradeRequest(
    @NotNull(message = "La calificación es requerida")
    @DecimalMin(value = "0", message = "La calificación no puede ser negativa")
    BigDecimal score,

    String feedback
) {}
