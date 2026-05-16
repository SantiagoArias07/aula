package mx.aula.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mx.aula.backend.dto.grupo.CreateGrupoRequest;
import mx.aula.backend.dto.grupo.EnrollStudentsRequest;
import mx.aula.backend.dto.grupo.GrupoDto;
import mx.aula.backend.dto.user.CreateUserRequest;
import mx.aula.backend.dto.user.UserDto;
import mx.aula.backend.entity.Role;
import mx.aula.backend.security.UserPrincipal;
import mx.aula.backend.service.GrupoService;
import mx.aula.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Administración")
public class AdminController {

    private final UserService userService;
    private final GrupoService grupoService;

    // ─── Users ───────────────────────────────────────────────────────

    @PostMapping("/users")
    @Operation(summary = "Crear usuario (docente o alumno)")
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody CreateUserRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(req));
    }

    @GetMapping("/users")
    @Operation(summary = "Listar usuarios", description = "Filtra por rol con ?role=TEACHER|STUDENT|ADMIN")
    public ResponseEntity<List<UserDto>> listUsers(
        @RequestParam(required = false) Role role
    ) {
        return ResponseEntity.ok(userService.listUsers(role));
    }

    @GetMapping("/users/{id}")
    @Operation(summary = "Obtener usuario por ID")
    public ResponseEntity<UserDto> getUser(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getUser(id));
    }

    @PatchMapping("/users/{id}/deactivate")
    @Operation(summary = "Desactivar cuenta de usuario")
    public ResponseEntity<UserDto> deactivateUser(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.updateActiveStatus(id, false));
    }

    @PatchMapping("/users/{id}/activate")
    @Operation(summary = "Reactivar cuenta de usuario")
    public ResponseEntity<UserDto> activateUser(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.updateActiveStatus(id, true));
    }

    // ─── Grupos ──────────────────────────────────────────────────────

    @PostMapping("/grupos")
    @Operation(summary = "Crear grupo")
    public ResponseEntity<GrupoDto> createGrupo(@Valid @RequestBody CreateGrupoRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(grupoService.createGrupo(req));
    }

    @GetMapping("/grupos")
    @Operation(summary = "Listar todos los grupos")
    public ResponseEntity<List<GrupoDto>> listGrupos() {
        return ResponseEntity.ok(grupoService.listAllGrupos());
    }

    @PostMapping("/grupos/{grupoId}/enroll")
    @Operation(summary = "Inscribir alumnos en un grupo")
    public ResponseEntity<Void> enrollStudents(
        @PathVariable UUID grupoId,
        @Valid @RequestBody EnrollStudentsRequest req,
        @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        grupoService.enrollStudents(grupoId, req.studentIds(), currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}
