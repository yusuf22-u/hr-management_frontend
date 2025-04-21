import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaUsers,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaFileExcel,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const NominalRoll = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
const navigate=useNavigate()
  useEffect(() => {
    const fetchNominalRoll = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/payrolls/nominal-roll`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Check nominal roll:', err);
        setLoading(false);
      }
    };
    fetchNominalRoll();
  }, []);

  const totalMonthly = data.reduce((acc, emp) => acc + parseFloat(emp.Monthly), 0);
  const totalAnnual = data.reduce((acc, emp) => acc + parseFloat(emp.GrossAnnualSalary), 0);

  return (
    <div className="p-4 sm:p-6">
      <button onClick={()=>navigate(-1)} className='bg-blue-500 text-white p-2 capitalize rounded-md'>back</button>
      <h2 className="text-2xl sm:text-3xl font-bold text-center uppercase text-blue-700 mb-6">
        Dream Tech Nominal Payroll Worksheet
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : (
        <>
          {/* Summary Cards */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Total Employees */}
            <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 border border-blue-100">
              <FaUsers className="text-4xl text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Total Employees</p>
                <h4 className="text-xl font-bold text-gray-800">{data.length}</h4>
              </div>
            </div>

            {/* Total Monthly Gross */}
            <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 border border-green-100">
              <FaMoneyBillWave className="text-4xl text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Total Monthly Gross</p>
                <h4 className="text-xl font-bold text-gray-800">
                  D{totalMonthly.toLocaleString()}
                </h4>
              </div>
            </div>

            {/* Total Annual Gross */}
            <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 border border-purple-100">
              <FaCalendarAlt className="text-4xl text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">Total Annual Gross</p>
                <h4 className="text-xl font-bold text-gray-800">
                  D{totalAnnual.toLocaleString()}
                </h4>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <div className="mb-6 flex justify-center sm:justify-end">
            <a
              href={`${process.env.REACT_APP_BACKEND_URL}/v1/payrolls/export-nominal-roll`}
              download
              className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 transition"
            >
              <FaFileExcel className="text-lg" />
              Export Nominal Roll to Excel
            </a>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">No</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Designation</th>
                  <th className="py-3 px-4 text-left">Grade Point</th>
                  <th className="py-3 px-4 text-center">Months</th>
                  <th className="py-3 px-4 text-right">Monthly</th>
                  <th className="py-3 px-4 text-right">Gross Annual Salary</th>
                  <th className="py-3 px-4 text-left">Department</th>
                </tr>
              </thead>
              <tbody>
                {data.map((emp, index) => (
                  <tr
                    key={emp.No}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="py-2 px-4">{emp.No}</td>
                    <td className="py-2 px-4 capitalize">{emp.Name}</td>
                    <td className="py-2 px-4 capitalize">{emp.Designation}</td>
                    <td className="py-2 px-4 capitalize">{emp.GradePoint}</td>
                    <td className="py-2 px-4 text-center">12</td>
                    <td className="py-2 px-4 text-right">
                      D{parseFloat(emp.Monthly).toLocaleString()}
                    </td>
                    <td className="py-2 px-4 text-right">
                      D{parseFloat(emp.GrossAnnualSalary).toLocaleString()}
                    </td>
                    <td className="py-2 px-4">{emp.Department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default NominalRoll;
