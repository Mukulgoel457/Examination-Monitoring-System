CREATE TABLE users (
    
    name VARCHAR(255) NOT NULL primary key,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Student', 'Admin') NOT NULL
);

CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    FOREIGN KEY (name) REFERENCES users(name)
);

create table admin(
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    FOREIGN KEY (name) REFERENCES users(name)
);

create table exams(
    exam_id varchar(10) primary key,
    subject varchar(255) not null,
    exam_date date not null,
    total_marks int not null,
    fees decimal(10,2) not null,
    number_of_questions int not null,
    exam_duration Time(6) not null
);

CREATE TABLE student_exams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    exam_id VARCHAR(255) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (exam_id) REFERENCES exams(exam_id)
);


CREATE TABLE questions (
    qid INT AUTO_INCREMENT PRIMARY KEY,
    exam_id varchar NOT NULL,
    qcontent TEXT NOT NULL,
    qoptions TEXT NOT NULL,
    correct_option_id INT NOT NULL,
    difficulty_level INT NOT NULL,
    FOREIGN KEY (exam_id) REFERENCES exams(exam_id)
);

CREATE TABLE exam_scores (
    exam_id VARCHAR(255) NOT NULL,
    student_id INT NOT NULL,
    score DECIMAL(5, 2) NOT NULL,
    PRIMARY KEY (exam_id, student_id),
    FOREIGN KEY (exam_id) REFERENCES exams(exam_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);


CREATE TABLE exam_responses (
    response_id INT AUTO_INCREMENT PRIMARY KEY,
    exam_id varchar(10) NOT NULL,
    student_id INT NOT NULL,
    question_id INT NOT NULL,
    selected_option INT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_taken float NOT NULL,
    FOREIGN KEY (exam_id) REFERENCES exams(exam_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (question_id) REFERENCES questions(qid)
);

INSERT INTO exams (exam_id, subject, exam_date, total_marks, fees, number_of_questions, exam_duration) VALUES
('DA214', 'Database Management System', '2024-03-24', 10, 70.00, 10, '01:00:00'),
('DA244', 'Statistics and Probability', '2024-03-26', 10, 100.00, 10, '01:30:00'),
('MA201', 'Mathematics', '2024-03-25', 10, 50.00, 10, '02:00:00');


INSERT INTO questions (exam_id, qcontent, qoptions, correct_option_id, difficulty_level) VALUES
('MA201', 'What is the derivative of x^2?', '[{"id":1,"text":"2x"}, {"id":2,"text":"x"}, {"id":3,"text":"2x^2"}, {"id":4,"text":"x^2"}]', 1, 3),
('MA201', 'If the matrix A = [[1, 2], [3, 4]], what is det(A)?', '[{"id":1,"text":"0"}, {"id":2,"text":"-2"}, {"id":3,"text":"2"}, {"id":4,"text":"-1"}]', 2, 2),
('MA201', 'What is the integral of 2x dx?', '[{"id":1,"text":"x^2 + C"}, {"id":2,"text":"2x^2 + C"}, {"id":3,"text":"x^2/2 + C"}, {"id":4,"text":"2x + C"}]', 1, 3),
('MA201', 'Solve for x: 2x + 3 = 7', '[{"id":1,"text":"2"}, {"id":2,"text":"4"}, {"id":3,"text":"1"}, {"id":4,"text":"3"}]', 1, 1),
('MA201', 'What is the value of Pi (π) to two decimal places?', '[{"id":1,"text":"3.14"}, {"id":2,"text":"3.15"}, {"id":3,"text":"3.16"}, {"id":4,"text":"3.13"}]', 1, 1);


INSERT INTO questions (exam_id, qcontent, qoptions, correct_option_id, difficulty_level) VALUES
('MA201', 'If the integral of a function f(x) is F(x) + C, what is F(x) for f(x) = 3x^2?', '[{"id":1,"text":"x^3"},{"id":2,"text":"x^2 + C"},{"id":3,"text":"x^3 + C"},{"id":4,"text":"3x^3 + C"}]', 3, 4),
('MA201', 'What is the square root of 144?', '[{"id":1,"text":"12"},{"id":2,"text":"14"},{"id":3,"text":"16"},{"id":4,"text":"18"}]', 1, 2),
('MA201', 'How many sides does a hexagon have?', '[{"id":1,"text":"5"},{"id":2,"text":"6"},{"id":3,"text":"7"},{"id":4,"text":"8"}]', 2, 1),
('MA201', 'What is the sum of the interior angles of a triangle?', '[{"id":1,"text":"180 degrees"},{"id":2,"text":"360 degrees"},{"id":3,"text":"90 degrees"},{"id":4,"text":"270 degrees"}]', 1, 2),
('MA201', 'What is the area of a circle with radius r?', '[{"id":1,"text":"pi*r^2"},{"id":2,"text":"2*pi*r"},{"id":3,"text":"pi*r"},{"id":4,"text":"2*r^2"}]', 1, 3),
('MA201', 'What is the formula for the Pythagorean theorem?', '[{"id":1,"text":"a^2 + b^2 = c^2"},{"id":2,"text":"a^2 - b^2 = c^2"},{"id":3,"text":"a^2 * b^2 = c^2"},{"id":4,"text":"a / b = c^2"}]', 1, 4),
('MA201', 'How do you calculate the slope of a line?', '[{"id":1,"text":"(y2-y1)/(x2-x1)"},{"id":2,"text":"(y2+y1)/(x2+x1)"},{"id":3,"text":"(x2-x1)/(y2-y1)"},{"id":4,"text":"(x2+x1)/(y2+y1)"}]', 1, 5),
('MA201', 'What is the solution to the equation 2x - 4 = 10?', '[{"id":1,"text":"x = 7"},{"id":2,"text":"x = 5"},{"id":3,"text":"x = -7"},{"id":4,"text":"x = -5"}]', 2, 1);

insert into questions (exam_id,qcontent,qoptions,correct_option_id,difficulty_level) values
('MA201', 'What is the derivative of \( \sin(x) \)?', '[{"id":1,"text":"\cos(x)"},{"id":2,"text":"-\sin(x)"},{"id":3,"text":"-\cos(x)"},{"id":4,"text":"\sin(x)"}]', 1, 3),
('MA201', 'Solve the equation \( x^2 - 4 = 0 \)', '[{"id":1,"text":"x = 2"},{"id":2,"text":"x = -2"},{"id":3,"text":"x = ±2"},{"id":4,"text":"No solution"}]', 3, 4),
('MA201', 'What is the limit of \( \frac{1}{x} \) as x approaches infinity?', '[{"id":1,"text":"0"},{"id":2,"text":"1"},{"id":3,"text":"Infinity"},{"id":4,"text":"-1"}]', 1, 3),
('MA201', 'What is the common ratio in the geometric sequence 2, 6, 18, 54?', '[{"id":1,"text":"3"},{"id":2,"text":"2"},{"id":3,"text":"9"},{"id":4,"text":"6"}]', 1, 2),
('MA201', 'Calculate the derivative of \( e^{2x} \)', '[{"id":1,"text":"2e^{2x}"},{"id":2,"text":"e^{2x}"},{"id":3,"text":"2x e^{2x}"},{"id":4,"text":"4e^{2x}"}]',1,5),
('MA201', 'What is the solution to the equation \( x^3 - 6x^2 + 12x - 8 = 0 \)', '[{"id":1,"text":"x = 7"},{"id":2,"text":"x = 2"},{"id":3,"text":"x = -7"},{"id":4,"text":"x = -5"}]', 2, 5),
('MA201', 'What is the convergence radius of the power series sum(n=0 to infinity) x^n/n! ?', '[{"id":1,"text":"Infinity"},{"id":2,"text":"1"},{"id":3,"text":"0"},{"id":4,"text":"-1"}]', 1, 5),
('MA201', 'What is the value of the determinant of matrix [[1, 2], [3, 4]]?', '[{"id":1,"text":"-2"},{"id":2,"text":"2"},{"id":3,"text":"0"},{"id":4,"text":"10"}]', 1, 4),
('MA201', 'What is the solution to the differential equation dy/dx = 3y?', '[{"id":1,"text":"y=Ce^(3x)"},{"id":2,"text":"y=3xe^(x)"},{"id":3,"text":"y=3e^(x)"},{"id":4,"text":"y=3x+C"}]', 1, 4),
('MA201', 'If the matrix A is 2x2 with a determinant of 5, what is the determinant of 3A?', '[{"id":1,"text":"45"},{"id":2,"text":"15"},{"id":3,"text":"5"},{"id":4,"text":"3"}]', 2, 3);

INSERT INTO questions (exam_id, qcontent, qoptions, correct_option_id, difficulty_level) VALUES
('DA214', 'What does DBMS stand for?', '[{"id":1,"text":"Database Management System"},{"id":2,"text":"Database Maintaining System"},{"id":3,"text":"Data Management System"},{"id":4,"text":"Data Maintaining System"}]', 1, 1),
('DA214', 'Which language is used by most DBMSs for database access?', '[{"id":1,"text":"C++"},{"id":2,"text":"Java"},{"id":3,"text":"Structured Query Language"},{"id":4,"text":"Python"}]', 3, 1),
('DA214', 'What is the purpose of a database schema?', '[{"id":1,"text":"To store data in a structured format"},{"id":2,"text":"To define the structure of the database"},{"id":3,"text":"To query the database"},{"id":4,"text":"To manage database connections"}]', 2, 2),
('DA214', 'Which of the following is not a type of database model?', '[{"id":1,"text":"Relational model"},{"id":2,"text":"Hierarchical model"},{"id":3,"text":"Network model"},{"id":4,"text":"Linear model"}]', 4, 2),
('DA214', 'What is the purpose of a database index?', '[{"id":1,"text":"To store data in a structured format"},{"id":2,"text":"To define the structure of the database"},{"id":3,"text":"To query the database"},{"id":4,"text":"To improve the performance of data retrieval"}]', 4, 3),
('DA214', 'In SQL, which command is used to remove a table and all its data permanently?', '[{"id":1,"text":"DELETE"},{"id":2,"text":"REMOVE"},{"id":3,"text":"DROP"},{"id":4,"text":"TRUNCATE"}]', 3, 2),
('DA214', 'What does SQL stand for?', '[{"id":1,"text":"Structured Question Language"},{"id":2,"text":"Structured Query Language"},{"id":3,"text":"Simple Query Language"},{"id":4,"text":"Sequential Query Language"}]', 2, 1),
('DA214', 'A database schema is:', '[{"id":1,"text":"The physical database"},{"id":2,"text":"The DBMS"},{"id":3,"text":"The design of a database"},{"id":4,"text":"The data in a database"}]', 3, 2),
('DA214', 'Which normal form is considered adequate for normal relational database design?', '[{"id":1,"text":"1NF"},{"id":2,"text":"2NF"},{"id":3,"text":"3NF"},{"id":4,"text":"4NF"}]', 3, 3),
('DA214', 'A unique key constraint ensures what about the data?', '[{"id":1,"text":"Data is duplicated"},{"id":2,"text":"Data is deleted"},{"id":3,"text":"Data is not duplicated"},{"id":4,"text":"Data is updated"}]', 3, 1),
('DA214', 'Which command is used to add new rows to a database table?', '[{"id":1,"text":"ADD"},{"id":2,"text":"INSERT INTO"},{"id":3,"text":"UPDATE"},{"id":4,"text":"CREATE"}]', 2, 1),
('DA214', 'What is a primary key?', '[{"id":1,"text":"A constraint that ensures unique data"},{"id":2,"text":"A key that is primary to database design"},{"id":3,"text":"The main key used by the DBMS"},{"id":4,"text":"The first key made in a table"}]', 1, 2);

INSERT INTO questions (exam_id, qcontent, qoptions, correct_option_id, difficulty_level) VALUES
('DA214', 'Which of the following is not a type of SQL join?', '[{"id":1,"text":"INNER JOIN"}, {"id":2,"text":"OUTER JOIN"}, {"id":3,"text":"LINK JOIN"}, {"id":4,"text":"CROSS JOIN"}]', 3, 2),
('DA214', 'What does ACID stand for in database systems?', '[{"id":1,"text":"Atomicity, Consistency, Isolation, Durability"}, {"id":2,"text":"Association, Condition, Isolation, Duration"}, {"id":3,"text":"Atomicity, Condition, Independence, Durability"}, {"id":4,"text":"Association, Consistency, Isolation, Duration"}]', 1, 1),
('DA214', 'Which SQL statement is used to extract data from a database?', '[{"id":1,"text":"GET"}, {"id":2,"text":"EXTRACT"}, {"id":3,"text":"SELECT"}, {"id":4,"text":"PULL"}]', 3, 1),
('DA214', 'What is normalization primarily used for?', '[{"id":1,"text":"Improving performance on write operations"}, {"id":2,"text":"Reducing data redundancy and improving data integrity"}, {"id":3,"text":"Encrypting sensitive information"}, {"id":4,"text":"Backing up the database"}]', 2, 3),
('DA214', 'Which of the following is true about primary keys?', '[{"id":1,"text":"A table can have multiple primary keys"}, {"id":2,"text":"Primary keys can contain NULL values"}, {"id":3,"text":"A primary key uniquely identifies each record in a table"}, {"id":4,"text":"Primary keys are optional in a table"}]', 3, 2);

INSERT INTO questions (exam_id, qcontent, qoptions, correct_option_id, difficulty_level) VALUES
('DA214', 'What is the purpose of a foreign key in a relational database?', '[{"id":1,"text":"To enforce referential integrity between tables"}, {"id":2,"text":"To store sensitive information"}, {"id":3,"text":"To improve query performance"}, {"id":4,"text":"To create indexes on columns"}]', 1, 3),
('DA214', 'Which of the following is not a valid SQL data type?', '[{"id":1,"text":"VARCHAR"}, {"id":2,"text":"INTEGER"}, {"id":3,"text":"BOOLEAN"}, {"id":4,"text":"DECIMAL"}]', 3, 3),
('DA214', 'What is the purpose of the GROUP BY clause in SQL?', '[{"id":1,"text":"To filter rows based on a condition"}, {"id":2,"text":"To sort rows in ascending order"}, {"id":3,"text":"To group rows with the same value in a specified column"}, {"id":4,"text":"To join multiple tables"}]', 3, 2),
('DA214', 'Which SQL statement is used to update data in a database?', '[{"id":1,"text":"MODIFY"}, {"id":2,"text":"CHANGE"}, {"id":3,"text":"UPDATE"}, {"id":4,"text":"ALTER"}]', 3, 2),
('DA214', 'What is the purpose of the HAVING clause in SQL?', '[{"id":1,"text":"To filter rows based on a condition"}, {"id":2,"text":"To sort rows in ascending order"}, {"id":3,"text":"To group rows with the same value in a specified column"}, {"id":4,"text":"To filter groups based on a condition"}]', 4, 3);

INSERT INTO questions (exam_id, qcontent, qoptions, correct_option_id, difficulty_level) VALUES
('DA214', 'Which normal form is considered adequate for relational database design?', '[{"id":1,"text":"2NF"}, {"id":2,"text":"3NF"}, {"id":3,"text":"4NF"}, {"id":4,"text":"5NF"}]', 2, 4),
('DA214', 'In a B+ tree, which property is not held by leaf nodes?', '[{"id":1,"text":"Contain pointers to data records"}, {"id":2,"text":"Contain only keys"}, {"id":3,"text":"Linked to each other in a linked list"}, {"id":4,"text":"Same number of keys as internal nodes"}]', 4, 4),
('DA214', 'What does the SQL clause WITH CHECK OPTION ensure when creating a view?', '[{"id":1,"text":"Performance optimization"}, {"id":2,"text":"Referential integrity"}, {"id":3,"text":"Insert and update integrity"}, {"id":4,"text":"Indexing of the view"}]', 3, 4),
('DA214', 'Which one of the following is not a valid isolation level in the SQL standard?', '[{"id":1,"text":"READ UNCOMMITTED"}, {"id":2,"text":"READ COMMITTED"}, {"id":3,"text":"REPEATABLE READ"}, {"id":4,"text":"SNAPSHOT"}]', 4, 4),
('DA214', 'What is the main advantage of multiversion concurrency control (MVCC)?', '[{"id":1,"text":"Deadlock prevention"}, {"id":2,"text":"Reduced locking"}, {"id":3,"text":"Improved security"}, {"id":4,"text":"Faster commit operations"}]', 2, 5),
('DA214', 'In distributed databases, the acronym ACID stands for?', '[{"id":1,"text":"Atomicity, Consistency, Isolation, Durability"}, {"id":2,"text":"Association, Consistency, Integrity, Durability"}, {"id":3,"text":"Atomicity, Concurrency, Isolation, Dependability"}, {"id":4,"text":"Association, Commitment, Integrity, Dependability"}]', 1, 5),
('DA214', 'Which of the following is not a goal of distributed database design?', '[{"id":1,"text":"Data transparency"}, {"id":2,"text":"Reduced redundancy"}, {"id":3,"text":"Centralized control"}, {"id":4,"text":"Continuous availability"}]', 3, 5),
('DA214', 'A complex join condition that includes subqueries and nested queries is known as what?', '[{"id":1,"text":"Inner join"}, {"id":2,"text":"Equi-join"}, {"id":3,"text":"Non-equi join"}, {"id":4,"text":"Theta join"}]', 4, 5);



INSERT INTO questions (exam_id, qcontent, qoptions, correct_option_id, difficulty_level) VALUES
('DA244', 'If the population standard deviation is known, which distribution should be used for hypothesis testing?', '[{"id":1,"text":"t-distribution"}, {"id":2,"text":"normal distribution"}, {"id":3,"text":"chi-square distribution"}, {"id":"4","text":"F-distribution"}]', 2, 4),
('DA244', 'A type II error is failing to reject a null hypothesis that is:', '[{"id":1,"text":"true"}, {"id":2,"text":"false"}, {"id":3,"text":"indeterminate"}, {"id":4,"text":"none of the above"}]', 2, 4),
('DA244', 'In a Poisson distribution, the mean and which other parameter are equal?', '[{"id":1,"text":"Median"}, {"id":2,"text":"Mode"}, {"id":3,"text":"Variance"}, {"id":4,"text":"Standard deviation"}]', 3, 4),
('DA244', 'What does the Central Limit Theorem state about the sampling distribution of the sample mean?', '[{"id":1,"text":"It is always normally distributed"}, {"id":2,"text":"It approximates a normal distribution as the sample size increases"}, {"id":"3","text":"It is not affected by the shape of the population distribution"}, {"id":4,"text":"It is always uniformly distributed"}]', 2, 4),
('DA244', 'In a Bayesian framework, what does the prior probability represent?', '[{"id":1,"text":"The probability of the data under any hypothesis"}, {"id":2,"text":"The probability of a hypothesis before observing the data"}, {"id":3,"text":"The likelihood of observed data under a particular hypothesis"}, {"id":4,"text":"The probability of the hypothesis after observing the data"}]', 2, 5),
('DA244', 'What is the purpose of a likelihood ratio test in the context of statistical models?', '[{"id":1,"text":"To assess the goodness of fit of the model"}, {"id":2,"text":"To compare the fits of two models"}, {"id":3,"text":"To estimate the parameters of the model"}, {"id":4,"text":"To determine the predictive accuracy of the model"}]', 2, 5),
('DA244', 'In the context of hypothesis testing, what is the power of a test?', '[{"id":1,"text":"The probability of rejecting a true null hypothesis"}, {"id":2,"text":"The probability of not rejecting a false null hypothesis"}, {"id":3,"text":"The probability of rejecting a false null hypothesis"}, {"id":4,"text":"The probability of not rejecting a true null hypothesis"}]', 3, 5),
('DA244', 'What is the significance of the "curse of dimensionality" in probability and statistics?', '[{"id":1,"text":"It refers to the exponential increase in volume associated with adding extra dimensions to Euclidean space"}, {"id":2,"text":"It indicates the increased complexity of models as more predictors are added"}, {"id":3,"text":"It describes the phenomenon where the distance between points becomes almost equidistant in high-dimensional space"}, {"id":4,"text":"It denotes the decreased significance of added data in large datasets"}]', 3, 5);


INSERT INTO questions (exam_id, qcontent, qoptions, correct_option_id, difficulty_level) VALUES
('DA244', 'What is the mean of the data set 2, 3, 7, 8?', '[{"id":1,"text":"5"}, {"id":2,"text":"4.5"}, {"id":3,"text":"20"}, {"id":4,"text":"10"}]', 1, 2),
('DA244', 'In a standard normal distribution, what is the probability of a Z-score being less than 0?', '[{"id":1,"text":"0.5"}, {"id":2,"text":"0.25"}, {"id":3,"text":"0.75"}, {"id":4,"text":"1"}]', 1, 3),
('DA244', 'What is the median of the data set 1, 2, 4, 6, 8?', '[{"id":1,"text":"4"}, {"id":2,"text":"5"}, {"id":3,"text":"6"}, {"id":4,"text":"2.5"}]', 1, 1),
('DA244', 'If the variance of a set is 16, what is the standard deviation?', '[{"id":1,"text":"4"}, {"id":2,"text":"8"}, {"id":3,"text":"2"}, {"id":4,"text":"16"}]', 1, 2),
('DA244', 'What does the P(A|B) notation represent in probability?', '[{"id":1,"text":"The probability of A and B occurring"}, {"id":2,"text":"The probability of A given that B has occurred"}, {"id":3,"text":"The probability of B given that A has occurred"}, {"id":4,"text":"The probability of A or B occurring"}]', 2, 4),
('DA244', 'What is the mode of the data set 2, 3, 3, 4, 5?', '[{"id":1,"text":"3"}, {"id":2,"text":"4"}, {"id":3,"text":"2"}, {"id":4,"text":"5"}]', 1, 1),
('DA244', 'What is the range of the data set 1, 3, 5, 7, 9?', '[{"id":1,"text":"8"}, {"id":2,"text":"9"}, {"id":3,"text":"7"}, {"id":4,"text":"6"}]', 1, 1),
('DA244', 'What is the interquartile range of the data set 1, 2, 3, 4, 5, 6, 7, 8, 9?','[{"id":}]' '[{"id":4, "text":"5", "id":3, "text":"2"}]', 1, 2),
('DA244', 'If P(A) = 0.5 and P(B) = 0.3, what is P(A AND B) assuming A and B are independent?', '[{"id":1,"text":"0.15"},{"id":2,"text":"0.8"},{"id":3,"text":"0.5"},{"id":4,"text":"0.3"}]', 1, 2),
('DA244', 'In a binomial distribution with n=10 and p=0.5, what is the variance?', '[{"id":1,"text":"2.5"},{"id":2,"text":"5"},{"id":3,"text":"10"},{"id":4,"text":"25"}]', 2, 3),
('DA244', 'What is the probability of getting exactly 3 heads in 5 flips of a fair coin?', '[{"id":1,"text":"0.3125"},{"id":2,"text":"0.5"},{"id":3,"text":"0.25"},{"id":4,"text":"0.125"}]', 1, 4),
('DA244', 'What does a correlation coefficient of -1 indicate?', '[{"id":1,"text":"Perfect negative correlation"},{"id":2,"text":"No correlation"},{"id":3,"text":"Perfect positive correlation"},{"id":4,"text":"Cannot be determined"}]', 1, 2),
('DA244', 'What is the standard deviation of a normal distribution with mean 10 and variance 16?', '[{"id":1,"text":"2"},{"id":2,"text":"4"},{"id":3,"text":"8"},{"id":4,"text":"16"}]', 2, 3),
('DA244', 'What is the probability of rolling a 6 on a fair six-sided die?', '[{"id":1,"text":"0.1"},{"id":2,"text":"0.2"},{"id":3,"text":"0.5"},{"id":4,"text":"1"}]', 3, 1),
('DA244', 'What is the expected value of a discrete random variable X with P(X=1)=0.3, P(X=2)=0.5, P(X=3)=0.2?', '[{"id":1,"text":"1.5"},{"id":2,"text":"2"},{"id":3,"text":"2.5"},{"id":4,"text":"3"}]', 2, 2),
('DA244', 'What is the probability of selecting a red card from a standard deck of 52 cards?', '[{"id":1,"text":"1/13"},{"id":2,"text":"1/4"},{"id":3,"text":"1/2"},{"id":4,"text":"1/26"}]', 1, 1),
('DA244', 'What is the variance of a uniform distribution on the interval [a, b]?', '[{"id":1,"text":"(b-a)^2/12"},{"id":2,"text":"(b-a)^2/6"},{"id":3,"text":"(b-a)^2/4"},{"id":4,"text":"(b-a)^2/2"}]', 1, 3),
('DA244', 'What is the probability of selecting a red card or a face card from a standard deck of 52 cards?', '[{"id":1,"text":"1/13"},{"id":2,"text":"1/4"},{"id":3,"text":"1/2"},{"id":4,"text":"1/26"}]', 3, 3),
('DA244', 'What is the expected value of a fair six-sided die?', '[{"id":1,"text":"1"},{"id":2,"text":"3.5"},{"id":3,"text":"6"},{"id":4,"text":"4"}]', 2, 1),
('DA244', 'What is the probability of selecting a red card and a face card from a standard deck of 52 cards?', '[{"id":1,"text":"1/13"},{"id":2,"text":"1/4"},{"id":3,"text":"1/2"},{"id":4,"text":"1/26"}]', 4, 4),
('DA244', 'What is the probability of selecting a red card given that a face card has been selected from a standard deck of 52 cards?', '[{"id":1,"text":"1/13"},{"id":2,"text":"1/4"},{"id":3,"text":"1/2"},{"id":4,"text":"1/26"}]', 3, 4),
('DA244', 'What is the probability of selecting a face card given that a red card has been selected from a standard deck of 52 cards?', '[{"id":1,"text":"1/13"},{"id":2,"text":"1/4"},{"id":3,"text":"1/2"},{"id":4,"text":"1/26"}]', 2, 4),
('DA244', 'If the odds in favor of an event are 3:2, what is the probability of the event occurring?', '[{"id":1,"text":"0.6"},{"id":2,"text":"0.3"},{"id":3,"text":"0.5"},{"id":4,"text":"0.4"}]', 1, 5);
