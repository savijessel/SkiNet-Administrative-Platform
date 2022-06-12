package ca.skipatrol.application.models.cms;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.Setter;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
public class Post {

    @Id
    @GeneratedValue
    @Getter
    private Long id;

    @Column(columnDefinition="TEXT")
    @Getter
    @Setter
    private String title;

    @Column(columnDefinition="TEXT")
    @Getter
    @Setter
    private String body;

    @Getter
    @Setter
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "topic_id", nullable = true)
    @JsonBackReference
    private Topic topic;

    @Column(insertable = false,
            updatable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    @Getter
    private LocalDateTime publishedDate;

    @Getter
    @Setter
    @OneToMany(mappedBy = "post", fetch = FetchType.EAGER)
    private List<Attachment> attachments;

}
