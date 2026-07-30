// ======================================================
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router/dom';
import Router from './routes/Router.jsx';
import AuthProvider from './provider/AuthProvider.jsx';

// 1. Import React Toastify and its mandatory styles
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ThemeProvider from './provider/ThemeProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={Router} />
      </AuthProvider>

      {/* 2. Global Toast Container placed at the root level */}
      <ToastContainer />
    </ThemeProvider>
  </StrictMode>,
);

// ================================================================= toast styles

{
  /* <ToastContainer
  position="top-right"
  autoClose={1500}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="colored"
/>; */
}
