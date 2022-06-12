package ca.skipatrol.application.models;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.UUID;

@Entity
public class Brand {

    @Id
    @GeneratedValue
    @Getter
    @Setter
    @Column(columnDefinition = "binary(16)")
    private UUID brandID;

    @Getter
    @Setter
    @Column(unique = true, nullable = false)
    private String description;

    public Brand(){}

    public Brand(String description){
        this.description = description;
    }

}
