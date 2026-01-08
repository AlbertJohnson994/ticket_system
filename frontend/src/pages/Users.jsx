import { useState, useEffect } from 'react';
import { Users as UsersIcon, UserPlus, Mail, Phone, MapPin, Edit2, Trash2, Search, Shield, Clock } from 'lucide-react';
import { usersApi } from '../services/api';
import Modal from '../components/Modal';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        userId: '',
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await usersApi.getAll();
            setUsers(response.data || []);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setCurrentUser(user);
            setFormData({
                userId: user.userId,
                name: user.name,
                email: user.email,
                phone: user.phone || '',
                address: user.address || ''
            });
        } else {
            setCurrentUser(null);
            setFormData({
                userId: '',
                name: '',
                email: '',
                phone: '',
                address: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentUser) {
                await usersApi.update(currentUser.id, formData);
            } else {
                await usersApi.create(formData);
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error('Failed to save user:', error);
            alert('Error saving user.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await usersApi.delete(id);
                fetchUsers();
            } catch (error) {
                console.error('Failed to delete user:', error);
            }
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) || 
        u.userId.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                <div>
                   <h1 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-1px' }}>User <span className="text-gradient">Directory</span></h1>
                   <p style={{ color: 'hsl(var(--color-text-muted))', marginTop: '0.25rem' }}>Manage system identities and access controls</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="btn btn-primary" 
                    style={{ gap: '0.75rem', height: '3rem', padding: '0 1.5rem' }}
                >
                    <UserPlus size={20} /> New User
                </button>
             </div>

             {/* Search Bar */}
             <div className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Search size={20} style={{ color: 'hsl(var(--color-text-muted))' }} />
                <input 
                    type="text" 
                    placeholder="Search by name, ID or email..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ 
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        fontSize: '1rem',
                        width: '100%',
                        outline: 'none'
                    }}
                />
             </div>

             {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem' }}>
                    <div className="spin" style={{ width: '40px', height: '40px', border: '3px solid hsla(0,0%,100%,0.1)', borderTopColor: 'hsl(var(--color-primary))', borderRadius: '50%', margin: '0 auto' }}></div>
                    <p style={{ marginTop: '1rem', color: 'hsl(var(--color-text-muted))' }}>Retrieving identity records...</p>
                </div>
             ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    {filteredUsers.map(user => (
                        <div key={user.id} className="glass-panel" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ 
                                        width: '56px', 
                                        height: '56px', 
                                        borderRadius: '16px', 
                                        background: 'linear-gradient(135deg, hsla(var(--color-primary), 0.2), hsla(var(--color-secondary), 0.2))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.25rem',
                                        fontWeight: '800',
                                        color: 'hsl(var(--color-primary))',
                                        border: '1px solid hsla(var(--color-primary), 0.3)'
                                    }}>
                                        {user.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>{user.name}</h3>
                                        <div style={{ fontSize: '0.8rem', color: 'hsl(var(--color-text-muted))', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Shield size={12} /> ID: {user.userId}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                    <button onClick={() => handleOpenModal(user)} style={{ padding: '0.5rem', color: 'hsl(var(--color-text-muted))' }}>
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(user.id)} style={{ padding: '0.5rem', color: 'hsl(var(--color-error))' }}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'hsl(var(--color-text-muted))' }}>
                                    <Mail size={16} /> {user.email}
                                </div>
                                {user.phone && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'hsl(var(--color-text-muted))' }}>
                                        <Phone size={16} /> {user.phone}
                                    </div>
                                )}
                                {user.address && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'hsl(var(--color-text-muted))' }}>
                                        <MapPin size={16} /> {user.address}
                                    </div>
                                )}
                            </div>

                            <div style={{ 
                                marginTop: '1.5rem', 
                                paddingTop: '1rem', 
                                borderTop: '1px solid hsla(0,0%,100%,0.05)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{ 
                                    fontSize: '0.75rem', 
                                    background: 'hsla(var(--color-success), 0.1)', 
                                    color: 'hsl(var(--color-success))',
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '10px',
                                    fontWeight: '700'
                                }}>
                                    Active Account
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'hsl(var(--color-text-muted))' }}>
                                    <Clock size={12} /> Joined Jan 2026
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredUsers.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem' }}>
                             <UsersIcon size={48} style={{ color: 'hsl(var(--color-text-muted))', opacity: 0.3, margin: '0 auto 1rem' }} />
                             <p style={{ color: 'hsl(var(--color-text-muted))' }}>No users found matching your criteria.</p>
                        </div>
                    )}
                </div>
             )}

             <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title={currentUser ? 'Edit User' : 'Create New User'}
             >
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>User ID (Username)</label>
                        <input 
                            required
                            disabled={!!currentUser}
                            placeholder="e.g. john.doe"
                            style={{ width: '100%', padding: '0.8rem', background: 'hsla(0,0%,0%,0.2)', border: '1px solid hsla(0,0%,100%,0.1)', borderRadius: 'var(--radius-md)', color: 'white' }}
                            value={formData.userId}
                            onChange={(e) => setFormData({...formData, userId: e.target.value})}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Full Name</label>
                        <input 
                            required
                            placeholder="John Doe"
                            style={{ width: '100%', padding: '0.8rem', background: 'hsla(0,0%,0%,0.2)', border: '1px solid hsla(0,0%,100%,0.1)', borderRadius: 'var(--radius-md)', color: 'white' }}
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email Address</label>
                        <input 
                            required
                            type="email"
                            placeholder="john@example.com"
                            style={{ width: '100%', padding: '0.8rem', background: 'hsla(0,0%,0%,0.2)', border: '1px solid hsla(0,0%,100%,0.1)', borderRadius: 'var(--radius-md)', color: 'white' }}
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Phone (Optional)</label>
                        <input 
                            placeholder="+1 234 567 890"
                            style={{ width: '100%', padding: '0.8rem', background: 'hsla(0,0%,0%,0.2)', border: '1px solid hsla(0,0%,100%,0.1)', borderRadius: 'var(--radius-md)', color: 'white' }}
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Address (Optional)</label>
                        <textarea 
                            placeholder="Street, City, State, ZIP"
                            style={{ width: '100%', padding: '0.8rem', background: 'hsla(0,0%,0%,0.2)', border: '1px solid hsla(0,0%,100%,0.1)', borderRadius: 'var(--radius-md)', color: 'white', minHeight: '80px', resize: 'vertical' }}
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', height: '3.5rem' }}>
                        {currentUser ? 'Update User' : 'Create User'}
                    </button>
                </form>
             </Modal>
        </div>
    );
};

export default Users;
