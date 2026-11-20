import { Navigate, Route, Routes } from 'react-router-dom';
import ToastProvider from './components/ToastProvider';
import MainLayout from './layouts/MainLayout';
import EventCreatePage from './pages/EventCreatePage';
import EventDetailPage from './pages/EventDetailPage';
import EventEditPage from './pages/EventEditPage';
import EventListPage from './pages/EventListPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Navigate to="/events" replace />} />
          <Route path="events" element={<EventListPage />} />
          <Route path="events/new" element={<EventCreatePage />} />
          <Route path="events/:id" element={<EventDetailPage />} />
          <Route path="events/:id/edit" element={<EventEditPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
}
