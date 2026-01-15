import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ 
            marginTop: 'auto', 
            padding: '1rem 0',
            borderTop: '1px solid hsla(0,0%,100%,0.1)',
            background: 'linear-gradient(to bottom, hsla(0,0%,0%,0), hsla(0,0%,0%,0.3))'
        }}>
            <div className="container">
                <div className="footer-grid">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.5px' }}>
                            Ticket<span className="text-gradient">Sys</span>
                        </div>
                        <p style={{ color: 'hsl(var(--color-text-muted))', fontSize: '0.8rem', maxWidth: '300px' }}>
                            The next generation event management platform.
                        </p>
                    </div>

                    <div className="footer-links-group" style={{ display: 'flex', gap: '1.5rem' }}>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Product</span>
                            <a href="#" style={{ color: 'hsl(var(--color-text-muted))', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}>Features</a>
                            <a href="#" style={{ color: 'hsl(var(--color-text-muted))', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}>Pricing</a>
                            <a href="#" style={{ color: 'hsl(var(--color-text-muted))', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}>API</a>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Company</span>
                            <a href="#" style={{ color: 'hsl(var(--color-text-muted))', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}>About</a>
                            <a href="#" style={{ color: 'hsl(var(--color-text-muted))', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}>Blog</a>
                            <a href="#" style={{ color: 'hsl(var(--color-text-muted))', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}>Careers</a>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Legal</span>
                            <a href="#" style={{ color: 'hsl(var(--color-text-muted))', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}>Privacy</a>
                            <a href="#" style={{ color: 'hsl(var(--color-text-muted))', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}>Terms</a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom" style={{ 
                    color: 'hsl(var(--color-text-muted))',
                    fontSize: '0.8rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        &copy; 2026 TicketSys Inc. All rights reserved.
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <a href="#" style={{ color: 'inherit', transition: 'color 0.2s' }}><Github size={18} /></a>
                        <a href="#" style={{ color: 'inherit', transition: 'color 0.2s' }}><Twitter size={18} /></a>
                        <a href="#" style={{ color: 'inherit', transition: 'color 0.2s' }}><Linkedin size={18} /></a>
                    </div>
                </div>
                
                <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.8rem', color: 'hsla(var(--color-text-muted), 0.5)' }}>
                    Made with <Heart size={10} style={{ display: 'inline', color: 'hsl(var(--color-error))' }} /> by Albert Johnson
                </div>
            </div>
        </footer>
    );
};

export default Footer;
