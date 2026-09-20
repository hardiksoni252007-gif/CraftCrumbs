import React from 'react';
import { Sparkles } from 'lucide-react';

export const Toast = ({ message }) => {
  if (!message) return null;

  return (
    <div className="toast-container">
      <div className="toast">
        <Sparkles size={18} color="var(--color-golden)" />
        <span>{message}</span>
      </div>
    </div>
  );
};
