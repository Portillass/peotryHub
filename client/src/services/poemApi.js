import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://peotryhub-3.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getPoems(topic = '') {
  const params = topic && topic !== 'All' ? { topic } : {};
  const response = await api.get('/poems', { params });
  return response.data;
}

export async function submitPoem(payload) {
  const response = await api.post('/poems', payload);
  return response.data;
}

export async function likePoem(id) {
  const response = await api.post(`/poems/${id}/like`);
  return response.data;
}

export async function addComment(id, payload) {
  const response = await api.post(`/poems/${id}/comments`, payload);
  return response.data;
}
