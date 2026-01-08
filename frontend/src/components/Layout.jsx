import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="container animate-fade-in" style={{ marginTop: '2rem', flex: 1, paddingBottom: '3rem' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
