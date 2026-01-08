import { Link, useLocation } from 'react-router-dom';
import { Ticket, Users, BarChart3, Bell, Home } from 'lucide-react';
import Seeder from './Seeder';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Events', path: '/events', icon: Ticket },
    { name: 'Sales', path: '/sales', icon: BarChart3 },
    { name: 'Users', path: '/users', icon: Users },
  ];

  return (
    <nav className="glass-panel" style={{ 
      position: 'sticky', 
      top: '1rem', 
      margin: '0 1rem', 
      zIndex: 100, 
      padding: '0.75rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Link to="/" className="flex-center" style={{ gap: '0.5rem' }}>
        <div style={{ 
          width: '32px', 
          height: '32px', 
          borderRadius: '8px', 
          background: 'linear-gradient(135deg, hsl(var(--color-primary)), hsl(var(--color-secondary)))' 
        }}></div>
        <span style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.5px' }}>
          Ticket<span className="text-gradient">Sys</span>
        </span>
      </Link>
      
      <div className="flex-center" style={{ gap: '2rem' }}>
        {navItems.map((item) => {
          const isActive = item.path === '/' 
            ? location.pathname === '/' 
            : location.pathname.startsWith(item.path);
            
          const Icon = item.icon;
          return (
            <Link 
              key={item.name} 
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: isActive ? 'hsl(var(--color-primary))' : 'hsl(var(--color-text-muted))',
                fontWeight: isActive ? 600 : 500,
                transition: 'color 0.2s',
              }}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          )
        })}
      </div>

      <div className="flex-center" style={{ gap: '1rem' }}>
        <Seeder />
        <button style={{ color: 'hsl(var(--color-text-muted))', padding: '0.5rem' }}>
          <Bell size={20} />
        </button>
        <div className="flex-center" style={{ gap: '0.75rem' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%', 
            background: 'linear-gradient(to right, #8e2de2, #4a00e0)',
            border: '2px solid hsla(0,0%,100%,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8rem',
            fontWeight: '700',
            color: 'white'
          }}>AJ</div>
          <span style={{ 
            fontSize: '0.9rem', 
            fontWeight: '500',
            color: 'hsl(var(--color-text-main))'
          }}>Albert Johnson</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
