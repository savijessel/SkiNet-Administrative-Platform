package ca.skipatrol.application.models.cms;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.UUID;

@Entity
public class Attachment {

    @Id
    @GeneratedValue
    @Getter
    @Type(type="org.hibernate.type.UUIDCharType")
    @Column(name = "id", nullable = false)
    private UUID id;

    @Getter
    @Setter
    @JoinColumn(nullable = false)
    @ManyToOne(fetch = FetchType.EAGER)
    private Post post;

    @Getter
    @Setter
    private String originalFileName;

}
