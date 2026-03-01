-- ====================================================================
--          Refactored Database for Saba University Conference System
--          PostgreSQL Compatible Version (Supabase)
-- ====================================================================

-- Drop tables in reverse order of dependencies if they exist
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS publications CASCADE;
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS editor_reviews CASCADE;
DROP TABLE IF EXISTS revisions CASCADE;
DROP TABLE IF EXISTS chair_approvals CASCADE;
DROP TABLE IF EXISTS committee_decisions CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS review_assignments CASCADE;
DROP TABLE IF EXISTS initial_screenings CASCADE;
DROP TABLE IF EXISTS paper_status_history CASCADE;
DROP TABLE IF EXISTS paper_files CASCADE;
DROP TABLE IF EXISTS paper_authors CASCADE;
DROP TABLE IF EXISTS papers CASCADE;
DROP TABLE IF EXISTS conference_program CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS conference_registrations CASCADE;
DROP TABLE IF EXISTS conference_fees CASCADE;
DROP TABLE IF EXISTS conference_tracks CASCADE;
DROP TABLE IF EXISTS conferences CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS affiliations CASCADE;

-- 1. affiliations
CREATE TABLE affiliations (
    affiliation_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. users
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    affiliation_id INTEGER,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_affiliation FOREIGN KEY (affiliation_id) REFERENCES affiliations(affiliation_id) ON DELETE SET NULL
);

-- 3. roles
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- 4. permissions
CREATE TABLE permissions (
    permission_id SERIAL PRIMARY KEY,
    permission_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- 5. user_roles
CREATE TABLE user_roles (
    user_id INTEGER,
    role_id INTEGER,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
);

-- 6. activity_logs
CREATE TABLE activity_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    action TEXT NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_log FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- 7. notifications
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_notif FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 8. conferences
CREATE TABLE conferences (
    conference_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    submission_deadline TIMESTAMP,
    location VARCHAR(255),
    status VARCHAR(20) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Open', 'Closed', 'Completed')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. conference_tracks
CREATE TABLE conference_tracks (
    track_id SERIAL PRIMARY KEY,
    conference_id INTEGER,
    track_name VARCHAR(255) NOT NULL,
    description TEXT,
    CONSTRAINT fk_conference_track FOREIGN KEY (conference_id) REFERENCES conferences(conference_id) ON DELETE CASCADE
);

-- 10. conference_fees
CREATE TABLE conference_fees (
    fee_id SERIAL PRIMARY KEY,
    conference_id INTEGER,
    category_name VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    CONSTRAINT fk_conference_fee FOREIGN KEY (conference_id) REFERENCES conferences(conference_id) ON DELETE CASCADE
);

-- 11. conference_registrations
CREATE TABLE conference_registrations (
    registration_id SERIAL PRIMARY KEY,
    conference_id INTEGER,
    user_id INTEGER,
    registration_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Cancelled')),
    CONSTRAINT fk_conference_reg FOREIGN KEY (conference_id) REFERENCES conferences(conference_id) ON DELETE CASCADE,
    CONSTRAINT fk_user_reg FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 12. sessions
CREATE TABLE sessions (
    session_id SERIAL PRIMARY KEY,
    conference_id INTEGER,
    title VARCHAR(255) NOT NULL,
    session_date DATE,
    start_time TIME,
    end_time TIME,
    location VARCHAR(255),
    CONSTRAINT fk_conference_session FOREIGN KEY (conference_id) REFERENCES conferences(conference_id) ON DELETE CASCADE
);

-- 13. conference_program
CREATE TABLE conference_program (
    program_id SERIAL PRIMARY KEY,
    conference_id INTEGER,
    session_id INTEGER,
    event_time TIME,
    event_description TEXT,
    CONSTRAINT fk_conference_prog FOREIGN KEY (conference_id) REFERENCES conferences(conference_id) ON DELETE CASCADE,
    CONSTRAINT fk_session_prog FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE SET NULL
);

-- 14. papers
CREATE TABLE papers (
    paper_id SERIAL PRIMARY KEY,
    conference_id INTEGER,
    track_id INTEGER,
    submitter_id INTEGER,
    title VARCHAR(255) NOT NULL,
    abstract TEXT,
    status VARCHAR(30) DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Screening', 'Under Review', 'Revision Required', 'Accepted', 'Rejected', 'Withdrawn')),
    submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_conference_paper FOREIGN KEY (conference_id) REFERENCES conferences(conference_id) ON DELETE CASCADE,
    CONSTRAINT fk_track_paper FOREIGN KEY (track_id) REFERENCES conference_tracks(track_id) ON DELETE SET NULL,
    CONSTRAINT fk_submitter_paper FOREIGN KEY (submitter_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 15. paper_authors
CREATE TABLE paper_authors (
    author_id SERIAL PRIMARY KEY,
    paper_id INTEGER,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(100),
    affiliation_id INTEGER,
    is_presenter BOOLEAN DEFAULT FALSE,
    author_order INTEGER,
    CONSTRAINT fk_paper_author FOREIGN KEY (paper_id) REFERENCES papers(paper_id) ON DELETE CASCADE,
    CONSTRAINT fk_affiliation_author FOREIGN KEY (affiliation_id) REFERENCES affiliations(affiliation_id) ON DELETE SET NULL
);

-- 16. paper_files
CREATE TABLE paper_files (
    file_id SERIAL PRIMARY KEY,
    paper_id INTEGER,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(20) DEFAULT 'Original' CHECK (file_type IN ('Original', 'Anonymized', 'Revised', 'Final')),
    uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_paper_file FOREIGN KEY (paper_id) REFERENCES papers(paper_id) ON DELETE CASCADE
);

-- 17. paper_status_history
CREATE TABLE paper_status_history (
    history_id SERIAL PRIMARY KEY,
    paper_id INTEGER,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    changed_by INTEGER,
    changed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    comments TEXT,
    CONSTRAINT fk_paper_hist FOREIGN KEY (paper_id) REFERENCES papers(paper_id) ON DELETE CASCADE,
    CONSTRAINT fk_user_hist FOREIGN KEY (changed_by) REFERENCES users(user_id) ON DELETE SET NULL
);

-- 18. initial_screenings
CREATE TABLE initial_screenings (
    screening_id SERIAL PRIMARY KEY,
    paper_id INTEGER,
    screener_id INTEGER,
    result VARCHAR(20) NOT NULL CHECK (result IN ('Pass', 'Fail', 'Revision Required')),
    comments TEXT,
    screened_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_paper_screen FOREIGN KEY (paper_id) REFERENCES papers(paper_id) ON DELETE CASCADE,
    CONSTRAINT fk_user_screen FOREIGN KEY (screener_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- 19. review_assignments
CREATE TABLE review_assignments (
    assignment_id SERIAL PRIMARY KEY,
    paper_id INTEGER,
    reviewer_id INTEGER,
    assigned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    due_date DATE,
    status VARCHAR(20) DEFAULT 'Assigned' CHECK (status IN ('Assigned', 'Accepted', 'Declined', 'Completed')),
    CONSTRAINT fk_paper_assign FOREIGN KEY (paper_id) REFERENCES papers(paper_id) ON DELETE CASCADE,
    CONSTRAINT fk_user_assign FOREIGN KEY (reviewer_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 20. reviews
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    assignment_id INTEGER,
    score INTEGER CHECK (score BETWEEN 0 AND 100),
    comments_for_author TEXT,
    comments_for_committee TEXT,
    completed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_assign_review FOREIGN KEY (assignment_id) REFERENCES review_assignments(assignment_id) ON DELETE CASCADE
);

-- 21. committee_decisions
CREATE TABLE committee_decisions (
    decision_id SERIAL PRIMARY KEY,
    paper_id INTEGER,
    decision VARCHAR(20) NOT NULL CHECK (decision IN ('Accept', 'Reject', 'Revision Required')),
    justification TEXT,
    decided_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_paper_decision FOREIGN KEY (paper_id) REFERENCES papers(paper_id) ON DELETE CASCADE
);

-- 22. chair_approvals
CREATE TABLE chair_approvals (
    approval_id SERIAL PRIMARY KEY,
    paper_id INTEGER,
    chair_id INTEGER,
    is_approved BOOLEAN DEFAULT FALSE,
    comments TEXT,
    approved_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_paper_chair FOREIGN KEY (paper_id) REFERENCES papers(paper_id) ON DELETE CASCADE,
    CONSTRAINT fk_user_chair FOREIGN KEY (chair_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- 23. revisions
CREATE TABLE revisions (
    revision_id SERIAL PRIMARY KEY,
    paper_id INTEGER,
    revision_number INTEGER,
    author_comments TEXT,
    submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_paper_rev FOREIGN KEY (paper_id) REFERENCES papers(paper_id) ON DELETE CASCADE
);

-- 24. editor_reviews
CREATE TABLE editor_reviews (
    editor_review_id SERIAL PRIMARY KEY,
    paper_id INTEGER,
    editor_id INTEGER,
    linguistic_score INTEGER,
    technical_score INTEGER,
    decision VARCHAR(20) NOT NULL CHECK (decision IN ('Pass', 'Revision Required')),
    reviewed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_paper_editor FOREIGN KEY (paper_id) REFERENCES papers(paper_id) ON DELETE CASCADE,
    CONSTRAINT fk_user_editor FOREIGN KEY (editor_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- 25. payments
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    registration_id INTEGER,
    user_id INTEGER,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'Failed')),
    paid_at TIMESTAMPTZ NULL,
    CONSTRAINT fk_reg_pay FOREIGN KEY (registration_id) REFERENCES conference_registrations(registration_id) ON DELETE CASCADE,
    CONSTRAINT fk_user_pay FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 26. certificates
CREATE TABLE certificates (
    certificate_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    conference_id INTEGER,
    paper_id INTEGER NULL,
    certificate_type VARCHAR(20) NOT NULL CHECK (certificate_type IN ('Attendance', 'Presenter', 'Excellence')),
    issue_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    file_path VARCHAR(255),
    CONSTRAINT fk_user_cert FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_conf_cert FOREIGN KEY (conference_id) REFERENCES conferences(conference_id) ON DELETE CASCADE,
    CONSTRAINT fk_paper_cert FOREIGN KEY (paper_id) REFERENCES papers(paper_id) ON DELETE SET NULL
);

-- 27. publications
CREATE TABLE publications (
    publication_id SERIAL PRIMARY KEY,
    paper_id INTEGER,
    journal_name VARCHAR(255),
    volume VARCHAR(50),
    issue VARCHAR(50),
    pagination VARCHAR(50),
    doi VARCHAR(100),
    published_at DATE,
    CONSTRAINT fk_paper_pub FOREIGN KEY (paper_id) REFERENCES papers(paper_id) ON DELETE CASCADE
);

-- 28. role_permissions (Essential for the system)
CREATE TABLE role_permissions (
    role_id INTEGER,
    permission_id INTEGER,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_role_perm FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE,
    CONSTRAINT fk_perm_role FOREIGN KEY (permission_id) REFERENCES permissions(permission_id) ON DELETE CASCADE
);

-- ====================================================================
-- Data Seeding
-- ====================================================================

INSERT INTO roles (role_name) VALUES 
('Admin'), ('Conference Chair'), ('Scientific Committee'), ('Reviewer'), 
('Author'), ('Editor'), ('Editorial Office'), ('Visitor');

INSERT INTO permissions (permission_name, description) VALUES
('view_homepage', 'عرض الصفحة الرئيسية'),
('view_about_system', 'عرض صفحة عن النظام'),
('view_available_conferences', 'عرض المؤتمرات المتاحة'),
('view_conference_details', 'عرض تفاصيل المؤتمر'),
('view_conference_axes', 'عرض محاور المؤتمر'),
('search_conference', 'البحث عن مؤتمر'),
('view_faq', 'عرض الأسئلة الشائعة'),
('access_support', 'الوصول إلى الدعم والمساعدة'),
('create_author_account', 'إنشاء حساب باحث جديد'),
('login', 'تسجيل الدخول للنظام'),
('recover_password', 'استعادة كلمة المرور'),
('logout', 'تسجيل الخروج من النظام'),
('manage_profile', 'إدارة الحساب الشخصي'),
('manage_settings', 'إدارة الإعدادات الشخصية'),
('view_notifications', 'عرض الإشعارات'),
('view_activity_log', 'عرض سجل الأنشطة الخاص بالمستخدم'),
('register_for_conference', 'التسجيل في مؤتمر'),
('unregister_from_conference', 'إلغاء التسجيل من مؤتمر'),
('submit_new_paper', 'تقديم بحث جديد'),
('view_own_papers', 'عرض أبحاثه الخاصة فقط'),
('edit_own_paper_before_review', 'تعديل البحث الخاص به قبل التحكيم'),
('resubmit_paper_for_revision', 'إعادة رفع البحث الخاص به عند طلب تعديل'),
('withdraw_submission', 'سحب البحث الخاص به'),
('view_review_comments', 'عرض تعليقات وملاحظات المحكمين'),
('receive_notifications', 'استقبال الإشعارات المتعلقة بأبحاثه'),
('download_attendance_certificate', 'تحميل شهادة مشاركة في المؤتمر'),
('download_acceptance_certificate', 'تحميل شهادة قبول بحث'),
('view_assigned_papers', 'عرض الأبحاث المسندة إليه للتحكيم فقط'),
('download_paper_file', 'تحميل ملف البحث المسند إليه'),
('fill_review_form', 'تعبئة نموذج التحكيم'),
('submit_review', 'إرسال تقرير التحكيم'),
('view_completed_reviews', 'عرض الأبحاث التي أكمل تحكيمها'),
('view_own_review_history', 'عرض سجل التحكيم الخاص به'),
('access_review_guidelines', 'الوصول إلى دليل التحكيم'),
('receive_review_notifications', 'استقبال إشعارات إسناد الأبحاث'),
('create_conference', 'إنشاء مؤتمر جديد'),
('edit_conference_info', 'تعديل بيانات المؤتمر'),
('close_conference', 'إغلاق المؤتمر'),
('view_all_papers', 'عرض جميع الأبحاث المقدمة'),
('sort_submissions', 'فرز الأبحاث'),
('make_initial_screening', 'إجراء الفحص الأولي للأبحاث'),
('add_reviewer', 'إضافة محكم جديد'),
('edit_reviewer_data', 'تعديل بيانات المحكمين'),
('assign_papers_to_reviewers', 'إسناد الأبحاث للمحكمين'),
('review_evaluations', 'مراجعة تقييمات المحكمين'),
('recommend_acceptance_rejection', 'التوصية بقبول أو رفض الأبحاث'),
('create_sessions', 'إنشاء جلسات علمية'),
('schedule_sessions', 'جدولة الجلسات'),
('prepare_conference_program', 'إعداد برنامج المؤتمر'),
('generate_certificates', 'توليد الشهادات'),
('approve_certificates', 'اعتماد الشهادات'),
('view_submission_reports', 'عرض تقارير الأبحاث'),
('monitor_conference_status', 'متابعة حالة المؤتمر بشكل عام'),
('view_performance_indicators', 'عرض مؤشرات الأداء للمؤتمر'),
('approve_review_results', 'اعتماد نتائج التحكيم'),
('approve_final_paper_acceptance', 'اعتماد القبول النهائي للأبحاث'),
('approve_sessions', 'اعتماد الجلسات العلمية'),
('approve_final_program', 'اعتماد البرنامج النهائي للمؤتمر'),
('view_final_report', 'عرض التقرير الختامي للمؤتمر'),
('initial_paper_check', 'فحص مطابقة الأبحاث للشروط الأولية'),
('make_preliminary_decision', 'اتخاذ قرار قبول مبدئي أو رفض مبدئي'),
('monitor_review_progress', 'متابعة سير عملية التحكيم'),
('communicate_with_authors', 'التواصل مع الباحثين'),
('communicate_with_reviewers', 'التواصل مع المحكمين'),
('manage_official_correspondence', 'إدارة المراسلات الرسمية'),
('perform_linguistic_review', 'إجراء التدقيق اللغوي للأبحاث'),
('perform_technical_review', 'إجراء التدقيق الفني للأبحاث'),
('request_revisions_from_author', 'طلب تعديلات من الباحث'),
('resubmit_to_review_if_needed', 'إعادة البحث للتحكيم عند الحاجة'),
('approve_final_version', 'اعتماد النسخة النهائية للبحث'),
('add_user', 'إضافة مستخدم جديد'),
('edit_user', 'تعديل بيانات مستخدم'),
('delete_user', 'حذف مستخدم'),
('manage_roles_permissions', 'إدارة الصلاحيات والأدوار'),
('full_conference_control', 'التحكم الكامل بجميع المؤتمرات'),
('manage_general_settings', 'إدارة الإعدادات العامة للنظام'),
('manage_email_templates', 'إدارة قوالب البريد الإلكتروني'),
('manage_certificate_templates', 'إدارة قوالب الشهادات'),
('view_comprehensive_reports', 'عرض التقارير الشاملة'),
('create_backup', 'إنشاء نسخة احتياطية للقاعدة'),
('restore_backup', 'استعادة نسخة احتياطية للقاعدة'),
('view_full_system_log', 'عرض سجل النظام الكامل');

INSERT INTO role_permissions (role_id, permission_id) 
SELECT (SELECT role_id FROM roles WHERE role_name = 'Visitor'), permission_id FROM permissions 
WHERE permission_name IN ('view_homepage', 'view_about_system', 'view_available_conferences', 'view_conference_details', 'view_conference_axes', 'search_conference', 'view_faq', 'access_support', 'create_author_account', 'login', 'recover_password');

INSERT INTO role_permissions (role_id, permission_id) 
SELECT (SELECT role_id FROM roles WHERE role_name = 'Admin'), permission_id FROM permissions;

INSERT INTO affiliations (name, country) VALUES ('جامعة إقليم سبأ', 'Yemen');

INSERT INTO users (full_name, email, password_hash, phone_number, affiliation_id) VALUES
('مدير النظام', 'admin@saba.edu.ye', '123', '0500000001', 1);

INSERT INTO user_roles (user_id, role_id) VALUES
((SELECT user_id FROM users WHERE email = 'admin@saba.edu.ye'), (SELECT role_id FROM roles WHERE role_name = 'Admin'));
-- ====================================================================
--          Full Database for Saba University Conference System
--          PostgreSQL Compatible Version (Supabase)
--          Including Laravel System Tables
-- ====================================================================

-- [Existing Application Tables from refactor_db_pgsql.sql will be here]
-- [I will provide the combined version to the user]

-- 29. password_reset_tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    email VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NULL
);

-- 30. sessions (Laravel System Sessions)
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id INTEGER NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    payload TEXT NOT NULL,
    last_activity INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_user_id_index ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_last_activity_index ON sessions(last_activity);

-- 31. personal_access_tokens
CREATE TABLE IF NOT EXISTS personal_access_tokens (
    id SERIAL PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    abilities TEXT NULL,
    last_used_at TIMESTAMPTZ NULL,
    expires_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NULL,
    updated_at TIMESTAMPTZ NULL
);
CREATE INDEX IF NOT EXISTS personal_access_tokens_tokenable_index ON personal_access_tokens(tokenable_type, tokenable_id);

-- 32. cache
CREATE TABLE IF NOT EXISTS cache (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT NOT NULL,
    expiration INTEGER NOT NULL
);

-- 33. cache_locks
CREATE TABLE IF NOT EXISTS cache_locks (
    key VARCHAR(255) PRIMARY KEY,
    owner VARCHAR(255) NOT NULL,
    expiration INTEGER NOT NULL
);

-- 34. jobs
CREATE TABLE IF NOT EXISTS jobs (
    id BIGSERIAL PRIMARY KEY,
    queue VARCHAR(255) NOT NULL,
    payload TEXT NOT NULL,
    attempts SMALLINT NOT NULL,
    reserved_at INTEGER NULL,
    available_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS jobs_queue_index ON jobs(queue);

-- 35. job_batches
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

-- 36. failed_jobs
CREATE TABLE IF NOT EXISTS failed_jobs (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL UNIQUE,
    connection TEXT NOT NULL,
    queue TEXT NOT NULL,
    payload TEXT NOT NULL,
    exception TEXT NOT NULL,
    failed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
