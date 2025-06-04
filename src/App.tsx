import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CalendarPage } from './pages/CalendarPage';
import { ListView } from './pages/ListView';
import { Auth } from './pages/Auth';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { CategoriesPage } from './pages/CategoriesPage';
import { store } from './store/store';

export function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/calendar" element={<Layout><CalendarPage /></Layout>} />
          <Route path="/categories" element={<Layout><CategoriesPage /></Layout>} />
          <Route path="/list" element={<Layout><ListView /></Layout>} />
        </Routes>
      </Router>
    </Provider>
  );
}
