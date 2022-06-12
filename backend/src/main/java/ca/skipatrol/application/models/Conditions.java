package ca.skipatrol.application.models;

import lombok.Getter;
import lombok.Setter;
import javax.persistence.*;
import java.util.UUID;

@Entity
public class Conditions {

    @Id
    @GeneratedValue
    @Getter
    @Setter
    @Column(columnDefinition = "binary(16)")
    private UUID conditionID;

    @Getter
    @Setter
    @Column(nullable = false)
    private String description;

    public Conditions() {
    }

    public Conditions(String description) {
        this.description = description;
    }

    public Conditions(UUID conditionID, String description) {
        this.conditionID = conditionID;
        this.description = description;
    }
}
