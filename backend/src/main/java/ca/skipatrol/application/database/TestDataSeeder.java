package ca.skipatrol.application.database;

import ca.skipatrol.application.models.*;
import ca.skipatrol.application.models.cms.Post;
import ca.skipatrol.application.models.cms.Topic;
import ca.skipatrol.application.repositories.*;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.Calendar;
import java.util.Optional;
import java.util.function.Function;

@Component
public final class TestDataSeeder implements ApplicationListener<ApplicationReadyEvent> {

        @Autowired
        private UserRepository userRepository;
        @Autowired
        private EventRepository eventRepository;
        @Autowired
        private AreaRepository areaRepository;
        @Autowired
        private EventLogRepository eventLogRepository;
        @Autowired
        private RoleRepository roleRepository;
        @Autowired
        private EvalTrainingRepository evalTrainingRepository;
        @Autowired
        private OperationalTrainingRepository operationalTrainingRepository;
        @Autowired
        private EmergencyContactRepository emergencyContactRepository;
        @Autowired
        private PatrolCommitmentRepository patrolCommitmentRepository;
        @Autowired
        private PersonAwardRepository personAwardRepository;

        @Autowired
        OperationalEventRepository operationalEventRepository;
        @Autowired
        DisciplineRepository disciplineRepository;
        @Autowired
        BrandRepository brandRepository;
        @Autowired
        SizeRepository sizeRepository;
        @Autowired
        ConditionsRepository conditionsRepository;
        @Autowired
        SeasonRepository seasonRepository;
        @Autowired
        AwardRepository awardRepository;

        @Autowired
        VestRepository vestRepository;

        @Autowired
        JacketRepository jacketRepository;

        @Autowired
        PackRepository packRepository;
        @Autowired
        UniformRepository uniformRepository;

        @Autowired
        private OnSnowEvalRepository onSnowEvalRepository;
        @Autowired
        private PostRepository postRepository;
        @Autowired
        private TopicRepository topicRepository;

        private Optional<User> userLookup;
        private Optional<Area> areaLookup;

        @Override
        @Order(value = 2)
        public void onApplicationEvent(ApplicationReadyEvent event) {
                userLookup = this.userRepository.findByUsername("username");
                if (userLookup.isEmpty()) {
                        User user = new User("username",
                                        new BCryptPasswordEncoder().encode("password"),
                                        "Isaac",
                                        "Newton",
                                        "test@email.com",
                                        "000-000-0000",
                                        EventRole.SYSTEM_ADMIN, true, false);
                        this.userRepository.save(user);

                        user = userRepository.findByUsername("username").get();
                        userLookup = Optional.of(user);

                        Role role = new Role(false, false, false, false,
                                        false, false, false,
                                        false, true, true, false, user);
                        this.roleRepository.save(role);

                        OperationalEvent operationalEvent = operationalEventRepository
                                        .findByDescription("Lift Evacuation").get();
                        Season season = seasonRepository.findByDescription("2023 - 2024").get();
                        Award award = awardRepository.findByDescription("The Lake Louise Family Award").get();

                        evalTrainingRepository.save(new EvalTraining("testEventType", LocalDate.now(), user));
                        operationalTrainingRepository
                                        .save(new OperationalTraining(LocalDate.now(), operationalEvent, user));
                        emergencyContactRepository.save(new EmergencyContact("Father", "000-000-0000", "jerk", user));
                        patrolCommitmentRepository.save(new PatrolCommitment(false, 30, "testNote", season, user));
                        personAwardRepository.save(new PersonAward("testComment", award, season, user));

                        Uniform uniform = new Uniform(true, false, user);
                        uniformRepository.save(uniform);

                        Brand spyder = new Brand("tempBrand");
                        brandRepository.save(spyder);
                        Conditions condition = new Conditions("Mediocre");
                        conditionsRepository.save(condition);
                        Size size = new Size("small", 999);
                        sizeRepository.save(size);

                        jacketRepository.save(new Jacket("69", spyder, size, condition, uniform));
                        vestRepository.save(new Vest("420", spyder, size, condition, uniform));
                        packRepository.save(new Pack("666", spyder, condition, uniform));

                }

                Optional<User> userLookup2 = this.userRepository.findByUsername("AAAAA");
                if (userLookup2.isEmpty()) {
                        User user = new User("AAAAA",
                                        new BCryptPasswordEncoder().encode("password"),
                                        "Michael",
                                        "Scott",
                                        "testMichael@email.com",
                                        "000-000-0000",
                                        EventRole.SYSTEM_ADMIN, true, false);
                        this.userRepository.save(new User("AAAAA",
                                        new BCryptPasswordEncoder().encode("password"),
                                        "Michael",
                                        "Scott",
                                        "testMichael@email.com",
                                        "000-000-0000",
                                        EventRole.SYSTEM_ADMIN, true, false));
                        userLookup2 = Optional.of(user);

                        user = userRepository.findByUsername("AAAAA").get();
                        Role role = new Role(false, false, false, false,
                                        false, true, false,
                                        false, false, false, false, user);
                        this.roleRepository.save(role);
                        LocalDate date1 = LocalDate.of(2021, Month.JANUARY, 12);
                        Discipline testDiscipline = new Discipline("testDiscipline");
                        disciplineRepository.save(testDiscipline);
                        OnSnowEval onSnowEval = new OnSnowEval(date1, testDiscipline, "branden", user);
                        this.onSnowEvalRepository.save(onSnowEval);
                        Season season = seasonRepository.findByDescription("2023 - 2024").get();
                        Award award2 = awardRepository.findByDescription("Mallard Award").get();
                        personAwardRepository.save(new PersonAward("testComment", award2, season, user));

                        Uniform uniform = new Uniform(true, false, user);
                        uniformRepository.save(uniform);
                        emergencyContactRepository.save(new EmergencyContact("Father", "000-000-0000", "asdasda", user));

                }

                Optional<User> userLookup3 = this.userRepository.findByUsername("Really_Fast_Skier_324");
                if (userLookup3.isEmpty()) {
                        User user = new User("Really_Fast_Skier_324",
                                        new BCryptPasswordEncoder().encode("password"),
                                        "Steve",
                                        "Bob",
                                        "Really_Fast_Skier_324@email.com",
                                        "028-006-01914",
                                        EventRole.ROSTERED, false, false);
                        this.userRepository.save(user);

                        user = userRepository.findByUsername("Really_Fast_Skier_324").get();
                        userLookup = Optional.of(user);

                        Role role = new Role(true, false, false, false,
                                        false, true, false,
                                        false, true, true, false, user);
                        this.roleRepository.save(role);

                        OperationalEvent operationalEvent = operationalEventRepository
                                        .findByDescription("Lift Evacuation").get();
                        OperationalEvent operationalEvent1 = operationalEventRepository
                                        .findByDescription("STARS").get();
                        Season season = seasonRepository.findByDescription("2032 - 2033").get();
                        Award award = awardRepository.findByDescription("Silent Strike").get();

                        evalTrainingRepository.save(
                                        new EvalTraining("testEventType", LocalDate.of(1914, Month.JUNE, 28), user));
                        operationalTrainingRepository
                                        .save(new OperationalTraining(LocalDate.of(1914, Month.JUNE, 28),
                                                        operationalEvent, user));

                        operationalTrainingRepository
                                        .save(new OperationalTraining(LocalDate.of(1914, Month.JUNE, 28),
                                                        operationalEvent1, user));
                        emergencyContactRepository
                                        .save(new EmergencyContact("Spouse", "000-000-01900", "Sophie", user));
                        patrolCommitmentRepository.save(new PatrolCommitment(false, 30, "Fast", season, user));
                        personAwardRepository.save(new PersonAward("Really Fast", award, season, user));

                        Uniform uniform = new Uniform(true, true, user);
                        uniformRepository.save(uniform);

                        Brand spyder = new Brand("Fancy Skiing suit thing");
                        brandRepository.save(spyder);
                        Conditions condition = new Conditions("Glorious");

                        conditionsRepository.save(condition);
                        Size size = sizeRepository.findByDescription("M").get();

                        jacketRepository.save(new Jacket("2323", spyder, size, condition, uniform));
                        vestRepository.save(new Vest("2323", spyder, size, condition, uniform));
                        packRepository.save(new Pack("23232323", spyder, condition, uniform));

                }
                // NEW USER
                Optional<User> userLookup4 = this.userRepository.findByUsername("AppleOverlord241");
                if (userLookup4.isEmpty()) {
                        User user = new User("AppleOverlord241",
                                        new BCryptPasswordEncoder().encode("password"),
                                        "Tim",
                                        "Apple",
                                        "tim.apple@apple.com",
                                        "291-321-1252",
                                        EventRole.ROSTERED, true, false);
                        this.userRepository.save(user);

                        user = userRepository.findByUsername("AppleOverlord241").get();
                        userLookup = Optional.of(user);

                        Role role = new Role(true, true, true, true,
                                        false, false, false,
                                        false, false, false, false, user);
                        this.roleRepository.save(role);

                        LocalDate date1 = LocalDate.of(2011, Month.AUGUST, 1);
                        Discipline testDiscipline = new Discipline("Tech CEO");
                        disciplineRepository.save(testDiscipline);
                        OnSnowEval onSnowEval = new OnSnowEval(date1, testDiscipline, "Steve Jobs", user);
                        this.onSnowEvalRepository.save(onSnowEval);

                        OperationalEvent operationalEvent = operationalEventRepository
                                        .findByDescription("Scenario Training").get();
                        operationalTrainingRepository
                                        .save(new OperationalTraining(LocalDate.now(), operationalEvent, user));

                        OperationalEvent operationalEvent2 = operationalEventRepository
                                        .findByDescription("STARS").get();
                        operationalTrainingRepository
                                        .save(new OperationalTraining(LocalDate.now(), operationalEvent2, user));

                        Season season = seasonRepository.findByDescription("2025 - 2026").get();

                        Award award = awardRepository.findByDescription("\"Triangle\" Operational Proficiency Award")
                                        .get(); // Accomodation Award
                        personAwardRepository.save(new PersonAward("Test Comment", award, season, user));

                        Award award2 = awardRepository.findByDescription("Silent Strike").get();
                        Season season2 = seasonRepository.findByDescription("2032 - 2033").get();
                        personAwardRepository.save(new PersonAward("Another Test Comment", award2, season2, user));

                        evalTrainingRepository
                                        .save(new EvalTraining("sdssa", LocalDate.of(1914, Month.JUNE, 28), user));

                        emergencyContactRepository
                                        .save(new EmergencyContact("Mother", "403-603-2152", "Geraldine Cook", user));
                        patrolCommitmentRepository
                                        .save(new PatrolCommitment(true, 364,
                                                        "This man worked 364 days out of the year!!!!", season, user));
                        patrolCommitmentRepository.save(new PatrolCommitment(false, 30, "not Achieved", season2, user));
                        personAwardRepository.save(new PersonAward("testComment", award, season, user));

                        Uniform uniform = new Uniform(false, true, user);
                        uniformRepository.save(uniform);

                        Brand northFace = brandRepository.findByDescription("North Face").get();
                        Conditions condition = conditionsRepository.findByDescription("Poor").get();
                        Conditions condition2 = conditionsRepository.findByDescription("Average").get();
                        Brand spyder = brandRepository.findByDescription("North Face").get();

                        Size size = sizeRepository.findByDescription("L").get();

                        jacketRepository.save(new Jacket("12", northFace, size, condition, uniform));
                        vestRepository.save(new Vest("13", spyder, size, condition2, uniform));
                        packRepository.save(new Pack("166", spyder, condition, uniform));

                }

                // NEW USER
                Optional<User> userLookup5 = this.userRepository.findByUsername("HRisTheBest");
                if (userLookup5.isEmpty()) {
                        User user = new User("HRisTheBest",
                                        new BCryptPasswordEncoder().encode("password"),
                                        "Tobey",
                                        "Flenderson",
                                        "test_Tobey@email.com",
                                        "000-000-0000",
                                        EventRole.ROSTERED, true, false);
                        this.userRepository.save(user);

                        user = userRepository.findByUsername("HRisTheBest").get();
                        userLookup = Optional.of(user);

                        Role role = new Role(true, true, false, false,
                                        false, false, true,
                                        false, true, false, false, user);
                        this.roleRepository.save(role);

                        OperationalEvent operationalEvent = operationalEventRepository
                                        .findByDescription("STARS").get();
                        Season season = seasonRepository.findByDescription("2025 - 2026").get();
                        Award award = awardRepository.findByDescription("A over T").get();
                        Award award2 = awardRepository.findByDescription("Accomodation Award").get();

                        evalTrainingRepository.save(
                                        new EvalTraining("HR Training", LocalDate.of(2015, Month.APRIL, 12), user));
                        operationalTrainingRepository
                                        .save(new OperationalTraining(LocalDate.of(2017, Month.OCTOBER, 15),
                                                        operationalEvent, user));
                        emergencyContactRepository.save(new EmergencyContact("Father", "000-000-0000", "Creed", user));
                        patrolCommitmentRepository.save(new PatrolCommitment(true, 21, "testNote", season, user));
                        personAwardRepository.save(new PersonAward("YAY", award, season, user));
                        personAwardRepository.save(new PersonAward("YAY2", award2, season, user));

                        Uniform uniform = new Uniform(true, true, user);
                        uniformRepository.save(uniform);

                        Brand mouse = new Brand("ratatouille");
                        brandRepository.save(mouse);
                        Conditions condition = new Conditions("Decent");

                        conditionsRepository.save(condition);
                        Size size = new Size("Small-ish", 996);
                        sizeRepository.save(size);

                        jacketRepository.save(new Jacket("96", mouse, size, condition, uniform));
                        vestRepository.save(new Vest("240", mouse, size, condition, uniform));
                        packRepository.save(new Pack("999", mouse, condition, uniform));

                        LocalDate onSnowDate = LocalDate.of(2019, Month.DECEMBER, 24);
                        Discipline testDiscipline = new Discipline("HR");
                        disciplineRepository.save(testDiscipline);
                        OnSnowEval onSnowEval = new OnSnowEval(onSnowDate, testDiscipline, "Micheal Scott", user);
                        this.onSnowEvalRepository.save(onSnowEval);

                }

                Optional<Event> eventLookup = this.eventRepository.findByEventName("testEventName");
                if (eventLookup.isEmpty()) {
                        LocalDateTime startDate_1 = LocalDateTime.of(2021, Month.JANUARY, 1, 12, 0, 0);
                        LocalDateTime endDate_1 = LocalDateTime.of(2021, Month.JANUARY, 12, 12, 1);
                        Event test = new Event("testEventName", startDate_1, endDate_1, 1, 3, "yes", "yes", 1);
                        this.eventRepository.save(test);
                        eventLookup = Optional.of(test);
                }

                areaLookup = this.areaRepository.findByAreaname("Scantron");
                if (areaLookup.isEmpty()) {
                        Area testArea = new Area("Scantron");
                        this.areaRepository.save(testArea);
                        areaLookup = Optional.of(testArea);
                }

                userLookup = this.userRepository.findByUsername("username");
                eventLookup = this.eventRepository.findByEventName("testEventName");
                if (userLookup.isPresent() && eventLookup.isPresent()) {
                        LocalDateTime test_TimestampSubRequest = LocalDateTime.of(1970, 1, 1, 0, 0);
                        EventLog testEventLog = new EventLog(eventLookup.get(),
                                        userLookup.get(),
                                        null,
                                        EventRole.ROSTERED,
                                        null,
                                        null,
                                        LocalDateTime.now(),
                                        test_TimestampSubRequest,
                                        "testComment",
                                        "testEmail",
                                        null,
                                        "123-123-1234",
                                        false);
                        this.eventLogRepository.save(testEventLog);
                }

                seedTestEventData();

                seedTestPostData();
        }

        private void seedTestPostData() {
                {
                        String title = "Got Stuck? Try These Tips To Streamline Your SKI PATROL";
                        Optional<Post> testPost = this.postRepository.findByTitle(title);

                        Optional<Topic> weekendReportTopic = topicRepository.findByDescription("Weekend Reports");

                        if (testPost.isEmpty() && weekendReportTopic.isPresent()) {
                                Post newTestPost = new Post();
                                newTestPost.setTitle(title);
                                newTestPost.setBody(
                                                "According to all known laws of aviation, there is no way that a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyways. Because bees don't care what humans think is impossible.");
                                newTestPost.setTopic(weekendReportTopic.get());
                                this.postRepository.save(newTestPost);
                        }
                }

                {
                        String title = "Skiing Burnout Is Real. Here’s How to Avoid It";
                        Optional<Post> testPost = this.postRepository.findByTitle(title);

                        if (testPost.isEmpty()) {
                                Post newTestPost = new Post();
                                newTestPost.setTitle(title);
                                newTestPost.setBody("The Turks pay me a golden treasure. Yet, I am poor, \n" +
                                                " because I am a river to my people! Is \n" +
                                                " that service?" + "\n\n" +
                                                " There's nothing further here for a \n" +
                                                " warrior. We drive bargains. Old men's \n" +
                                                " work. Young men make wars and the virtues \n" +
                                                " of war are the virtues of young men; \n" +
                                                " courage and hope for the future. Then, \n" +
                                                " old men make the peace. And the vices of \n" +
                                                " peace are the vices of old men; mistrust \n" +
                                                " and caution. It must be so. What I owe \n" +
                                                " you is beyond evaluation. The power-\n" +
                                                " house, the telephone exchange - these I \n" +
                                                " concede; the pumping plant I must retain.");
                                this.postRepository.save(newTestPost);
                        }
                }

                int requiredTestPostCount = 20;
                for (long currentPostCount = this.postRepository
                                .count(); currentPostCount < requiredTestPostCount; currentPostCount++) {
                        int titleLength = 6;
                        int bodyLength = 20;
                        int defaultWordLength = 5;

                        Function<Integer, String> sentenceGenerator = (n) -> {
                                StringBuilder sb = new StringBuilder();
                                for (int i = 0; i < n; i++) {
                                        sb.append(RandomString.make(defaultWordLength));
                                        sb.append(" ");
                                }
                                return sb.toString();
                        };

                        Post newTestPost = new Post();
                        newTestPost.setTitle(sentenceGenerator.apply(titleLength));
                        newTestPost.setBody(sentenceGenerator.apply(bodyLength));
                        this.postRepository.save(newTestPost);
                }
        }

        void seedTestEventData() {
                int[] days = {
                                1, 3, 5, 11, 22, 23, 24, 27, 28
                };
                int currentMonth = Calendar.getInstance().get(Calendar.MONTH) + 1;
                for (int day : days) {
                        String testEventName = "testEventName" + day;
                        Optional<Event> eventLookup = this.eventRepository.findByEventName(testEventName);
                        if (eventLookup.isEmpty()) {
                                LocalDateTime startDate = LocalDateTime.of(2022, Month.of(currentMonth), day, 6, 0, 0);
                                LocalDateTime endDate = LocalDateTime.of(2022, Month.of(currentMonth), day, 12, 1);
                                Event test = new Event(testEventName, startDate, endDate, 1, 3, "yes", "yes", 1);
                                // TODO: Convert this to saveAll
                                this.eventRepository.save(test);
                                eventLookup = Optional.of(test);

                                if (userLookup.isPresent() && areaLookup.isPresent()) {
                                        LocalDateTime testTimestampRostered = LocalDateTime.of(2021, Month.JANUARY, 12, 12, 1);
                                        LocalDateTime testTimestampRequest = LocalDateTime.of(2021, Month.JANUARY, 12, 12, 1);
                                        EventLog testEventLog = new EventLog(eventLookup.get(),
                                                userLookup.get(),
                                                null,
                                                EventRole.ROSTERED,
                                                null,
                                                null,
                                                testTimestampRostered,
                                                testTimestampRequest,
                                                "testComment",
                                                "testEmail",
                                                null,
                                                "123-123-1234",
                                                false);
                                        this.eventLogRepository.save(testEventLog);
                                }
                        }
                }
        }

}