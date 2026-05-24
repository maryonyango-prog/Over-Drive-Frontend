import api from './api';

export const vehicleService = {
  createValuation: (data) => api.post('/vehicle/valuation', data),
  getHistory: () => api.get('/vehicle/history'),
  analyzeVehicle: (id) => api.post(`/vehicle/${id}/analyze`),
  revalue: (id) => api.post(`/vehicle/${id}/revalue`),  
};