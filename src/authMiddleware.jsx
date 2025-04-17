import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const authMiddleware = (WrappedComponent) => {
  const ComponentWithAuth = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    }, []);

    if (isAuthenticated === null) {
      return null; 
    }

    return isAuthenticated ? (
      <WrappedComponent {...props} />
    ) : (
      <Navigate to="/login" replace />
    );
  };

  return ComponentWithAuth;
};

export default authMiddleware;