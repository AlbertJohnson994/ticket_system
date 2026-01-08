import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Events from './pages/Events';
import Sales from './pages/Sales';
import Users from './pages/Users';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
