import { useState, useEffect } from 'react';
import React from 'react';
import { FaUsers, FaListAlt, FaMedal, FaFemale, FaMale, FaFileAlt,FaHome} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2'; // Import Bar chart
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
const StudentDashboard = () => {
    const [students, setStudents] = useState([]);
    const [totalStudents, setTotalStudents] = useState(0);
    const [totalFemale, setTotalFemale] = useState(0);
    const [totalMale, setTotalMale] = useState(0);
    const [goldStudent, setGoldStudent] = useState(0);
    const [silverStudent, setSilverStudent] = useState(0);
    const [bronzeStudent, setBronzeStudent] = useState(0);
    const [studentYearlyData, setStudentYearlyData] = useState([]);
    const userRole = sessionStorage.getItem('role');

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/student/allStudents`, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
            .then(response => {
                const { students, totalCount, femaleCount, bronzeCount, maleCount, studentsPerYear, goldCount, silverCount } = response.data;
                setTotalStudents(totalCount);
                setTotalFemale(femaleCount);
                setTotalMale(maleCount);
                setStudents(students)
                setGoldStudent(goldCount);
                setSilverStudent(silverCount);
                setBronzeStudent(bronzeCount);
                setStudentYearlyData(studentsPerYear)
                setBronzeStudent(bronzeCount)
                console.log('year', studentsPerYear)
            })
            .catch(error => console.error('Error fetching student data!', error));

    }, []);

    // Prepare data for the chart
    // Prepare data for the line chart
    const chartData = {
        labels: studentYearlyData.map(data => data.year),
        datasets: [
            {
                label: 'Total Participants per Year',
                data: studentYearlyData.map(data => data.totalStudents),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: '#F44336',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(75, 100, 192, 1)',
                tension: 0.4 // Makes the line smooth
            }
        ]
    };

    return (
        <div className="bg-gray-50 min-h-screen py-3">
            <h1 className="text-2xl font-extrabold text-center mb-10 text-indigo-900">Participants Management Dashboard</h1>
            <div className="container mx-auto px-6">
                 {/* Line Chart for Total Students Per Year */}
                 <div className="mt-10 bg-white p-6 rounded-lg shadow-lg pb-4">
                    <h2 className="text-xl font-bold text-center mb-4 text-indigo-800">Total  Participants Per Year</h2>
                    <Line
                        key={JSON.stringify(chartData)} // Ensure a new chart instance on data change
                        data={chartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { display: false },
                                title: { display: true, text: 'Total Participants per Year' }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: { stepSize: 20 }
                                }
                            }
                        }}
                    />
                </div>
                <div className="grid mt-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Existing cards here */}
                    {/* Total Students */}
                    <Link to='/dashboard/studentList' className="group flex items-center justify-between bg-green-200 p-6 rounded-lg hover:bg-green-300 transition duration-300 ease-in-out">
                        <div className="flex items-center space-x-4">
                            <FaUsers className="text-6xl text-blue-600 group-hover:text-blue-700 transition duration-300" />
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800 group-hover:text-gray-900">Total</h2>
                                <p className="text-lg text-gray-600">{totalStudents} Participants</p>
                            </div>
                        </div>
                        <FaListAlt className="text-3xl text-green-600 group-hover:text-blue-700 transition duration-300" />
                    </Link>
                    <Link to='/dashboard/participant' className="group flex items-center justify-between bg-green-200 p-6 rounded-lg hover:bg-green-300 transition duration-300 ease-in-out">
                        <div className="flex items-center space-x-4">
                            <FaHome className="text-6xl text-blue-600 group-hover:text-blue-700 transition duration-300" />
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800 group-hover:text-gray-900">Center</h2>
                                <p className="text-lg text-gray-600">Registerations</p>
                            </div>
                        </div>
                        {/* <FaListAlt className="text-3xl text-green-600 group-hover:text-blue-700 transition duration-300" /> */}
                    </Link>


                    {/* Female Students */}
                    <div className="flex items-center justify-between bg-pink-100 p-6 rounded-lg hover:bg-pink-200 transition duration-300 ease-in-out">
                        <div className="flex items-center space-x-4">
                            <FaFemale className="text-6xl text-pink-600" />
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800">Female Participants</h2>
                                <p className="text-lg text-gray-600">{totalFemale} Female</p>
                            </div>
                        </div>
                    </div>

                    {/* Male Students */}
                    <div className="flex items-center justify-between bg-blue-100 p-6 rounded-lg hover:bg-blue-200 transition duration-300 ease-in-out">
                        <div className="flex items-center space-x-4">
                            <FaMale className="text-6xl text-blue-600" />
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800">Male Participants</h2>
                                <p className="text-lg text-gray-600">{totalMale} Male</p>
                            </div>
                        </div>
                    </div>
                    {/* Bronze Medals */}
                    <div className="flex items-center justify-between bg-[#df9b79] p-6 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out">
                        <div className="flex items-center space-x-4">
                            <FaMedal className="text-6xl text-[#d4500e]" />
                            <div>
                                <h2 className="text-3xl font-bold text-white">Bronze</h2>
                                <p className="text-lg text-gray-600">{bronzeStudent} Participants</p>
                            </div>
                        </div>
                    </div>


                    {/* Silver Medals */}
                    <div className="flex items-center justify-between bg-gray-200 p-6 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out">
                        <div className="flex items-center space-x-4">
                            <FaMedal className="text-6xl text-gray-400" />
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800">Silver</h2>
                                <p className="text-lg text-gray-600">{silverStudent} Participants</p>
                            </div>
                        </div>
                    </div>
                    {/* Gold Medals */}
                    <div className="flex items-center justify-between bg-yellow-100 p-6 rounded-lg hover:bg-yellow-200 transition duration-300 ease-in-out">
                        <div className="flex items-center space-x-4">
                            <FaMedal className="text-6xl text-yellow-500" />
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800">Gold</h2>
                                <p className="text-lg text-gray-600">{goldStudent} Participants</p>
                            </div>
                        </div>
                    </div>
                </div>

               
            </div>
        </div>
    );
};

export default StudentDashboard;
