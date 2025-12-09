export const getErrorMessage = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    
    if (data.message) return data.message;
    
    switch (status) {
      case 400:
        return data.errors ? Object.values(data.errors).flat()[0] : 'Données invalides';
      case 401:
        return 'Non authentifié';
      case 403:
        return 'Accès refusé';
      case 404:
        return 'Ressource non trouvée';
      case 422:
        return data.errors ? Object.values(data.errors).flat()[0] : 'Validation échouée';
      case 500:
        return 'Erreur serveur. Veuillez réessayer plus tard';
      default:
        return `Erreur ${status}`;
    }
  }
  
  if (error.request) {
    return 'Pas de réponse du serveur. Vérifiez votre connexion';
  }
  
  return error.message || 'Une erreur est survenue';
};

export const isNetworkError = (error) => {
  return !error.response && error.request;
};

export const isValidationError = (error) => {
  return error.response?.status === 422;
};

export const getValidationErrors = (error) => {
  return error.response?.data?.errors || {};
};
