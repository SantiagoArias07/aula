package mx.aula.backend.dto.grupo;

import mx.aula.backend.dto.user.UserDto;
import mx.aula.backend.entity.Grupo;

import java.time.OffsetDateTime;
import java.util.UUID;

public record GrupoDto(
    UUID id,
    String name,
    String subject,
    String gradeLevel,
    String description,
    UserDto teacher,
    int studentCount,
    boolean active,
    OffsetDateTime createdAt
) {
    public static GrupoDto from(Grupo grupo, int studentCount) {
        return new GrupoDto(
            grupo.getId(),
            grupo.getName(),
            grupo.getSubject(),
            grupo.getGradeLevel(),
            grupo.getDescription(),
            UserDto.from(grupo.getTeacher()),
            studentCount,
            grupo.isActive(),
            grupo.getCreatedAt()
        );
    }
}
