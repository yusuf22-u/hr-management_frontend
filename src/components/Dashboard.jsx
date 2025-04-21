import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaUsers, FaBriefcase, FaCog, FaUser, FaEnvelope, FaTrophy, FaSignOutAlt, FaBell, FaBars, FaMoneyCheckAlt } from 'react-icons/fa';
import { MdMessage } from 'react-icons/md';
import { BiMessageAdd } from "react-icons/bi";
import axios from 'axios';
import { io } from 'socket.io-client'; // Socket.io client
import defaultPic from '../assets/profile.png';
import Notifications from './LeavesModule/Notifications';
import './Dashboard.css'; // Custom CSS for animations

const Dashboard = () => {
  const token = sessionStorage.getItem('token');
  const username = sessionStorage.getItem('username');
  const profilePic = sessionStorage.getItem('profilePic');
  const profilePicUrl = `${profilePic}`;
  const navigate = useNavigate();
  const userRole = sessionStorage.getItem("role");

  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userUnreadCount, setUserUnreadCount] = useState(0);

  // Toggle Sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  // Initialize Socket.io connection
  useEffect(() => {
    const socket = io(`${process.env.REACT_APP_BACKEND_URL}`);

    socket.on('new_notification', () => {
      setUnreadCount(prevCount => prevCount + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Fetch user notifications
  useEffect(() => {
    const fetchUserNotification = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/leaves/notify`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setUserUnreadCount(res.data.length);
      } catch (error) {
        console.error('Error fetching user notifications', error);
      }
    };

    fetchUserNotification();
  }, [token]);

  // Fetch all notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/leaves/notifications`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        const unreadNotifications = res.data.filter(notification => !notification.is_read).length;
        setUnreadCount(unreadNotifications);
      } catch (err) {
        console.error('Error fetching notifications', err);
      }
    };

    fetchNotifications();
  }, [showNotifications, token]);

  // Logout Handler
  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/v1/logout`, {}, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      sessionStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error.response?.data || error.message);
    }
  };

  // Toggle notifications dropdown
  const handleNotificationClick = () => {
    setShowNotifications(prevState => !prevState);
  };

  const renderSidebarLinks = () => {
    if (userRole === 'admin') {
      return (
        <>
          <Link to="/dashboard/account" className="flex items-center text-lg hover:text-gray-300 transition-all duration-300">
            <FaUser className="mr-3" />
            <span>Account Setting</span>
          </Link>
          <Link to="/dashboard/users" className="flex items-center text-lg hover:text-gray-300 transition-all duration-300">
            <FaUsers className="mr-3" />
            <span>Users</span>
          </Link>
          <Link to="/dashboard/employee/layout" className="flex items-center text-lg hover:text-gray-300 transition-all duration-300">
            <FaBriefcase className="mr-3" />
            <span>Employees</span>
          </Link>
          <Link to="/settings" className="flex items-center text-lg hover:text-gray-300 transition-all duration-300">
            <FaCog className="mr-3" />
            <span>Settings</span>
          </Link>
          <Link to="/dashboard/payroll/List" className="flex items-center text-lg hover:text-gray-300 transition-all duration-300">
            <FaMoneyCheckAlt className="mr-3" />
            <span>PayRoll</span>
          </Link>
          <Link to="/dashboard/award/home" className="flex items-center text-lg hover:text-gray-300 transition-all duration-300">
            <FaUsers className="mr-3" />
            <span>Awards</span>
          </Link>
          <Link to="/dashboard/leave/notification" className="flex items-center text-lg hover:text-gray-300 transition-all duration-300">
            <FaTrophy className="mr-3" />
            <span>Notification</span>
          </Link>
        </>
      );
    }

    if (userRole === 'award' || userRole === 'user') {
      return (
        <>
          <Link to="/dashboard/account" className="flex items-center text-lg hover:text-gray-300 transition-all duration-300">
            <FaUser className="mr-3" />
            <span>Account Setting</span>
          </Link>
          <Link to="/dashboard/leave/leave_reguest" className="flex items-center text-lg hover:text-gray-300 transition-all duration-300">
            <BiMessageAdd className="mr-3" size={24} />
            <span>Request Leave</span>
          </Link>
        </>
      );
    }

    return null;
  };

  const renderProfilePic = () => {
    return profilePicUrl ? (
      <img
        src={profilePicUrl}
        alt="Profile"
        className="w-10 h-10 rounded-full border-2 border-white"
      />
    ) : (
      <img
        src={defaultPic}
        alt="Profile"
        className="w-10 h-10 rounded-full border-2 border-white"
      />
    );
  };

  return (
    <div className="flex h-[100vh]">
      <button
        className="absolute top-4 left-4 z-50 p-3 bg-blue-900 text-white rounded-full focus:outline-none"
        onClick={toggleSidebar}
      >
        <FaBars size={24} />
      </button>

      {/* Side Navbar */}
      <nav
        className={`fixed inset-y-0 left-0 z-40 bg-blue-900 text-white shadow-lg p-6 transition-transform duration-300 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:fixed lg:w-64 md:block`}
      >
        <div className="pic mt-16 items-center flex-col-reverse px-8 flex md:hidden lg:flex md:space-x-2 md:items-center">
          <span className="text-lg text-white font-semibold">{username}</span>
          {renderProfilePic()}
        </div>

        <ul className="space-y-6 mt-8">
          {renderSidebarLinks()}
        </ul>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white text-blue-900 shadow-lg p-4 flex items-center justify-between">
          <Link to={'/dashboard/'} className="text-xl ml-24 font-bold">Award Management System</Link>
          <div className="flex items-center space-x-4">
            {(userRole === 'award' || userRole === 'user') && (
              <div className="relative">
                <Link to={"/dashboard/users/message"}>
                  <MdMessage size={24} color="blue" />
                </Link>
                {userUnreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1">
                    {userUnreadCount}
                  </span>
                )}
              </div>
            )}

            {userRole === 'admin' && (
              <>
                <div className="relative flex justify-between space-x-2">
                  <FaBell
                    className="text-2xl cursor-pointer text-blue-900"
                    onClick={handleNotificationClick}
                  />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1">
                      {unreadCount}
                    </span>
                  )}
                  {showNotifications && (
                    <div className="absolute right-0 top-12 w-64 bg-white shadow-lg border p-4 rounded-lg z-10">
                      <Notifications updateUnreadCount={setUnreadCount} />
                    </div>
                  )}

                </div>
                <Link to={"/dashboard/admin/email"}>
                  <FaEnvelope size={24} color="blue" />
                </Link>
              </>
            )}

            <div className="pic hidden md:block lg:flex md:space-x-2 md:items-center">
              <span className="text-lg text-blue-900 font-semibold">{username}</span>
              {renderProfilePic()}
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md flex items-center transition transform hover:scale-105"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
