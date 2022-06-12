package ca.skipatrol.application;

import ca.skipatrol.application.models.*;
import ca.skipatrol.application.models.cms.Attachment;
import ca.skipatrol.application.models.cms.Post;
import ca.skipatrol.application.models.cms.Topic;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class VisibleFieldConfiguration implements RepositoryRestConfigurer {

    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry corsRegistry) {
        config.exposeIdsFor(Brand.class);
        config.exposeIdsFor(Award.class);
        config.exposeIdsFor(Season.class);
        config.exposeIdsFor(Size.class);
        config.exposeIdsFor(User.class);
        config.exposeIdsFor(Discipline.class);
        config.exposeIdsFor(Post.class);
        config.exposeIdsFor(ActionLog.class);
        config.exposeIdsFor(Area.class);
        config.exposeIdsFor(Conditions.class);
        config.exposeIdsFor(EmergencyContact.class);
        config.exposeIdsFor(EvalTraining.class);
        config.exposeIdsFor(Event.class);
        config.exposeIdsFor(EventLog.class);
        config.exposeIdsFor(Jacket.class);
        config.exposeIdsFor(OnSnowEval.class);
        config.exposeIdsFor(OperationalEvent.class);
        config.exposeIdsFor(OperationalTraining.class);
        config.exposeIdsFor(Pack.class);
        config.exposeIdsFor(PatrolCommitment.class);
        config.exposeIdsFor(PersonAward.class);
        config.exposeIdsFor(Role.class);
        config.exposeIdsFor(Uniform.class);
        config.exposeIdsFor(Vest.class);
        config.exposeIdsFor(Attachment.class);
        config.exposeIdsFor(Topic.class);
    }

}