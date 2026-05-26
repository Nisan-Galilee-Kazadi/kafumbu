const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api/admin";

const asMessage = (message, currentUser) => ({
  id: message.id,
  senderId: message.senderRole === "admin" ? 1 : Number(currentUser.id),
  receiverId: message.senderRole === "admin" ? Number(currentUser.id) : 1,
  senderName:
    message.senderRole === "admin"
      ? message.senderName || "Admin Kafumbu"
      : currentUser.name || message.senderName || "Visiteur",
  content: message.content,
  createdAt: message.createdAt,
  read: Boolean(message.read),
});

export const visitorMessageService = {
  getMessages: async (user) => {
    const res = await fetch(`${API_BASE_URL}/visitor/${user.id}/messages`);
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map((message) => asMessage(message, user));
  },

  sendMessage: async (userId, content) => {
    const res = await fetch(`${API_BASE_URL}/visitor/${userId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    return res.json();
  },

  markMessagesRead: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/visitor/${userId}/messages/read`, {
      method: "PUT",
    });
    return res.json();
  },

  getNotifications: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/visitor/${userId}/notifications`);
    return res.json();
  },

  markNotificationRead: async (userId, notificationId) => {
    const res = await fetch(`${API_BASE_URL}/visitor/${userId}/notifications/${notificationId}/read`, {
      method: "PUT",
    });
    return res.json();
  },
};
