package ca.skipatrol.application.models;

import lombok.Getter;
import lombok.Setter;
import javax.persistence.*;
import java.util.UUID;

@Entity
public class Size {

    // Members
    @Id
    @GeneratedValue
    @Getter
    @Setter
    @Column(columnDefinition = "binary(16)")
    private UUID sizeID;

    @Getter
    @Setter
    @Column(nullable = false, unique = true, columnDefinition = "varchar(255)")
    private String description;

    @Getter
    @Setter
    @Column(nullable = false)
    private int sequence;


    // Constructors
    public Size() {
    }

    public Size(UUID sizeID, String description, int sequence) {
        this.sizeID = sizeID;
        this.description = description;
        this.sequence = sequence;
    }

    public Size(String description, int sequence) {
        this.description = description;
        this.sequence = sequence;
    }
}
