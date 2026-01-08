import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999, // Ensure it's higher than anything
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-panel"
          style={{
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto',
            backgroundColor: 'hsl(var(--color-bg-elevated))',
            boxShadow: 'var(--shadow-lg)',
            padding: 0,
            border: '1px solid hsla(0,0%,100%,0.1)'
          }}
        >
          <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid hsla(0,0%,100%,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{title}</h3>
            <button onClick={onClose} style={{ color: 'hsl(var(--color-text-muted))' }}>
              <X size={20} />
            </button>
          </div>
          <div style={{ padding: '1.5rem' }}>
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
