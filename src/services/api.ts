import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Access tokenni saqlash uchun o'zgaruvchi
let accessToken: string | null = null;

// Access tokenni o'rnatish funksiyasi
export const setAccessToken = (token: string) => {
  accessToken = token;
};

// Access tokenni olish funksiyasi
export const getAccessToken = () => accessToken;

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Agar accessToken mavjud bo'lsa, header ga qo'shish
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor - 401 xatoliklarini handle qilish
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // MUHIM: Agar xato /auth/refresh so'rovidan kelsa, interceptor hech narsa qilmasligi kerak
    if (originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            // Yangi accessToken bilan so'rovni qayta jo'natish
            if (accessToken) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('🔄 Token yangilanmoqda...');
        
        // Refresh token so'rovi (cookie avtomatik yuboriladi)
        const refreshResponse = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        // Yangi accessToken ni saqlash
        if (refreshResponse.data?.data?.accessToken) {
          accessToken = refreshResponse.data.data.accessToken;
          console.log('✅ Yangi accessToken olindi');
        }
        
        isRefreshing = false;
        processQueue(null, accessToken);
        
        // Asl so'rovni yangi token bilan qayta jo'natish
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError: any) {
        console.error('❌ Refresh failed:', refreshError.response?.status || refreshError.message);
        
        isRefreshing = false;
        processQueue(refreshError, null);
        accessToken = null;

        // Faqat kerak bo'lganda redirect qilish
        if (typeof window !== 'undefined' && 
            !window.location.pathname.includes('/auth/login') &&
            !window.location.pathname.includes('/auth/register')) {
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const AuthServiceAPI = {
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    if (response.data?.data?.accessToken) {
      accessToken = response.data.data.accessToken;
    }
    return response.data;
  },
  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data?.data?.accessToken) {
      accessToken = response.data.data.accessToken;
    }
    return response.data;
  },
  refresh: async () => {
    const response = await api.post('/auth/refresh');
    if (response.data?.data?.accessToken) {
      accessToken = response.data.data.accessToken;
    }
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    accessToken = null;
    return response.data;
  },
  forgotPassword: async (email: string, method: 'EMAIL' | 'TELEGRAM') => {
    const response = await api.post('/auth/forgot-password', { email, method });
    return response.data;
  },
 resetPassword: async (email: string, otp: string, newPassword: string) => {
    const response = await api.post('/auth/reset-password', { email, otp, newPassword });
    return response.data;
  }
};

export const BookService = {
  getAll: async () => {
    const response = await api.get('/products');
    return response.data;
  },
  getOne: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  }
};

export const UserService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await api.patch('/users/profile', data);
    return response.data;
  },
  updatePassword: async (data: any) => {
    const response = await api.patch('/users/update-password', data);
    return response.data;
  },
  
  // Wishlist
  getWishlist: async () => {
    const response = await api.get('/users/wishlist');
    return response.data;
  },
  toggleWishlist: async (productId: string) => {
    const response = await api.post('/users/wishlist/toggle', { productId });
    return response.data;
  },
  
  // Addresses
  getAddresses: async () => {
    const response = await api.get('/users/addresses');
    return response.data;
  },
  addAddress: async (address: any) => {
    const response = await api.post('/users/address', address);
    return response.data;
  },
  updateAddress: async (addressId: string, address: any) => {
    const response = await api.patch(`/users/address/${addressId}`, address);
    return response.data;
  },
  deleteAddress: async (addressId: string) => {
    const response = await api.delete(`/users/address/${addressId}`);
    return response.data;
  },
  
  // Avatar
  uploadAvatar: async (formData: FormData) => {
    const response = await api.patch('/users/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },


  // Notification settings
  getNotificationSettings: async () => {
    const response = await api.get('/users/notifications');
    return response.data;
  },
  updateNotificationSettings: async (settings: any) => {
    const response = await api.put('/users/notifications', settings);
    return response.data;
  },
  
  // Security settings
  getSecuritySettings: async () => {
    const response = await api.get('/users/security');
    return response.data;
  },
  updateSecuritySettings: async (settings: any) => {
    const response = await api.put('/users/security', settings);
    return response.data;
  },
  
  // Language & Region
  getPreferences: async () => {
    const response = await api.get('/users/preferences');
    return response.data;
  },
  updatePreferences: async (preferences: any) => {
    const response = await api.put('/users/preferences', preferences);
    return response.data;
  },
  
  // Devices
  getDevices: async () => {
    const response = await api.get('/users/devices');
    return response.data;
  },
  removeDevice: async (deviceId: string) => {
    const response = await api.delete(`/users/devices/${deviceId}`);
    return response.data;
  },
  
  // Delete account
  deleteAccount: async (password: string) => {
    const response = await api.delete('/users/account', { data: { password } });
    return response.data;
  }
};
