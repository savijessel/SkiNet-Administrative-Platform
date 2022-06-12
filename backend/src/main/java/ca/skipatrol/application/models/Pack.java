package ca.skipatrol.application.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.UUID;

@Entity
public class Pack {

    @Id
    @Getter
    @Setter
    @GeneratedValue
    @Column(columnDefinition = "binary(16)")
    private UUID packID;

    @Getter
    @Setter
    @Column(nullable = false, unique = true)
    private String number;

    @Getter
    @Setter
    @ManyToOne(fetch = FetchType.EAGER)
    private Brand brand;

    @Getter
    @Setter
    @ManyToOne(fetch = FetchType.EAGER)
    private Conditions condition;

    @Getter
    @Setter
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    private Uniform uniform;

    public Pack() {
    }

    public Pack(String number, Brand brand, Conditions condition, Uniform uniform) {
        this.number = number;
        this.brand = brand;
        this.condition = condition;
        this.uniform = uniform;
    }

    public Pack(UUID packID, String number, Brand brand, Conditions condition, Uniform uniform) {
        this.packID = packID;
        this.number = number;
        this.brand = brand;
        this.condition = condition;
        this.uniform = uniform;
    }
}
