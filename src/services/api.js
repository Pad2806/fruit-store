const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Generic fetch wrapper for API calls
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
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
    return request(`/categories${queryString ? `?${queryString}` : ''}`);
  },
  create: (data) => request('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => request(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => request(`/categories/${id}`, {
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
    return request(`/origins${queryString ? `?${queryString}` : ''}`);
  },
  create: (data) => request('/origins', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => request(`/origins/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => request(`/origins/${id}`, {
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
    return request(`/products${queryString ? `?${queryString}` : ''}`);
  },
  getByCategory: (categoryId) => request(`/products/category/${categoryId}`),
  create: (formData) => fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    body: formData,
  }).then((res) => res.json()),
  update: (id, formData) => fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'POST',
    body: formData,
  }).then((res) => res.json()),
  delete: (id) => request(`/products/${id}`, {
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
    return request(`/orders${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => request(`/orders/${id}`),
  updateStatus: (id, status) => request(`/orders/${id}/status`, {
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
