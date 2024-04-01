import express from 'express';
import mysql from 'mysql2';
//import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import session from 'express-session';
import { useParams } from 'react-router-dom';
//const multer=require('multer') //handle multipart/form-data requests in Express
//const upload=multer({dest: 'uploads/'}) //specify the destination folder for the uploaded files


const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5174', credentials: true })); // Adjust the origin as per your React app's URL

app.use(session({
    secret: 'your_secret_key', // This secret key is used to sign the session ID cookie. Replace 'your_secret_key' with a real secret string.
    resave: false, // This option forces the session to be saved back to the session store, even if the session was never modified during the request.
    saveUninitialized: false, // This option forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified.
    cookie: { secure: false } // For development, set secure to false. In production, set it to true if you're using HTTPS.
  }));
  


// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'examinationsystem'
});

// Connect to MySQL
db.connect(err => {
  if (err) return console.error('error: ' + err.message);
  console.log('Successfully connected to the MySQL Server.');
});

const PORT = 3001;

const saltRounds = 10;

app.post('/register', (req, res) => {
    const { name, email, password, role } = req.body;
    console.log('Request body:', req.body); // Add this line to log the request body

    if (!password) {
        return res.status(400).json({ message: 'Password is required' }); // Add error handling for missing password
    }
    // Hash the password
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        // Insert user into the 'users' table
        const userSql = "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)";
        db.query(userSql, [name, email, hashedPassword, role.toLowerCase()], (error, results) => {
            if (error) {
                console.error('Error executing query:', error);
                return res.status(500).json({ message: 'Registration failed' });
            }

            if (role.toLowerCase() === 'student') {
                /* Ensure photoID exists for students
                if (!photoID) {
                    return res.status(400).json({ message: 'Photo ID is required for student registration' });
                }*/

                const studentSql = "INSERT INTO students (name, email) VALUES (?, ?)";
                db.query(studentSql, [name, email], (error, results) => {
                    if (error) {
                        console.error('Error executing student table query:', error);
                        return res.status(500).json({ message: 'Student registration failed' });
                    }
                    res.json({ message: 'Registration successful' });
                });
            } 
            else{
                // If not a student, respond with success for the user registration
                const adminsql="Insert into admin (name,email) values(?,?)";
                db.query(adminsql,[name,email],(error,results)=>{
                    if(error){
                        console.error('Error executing admin table query:', error);
                        return res.status(500).json({ message: 'Admin registration failed' });
                    }
                    res.json({ message: 'Registration successful' });
                });
            }
        });
    });
});

app.post('/', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Assuming that the 'users' table has a column 'role' which stores 'student' or 'admin'
    const query = `
        SELECT u.*, s.student_id, a.admin_id 
        FROM users u
        LEFT JOIN students s ON u.email = s.email AND u.role = 'Student'
        LEFT JOIN admin a ON u.email = a.email AND u.role != 'Student'
        WHERE u.email = ?
    `;

    db.query(query, [email], (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ message: 'Login failed' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = results[0];
        bcrypt.compare(password, user.password_hash, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ message: 'Login failed' });
            }

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Set the user info in session including the specific ID based on their role
            req.session.user = {
                name: user.name,
                email: user.email,
                role: user.role,
                id: user.role === 'Student' ? user.student_id : user.admin_id
            };

            res.json({ message: 'Login successful', user: req.session.user });
        });
    });
});


// Get user info endpoint
app.get('/get-user-info', (req, res) => {
    console.log(req.session.user);
    if (req.session.user) {
      res.json({ status: 'success', user: req.session.user });
    } else {
      res.status(401).json({ status: 'error', message: 'No user logged in' });
    }
  });

// Logout endpoint
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ status: 'error', message: 'Could not log out' });
      }
      res.clearCookie('connect.sid'); // 'connect.sid' is the default name for the session ID cookie. Adjust if you're using a different name.
      res.json({ status: 'success', message: 'Logged out successfully' });
    });
  });

  app.post('/exams', async (req, res) => {
    const { examId, subject, examDate, totalMarks, fees, numberOfQuestions, examDuration } = req.body;

    // Assuming you have validation checks and middleware to ensure the admin is logged in.

    // Construct the SQL query to insert a new exam
    const insertExamQuery = `
        INSERT INTO exams (exam_id, subject, exam_date, total_marks, fees, number_of_questions, exam_duration)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // Array of values to be inserted, taken from the request body
    const values = [examId, subject, examDate, totalMarks, fees, numberOfQuestions, examDuration];

    // Execute the query
    db.query(insertExamQuery, values, (error, results, fields) => {
        if (error) {
            // Handle errors (e.g., duplicate examId, etc.)
            console.error('Failed to register the exam:', error);
            return res.status(500).json({ status: 'error', message: 'Failed to register the exam' });
        }
        // If successful, send back a success response
        res.status(201).json({ status: 'success', message: 'Exam registered successfully', examId: examId });
    });
});


app.get('/examList', (req, res) => {
    const studentId = req.session.user.id; // Get the logged-in student's ID from session
    const sql = `
    SELECT e.*, 
           CASE 
               WHEN se.exam_id IS NOT NULL THEN true
               ELSE false
           END as isRegistered
    FROM exams e
    LEFT JOIN student_exams se ON e.exam_id = se.exam_id AND se.student_id = ?
`;    db.query(sql,[studentId], (error, results) => {
        if (error) {
            console.error('Error fetching exams:', error);
            return res.status(500).json({ status: 'error', message: 'Failed to fetch exams' });
        }
        res.json({ status: 'success', exams: results });
    });
});

app.post('/registerForExam/:examId', (req, res) => {
    const examId = req.params.examId;
    const studentId = req.session.user.id; // The logged in student's ID

    // Check if the student has already registered for this exam
    const checkSql = `
        SELECT * FROM student_exams
        WHERE student_id = ? AND exam_id = ?
    `;
    db.query(checkSql, [studentId, examId], (checkError, checkResults) => {
        if (checkError) {
            console.error('Error checking registration:', checkError);
            return res.status(500).json({ status: 'error', message: 'Error checking registration' });
        }

        if (checkResults.length > 0) {
            // Student is already registered for this exam
            return res.status(409).json({ status: 'error', message: 'Already registered for this exam' });
        }

        // If not already registered, proceed with registration
        const registerSql = `
            INSERT INTO student_exams (student_id, exam_id)
            VALUES (?, ?)
        `;
        db.query(registerSql, [studentId, examId], (registerError, registerResults) => {
            if (registerError) {
                console.error('Error registering for exam:', registerError);
                return res.status(500).json({ status: 'error', message: 'Error registering for exam' });
            }

            // Registration was successful
            res.json({ status: 'success', message: 'Registered for exam successfully', data: { examId } });
        });
    });
});

app.get('/registered-exams', (req, res) => {
    const studentId=req.session.user.id;
    const sql=`Select e.exam_id,e.subject,e.exam_date,e.total_marks,e.fees,e.number_of_questions,e.exam_duration from exams e,student_exams se where e.exam_id=se.exam_id and se.student_id=?`;
    db.query(sql,[studentId],(error,results)=>{
        if(error){
            console.error('Error fetching registered exams:', error);
            return res.status(500).json({ status: 'error', message: 'Failed to fetch registered exams' });
        }
        res.json({ status: 'success', exams: results });
    });
});

app.delete('/cancelRegistration/:examId', (req, res) => {
    const { examId } = req.params;
    const studentId = req.session.user.id; // Make sure the user is logged in and has a session

    // SQL query to delete the registration
    const sql = `
        DELETE FROM student_exams
        WHERE student_id = ? AND exam_id = ?
    `;

    db.query(sql, [studentId, examId], (error, results) => {
        if (error) {
            console.error('Error cancelling registration:', error);
            res.status(500).json({ status: 'error', message: 'Failed to cancel registration' });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ status: 'error', message: 'Registration not found' });
        } else {
            res.json({ status: 'success', message: 'Registration cancelled successfully' });
        }
    });
});

// Assuming you have express app and database connection (db) set up
app.post('/start-exam', (req, res) => {
    if (!req.session.user || !req.session.user.id) {
        return res.status(401).json({ status: 'error', message: 'User not authenticated' });
    }

    // Example of starting an exam logic here
    // Ensure you have examId in your request body or parameters
    const { examId } = req.body; // Or use req.params if you're getting the ID from the URL

    if (!examId) {
        return res.status(400).json({ status: 'error', message: 'Exam ID is required to start the exam.' });
    }

    // Fetch or initialize exam session data for the user
    // This part depends on your application logic

    res.json({ status: 'success', message: 'Exam started', data: {/* Exam session data here */} });
});

  app.get('/get-exam-questions/:examId/:difficulty', (req, res) => {
    const { examId, difficulty } = req.params;
    
    const sql = `
        SELECT * FROM questions
        WHERE exam_id = ? AND difficulty_level = ?
        ORDER BY RAND() LIMIT 1
    `;

    db.query(sql, [examId, difficulty], (error, results) => {
        if (error) {
            console.error('Error fetching questions:', error);
            return res.status(500).json({ status: 'error', message: 'Failed to fetch questions' });
        }

        if (results.length) {
            res.json({ status: 'success', question: results[0] });
        } else {
            res.status(404).json({ status: 'error', message: 'No questions found for the specified difficulty' });
        }
    });
});

app.get('/exam-details/:examId', (req, res) => {
    const { examId } = req.params;

    const sql = 'SELECT * FROM exams WHERE exam_id = ?';
    
    db.query(sql, [examId], (error, results) => {
        if (error) {
            console.error('Error fetching exam details:', error);
            return res.status(500).json({ status: 'error', message: 'Failed to fetch exam details' });
        }

        if (results.length) {
            res.json({ status: 'success', examDetails: results[0] });
        } else {
            res.status(404).json({ status: 'error', message: 'Exam not found' });
        }
    });
});

app.post('/submit-answer',async(req,res) =>{
    const studentId=req.session.user.id;
    const {examId,questionId,selectedOption,isCorrect,timeTaken}=req.body;
    const sql='INSERT INTO exam_responses (exam_id,student_id,question_id,selected_option,is_correct,time_taken) VALUES (?,?,?,?,?,?)';
    db.query(sql,[examId,studentId,questionId,selectedOption,isCorrect,timeTaken],(error,results)=>{
        if(error){
            console.error('Error submitting answer:', error);
            return res.status(500).json({ status: 'error', message: 'Failed to submit answer' });
        }
        res.json({ status: 'success', message: 'Answer submitted successfully' });
    });
});

// Assuming express-session middleware is already set up correctly
app.post('/submit-exam', async (req, res) => {
    const { examId, finalScore } = req.body;
    const studentId=req.session.user.id;
  
    // SQL query to update the examScores table with the final score
    const updateScoresSql = `
      INSERT INTO exam_scores (exam_id, student_id, score) VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE score = VALUES(score)
    `;
  
    // Execute the SQL query
    db.query(updateScoresSql, [examId, studentId, finalScore], (err, results) => {
      if (err) {
        console.error('Error submitting exam:', err);
        return res.status(500).json({ message: 'Failed to submit exam' });
      }
      res.json({ message: 'Exam submitted successfully', finalScore: finalScore });
    });
  });

  app.get('/performance', (req, res) => {
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
  
    const studentId = req.session.user.id;
    
    const sql = `
      SELECT
        er.exam_id,
        e.subject, 
        COUNT(er.question_id) AS questions_answered,
        SUM(er.is_correct) AS correct_answers,
        COUNT(er.question_id) - SUM(er.is_correct) AS incorrect_answers,
        q.difficulty_level,
        AVG(er.time_taken) AS average_time
      FROM
        exam_responses er
      INNER JOIN
        questions q ON er.question_id = q.qid
      INNER JOIN
        exams e ON er.exam_id = e.exam_id
      WHERE
        er.student_id = ?
      GROUP BY
        er.exam_id, q.difficulty_level
      ORDER BY
        er.exam_id ASC, q.difficulty_level ASC;
    `;
  
    db.query(sql, [studentId], (err, result) => {
      if (err) {
        console.error('Error fetching performance data:', err);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
      }
      console.log(result);
      res.json({ status: 'success', performanceData: result });
    });
  });
  
  app.get('/exam-review/:examId', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    console.log("user info: ",req.session.user);
    const studentId = req.session.user.id;
    const { examId } = req.params;

    const sql = `
        SELECT
            q.qcontent AS question,
            er.selected_option AS selectedOption,
            q.correct_option_id AS correctOption,
            er.is_correct AS isCorrect,
            er.time_taken as timeTaken
        FROM
            exam_responses er
        JOIN
            questions q ON er.question_id = q.qid
        WHERE
            er.exam_id = ?
        AND
            er.student_id = ?
    `;

    db.query(sql, [examId, studentId], (err, results) => {
        if (err) {
            console.error('Error fetching exam review data:', err);
            return res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
        res.json({ status: 'success', reviewData: results });
    });
});

app.listen(PORT,()=> console.log(`Server is running on port ${PORT}`));

