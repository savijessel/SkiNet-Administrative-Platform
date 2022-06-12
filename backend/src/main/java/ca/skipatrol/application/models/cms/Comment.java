package ca.skipatrol.application.models.cms;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
public class Comment {

    @Id
    @GeneratedValue
    @Getter
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @Setter
    private Post post;

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Comment )) return false;
        return id != null && id.equals(((Comment) o).getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

}
