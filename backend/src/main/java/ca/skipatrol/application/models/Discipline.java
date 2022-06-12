package ca.skipatrol.application.models;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

import java.util.UUID;


@Entity


public class Discipline {

    // Members
    @Id
    @GeneratedValue
    @Getter
    @Setter
    @Column(columnDefinition = "binary(16)")
    private UUID disciplineID;

    @Getter
    @Setter
    @Column(unique = true, nullable = false)
    private String description;

    // Constructors
    public Discipline() {
    }

    public Discipline(String description) {
        this.description = description;
    }

}