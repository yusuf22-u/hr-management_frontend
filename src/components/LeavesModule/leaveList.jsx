import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';  // For approve/reject icons

const LeaveList = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const res = await axios.get('http://localhost:4000/v1/leaves/leave-requests',{
          headers:{
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          }
        });
        const sortedLeaves = res.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at) // Sort by date descending
        );
        setLeaves(sortedLeaves);
        console.log('leave',sortedLeaves)
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchLeaveRequests();
  }, []);
  
  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`http://localhost:4000/v1/leaves/update/${id}`, 
        { status }, // Send status in the body
        {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          }
        }
      );
      
      // Update the leaves state after successful status update
      setLeaves((prevLeaves) =>
        prevLeaves.map((leave) =>
          leave.id === id ? { ...leave, status } : leave
        )
      );
    } catch (err) {
      console.error(err);
    }
  };
  console.log('leave',leaves)

  return (
    <div className="leave-list p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Leave Requests</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-800 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Employee Name</th> {/* Changed this to Employee Name */}
              <th className="py-3 px-6 text-left">Leave Type</th>
              <th className="py-3 px-6 text-left">Reason</th>
              <th className="py-3 px-6 text-left">Start Date</th>
              <th className="py-3 px-6 text-left">End Date</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {leaves.map((leave) => (
              <tr key={leave.id} className="border-b">
                <td className="py-3 px-6">{leave.full_name}</td> {/* Display full_name here */}
                <td className="py-3 px-6">{leave.leave_type}</td>
                <td className="py-3 px-6">{leave.reason}</td>
                <td className="py-3 px-6">{new Date(leave.start_date).toISOString().split('T')[0]}</td>
                <td className="py-3 px-6">{new Date(leave.end_date).toISOString().split('T')[0]}</td>
                <td className="py-3 px-6">
                  <span
                    className={`py-1 px-3 rounded-full text-sm ${
                      leave.status.toLowerCase()  === 'approved'
                        ? 'bg-green-200 text-green-900'
                        : leave.status.toLowerCase()  === 'rejected'
                        ? 'bg-red-200 text-red-900'
                        : 'bg-yellow-200 text-yellow-800'
                    }`}
                  >
                    {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                  </span>
                </td>
                
                <td className="py-3 px-6 text-center">
                  {leave.status.toLowerCase() === 'pending'  && (
                    <div className="flex justify-center space-x-3">
                      <button
                        className="text-green-500 hover:text-green-700"
                        onClick={() => handleStatusUpdate(leave.id, 'approved')}
                        title="Approve"
                      >
                        <AiOutlineCheck size={24} />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleStatusUpdate(leave.id, 'rejected')}
                        title="Reject"
                      >
                        <AiOutlineClose size={24} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveList;
