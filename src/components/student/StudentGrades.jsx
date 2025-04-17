import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEye, FaEdit, FaTrash, FaArrowLeft, FaPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import ReactPaginate from 'react-paginate';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StudentGrades = () => {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const studentsPerPage = 5;

    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/score/grade-list`);
                setStudents(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch student records');
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/v1/score/delete/${id}`);
                setStudents(students.filter(student => student.id !== id));
            } catch (err) {
                setError('Failed to delete the record');
            }
        }
    };

    const calculateTotalScore = (student) => {
        const {
            adventures_journey = 0,
            voluntary_service = 0,
            physical_recreation = 0,
            skills_and_interest = 0,
            residential_project = 0,
        } = student;
        return (
            adventures_journey +
            voluntary_service +
            physical_recreation +
            skills_and_interest +
            residential_project
        );
    };

    const getStatus = (totalScore) => (totalScore >= 50 ? "Pass" : "Fail");

    const passCount = students.filter(student => calculateTotalScore(student) >= 50).length;
    const failCount = students.length - passCount;

    const data = {
        labels: ['Pass', 'Fail'],
        datasets: [
            {
                label: 'Student Performance',
                data: [passCount, failCount],
                backgroundColor: ['#4CAF50', '#F44336'],
            },
        ],
    };

    const filteredStudents = students.filter(student =>
        student.student_name.toLowerCase().includes(search.toLowerCase()) ||
        student.student_matNo.toString().includes(search)
    );

    const pageCount = Math.ceil(filteredStudents.length / studentsPerPage);
    const displayedStudents = filteredStudents.slice(
        currentPage * studentsPerPage,
        (currentPage + 1) * studentsPerPage
    );

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="max-w-5xl pb-6 mx-auto mt-6 px-3 shadow-md rounded-lg overflow-hidden">
            <h2 className='text-gray-600 text-center p-2 capitalize text-2xl'>Participants grading record</h2>
            <div className="my-4 bg-gray-50">
                <Bar data={data} options={{ maintainAspectRatio: true }} />
            </div>
            <div className="flex justify-between items-center mb-4">
                <Link to={'/dashboard/studentList'} className="text-blue-600 flex items-center hover:text-blue-800">
                    <FaArrowLeft className="mr-2" /> Back
                </Link>
                <Link to={'/dashboard/award/create'} className="text-green-600 flex items-center hover:text-green-800">
                    <FaPlus className="mr-2" /> Add Participant score
                </Link>
                <input
                    type="text"
                    placeholder="Search by name or ID"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-2 border-b w-full max-w-sm"
                />
            </div>

            <table className="min-w-full bg-white">
                <thead className="bg-blue-500 text-white">
                    <tr>
                        <th className="w-1/6 px-4 py-2">Profile</th>
                        <th className="w-1/6 px-4 py-2">Student ID</th>
                        <th className="w-1/4 px-4 py-2">Name</th>
                        <th className="w-1/6 px-4 py-2">Level</th>
                        <th className="w-1/4 px-4 py-2">Total Score</th>
                        <th className="w-1/4 px-4 py-2">Status</th>
                        <th className="w-1/6 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedStudents.length > 0 ? (
                        displayedStudents.map(student => {
                            const totalScore = calculateTotalScore(student);
                            return (
                                <tr key={student.id} className="border-t">
                                    <td className="px-4 py-2">
                                        <img
                                            src={`${process.env.REACT_APP_BACKEND_URL}/uploads/student/${student.profile_pic}`}
                                            alt={`${student.student_name}'s profile`}
                                            className="w-10 h-10 rounded-full"
                                        />
                                    </td>
                                    <td className="px-4 py-2">{student.student_matNo}</td>
                                    <td className="px-4 py-2">{student.student_name}</td>
                                    <td className="px-4 py-2">{student.level_of_entry}</td>
                                    <td className="px-4 py-2">{totalScore + "%"}</td>
                                    <td className="px-4 py-2">
                                        <span className={`px-2 py-1 rounded-full text-white ${totalScore >= 50 ? 'bg-green-500' : 'bg-red-500'}`}>
                                            {getStatus(totalScore)}
                                        </span>
                                    </td>
                                    <td className="px-4 flex justify-between items-center py-2 text-center space-x-2">
                                        <Link to={`/dashboard/student_Score/${student.id}`} className="text-blue-600 hover:text-blue-800">
                                            <FaEye />
                                        </Link>
                                        <Link to={`/dashboard/students/edit/${student.id}`} className="text-green-600 hover:text-green-800">
                                            <FaEdit />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(student.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center py-4 text-gray-500">No records found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                containerClassName={'flex justify-center items-center space-x-2 mt-4'}
                previousLinkClassName={'px-3 text-white py-1 bg-blue-600 rounded hover:bg-gray-400'}
                nextLinkClassName={'px-3 bg-blue-600 text-white  py-1 bg-gray-300 rounded hover:bg-gray-400'}
                disabledClassName={'opacity-50 cursor-not-allowed'}
                activeClassName={'text-blue-600 font-bold'}
            />
        </div>
    );
};

export default StudentGrades;
