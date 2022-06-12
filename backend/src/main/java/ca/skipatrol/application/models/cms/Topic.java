package ca.skipatrol.application.models.cms;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
public class Topic {

    @Id
    @GeneratedValue
    @Getter
    @Setter
    @Column(columnDefinition = "binary(16)")
    private UUID id;

    @Getter
    @Setter
    @Column(unique = true, nullable = false)
    private Long sequence;

    @Getter
    @Setter
    @Column(unique = true, nullable = false)
    private String description;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "topic", cascade = CascadeType.ALL)
    @Getter
    @Setter
    @JsonManagedReference
    private Set<Post> post;

    Topic() {}

    public Topic(String description) { this.description = description; }

}
