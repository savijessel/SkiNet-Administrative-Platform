package ca.skipatrol.application.models;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

import java.util.UUID;


@Entity
public class Area {

    @Id
    @GeneratedValue
    @Getter
    @Setter
    @Column(columnDefinition = "binary(16)")
    private UUID areaID;

    @Getter
    @Setter
    @Column(unique = true, nullable = false)
    private String areaname;

    public Area() {
    }

    public Area(String areaname) {
        this.areaname = areaname;
    }



}