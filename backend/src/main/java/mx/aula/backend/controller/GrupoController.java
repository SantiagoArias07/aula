package mx.aula.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import mx.aula.backend.dto.grupo.GrupoDto;
import mx.aula.backend.dto.user.UserDto;
import mx.aula.backend.security.UserPrincipal;
import mx.aula.backend.service.GrupoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/grupos")
@RequiredArgsConstructor
@Tag(name = "Grupos")
public class GrupoController {

    private final GrupoService grupoService;

    @GetMapping
    @Operation(summary = "Mis grupos", description = "Docente: sus grupos. Alumno: sus inscripciones.")
    public ResponseEntity<List<GrupoDto>> listMyGrupos(@AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(grupoService.listGrupos(user.getId(), user.getRole()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Detalle de un grupo")
    public ResponseEntity<GrupoDto> getGrupo(
        @PathVariable UUID id,
        @AuthenticationPrincipal UserPrincipal user
    ) {
        return ResponseEntity.ok(grupoService.getGrupo(id, user.getId(), user.getRole()));
    }

    @GetMapping("/{id}/students")
    @Operation(summary = "Alumnos del grupo (solo docente)")
    public ResponseEntity<List<UserDto>> getStudents(
        @PathVariable UUID id,
        @AuthenticationPrincipal UserPrincipal user
    ) {
        return ResponseEntity.ok(grupoService.getStudentsInGrupo(id, user.getId()));
    }
}
