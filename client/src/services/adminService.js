const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api/admin";

const getHeaders = () => {
  const token = localStorage.getItem("adminToken");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// ============================================================================
// AUTH
// ============================================================================

export const authService = {
  // Login via USERNAME de la plateforme (ex: jean@kafumbu-smartcity.cd)
  login: async (username, password) => {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.token && data.user?.role === "admin") {
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));
    } else if (data.token && data.user?.role === "visitor") {
      localStorage.setItem("visitorToken", data.token);
      localStorage.setItem("ksc-active-session", JSON.stringify(data.user));
    }
    return data;
  },

  requestRegistrationCode: async (payload) => {
    const res = await fetch(`${API_BASE_URL}/register/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || "Impossible d'envoyer le code.");
    }
    return data;
  },

  verifyRegistrationCode: async (email, code) => {
    const res = await fetch(`${API_BASE_URL}/register/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || "Code de validation incorrect.");
    }
    if (data.token) {
      localStorage.setItem("visitorToken", data.token);
      localStorage.setItem("ksc-active-session", JSON.stringify(data.user));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
  },

  requestPasswordReset: async (email) => {
    const res = await fetch(`${API_BASE_URL}/password/reset-request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || "Impossible d'envoyer le code de réinitialisation.");
    }
    return data;
  },

  verifyPasswordReset: async (email, code, newPassword) => {
    const res = await fetch(`${API_BASE_URL}/password/reset-verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || "Code de validation incorrect ou expiré.");
    }
    return data;
  },

  getToken: () => localStorage.getItem("adminToken"),
  getUser: () => JSON.parse(localStorage.getItem("adminUser") || "{}"),
};

// ============================================================================
// USERS
// ============================================================================

export const userService = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/users`, { headers: getHeaders() });
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.json();
  },

  deleteMessages: async (id) => {
    const res = await fetch(`${API_BASE_URL}/users/${id}/messages`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.json();
  },

  cleanupNonPrimary: async () => {
    const res = await fetch(`${API_BASE_URL}/users-cleanup/non-primary`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.json();
  },
};

// ============================================================================
// CAMPAIGNS
// ============================================================================

export const campaignService = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/campaigns`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(`${API_BASE_URL}/campaigns`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.json();
  },
};

// ============================================================================
// NEWS/PUBLICATIONS
// ============================================================================

export const newsService = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/news`, { headers: getHeaders() });
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/news/${id}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(`${API_BASE_URL}/news`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/news/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE_URL}/news/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.json();
  },
};

// ============================================================================
// MEDIA
// ============================================================================

export const mediaService = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/media`, { headers: getHeaders() });
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(`${API_BASE_URL}/media`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE_URL}/media/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.json();
  },
};

// ============================================================================
// SETTINGS
// ============================================================================

export const settingsService = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/settings`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  update: async (key, value, type = "string") => {
    const res = await fetch(`${API_BASE_URL}/settings/${key}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ value, type }),
    });
    return res.json();
  },
};

// ============================================================================
// STATS
// ============================================================================

export const statsService = {
  getStats: async () => {
    const res = await fetch(`${API_BASE_URL}/stats`, { headers: getHeaders() });
    return res.json();
  },
};

export const notificationService = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/notifications`, { headers: getHeaders() });
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(`${API_BASE_URL}/notifications`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  markRead: async (id) => {
    const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: "PUT",
      headers: getHeaders(),
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE_URL}/notifications/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.json();
  },
};

export const adminMessageService = {
  getConversations: async () => {
    const res = await fetch(`${API_BASE_URL}/messages/conversations`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  getThread: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/messages/${userId}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  sendToVisitor: async (userId, content) => {
    const res = await fetch(`${API_BASE_URL}/messages/${userId}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ content }),
    });
    return res.json();
  },
};

export const adminSearchService = {
  search: async (query) => {
    const res = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`, {
      headers: getHeaders(),
    });
    return res.json();
  },
};
