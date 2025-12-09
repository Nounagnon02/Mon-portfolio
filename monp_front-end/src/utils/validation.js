export const validators = {
  email: (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value) ? null : 'Email invalide';
  },
  
  name: (value) => {
    if (!value || value.trim().length === 0) return 'Le nom est requis';
    if (value.length > 255) return 'Le nom ne doit pas dépasser 255 caractères';
    return null;
  },
  
  subject: (value) => {
    if (!value || value.trim().length === 0) return 'Le sujet est requis';
    if (value.length > 255) return 'Le sujet ne doit pas dépasser 255 caractères';
    return null;
  },
  
  message: (value) => {
    if (!value || value.trim().length === 0) return 'Le message est requis';
    if (value.length > 5000) return 'Le message ne doit pas dépasser 5000 caractères';
    return null;
  }
};

export const sanitize = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

export const validateForm = (formData, fields) => {
  const errors = {};
  fields.forEach(field => {
    if (validators[field]) {
      const error = validators[field](formData[field]);
      if (error) errors[field] = error;
    }
  });
  return errors;
};
