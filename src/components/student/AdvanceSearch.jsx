import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const AdvanceSearch = () => {
    const [participants, setParticipants] = useState([]); // Stores original data
    const [filteredParticipants, setFilteredParticipants] = useState(''); // Stores filtered data
    const [levelOfEntry, setLevelOfEntry] = useState('');
    const [year, setYear] = useState('');
    const [region, setRegion] = useState('');
    const [school, setSchool] = useState('');
    const navigate=useNavigate()

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/v1/center/`, {
                    headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
                });
                setParticipants(res.data.participant);
                setFilteredParticipants(res.data.participant); // Initially show all data
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchParticipants();
    }, []);

    // Function to filter participants based on input
    const handleSearch = () => {
        const filtered = participants.filter(participant =>
            (levelOfEntry === '' || participant.level_of_entry.toLowerCase() === levelOfEntry.toLowerCase()) &&
            (year === '' || new Date(participant.created_at).getFullYear().toString() === year) &&
            (region === '' || participant.region.toLowerCase() === region.toLowerCase()) &&
            (school === '' || participant.school.toLowerCase().includes(school.toLowerCase()))
        );
        setFilteredParticipants(filtered);
    };
    const handlePrint = () => {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
            <head>
                <title>Student List</title>
                 <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
                    
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                        color: #333;
                    }
                    h2 {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 10px;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #007bff;
                        color: white;
                        font-weight: bold;
                    }
                    tr:nth-child(even) {
                        background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                <h2>Paticipant List</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Mode of Entry</th>
                            <th>Level</th>
                            <th>Region</th>
                            <th>School</th>
                            <th>Center</th>
                            <th>Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredParticipants.map(student => `
                            <tr>
                                <td>${student.studentId}</td>
                                <td>${student.full_name}</td>
                                <td>${student.mode_of_entry}</td>
                                <td>${student.level_of_entry}</td>
                                <td>${student.region}</td>
                                <td>${student.school}</td>
                                <td>${student.area}</td>
                                <td>${new Date(student.created_at).getFullYear()}</td>
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
        <div className="p-6 bg-white rounded-lg shadow-md">
            <button onClick={()=>navigate(-1)} className="bg-blue-800 rounded-md text-white p-2">back</button>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Advanced Search</h2>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Level Selection */}
                <div>
                    <label className="block text-gray-600 font-semibold mb-2">Level</label>
                    <select
                        className="border border-gray-300 w-full p-2 rounded bg-white focus:ring-2 focus:ring-blue-500"
                        value={levelOfEntry}
                        onChange={(e) => setLevelOfEntry(e.target.value)}
                    >
                        <option value="">All Levels</option>
                        <option value="silver">Silver</option>
                        <option value="gold">Gold</option>
                        <option value="bronze">Bronze</option>
                    </select>
                </div>

                {/* Year Selection */}
                <div>
                    <label className="block text-gray-600 font-semibold mb-2">Year</label>
                    <input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter year"
                    />
                </div>

                {/* Region Selection */}
                <div>
                    <label className="block text-gray-600 font-semibold mb-2">Region</label>
                    <select
                        className="border border-gray-300 w-full p-2 rounded bg-white focus:ring-2 focus:ring-blue-500"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                    >
                        <option value="">All Regions</option>
                        <option value="Region One">Region One</option>
                        <option value="Region Two">Region Two</option>
                        <option value="Region Three">Region Three</option>
                        <option value="Region Four">Region Four</option>
                    </select>
                </div>

                {/* School Input */}
                <div>
                    <label className="block text-gray-600 font-semibold mb-2">School</label>
                    <input
                        type="text"
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter school"
                    />
                </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4">
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition-all"
                >
                    Search Students
                </button>

                <button
                onClick={handlePrint}
                    className="bg-green-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-600 transition-all"
                    disabled={filteredParticipants.length === 0} // Disable if no students found
                >
                    Print List
                </button>
            </div>

            {/* Student Table */}
            <div className="overflow-x-auto mt-6">
                <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-blue-100 text-gray-700">
                        <tr>
                            <th className="py-3 px-4 text-left">ID</th>
                            <th className="py-3 px-4 text-left">Full Name</th>
                            <th className="py-3 px-4 text-left">Mode of Entry</th>
                            <th className="py-3 px-4 text-left">Level</th>
                            <th className="py-3 px-4 text-left">Region</th>
                            <th className="py-3 px-4 text-left">School</th>
                            <th className="py-3 px-4 text-left">Center</th>
                            <th className="py-3 px-4 text-left">Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredParticipants.length > 0 ? (
                            filteredParticipants.map((student) => (
                                <tr key={student.student_matNo} className="border-t">
                                    <td className="py-3 px-4">{student.studentId}</td>
                                    <td className="py-3 px-4">{student.full_name}</td>
                                    <td className="py-3 px-4">{student.mode_of_entry}</td>
                                    <td className="py-3 px-4">{student.level_of_entry}</td>
                                    <td className="py-3 px-4">{student.region}</td>
                                    <td className="py-3 px-4">{student.school}</td>
                                    <td className="py-3 px-4">{student.area}</td>
                                    <td className="py-3 px-4">{new Date(student.created_at).getFullYear()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="py-4 text-center text-gray-600">No students found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdvanceSearch;
