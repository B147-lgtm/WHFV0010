import React, { useEffect, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Stay } from './pages/Stay';
import { Events } from './pages/Events';
import { Gallery } from './pages/Gallery';
import { Contact } from './pages/Contact';
import { Admin } from './pages/Admin';
import { AdminLeads } from './pages/AdminLeads';
import { AdminContent } from './pages/AdminContent';

// Lazy load specific admin tools
const AdminGalleryPage = React.lazy(() => import('./app/admin/gallery/page'));
const AdminBrandingPage = React.lazy(() => import('./app/admin/branding/page'));

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Suspense fallback={<div className="min-h-screen bg-beige flex items-center justify-center font-serif text-2xl">Refining Experiences...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stay" element={<Stay />} />
            <Route path="/events" element={<Events />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/gallery" element={<AdminGalleryPage />} />
            <Route path="/admin/branding" element={<AdminBrandingPage />} />
            <Route path="/admin/leads" element={<AdminLeads />} />
            <Route path="/admin/content" element={<AdminContent />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
};

export default App;