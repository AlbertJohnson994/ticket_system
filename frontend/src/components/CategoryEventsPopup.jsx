import { X, Calendar, MapPin, Tag, Ticket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

const CategoryEventsPopup = ({ isOpen, onClose, category, events, onEventClick }) => {
  if (!isOpen) return null;

  const filteredEvents = events.filter(
    event => event.category.toLowerCase() === category.toLowerCase()
  );

  return createPortal(
    <AnimatePresence>
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="glass-panel"
          style={{
            width: '100%',
            maxWidth: '700px',
            maxHeight: '80vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'hsl(var(--color-bg-elevated))',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            border: '1px solid hsla(0,0%,100%,0.15)'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1.5rem 2rem',
            borderBottom: '1px solid hsla(0,0%,100%,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, hsla(var(--color-primary), 0.15), hsla(var(--color-secondary), 0.1))'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, hsl(var(--color-primary)), hsl(280, 80%, 60%))',
                boxShadow: 'var(--shadow-neon)'
              }}>
                <Ticket size={24} />
              </div>
              <div>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 700,
                  background: 'linear-gradient(to right, hsl(var(--color-primary)), hsl(var(--color-secondary)))',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}>
                  {category}
                </h3>
                <p style={{ color: 'hsl(var(--color-text-muted))', fontSize: '0.9rem' }}>
                  {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} available
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              style={{ 
                padding: '0.5rem',
                borderRadius: '50%',
                color: 'hsl(var(--color-text-muted))',
                transition: 'all 0.2s ease',
                background: 'hsla(0,0%,100%,0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'hsla(0,0%,100%,0.15)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'hsla(0,0%,100%,0.05)';
                e.currentTarget.style.color = 'hsl(var(--color-text-muted))';
              }}
            >
              <X size={22} />
            </button>
          </div>

          {/* Events List */}
          <div style={{
            padding: '1.5rem',
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {filteredEvents.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: 'hsl(var(--color-text-muted))'
              }}>
                <Ticket size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <p>No events found in this category.</p>
              </div>
            ) : (
              filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onEventClick && onEventClick(event)}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'hsla(var(--color-bg-surface), 0.8)',
                    border: '1px solid hsla(0,0%,100%,0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(8px)';
                    e.currentTarget.style.borderColor = 'hsla(var(--color-primary), 0.4)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.borderColor = 'hsla(0,0%,100%,0.08)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0.75rem'
                  }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{event.title}</h4>
                    <span style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: 'hsl(var(--color-success))'
                    }}>
                      ${event.price}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    color: 'hsl(var(--color-text-muted))',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={14} style={{ color: 'hsl(var(--color-secondary))' }} />
                      {new Date(event.eventDate).toLocaleDateString()} {' '}
                      {new Date(event.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={14} style={{ color: 'hsl(var(--color-primary))' }} />
                      {event.location}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Tag size={14} style={{ color: 'hsl(var(--color-warning))' }} />
                      {event.availableTickets}/{event.totalTickets} tickets
                    </div>
                  </div>

                  {/* Ticket availability indicator */}
                  <div style={{
                    marginTop: '1rem',
                    height: '4px',
                    borderRadius: '2px',
                    background: 'hsla(0,0%,100%,0.1)',
                    overflow: 'hidden'
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(event.availableTickets / event.totalTickets) * 100}%` }}
                      transition={{ delay: index * 0.05 + 0.3, duration: 0.5 }}
                      style={{
                        height: '100%',
                        background: event.availableTickets > event.totalTickets * 0.3 
                          ? 'linear-gradient(90deg, hsl(var(--color-success)), hsl(160, 70%, 50%))' 
                          : event.availableTickets > event.totalTickets * 0.1
                          ? 'linear-gradient(90deg, hsl(var(--color-warning)), hsl(50, 90%, 55%))'
                          : 'linear-gradient(90deg, hsl(var(--color-error)), hsl(20, 70%, 55%))',
                        borderRadius: '2px'
                      }}
                    />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default CategoryEventsPopup;
