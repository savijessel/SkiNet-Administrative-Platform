package ca.skipatrol.application.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
public class OnSnowEval {

    @Id
    @GeneratedValue
    @Getter
    @Setter
    @Column(columnDefinition = "binary(16)")
    private UUID onSnowEvalID;

    @Getter
    @Setter
    @Column(nullable = false)
    private LocalDate evaluationDate;

    @Getter
    @Setter
    @JoinColumn(nullable = false)
    @ManyToOne(fetch = FetchType.EAGER)
    private Discipline discipline;

    @Getter
    @Setter
    private String evaluatedBy;

    @Getter
    @Setter
    @JsonBackReference
    @JoinColumn(nullable = false)
    @ManyToOne(fetch = FetchType.EAGER)
    private User user;

    public OnSnowEval() {
    }

    public OnSnowEval(LocalDate evaluationDate, Discipline discipline, String evaluatedBy, User user) {
        this.evaluationDate = evaluationDate;
        this.discipline = discipline;
        this.user = user;
        this.evaluatedBy = evaluatedBy;
    }

    public OnSnowEval(UUID onSnowEvalID, LocalDate evaluationDate, Discipline discipline, String evaluatedBy, User user) {
        this.onSnowEvalID = onSnowEvalID;
        this.evaluationDate = evaluationDate;
        this.discipline = discipline;
        this.user = user;
        this.evaluatedBy = evaluatedBy;
    }
}
