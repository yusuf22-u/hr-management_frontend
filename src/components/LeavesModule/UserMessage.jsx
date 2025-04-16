import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaBell, FaTrashAlt, FaCheckCircle, FaCheck, FaCheckDouble } from "react-icons/fa";
import ConfirmationDialog from "./ConfirmationDialog";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const UserMessage = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/v1/leaves/inbox", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data);
        setVisibleCount(5);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Failed to load notifications");
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(
        `http://localhost:4000/v1/leaves/markUserAsRead/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        }
      );

      // Update the notification state directly
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id ? { ...notification, is_read: 1 } : notification
        )
      );

      // Reduce the new message count
      setNewMessageCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  useEffect(() => {
    const fetchUserNotification = async () => {
      try {
        const res = await axios.get("http://localhost:4000/v1/leaves/notify", {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        });
        setNewMessageCount(res.data.length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchUserNotification();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await axios.delete(`http://localhost:4000/v1/leaves/deleteMessage/${deleteId}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });

      if (res.data.Status === true) {
        alert("Message deleted successfully!");
        setNotifications(notifications.filter((notification) => notification.id !== deleteId));
        setShowDialog(false);
      }
    } catch (error) {
      console.error("Error:", error.response?.data?.error || "Something went wrong");
      alert("Failed to delete the message. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
        <h2 className="text-xl font-bold text-gray-800">Unread: {newMessageCount}</h2>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <ul className="space-y-4">
        {notifications.slice(0, visibleCount).map((notification) => (
          <li key={notification.id} className="flex flex-wrap items-start sm:items-center justify-between p-4 border-b border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
            <div className="flex-shrink-0">
              <FaBell className="text-yellow-500 text-3xl" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-gray-800 font-semibold">{notification.message}</p>
              <p className="text-sm text-gray-500 mt-1">
                Received: {new Date(notification.created_at).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              {notification.is_read === 1 ? (
                <FaCheckDouble className="text-green-500 text-xl" title="Read" />
              ) : (
                <FaCheck className="text-gray-400 text-xl" title="Unread" />
              )}
            </div>
            <div className="flex items-center space-x-4 mt-2 sm:mt-0">
              {notification.is_read === 0 && (
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="text-green-500 hover:text-green-700 transition-all"
                  title="Mark as Read"
                >
                  <FaCheckCircle className="text-xl" />
                </button>
              )}
              <button
                onClick={() => {
                  setDeleteId(notification.id);
                  setShowDialog(true);
                }}
                className="text-red-500 hover:text-red-700 transition-all"
                title="Delete Message"
              >
                <FaTrashAlt className="text-xl" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      {notifications.length > 5 && (
  <div className="text-center mt-4 flex justify-between">
    {/* Previous Button */}
    <button
      onClick={() => setVisibleCount(visibleCount - 5)}
      disabled={visibleCount <= 5} // Disable when at the first page
      className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${
        visibleCount <= 5
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-700 text-white"
      }`}
    >
      <FaArrowLeft />
      <span>Prev</span>
    </button>

    {/* Next Button */}
    <button
      onClick={() => setVisibleCount(visibleCount + 5)}
      disabled={visibleCount >= notifications.length}
      className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${
        visibleCount >= notifications.length
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-700 text-white"
      }`}
    >
      <span>Next</span>
      <FaArrowRight />
    </button>
  </div>
)}



      {showDialog && (
        <ConfirmationDialog
          message="Are you sure you want to delete this message?"
          onCancel={() => setShowDialog(false)}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default UserMessage;
