import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import 'antd/dist/reset.css';
import { MessageProvider } from "./MessageContext.jsx";
import router from './routers/router';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MessageProvider>
      <RouterProvider router={router} />
    </MessageProvider>
  </StrictMode>
);