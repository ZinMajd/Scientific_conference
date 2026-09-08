-- =============================================================
-- نظام إدارة المؤتمرات العلمية المحكمة - جامعة إقليم سبأ
-- ملف قاعدة البيانات (Schema + البيانات الأساسية)
-- تاريخ التصدير: 2026-09-08 00:37:35
-- محرك قاعدة البيانات: PostgreSQL
-- =============================================================

-- =============================================================
-- الجداول الموجودة في قاعدة البيانات:
-- activity_logs, announcements, attendees, cache, cache_locks, certificates, coauthors, conference_settings, conferences, conflicts, email_logs, failed_jobs, initial_screenings, job_batches, jobs, migrations, notifications, notifications_log, paper_assignments, paper_attachments, paper_events, paper_reviews, paper_status_history, paper_topics, paper_versions, papers, password_reset_tokens, permission_role, permission_user, permissions, personal_access_tokens, production_tasks, publications, reviewer_expertise, reviewer_invitations, reviews, role_user, roles, scientific_sessions, screening_decisions, session_papers, sessions, support_messages, topics, users
-- =============================================================

-- -------------------------------------------------------------
-- جدول: activity_logs
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activity_logs (
    id BIGINT NOT NULL DEFAULT nextval('activity_logs_id_seq'::regclass),
    user_id BIGINT NULL,
    action CHARACTER VARYING(100) NOT NULL,
    description TEXT NULL,
    ip_address CHARACTER VARYING(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: announcements
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS announcements (
    id BIGINT NOT NULL DEFAULT nextval('announcements_id_seq'::regclass),
    title CHARACTER VARYING(255) NOT NULL,
    content TEXT NOT NULL,
    image_url CHARACTER VARYING(255) NULL,
    publish_date DATE NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: attendees
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendees (
    id BIGINT NOT NULL DEFAULT nextval('attendees_id_seq'::regclass),
    user_id BIGINT NULL,
    conf_id BIGINT NOT NULL,
    full_name CHARACTER VARYING(100) NOT NULL,
    email CHARACTER VARYING(100) NOT NULL,
    affiliation CHARACTER VARYING(200) NULL,
    registration_type CHARACTER VARYING(255) NOT NULL,
    payment_status CHARACTER VARYING(255) NOT NULL DEFAULT 'pending'::character varying,
    payment_amount NUMERIC NULL,
    payment_date TIMESTAMP WITHOUT TIME ZONE NULL,
    receipt_number CHARACTER VARYING(50) NULL,
    has_certificate BOOLEAN NOT NULL DEFAULT false,
    certificate_sent_date TIMESTAMP WITHOUT TIME ZONE NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: cache
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cache (
    key CHARACTER VARYING(255) NOT NULL,
    value TEXT NOT NULL,
    expiration INTEGER NOT NULL,
    PRIMARY KEY (key)
);

-- -------------------------------------------------------------
-- جدول: cache_locks
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cache_locks (
    key CHARACTER VARYING(255) NOT NULL,
    owner CHARACTER VARYING(255) NOT NULL,
    expiration INTEGER NOT NULL,
    PRIMARY KEY (key)
);

-- -------------------------------------------------------------
-- جدول: certificates
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS certificates (
    id BIGINT NOT NULL DEFAULT nextval('certificates_id_seq'::regclass),
    uuid UUID NOT NULL,
    user_id BIGINT NOT NULL,
    conf_id BIGINT NOT NULL,
    paper_id BIGINT NULL,
    type CHARACTER VARYING(255) NOT NULL,
    file_path CHARACTER VARYING(255) NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: coauthors
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS coauthors (
    id BIGINT NOT NULL DEFAULT nextval('coauthors_id_seq'::regclass),
    paper_id BIGINT NOT NULL,
    full_name CHARACTER VARYING(100) NOT NULL,
    email CHARACTER VARYING(100) NOT NULL,
    affiliation CHARACTER VARYING(200) NULL,
    country CHARACTER VARYING(100) NULL,
    author_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: conference_settings
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS conference_settings (
    id BIGINT NOT NULL DEFAULT nextval('conference_settings_id_seq'::regclass),
    conf_id BIGINT NOT NULL,
    key CHARACTER VARYING(255) NOT NULL,
    value TEXT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: conferences
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS conferences (
    id BIGINT NOT NULL DEFAULT nextval('conferences_id_seq'::regclass),
    chair_id BIGINT NOT NULL,
    title CHARACTER VARYING(200) NOT NULL,
    description TEXT NOT NULL,
    short_name CHARACTER VARYING(50) NULL,
    venue CHARACTER VARYING(200) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    submission_deadline TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    review_deadline TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    notification_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    camera_ready_deadline TIMESTAMP WITHOUT TIME ZONE NULL,
    registration_deadline TIMESTAMP WITHOUT TIME ZONE NULL,
    registration_fee NUMERIC NOT NULL DEFAULT '0'::numeric,
    max_papers INTEGER NULL,
    status CHARACTER VARYING(255) NOT NULL DEFAULT 'draft'::character varying,
    website_url CHARACTER VARYING(255) NULL,
    contact_email CHARACTER VARYING(100) NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    image_url CHARACTER VARYING(255) NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: conflicts
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS conflicts (
    id BIGINT NOT NULL DEFAULT nextval('conflicts_id_seq'::regclass),
    user_id BIGINT NOT NULL,
    paper_id BIGINT NOT NULL,
    type CHARACTER VARYING(255) NOT NULL DEFAULT 'author_conflict'::character varying,
    reason TEXT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: email_logs
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS email_logs (
    id BIGINT NOT NULL DEFAULT nextval('email_logs_id_seq'::regclass),
    to_email CHARACTER VARYING(255) NOT NULL,
    subject CHARACTER VARYING(255) NOT NULL,
    status CHARACTER VARYING(255) NOT NULL DEFAULT 'sent'::character varying,
    error_message TEXT NULL,
    sent_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: failed_jobs
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS failed_jobs (
    id BIGINT NOT NULL DEFAULT nextval('failed_jobs_id_seq'::regclass),
    uuid CHARACTER VARYING(255) NOT NULL,
    connection TEXT NOT NULL,
    queue TEXT NOT NULL,
    payload TEXT NOT NULL,
    exception TEXT NOT NULL,
    failed_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: initial_screenings
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS initial_screenings (
    id BIGINT NOT NULL DEFAULT nextval('initial_screenings_id_seq'::regclass),
    paper_id BIGINT NOT NULL,
    screener_id BIGINT NOT NULL,
    plagiarism_score NUMERIC NULL,
    format_check_passed BOOLEAN NOT NULL DEFAULT true,
    completeness_check_passed BOOLEAN NOT NULL DEFAULT true,
    result CHARACTER VARYING(50) NOT NULL,
    comments TEXT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: job_batches
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS job_batches (
    id CHARACTER VARYING(255) NOT NULL,
    name CHARACTER VARYING(255) NOT NULL,
    total_jobs INTEGER NOT NULL,
    pending_jobs INTEGER NOT NULL,
    failed_jobs INTEGER NOT NULL,
    failed_job_ids TEXT NOT NULL,
    options TEXT NULL,
    cancelled_at INTEGER NULL,
    created_at INTEGER NOT NULL,
    finished_at INTEGER NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: jobs
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS jobs (
    id BIGINT NOT NULL DEFAULT nextval('jobs_id_seq'::regclass),
    queue CHARACTER VARYING(255) NOT NULL,
    payload TEXT NOT NULL,
    attempts SMALLINT NOT NULL,
    reserved_at INTEGER NULL,
    available_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: migrations
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER NOT NULL DEFAULT nextval('migrations_id_seq'::regclass),
    migration CHARACTER VARYING(255) NOT NULL,
    batch INTEGER NOT NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: notifications
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id UUID NOT NULL,
    type CHARACTER VARYING(255) NOT NULL,
    notifiable_type CHARACTER VARYING(255) NOT NULL,
    notifiable_id BIGINT NOT NULL,
    data TEXT NOT NULL,
    read_at TIMESTAMP WITHOUT TIME ZONE NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: notifications_log
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications_log (
    id BIGINT NOT NULL DEFAULT nextval('notifications_log_id_seq'::regclass),
    user_id BIGINT NOT NULL,
    title CHARACTER VARYING(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type CHARACTER VARYING(255) NOT NULL,
    related_id INTEGER NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    read_at TIMESTAMP WITHOUT TIME ZONE NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: paper_assignments
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS paper_assignments (
    id BIGINT NOT NULL DEFAULT nextval('paper_assignments_id_seq'::regclass),
    paper_id BIGINT NOT NULL,
    reviewer_id BIGINT NOT NULL,
    assigned_by BIGINT NOT NULL,
    due_date TIMESTAMP WITHOUT TIME ZONE NULL,
    status CHARACTER VARYING(255) NOT NULL DEFAULT 'assigned'::character varying,
    decline_reason TEXT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: paper_attachments
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS paper_attachments (
    id BIGINT NOT NULL DEFAULT nextval('paper_attachments_id_seq'::regclass),
    paper_id BIGINT NOT NULL,
    file_path CHARACTER VARYING(500) NOT NULL,
    file_name CHARACTER VARYING(255) NOT NULL,
    file_size INTEGER NOT NULL,
    file_type CHARACTER VARYING(50) NOT NULL,
    is_main_manuscript BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: paper_events
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS paper_events (
    id BIGINT NOT NULL DEFAULT nextval('paper_events_id_seq'::regclass),
    paper_id BIGINT NOT NULL,
    event_type CHARACTER VARYING(255) NOT NULL,
    from_status CHARACTER VARYING(255) NULL,
    to_status CHARACTER VARYING(255) NULL,
    user_id BIGINT NULL,
    notes TEXT NULL,
    metadata JSON NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: paper_reviews
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS paper_reviews (
    id BIGINT NOT NULL DEFAULT nextval('paper_reviews_id_seq'::regclass),
    paper_id BIGINT NOT NULL,
    reviewer_id BIGINT NOT NULL,
    assignment_id BIGINT NOT NULL,
    originality_score INTEGER NOT NULL DEFAULT 0,
    methodology_score INTEGER NOT NULL DEFAULT 0,
    results_score INTEGER NOT NULL DEFAULT 0,
    clarity_score INTEGER NOT NULL DEFAULT 0,
    total_avg_score NUMERIC NOT NULL DEFAULT '0'::numeric,
    comments_to_author TEXT NULL,
    comments_to_editor TEXT NULL,
    recommendation CHARACTER VARYING(255) NOT NULL DEFAULT 'accept'::character varying,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    report_file_path CHARACTER VARYING(255) NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: paper_status_history
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS paper_status_history (
    id BIGINT NOT NULL DEFAULT nextval('paper_status_history_id_seq'::regclass),
    paper_id BIGINT NOT NULL,
    status CHARACTER VARYING(255) NOT NULL,
    changed_by BIGINT NULL,
    note TEXT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: paper_topics
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS paper_topics (
    paper_id BIGINT NOT NULL,
    topic_id BIGINT NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY (paper_id, topic_id)
);

-- -------------------------------------------------------------
-- جدول: paper_versions
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS paper_versions (
    id BIGINT NOT NULL DEFAULT nextval('paper_versions_id_seq'::regclass),
    paper_id BIGINT NOT NULL,
    version_number INTEGER NOT NULL DEFAULT 1,
    file_path CHARACTER VARYING(255) NOT NULL,
    response_letter_path CHARACTER VARYING(255) NULL,
    author_comments TEXT NULL,
    type CHARACTER VARYING(255) NOT NULL DEFAULT 'original'::character varying,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: papers
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS papers (
    id BIGINT NOT NULL DEFAULT nextval('papers_id_seq'::regclass),
    author_id BIGINT NOT NULL,
    conf_id BIGINT NOT NULL,
    title CHARACTER VARYING(300) NOT NULL,
    abstract TEXT NOT NULL,
    keywords CHARACTER VARYING(500) NOT NULL,
    file_path CHARACTER VARYING(500) NOT NULL,
    file_name CHARACTER VARYING(255) NOT NULL,
    file_size INTEGER NOT NULL,
    file_type CHARACTER VARYING(50) NOT NULL,
    status CHARACTER VARYING(50) NOT NULL,
    track CHARACTER VARYING(100) NULL,
    decision_date TIMESTAMP WITHOUT TIME ZONE NULL,
    final_decision CHARACTER VARYING(255) NULL,
    decision_notes TEXT NULL,
    is_published BOOLEAN NOT NULL DEFAULT false,
    doi CHARACTER VARYING(100) NULL,
    page_numbers CHARACTER VARYING(20) NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    tracking_number CHARACTER VARYING(50) NULL,
    revision_deadline TIMESTAMP WITHOUT TIME ZONE NULL,
    publication_selected BOOLEAN NOT NULL DEFAULT false,
    presentation_type CHARACTER VARYING(255) NOT NULL DEFAULT 'none'::character varying,
    participation_mode CHARACTER VARYING(255) NOT NULL DEFAULT 'none'::character varying,
    invitation_sent_at TIMESTAMP WITHOUT TIME ZONE NULL,
    access_link CHARACTER VARYING(500) NULL,
    blind_file_path CHARACTER VARYING(255) NULL,
    publish_at TIMESTAMP WITHOUT TIME ZONE NULL,
    final_file_path CHARACTER VARYING(255) NULL,
    view_count INTEGER NOT NULL DEFAULT 0,
    download_count INTEGER NOT NULL DEFAULT 0,
    thumbnail_path CHARACTER VARYING(255) NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: password_reset_tokens
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    email CHARACTER VARYING(255) NOT NULL,
    token CHARACTER VARYING(255) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (email)
);

-- -------------------------------------------------------------
-- جدول: permission_role
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS permission_role (
    id BIGINT NOT NULL DEFAULT nextval('permission_role_id_seq'::regclass),
    permission_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: permission_user
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS permission_user (
    id BIGINT NOT NULL DEFAULT nextval('permission_user_id_seq'::regclass),
    permission_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: permissions
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS permissions (
    id BIGINT NOT NULL DEFAULT nextval('permissions_id_seq'::regclass),
    name CHARACTER VARYING(255) NOT NULL,
    slug CHARACTER VARYING(255) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (id)
);

-- البيانات الأساسية لجدول permissions:
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('1', 'Home View', 'home.view', '2026-05-20 17:49:19', '2026-05-20 17:49:19') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('2', 'About View', 'about.view', '2026-05-20 17:49:20', '2026-05-20 17:49:20') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('3', 'Conferences List', 'conferences.list', '2026-05-20 17:49:20', '2026-05-20 17:49:20') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('4', 'Conferences View Details', 'conferences.view_details', '2026-05-20 17:49:21', '2026-05-20 17:49:21') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('5', 'Conferences View Topics', 'conferences.view_topics', '2026-05-20 17:49:22', '2026-05-20 17:49:22') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('6', 'Conferences Search', 'conferences.search', '2026-05-20 17:49:22', '2026-05-20 17:49:22') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('7', 'Faq View', 'faq.view', '2026-05-20 17:49:23', '2026-05-20 17:49:23') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('8', 'Support Access', 'support.access', '2026-05-20 17:49:24', '2026-05-20 17:49:24') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('9', 'Auth Register', 'auth.register', '2026-05-20 17:49:25', '2026-05-20 17:49:25') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('10', 'Auth Login', 'auth.login', '2026-05-20 17:49:25', '2026-05-20 17:49:25') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('11', 'Auth Password Request', 'auth.password_request', '2026-05-20 17:49:26', '2026-05-20 17:49:26') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('12', 'Auth Logout', 'auth.logout', '2026-05-20 17:49:27', '2026-05-20 17:49:27') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('13', 'Profile View', 'profile.view', '2026-05-20 17:49:27', '2026-05-20 17:49:27') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('14', 'Profile Edit', 'profile.edit', '2026-05-20 17:49:28', '2026-05-20 17:49:28') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('15', 'Profile Change Password', 'profile.change_password', '2026-05-20 17:49:29', '2026-05-20 17:49:29') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('16', 'Profile Change Avatar', 'profile.change_avatar', '2026-05-20 17:49:29', '2026-05-20 17:49:29') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('17', 'Settings Manage Personal', 'settings.manage_personal', '2026-05-20 17:49:30', '2026-05-20 17:49:30') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('18', 'Notifications View', 'notifications.view', '2026-05-20 17:49:31', '2026-05-20 17:49:31') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('19', 'Activity Log View Personal', 'activity_log.view_personal', '2026-05-20 17:49:31', '2026-05-20 17:49:31') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('20', 'Paper Create', 'paper.create', '2026-05-20 17:49:32', '2026-05-20 17:49:32') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('21', 'Paper Edit Draft', 'paper.edit_draft', '2026-05-20 17:49:33', '2026-05-20 17:49:33') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('22', 'Paper Upload Files', 'paper.upload_files', '2026-05-20 17:49:34', '2026-05-20 17:49:34') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('23', 'Paper View Status', 'paper.view_status', '2026-05-20 17:49:34', '2026-05-20 17:49:34') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('24', 'Paper Respond To Reviews', 'paper.respond_to_reviews', '2026-05-20 17:49:35', '2026-05-20 17:49:35') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('25', 'Review Accept Reject Assignment', 'review.accept_reject_assignment', '2026-05-20 17:49:36', '2026-05-20 17:49:36') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('26', 'Review Submit', 'review.submit', '2026-05-20 17:49:36', '2026-05-20 17:49:36') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('27', 'Review Update', 'review.update', '2026-05-20 17:49:37', '2026-05-20 17:49:37') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('28', 'Paper View Blind Only', 'paper.view_blind_only', '2026-05-20 17:49:38', '2026-05-20 17:49:38') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('29', 'Reviewer Assign', 'reviewer.assign', '2026-05-20 17:49:38', '2026-05-20 17:49:38') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('30', 'Workflow Manage', 'workflow.manage', '2026-05-20 17:49:39', '2026-05-20 17:49:39') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('31', 'Paper View All', 'paper.view_all', '2026-05-20 17:49:40', '2026-05-20 17:49:40') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('32', 'Paper Request Revision', 'paper.request_revision', '2026-05-20 17:49:40', '2026-05-20 17:49:40') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('33', 'Decision Recommend', 'decision.recommend', '2026-05-20 17:49:41', '2026-05-20 17:49:41') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('34', 'Screening Initial', 'screening.initial', '2026-05-20 17:49:42', '2026-05-20 17:49:42') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('35', 'File Validation', 'file.validation', '2026-05-20 17:49:43', '2026-05-20 17:49:43') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('36', 'Plagiarism Check', 'plagiarism.check', '2026-05-20 17:49:43', '2026-05-20 17:49:43') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('37', 'Notifications Manage', 'notifications.manage', '2026-05-20 17:49:44', '2026-05-20 17:49:44') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('38', 'Data Entry Support', 'data_entry.support', '2026-05-20 17:49:45', '2026-05-20 17:49:45') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('39', 'Reviewer Approve', 'reviewer.approve', '2026-05-20 17:49:45', '2026-05-20 17:49:45') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('40', 'Decision Approve', 'decision.approve', '2026-05-20 17:49:46', '2026-05-20 17:49:46') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('41', 'Quality Evaluate', 'quality.evaluate', '2026-05-20 17:49:47', '2026-05-20 17:49:47') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('42', 'Acceptance Threshold Define', 'acceptance_threshold.define', '2026-05-20 17:49:47', '2026-05-20 17:49:47') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('43', 'Decision Final Override', 'decision.final_override', '2026-05-20 17:49:48', '2026-05-20 17:49:48') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('44', 'Acceptance List Approve', 'acceptance_list.approve', '2026-05-20 17:49:49', '2026-05-20 17:49:49') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('45', 'Conference Structure Manage', 'conference_structure.manage', '2026-05-20 17:49:49', '2026-05-20 17:49:49') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('46', 'Production View Papers', 'production.view_papers', '2026-05-20 17:49:50', '2026-05-20 17:49:50') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('47', 'Production Update Details', 'production.update_details', '2026-05-20 17:49:51', '2026-05-20 17:49:51') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('48', 'Production Schedule Publish', 'production.schedule_publish', '2026-05-20 17:49:52', '2026-05-20 17:49:52') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('49', 'Production Publish Now', 'production.publish_now', '2026-05-20 17:49:52', '2026-05-20 17:49:52') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('50', 'Production Request Revision', 'production.request_revision', '2026-05-20 17:49:53', '2026-05-20 17:49:53') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('51', 'Users Manage', 'users.manage', '2026-05-20 17:49:54', '2026-05-20 17:49:54') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('52', 'System Configure', 'system.configure', '2026-05-20 17:49:54', '2026-05-20 17:49:54') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('53', 'Logs View', 'logs.view', '2026-05-20 17:49:55', '2026-05-20 17:49:55') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('54', 'Security Manage', 'security.manage', '2026-05-20 17:49:56', '2026-05-20 17:49:56') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, name, slug, created_at, updated_at) VALUES ('55', 'Backup Manage', 'backup.manage', '2026-05-20 17:49:56', '2026-05-20 17:49:56') ON CONFLICT DO NOTHING;

-- -------------------------------------------------------------
-- جدول: personal_access_tokens
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS personal_access_tokens (
    id BIGINT NOT NULL DEFAULT nextval('personal_access_tokens_id_seq'::regclass),
    tokenable_type CHARACTER VARYING(255) NOT NULL,
    tokenable_id BIGINT NOT NULL,
    name TEXT NOT NULL,
    token CHARACTER VARYING(64) NOT NULL,
    abilities TEXT NULL,
    last_used_at TIMESTAMP WITHOUT TIME ZONE NULL,
    expires_at TIMESTAMP WITHOUT TIME ZONE NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: production_tasks
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS production_tasks (
    id BIGINT NOT NULL DEFAULT nextval('production_tasks_id_seq'::regclass),
    paper_id BIGINT NOT NULL,
    assigned_to BIGINT NULL,
    task_type CHARACTER VARYING(255) NOT NULL DEFAULT 'formatting'::character varying,
    status CHARACTER VARYING(255) NOT NULL DEFAULT 'pending'::character varying,
    notes TEXT NULL,
    started_at TIMESTAMP WITHOUT TIME ZONE NULL,
    completed_at TIMESTAMP WITHOUT TIME ZONE NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: publications
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS publications (
    id BIGINT NOT NULL DEFAULT nextval('publications_id_seq'::regclass),
    paper_id BIGINT NOT NULL,
    conference_id BIGINT NOT NULL,
    doi CHARACTER VARYING(255) NULL,
    page_numbers CHARACTER VARYING(255) NULL,
    file_path CHARACTER VARYING(255) NULL,
    published_at TIMESTAMP WITHOUT TIME ZONE NULL,
    url CHARACTER VARYING(255) NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: reviewer_expertise
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviewer_expertise (
    reviewer_id BIGINT NOT NULL,
    topic_id BIGINT NOT NULL,
    proficiency_level CHARACTER VARYING(255) NOT NULL DEFAULT 'intermediate'::character varying,
    PRIMARY KEY (reviewer_id, topic_id)
);

-- -------------------------------------------------------------
-- جدول: reviewer_invitations
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviewer_invitations (
    id BIGINT NOT NULL DEFAULT nextval('reviewer_invitations_id_seq'::regclass),
    email CHARACTER VARYING(255) NOT NULL,
    name CHARACTER VARYING(255) NOT NULL,
    affiliation CHARACTER VARYING(255) NULL,
    token CHARACTER VARYING(255) NOT NULL,
    status CHARACTER VARYING(255) NOT NULL DEFAULT 'pending'::character varying,
    invited_by BIGINT NOT NULL,
    expires_at TIMESTAMP WITHOUT TIME ZONE NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    paper_id BIGINT NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: reviews
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT NOT NULL DEFAULT nextval('reviews_id_seq'::regclass),
    assignment_id BIGINT NOT NULL,
    overall_score NUMERIC NULL,
    originality INTEGER NULL,
    relevance INTEGER NULL,
    methodology INTEGER NULL,
    presentation INTEGER NULL,
    technical_quality INTEGER NULL,
    comments_author TEXT NULL,
    comments_chair TEXT NULL,
    decision CHARACTER VARYING(255) NULL,
    confidence CHARACTER VARYING(255) NOT NULL DEFAULT 'medium'::character varying,
    is_submitted BOOLEAN NOT NULL DEFAULT false,
    submission_date TIMESTAMP WITHOUT TIME ZONE NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: role_user
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS role_user (
    id BIGINT NOT NULL DEFAULT nextval('role_user_id_seq'::regclass),
    role_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: roles
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT NOT NULL DEFAULT nextval('roles_id_seq'::regclass),
    name CHARACTER VARYING(255) NOT NULL,
    slug CHARACTER VARYING(255) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (id)
);

-- البيانات الأساسية لجدول roles:
INSERT INTO roles (id, name, slug, created_at, updated_at) VALUES ('1', 'Author (Researcher)', 'author', '2026-05-20 17:49:57', '2026-05-20 17:49:57') ON CONFLICT DO NOTHING;
INSERT INTO roles (id, name, slug, created_at, updated_at) VALUES ('2', 'Reviewer', 'reviewer', '2026-05-20 17:49:58', '2026-05-20 17:49:58') ON CONFLICT DO NOTHING;
INSERT INTO roles (id, name, slug, created_at, updated_at) VALUES ('3', 'Editor', 'editor', '2026-05-20 17:50:00', '2026-05-20 17:50:00') ON CONFLICT DO NOTHING;
INSERT INTO roles (id, name, slug, created_at, updated_at) VALUES ('4', 'Editorial Office', 'editorial_office', '2026-05-20 17:50:01', '2026-05-20 17:50:01') ON CONFLICT DO NOTHING;
INSERT INTO roles (id, name, slug, created_at, updated_at) VALUES ('5', 'Scientific Committee', 'scientific_committee', '2026-05-20 17:50:03', '2026-05-20 17:50:03') ON CONFLICT DO NOTHING;
INSERT INTO roles (id, name, slug, created_at, updated_at) VALUES ('6', 'Conference Chair', 'conference_chair', '2026-05-20 17:50:04', '2026-05-20 17:50:04') ON CONFLICT DO NOTHING;
INSERT INTO roles (id, name, slug, created_at, updated_at) VALUES ('7', 'Production Office', 'production_office', '2026-05-20 17:50:05', '2026-05-20 17:50:05') ON CONFLICT DO NOTHING;
INSERT INTO roles (id, name, slug, created_at, updated_at) VALUES ('8', 'System Administrator', 'system_admin', '2026-05-20 17:50:07', '2026-05-20 17:50:07') ON CONFLICT DO NOTHING;

-- -------------------------------------------------------------
-- جدول: scientific_sessions
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS scientific_sessions (
    id BIGINT NOT NULL DEFAULT nextval('scientific_sessions_id_seq'::regclass),
    conf_id BIGINT NOT NULL,
    title CHARACTER VARYING(200) NOT NULL,
    description TEXT NULL,
    session_type CHARACTER VARYING(255) NOT NULL DEFAULT 'oral'::character varying,
    chair_id BIGINT NULL,
    room CHARACTER VARYING(100) NULL,
    start_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    end_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    max_attendees INTEGER NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: screening_decisions
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS screening_decisions (
    id BIGINT NOT NULL DEFAULT nextval('screening_decisions_id_seq'::regclass),
    paper_id BIGINT NOT NULL,
    system_recommendation CHARACTER VARYING(255) NOT NULL,
    editor_decision CHARACTER VARYING(255) NULL,
    notes TEXT NULL,
    decided_by BIGINT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: session_papers
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS session_papers (
    session_id BIGINT NOT NULL,
    paper_id BIGINT NOT NULL,
    presentation_order INTEGER NOT NULL,
    presentation_time TIMESTAMP WITHOUT TIME ZONE NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 15,
    PRIMARY KEY (session_id, paper_id)
);

-- -------------------------------------------------------------
-- جدول: sessions
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sessions (
    id CHARACTER VARYING(255) NOT NULL,
    user_id BIGINT NULL,
    ip_address CHARACTER VARYING(45) NULL,
    user_agent TEXT NULL,
    payload TEXT NOT NULL,
    last_activity INTEGER NOT NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: support_messages
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS support_messages (
    id BIGINT NOT NULL DEFAULT nextval('support_messages_id_seq'::regclass),
    name CHARACTER VARYING(255) NOT NULL,
    email CHARACTER VARYING(255) NOT NULL,
    subject CHARACTER VARYING(255) NOT NULL,
    message TEXT NOT NULL,
    status CHARACTER VARYING(255) NOT NULL DEFAULT 'new'::character varying,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: topics
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS topics (
    id BIGINT NOT NULL DEFAULT nextval('topics_id_seq'::regclass),
    name CHARACTER VARYING(100) NOT NULL,
    description TEXT NULL,
    parent_id BIGINT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- جدول: users
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    username CHARACTER VARYING(50) NOT NULL,
    email CHARACTER VARYING(100) NOT NULL,
    password CHARACTER VARYING(255) NOT NULL,
    user_type CHARACTER VARYING(255) NOT NULL,
    full_name CHARACTER VARYING(100) NOT NULL,
    affiliation CHARACTER VARYING(200) NULL,
    phone CHARACTER VARYING(20) NULL,
    address TEXT NULL,
    bio TEXT NULL,
    profile_image CHARACTER VARYING(255) NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login TIMESTAMP WITHOUT TIME ZONE NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    cv_path CHARACTER VARYING(255) NULL,
    email_verified_at TIMESTAMP WITHOUT TIME ZONE NULL,
    PRIMARY KEY (id)
);

-- =============================================================
-- ملاحظة: لإعادة تشغيل النظام محلياً:
-- 1. أنشئ قاعدة بيانات PostgreSQL جديدة
-- 2. شغّل هذا الملف: psql -U postgres -d your_db -f database.sql
-- 3. انسخ ملف .env.example إلى .env وعدّل بيانات الاتصال
-- 4. شغّل: php artisan migrate (إذا أردت استخدام migrations بدلاً من هذا الملف)
-- =============================================================