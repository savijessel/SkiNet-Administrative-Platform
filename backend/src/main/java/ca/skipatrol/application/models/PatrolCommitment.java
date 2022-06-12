package ca.skipatrol.application.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.UUID;

@Entity
public class PatrolCommitment {

    @Id
    @GeneratedValue
    @Getter
    @Setter
    @Column(columnDefinition = "binary(16)")
    private UUID patrolCommitmentID;

    @Getter
    @Setter
    @Column(nullable = false)
    private Boolean achieved;

    @Getter
    @Setter
    @Column(nullable = false)
    private Integer days;

    @Getter
    @Setter
    private String notes;

    @Getter
    @Setter
    @JoinColumn(nullable = false)
    @ManyToOne(fetch = FetchType.EAGER)
    private Season season;

    @Getter
    @Setter
    @JsonBackReference
    @JoinColumn(nullable = false)
    @ManyToOne(fetch = FetchType.EAGER)
    private User user;

    public PatrolCommitment() {
    }

    public PatrolCommitment(Boolean achieved, Integer days, String notes, Season season, User user) {
        this.achieved = achieved;
        this.days = days;
        this.notes = notes;
        this.season = season;
        this.user = user;
    }

    public PatrolCommitment(UUID patrolCommitmentID, Boolean achieved, Integer days, String notes, Season season, User user) {
        this.patrolCommitmentID = patrolCommitmentID;
        this.achieved = achieved;
        this.days = days;
        this.notes = notes;
        this.season = season;
        this.user = user;
    }
}
