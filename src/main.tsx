import React from 'react';
import ReactDOM from 'react-dom/client';
import { CategoryDropdown } from '@/components/CategoryNavbar';

const rootEl = document.getElementById('category-dropdown-root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <CategoryDropdown />
    </React.StrictMode>
  );
}
