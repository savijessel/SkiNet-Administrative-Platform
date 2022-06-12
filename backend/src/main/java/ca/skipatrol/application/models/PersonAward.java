package ca.skipatrol.application.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.UUID;

@Entity
public class PersonAward {

    @Id
    @GeneratedValue
    @Getter
    @Setter
    @Column(columnDefinition = "binary(16)")
    private UUID personAwardID;

    @Getter
    @Setter
    private String comments;

    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(nullable = false)
    private Award award;

    @Getter
    @Setter
    @JoinColumn(nullable = false)
    @ManyToOne(fetch = FetchType.EAGER)
    private Season season;

    @Getter
    @Setter
    @JsonBackReference
    @JoinColumn(nullable = false)
    @ManyToOne(fetch = FetchType.EAGER)
    private User user;

    public PersonAward() {
    }

    public PersonAward(String comments, Award award, Season season, User user) {
        this.comments = comments;
        this.award = award;
        this.season = season;
        this.user = user;
    }

    public PersonAward(UUID personAwardID, String comments, Award award, Season season, User user) {
        this.personAwardID = personAwardID;
        this.comments = comments;
        this.award = award;
        this.season = season;
        this.user = user;
    }
}
