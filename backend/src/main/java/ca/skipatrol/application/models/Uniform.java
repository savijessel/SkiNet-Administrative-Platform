package ca.skipatrol.application.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;
import java.util.UUID;

@Entity
public class Uniform {

    @Id
    @GeneratedValue
    @Getter
    @Setter
    @Column(columnDefinition = "binary(16)")
    private UUID uniformID;

    @Getter
    @Setter
    @Column(nullable = false)
    private Boolean leaseSigned;

    @Getter
    @Setter
    @Column(nullable = false)
    private Boolean returned;

    @Getter
    @Setter
    @JoinColumn
    @JsonBackReference
    @ManyToOne(fetch = FetchType.EAGER)
    private User user;

    @Getter
    @Setter
    @JsonManagedReference
    @OneToMany(mappedBy = "uniform", fetch = FetchType.LAZY)
    private List<Vest> vests;

    @Getter
    @Setter
    @JsonManagedReference
    @OneToMany(mappedBy = "uniform", fetch = FetchType.LAZY)
    private List<Jacket> jackets;

    @Getter
    @Setter
    @JsonManagedReference
    @OneToMany(mappedBy = "uniform", fetch = FetchType.LAZY)
    private List<Pack> packs;

    public Uniform() {
    }

    public Uniform(Boolean leaseSigned, Boolean returned, User user) {
        this.leaseSigned = leaseSigned;
        this.returned = returned;
        this.user = user;
    }

    public Uniform(UUID uniformID, Boolean leaseSigned, Boolean returned, User user) {
        this.uniformID = uniformID;
        this.leaseSigned = leaseSigned;
        this.returned = returned;
        this.user = user;
    }

    public Uniform(UUID uniformID, Boolean leaseSigned, Boolean returned, User user, List<Vest> vests, List<Jacket> jackets, List<Pack> packs) {
        this.uniformID = uniformID;
        this.leaseSigned = leaseSigned;
        this.returned = returned;
        this.user = user;
        this.vests = vests;
        this.jackets = jackets;
        this.packs = packs;
    }
}
