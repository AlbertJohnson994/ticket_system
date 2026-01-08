import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: '2rem' }}>
      <Navbar />
      <main className="container animate-fade-in" style={{ marginTop: '2rem' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
