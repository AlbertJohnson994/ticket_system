import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ticket, Users, BarChart3, Bell, Home, Menu, X } from 'lucide-react';
import Seeder from './Seeder';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Events', path: '/events', icon: Ticket },
    { name: 'Sales', path: '/sales', icon: BarChart3 },
    { name: 'Users', path: '/users', icon: Users },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="glass-panel" style={{ 
        position: 'sticky', 
        top: '1rem', 
        margin: '0 1rem', 
        zIndex: 100, 
        padding: '0.75rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
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
        
        {/* Desktop Navigation */}
        <div className="flex-center hide-mobile" style={{ gap: '2rem' }}>
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

        {/* Desktop Right Section */}
        <div className="flex-center hide-mobile" style={{ gap: '1rem' }}>
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

        {/* Mobile Right Section */}
        <div className="flex-center show-mobile" style={{ gap: '0.75rem', display: 'none' }}>
          <button style={{ color: 'hsl(var(--color-text-muted))', padding: '0.5rem' }}>
            <Bell size={20} />
          </button>
          <button 
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={closeMobileMenu}
      />

      {/* Mobile Menu Drawer */}
      <div className={`mobile-nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <button 
          className="mobile-nav-close"
          onClick={closeMobileMenu}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>

        {/* User Info */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid hsla(0,0%,100%,0.1)',
          marginBottom: '0.5rem'
        }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '50%', 
            background: 'linear-gradient(to right, #8e2de2, #4a00e0)',
            border: '2px solid hsla(0,0%,100%,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            fontWeight: '700',
            color: 'white'
          }}>AJ</div>
          <div>
            <div style={{ fontWeight: '600', color: 'white' }}>Albert Johnson</div>
            <div style={{ fontSize: '0.8rem', color: 'hsl(var(--color-text-muted))' }}>Administrator</div>
          </div>
        </div>

        {/* Navigation Links */}
        {navItems.map((item) => {
          const isActive = item.path === '/' 
            ? location.pathname === '/' 
            : location.pathname.startsWith(item.path);
            
          const Icon = item.icon;
          return (
            <Link 
              key={item.name} 
              to={item.path}
              onClick={closeMobileMenu}
              className={isActive ? 'active' : ''}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'hsl(var(--color-primary))' : 'hsl(var(--color-text-muted))',
                background: isActive ? 'hsla(var(--color-primary), 0.1)' : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          )
        })}

        {/* Seeder in mobile menu */}
        <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
          <Seeder />
        </div>
      </div>
    </>
  );
};

export default Navbar;
