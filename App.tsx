import React, { useEffect, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';
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
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/stay" element={<Layout><Stay /></Layout>} />
        <Route path="/events" element={<Layout><Events /></Layout>} />
        <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />

        {/* Admin Routes wrapped in AdminLayout */}
        <Route path="/admin" element={<AdminLayout><Admin /></AdminLayout>} />
        <Route path="/admin/leads" element={<AdminLayout><AdminLeads /></AdminLayout>} />
        <Route path="/admin/content" element={<AdminLayout><AdminContent /></AdminLayout>} />
        <Route path="/admin/gallery" element={<AdminLayout><AdminGalleryPage /></AdminLayout>} />
        <Route path="/admin/branding" element={<AdminLayout><AdminBrandingPage /></AdminLayout>} />
      </Routes>
    </Router>
  );
};

export default App;
