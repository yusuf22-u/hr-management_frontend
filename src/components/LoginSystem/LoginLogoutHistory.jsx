import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginLogoutHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 const navigate=useNavigate()

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/user/history`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
        setHistory(response.data.data);
        // console.log('date', response.data.data)
        setLoading(false);
      } catch (err) {
        setError(err.response?.data || 'Failed to fetch login/logout history');
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <button
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Login and Logout History</h2>
      <div className="overflow-x-auto shadow-lg bg-white">
        <table className="table-auto w-full border border-gray-300 text-left">
          <thead>
            <tr className="bg-blue-600 text-white ">
              <th className="px-4 py-2 border">Profile</th>
              <th className="px-4 py-2 border">Username</th>
              <th className="px-4 py-2 border">Login Time</th>
              <th className="px-4 py-2 border">Logout Time</th>
            </tr>
          </thead>
          <tbody>
            {history.map((record, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-4 py-2 border">
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}/uploads/userpic/${record.profile}`}
                    alt={`${record.username} profile`}
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td className="px-4 py-2 border">{record.username}</td>
                <td className="px-4 py-2 border">{new Date(record.lastIn).toLocaleString()}</td>
                <td className="px-4 py-2 border">
                  {record.lastOut ? new Date(record.lastOut).toLocaleString() : 'Still logged in'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoginLogoutHistory;
