import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiFillEdit, AiFillDelete, AiOutlineEye } from 'react-icons/ai';
import EmployeeDetail from './EmployeeDetail';
import { FaUserPlus, FaFileAlt,FaBoxes } from "react-icons/fa";


const EmployeeList = () => {
    const [employees, setEmployees] = useState([]); // Initialize as an empty array
    const [filteredEmployees, setFilteredEmployees] = useState([]); // Initialize as an empty array
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const itemsPerPage = 5; // Number of items per page

    useEffect(() => {
        setIsLoading(true);
        axios.get(`http://localhost:4000/v1/employees/getEmployee?page=${currentPage}&limit=${itemsPerPage}`)
            .then(response => {
                const employeesWithProfilePic = response.data.employees.map(employee => ({
                    ...employee,
                    profile_pic: employee.profile_pic ? `http://localhost:4000/uploads/profile/${employee.profile_pic}` : null
                }));
                setEmployees(employeesWithProfilePic);
                setFilteredEmployees(employeesWithProfilePic); // Populate filteredEmployees as well
                setTotalPages(Math.ceil(response.data.totalCount / itemsPerPage));
            })
            .catch(error => {
                console.error('There was an error fetching employee data!', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [currentPage]); // Include 'refresh' here

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:4000/v1/employees/deleteEmployee/${id}`, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        }).then(result => {
            if (result.data.Status) {
                window.location.reload()
            }
        }).catch(err => {
            console.log(err)
        })
    };

    // Search functionality
    const handleSearch = () => {
        const searchEmployees = employees.filter(employee =>
            employee.full_name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredEmployees(searchEmployees);
    }

    const resetSearch = () => {
        setSearch(''); // Clear the search input.
        setFilteredEmployees(employees); // Reset to the full list of employees.
    }
    const handleView = (employeeId) => {
        // setIsLoading(true);
        axios.get(`http://localhost:4000/v1/employees/getSingleEmployee/${employeeId}`, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
            .then(response => {
                setSelectedEmployee(response.data);
                setIsModalOpen(true);
            })
            .catch(error => {
                console.error('There was an error fetching employee data!', error);
            })
            .finally(() => {
                // setIsLoading(false);
            });
    };


    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedStudent(null);
    };
    return (
        <>
            {/* Employee Table */}
            <div className="p-6 bg-white shadow-md rounded-lg overflow-hidden">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">Employee List</h2>

                    <div className="flex flex-wrap gap-2">
                        <Link to='/dashboard/employee/add' className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 flex items-center space-x-2">
                            <FaUserPlus className="w-5 h-5" />
                            <span>Add Employee</span>
                        </Link>

                        <Link to='/dashboard/employee/doc' className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 flex items-center space-x-2">
                            <FaFileAlt className="w-5 h-5" />
                            <span>Employee Doc</span>
                        </Link>

                        <Link to='/dashboard/employee/evaluation_list/' className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 flex items-center space-x-2">
                            <FaBoxes className="w-5 h-5" />
                            <span>Evaluation list</span>
                        </Link>

                    </div>
                </div>

                {/* Search Section */}
                <div className="bg-gray-100 p-4 rounded-lg flex flex-col md:flex-row items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 w-full">
                        <label className="text-gray-700 font-medium">Search:</label>
                        <input
                            type="text"
                            name="search"
                            value={search}
                            placeholder="Search by name"
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleSearch} className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition">
                            Search
                        </button>
                        <button onClick={resetSearch} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition">
                            Reset
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                {isLoading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                            <thead className="bg-blue-500 text-white">
                                <tr>
                                    <th className="px-4 py-3 text-left">Profile</th>
                                    <th className="px-4 py-3 text-left">Full Name</th>
                                    <th className="px-4 py-3 text-left">Email</th>
                                    <th className="px-4 py-3 text-left">Address</th>
                                    <th className="px-4 py-3 text-left">Phone</th>
                                    <th className="px-4 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.map((employee, index) => (
                                    <tr key={index} className={`hover:bg-gray-100 transition ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                                        <td className="px-4 py-3">
                                            <Link to={`/dashboard/employee/certificates/${employee.employee_id}`}>
                                                <img
                                                    src={employee.profile_pic}
                                                    alt={employee.full_name}
                                                    className="w-12 h-12 object-cover rounded-full border-2 border-gray-300"
                                                />
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3">{employee.full_name}</td>
                                        <td className="px-4 py-3">{employee.email}</td>
                                        <td className="px-4 py-3">{employee.address}</td>
                                        <td className="px-4 py-3">{employee.phone_number}</td>
                                        <td className="px-4 py-3 flex gap-2">
                                            <Link to={`/dashboard/edit/${employee.employee_id}`} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded flex items-center transition">
                                                <AiFillEdit className="w-5 h-5" />
                                            </Link>
                                            <button onClick={() => handleDelete(employee.employee_id)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded flex items-center transition">
                                                <AiFillDelete className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleView(employee.employee_id)} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded flex items-center transition">
                                                <AiOutlineEye className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                <div className="mt-6 flex justify-center">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`mx-1 px-4 py-2 rounded-lg ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400 transition'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
            <EmployeeDetail employee={selectedEmployee} isOpen={isModalOpen} onClose={closeModal} />
        </>
    );
};

export default EmployeeList;
