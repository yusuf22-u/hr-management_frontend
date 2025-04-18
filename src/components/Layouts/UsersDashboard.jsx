import { Link } from "react-router-dom";
import { FaUser, FaPen, FaBoxOpen, FaUserGraduate } from "react-icons/fa";
import { useState, useEffect } from "react";
import { BiMessageAdd, BiTime } from "react-icons/bi";

const UsersDashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

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
    <div className="p-6">
      {/* Top Section: Date and Quick Links */}
      <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Quick Links */}
        <div className="flex justify-center items-center space-x-6">
          <Link to="/dashboard/account" className="group">
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-4 rounded-full shadow-md group-hover:scale-110 transition transform duration-200">
                <FaUser className="text-green-600" size={36} />
              </div>
              <span className="text-gray-600 mt-2 font-medium">Change Account</span>
            </div>
          </Link>
          <Link to="/dashboard/leave/leave_reguest" className="group">
            <div className="flex flex-col items-center text-center">
              <div className="bg-gray-100 p-4 rounded-full shadow-md group-hover:scale-110 transition transform duration-200">
                <BiMessageAdd className="text-gray-600" size={36} />
              </div>
              <span className="text-gray-600 mt-2 font-medium">Apply Leave</span>
            </div>
          </Link>
          {/* <Link to="/dashboard/award/home" className="group">
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-4 rounded-full shadow-md group-hover:scale-110 transition transform duration-200">
                <FaUserGraduate className="text-green-600" size={36} />
              </div>
              <span className="text-gray-600 mt-2 font-medium">Participants</span>
            </div>
          </Link> */}
        </div>

        {/* Today's Date */}
        <div className="text-center flex items-center space-x-2">
          <BiTime className="text-gray-600" size={24} />
          <div>
            <h2 className="text-xl font-bold text-gray-800">Today's Date</h2>
            <p className="text-gray-600 text-sm mt-1">{formatDate(currentDate)}</p>
          </div>
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

      {/* Card Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {/* <Link
          to="/dashboard/leave/leave_List"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl shadow-md hover:scale-105 transform transition flex flex-col items-center justify-center space-y-4"
        >
          <FaBoxOpen className="text-white" size={36} />
          <h2 className="text-lg font-bold">Leave Requests</h2>
          <p className="mt-1">View and manage leave requests</p>
        </Link> */}
        <Link
          to="/dashboard/users/message"
          className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-xl shadow-md hover:scale-105 transform transition flex flex-col items-center justify-center space-y-4"
        >
          <FaUser className="text-white" size={36} />
          <h2 className="text-lg font-bold">Inbox</h2>
          <p className="mt-1">Manage employee details</p>
        </Link>
        <Link
          to="/dashboard/personal/info"
          className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-xl shadow-md hover:scale-105 transform transition flex flex-col items-center justify-center space-y-4"
        >
          <FaUserGraduate className="text-white" size={36} />
          <h2 className="text-lg font-bold">personal information</h2>
          <p className="mt-1">view your files and personal details</p>
        </Link>
      </div>
    </div>
  );
};

export default UsersDashboard;
