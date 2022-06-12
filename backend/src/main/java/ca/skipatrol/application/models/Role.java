package ca.skipatrol.application.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.UUID;

@Entity
public class Role {

    @Id
    @GeneratedValue
    @Getter
    @Setter
    @Column(columnDefinition = "binary(16)")
    private UUID roleID;

    @Getter
    @Setter
    @Column(nullable = false)
    private Boolean cismTeamMember;

    @Getter
    @Setter
    @Column(nullable = false)
    private Boolean pl;

    @Getter
    @Setter
    @Column(nullable = false)
    private Boolean apl;

    @Getter
    @Setter
    @Column(nullable = false)
    private Boolean hl;

    @Getter
    @Setter
    @Column(nullable = false)
    private Boolean active;

    @Getter
    @Setter
    @Column(nullable = false)
    private Boolean newUser;

    @Getter
    @Setter
    @Column(nullable = false)
    private Boolean trainingEventLead;

    @Getter
    @Setter
    @Column(nullable = false)
    private Boolean onSnowEvaluator;

    @Getter
    @Setter
    @Column(nullable = false)
    private Boolean orienteerer;

    @Getter
    @Setter
    @Column(nullable = false)
    private Boolean recruitmentLead;

    @Getter
    @Setter
    @Column(nullable = false)
    private Boolean p0Lead;

    @Getter
    @Setter
    @JoinColumn(nullable = false)
    @JsonBackReference
    @OneToOne(fetch = FetchType.EAGER)
    private User user;

    public Role() {
    }

    public Role(Boolean cismTeamMember,
            Boolean pl,
            Boolean apl,
            Boolean hl,
            Boolean active,
            Boolean newUser,
            Boolean trainingEventLead,
            Boolean onSnowEvaluator,
            Boolean orienteerer,
            Boolean recruitmentLead,
            Boolean p0Lead,
            User user) {
        this.cismTeamMember = cismTeamMember;
        this.pl = pl;
        this.apl = apl;
        this.hl = hl;
        this.active = active;
        this.newUser = newUser;
        this.trainingEventLead = trainingEventLead;
        this.onSnowEvaluator = onSnowEvaluator;
        this.orienteerer = orienteerer;
        this.recruitmentLead = recruitmentLead;
        this.p0Lead = p0Lead;
        this.user = user;
    }

    public Role(UUID roleID,
            Boolean cismTeamMember,
            Boolean pl,
            Boolean apl,
            Boolean hl,
            Boolean active,
            Boolean newUser,
            Boolean trainingEventLead,
            Boolean onSnowEvaluator,
            Boolean orienteerer,
            Boolean recruitmentLead,
            Boolean p0Lead,
            User user) {
        this.roleID = roleID;
        this.cismTeamMember = cismTeamMember;
        this.pl = pl;
        this.apl = apl;
        this.hl = hl;
        this.active = active;
        this.newUser = newUser;
        this.trainingEventLead = trainingEventLead;
        this.onSnowEvaluator = onSnowEvaluator;
        this.orienteerer = orienteerer;
        this.recruitmentLead = recruitmentLead;
        this.p0Lead = p0Lead;
        this.user = user;
    }
}
