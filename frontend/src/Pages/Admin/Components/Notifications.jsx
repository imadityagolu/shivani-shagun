import React, { useEffect, useState } from 'react';
import { FaCheck, FaEye } from 'react-icons/fa';

function Notifications({ onAllRead }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState({});

  useEffect(() => {
    fetchNotifications();
    // Removed automatic markAllAsRead call
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

  const markNotificationAsRead = async (notificationId) => {
    setMarkingRead(prev => ({ ...prev, [notificationId]: true }));
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem('token');
      const res = await fetch(`${BACKEND_URL}/api/admin/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        // Update the notification in local state
        setNotifications(prev => prev.map(notification => 
          notification._id === notificationId 
            ? { ...notification, read: true }
            : notification
        ));
        
        // Call onAllRead callback if provided
        if (onAllRead) onAllRead();
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
    setMarkingRead(prev => ({ ...prev, [notificationId]: false }));
  };

  const markAllAsRead = async () => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem('token');
      await fetch(`${BACKEND_URL}/api/admin/notifications/read-all`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update all notifications in local state
      setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
      
      if (onAllRead) onAllRead();
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-rose-500">Admin Notifications</h2>
        {notifications.some(n => !n.read) && (
          <button
            onClick={markAllAsRead}
            className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <FaCheck className="w-4 h-4" />
            Mark All as Read
          </button>
        )}
      </div>
      
      {loading ? (
        <div className="text-center py-8 text-lg">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-8 text-rose-500 text-xl font-bold">No notifications found.</div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification, idx) => (
            <div
              key={notification._id || idx}
              className={`w-full p-6 mb-4 rounded-lg border-l-4 transition-all duration-200 ${
                notification.read
                  ? 'bg-gray-50 border-gray-300'
                  : 'bg-rose-50 border-rose-400 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className={`font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                      {notification.title}
                    </h4>
                    {!notification.read && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                        New
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-700'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  {!notification.read && (
                    <button
                      onClick={() => markNotificationAsRead(notification._id)}
                      disabled={markingRead[notification._id]}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                      title="Mark as read"
                    >
                      {markingRead[notification._id] ? (
                        <span className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></span>
                      ) : (
                        <FaEye className="w-4 h-4" />
                      )}
                      Mark Read
                    </button>
                  )}
                  
                  {notification.read && (
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <FaCheck className="w-4 h-4" />
                      Read
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications; 