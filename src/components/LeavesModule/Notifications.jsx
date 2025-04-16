import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client'; // Import Socket.io client
import { AiFillEdit, AiFillDelete, AiOutlineEye } from 'react-icons/ai';
import { AiOutlineCheck } from 'react-icons/ai'; // Ant Design
import { MdCheckCircle } from 'react-icons/md'; // Material Design
import { Link } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  // Initialize Socket.io client
 // Fetch and sort notifications on component mount
 useEffect(() => {
  const socket = io('http://localhost:4000'); // Replace with your server URL

  // Function to fetch notifications
  const fetchNotifications = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/v1/leaves/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      // Sort notifications by created_at in descending order (newest first)
      const sortedNotifications = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setNotifications(sortedNotifications); // Update state with sorted notifications
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications');
    }
  };

  fetchNotifications();

  // Listen for new notifications in real-time
  socket.on('new_notification', (data) => {
    setNotifications(prevNotifications => [data, ...prevNotifications].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
  });

  return () => {
    socket.disconnect();
  };
}, []);

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.put(`http://localhost:4000/v1/leaves/notification/${id}`, {}, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        }
      });
  
      // Update the state to mark the notification as read in the frontend
      setNotifications(notifications.map(notification =>
        notification.id === id ? { ...notification, is_read: true } : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Handle delete notification
  const handleDelete = async (id) => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.delete(`http://localhost:4000/v1/leaves/delete/${id}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        }
      });
  
      // Remove the notification from the state
      setNotifications(notifications.filter(notification => notification.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div className="notifications-container">
      <div className="flex justify-between space-x-2 mt-2 p-2 items-center">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      <Link className='bg-green-400 rounded-md text-white px-1 py-2' to='/dashboard/leave/leave_List'>view request</Link>
      </div>
      {error && <p className="text-red-500">{error}</p>}

      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <table className="w-full bg-white rounded-md ">
          <thead className="bg-gray-500 text-white">
            <tr>
              <th className='px-4 py-2 text-left'>Message</th>
              <th className='px-4 py-2 text-left'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification) => (
              <tr
                key={notification.id}
                className={`p-6 border rounded-lg ${notification.is_read ? 'bg-white' : 'bg-blue-100'}`}
              >
                <td className="text-gray-600 text-sm pl-6">
                  {notification.message} {new Date(notification.created_at).toLocaleString()}
                </td>
                <td>
                  {notification.is_read ? (
                    <>
                      {/* Show both Eye and Delete icons if the notification is read */}
                      <button
                       
                        className="mt-2 inline-block px-3 py-1 text-sm font-semibold text-white rounded hover:bg-green-600"
                      >
                        <MdCheckCircle  size={24} color='green' />
                      </button>
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="mt-2 ml-2 inline-block px-3 py-1 text-sm font-semibold text-red-500  rounded hover:bg-red-600"
                      >
                        <AiFillDelete size={24} />
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Show only the Delete icon if the notification is unread */}
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="mt-2 inline-block px-3 py-1 text-sm font-semibold text-white rounded hover:bg-green-600"
                      >
                        <AiOutlineEye  size={24} color='green' />
                      </button>
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="mt-2 inline-block px-4 py-1 text-sm font-semibold  text-red-500 rounded hover:bg-red-600"
                      >
                        <AiFillDelete size={24} />
                      </button>
                      
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Notifications;
