package mx.aula.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "grade_history")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradeHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grade_id", nullable = false)
    private Grade grade;

    @Column(name = "old_score", precision = 10, scale = 2)
    private BigDecimal oldScore;

    @Column(name = "new_score", nullable = false, precision = 10, scale = 2)
    private BigDecimal newScore;

    @Column(name = "old_feedback", columnDefinition = "TEXT")
    private String oldFeedback;

    @Column(name = "new_feedback", columnDefinition = "TEXT")
    private String newFeedback;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "changed_by", nullable = false)
    private User changedBy;

    @Column(name = "changed_at", nullable = false, updatable = false)
    @Builder.Default
    private OffsetDateTime changedAt = OffsetDateTime.now();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof GradeHistory h)) return false;
        return id != null && id.equals(h.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
