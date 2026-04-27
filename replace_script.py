import os

filepath = 'resources/js/Pages/Committee/Research.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

search = """                                    ))}
                                </select>
                                {/* Multi-Level Decision Modal */}"""

replace = """                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="submit" className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20">إسناد المحكم</button>
                                <button type="button" onClick={closeModals} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition">إلغاء</button>
                            </div>
                        </form>
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <button 
                                type="button"
                                onClick={() => {
                                    closeModals();
                                    setInvitationLink(null);
                                    setInviteForm({name: "", email: "", affiliation: "", paper_id: selectedPaper?.id});
                                    setShowInviteModal(true);
                                }}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-50 text-indigo-700 font-black rounded-xl hover:bg-indigo-100 transition"
                            >
                                <span>✉️</span> إرسال دعوة لمحكم خارجي
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Invite External Reviewer Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-black text-indigo-950">إرسال دعوة لمحكم خارجي</h3>
                            <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-red-500 transition">✕</button>
                        </div>
                        <p className="text-sm font-bold text-gray-500 mb-6 border-r-4 border-indigo-400 pr-3">
                            {selectedPaper?.title}
                        </p>

                        {invitationLink ? (
                            <div className="space-y-6">
                                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                                    <p className="text-emerald-800 font-bold mb-4">تم إنشاء الرابط بنجاح! انسخ الرابط وأرسله للمحكم:</p>
                                    <div className="p-4 bg-white border border-emerald-200 rounded-xl font-mono text-xs break-all select-all">
                                        {invitationLink}
                                    </div>
                                    <p className="text-xs text-emerald-600 mt-4 font-bold">بمجرد تسجيل المحكم من هذا الرابط، سيتم إسناد البحث له تلقائياً.</p>
                                </div>
                                <button onClick={() => setShowInviteModal(false)} className="w-full py-4 bg-gray-100 text-gray-700 font-black rounded-xl hover:bg-gray-200 transition">إغلاق</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSendInvitation} className="space-y-4 text-right">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">اسم الأستاذ / المحكم</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none"
                                        value={inviteForm.name}
                                        onChange={e => setInviteForm({...inviteForm, name: e.target.value})}
                                        placeholder="مثال: د. أحمد محمد"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
                                    <input 
                                        type="email" 
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none"
                                        value={inviteForm.email}
                                        onChange={e => setInviteForm({...inviteForm, email: e.target.value})}
                                        placeholder="professor@university.edu"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">الجامعة / التخصص</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none"
                                        value={inviteForm.affiliation}
                                        onChange={e => setInviteForm({...inviteForm, affiliation: e.target.value})}
                                        placeholder="جامعة ..."
                                    />
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button type="submit" className="flex-1 bg-indigo-950 text-white py-3 rounded-xl font-bold hover:bg-indigo-800 transition shadow-lg shadow-indigo-900/20">إنشاء رابط الدعوة</button>
                                    <button type="button" onClick={() => setShowInviteModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition">إلغاء</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

                                {/* Multi-Level Decision Modal */}"""

if search in content:
    content = content.replace(search, replace)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Search string not found")
