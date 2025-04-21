import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AiFillEdit, AiFillDelete, AiOutlineEye } from 'react-icons/ai';
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BsFillBarChartFill } from "react-icons/bs";

import { FaFileAlt } from 'react-icons/fa';
import ScoreGraph from './ScoreGraph';

const EmployeePerformance = () => {
    const [evaluations, setEvaluations] = useState([]);
    const [filteredEvaluations, setFilteredEvaluations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [staff, setStaff] = useState(null);
    const itemsPerPage = 5;

    // Fetch evaluations
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/evaluations/view`, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        })
            .then(response => {
                const sortedEval = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setEvaluations(sortedEval);
                setFilteredEvaluations(sortedEval);
            })
            .catch(error => console.error('Error fetching evaluations:', error));
    }, []);

    // Fetch Staff of the Month
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/evaluations/staffOfTheMonth`,{
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            }
        })
            .then(response => setStaff(response.data))
            .catch(error => console.error("Error fetching staff of the month:", error));
    }, []);

    // Handle Search
    const handleSearch = () => {
        const results = evaluations.filter(employee =>
            employee.full_name.toLowerCase().includes(search.toLowerCase()) ||
            new Date(employee.created_at).getFullYear().toString().includes(search)
        );
        setFilteredEvaluations(results);
        setCurrentPage(1); // Reset to first page
    };

    const resetSearch = () => {
        setSearch('');
        setFilteredEvaluations(evaluations);
        setCurrentPage(1);
    };

    // Pagination Logic
    const totalPages = Math.ceil(filteredEvaluations.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEvaluations = filteredEvaluations.slice(indexOfFirstItem, indexOfLastItem);

    // Handle Page Change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
// console.log('eval',evaluations)
    return (
        <div className="p-6 bg-white shadow-md rounded-lg overflow-hidden">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800 text-center">Evaluation List</h2>
                <Link to='/dashboard/staff_evaluation/create' className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 flex items-center space-x-2">
                    <FaFileAlt className="w-5 h-5" />
                    <span>+ Add Evaluation</span>
                </Link>
            </div>

            {/* Staff of the Month */}
            <div className="flex flex-col sm:flex-row justify-between bg-white rounded-md shadow-lg p-4 m-4">
                <div className="flex flex-col justify-center items-center">
                    <h1 className='text-blue-600 capitalize text-lg'>Employee of the Month</h1>
                    <Link to={'/dashboard/employee/StaffOfMonth/'}>
                        <img
                            src={`${staff?.profile_pic}`}
                            alt="Employee"
                            className="w-32 sm:w-40 h-32 sm:h-40 rounded-full border-blue-500 shadow-md"
                        />
                    </Link>
                    <h3 className='text-center text-gray-500 font-serif capitalize'>{staff?.full_name}</h3>
                </div>
                <div className="mt-4 lg:h-full sm:mt-0">
                    <ScoreGraph />
                </div>
            </div>

            {/* Search Section */}
            <div className="bg-gray-100 p-4 rounded-lg flex flex-col sm:flex-row items-center gap-4 mb-6">
                <input
                    type="text"
                    value={search}
                    placeholder="Search by name or year"
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                    <button onClick={handleSearch} className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
                        Search
                    </button>
                    <button onClick={resetSearch} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400">
                        Reset
                    </button>
                </div>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow-md rounded-lg">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="px-4 py-3 text-left">Profile</th>
                            <th className="px-4 py-3 text-left">Full Name</th>
                            <th className="px-4 py-3 text-left">Department</th>
                            <th className="px-4 py-3 text-left">Position</th>
                            <th className="px-4 py-3 text-left">Work Rate</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentEvaluations.length > 0 ? (
                            currentEvaluations.map((evals, index) => (
                                <tr key={index} className={`hover:bg-gray-100 transition ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                                    <td className="px-4 py-3">
                                        <img
                                            src={`${evals.profile_pic}`}
                                            alt={evals.full_name}
                                            className="w-12 h-12 object-cover rounded-full border-2 border-gray-300"
                                        />
                                    </td>
                                    <td className="px-4 py-3">{evals.full_name}</td>
                                    <td className="px-4 py-3">{evals.department}</td>
                                    <td className="px-4 py-3">{evals.position}</td>
                                    <td className="px-4 py-3">
                                        <div className="w-full h-6 bg-gray-200 rounded-full">
                                            <div
                                                className={`h-full text-white text-xs font-medium flex items-center justify-center ${evals.overall_performance >= 90 ? "bg-yellow-500" : evals.overall_performance >= 60 ? "bg-green-500" : "bg-red-500"
                                                    }`}
                                                style={{ width: `${evals.overall_performance}%` }}
                                            >
                                                {evals.overall_performance}%
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 flex gap-2">
                                        <Link to={`/dashboard/evaluations/rates/${evals.evaluation_id}`} className="bg-blue-500 text-white p-2 rounded">
                                            <BsFillBarChartFill />
                                        </Link>
                                        <button className="bg-red-500 text-white p-2 rounded">
                                            <AiFillDelete />
                                        </button>
                                        <Link to={`/dashboard/evaluations/${evals.evaluation_id}`} className="bg-green-500 text-white p-2 rounded">
                                            <AiOutlineEye />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center text-gray-500 py-4">
                                    No results found
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>

            {/* Pagination UI */}
            <div className="mt-6 flex justify-center">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} onClick={() => handlePageChange(i + 1)} className={`mx-1 px-4 py-2 rounded-lg ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400 transition'}`}>
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default EmployeePerformance;
