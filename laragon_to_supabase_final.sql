-- ====================================================================
--          Laragon MySQL to Supabase PostgreSQL Migration Script
--          Project: Saba University Conference System
--          Tables: 32 (Application + Laravel System)
-- ====================================================================

-- Drop tables in reverse order of dependencies
DROP TABLE IF EXISTS session_papers CASCADE;
DROP TABLE IF EXISTS scientific_sessions CASCADE;
DROP TABLE IF EXISTS reviewer_expertise CASCADE;
DROP TABLE IF EXISTS paper_topics CASCADE;
DROP TABLE IF EXISTS paper_versions CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS paper_assignments CASCADE;
DROP TABLE IF EXISTS initial_screenings CASCADE;
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS coauthors CASCADE;
DROP TABLE IF EXISTS papers CASCADE;
DROP TABLE IF EXISTS attendees CASCADE;
DROP TABLE IF EXISTS conference_settings CASCADE;
DROP TABLE IF EXISTS conferences CASCADE;
DROP TABLE IF EXISTS notifications_log CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS role_user CASCADE;
DROP TABLE IF EXISTS permission_role CASCADE;
DROP TABLE IF EXISTS permission_user CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS personal_access_tokens CASCADE;
DROP TABLE IF EXISTS password_reset_tokens CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS job_batches CASCADE;
DROP TABLE IF EXISTS failed_jobs CASCADE;
DROP TABLE IF EXISTS cache CASCADE;
DROP TABLE IF EXISTS cache_locks CASCADE;
DROP TABLE IF EXISTS migrations CASCADE;

-- 1. users
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('admin','chair','author','reviewer','committee','editor','office')),
    full_name VARCHAR(100) NOT NULL,
    affiliation VARCHAR(200),
    phone VARCHAR(20),
    address TEXT,
    bio TEXT,
    cv_path VARCHAR(255),
    profile_image VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

-- 2. roles
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

-- 3. permissions
CREATE TABLE permissions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

-- 4. permission_role
CREATE TABLE permission_role (
    id BIGSERIAL PRIMARY KEY,
    permission_id BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

-- 5. role_user
CREATE TABLE role_user (
    id BIGSERIAL PRIMARY KEY,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

-- 6. conferences
CREATE TABLE conferences (
    id BIGSERIAL PRIMARY KEY,
    chair_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    short_name VARCHAR(50),
    venue VARCHAR(200) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    submission_deadline TIMESTAMPTZ NOT NULL,
    review_deadline TIMESTAMPTZ NOT NULL,
    notification_date TIMESTAMPTZ NOT NULL,
    camera_ready_deadline TIMESTAMPTZ,
    registration_deadline TIMESTAMPTZ,
    registration_fee DECIMAL(10,2) NOT NULL,
    max_papers INTEGER,
    status VARCHAR(20) NOT NULL CHECK (status IN ('draft','open','reviewing','closed','archived')),
    website_url VARCHAR(255),
    contact_email VARCHAR(100),
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

-- 7. topics
CREATE TABLE topics (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_id BIGINT REFERENCES topics(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

-- 8. papers
CREATE TABLE papers (
    id BIGSERIAL PRIMARY KEY,
    tracking_number VARCHAR(50) UNIQUE,
    author_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    conf_id BIGINT NOT NULL REFERENCES conferences(id) ON DELETE CASCADE,
    title VARCHAR(300) NOT NULL,
    abstract TEXT NOT NULL,
    keywords VARCHAR(500) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL CHECK (status IN ('submitted','under_review','accepted','rejected','revision_requested','withdrawn')),
    track VARCHAR(100),
    decision_date TIMESTAMPTZ,
    final_decision VARCHAR(10) CHECK (final_decision IN ('accept','reject')),
    decision_notes TEXT,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    doi VARCHAR(100) UNIQUE,
    page_numbers VARCHAR(20),
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

-- 9. coauthors
CREATE TABLE coauthors (
    id BIGSERIAL PRIMARY KEY,
    paper_id BIGINT NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    affiliation VARCHAR(200),
    country VARCHAR(100),
    author_order INTEGER NOT NULL,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    UNIQUE(paper_id, author_order)
);

-- 10. attendees
CREATE TABLE attendees (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    conf_id BIGINT NOT NULL REFERENCES conferences(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    affiliation VARCHAR(200),
    registration_type VARCHAR(20) NOT NULL CHECK (registration_type IN ('author','reviewer','participant','student','guest')),
    payment_status VARCHAR(20) NOT NULL CHECK (payment_status IN ('pending','paid','waived','cancelled')),
    payment_amount DECIMAL(10,2),
    payment_date TIMESTAMPTZ,
    receipt_number VARCHAR(50),
    has_certificate BOOLEAN NOT NULL DEFAULT FALSE,
    certificate_sent_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    UNIQUE(conf_id, email)
);

-- 11. paper_versions
CREATE TABLE paper_versions (
    id BIGSERIAL PRIMARY KEY,
    paper_id BIGINT NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    response_letter_path VARCHAR(255),
    author_comments TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('original','revised','camera_ready')),
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

-- 12. paper_assignments
CREATE TABLE paper_assignments (
    id BIGSERIAL PRIMARY KEY,
    paper_id BIGINT NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
    reviewer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_by BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    due_date TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL CHECK (status IN ('assigned','accepted','declined','completed')),
    decline_reason TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    UNIQUE(paper_id, reviewer_id)
);

-- 13. reviews
CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    assignment_id BIGINT NOT NULL REFERENCES paper_assignments(id) ON DELETE CASCADE,
    overall_score DECIMAL(3,2),
    originality INTEGER,
    relevance INTEGER,
    methodology INTEGER,
    presentation INTEGER,
    technical_quality INTEGER,
    comments_author TEXT,
    comments_chair TEXT,
    decision VARCHAR(20) CHECK (decision IN ('accept','minor_revision','major_revision','reject')),
    confidence VARCHAR(10) NOT NULL CHECK (confidence IN ('high','medium','low')),
    is_submitted BOOLEAN NOT NULL DEFAULT FALSE,
    submission_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

-- 14. paper_topics
CREATE TABLE paper_topics (
    paper_id BIGINT NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
    topic_id BIGINT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (paper_id, topic_id)
);

-- 15. reviewer_expertise
CREATE TABLE reviewer_expertise (
    reviewer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id BIGINT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    proficiency_level VARCHAR(20) NOT NULL CHECK (proficiency_level IN ('beginner','intermediate','expert')),
    PRIMARY KEY (reviewer_id, topic_id)
);

-- 16. scientific_sessions
CREATE TABLE scientific_sessions (
    id BIGSERIAL PRIMARY KEY,
    conf_id BIGINT NOT NULL REFERENCES conferences(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    session_type VARCHAR(20) NOT NULL CHECK (session_type IN ('oral','poster','keynote','workshop')),
    chair_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    room VARCHAR(100),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    max_attendees INTEGER,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

-- 17. session_papers
CREATE TABLE session_papers (
    session_id BIGINT NOT NULL REFERENCES scientific_sessions(id) ON DELETE CASCADE,
    paper_id BIGINT NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
    presentation_order INTEGER NOT NULL,
    presentation_time TIMESTAMPTZ,
    duration_minutes INTEGER NOT NULL,
    PRIMARY KEY (session_id, paper_id)
);

-- 18. certificates
CREATE TABLE certificates (
    id BIGSERIAL PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    conf_id BIGINT NOT NULL REFERENCES conferences(id) ON DELETE CASCADE,
    paper_id BIGINT REFERENCES papers(id) ON DELETE SET NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('participation','presentation','review','organizing')),
    file_path VARCHAR(255),
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

-- 19. conference_settings
CREATE TABLE conference_settings (
    id BIGSERIAL PRIMARY KEY,
    conf_id BIGINT NOT NULL REFERENCES conferences(id) ON DELETE CASCADE,
    key VARCHAR(255) NOT NULL,
    value TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

-- 20. notifications_log
CREATE TABLE notifications_log (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(20) NOT NULL CHECK (notification_type IN ('system','conference','paper','review')),
    related_id INTEGER,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

-- 21. activity_logs
CREATE TABLE activity_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

-- 22. initial_screenings
CREATE TABLE initial_screenings (
    id BIGSERIAL PRIMARY KEY,
    paper_id BIGINT NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
    screener_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plagiarism_score DECIMAL(5,2),
    format_check_passed BOOLEAN NOT NULL DEFAULT TRUE,
    completeness_check_passed BOOLEAN NOT NULL DEFAULT TRUE,
    result VARCHAR(20) NOT NULL CHECK (result IN ('pass','fail','revision_required')),
    comments TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

-- [Laravel System Tables]

-- 23. sessions
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id BIGINT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    payload TEXT NOT NULL,
    last_activity INTEGER NOT NULL
);

-- 24. jobs
CREATE TABLE IF NOT EXISTS jobs (
    id BIGSERIAL PRIMARY KEY,
    queue VARCHAR(255) NOT NULL,
    payload TEXT NOT NULL,
    attempts SMALLINT NOT NULL,
    reserved_at INTEGER NULL,
    available_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);

-- 25. failed_jobs
CREATE TABLE IF NOT EXISTS failed_jobs (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL UNIQUE,
    connection TEXT NOT NULL,
    queue TEXT NOT NULL,
    payload TEXT NOT NULL,
    exception TEXT NOT NULL,
    failed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 26. cache
CREATE TABLE IF NOT EXISTS cache (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT NOT NULL,
    expiration INTEGER NOT NULL
);

-- 27. cache_locks
CREATE TABLE IF NOT EXISTS cache_locks (
    key VARCHAR(255) PRIMARY KEY,
    owner VARCHAR(255) NOT NULL,
    expiration INTEGER NOT NULL
);

-- 28. job_batches
CREATE TABLE IF NOT EXISTS job_batches (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    total_jobs INTEGER NOT NULL,
    pending_jobs INTEGER NOT NULL,
    failed_jobs INTEGER NOT NULL,
    failed_job_ids TEXT NOT NULL,
    options TEXT NULL,
    cancelled_at INTEGER NULL,
    created_at INTEGER NOT NULL,
    finished_at INTEGER NULL
);

-- 29. personal_access_tokens
CREATE TABLE IF NOT EXISTS personal_access_tokens (
    id BIGSERIAL PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    abilities TEXT NULL,
    last_used_at TIMESTAMPTZ NULL,
    expires_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

-- 30. password_reset_tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    email VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NULL
);

-- 31. migrations
CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    migration VARCHAR(255) NOT NULL,
    batch INTEGER NOT NULL
);

-- 32. permission_user (found in Laragon)
CREATE TABLE IF NOT EXISTS permission_user (
    id BIGSERIAL PRIMARY KEY,
    permission_id BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);
-- Roles
INSERT INTO roles (id, name, slug) VALUES (1, 'Researcher', 'researcher');
INSERT INTO roles (id, name, slug) VALUES (2, 'Reviewer', 'reviewer');
INSERT INTO roles (id, name, slug) VALUES (3, 'Scientific Committee', 'scientific_committee');
INSERT INTO roles (id, name, slug) VALUES (4, 'Conference Chair', 'conference_chair');
INSERT INTO roles (id, name, slug) VALUES (5, 'Editorial Office', 'editorial_office');
INSERT INTO roles (id, name, slug) VALUES (6, 'Editor', 'editor');
INSERT INTO roles (id, name, slug) VALUES (7, 'System Administrator', 'system_admin');

-- Permissions
INSERT INTO permissions (id, name, slug) VALUES (1, 'Home View', 'home.view');
INSERT INTO permissions (id, name, slug) VALUES (2, 'About View', 'about.view');
INSERT INTO permissions (id, name, slug) VALUES (3, 'Conferences List', 'conferences.list');
INSERT INTO permissions (id, name, slug) VALUES (4, 'Conferences View Details', 'conferences.view_details');
INSERT INTO permissions (id, name, slug) VALUES (5, 'Conferences View Topics', 'conferences.view_topics');
INSERT INTO permissions (id, name, slug) VALUES (6, 'Conferences Search', 'conferences.search');
INSERT INTO permissions (id, name, slug) VALUES (7, 'Faq View', 'faq.view');
INSERT INTO permissions (id, name, slug) VALUES (8, 'Support Access', 'support.access');
INSERT INTO permissions (id, name, slug) VALUES (9, 'Auth Register', 'auth.register');
INSERT INTO permissions (id, name, slug) VALUES (10, 'Auth Login', 'auth.login');
INSERT INTO permissions (id, name, slug) VALUES (11, 'Auth Password Request', 'auth.password_request');
INSERT INTO permissions (id, name, slug) VALUES (12, 'Auth Logout', 'auth.logout');
INSERT INTO permissions (id, name, slug) VALUES (13, 'Profile View', 'profile.view');
INSERT INTO permissions (id, name, slug) VALUES (14, 'Profile Edit', 'profile.edit');
INSERT INTO permissions (id, name, slug) VALUES (15, 'Profile Change Password', 'profile.change_password');
INSERT INTO permissions (id, name, slug) VALUES (16, 'Profile Change Avatar', 'profile.change_avatar');
INSERT INTO permissions (id, name, slug) VALUES (17, 'Settings Manage Personal', 'settings.manage_personal');
INSERT INTO permissions (id, name, slug) VALUES (18, 'Notifications View', 'notifications.view');
INSERT INTO permissions (id, name, slug) VALUES (19, 'Activity Log View Personal', 'activity_log.view_personal');
INSERT INTO permissions (id, name, slug) VALUES (20, 'Conferences View Available', 'conferences.view_available');
INSERT INTO permissions (id, name, slug) VALUES (21, 'Conferences Register', 'conferences.register');
INSERT INTO permissions (id, name, slug) VALUES (22, 'Conferences Cancel Registration', 'conferences.cancel_registration');
INSERT INTO permissions (id, name, slug) VALUES (23, 'Papers Submit', 'papers.submit');
INSERT INTO permissions (id, name, slug) VALUES (24, 'Papers View Own', 'papers.view_own');
INSERT INTO permissions (id, name, slug) VALUES (25, 'Papers Edit', 'papers.edit');
INSERT INTO permissions (id, name, slug) VALUES (26, 'Papers Reupload', 'papers.reupload');
INSERT INTO permissions (id, name, slug) VALUES (27, 'Papers Withdraw', 'papers.withdraw');
INSERT INTO permissions (id, name, slug) VALUES (28, 'Papers Track Status', 'papers.track_status');
INSERT INTO permissions (id, name, slug) VALUES (29, 'Comments View', 'comments.view');
INSERT INTO permissions (id, name, slug) VALUES (30, 'Certificates Download Participation', 'certificates.download_participation');
INSERT INTO permissions (id, name, slug) VALUES (31, 'Certificates Download Acceptance', 'certificates.download_acceptance');
INSERT INTO permissions (id, name, slug) VALUES (32, 'Papers View Assigned', 'papers.view_assigned');
INSERT INTO permissions (id, name, slug) VALUES (33, 'Papers Download', 'papers.download');
INSERT INTO permissions (id, name, slug) VALUES (34, 'Reviews Fill Form', 'reviews.fill_form');
INSERT INTO permissions (id, name, slug) VALUES (35, 'Reviews Submit', 'reviews.submit');
INSERT INTO permissions (id, name, slug) VALUES (36, 'Reviews Decision Recommend', 'reviews.decision_recommend');
INSERT INTO permissions (id, name, slug) VALUES (37, 'Reviews View Completed', 'reviews.view_completed');
INSERT INTO permissions (id, name, slug) VALUES (38, 'Reviews View History', 'reviews.view_history');
INSERT INTO permissions (id, name, slug) VALUES (39, 'Guide View Reviewer', 'guide.view_reviewer');
INSERT INTO permissions (id, name, slug) VALUES (40, 'Notifications Assignment Receive', 'notifications.assignment_receive');
INSERT INTO permissions (id, name, slug) VALUES (41, 'Conferences Create', 'conferences.create');
INSERT INTO permissions (id, name, slug) VALUES (42, 'Conferences Edit', 'conferences.edit');
INSERT INTO permissions (id, name, slug) VALUES (43, 'Conferences Close', 'conferences.close');
INSERT INTO permissions (id, name, slug) VALUES (44, 'Papers View All', 'papers.view_all');
INSERT INTO permissions (id, name, slug) VALUES (45, 'Papers Filter', 'papers.filter');
INSERT INTO permissions (id, name, slug) VALUES (46, 'Papers Initial Decision', 'papers.initial_decision');
INSERT INTO permissions (id, name, slug) VALUES (47, 'Reviewers Add', 'reviewers.add');
INSERT INTO permissions (id, name, slug) VALUES (48, 'Reviewers Edit', 'reviewers.edit');
INSERT INTO permissions (id, name, slug) VALUES (49, 'Reviewers Assign', 'reviewers.assign');
INSERT INTO permissions (id, name, slug) VALUES (50, 'Reviews View Evaluations', 'reviews.view_evaluations');
INSERT INTO permissions (id, name, slug) VALUES (51, 'Reviews Recommendation', 'reviews.recommendation');
INSERT INTO permissions (id, name, slug) VALUES (52, 'Sessions Create', 'sessions.create');
INSERT INTO permissions (id, name, slug) VALUES (53, 'Sessions Schedule', 'sessions.schedule');
INSERT INTO permissions (id, name, slug) VALUES (54, 'Sessions Prepare Program', 'sessions.prepare_program');
INSERT INTO permissions (id, name, slug) VALUES (55, 'Certificates Generate', 'certificates.generate');
INSERT INTO permissions (id, name, slug) VALUES (56, 'Certificates Approve', 'certificates.approve');
INSERT INTO permissions (id, name, slug) VALUES (57, 'Reports Papers', 'reports.papers');
INSERT INTO permissions (id, name, slug) VALUES (58, 'Reports Reviewers', 'reports.reviewers');
INSERT INTO permissions (id, name, slug) VALUES (59, 'Reports Stats', 'reports.stats');
INSERT INTO permissions (id, name, slug) VALUES (60, 'Conference Monitor', 'conference.monitor');
INSERT INTO permissions (id, name, slug) VALUES (61, 'Kpi View', 'kpi.view');
INSERT INTO permissions (id, name, slug) VALUES (62, 'Decisions Approve Reviews', 'decisions.approve_reviews');
INSERT INTO permissions (id, name, slug) VALUES (63, 'Decisions Approve Final Papers', 'decisions.approve_final_papers');
INSERT INTO permissions (id, name, slug) VALUES (64, 'Sessions Approve', 'sessions.approve');
INSERT INTO permissions (id, name, slug) VALUES (65, 'Program Approve Final', 'program.approve_final');
INSERT INTO permissions (id, name, slug) VALUES (66, 'Reports Final', 'reports.final');
INSERT INTO permissions (id, name, slug) VALUES (67, 'Reports General Stats', 'reports.general_stats');
INSERT INTO permissions (id, name, slug) VALUES (68, 'Papers Check Compliance', 'papers.check_compliance');
INSERT INTO permissions (id, name, slug) VALUES (69, 'Papers Initial Accept Reject', 'papers.initial_accept_reject');
INSERT INTO permissions (id, name, slug) VALUES (70, 'Reviews Monitor Progress', 'reviews.monitor_progress');
INSERT INTO permissions (id, name, slug) VALUES (71, 'Communication Contact Researchers', 'communication.contact_researchers');
INSERT INTO permissions (id, name, slug) VALUES (72, 'Communication Contact Reviewers', 'communication.contact_reviewers');
INSERT INTO permissions (id, name, slug) VALUES (73, 'Communication Manage Official', 'communication.manage_official');
INSERT INTO permissions (id, name, slug) VALUES (74, 'Notifications Receive All Workflow', 'notifications.receive_all_workflow');
INSERT INTO permissions (id, name, slug) VALUES (75, 'Papers Review Language', 'papers.review_language');
INSERT INTO permissions (id, name, slug) VALUES (76, 'Papers Review Technical', 'papers.review_technical');
INSERT INTO permissions (id, name, slug) VALUES (77, 'Papers Request Revision', 'papers.request_revision');
INSERT INTO permissions (id, name, slug) VALUES (78, 'Papers Send To Review', 'papers.send_to_review');
INSERT INTO permissions (id, name, slug) VALUES (79, 'Papers Approve Final Version', 'papers.approve_final_version');
INSERT INTO permissions (id, name, slug) VALUES (80, 'Users Create', 'users.create');
INSERT INTO permissions (id, name, slug) VALUES (81, 'Users Edit', 'users.edit');
INSERT INTO permissions (id, name, slug) VALUES (82, 'Users Delete', 'users.delete');
INSERT INTO permissions (id, name, slug) VALUES (83, 'Users Manage Roles', 'users.manage_roles');
INSERT INTO permissions (id, name, slug) VALUES (84, 'Conferences Manage All', 'conferences.manage_all');
INSERT INTO permissions (id, name, slug) VALUES (85, 'Settings General', 'settings.general');
INSERT INTO permissions (id, name, slug) VALUES (86, 'Settings Templates', 'settings.templates');
INSERT INTO permissions (id, name, slug) VALUES (87, 'Settings Security', 'settings.security');
INSERT INTO permissions (id, name, slug) VALUES (88, 'Reports All', 'reports.all');
INSERT INTO permissions (id, name, slug) VALUES (89, 'Backups Create', 'backups.create');
INSERT INTO permissions (id, name, slug) VALUES (90, 'Backups Restore', 'backups.restore');
INSERT INTO permissions (id, name, slug) VALUES (91, 'Logs View', 'logs.view');

-- Permission-Role Mapping
INSERT INTO permission_role (permission_id, role_id) VALUES (20, 1);
INSERT INTO permission_role (permission_id, role_id) VALUES (21, 1);
INSERT INTO permission_role (permission_id, role_id) VALUES (22, 1);
INSERT INTO permission_role (permission_id, role_id) VALUES (23, 1);
INSERT INTO permission_role (permission_id, role_id) VALUES (24, 1);
INSERT INTO permission_role (permission_id, role_id) VALUES (25, 1);
INSERT INTO permission_role (permission_id, role_id) VALUES (26, 1);
INSERT INTO permission_role (permission_id, role_id) VALUES (27, 1);
INSERT INTO permission_role (permission_id, role_id) VALUES (28, 1);
INSERT INTO permission_role (permission_id, role_id) VALUES (29, 1);
INSERT INTO permission_role (permission_id, role_id) VALUES (30, 1);
INSERT INTO permission_role (permission_id, role_id) VALUES (31, 1);
INSERT INTO permission_role (permission_id, role_id) VALUES (12, 1);
INSERT INTO permission_role (permission_id, role_id) VALUES (13, 1);
INSERT INTO permission_role (permission_id, role_id) VALUES (14, 1);
INSERT INTO permission_role (permission_id, role_id) VALUES (15, 1);
INSERT INTO permission_role (permission_id, role_id) VALUES (16, 1);
INSERT INTO permission_role (permission_id, role_id) VALUES (17, 1);
INSERT INTO permission_role (permission_id, role_id) VALUES (18, 1);
INSERT INTO permission_role (permission_id, role_id) VALUES (19, 1);
INSERT INTO permission_role (permission_id, role_id) VALUES (32, 2);
INSERT INTO permission_role (permission_id, role_id) VALUES (33, 2);
INSERT INTO permission_role (permission_id, role_id) VALUES (34, 2);
INSERT INTO permission_role (permission_id, role_id) VALUES (35, 2);
INSERT INTO permission_role (permission_id, role_id) VALUES (36, 2);
INSERT INTO permission_role (permission_id, role_id) VALUES (37, 2);
INSERT INTO permission_role (permission_id, role_id) VALUES (38, 2);
INSERT INTO permission_role (permission_id, role_id) VALUES (39, 2);
INSERT INTO permission_role (permission_id, role_id) VALUES (40, 2);
INSERT INTO permission_role (permission_id, role_id) VALUES (12, 2);
INSERT INTO permission_role (permission_id, role_id) VALUES (13, 2);
INSERT INTO permission_role (permission_id, role_id) VALUES (14, 2);
INSERT INTO permission_role (permission_id, role_id) VALUES (15, 2);
INSERT INTO permission_role (permission_id, role_id) VALUES (16, 2);
INSERT INTO permission_role (permission_id, role_id) VALUES (17, 2);
INSERT INTO permission_role (permission_id, role_id) VALUES (18, 2);
INSERT INTO permission_role (permission_id, role_id) VALUES (19, 2);
INSERT INTO permission_role (permission_id, role_id) VALUES (41, 3);
INSERT INTO permission_role (permission_id, role_id) VALUES (42, 3);
INSERT INTO permission_role (permission_id, role_id) VALUES (43, 3);
INSERT INTO permission_role (permission_id, role_id) VALUES (44, 3);
INSERT INTO permission_role (permission_id, role_id) VALUES (45, 3);
INSERT INTO permission_role (permission_id, role_id) VALUES (46, 3);
INSERT INTO permission_role (permission_id, role_id) VALUES (47, 3);
INSERT INTO permission_role (permission_id, role_id) VALUES (48, 3);
INSERT INTO permission_role (permission_id, role_id) VALUES (49, 3);
INSERT INTO permission_role (permission_id, role_id) VALUES (50, 3);
INSERT INTO permission_role (permission_id, role_id) VALUES (51, 3);
INSERT INTO permission_role (permission_id, role_id) VALUES (52, 3);
INSERT INTO permission_role (permission_id, role_id) VALUES (53, 3);
INSERT INTO permission_role (permission_id, role_id) VALUES (54, 3);
INSERT INTO permission_role (permission_id, role_id) VALUES (55, 3);
INSERT INTO permission_role (permission_id, role_id) VALUES (56, 3);
INSERT INTO permission_role (permission_id, role_id) VALUES (57, 3);
INSERT INTO permission_role (permission_id, role_id) VALUES (58, 3);
INSERT INTO permission_role (permission_id, role_id) VALUES (59, 3);
INSERT INTO permission_role (permission_id, role_id) VALUES (12, 3);
INSERT INTO permission_role (permission_id, role_id) VALUES (13, 3);
INSERT INTO permission_role (permission_id, role_id) VALUES (14, 3);
INSERT INTO permission_role (permission_id, role_id) VALUES (15, 3);
INSERT INTO permission_role (permission_id, role_id) VALUES (16, 3);
INSERT INTO permission_role (permission_id, role_id) VALUES (17, 3);
INSERT INTO permission_role (permission_id, role_id) VALUES (18, 3);
INSERT INTO permission_role (permission_id, role_id) VALUES (19, 3);
INSERT INTO permission_role (permission_id, role_id) VALUES (60, 4);
INSERT INTO permission_role (permission_id, role_id) VALUES (61, 4);
INSERT INTO permission_role (permission_id, role_id) VALUES (62, 4);
INSERT INTO permission_role (permission_id, role_id) VALUES (63, 4);
INSERT INTO permission_role (permission_id, role_id) VALUES (64, 4);
INSERT INTO permission_role (permission_id, role_id) VALUES (65, 4);
INSERT INTO permission_role (permission_id, role_id) VALUES (66, 4);
INSERT INTO permission_role (permission_id, role_id) VALUES (67, 4);
INSERT INTO permission_role (permission_id, role_id) VALUES (12, 4);
INSERT INTO permission_role (permission_id, role_id) VALUES (13, 4);
INSERT INTO permission_role (permission_id, role_id) VALUES (14, 4);
INSERT INTO permission_role (permission_id, role_id) VALUES (15, 4);
INSERT INTO permission_role (permission_id, role_id) VALUES (16, 4);
INSERT INTO permission_role (permission_id, role_id) VALUES (17, 4);
INSERT INTO permission_role (permission_id, role_id) VALUES (18, 4);
INSERT INTO permission_role (permission_id, role_id) VALUES (19, 4);
INSERT INTO permission_role (permission_id, role_id) VALUES (68, 5);
INSERT INTO permission_role (permission_id, role_id) VALUES (69, 5);
INSERT INTO permission_role (permission_id, role_id) VALUES (70, 5);
INSERT INTO permission_role (permission_id, role_id) VALUES (71, 5);
INSERT INTO permission_role (permission_id, role_id) VALUES (72, 5);
INSERT INTO permission_role (permission_id, role_id) VALUES (73, 5);
INSERT INTO permission_role (permission_id, role_id) VALUES (74, 5);
INSERT INTO permission_role (permission_id, role_id) VALUES (12, 5);
INSERT INTO permission_role (permission_id, role_id) VALUES (13, 5);
INSERT INTO permission_role (permission_id, role_id) VALUES (14, 5);
INSERT INTO permission_role (permission_id, role_id) VALUES (15, 5);
INSERT INTO permission_role (permission_id, role_id) VALUES (16, 5);
INSERT INTO permission_role (permission_id, role_id) VALUES (17, 5);
INSERT INTO permission_role (permission_id, role_id) VALUES (18, 5);
INSERT INTO permission_role (permission_id, role_id) VALUES (19, 5);
INSERT INTO permission_role (permission_id, role_id) VALUES (75, 6);
INSERT INTO permission_role (permission_id, role_id) VALUES (76, 6);
INSERT INTO permission_role (permission_id, role_id) VALUES (77, 6);
INSERT INTO permission_role (permission_id, role_id) VALUES (78, 6);
INSERT INTO permission_role (permission_id, role_id) VALUES (79, 6);
INSERT INTO permission_role (permission_id, role_id) VALUES (12, 6);
INSERT INTO permission_role (permission_id, role_id) VALUES (13, 6);
INSERT INTO permission_role (permission_id, role_id) VALUES (14, 6);
INSERT INTO permission_role (permission_id, role_id) VALUES (15, 6);
INSERT INTO permission_role (permission_id, role_id) VALUES (16, 6);
INSERT INTO permission_role (permission_id, role_id) VALUES (17, 6);
INSERT INTO permission_role (permission_id, role_id) VALUES (18, 6);
INSERT INTO permission_role (permission_id, role_id) VALUES (19, 6);
INSERT INTO permission_role (permission_id, role_id) VALUES (80, 7);
INSERT INTO permission_role (permission_id, role_id) VALUES (81, 7);
INSERT INTO permission_role (permission_id, role_id) VALUES (82, 7);
INSERT INTO permission_role (permission_id, role_id) VALUES (83, 7);
INSERT INTO permission_role (permission_id, role_id) VALUES (84, 7);
INSERT INTO permission_role (permission_id, role_id) VALUES (85, 7);
INSERT INTO permission_role (permission_id, role_id) VALUES (86, 7);
INSERT INTO permission_role (permission_id, role_id) VALUES (87, 7);
INSERT INTO permission_role (permission_id, role_id) VALUES (88, 7);
INSERT INTO permission_role (permission_id, role_id) VALUES (89, 7);
INSERT INTO permission_role (permission_id, role_id) VALUES (90, 7);
INSERT INTO permission_role (permission_id, role_id) VALUES (91, 7);
INSERT INTO permission_role (permission_id, role_id) VALUES (12, 7);
INSERT INTO permission_role (permission_id, role_id) VALUES (13, 7);
INSERT INTO permission_role (permission_id, role_id) VALUES (14, 7);
INSERT INTO permission_role (permission_id, role_id) VALUES (15, 7);
INSERT INTO permission_role (permission_id, role_id) VALUES (16, 7);
INSERT INTO permission_role (permission_id, role_id) VALUES (17, 7);
INSERT INTO permission_role (permission_id, role_id) VALUES (18, 7);
INSERT INTO permission_role (permission_id, role_id) VALUES (19, 7);
