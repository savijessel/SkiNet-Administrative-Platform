package ca.skipatrol.application.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.Setter;
import javax.persistence.*;
import java.util.UUID;

@Entity
@NamedEntityGraph(
        name = "graph.Vest.uniform",
        attributeNodes = @NamedAttributeNode("uniform")
)
public class Vest {

    @Id
    @GeneratedValue
    @Getter
    @Setter
    @Column(columnDefinition = "binary(16)")
    private UUID vestID;

    @Getter
    @Setter
    @Column(nullable = false, unique = true)
    private String number;

    @Getter
    @Setter
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn
    private Brand brand;

    @Getter
    @Setter
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn
    private Size size;

    @Getter
    @Setter
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn
    private Conditions condition;

    @Getter
    @Setter
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn
    private Uniform uniform;

    public Vest() {
    }

    public Vest(String number, Brand brand, Size size, Conditions condition, Uniform uniform) {
        this.number = number;
        this.brand = brand;
        this.size = size;
        this.condition = condition;
        this.uniform = uniform;
    }

    public Vest(UUID vestID, String number, Brand brand, Size size, Conditions condition, Uniform uniform) {
        this.vestID = vestID;
        this.number = number;
        this.brand = brand;
        this.size = size;
        this.condition = condition;
        this.uniform = uniform;
    }
}
