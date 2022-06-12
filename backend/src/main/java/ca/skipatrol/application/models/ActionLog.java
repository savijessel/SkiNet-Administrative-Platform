package ca.skipatrol.application.models;

import lombok.Getter;
import lombok.Setter;
import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class ActionLog {
    //asdfasdfas

    @Id
    @GeneratedValue
    @Getter
    @Setter
    @Column(columnDefinition = "binary(16)")
    private UUID actionLogID;

    @Getter
    @Setter
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(nullable = false)
    private Event event;


    @Getter
    @Setter
    @Column(nullable = false)
    private String username;

    @Getter
    @Setter
    @Column(nullable = false)
    private String action_user;

    @Getter
    @Setter
    @Column(nullable = false)
    private String result;

    @Getter
    @Setter
    @Column(nullable = false)
    private LocalDateTime timeStamp_action;

    public ActionLog(){}

    public ActionLog(Event event, String username, String action_user, String result, LocalDateTime timeStamp_action){
        this.event = event;
        this.username = username;
        this.action_user = action_user;
        this.result = result;
        this.timeStamp_action = timeStamp_action;
    }



    /*
    event_id
    username
    action_user
    result
    timestamp_action
     */
}
