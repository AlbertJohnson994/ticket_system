import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Calendar, MapPin, Tag, Search, ShoppingCart, Info } from 'lucide-react';
import { eventsApi } from '../services/api';
import Modal from '../components/Modal';
import CategoryEventsPopup from '../components/CategoryEventsPopup';
import PaymentModal from '../components/PaymentModal';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null); // ID of event being deleted
  
  // Category popup state
  const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Payment state
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedEventForPayment, setSelectedEventForPayment] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    eventDate: '',
    price: '',
    totalTickets: '',
  });
  const categories = ['MUSIC', 'CONFERENCE', 'SPORTS', 'THEATER', 'COMEDY', 'ART', 'WORKSHOP', 'OTHER'];

  // Mock data for development/testing when backend is unavailable
  const mockEvents = [
    { id: '1', title: 'Summer Music Festival', category: 'MUSIC', location: 'Central Park', eventDate: '2026-06-15T14:00:00', price: 120.00, totalTickets: 5000, availableTickets: 3200, description: 'The biggest summer music event.', status: 'ACTIVE' },
    { id: '2', title: 'Tech Innovation Summit', category: 'CONFERENCE', location: 'Convention Center', eventDate: '2026-09-10T09:00:00', price: 499.00, totalTickets: 1000, availableTickets: 450, description: 'Future of technology.', status: 'ACTIVE' },
    { id: '3', title: 'City Marathon 2026', category: 'SPORTS', location: 'Downtown', eventDate: '2026-04-12T06:00:00', price: 60.00, totalTickets: 10000, availableTickets: 1200, description: 'Run through the city.', status: 'ACTIVE' },
    { id: '4', title: 'Championship Finals', category: 'SPORTS', location: 'National Stadium', eventDate: '2026-05-20T18:00:00', price: 85.00, totalTickets: 45000, availableTickets: 0, description: 'The ultimate match.', status: 'SOLD_OUT' },
    { id: '5', title: 'AI Ethics Workshop', category: 'CONFERENCE', location: 'Tech Hub', eventDate: '2026-07-05T10:00:00', price: 150.00, totalTickets: 100, availableTickets: 15, description: 'Discussing AI safety.', status: 'ACTIVE' },
    { id: '6', title: 'Phantom of the Opera', category: 'THEATER', location: 'Grand Theater', eventDate: '2026-03-14T19:30:00', price: 180.00, totalTickets: 1200, availableTickets: 250, description: 'Classic musical.', status: 'ACTIVE' },
    { id: '7', title: 'Comedy All-Stars', category: 'COMEDY', location: 'Laugh Factory', eventDate: '2026-02-28T21:00:00', price: 45.00, totalTickets: 300, availableTickets: 0, description: 'Hilarious lineup.', status: 'SOLD_OUT' },
    { id: '8', title: 'Spring Symphony', category: 'MUSIC', location: 'Symphony Hall', eventDate: '2026-04-05T19:00:00', price: 95.00, totalTickets: 1500, availableTickets: 600, description: 'Celebrating spring.', status: 'CANCELLED' },
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventsApi.getAll();
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events, using mock data:', error);
      // Use mock data when backend is unavailable
      setEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (event = null) => {
    if (event) {
      setCurrentEvent(event);
      setFormData({
        title: event.title,
        description: event.description || '',
        location: event.location,
        category: event.category,
        eventDate: event.eventDate, // format might need adjustment
        price: event.price,
        totalTickets: event.totalTickets,
      });
    } else {
      setCurrentEvent(null);
      setFormData({
        title: '',
        description: '',
        location: '',
        category: '',
        eventDate: '',
        price: '',
        totalTickets: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format the payload with correct types for the backend
      const payload = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        category: formData.category.toUpperCase(), // Backend expects uppercase categories
        eventDate: formData.eventDate + (formData.eventDate.length === 16 ? ':00' : ''), // Ensure seconds
        price: parseFloat(formData.price),
        totalTickets: parseInt(formData.totalTickets, 10)
      };
      
      console.log('Sending payload:', payload);
      
      if (currentEvent) {
        await eventsApi.update(currentEvent.id, payload);
      } else {
        await eventsApi.create(payload);
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (error) {
      console.error('Failed to save event:', error);
      
      // Fallback for mock environment if API fails
      if (events.every(e => e.id.length < 10 && !e.id.includes('-'))) { // Simple check for mock IDs
          const newEvent = { 
              ...payload, 
              id: currentEvent ? currentEvent.id : (Math.max(...events.map(e => parseInt(e.id))) + 1).toString(),
              availableTickets: payload.totalTickets,
              status: 'ACTIVE'
          };
          
          if (currentEvent) {
              setEvents(events.map(e => e.id === currentEvent.id ? newEvent : e));
          } else {
              setEvents([...events, newEvent]);
          }
          setIsModalOpen(false);
          alert('Event saved locally (Backend unavailable).');
          return;
      }

      console.error('Error details:', error.response?.data);
      alert('Error saving event. Please check inputs.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await eventsApi.delete(id);
      setDeleteConfirmation(null);
      fetchEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
      
      // Handle mock data deletion
      let isMockDeleted = false;
      setEvents(prev => {
          const isMock = prev.some(e => e.id === id && (e.id.length < 10 && !e.id.includes('-')));
          if (isMock) {
              isMockDeleted = true;
              return prev.filter(e => e.id !== id);
          }
          return prev;
      });
      
      setDeleteConfirmation(null);

      if (!isMockDeleted && !events.some(e => e.id === id && (e.id.length < 10 && !e.id.includes('-')))) {
           alert('Failed to delete event. It might be referenced in sales.');
      }
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setIsCategoryPopupOpen(true);
  };

  const handleEventFromPopup = (event) => {
    setIsCategoryPopupOpen(false);
    handleOpenModal(event);
  };

  const handleOpenPayment = (event) => {
    setSelectedEventForPayment(event);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = (quantity = 0) => {
    // Optimistically update tickets
    if (quantity > 0 && selectedEventForPayment) {
        setEvents(prev => prev.map(e => {
            if (e.id === selectedEventForPayment.id) {
                const newAvailable = Math.max(0, e.availableTickets - quantity);
                const newStatus = newAvailable === 0 ? 'SOLD_OUT' : e.status;
                return { 
                    ...e, 
                    availableTickets: newAvailable,
                    status: newStatus
                };
            }
            return e;
        }));
    }
    fetchEvents();
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(search.toLowerCase()) || 
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
      switch(status) {
          case 'ACTIVE': return 'hsl(var(--color-success))';
          case 'SOLD_OUT': return 'hsl(var(--color-error))';
          case 'INACTIVE': return 'hsl(var(--color-text-muted))';
          case 'CANCELLED': return 'hsl(var(--color-error))';
          default: return 'hsl(var(--color-primary))';
      }
  };

  return (
    <div>
      <div className="flex-center" style={{ justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Events Management</h1>
          <p style={{ color: 'hsl(var(--color-text-muted))' }}>Create and manage your tickets and events</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> New Event
        </button>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div className="glass-panel flex-center" style={{ padding: '0.75rem 1rem', justifyContent: 'flex-start', gap: '1rem', width: '100%', maxWidth: '400px' }}>
          <Search size={20} style={{ color: 'hsl(var(--color-text-muted))' }} />
          <input 
            type="text" 
            placeholder="Search events..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              background: 'transparent',
              border: 'none',
              color: 'hsl(var(--color-text-main))',
              fontSize: '1rem',
              width: '100%',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex-center" style={{ padding: '4rem' }}>Loading...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {filteredEvents.map(event => (
            <div key={event.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                      <span 
                        onClick={() => handleCategoryClick(event.category)}
                        style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: '700', 
                          color: 'hsl(var(--color-primary))', 
                          textTransform: 'uppercase', 
                          letterSpacing: '1px', 
                          cursor: 'pointer',
                          padding: '0.25rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'hsla(var(--color-primary), 0.1)',
                          border: '1px solid hsla(var(--color-primary), 0.2)',
                          transition: 'all 0.2s ease',
                          display: 'inline-block'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'hsla(var(--color-primary), 0.25)';
                          e.target.style.borderColor = 'hsla(var(--color-primary), 0.5)';
                          e.target.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'hsla(var(--color-primary), 0.1)';
                          e.target.style.borderColor = 'hsla(var(--color-primary), 0.2)';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        {event.category}
                      </span>
                      {event.status && (
                          <span style={{
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              color: getStatusColor(event.status),
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              padding: '0.25rem 0.6rem',
                              borderRadius: 'var(--radius-sm)',
                              background: `hsla(from ${getStatusColor(event.status)} h s l / 0.1)`,
                              border: `1px solid hsla(from ${getStatusColor(event.status)} h s l / 0.2)`
                          }}>
                              {event.status.replace('_', ' ')}
                          </span>
                      )}
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginTop: '0.75rem', lineHeight: 1.2 }}>{event.title}</h3>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem', 
                  color: 'hsl(var(--color-primary))', 
                  padding: '0.5rem 1rem',
                  background: 'hsla(var(--color-primary), 0.1)',
                  borderRadius: '12px',
                  fontWeight: '800', 
                  fontSize: '1.25rem' 
                }}>
                  ${event.price}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', margin: '0.5rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'hsl(var(--color-text-muted))' }}>
                  <Calendar size={16} className="text-gradient" />
                  {new Date(event.eventDate).toLocaleDateString()} at {new Date(event.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'hsl(var(--color-text-muted))' }}>
                  <MapPin size={16} className="text-secondary" />
                  {event.location}
                </div>
              </div>

              {/* Tickets Left Progress Bar */}
              <div style={{ marginTop: '0.5rem', padding: '1rem', background: 'hsla(0,0%,0%,0.2)', borderRadius: 'var(--radius-md)', border: '1px solid hsla(0,0%,100%,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                  <span style={{ color: 'hsl(var(--color-text-muted))', fontWeight: '500' }}>Availability</span>
                  <span style={{ fontWeight: '700' }}>{event.availableTickets}/{event.totalTickets} Left</span>
                </div>
                <div style={{ height: '6px', borderRadius: '3px', background: 'hsla(0,0%,100%,0.05)', overflow: 'hidden' }}>
                    <div style={{ 
                        height: '100%', 
                        width: `${(event.availableTickets / event.totalTickets) * 100}%`,
                        background: event.availableTickets > event.totalTickets * 0.3 
                            ? 'linear-gradient(90deg, #10b981, #34d399)' 
                            : event.availableTickets > event.totalTickets * 0.1 
                            ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                            : 'linear-gradient(90deg, #ef4444, #f87171)',
                        borderRadius: '3px',
                        transition: 'width 0.5s ease-out'
                    }} />
                </div>
                {event.availableTickets < 100 && event.availableTickets > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.6rem', color: 'hsl(var(--color-error))', fontSize: '0.75rem', fontWeight: '600' }}>
                        <Info size={12} /> Selling out fast!
                    </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '1rem' }}>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1, gap: '0.75rem', fontSize: '1rem', height: '3rem' }}
                  onClick={() => handleOpenPayment(event)}
                  disabled={event.availableTickets === 0 || ['SOLD_OUT', 'CANCELLED', 'INACTIVE'].includes(event.status)}
                >
                  {event.status === 'CANCELLED' ? 'Cancelled' : 
                   (event.availableTickets === 0 || event.status === 'SOLD_OUT') ? 'Sold Out' : 
                   event.status === 'INACTIVE' ? 'Inactive' :
                   <><ShoppingCart size={18} /> Buy Ticket</>}
                </button>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {deleteConfirmation === event.id ? (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}
                    >
                      <button 
                        className="btn btn-secondary"
                        style={{ padding: '0 0.75rem', fontSize: '0.75rem', height: '3rem' }}
                        onClick={() => setDeleteConfirmation(null)}
                      >
                        Cancel
                      </button>
                      <button 
                        className="btn"
                        style={{ padding: '0 0.75rem', fontSize: '0.75rem', height: '3rem', background: 'hsl(var(--color-error))', color: 'white' }}
                        onClick={() => handleDelete(event.id)}
                      >
                        Confirm
                      </button>
                    </motion.div>
                  ) : (
                    <>
                      <button 
                        className="glass-panel" 
                        style={{ width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'hsla(0,0%,100%,0.05)', color: 'white', border: '1px solid hsla(0,0%,100%,0.1)' }}
                        onClick={() => handleOpenModal(event)}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        className="glass-panel" 
                        style={{ width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'hsla(var(--color-error), 0.1)', color: 'hsl(var(--color-error))', border: '1px solid hsla(var(--color-error), 0.2)' }}
                        onClick={() => setDeleteConfirmation(event.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={currentEvent ? 'Edit Event' : 'Create New Event'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Title</label>
            <input 
              required
              className="glass-panel"
              style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', color: 'white' }}
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Category</label>
              <input 
                required
                className="glass-panel"
                style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                onFocus={() => setIsCategoryDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsCategoryDropdownOpen(false), 200)} // Delay to allow click
              />
              {isCategoryDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ 
                        position: 'absolute', 
                        top: '100%', 
                        left: 0, 
                        width: '100%', 
                        background: 'hsl(var(--color-bg-elevated))', 
                        border: '1px solid hsla(0,0%,100%,0.1)',
                        borderRadius: 'var(--radius-md)',
                        marginTop: '0.5rem',
                        zIndex: 10,
                        maxHeight: '200px',
                        overflowY: 'auto',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                    }}
                  >
                      {categories.map(cat => (
                          <div 
                            key={cat}
                            onClick={() => setFormData({...formData, category: cat})}
                            className="dropdown-item"
                            style={{ 
                                padding: '0.75rem 1rem', 
                                cursor: 'pointer',
                                borderBottom: '1px solid hsla(0,0%,100%,0.05)',
                                fontSize: '0.9rem',
                                color: formData.category === cat ? 'hsl(var(--color-primary))' : 'white',
                                fontWeight: formData.category === cat ? '700' : '400',
                                background: formData.category === cat ? 'hsla(var(--color-primary), 0.1)' : 'transparent'
                            }}
                            onMouseEnter={(e) => e.target.style.background = 'hsla(0,0%,100%,0.1)'}
                            onMouseLeave={(e) => e.target.style.background = formData.category === cat ? 'hsla(var(--color-primary), 0.1)' : 'transparent'}

                          >
                              {cat}
                          </div>
                      ))}
                  </motion.div>
              )}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Price ($)</label>
              <input 
                required
                type="number"
                min="0"
                step="0.01"
                className="glass-panel"
                style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
          </div>

          <div>
             <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Date & Time</label>
             <input 
               required
               type="datetime-local"
               className="glass-panel"
               style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', color: 'white' }}
               value={formData.eventDate}
               onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
             />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Location</label>
            <input 
              required
              className="glass-panel"
              style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', color: 'white' }}
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Total Tickets</label>
            <input 
              required
              type="number"
              min="1"
              max="1000"
              className="glass-panel"
              style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', color: 'white' }}
              value={formData.totalTickets}
              onChange={(e) => setFormData({...formData, totalTickets: e.target.value})}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Description</label>
            <textarea 
              className="glass-panel"
              rows="3"
              style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', color: 'white', fontFamily: 'inherit' }}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">{currentEvent ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      {/* Category Events Popup */}
      <CategoryEventsPopup
        isOpen={isCategoryPopupOpen}
        onClose={() => setIsCategoryPopupOpen(false)}
        category={selectedCategory}
        events={events}
        onEventClick={handleEventFromPopup}
      />

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        event={selectedEventForPayment}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Events;
