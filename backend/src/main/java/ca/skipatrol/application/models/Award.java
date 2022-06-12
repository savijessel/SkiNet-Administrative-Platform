package ca.skipatrol.application.models;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.UUID;

@Entity
public class Award {

    @Id
    @GeneratedValue
    @Getter
    @Setter
    @Column(columnDefinition = "binary(16)")
    private UUID awardID;

    @Getter
    @Setter
    @Column(unique = true, nullable = false)
    private String description;

    public Award(){}

    public Award(String description){
        this.description = description;
    }

}
