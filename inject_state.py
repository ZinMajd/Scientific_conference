import os

filepath = 'resources/js/Pages/Committee/Research.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

search = "    const [showAssignModal, setShowAssignModal] = useState(false);"

replace = """    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteForm, setInviteForm] = useState({ name: "", email: "", affiliation: "", paper_id: "" });
    const [invitationLink, setInvitationLink] = useState(null);

    const handleSendInvitation = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/committee/reviewers/invite', inviteForm);
            setInvitationLink(response.data.invitation_link);
            alert('تم إنشاء دعوة التسجيل بنجاح.');
            setInviteForm({ name: '', email: '', affiliation: '', paper_id: '' });
        } catch (error) {
            alert('فشل إرسال الدعوة: ' + (error.response?.data?.message || error.message));
        }
    };
"""

if search in content:
    content = content.replace(search, replace)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("State injected successfully")
else:
    print("Search string not found")
