const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Generic fetch wrapper for API calls
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem("access_token");

  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Unauthenticated');
  }

  return response.json();
}


// Category APIs
export const categoryApi = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    return request(`/seller/categories${queryString ? `?${queryString}` : ''}`);
  },
  create: (data) => request('/seller/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => request(`/seller/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => request(`/seller/categories/${id}`, {
    method: 'DELETE',
  }),
};

// Origin APIs
export const originApi = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    return request(`/seller/origins${queryString ? `?${queryString}` : ''}`);
  },
  create: (data) => request('/seller/origins', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => request(`/seller/origins/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => request(`/seller/origins/${id}`, {
    method: 'DELETE',
  }),
};

// Product APIs
export const productApi = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    return request(`/seller/products${queryString ? `?${queryString}` : ''}`);
  },
  getByCategory: (categoryId) => request(`/seller/products/category/${categoryId}`),
  create: (formData) => fetch(`${API_BASE_URL}/seller/products`, {
    method: 'POST',
    body: formData,
  }).then((res) => res.json()),
  update: (id, formData) => fetch(`${API_BASE_URL}/seller/products/${id}`, {
    method: 'POST',
    body: formData,
  }).then((res) => res.json()),
  delete: (id) => request(`/seller/products/${id}`, {
    method: 'DELETE',
  }),
};

// Order APIs
export const orderApi = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    return request(`/seller/orders${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => request(`/seller/orders/${id}`),
  updateStatus: (id, status) => request(`/seller/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  delete: (id) => request(`/orders/${id}`, {
    method: 'DELETE',
  }),
};

export default {
  category: categoryApi,
  origin: originApi,
  product: productApi,
  order: orderApi,
};
