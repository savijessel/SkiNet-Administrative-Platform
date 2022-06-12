package ca.skipatrol.application.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

import java.util.List;
import java.util.UUID;

import static javax.persistence.EnumType.STRING;

@Entity
public class User {

    @Id
    @GeneratedValue
    @Getter
    @Column(columnDefinition = "binary(16)")
    private UUID userID;

    @Column(unique = true, nullable = false)
    @Getter
    private String username;

    @Getter
    @Setter
    private String password;

    @Getter
    @Setter
    private String firstName;

    @Getter
    @Setter
    private String lastName;

    @Getter
    @Setter
    private String email;

    @Getter
    @Setter
    private String phoneNumber;

    @Getter
    @Setter
    private Boolean trainer;

    @Getter
    @Setter
    private Boolean trainee;

    @Getter
    @Setter
    @JsonManagedReference
    @OneToOne(mappedBy = "user", fetch = FetchType.EAGER)
    private Role role;

    @Getter
    @Setter
    @Column(nullable = false)
    @Enumerated(STRING)
    private EventRole userType;

    // Training and Evaluation Section
    @Getter
    @Setter
    @JsonManagedReference
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<EvalTraining> evalTrainings;

    @Getter
    @Setter
    @JsonManagedReference
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<OperationalTraining> operationalTrainings;

    @Getter
    @Setter
    @JsonManagedReference
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<OnSnowEval> onSnowEvals;

    // Emergency Contacts Section
    @Getter
    @Setter
    @JsonManagedReference
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<EmergencyContact> emergencyContacts;

    // Patrol Commitments Section
    @Getter
    @Setter
    @JsonManagedReference
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<PatrolCommitment> patrolCommitments;

    //Person Awards Section
    @Getter
    @Setter
    @JsonManagedReference
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<PersonAward> personAwards;

    //Uniforms Section
    @Getter
    @Setter
    @JsonManagedReference
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Uniform> uniforms;


    // Constructors
    public User() {
    }

    public User(String username, String password, String firstName, String lastName, String email, String phoneNumber, EventRole userType, Boolean trainer, Boolean trainee) {
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.userType = userType;
        this.trainer = trainer;
        this.trainee = trainee;
    }

    public User(UUID userID, String username, String password, String firstName, String lastName, String email, String phoneNumber, EventRole userType, Boolean trainer, Boolean trainee) {
        this.userID = userID;
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.userType = userType;
        this.trainer = trainer;
        this.trainee = trainee;
    }

    public User(UUID userID,
                String username,
                String password,
                String firstName,
                String lastName,
                String email,
                String phoneNumber,
                Role role,
                EventRole userType,
                List<EvalTraining> evalTrainings,
                List<OperationalTraining> operationalTrainings,
                List<OnSnowEval> onSnowEvals,
                List<EmergencyContact> emergencyContacts,
                List<PatrolCommitment> patrolCommitments,
                List<PersonAward> personAwards,
                List<Uniform> uniforms,
                Boolean trainer,
                Boolean trainee) {
        this.userID = userID;
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.userType = userType;
        this.evalTrainings = evalTrainings;
        this.operationalTrainings = operationalTrainings;
        this.onSnowEvals = onSnowEvals;
        this.emergencyContacts = emergencyContacts;
        this.patrolCommitments = patrolCommitments;
        this.personAwards = personAwards;
        this.uniforms = uniforms;
        this.trainer = trainer;
        this.trainee = trainee;
    }
}