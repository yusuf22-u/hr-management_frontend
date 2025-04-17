import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentSearchAndPrint = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [levelOfEntry, setLevelOfEntry] = useState('');
    const [year, setYear] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/v1/student/search`, {
            levelOfEntry,
            year,
          });
          setStudents(response.data);
          setError(null); // Clear any previous errors
        } catch (err) {
          if (err.response) {
            setError(err.response.data.message);
          } else {
            setError('An error occurred while fetching the data.');
          }
        }
      };
    

    // Handle printing the list
    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>Student List</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                <h2>Filtered Students</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Mode of Entry</th>
                            <th>Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${students.map(student => `
                            <tr>
                                <td>${student.student_matNo}</td>
                                <td>${student.full_name}</td>
                                <td>${student.level_of_entry}</td>
                                <td>${new Date(student.date_of_admission).getFullYear()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Search and Print Students</h2>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-gray-600 mb-2">Level</label>
                    <input
                        type="text"
                        value={levelOfEntry}
                        onChange={(e) => setLevelOfEntry(e.target.value)}
                        className="w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter eg. gold or silver or bronze"
                    />
                </div>
                <div>
                    <label className="block text-gray-600 mb-2">Year</label>
                    <input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter year"
                    />
                </div>
            </div>
        <div className="space-x-2">
            <button
                onClick={ handleSubmit}
                className="bg-blue-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition-all mb-4"
            >
                Search Students
            </button>

            <button
                onClick={handlePrint}
                className="bg-green-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition-all mb-4"
                disabled={students.length === 0} // Disable if no students found
            >
                Print List
            </button>
            </div>

            {/* Display Error Message */}
            {error && <div className="text-red-600 mt-4">{error}</div>}

            {/* Loading State */}
            {loading && <div className="mt-4 text-gray-600">Loading...</div>}

            {/* Student Table */}
            <table className="min-w-full bg-white shadow-lg mt-4 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-3 px-4 border-b border-gray-200 text-left">ID</th>
                        <th className="py-3 px-4 border-b border-gray-200 text-left">Full Name</th>
                        <th className="py-3 px-4 border-b border-gray-200 text-left">Mode of Entry</th>
                        <th className="py-3 px-4 border-b border-gray-200 text-left">Year</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 ? (
                        students.map((student) => (
                            <tr key={student.student_matNo}>
                                <td className="py-3 px-4 border-b border-gray-200">{student.student_matNo}</td>
                                <td className="py-3 px-4 border-b border-gray-200">{student.full_name}</td>
                                <td className="py-3 px-4 border-b border-gray-200">{student.level_of_entry}</td>
                                <td className="py-3 px-4 border-b border-gray-200">{new Date(student.date_of_admission).getFullYear()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="py-4 text-center text-gray-600">No students found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default StudentSearchAndPrint;
