package mx.aula.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mx.aula.backend.dto.assignment.AssignmentDto;
import mx.aula.backend.dto.assignment.CreateAssignmentRequest;
import mx.aula.backend.security.UserPrincipal;
import mx.aula.backend.service.AssignmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/grupos/{grupoId}/assignments")
@RequiredArgsConstructor
@Tag(name = "Tareas")
public class AssignmentController {

    private final AssignmentService assignmentService;

    @PostMapping
    @Operation(summary = "Crear tarea en un grupo (docente)")
    public ResponseEntity<AssignmentDto> create(
        @PathVariable UUID grupoId,
        @Valid @RequestBody CreateAssignmentRequest req,
        @AuthenticationPrincipal UserPrincipal user
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(assignmentService.create(grupoId, req, user.getId()));
    }

    @GetMapping
    @Operation(summary = "Tareas del grupo", description = "Docente: todas. Alumno: publicadas.")
    public ResponseEntity<List<AssignmentDto>> list(
        @PathVariable UUID grupoId,
        @AuthenticationPrincipal UserPrincipal user
    ) {
        return ResponseEntity.ok(assignmentService.listForGrupo(grupoId, user.getId(), user.getRole()));
    }

    @GetMapping("/{assignmentId}")
    @Operation(summary = "Detalle de una tarea")
    public ResponseEntity<AssignmentDto> getOne(
        @PathVariable UUID grupoId,
        @PathVariable UUID assignmentId,
        @AuthenticationPrincipal UserPrincipal user
    ) {
        return ResponseEntity.ok(assignmentService.getOne(assignmentId, user.getId(), user.getRole()));
    }

    @PutMapping("/{assignmentId}")
    @Operation(summary = "Actualizar tarea (docente)")
    public ResponseEntity<AssignmentDto> update(
        @PathVariable UUID grupoId,
        @PathVariable UUID assignmentId,
        @Valid @RequestBody CreateAssignmentRequest req,
        @AuthenticationPrincipal UserPrincipal user
    ) {
        return ResponseEntity.ok(assignmentService.update(assignmentId, req, user.getId()));
    }

    @DeleteMapping("/{assignmentId}")
    @Operation(summary = "Eliminar tarea (docente)")
    public ResponseEntity<Void> delete(
        @PathVariable UUID grupoId,
        @PathVariable UUID assignmentId,
        @AuthenticationPrincipal UserPrincipal user
    ) {
        assignmentService.delete(assignmentId, user.getId());
        return ResponseEntity.noContent().build();
    }
}
