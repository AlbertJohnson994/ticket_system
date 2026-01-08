import { useState, useEffect } from 'react';
import { ArrowRight, Ticket, DollarSign, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { salesApi, eventsApi, usersApi } from '../services/api';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="glass-panel" style={{ padding: '1.5rem' }}>
    <div className="flex-center" style={{ 
      justifyContent: 'space-between', 
      marginBottom: '1rem' 
    }}>
      <span style={{ color: 'hsl(var(--color-text-muted))', fontSize: '0.9rem' }}>{title}</span>
      <div style={{ 
        padding: '0.5rem', 
        borderRadius: '8px', 
        backgroundColor: `hsla(${color}, 0.2)`,
        color: `hsl(${color})`
      }}>
        <Icon size={20} />
      </div>
    </div>
    <div style={{ fontSize: '2rem', fontWeight: '700' }}>{value}</div>
    <div style={{ color: 'hsl(var(--color-success))', fontSize: '0.8rem', marginTop: '0.5rem' }}>
      Updated just now
    </div>
  </div>
);

const Home = () => {
    const [stats, setStats] = useState({
        revenue: 0,
        activeEvents: 0,
        users: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch in parallel
                const [revenueRes, eventsRes, usersRes] = await Promise.all([
                   salesApi.getRevenue(),
                   eventsApi.getAll(),
                   usersApi.getAll()
                ]);

                setStats({
                    revenue: revenueRes.data || 0,
                    activeEvents: eventsRes.data ? eventsRes.data.length : 0,
                    users: usersRes.data ? usersRes.data.length : 0
                });
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

  return (
    <div>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '1rem' }}>
          Manage your <br/>
          <span className="text-gradient">Ticket System</span>
        </h1>
        <p style={{ color: 'hsl(var(--color-text-muted))', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          A powerful microservices architecture for handling events, sales, and users. 
          Monitor performance and manage resources in real-time.
        </p>
        <div className="flex-center" style={{ gap: '1rem', marginTop: '2rem' }}>
          <Link to="/events" className="btn btn-primary">
            Explore Events <ArrowRight size={18} />
          </Link>
          <Link to="/sales" className="btn btn-secondary">
            View Analytics
          </Link>
        </div>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        <StatCard 
            title="Total Revenue" 
            value={loading ? "..." : `$${stats.revenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`} 
            icon={DollarSign} 
            color="150 60% 50%" 
        />
        <StatCard 
            title="Active Events" 
            value={loading ? "..." : stats.activeEvents} 
            icon={Ticket} 
            color="260 100% 65%" 
        />
        <StatCard 
            title="Registered Users" 
            value={loading ? "..." : stats.users} 
            icon={Users} 
            color="190 100% 50%" 
        />
      </div>
    </div>
  );
};

export default Home;
