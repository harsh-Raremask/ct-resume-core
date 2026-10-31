import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import FloatingOrderButton from './components/FloatingOrderButton';
import Home from './pages/Home';
import Work from './pages/Work';
import Services from './pages/Services';
import Store from './pages/Store';
import About from './pages/About';
import Admin from './pages/Admin';
import CustomPage from './pages/CustomPage';
import AuthModal from './components/auth/AuthModal';
import GatePopup from './components/auth/GatePopup';
import ProfileDrawer from './components/auth/ProfileDrawer';
import { ContentProvider } from './contexts/ContentContext';
import { AuthProvider } from './contexts/AuthContext';

function Layout() {
  const location = useLocation();
  const isAdmin =
    location.pathname.startsWith('/ct-vault') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/rm-vault');

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/ct-vault" element={<Admin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/rm-vault" element={<Admin />} />
      </Routes>
    );
  }

  return (
    <>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/templates" element={<Work />} />
          <Route path="/work" element={<Work />} />
          <Route path="/services" element={<Services />} />
          <Route path="/store" element={<Store />} />
          <Route path="/about" element={<About />} />
          <Route path="/:slug" element={<CustomPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <FloatingOrderButton />
      <AuthModal />
      <GatePopup />
      <ProfileDrawer />
    </>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <AuthProvider>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </AuthProvider>
    </ContentProvider>
  );
}
