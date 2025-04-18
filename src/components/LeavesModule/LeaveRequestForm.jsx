import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';

// import "toastify-js/src/toastify.css"


const LeaveRequestForm = () => {
  const navigate = useNavigate();
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [staffID, setStaffID] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize Socket.io client
    const socketInstance = io(`${process.env.REACT_APP_BACKEND_URL}`); // Replace with your server URL
    setSocket(socketInstance);

    // Listen for leave request updates
    socketInstance.on('leave_request_update', (data) => {
      console.log('Leave request update:', data);
      // Handle real-time leave request updates here
    });

    // Cleanup on component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(startDate) > new Date(endDate)) {
      setMessage('End date cannot be before start date');
      return;
    }

    const leaveData = {
      employee_id: staffID,
      leave_type: leaveType,
      start_date: startDate,
      end_date: endDate,
      reason: reason,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/v1/leaves/create`, leaveData, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        withCredentials: true,
      });
     
      toast.success('Leave request submitted successfully!');
      // setMessage('Leave request submitted successfully');
      
      //  navigate('/dashboard');
    } catch (error) {
      if (error.response) {
        toast.error(` ${error.response.data.error}`);
        setMessage(`Server Error: ${error.response.data.error}`);
      } else if (error.request) {
        setMessage('Network Error: Please try again later');
      } else {
        setMessage(`Error: ${error.message}`);

      }
    }
  };


  return (
    <div className="">
       <Link to={'/dashboard/'} className='bg-blue-600 text-white p-2 rounded-md'>Back</Link>
    <div className="bg-gray-100 flex items-center justify-center p-5">
     
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg mt-[-50px] p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Request Leave</h2>
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Staff ID |& leave type */}
          <div className="flex justify-between space-x-2">
            <div className='w-1/2'>
              <label className="block text-gray-700 font-semibold mb-2">Staff ID</label>
              <input
                type="text"
                value={staffID}
                onChange={(e) => setStaffID(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className='w-1/2'>
              <label className="block text-gray-700 font-semibold mb-2">Request</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="" disabled>Select leave type</option>
                <option value="Vacation">Vacation</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Maternity Leave">Maternity Leave</option>
                <option value="study leave">Study Leave</option>
                <option value="others">Others</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between space-x-2">
            {/* Start Date */}
            <div className='w-1/2'>
              <label className="block text-gray-700 font-semibold mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* End Date */}
            <div className='w-1/2'>
              <label className="block text-gray-700 font-semibold mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>


          {/* Reason for Leave */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Reason for Leave</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the reason for your leave"
              required
            ></textarea>
          </div>



          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-200"
          >
            Submit Request
          </button>

          {/* Message */}
          {message && (
            <p className={`mt-3 text-center font-semibold ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </p>
          )}
        </form>
      </div>
      <ToastContainer 
      position="top-center"
      className={'text-center'}/>
    </div>
    </div>
  );
};

export default LeaveRequestForm;
