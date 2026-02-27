-- ====================================================================
--          قاعدة بيانات نظام إدارة المؤتمرات العلمية لجامعة إقليم سبأ
--          (تحاكي أنظمة إدارة المؤتمرات المتقدمة مثل نظام القيصم)
-- ====================================================================

-- إنشاء قاعدة البيانات
CREATE DATABASE IF NOT EXISTS saba_conference_db;
USE saba_conference_db;

-- ====================================================================
-- الجداول الأساسية: المستخدمون، الأدوار، الصلاحيات
-- ====================================================================

-- 1. جدول المستخدمين (Users)
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    affiliation VARCHAR(255), -- الجهة التابع لها (مثال: جامعة إقليم سبأ)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. جدول الأدوار (Roles)
CREATE TABLE Roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- 3. جدول أدوار المستخدمين (User_Roles) - علاقة متعدد لمتعدد
CREATE TABLE User_Roles (
    user_id INT,
    role_id INT,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES Roles(role_id) ON DELETE CASCADE
);

-- 4. جدول الصلاحيات (Permissions)
CREATE TABLE Permissions (
    permission_id INT AUTO_INCREMENT PRIMARY KEY,
    permission_name VARCHAR(100) NOT NULL UNIQUE, -- مثال: manage_users, create_conference
    description TEXT
);

-- 5. جدول صلاحيات الأدوار (Role_Permissions) - يربط الأدوار بالصلاحيات
CREATE TABLE Role_Permissions (
    role_id INT,
    permission_id INT,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES Roles(role_id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES Permissions(permission_id) ON DELETE CASCADE
);

-- ====================================================================
-- جداول المؤتمرات والأبحاث
-- ====================================================================

-- 6. جدول المؤتمرات (Conferences)
CREATE TABLE Conferences (
    conference_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    submission_deadline DATETIME,
    location VARCHAR(255),
    status ENUM('Draft', 'Open', 'Closed', 'Completed') DEFAULT 'Draft',
    created_by INT, -- FK to Users
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES Users(user_id)
);

-- 7. جدول الأبحاث (Submissions)
CREATE TABLE Submissions (
    submission_id INT AUTO_INCREMENT PRIMARY KEY,
    conference_id INT,
    user_id INT, -- الباحث الرئيسي
    title VARCHAR(255) NOT NULL,
    abstract TEXT,
    file_path VARCHAR(255),
    status ENUM('Pending', 'Under Review', 'Accepted', 'Rejected', 'Revision Required') DEFAULT 'Pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conference_id) REFERENCES Conferences(conference_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- ====================================================================
-- جداول التحكيم واللجان
-- ====================================================================

-- 8. جدول اللجان (Committees)
CREATE TABLE Committees (
    committee_id INT AUTO_INCREMENT PRIMARY KEY,
    conference_id INT,
    committee_name VARCHAR(100), -- e.g., 'Scientific Committee', 'Organizing Committee'
    FOREIGN KEY (conference_id) REFERENCES Conferences(conference_id) ON DELETE CASCADE
);

-- 9. جدول أعضاء اللجان (Committee_Members)
CREATE TABLE Committee_Members (
    committee_id INT,
    user_id INT,
    PRIMARY KEY (committee_id, user_id),
    FOREIGN KEY (committee_id) REFERENCES Committees(committee_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 10. جدول المراجعات (Reviews)
CREATE TABLE Reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    submission_id INT,
    reviewer_id INT, -- FK to Users
    score INT CHECK (score BETWEEN 0 AND 100),
    comments_for_author TEXT,
    comments_for_committee TEXT,
    status ENUM('Assigned', 'Completed') DEFAULT 'Assigned',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (submission_id) REFERENCES Submissions(submission_id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- ====================================================================
-- جداول التحرير والنشر
-- ====================================================================

-- 11. جدول مهام التحرير (Editing_Tasks)
CREATE TABLE Editing_Tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    submission_id INT,
    editor_id INT, -- FK to Users (المحرر)
    editorial_office_id INT, -- FK to Users (مكتب التحرير)
    task_description TEXT,
    status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (submission_id) REFERENCES Submissions(submission_id) ON DELETE CASCADE,
    FOREIGN KEY (editor_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (editorial_office_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- ====================================================================
-- جداول الجلسات والشهادات والإشعارات
-- ====================================================================

-- 12. جدول الجلسات العلمية (Sessions)
CREATE TABLE Sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    conference_id INT,
    title VARCHAR(255) NOT NULL,
    session_date DATE,
    start_time TIME,
    end_time TIME,
    location VARCHAR(255),
    FOREIGN KEY (conference_id) REFERENCES Conferences(conference_id) ON DELETE CASCADE
);

-- 13. جدول أبحاث الجلسات (Session_Submissions)
CREATE TABLE Session_Submissions (
    session_id INT,
    submission_id INT,
    PRIMARY KEY (session_id, submission_id),
    FOREIGN KEY (session_id) REFERENCES Sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (submission_id) REFERENCES Submissions(submission_id) ON DELETE CASCADE
);

-- 14. جدول الشهادات (Certificates)
CREATE TABLE Certificates (
    certificate_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    conference_id INT,
    certificate_type ENUM('Attendance', 'Presenter') NOT NULL,
    issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_path VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (conference_id) REFERENCES Conferences(conference_id) ON DELETE CASCADE
);

-- 15. جدول الإشعارات (Notifications)
CREATE TABLE Notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- ====================================================================
-- إدراج البيانات الأساسية للأدوار والصلاحيات
-- ====================================================================

-- إدراج الأدوار الأساسية
INSERT INTO Roles (role_name) VALUES 
('Admin'), 
('Conference Chair'), 
('Scientific Committee'), 
('Reviewer'), 
('Author'), 
('Editor'),
('Editorial Office'),
('Visitor');

-- إدراج الصلاحيات الأساسية
INSERT INTO Permissions (permission_name, description) VALUES
-- Visitor Permissions
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

-- Authenticated User (General) Permissions (covered by specific roles, but good to list)
('logout', 'تسجيل الخروج من النظام'),
('manage_profile', 'إدارة الحساب الشخصي (تعديل بيانات، تغيير كلمة مرور، صورة شخصية)'),
('manage_settings', 'إدارة الإعدادات الشخصية'),
('view_notifications', 'عرض الإشعارات'),
('view_activity_log', 'عرض سجل الأنشطة الخاص بالمستخدم'),

-- Author Permissions
('register_for_conference', 'التسجيل في مؤتمر'),
('unregister_from_conference', 'إلغاء التسجيل من مؤتمر'),
('submit_new_submission', 'تقديم بحث جديد'),
('view_own_submissions', 'عرض أبحاثه الخاصة فقط'),
('edit_own_submission_before_review', 'تعديل البحث الخاص به قبل التحكيم'),
('resubmit_submission_for_revision', 'إعادة رفع البحث الخاص به عند طلب تعديل'),
('withdraw_submission', 'سحب البحث الخاص به قبل القبول النهائي'),
('view_review_comments', 'عرض تعليقات وملاحظات المحكمين والمحرر على أبحاثه'),
('receive_notifications', 'استقبال الإشعارات المتعلقة بأبحاثه'),
('download_attendance_certificate', 'تحميل شهادة مشاركة في المؤتمر'),
('download_acceptance_certificate', 'تحميل شهادة قبول بحث'),

-- Reviewer Permissions
('view_assigned_submissions', 'عرض الأبحاث المسندة إليه للتحكيم فقط'),
('download_submission_file', 'تحميل ملف البحث المسند إليه'),
('fill_review_form', 'تعبئة نموذج التحكيم (تقييم، ملاحظات، قرار)'),
('submit_review', 'إرسال تقرير التحكيم'),
('view_completed_reviews', 'عرض الأبحاث التي أكمل تحكيمها'),
('view_own_review_history', 'عرض سجل التحكيم الخاص به'),
('access_review_guidelines', 'الوصول إلى دليل التحكيم'),
('receive_review_notifications', 'استقبال إشعارات إسناد الأبحاث والتحديثات'),

-- Scientific Committee Permissions
('create_conference', 'إنشاء مؤتمر جديد'),
('edit_conference_info', 'تعديل بيانات المؤتمر'),
('close_conference', 'إغلاق المؤتمر'),
('view_all_submissions', 'عرض جميع الأبحاث المقدمة'),
('sort_submissions', 'فرز الأبحاث'),
('make_initial_decision', 'اتخاذ القرار الأولي بشأن الأبحاث'),
('add_reviewer', 'إضافة محكم جديد'),
('edit_reviewer_data', 'تعديل بيانات المحكمين'),
('assign_submissions_to_reviewers', 'إسناد الأبحاث للمحكمين'),
('review_evaluations', 'مراجعة تقييمات المحكمين'),
('recommend_acceptance_rejection', 'التوصية بقبول أو رفض الأبحاث'),
('create_sessions', 'إنشاء جلسات علمية'),
('schedule_sessions', 'جدولة الجلسات'),
('prepare_conference_program', 'إعداد برنامج المؤتمر'),
('generate_certificates', 'توليد الشهادات'),
('approve_certificates', 'اعتماد الشهادات'),
('view_submission_reports', 'عرض تقارير الأبحاث'),
('view_reviewer_reports', 'عرض تقارير المحكمين'),
('view_conference_statistics', 'عرض إحصائيات المؤتمر'),

-- Conference Chair Permissions
('monitor_conference_status', 'متابعة حالة المؤتمر بشكل عام'),
('view_performance_indicators', 'عرض مؤشرات الأداء للمؤتمر'),
('approve_review_results', 'اعتماد نتائج التحكيم'),
('approve_final_submission_acceptance', 'اعتماد القبول النهائي للأبحاث'),
('approve_sessions', 'اعتماد الجلسات العلمية'),
('approve_final_program', 'اعتماد البرنامج النهائي للمؤتمر'),
('view_final_report', 'عرض التقرير الختامي للمؤتمر'),
('view_general_statistics', 'عرض الإحصائيات العامة للمؤتمر'),

-- Editorial Office Permissions
('initial_submission_check', 'فحص مطابقة الأبحاث للشروط الأولية'),
('make_preliminary_acceptance_rejection', 'اتخاذ قرار قبول مبدئي أو رفض مبدئي'),
('monitor_review_progress', 'متابعة سير عملية التحكيم'),
('communicate_with_authors', 'التواصل مع الباحثين'),
('communicate_with_reviewers', 'التواصل مع المحكمين'),
('manage_official_correspondence', 'إدارة المراسلات الرسمية'),
('receive_workflow_notifications', 'استقبال جميع الإشعارات المتعلقة بسير العمل'),

-- Editor Permissions
('perform_linguistic_review', 'إجراء التدقيق اللغوي للأبحاث'),
('perform_technical_review', 'إجراء التدقيق الفني للأبحاث'),
('request_revisions_from_author', 'طلب تعديلات من الباحث'),
('resubmit_to_review_if_needed', 'إعادة البحث للتحكيم عند الحاجة'),
('approve_final_version', 'اعتماد النسخة النهائية للبحث'),
('receive_editing_notifications', 'استقبال إشعارات التعديلات والمراجعات'),

-- Admin Permissions
('add_user', 'إضافة مستخدم جديد'),
('edit_user', 'تعديل بيانات مستخدم'),
('delete_user', 'حذف مستخدم'),
('manage_roles_permissions', 'إدارة الصلاحيات والأدوار'),
('full_conference_control', 'التحكم الكامل بجميع المؤتمرات'),
('manage_general_settings', 'إدارة الإعدادات العامة للنظام'),
('manage_email_templates', 'إدارة قوالب البريد الإلكتروني'),
('manage_certificate_templates', 'إدارة قوالب الشهادات'),
('manage_security_settings', 'إدارة إعدادات الأمان'),
('view_comprehensive_reports', 'عرض التقارير الشاملة'),
('create_backup', 'إنشاء نسخة احتياطية لقاعدة البيانات'),
('restore_backup', 'استعادة نسخة احتياضية لقاعدة البيانات'),
('view_full_system_log', 'عرض سجل النظام الكامل');

-- ربط الصلاحيات بالأدوار (Role_Permissions)

-- Visitor Role Permissions
INSERT INTO Role_Permissions (role_id, permission_id) SELECT (SELECT role_id FROM Roles WHERE role_name = 'Visitor'), permission_id FROM Permissions WHERE permission_name IN (
    'view_homepage', 'view_about_system', 'view_available_conferences', 'view_conference_details', 'view_conference_axes', 'search_conference', 'view_faq', 'access_support', 'create_author_account', 'login', 'recover_password'
);

-- Author Role Permissions
INSERT INTO Role_Permissions (role_id, permission_id) SELECT (SELECT role_id FROM Roles WHERE role_name = 'Author'), permission_id FROM Permissions WHERE permission_name IN (
    'login', 'logout', 'manage_profile', 'manage_settings', 'view_notifications', 'view_activity_log',
    'view_available_conferences', 'view_conference_details', 'register_for_conference', 'unregister_from_conference',
    'submit_new_submission', 'view_own_submissions', 'edit_own_submission_before_review', 'resubmit_submission_for_revision', 'withdraw_submission', 'view_submission_status',
    'view_review_comments', 'receive_notifications',
    'download_attendance_certificate', 'download_acceptance_certificate'
);

-- Reviewer Role Permissions
INSERT INTO Role_Permissions (role_id, permission_id) SELECT (SELECT role_id FROM Roles WHERE role_name = 'Reviewer'), permission_id FROM Permissions WHERE permission_name IN (
    'login', 'logout', 'manage_profile', 'manage_settings', 'view_notifications', 'view_activity_log',
    'view_assigned_submissions', 'download_submission_file', 'fill_review_form', 'submit_review',
    'view_completed_reviews', 'view_own_review_history', 'access_review_guidelines',
    'receive_review_notifications'
);

-- Scientific Committee Role Permissions
INSERT INTO Role_Permissions (role_id, permission_id) SELECT (SELECT role_id FROM Roles WHERE role_name = 'Scientific Committee'), permission_id FROM Permissions WHERE permission_name IN (
    'login', 'logout', 'manage_profile', 'manage_settings', 'view_notifications', 'view_activity_log',
    'create_conference', 'edit_conference_info', 'close_conference',
    'view_all_submissions', 'sort_submissions', 'make_initial_decision',
    'add_reviewer', 'edit_reviewer_data', 'assign_submissions_to_reviewers',
    'review_evaluations', 'recommend_acceptance_rejection',
    'create_sessions', 'schedule_sessions', 'prepare_conference_program',
    'generate_certificates', 'approve_certificates',
    'view_submission_reports', 'view_reviewer_reports', 'view_conference_statistics'
);

-- Conference Chair Role Permissions
INSERT INTO Role_Permissions (role_id, permission_id) SELECT (SELECT role_id FROM Roles WHERE role_name = 'Conference Chair'), permission_id FROM Permissions WHERE permission_name IN (
    'login', 'logout', 'manage_profile', 'manage_settings', 'view_notifications', 'view_activity_log',
    'monitor_conference_status', 'view_performance_indicators',
    'approve_review_results', 'approve_final_submission_acceptance',
    'approve_sessions', 'approve_final_program',
    'view_final_report', 'view_general_statistics'
);

-- Editorial Office Role Permissions
INSERT INTO Role_Permissions (role_id, permission_id) SELECT (SELECT role_id FROM Roles WHERE role_name = 'Editorial Office'), permission_id FROM Permissions WHERE permission_name IN (
    'login', 'logout', 'manage_profile', 'manage_settings', 'view_notifications', 'view_activity_log',
    'initial_submission_check', 'make_preliminary_acceptance_rejection',
    'monitor_review_progress', 'communicate_with_authors', 'communicate_with_reviewers', 'manage_official_correspondence',
    'receive_workflow_notifications'
);

-- Editor Role Permissions
INSERT INTO Role_Permissions (role_id, permission_id) SELECT (SELECT role_id FROM Roles WHERE role_name = 'Editor'), permission_id FROM Permissions WHERE permission_name IN (
    'login', 'logout', 'manage_profile', 'manage_settings', 'view_notifications', 'view_activity_log',
    'perform_linguistic_review', 'perform_technical_review',
    'request_revisions_from_author', 'resubmit_to_review_if_needed', 'approve_final_version',
    'receive_editing_notifications'
);

-- Admin Role Permissions
INSERT INTO Role_Permissions (role_id, permission_id) SELECT (SELECT role_id FROM Roles WHERE role_name = 'Admin'), permission_id FROM Permissions WHERE permission_name IN (
    'login', 'logout', 'manage_profile', 'manage_settings', 'view_notifications', 'view_activity_log',
    'add_user', 'edit_user', 'delete_user', 'manage_roles_permissions',
    'full_conference_control',
    'manage_general_settings', 'manage_email_templates', 'manage_certificate_templates', 'manage_security_settings',
    'view_comprehensive_reports',
    'create_backup', 'restore_backup',
    'view_full_system_log'
);

-- ====================================================================
-- إدراج مستخدمين افتراضيين لكل دور
-- ====================================================================

-- Admin User
INSERT INTO Users (full_name, email, password_hash, phone_number, affiliation) VALUES
('مدير النظام - جامعة إقليم سبأ', 'admin.iqlamsaba@example.com', 'hashed_admin_password', '0500000001', 'جامعة إقليم سبأ');
INSERT INTO User_Roles (user_id, role_id) VALUES
((SELECT user_id FROM Users WHERE email = 'admin.iqlamsaba@example.com'), (SELECT role_id FROM Roles WHERE role_name = 'Admin'));

-- Conference Chair User
INSERT INTO Users (full_name, email, password_hash, phone_number, affiliation) VALUES
('رئيس المؤتمر - جامعة إقليم سبأ', 'chair.iqlamsaba@example.com', 'hashed_chair_password', '0500000002', 'جامعة إقليم سبأ');
INSERT INTO User_Roles (user_id, role_id) VALUES
((SELECT user_id FROM Users WHERE email = 'chair.iqlamsaba@example.com'), (SELECT role_id FROM Roles WHERE role_name = 'Conference Chair'));

-- Scientific Committee Member User
INSERT INTO Users (full_name, email, password_hash, phone_number, affiliation) VALUES
('عضو اللجنة العلمية - جامعة إقليم سبأ', 'scientific.committee.iqlamsaba@example.com', 'hashed_sc_password', '0500000003', 'جامعة إقليم سبأ');
INSERT INTO User_Roles (user_id, role_id) VALUES
((SELECT user_id FROM Users WHERE email = 'scientific.committee.iqlamsaba@example.com'), (SELECT role_id FROM Roles WHERE role_name = 'Scientific Committee'));

-- Reviewer User
INSERT INTO Users (full_name, email, password_hash, phone_number, affiliation) VALUES
('المحكم - جامعة إقليم سبأ', 'reviewer.iqlamsaba@example.com', 'hashed_reviewer_password', '0500000004', 'جامعة إقليم سبأ');
INSERT INTO User_Roles (user_id, role_id) VALUES
((SELECT user_id FROM Users WHERE email = 'reviewer.iqlamsaba@example.com'), (SELECT role_id FROM Roles WHERE role_name = 'Reviewer'));

-- Author User
INSERT INTO Users (full_name, email, password_hash, phone_number, affiliation) VALUES
('الباحث - جامعة إقليم سبأ', 'author.iqlamsaba@example.com', 'hashed_author_password', '0500000005', 'جامعة إقليم سبأ');
INSERT INTO User_Roles (user_id, role_id) VALUES
((SELECT user_id FROM Users WHERE email = 'author.iqlamsaba@example.com'), (SELECT role_id FROM Roles WHERE role_name = 'Author'));

-- Editor User
INSERT INTO Users (full_name, email, password_hash, phone_number, affiliation) VALUES
('المحرر - جامعة إقليم سبأ', 'editor.iqlamsaba@example.com', 'hashed_editor_password', '0500000006', 'جامعة إقليم سبأ');
INSERT INTO User_Roles (user_id, role_id) VALUES
((SELECT user_id FROM Users WHERE email = 'editor.iqlamsaba@example.com'), (SELECT role_id FROM Roles WHERE role_name = 'Editor'));

-- Editorial Office User
INSERT INTO Users (full_name, email, password_hash, phone_number, affiliation) VALUES
('مكتب التحرير - جامعة إقليم سبأ', 'editorial.office.iqlamsaba@example.com', 'hashed_editorial_password', '0500000007', 'جامعة إقليم سبأ');
INSERT INTO User_Roles (user_id, role_id) VALUES
((SELECT user_id FROM Users WHERE email = 'editorial.office.iqlamsaba@example.com'), (SELECT role_id FROM Roles WHERE role_name = 'Editorial Office'));
