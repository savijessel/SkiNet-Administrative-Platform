package ca.skipatrol.application.models;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

import java.util.UUID;


@Entity


public class Season {

    // Members
    @Id
    @GeneratedValue
    @Getter
    @Setter
    @Column(columnDefinition = "binary(16)")
    private UUID seasonID;

    @Getter
    @Setter
    @Column(unique = true, nullable = false)
    private String description;

    @Getter
    @Setter
    @Column(nullable = false)
    private int sequence;

    // Constructors
    public Season() {
    }

    public Season(String description, int sequence) {
        this.description = description;
        this.sequence = sequence;
    }

}