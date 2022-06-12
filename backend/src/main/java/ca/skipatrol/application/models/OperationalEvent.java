package ca.skipatrol.application.models;

import lombok.Getter;
import lombok.Setter;
import javax.persistence.*;
import java.util.UUID;

@Entity
public class OperationalEvent {

    @Id
    @GeneratedValue
    @Getter
    @Setter
    @Column(columnDefinition = "binary(16)")
    private UUID operationalEventID;

    @Getter
    @Setter
    @Column(nullable = false)
    private String description;

    public OperationalEvent() {}

    public OperationalEvent(UUID operationalEventID, String description) {
        this.operationalEventID = operationalEventID;
        this.description = description;
    }

    public OperationalEvent(String description) {
        this.description = description;
    }
}
