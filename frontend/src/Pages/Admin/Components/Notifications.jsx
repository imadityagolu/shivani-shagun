import React, { useEffect, useState } from 'react';

function Notifications({ onAllRead }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    markAllAsRead();
    // eslint-disable-next-line
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem('token');
      const res = await fetch(`${BACKEND_URL}/api/admin/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setNotifications(data);
    } catch (err) {
      setNotifications([]);
    }
    setLoading(false);
  };

  const markAllAsRead = async () => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem('token');
      await fetch(`${BACKEND_URL}/api/admin/notifications/read-all`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (onAllRead) onAllRead();
    } catch (err) {}
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h2 className="text-2xl font-bold text-rose-500 mb-6 text-center">Admin Notifications</h2>
      {loading ? (
        <div className="text-center py-8 text-lg">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-8 text-rose-500 text-xl font-bold">No notifications found.</div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification, idx) => (
            <div
              key={idx}
              className={`w-full p-8 mb-6 rounded-lg border-l-4 transition-all duration-200 ${
                notification.read
                  ? 'bg-gray-50 border-gray-300'
                  : 'bg-rose-50 border-rose-400 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className={`font-semibold mb-1 ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>{notification.title}</h4>
                  <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-700'}`}>{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-2">{new Date(notification.timestamp).toLocaleString()}</p>
                </div>
                {!notification.read && <div className="w-2 h-2 bg-rose-500 rounded-full ml-3 mt-2"></div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications; 