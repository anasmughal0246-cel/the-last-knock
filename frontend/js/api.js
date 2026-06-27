const API_BASE = '/api';
const api = {
  async request(method, endpoint, body = null) {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Something went wrong');
    return data;
  },
  get:    (endpoint)       => api.request('GET',    endpoint),
  post:   (endpoint, body) => api.request('POST',   endpoint, body),
  put:    (endpoint, body) => api.request('PUT',    endpoint, body),
  delete: (endpoint)       => api.request('DELETE', endpoint),
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login',    data),
  getMe:    ()     => api.get('/auth/me'),
  getChapter:    (id)              => api.get(`/chapters/${id}`),
  makeChoice:    (chapterId, data) => api.post(`/chapters/${chapterId}/choice`, data),
  getProgress:   ()     => api.get('/progress'),
  saveProgress:  (data) => api.post('/progress', data),
  resetProgress: ()     => api.delete('/progress'),
  getAchievements: ()   => api.get('/achievements'),
  getEndings:    ()     => api.get('/endings'),
  getProfile:    ()     => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  getLeaderboard:()     => api.get('/profile/leaderboard'),
};
window.api = api;