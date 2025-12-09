import React, { useEffect } from 'react';
import './Toast.css';

export const Toast = ({ message, type = 'error', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`toast toast--${type}`} role="alert">
      <span className="toast__message">{message}</span>
      <button 
        className="toast__close" 
        onClick={onClose}
        aria-label="Fermer"
      >
        ✕
      </button>
    </div>
  );
};

export const useToast = () => {
  const [toasts, setToasts] = React.useState([]);

  const addToast = (message, type = 'error', duration = 4000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return { toasts, addToast, removeToast };
};
