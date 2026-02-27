DROP DATABASE IF EXISTS saba_conference_db;
CREATE DATABASE saba_conference_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE saba_conference_db;

-- Users Table
CREATE TABLE users (
user_id INT PRIMARY KEY AUTO_INCREMENT,
username VARCHAR(50) UNIQUE NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
user_type ENUM('admin', 'author', 'reviewer', 'chair') NOT NULL,
full_name VARCHAR(100) NOT NULL,
affiliation VARCHAR(200),
phone VARCHAR(20),
address TEXT,
bio TEXT,
profile_image VARCHAR(255),
is_active BOOLEAN DEFAULT TRUE,
last_login DATETIME,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
INDEX idx_email (email),
INDEX idx_user_type (user_type),
INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Conferences Table
CREATE TABLE conferences (
conf_id INT PRIMARY KEY AUTO_INCREMENT,
chair_id INT NOT NULL,
title VARCHAR(200) NOT NULL,
description TEXT NOT NULL,
short_name VARCHAR(50),
venue VARCHAR(200) NOT NULL,
start_date DATE NOT NULL,
end_date DATE NOT NULL,
submission_deadline DATETIME NOT NULL,
review_deadline DATETIME NOT NULL,
notification_date DATETIME NOT NULL,
camera_ready_deadline DATETIME,
registration_deadline DATETIME,
registration_fee DECIMAL(10,2) DEFAULT 0.00,
max_papers INT,
status ENUM('draft', 'open', 'reviewing', 'closed', 'archived') DEFAULT 'draft',
website_url VARCHAR(255),
contact_email VARCHAR(100),
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

FOREIGN KEY (chair_id) REFERENCES users(user_id) ON DELETE CASCADE,
INDEX idx_chair_id (chair_id),
INDEX idx_status (status),
INDEX idx_submission_deadline (submission_deadline)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Papers Table
CREATE TABLE papers (
paper_id INT PRIMARY KEY AUTO_INCREMENT,
author_id INT NOT NULL,
conf_id INT NOT NULL,
title VARCHAR(300) NOT NULL,
abstract TEXT NOT NULL,
keywords VARCHAR(500) NOT NULL,
file_path VARCHAR(500) NOT NULL,
file_name VARCHAR(255) NOT NULL,
file_size INT NOT NULL,
file_type VARCHAR(50),
status ENUM('submitted', 'under_review', 'accepted', 'rejected', 'revision_requested', 'withdrawn') DEFAULT 'submitted',
track VARCHAR(100),
submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
decision_date DATETIME,
final_decision ENUM('accept', 'reject'),
decision_notes TEXT,
is_published BOOLEAN DEFAULT FALSE,
doi VARCHAR(100),
page_numbers VARCHAR(20),
FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE CASCADE,
FOREIGN KEY (conf_id) REFERENCES conferences(conf_id) ON DELETE CASCADE,
INDEX idx_author_id (author_id),
INDEX idx_conf_id (conf_id),
INDEX idx_status (status),
INDEX idx_submission_date (submission_date),
UNIQUE INDEX idx_doi (doi) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Co-authors Table
CREATE TABLE coauthors (
coauthor_id INT PRIMARY KEY AUTO_INCREMENT,
paper_id INT NOT NULL,
full_name VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL,
affiliation VARCHAR(200),
country VARCHAR(100),
author_order INT NOT NULL DEFAULT 1,
FOREIGN KEY (paper_id) REFERENCES papers(paper_id) ON DELETE CASCADE,
INDEX idx_paper_id (paper_id),
INDEX idx_email (email),
UNIQUE INDEX idx_paper_author_order (paper_id, author_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Topics Table
CREATE TABLE topics (
topic_id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(100) NOT NULL,
description TEXT,
parent_id INT,

FOREIGN KEY (parent_id) REFERENCES topics(topic_id) ON DELETE SET NULL,

INDEX idx_parent_id (parent_id),
UNIQUE INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Paper Topics Table
CREATE TABLE paper_topics (
paper_id INT NOT NULL,
topic_id INT NOT NULL,
is_primary BOOLEAN DEFAULT FALSE,
PRIMARY KEY (paper_id, topic_id),
FOREIGN KEY (paper_id) REFERENCES papers(paper_id) ON DELETE CASCADE,
FOREIGN KEY (topic_id) REFERENCES topics(topic_id) ON DELETE CASCADE,
INDEX idx_topic_id (topic_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reviewer Expertise Table
CREATE TABLE reviewer_expertise (
reviewer_id INT NOT NULL,
topic_id INT NOT NULL,
proficiency_level ENUM('beginner', 'intermediate', 'expert') DEFAULT 'intermediate',
PRIMARY KEY (reviewer_id, topic_id),
FOREIGN KEY (reviewer_id) REFERENCES users(user_id) ON DELETE CASCADE,
FOREIGN KEY (topic_id) REFERENCES topics(topic_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Paper Assignments Table
CREATE TABLE paper_assignments (
assignment_id INT PRIMARY KEY AUTO_INCREMENT,
paper_id INT NOT NULL,
reviewer_id INT NOT NULL,
assigned_by INT NOT NULL,
assigned_date DATETIME DEFAULT CURRENT_TIMESTAMP,
due_date DATETIME,
status ENUM('assigned', 'accepted', 'declined', 'completed') DEFAULT 'assigned',
decline_reason TEXT,
FOREIGN KEY (paper_id) REFERENCES papers(paper_id) ON DELETE CASCADE,
FOREIGN KEY (reviewer_id) REFERENCES users(user_id) ON DELETE CASCADE,
FOREIGN KEY (assigned_by) REFERENCES users(user_id) ON DELETE CASCADE,
INDEX idx_paper_id (paper_id),
INDEX idx_reviewer_id (reviewer_id),
INDEX idx_status (status),
UNIQUE INDEX idx_paper_reviewer (paper_id, reviewer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reviews Table
CREATE TABLE reviews (
review_id INT PRIMARY KEY AUTO_INCREMENT,
assignment_id INT NOT NULL,
overall_score DECIMAL(3,2) CHECK (overall_score >= 1 AND overall_score <= 5),
originality INT CHECK (originality >= 1 AND originality <= 10),
relevance INT CHECK (relevance >= 1 AND relevance <= 10),
methodology INT CHECK (methodology >= 1 AND methodology <= 10),
presentation INT CHECK (presentation >= 1 AND presentation <= 10),
technical_quality INT CHECK (technical_quality >= 1 AND technical_quality <= 10),
comments_author TEXT NOT NULL,
comments_chair TEXT,
decision ENUM('accept', 'minor_revision', 'major_revision', 'reject') NOT NULL,
confidence ENUM('high', 'medium', 'low') DEFAULT 'medium',
is_submitted BOOLEAN DEFAULT FALSE,
submission_date DATETIME,
last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (assignment_id) REFERENCES paper_assignments(assignment_id) ON DELETE CASCADE,
INDEX idx_assignment_id (assignment_id),
INDEX idx_decision (decision),
INDEX idx_submission_date (submission_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Paper Revisions Table
CREATE TABLE paper_revisions (
revision_id INT PRIMARY KEY AUTO_INCREMENT,
paper_id INT NOT NULL,
reviewer_id INT NOT NULL,
revision_number INT DEFAULT 1,
file_path VARCHAR(500) NOT NULL,
revision_notes TEXT,
submitted_date DATETIME DEFAULT CURRENT_TIMESTAMP,
is_approved BOOLEAN DEFAULT FALSE,
approved_by INT,
approval_date DATETIME,
FOREIGN KEY (paper_id) REFERENCES papers(paper_id) ON DELETE CASCADE,
FOREIGN KEY (reviewer_id) REFERENCES users(user_id) ON DELETE CASCADE,
FOREIGN KEY (approved_by) REFERENCES users(user_id) ON DELETE SET NULL,
INDEX idx_paper_id (paper_id),
INDEX idx_reviewer_id (reviewer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sessions Table
CREATE TABLE sessions (
session_id INT PRIMARY KEY AUTO_INCREMENT,
conf_id INT NOT NULL,
title VARCHAR(200) NOT NULL,
description TEXT,
session_type ENUM('oral', 'poster', 'keynote', 'workshop') DEFAULT 'oral',
chair_id INT,
room VARCHAR(100),
start_time DATETIME NOT NULL,
end_time DATETIME NOT NULL,
max_attendees INT,
FOREIGN KEY (conf_id) REFERENCES conferences(conf_id) ON DELETE CASCADE,
FOREIGN KEY (chair_id) REFERENCES users(user_id) ON DELETE SET NULL,

INDEX idx_conf_id (conf_id),
INDEX idx_start_time (start_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Session Papers Table
CREATE TABLE session_papers (
session_id INT NOT NULL,
paper_id INT NOT NULL,
presentation_order INT NOT NULL,
presentation_time DATETIME,
duration_minutes INT DEFAULT 15,
PRIMARY KEY (session_id, paper_id),
FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE,
FOREIGN KEY (paper_id) REFERENCES papers(paper_id) ON DELETE CASCADE,
INDEX idx_presentation_order (presentation_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Attendees Table
CREATE TABLE attendees (
attendee_id INT PRIMARY KEY AUTO_INCREMENT,
user_id INT,
conf_id INT NOT NULL,
full_name VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL,
affiliation VARCHAR(200),
registration_type ENUM('author', 'reviewer', 'participant', 'student', 'guest') NOT NULL,
registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
payment_status ENUM('pending', 'paid', 'waived', 'cancelled') DEFAULT 'pending',
payment_amount DECIMAL(10,2),
payment_date DATETIME,
receipt_number VARCHAR(50),
has_certificate BOOLEAN DEFAULT FALSE,
certificate_sent_date DATETIME,
FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
FOREIGN KEY (conf_id) REFERENCES conferences(conf_id) ON DELETE CASCADE,
INDEX idx_conf_id (conf_id),
INDEX idx_email (email),
INDEX idx_payment_status (payment_status),
UNIQUE INDEX idx_conf_email (conf_id, email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notifications Table
CREATE TABLE notifications (
notification_id INT PRIMARY KEY AUTO_INCREMENT,
user_id INT NOT NULL,
title VARCHAR(200) NOT NULL,
message TEXT NOT NULL,
notification_type ENUM('system', 'conference', 'paper', 'review') NOT NULL,
related_id INT,
is_read BOOLEAN DEFAULT FALSE,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
read_at DATETIME,
FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
INDEX idx_user_id (user_id),
INDEX idx_is_read (is_read),
INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Activity Logs Table
CREATE TABLE activity_logs (
log_id INT PRIMARY KEY AUTO_INCREMENT,
user_id INT,
action VARCHAR(100) NOT NULL,
description TEXT,
ip_address VARCHAR(45),
user_agent TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
INDEX idx_user_id (user_id),
INDEX idx_action (action),
INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Initial Data
INSERT INTO topics (name, description) VALUES
('علوم الحاسوب', 'مجال علوم الحاسوب وتقنية المعلومات'),
('الهندسة', 'مجالات الهندسة المختلفة'),
('الطب والعلوم الصحية', 'العلوم الطبية والصحية'),
('العلوم الاجتماعية', 'العلوم الاجتماعية والإنسانية'),
('الاقتصاد والإدارة', 'العلوم الاقتصادية والإدارية'),
('اللغة العربية', 'الدراسات اللغوية والأدبية'),
('الدراسات الإسلامية', 'العلوم الشرعية والدراسات الإسلامية');

INSERT INTO users (username, email, password, user_type, full_name, affiliation, is_active) VALUES
('admin', 'admin@sabauni.edu.ye', '$2y$10$YourHashedPasswordHere', 'admin', 'مدير النظام', 'جامعة إقليم سبأ', TRUE);

-- Triggers
DELIMITER //
CREATE TRIGGER update_conference_status
BEFORE UPDATE ON conferences
FOR EACH ROW
BEGIN
IF NEW.submission_deadline < NOW() AND OLD.status = 'open' THEN
SET NEW.status = 'reviewing';
END IF;
END//
DELIMITER ;

DELIMITER //
CREATE TRIGGER log_paper_submission
AFTER INSERT ON papers
FOR EACH ROW
BEGIN
INSERT INTO activity_logs (user_id, action, description)
VALUES (NEW.author_id, 'paper_submission', CONCAT('تم تقديم ورقة جديدة: ', NEW.title));
END//
DELIMITER ;
