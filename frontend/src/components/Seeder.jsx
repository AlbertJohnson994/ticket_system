import { useState } from 'react';
import { Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { eventsApi, usersApi } from '../services/api';

const Seeder = () => {
    const [status, setStatus] = useState('idle'); // idle, seeding, success, error
    const [message, setMessage] = useState('');

    const seedData = async () => {
        try {
            setStatus('seeding');
            
            // Seed Users
            const userPayload = {
                userId: "albert.johnson",
                email: "albert.johnson@example.com",
                name: "Albert Johnson"
            };
            // Note: In a real scenario, check if exists first, but for now we try to create
            try { await usersApi.create(userPayload); } catch (e) { console.log('User might already exist', e); }

            // Seed Events - format dates as ISO string for LocalDateTime parsing
            const formatDate = (daysFromNow) => {
                const date = new Date(Date.now() + 86400000 * daysFromNow);
                return date.toISOString().slice(0, 19); // Format: 2026-01-15T10:00:00
            };

            const events = [
                {
                    title: "Neon Dreams Experience",
                    description: "A futuristic journey through sound and light.",
                    location: "Cyber Arena, Tokyo",
                    category: "MUSIC",
                    eventDate: formatDate(45),
                    price: 210.00,
                    totalTickets: 3500
                },
                {
                    title: "Global Tech Pioneers",
                    description: "Where the future creates itself. Join the revolution.",
                    location: "Silicon Valley Expo",
                    category: "CONFERENCE",
                    eventDate: formatDate(90),
                    price: 599.00,
                    totalTickets: 800
                },
                {
                    title: "Grand Slam Finals",
                    description: "The ultimate tennis showdown of the year.",
                    location: "Arthur Ashe Stadium",
                    category: "SPORTS",
                    eventDate: formatDate(20),
                    price: 450.00,
                    totalTickets: 1000
                },
                {
                    title: "The Phantom Returns",
                    description: "An exclusive revival of the broadway classic.",
                    location: "Majestic Theatre, NY",
                    category: "THEATER",
                    eventDate: formatDate(15),
                    price: 180.00,
                    totalTickets: 1200
                },
                 {
                    title: "Laugh Factory Special",
                    description: "Featuring top comedians from around the globe.",
                    location: "Laugh Factory, LA",
                    category: "COMEDY",
                    eventDate: formatDate(10),
                    price: 65.00,
                    totalTickets: 300
                }
            ];

            for (const event of events) {
                await eventsApi.create(event);
            }

            setStatus('success');
            setMessage('Database seeded successfully!');
            setTimeout(() => setStatus('idle'), 3000);
            
            // Reload page or trigger global refresh if needed
            // window.location.reload(); 
        } catch (error) {
            console.error(error);
            setStatus('error');
            const errMsg = error.response?.data?.message || error.message || 'Failed to seed data';
            setMessage(`Error: ${errMsg}`);
        }
    };

    return (
        <button 
            onClick={seedData} 
            disabled={status === 'seeding'}
            className="btn btn-secondary"
            style={{ 
                fontSize: '0.8rem', 
                padding: '0.5rem 1rem',
                border: status === 'error' ? '1px solid var(--color-error)' : undefined
            }}
        >
            {status === 'seeding' ? (
                <><Loader2 className="spin" size={16} /> Seeding...</>
            ) : status === 'success' ? (
                <><CheckCircle size={16} color="hsl(var(--color-success))" /> Done</>
            ) : status === 'error' ? (
                <><AlertCircle size={16} color="hsl(var(--color-error))" /> Error</>
            ) : (
                <><Database size={16} /> Seed Data</>
            )}
        </button>
    );
};

export default Seeder;
