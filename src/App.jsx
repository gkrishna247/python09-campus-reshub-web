import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';

// Placeholder components for routes we haven't implemented yet
// We will replace these as we implement the actual pages
import UserList from './pages/users/UserList';
import UserForm from './pages/users/UserForm';
import ResourceList from './pages/resources/ResourceList';
import ResourceForm from './pages/resources/ResourceForm';
import BookingList from './pages/bookings/BookingList';
import BookingForm from './pages/bookings/BookingForm';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route path="/users" element={<UserList />} />
          <Route path="/users/new" element={<UserForm />} />
          <Route path="/users/:id/edit" element={<UserForm />} />

          <Route path="/resources" element={<ResourceList />} />
          <Route path="/resources/new" element={<ResourceForm />} />
          <Route path="/resources/:id/edit" element={<ResourceForm />} />

          <Route path="/bookings" element={<BookingList />} />
          <Route path="/bookings/new" element={<BookingForm />} />
        </Routes>
        <ToastContainer position="bottom-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;
