package ca.skipatrol.application.models;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

import static javax.persistence.EnumType.STRING;

@Entity
public class EventLog {

    @Id
    @GeneratedValue
    @Getter
    @Setter
    @Column(columnDefinition = "binary(16)")
    private UUID eventLogID;

    @Getter
    @Setter
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(nullable = false)
    private Event event;

    @Getter
    @Setter
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn
    private User user;

    @Getter
    @Setter
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn
    private Area area;

    @Getter
    @Setter
    @Column(nullable = false)
    @Enumerated(STRING)
    private EventRole role;

    @Getter
    @Setter
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn
    private User shadowing;

    @Getter
    @Setter
    @Enumerated(STRING)
    private EventAttendance attendance;

    @Getter
    @Setter
    @Column(nullable = false, columnDefinition = "timestamp default CURRENT_TIMESTAMP")
    private LocalDateTime timestampRostered;

    @Getter
    @Setter
    @Column(nullable = false, columnDefinition = "timestamp")
    private LocalDateTime timestampSubrequest;

    @Getter
    @Setter
    @Column(columnDefinition = "varchar(1000)")
    private String comment;

    @Getter
    @Setter
    @Column(columnDefinition = "varchar(255)")
    private String email;

    @Getter
    @Setter
    @Column(columnDefinition = "varchar(255)")
    private String name;

    @Getter
    @Setter
    @Column(columnDefinition = "varchar(255)")
    private String phoneNumber;

    @Getter
    @Setter
    @Column(nullable = false)
    private Boolean trainer;

    public EventLog(){}

    public EventLog(Event event,
                    User user,
                    Area area,
                    EventRole role,
                    User shadowing,
                    EventAttendance attendance,
                    LocalDateTime timestampRostered,
                    LocalDateTime timestampSubrequest,
                    String comment,
                    String email,
                    String name,
                    String phoneNumber,
                    Boolean trainer) {
        this.event = event;
        this.user = user;
        this.area = area;
        this.role = role;
        this.shadowing = shadowing;
        this.attendance = attendance;
        this.timestampRostered = timestampRostered;
        this.timestampSubrequest = timestampSubrequest;
        this.comment = comment;
        this.email = email;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.trainer = trainer;
    }

    public EventLog(UUID eventLogID,
                    EventRole role,
                    EventAttendance attendance,
                    LocalDateTime timestampRostered,
                    LocalDateTime timestampSubrequest,
                    String comment,
                    String email,
                    String name,
                    String phoneNumber,
                    Boolean trainer) {
        this.eventLogID = eventLogID;
        this.role = role;
        this.attendance = attendance;
        this.timestampRostered = timestampRostered;
        this.timestampSubrequest = timestampSubrequest;
        this.comment = comment;
        this.email = email;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.trainer = trainer;
    }

}
