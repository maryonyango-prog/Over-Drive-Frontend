import api from './api';

export const mediaService = {
  uploadImage: (vehicleId, file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post(`/media/vehicles/${vehicleId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};