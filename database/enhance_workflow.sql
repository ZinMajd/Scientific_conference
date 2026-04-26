-- Create paper_decisions table if not exists
CREATE TABLE IF NOT EXISTS paper_decisions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    paper_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    decision_level ENUM('editor', 'committee', 'chair') NOT NULL,
    decision ENUM('accept', 'reject', 'minor_fixes', 'major_fixes') NOT NULL,
    notes TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (paper_id) REFERENCES papers(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
