import api from '../api';

export const imageService = {
  upload: async (file, type = 'project') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);
    
    const response = await api.post('/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
  
  delete: async (path) => {
    const response = await api.delete('/delete-image', {
      data: { path }
    });
    
    return response.data;
  }
};