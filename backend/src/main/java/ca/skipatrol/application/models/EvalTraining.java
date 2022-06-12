package ca.skipatrol.application.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
public class EvalTraining {

    @Id
    @Getter
    @Setter
    @GeneratedValue
    @Column(columnDefinition = "binary(16)")
    private UUID evalTrainingID;

    @Getter
    @Setter
    @Column(nullable = false)
    private String eventType;

    @Getter
    @Setter
    @Column(nullable = false)
    private LocalDate completedDate;

    @Getter
    @Setter
    @JsonBackReference
    @JoinColumn(nullable = false)
    @ManyToOne(fetch = FetchType.EAGER)
    private User user;

    public EvalTraining() {
    }

    public EvalTraining(String eventType, LocalDate completedDate, User user) {
        this.eventType = eventType;
        this.completedDate = completedDate;
        this.user = user;
    }

    public EvalTraining(UUID evalTrainingID, String eventType, LocalDate completedDate, User user) {
        this.evalTrainingID = evalTrainingID;
        this.eventType = eventType;
        this.completedDate = completedDate;
        this.user = user;
    }
}
