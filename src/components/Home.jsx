import React, { useEffect, useState } from "react";
import EmployeeDistributionChart from "./employees/EmployeeDistributionChart";
import StudentLevelDistribution from "./student/studentLevelDistribution";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import default styles
import { Link } from "react-router-dom";
import { FaMoneyCheckAlt, FaPen,FaBoxOpen,FaUserGraduate } from "react-icons/fa";

const Home = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval on component unmount
  }, []);

  const formatDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-6 space-y-10 bg-gray-100 min-h-screen">
    <h1 className="text-5xl font-extrabold text-gray-800 text-center mb-6">
      Dashboard
    </h1>
  
    {/* Top Section: Date and Quick Links */}
    <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
      {/* Quick Links */}
      <div className="flex justify-center items-center space-x-6">
        <Link to="/dashboard/payroll/List" className="group">
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 p-4 rounded-full shadow-md group-hover:scale-110 transition transform duration-200">
              <FaMoneyCheckAlt className="text-green-600" size={36} />
            </div>
            <span className="text-gray-600 mt-2 font-medium">Payroll</span>
          </div>
        </Link>
        <Link to="/dashboard/items/list" className="group">
          <div className="flex flex-col items-center text-center">
            <div className="bg-gray-100 p-4 rounded-full shadow-md group-hover:scale-110 transition transform duration-200">
              <FaBoxOpen className="text-gray-600" size={36} />
            </div>
            <span className="text-gray-600 mt-2 font-medium">Inventory</span>
          </div>
        </Link>
        <Link to="/dashboard/award/home" className="group">
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 p-4 rounded-full shadow-md group-hover:scale-110 transition transform duration-200">
              <FaUserGraduate className="text-green-600" size={36} />
            </div>
            <span className="text-gray-600 mt-2 font-medium">Participants</span>
          </div>
        </Link>
      </div>
  
      {/* Today's Date */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800">Today's Date</h2>
        <p className="text-gray-600 text-sm mt-1">{formatDate(currentDate)}</p>
        <button
          onClick={() => setIsCalendarModalOpen(true)}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          View Calendar
        </button>
      </div>
  
      {/* Create Memo */}
      <Link to="/dashboard/memo" className="group">
        <div className="flex flex-col items-center text-center">
          <div className="bg-blue-100 p-4 rounded-full shadow-md group-hover:scale-110 transition transform duration-200">
            <FaPen className="text-blue-600" size={36} />
          </div>
          <span className="text-gray-600 mt-2 font-medium">Create Memo</span>
        </div>
      </Link>
    </div>
  
    {/* Modal for Calendar */}
    {isCalendarModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full relative">
          <button
            onClick={() => setIsCalendarModalOpen(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            ✖
          </button>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">Calendar</h2>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="w-full"
            tileClassName={({ date }) =>
              date.toDateString() === new Date().toDateString()
                ? "bg-blue-500 text-white rounded-full"
                : ""
            }
          />
        </div>
      </div>
    )}
  
    {/* Card Links */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Link
        to="/dashboard/leave/leave_List"
        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl shadow-md hover:scale-105 transform transition"
      >
        <h2 className="text-lg font-bold">Leave Requests</h2>
        <p className="mt-1">View and manage leave requests</p>
      </Link>
      <Link
        to="/dashboard/employee/List"
        className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-xl shadow-md hover:scale-105 transform transition"
      >
        <h2 className="text-lg font-bold">Employees</h2>
        <p className="mt-1">Manage employee details</p>
      </Link>
      <Link
        to="/dashboard/users"
        className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-xl shadow-md hover:scale-105 transform transition"
      >
        <h2 className="text-lg font-bold">Users</h2>
        <p className="mt-1">Handle user accounts and access</p>
      </Link>
      <Link
        to="/dashboard/admin/email"
        className="bg-gradient-to-r from-purple-500 to-yellow-600 text-white p-6 rounded-xl shadow-md hover:scale-105 transform transition"
      >
        <h2 className="text-lg font-bold">email</h2>
        <p className="mt-1">Handle user accounts and access</p>
      </Link>
    </div>
  
    {/* Charts Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl p-6">
        <EmployeeDistributionChart />
      </div>
      <div className="bg-white rounded-xl p-6">
        <StudentLevelDistribution />
      </div>
    </div>
  </div>
  
  );
};

export default Home;
