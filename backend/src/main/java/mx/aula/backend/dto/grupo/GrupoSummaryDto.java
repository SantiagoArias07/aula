package mx.aula.backend.dto.grupo;

import mx.aula.backend.entity.Grupo;

import java.math.BigDecimal;
import java.util.UUID;

public record GrupoSummaryDto(
    UUID id,
    String name,
    String subject,
    String gradeLevel,
    String teacherName,
    int studentCount,
    BigDecimal averageScore
) {
    public static GrupoSummaryDto from(Grupo grupo, int studentCount, BigDecimal averageScore) {
        return new GrupoSummaryDto(
            grupo.getId(),
            grupo.getName(),
            grupo.getSubject(),
            grupo.getGradeLevel(),
            grupo.getTeacher().getFirstName() + " " + grupo.getTeacher().getLastName(),
            studentCount,
            averageScore
        );
    }
}
