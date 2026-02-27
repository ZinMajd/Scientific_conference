USE saba_conference_db;

-- 16. جدول محاور المؤتمر (Conference_Axes)
CREATE TABLE IF NOT EXISTS Conference_Axes (
    axis_id INT AUTO_INCREMENT PRIMARY KEY,
    conference_id INT,
    axis_name VARCHAR(255) NOT NULL,
    description TEXT,
    FOREIGN KEY (conference_id) REFERENCES Conferences(conference_id) ON DELETE CASCADE
);

-- تحديث جدول الأبحاث لربطه بالمحور
ALTER TABLE Submissions ADD COLUMN axis_id INT;
ALTER TABLE Submissions ADD FOREIGN KEY (axis_id) REFERENCES Conference_Axes(axis_id) ON DELETE SET NULL;

-- 17. جدول المؤلفين المشاركين (Submission_Authors)
CREATE TABLE IF NOT EXISTS Submission_Authors (
    author_id INT AUTO_INCREMENT PRIMARY KEY,
    submission_id INT,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(100),
    affiliation VARCHAR(255),
    is_presenter BOOLEAN DEFAULT FALSE,
    author_order INT,
    FOREIGN KEY (submission_id) REFERENCES Submissions(submission_id) ON DELETE CASCADE
);

-- 18. جدول ملفات وإصدارات الأبحاث (Submission_Files)
CREATE TABLE IF NOT EXISTS Submission_Files (
    file_id INT AUTO_INCREMENT PRIMARY KEY,
    submission_id INT,
    file_path VARCHAR(255) NOT NULL,
    version_type ENUM('Initial', 'Revised', 'Final') DEFAULT 'Initial',
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES Submissions(submission_id) ON DELETE CASCADE
);

-- 19. جدول معايير التحكيم (Review_Criteria)
CREATE TABLE IF NOT EXISTS Review_Criteria (
    criteria_id INT AUTO_INCREMENT PRIMARY KEY,
    conference_id INT,
    criteria_name VARCHAR(255) NOT NULL,
    weight INT DEFAULT 1,
    FOREIGN KEY (conference_id) REFERENCES Conferences(conference_id) ON DELETE CASCADE
);

-- 20. جدول تفاصيل تقييم المحكمين (Review_Ratings)
CREATE TABLE IF NOT EXISTS Review_Ratings (
    rating_id INT AUTO_INCREMENT PRIMARY KEY,
    review_id INT,
    criteria_id INT,
    score INT NOT NULL,
    comments TEXT,
    FOREIGN KEY (review_id) REFERENCES Reviews(review_id) ON DELETE CASCADE,
    FOREIGN KEY (criteria_id) REFERENCES Review_Criteria(criteria_id) ON DELETE CASCADE
);

-- 21. جدول إعدادات المؤتمر (Conference_Settings)
CREATE TABLE IF NOT EXISTS Conference_Settings (
    setting_id INT AUTO_INCREMENT PRIMARY KEY,
    conference_id INT,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    FOREIGN KEY (conference_id) REFERENCES Conferences(conference_id) ON DELETE CASCADE
);
