import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const ROLES = [
    { value: 'admin',             label: 'مدير النظام',            icon: '👑', color: '#7c3aed' },
    { value: 'chair',             label: 'رئيس المؤتمر',           icon: '🎤', color: '#1d4ed8' },
    { value: 'committee',         label: 'اللجنة العلمية',         icon: '🎓', color: '#0369a1' },
    { value: 'editor',            label: 'المحرر العلمي',          icon: '📝', color: '#0f766e' },
    { value: 'office',            label: 'مكتب التحرير',           icon: '🏢', color: '#b45309' },
    { value: 'reviewer',          label: 'المحكم',                 icon: '👨‍⚖️', color: '#be123c' },
    { value: 'production_office', label: 'مكتب الإنتاج والنشر',   icon: '📚', color: '#6b21a8' },
];

const TYPE_COLORS = {
    admin:             { bg: '#f3e8ff', text: '#6b21a8', border: '#d8b4fe' },
    chair:             { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
    committee:         { bg: '#e0f2fe', text: '#0c4a6e', border: '#7dd3fc' },
    editor:            { bg: '#ccfbf1', text: '#134e4a', border: '#5eead4' },
    office:            { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
    reviewer:          { bg: '#ffe4e6', text: '#881337', border: '#fda4af' },
    production_office: { bg: '#f5f3ff', text: '#4c1d95', border: '#c4b5fd' },
    author:            { bg: '#f0fdf4', text: '#14532d', border: '#86efac' },
};

function RoleBadge({ userType }) {
    const role = ROLES.find(r => r.value === userType);
    const colors = TYPE_COLORS[userType] || { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };
    return (
        <span
            className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full"
            style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
        >
            {role?.icon} {role?.label || userType}
        </span>
    );
}

function Modal({ open, onClose, children }) {
    if (!open) return null;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)' }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 relative overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}

const emptyForm = {
    full_name: '', username: '', email: '',
    password: '', user_type: 'reviewer',
    affiliation: '', phone: '',
};

export default function AdminUsers() {
    const [users, setUsers]           = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading]       = useState(true);
    const [search, setSearch]         = useState('');
    const [filterType, setFilterType] = useState('all');
    const [modalOpen, setModalOpen]   = useState(false);
    const [editUser, setEditUser]     = useState(null); // null = create, object = edit
    const [form, setForm]             = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError]           = useState('');
    const [success, setSuccess]       = useState('');
    const [togglingId, setTogglingId] = useState(null);

    const fetchUsers = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const res = await axios.get('/api/admin/users', {
                params: { page, search, user_type: filterType }
            });
            setUsers(res.data.data || res.data);
            setPagination(res.data.meta || null);
        } catch (e) {
            setError('تعذّر جلب بيانات المستخدمين.');
        } finally {
            setLoading(false);
        }
    }, [search, filterType]);

    useEffect(() => { fetchUsers(1); }, [fetchUsers]);

    const openCreate = () => {
        setEditUser(null);
        setForm(emptyForm);
        setError('');
        setModalOpen(true);
    };

    const openEdit = (u) => {
        setEditUser(u);
        setForm({
            full_name:   u.full_name   || '',
            username:    u.username    || '',
            email:       u.email       || '',
            password:    '',
            user_type:   u.user_type   || 'reviewer',
            affiliation: u.affiliation || '',
            phone:       u.phone       || '',
        });
        setError('');
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            if (editUser) {
                await axios.put(`/api/admin/users/${editUser.id}`, form);
                setSuccess('تم تحديث بيانات المستخدم بنجاح.');
            } else {
                await axios.post('/api/admin/users', form);
                setSuccess('تم إنشاء الحساب بنجاح.');
            }
            setModalOpen(false);
            fetchUsers(1);
        } catch (err) {
            const msgs = err.response?.data?.errors;
            if (msgs) {
                setError(Object.values(msgs).flat()[0]);
            } else {
                setError(err.response?.data?.message || 'حدث خطأ أثناء الحفظ.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const toggleActive = async (id) => {
        setTogglingId(id);
        try {
            const res = await axios.post(`/api/admin/users/${id}/toggle-active`);
            setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: res.data.is_active } : u));
            setSuccess(res.data.message);
        } catch {
            setError('تعذّر تغيير حالة الحساب.');
        } finally {
            setTogglingId(null);
        }
    };

    return (
        <div dir="rtl" style={{ fontFamily: '"Cairo", sans-serif' }} className="min-h-screen">
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800">إدارة المستخدمين</h1>
                        <p className="text-sm text-slate-400 mt-1 font-bold">
                            إنشاء وإدارة حسابات أدوار النظام الحساسة
                        </p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl font-black text-sm text-white shadow-lg transition hover:opacity-90 active:scale-95"
                        style={{ background: '#105d82' }}
                    >
                        <span className="text-lg">＋</span> إضافة مستخدم جديد
                    </button>
                </div>

                {/* Stats Row */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: 'إجمالي المستخدمين', value: pagination?.total ?? users.length, icon: '👥', color: '#105d82' },
                        { label: 'محكمون', value: users.filter(u => u.user_type === 'reviewer').length, icon: '👨‍⚖️', color: '#be123c' },
                        { label: 'لجنة علمية', value: users.filter(u => u.user_type === 'committee').length, icon: '🎓', color: '#0369a1' },
                        { label: 'حسابات نشطة', value: users.filter(u => u.is_active).length, icon: '✅', color: '#15803d' },
                    ].map((s, i) => (
                        <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
                            <span className="text-2xl">{s.icon}</span>
                            <div>
                                <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
                                <p className="text-[11px] font-bold text-slate-400">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Alerts */}
            {success && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold flex justify-between items-center">
                    ✅ {success}
                    <button onClick={() => setSuccess('')} className="text-emerald-400 hover:text-emerald-600">✕</button>
                </div>
            )}
            {error && !modalOpen && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex justify-between items-center">
                    ⚠️ {error}
                    <button onClick={() => setError('')} className="text-rose-400 hover:text-rose-600">✕</button>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap gap-3 items-center">
                <input
                    type="text"
                    placeholder="بحث بالاسم أو الإيميل..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold outline-none focus:border-sky-400 flex-1 min-w-[200px]"
                />
                <select
                    value={filterType}
                    onChange={e => setFilterType(e.target.value)}
                    className="border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold outline-none focus:border-sky-400 bg-white"
                >
                    <option value="all">جميع الأدوار</option>
                    {ROLES.map(r => <option key={r.value} value={r.value}>{r.icon} {r.label}</option>)}
                    <option value="author">📖 باحث</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-48 text-slate-400 font-bold">
                        <div className="animate-spin text-3xl ml-3">⏳</div> جاري التحميل...
                    </div>
                ) : users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-slate-400 font-bold gap-2">
                        <span className="text-4xl">👤</span>
                        <p>لا توجد مستخدمون مطابقون للبحث.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100" style={{ background: '#f8fafc' }}>
                                    <th className="text-right py-4 px-6 font-black text-slate-500 text-xs tracking-widest uppercase">المستخدم</th>
                                    <th className="text-right py-4 px-4 font-black text-slate-500 text-xs tracking-widest uppercase">الدور</th>
                                    <th className="text-right py-4 px-4 font-black text-slate-500 text-xs tracking-widest uppercase">الجهة</th>
                                    <th className="text-center py-4 px-4 font-black text-slate-500 text-xs tracking-widest uppercase">الحالة</th>
                                    <th className="text-center py-4 px-4 font-black text-slate-500 text-xs tracking-widest uppercase">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u, idx) => (
                                    <tr
                                        key={u.id}
                                        className={`border-b border-gray-50 transition hover:bg-sky-50/40 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
                                    >
                                        {/* User Info */}
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0"
                                                    style={{ background: '#105d82' }}
                                                >
                                                    {(u.full_name || u.username || '?')[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-800">{u.full_name}</p>
                                                    <p className="text-xs text-slate-400 font-bold">{u.email}</p>
                                                    <p className="text-[10px] text-slate-300 font-bold">@{u.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Role */}
                                        <td className="py-4 px-4">
                                            <RoleBadge userType={u.user_type} />
                                        </td>
                                        {/* Affiliation */}
                                        <td className="py-4 px-4">
                                            <span className="text-xs text-slate-500 font-bold">{u.affiliation || '—'}</span>
                                        </td>
                                        {/* Status */}
                                        <td className="py-4 px-4 text-center">
                                            <button
                                                onClick={() => toggleActive(u.id)}
                                                disabled={togglingId === u.id}
                                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black transition ${
                                                    u.is_active
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                                                        : 'bg-red-50 text-red-600 border border-red-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                                                }`}
                                                title={u.is_active ? 'انقر لإيقاف الحساب' : 'انقر لتفعيل الحساب'}
                                            >
                                                {togglingId === u.id ? '⏳' : u.is_active ? '✅ نشط' : '🔴 موقوف'}
                                            </button>
                                        </td>
                                        {/* Actions */}
                                        <td className="py-4 px-4 text-center">
                                            <button
                                                onClick={() => openEdit(u)}
                                                className="text-xs font-black text-sky-600 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg transition"
                                            >
                                                ✏️ تعديل
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.last_page > 1 && (
                    <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
                        {[...Array(pagination.last_page)].map((_, i) => (
                            <button
                                key={`pg-${i}`}
                                onClick={() => fetchUsers(i + 1)}
                                className={`w-9 h-9 rounded-lg text-xs font-black transition ${
                                    pagination.current_page === i + 1
                                        ? 'bg-slate-800 text-white'
                                        : 'bg-gray-100 text-slate-500 hover:bg-gray-200'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Create / Edit Modal */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between" style={{ background: '#105d82' }}>
                    <div>
                        <h2 className="font-black text-white text-lg">
                            {editUser ? '✏️ تعديل بيانات المستخدم' : '➕ إنشاء حساب جديد'}
                        </h2>
                        <p className="text-sky-200 text-xs font-bold mt-0.5">
                            {editUser ? `تعديل: ${editUser.full_name}` : 'يُنشأ الحساب بواسطة الإدارة فقط'}
                        </p>
                    </div>
                    <button
                        onClick={() => setModalOpen(false)}
                        className="text-white/60 hover:text-white text-xl font-black w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
                    >✕</button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    {error && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Role picker */}
                    <div>
                        <label className="block text-xs font-black text-slate-600 mb-2">الدور / الصلاحية *</label>
                        <div className="grid grid-cols-2 gap-2">
                            {ROLES.filter(r => r.value !== 'admin' || (editUser && editUser.user_type === 'admin')).map(r => (
                                <button
                                    key={r.value}
                                    type="button"
                                    disabled={editUser && editUser.user_type === 'admin'}
                                    onClick={() => setForm(f => ({ ...f, user_type: r.value }))}
                                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-black border-2 transition text-right ${
                                        form.user_type === r.value
                                            ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-sm'
                                            : 'border-gray-100 bg-gray-50 text-slate-500 hover:border-gray-300'
                                    } ${(editUser && editUser.user_type === 'admin') ? 'opacity-60 cursor-not-allowed' : ''}`}
                                >
                                    <span className="text-base">{r.icon}</span>
                                    <span>{r.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="block text-xs font-black text-slate-600 mb-1">الاسم الكامل *</label>
                        <input
                            type="text" required
                            value={form.full_name}
                            onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                            placeholder="مثال: د. أحمد محمد علي"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Username */}
                        <div>
                            <label className="block text-xs font-black text-slate-600 mb-1">اسم المستخدم *</label>
                            <input
                                type="text" required={!editUser}
                                value={form.username}
                                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                                placeholder="username"
                                dir="ltr"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition"
                            />
                        </div>
                        {/* Phone */}
                        <div>
                            <label className="block text-xs font-black text-slate-600 mb-1">رقم الهاتف</label>
                            <input
                                type="text"
                                value={form.phone}
                                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                placeholder="00967..."
                                dir="ltr"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-black text-slate-600 mb-1">البريد الإلكتروني *</label>
                        <input
                            type="email" required
                            value={form.email}
                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            placeholder="user@sabauni.edu.ye"
                            dir="ltr"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-black text-slate-600 mb-1">
                            كلمة المرور {editUser ? '(اتركها فارغة إن لم ترد تغييرها)' : '*'}
                        </label>
                        <input
                            type="password"
                            required={!editUser}
                            value={form.password}
                            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                            placeholder="••••••••"
                            dir="ltr"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition"
                        />
                    </div>

                    {/* Affiliation */}
                    <div>
                        <label className="block text-xs font-black text-slate-600 mb-1">الجهة / الجامعة</label>
                        <input
                            type="text"
                            value={form.affiliation}
                            onChange={e => setForm(f => ({ ...f, affiliation: e.target.value }))}
                            placeholder="مثال: جامعة إقليم سبأ"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition"
                        />
                    </div>

                    {/* Submit */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3.5 rounded-xl text-white font-black text-sm shadow-lg transition hover:opacity-90 active:scale-95 disabled:opacity-60"
                            style={{ background: '#105d82' }}
                        >
                            {submitting
                                ? '⏳ جاري الحفظ...'
                                : editUser ? '💾 حفظ التعديلات' : '✅ إنشاء الحساب'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
