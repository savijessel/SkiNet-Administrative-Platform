


* * *

The Canadian Ski Patrol (CSP) Non-Profit organization currently uses spreadsheets and antiquated scheduling software to handle its logistics. In 2020-2021, a software capstone team developed a basic scheduling application to modernize CSP.

In the 2021-2022 academic year, team Ski-Tastic has enhanced and revamped this application. The expansions to this application include a thorough database model and report-generation page, allowing administrators to easily generate highly specified reports on their patrollers, and a communications page where posts can be created with attachments. The previous backend framework was neither powerful nor flexible enough to handle this new database and has been replaced with a Java-based framework. The new database, now seven times larger, provides admins with full flexibility by allowing them to modify entries, as opposed to the previous hard-coded model. Additionally, the scheduling feature has been rebuilt to meet the new standards. Thus, the new CSP solution is a thorough enhancement.

The new solution, CSP SkiNet, has been moved from the previous Heroku host to Amazon Web Services, taking advantage of its industry-leading services utilized by software solutions internationally. SkiNet is the complete solution that CSP requires to enter the modern era of cloud computing.

* * *

The Project.

![](https://engineeringdesignfair.ucalgary.ca/software/wp-content/uploads/sites/10/2022/04/Technologies-v2-1024x266.png)

> _Function over Form_

First and foremost, the working philosophy of our team in this project was ensuring that the project works and works well. All of the new, major features added to the website must work near-flawlessly before we start could on any kind of styling. Armed with this doctrine, each team member focused on features, bugs, and consistency. The web application will work as intended, and it will continue to work as intended after being deployed on AWS (Amazon Web Services) long after we have delivered the project.

After ensuring the application was completed functionally, the team styled the website according to CSP’s branding.

This application was written with the full intention of being deployed to a live, AWS instance at project completion. Because of this, the team employed a pseudo-CI/CD (Continuous Integration/Continuous Development) development process with our sponsors at CSP towards the end of the project lifetime. A preliminary, free-tier AWS instance was set up in order to achieve this testing goal. The CSP contacts could actively test the website as it was being developed – changes that were pushed to the instance could be immediately accessed by CSP, and they could recommend feature changes where necessary. Development and testing were made concurrent.

The testing instance additionally served as a stepping block for the deployment of the final production application by using Amazon services. Ski-tastic ensured that there would be little-to-no issues or surprises with transitioning the website to its final EC2 t3.small server.

> De_ployment in Mind_

> _Practical Test Portfolio_

Ski-tastic’s testing portfolio was diverse and continuous:

1.  Server-side unit-testing
2.  Server-side load-testing using Locust
3.  Frontend unit-testing using Selenium
4.  Frontend client testing

The two server-side test groups ensure that the server functions and functions under large loads. Locust was utilized to simulate hundreds of server calls to the point of crashing the server, just to give us a good point of reference for the capabilities of the AWS instance.

For the frontend, basic unit tests were created using Selenium. This is standard practice in industry to ensure that basic functionality of the website worked. However, the team recognized the human element of web use. CSP had direct access to the testing instance and could propose changes to the website to fit their personal needs.

The ExpressJS server framework used by the 2020-2021 capstone team worked for the scheduling system previously developed. However, with the expansion of the database from 4 to 27 tables, ExpressJS did not have the flexibility and maintainability required to manage this growth. Additionally, the database was made fully relational, with tables linked to each other to fully represent a patroller.

Following our doctrine of function over form, the team chose a popular Java-based framework Spring Boot.

> _Complete Backend Rebuild_

New Features.

* * *

![](https://engineeringdesignfair.ucalgary.ca/software/wp-content/uploads/sites/10/2022/04/SkiNet-Architecture-1-1024x659.png)

Volunteer Profile
-----------------

* * *

The core of the 2021-2022 iteration of this project is the volunteer profile database. The volunteers in CSP had their data represented in several large excel files. As this is a massive burden administrative burden to manage, Ski-tastic! has developed a large, relational database that represents the patrollers. The change from an ExpressJS framework to the Spring Boot framework was to facilitate the expansion in database tables from 4 to 27. Additionally, the tables are foreign-keyed to each other, restricting the ability to input bad data, something that was not present in the original database.

![](https://engineeringdesignfair.ucalgary.ca/software/wp-content/uploads/sites/10/2022/04/Actual-Dan-CSP-EER-diagram-including-past-tables.drawio-1024x889.png)

The pages associated with the volunteer profile were designed and developed to be simple to use, yet powerful. It was built to be intuitive and easy to understand. Each field has a dedicated section and modal for creation, editing, and deletion.

However, the power of the design, both backend and frontend, lies in its flexibility. Administrators have full control over the profile of each volunteer. The options in which administrators can set for a profile item can be expanded at will. This prevents the need to manually rewrite the code and add more hard-wired values. The tables were designed to be expandable.

Scheduling System Revamp
------------------------

* * *

The other major change to the roster system was to the scheduling system built in the 2020-2021 capstone cycle by a previous team. It was rebuilt for the Spring Boot backend: API was translated to Java from Javascript, The database tables were rewired to have foreign-key relationships, buttons were made to be far more user-friendly, and branding was made consistent with CSP.

![](http://engineeringdesignfair.ucalgary.ca/software/wp-content/uploads/sites/10/2022/04/Roster-Comparison-6.png)

News and Information
--------------------

* * *

The news and information page is the other major feature addition to the website. Its purpose is to replace the physical and pdf copies of manuals and reports that CSP uses. It also has a very simple design. However, it has the basic text editing tools for bold, italicize, underline, listing, etc. where needed in each post. Additionally, the attachments feature uses Amazon S3, a blob storage service used to store large items.

![](https://engineeringdesignfair.ucalgary.ca/software/wp-content/uploads/sites/10/2022/04/Information-Page-Diagram-1.png)

* * *

Partners and Mentors.

* * *

![](http://engineeringdesignfair.ucalgary.ca/software/wp-content/uploads/sites/10/2022/03/HB_Software_UofCLogo-1.png)

![](https://engineeringdesignfair.ucalgary.ca/software/wp-content/uploads/sites/10/2022/03/CSP_Logo_Text_right_of_logo-1024x360.jpg)

_Teaching Assistant_ – **Tariq Al Shoura**

_Academic Advisor_ – **Professor Behrouz Far**

_Sponsor Contact_ – **Marielle Flottat**

_Spnsor Contact_ – **Riley Barry**

The Team.
---------

![](http://engineeringdesignfair.ucalgary.ca/software/wp-content/uploads/sites/10/2022/03/Ski-tastic-Logo-1024x497.png)

![](http://engineeringdesignfair.ucalgary.ca/software/wp-content/uploads/sites/10/2022/04/Salah-Image-1024x1024.jpg)

*   [LinkedIn](https://www.linkedin.com/in/salahsheikh/)

Salah Sheikh
------------

Salah Sheikh is graduating in Electrical Engineering with a minor in Computer Engineering. Salah completed software engineering internships at Synopsys, AMD, and Apple, respectively during his undergraduate journey. During his time there, Salah developed software development skills in a variety of areas such as web development and embedded firmware development.

Branden Wong
------------

Branden Wong is graduating in Electrical Engineering with a minor in Computer Engineering. Branden has completed internships at TC Energy, working as a Project Engineering Intern, and a research studentship under Dr. Bruce Pike, focusing on development of a MRI data analysis application in C++.

*   [LinkedIn](https://www.linkedin.com/in/branden-wong-a7b1a3155/)

![](http://engineeringdesignfair.ucalgary.ca/software/wp-content/uploads/sites/10/2022/04/IMG_2095-1024x1024.png)

![](https://engineeringdesignfair.ucalgary.ca/software/wp-content/uploads/sites/10/2022/03/savi_wordpress-1024x1024.jpg)

*   [LinkedIn](https://www.linkedin.com/in/savi-jessel/)

Savi Jessel
-----------

Savi Jessel is graduating in Electrical Engineering with a minor in Computer Engineering. Savi has interned at AltaLink for just under 3 years, where he gained experience in the telecommunications, substations, and transmission lines disciplines. Through this project and various other pursuits, Savi looks forward to becoming a capable software developer.

Mohtashim Khan
--------------

Mohtashim Khan is graduating in Electrical Engineering with a minor in Computer Engineering. Mohtashim has completed a formal internship at Suncor Energy where he worked as an E&I Reliability Engineering Co-op student. After self learning various web frameworks, Mohtashim hopes he can refine his skills through his participation in this capstone.

*   [LinkedIn](https://www.linkedin.com/in/motokhan/)

![](https://engineeringdesignfair.ucalgary.ca/software/wp-content/uploads/sites/10/2022/03/275196062_1302080896958021_2311289727811960615_n-1-1024x1024.jpg)

![](https://engineeringdesignfair.ucalgary.ca/software/wp-content/uploads/sites/10/2022/03/IMG_1260-1-1024x1024.jpg)

*   [LinkedIn](http://www.linkedin.com/in/dan-g-tran)

Dan Tran
--------

Dan Tran is graduating in Electrical Engineering. He has completed an internship at PCL Construction as a software developer student, gaining in WEB and Mobile development using Microsoft’s .NET framework. Dan hopes to continue expanding his engineering portfolio and gain even more skills in the massive field of Electrical Engineering.

Our Photo Gallery.

![](https://engineeringdesignfair.ucalgary.ca/software/wp-content/uploads/sites/10/2022/04/Comparison-of-Actual-Dan-CSP-EER-diagram-including-past-tables.drawio-1-1024x656.png)

![](https://engineeringdesignfair.ucalgary.ca/software/wp-content/uploads/sites/10/2022/04/Reports-Page-1024x575.png)

![](https://engineeringdesignfair.ucalgary.ca/software/wp-content/uploads/sites/10/2022/04/Topics-Page-1024x576.png)

![](https://engineeringdesignfair.ucalgary.ca/software/wp-content/uploads/sites/10/2022/04/Whole-Scheduling-Page-1-1024x576.png)

![](https://engineeringdesignfair.ucalgary.ca/software/wp-content/uploads/sites/10/2022/04/Backend-Comparison.drawio-1024x625.png)

![](https://engineeringdesignfair.ucalgary.ca/software/wp-content/uploads/sites/10/2022/04/Whole-Profile-Page-1-880x1024.png)

![](https://engineeringdesignfair.ucalgary.ca/software/wp-content/uploads/sites/10/2022/04/Create-Post-1-1024x456.png)

![](https://engineeringdesignfair.ucalgary.ca/software/wp-content/uploads/sites/10/2022/04/User-List-Page-1-1024x405.png)

[](https://www.addtoany.com/add_to/facebook?linkurl=https%3A%2F%2Fengineeringdesignfair.ucalgary.ca%2Fsoftware%2Fskinet%2F&linkname= "Facebook")[](https://www.addtoany.com/add_to/twitter?linkurl=https%3A%2F%2Fengineeringdesignfair.ucalgary.ca%2Fsoftware%2Fskinet%2F&linkname= "Twitter")[](https://www.addtoany.com/add_to/email?linkurl=https%3A%2F%2Fengineeringdesignfair.ucalgary.ca%2Fsoftware%2Fskinet%2F&linkname= "Email")[](https://www.addtoany.com/share)


