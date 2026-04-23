import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import MainLayout from './Layouts/MainLayout';
import Home from './Pages/Home';
import Conferences from './Pages/Conferences/Index';
import ConferenceDetails from './Pages/Conferences/Show';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import ReviewerRegister from './Pages/Auth/ReviewerRegister';
import ForgotPassword from './Pages/Auth/ForgotPassword';
import Dashboard from './Pages/Profile/Dashboard';
import ProfileEdit from './Pages/Profile/Edit';
import Security from './Pages/Profile/Security';
import ActivityLog from './Pages/Profile/ActivityLog';

// Profile Layout
import ProfileLayout from './Layouts/ProfileLayout';

// Researcher Pages
import ResearcherLayout from './Layouts/ResearcherLayout';
import ResearcherDashboard from './Pages/Researcher/Dashboard';
import ResearcherConferences from './Pages/Researcher/Conferences';
import ResearcherResearch from './Pages/Researcher/Research/Index';
import ResearcherResearchCreate from './Pages/Researcher/Research/Create';
import ResearcherResearchShow from './Pages/Researcher/Research/Show';
import ResearcherResearchEdit from './Pages/Researcher/Research/Edit';
import ResearcherReviewLog from './Pages/Researcher/ReviewLog';
import ResearcherReviewedPapers from './Pages/Researcher/ReviewedPapers';

// Reviewer Pages
import ReviewerLayout from './Layouts/ReviewerLayout';
import ReviewerDashboard from './Pages/Reviewer/Dashboard';
import ReviewerAssignments from './Pages/Reviewer/Assignments';
import ReviewerHistory from './Pages/Reviewer/History';
import ReviewerGuidelines from './Pages/Reviewer/Guidelines';
import ReviewerForm from './Pages/Reviewer/Form';
import ReviewerCompleted from './Pages/Reviewer/Completed';
import ReviewerNotifications from './Pages/Reviewer/Notifications';

// Scientific Committee Pages
import ScientificCommitteeLayout from './Layouts/ScientificCommitteeLayout';
import ScientificCommitteeDashboard from './Pages/Committee/Dashboard';
import CommitteeConferences from './Pages/Committee/Conferences';
import CommitteeResearch from './Pages/Committee/Research';
import CommitteeReviewers from './Pages/Committee/Reviewers';
import CommitteeResults from './Pages/Committee/Results';
import CommitteeSessions from './Pages/Committee/Sessions';
import CommitteeReports from './Pages/Committee/Reports';
import CommitteeCertificatesGenerate from './Pages/Committee/Certificates/Generate';
import CommitteeCertificatesApprove from './Pages/Committee/Certificates/Approve';

// Shared Pages
import Certificates from './Pages/Shared/Certificates';
import Notifications from './Pages/Shared/Notifications';

import '../css/app.css'; 

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Website Routes */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="conferences" element={<Conferences />} />
                    <Route path="conferences/:id" element={<ConferenceDetails />} />
                    
                    {/* Auth Routes */}
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="register/reviewer" element={<ReviewerRegister />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                </Route>

                {/* Profile Routes - Dedicated Layout */}
                <Route path="profile" element={<ProfileLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="edit" element={<ProfileEdit />} />
                    <Route path="security" element={<Security />} />
                    <Route path="activity" element={<ActivityLog />} />
                </Route>
                
                {/* Researcher Dashboard Routes - Separate Layout */}
                <Route path="researcher" element={<ResearcherLayout />}>
                    <Route index element={<ResearcherDashboard />} />
                    <Route path="conferences" element={<ResearcherConferences />} />
                    <Route path="research" element={<ResearcherResearch />} />
                    <Route path="research/create" element={<ResearcherResearchCreate />} />
                    <Route path="research/:id" element={<ResearcherResearchShow />} />
                    <Route path="research/:id/edit" element={<ResearcherResearchEdit />} />
                    <Route path="reviews" element={<ResearcherReviewLog />} />
                    <Route path="reviewed" element={<ResearcherReviewedPapers />} />
                    <Route path="comments" element={<Notifications />} />
                    <Route path="certificates" element={<Certificates />} />
                    <Route path="notifications" element={<Notifications />} />
                </Route>

                {/* Reviewer Dashboard Routes - Separate Layout */}
                <Route path="reviewer" element={<ReviewerLayout />}>
                    <Route index element={<ReviewerDashboard />} />
                    <Route path="assignments" element={<ReviewerAssignments />} />
                    <Route path="form/:id" element={<ReviewerForm />} />
                    <Route path="history" element={<ReviewerHistory />} />
                    <Route path="guidelines" element={<ReviewerGuidelines />} />
                    <Route path="certificates" element={<Certificates />} />
                    <Route path="completed" element={<ReviewerCompleted />} />
                    <Route path="notifications" element={<ReviewerNotifications />} />
                </Route>

                {/* Scientific Committee Dashboard Routes - Separate Layout */}
                <Route path="committee" element={<ScientificCommitteeLayout />}>
                    <Route index element={<ScientificCommitteeDashboard />} />
                    <Route path="conferences" element={<CommitteeConferences />} />
                    <Route path="conferences/create" element={<CommitteeConferences />} />
                    <Route path="research" element={<CommitteeResearch />} />
                    <Route path="research/sort" element={<CommitteeResearch />} />
                    <Route path="research/decisions" element={<CommitteeResearch />} />
                    <Route path="reviewers" element={<CommitteeReviewers />} />
                    <Route path="reviewers/add" element={<CommitteeReviewers />} />
                    <Route path="reviewers/assign" element={<CommitteeReviewers />} />
                    <Route path="results" element={<CommitteeResults />} />
                    <Route path="results/recommend" element={<CommitteeResults />} />
                    <Route path="sessions" element={<CommitteeSessions />} />
                    <Route path="sessions/create" element={<CommitteeSessions />} />
                    <Route path="sessions/program" element={<CommitteeSessions />} />
                    <Route path="certificates" element={<Certificates />} />
                    <Route path="certificates/generate" element={<CommitteeCertificatesGenerate />} />
                    <Route path="certificates/approve" element={<CommitteeCertificatesApprove />} />
                    <Route path="reports" element={<CommitteeReports />} />
                    <Route path="reports/research" element={<CommitteeReports />} />
                    <Route path="reports/reviewers" element={<CommitteeReports />} />
                    <Route path="reports/stats" element={<CommitteeReports />} />
                    <Route path="notifications" element={<Notifications />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);

    // إعدادات Axios الافتراضية - مهم جداً: إرسال Accept: application/json
    // لكي يقوم Laravel بإرجاع أخطاء JSON بدلاً من تحويلنا لصفحة التسجيل
    
    // تحديد عنوان السيرفر الرئيسي (نفس عنوان الموقع الحالي)
    axios.defaults.baseURL = window.location.origin;
    
    // إخبار السيرفر بأننا نريد استقبال البيانات بتنسيق JSON
    axios.defaults.headers.common['Accept'] = 'application/json';
    
    // إخبار السيرفر بأننا نرسل البيانات بتنسيق JSON
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    
    // تعريف الطلب كطلب برمجي (AJAX)
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    // إعدادات المراقب (Interceptor) لإضافة التوكن تلقائياً لكل طلب
    axios.interceptors.request.use(config => {
        try {
            // جلب التوكن من ذاكرة المتصفح
            const token = localStorage.getItem('token');
            if (token) {
                // إدراج التوكن في رأس الطلب للتوثيق
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (e) {
            console.error('خطأ في مراقب Axios:', e);
        }
        return config;
    });

    root.render(<App />);
    console.log('%c Scientific Conference System - Ready', 'color: #2563eb; font-weight: bold; font-size: 1.2rem;');
}
