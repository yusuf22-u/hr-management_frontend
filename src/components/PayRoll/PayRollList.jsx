import { AiOutlineTeam, AiOutlineDollarCircle } from 'react-icons/ai';
import { MdAccountBalance } from 'react-icons/md';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AiFillEdit, AiFillDelete, AiOutlineEye, AiOutlinePlus } from 'react-icons/ai';
import Modal from '../Model';
import PayrollForm from './PayrollForm';

const PayRollList = () => {
    const [payroll, setPayroll] = useState([]);
    const [totalSalary, setTotalSalary] = useState(0);
    const [totalNumPeople, setTotalNumPeople] = useState(0);
    const [limit, setLimit] = useState(5); // Default to 5 entries per page
    const [page, setPage] = useState(1); // Current page
    const [searchQuery, setSearchQuery] = useState(''); // Search query state
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch payroll data
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/payrolls/payroll_list`, {
            params: { limit, offset: (page - 1) * limit }
        }, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                withCredentials: true
            },
        })
            .then((res) => {
                const { result, totalCount, totalNetSalary } = res.data;
                setPayroll(result);

                setTotalNumPeople(totalCount);
                setTotalSalary(Number(totalNetSalary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })));
            })
            .catch((err) => {
                console.log('Error:', err);
            });
    }, [limit, page]); // Re-fetch data when limit or page changes

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this PayRoll?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/v1/payrolls/payroll_delete/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                        withCredentials: true
                    },
                });
                setPayroll(payroll.filter(pay => pay.payroll_id !== id));
            } catch (error) {
                console.log('Error deleting payroll:', error);
            }
        }
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // onClose function to close the modal
    const onClose = () => {
        setIsModalOpen(false);
    };

    // Filter payroll based on search query
    const filteredPayroll = payroll.filter(pay =>
        pay.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className="overflow-x-auto">
                <div className="flex justify-between items-center mb-6 p-4 bg-gray-100 rounded-lg shadow-sm">
                    {/* Logo and Title Section */}
                    <div className="logo flex items-center space-x-3">
                        <MdAccountBalance className="text-blue-600 w-8 h-8" />
                        <div className='flex flex-col space-y-3 items-center'>
                            <h3 className="text-xl font-bold text-gradient-to-r from-orange-400 to-red-400">President International Award</h3>
                        </div>
                    </div>

                    {/* Cards for Number of People and Overall Salary */}
                    <div className="flex space-x-8">
                        <div className="total flex items-center space-x-2 bg-white p-4 rounded-lg shadow-md">
                            <div className='flex flex-col space-y-3 items-center'>
                                <h2 className="text-lg font-semibold text-gray-600">Number of People</h2>
                                <AiOutlineTeam className="text-blue-500 w-8 h-8" />
                                <p className="text-xl font-bold text-gray-800">
                                    {totalNumPeople.toLocaleString('en-US')}
                                </p>
                            </div>
                        </div>
                        <div className="total flex items-center space-x-2 bg-gradient-to-r from-orange-400 to-red-400 p-4 rounded-lg shadow-md">
                            <div className='flex flex-col items-center'>
                                <h2 className="text-lg font-semibold text-white">Overall Salary Total</h2>
                                <AiOutlineDollarCircle className="text-green-500 w-8 h-8" />
                                <p className="text-xl font-bold text-gray-800">
                                    D{totalSalary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h1 text-center">
                    <h1>PayRoll list</h1>
                </div>
                {/* Search Input and Controls */}
                <div className="flex justify-between items-center w-full py-4 space-x-4">

                    {/* Add Payroll Button */}
                    <Link onClick={() => setIsModalOpen(true)}
                        className="flex items-center px-4 py-2 text-green-600 hover:bg-green-900 hover:text-white bg-white font-semibold rounded-lg shadow-md transition duration-300"
                    >
                        <AiOutlinePlus size={24} className="mr-2" />
                        <span>Add Payroll</span>
                    </Link>

                    {/* Modal */}
                    <Modal isOpen={isModalOpen} onClose={onClose}>
                        <PayrollForm onClose={onClose} />
                    </Modal>

                    {/* Select Entries per Page */}
                    <div className="flex items-center">
                        <label className="mr-2 text-sm">Showing</label>
                        <select
                            value={limit}
                            onChange={(e) => setLimit(parseInt(e.target.value))}
                            className="px-2 py-1 bg-white border rounded-lg text-sm"
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                        <p className="ml-2 text-sm">of {totalNumPeople} entries</p>
                    </div>

                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="Search by Full Name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg w-1/3 text-sm"
                    />
                </div>


                {/* Payroll Table */}


                <table className="w-full bg-white rounded-lg shadow-lg">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="px-4 py-2 text-left">Profile</th>
                            <th className="px-4 py-2 text-left">Full Name</th>
                            <th className="px-4 py-2 text-left">Basic Salary</th>
                            <th className="px-4 py-2 text-left">Net Salary</th>
                            <th className="px-4 py-2 text-left">Department</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPayroll.map((pay, index) => (
                            <tr key={index} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                                <td className="px-4 py-2">
                                    {pay.profile_pic ? <img src={`${process.env.REACT_APP_BACKEND_URL}/uploads/profile/${pay.profile_pic}`} alt={pay.full_name} className="w-12 h-12 object-cover rounded-full" /> : 'No Image'}
                                </td>
                                <td className="px-4 py-2">{pay.full_name}</td>
                                <td className="px-4 py-2">D{Number(pay.basic_salary).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="px-4 py-2">D{Number(pay.net_salary).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>

                                <td className="px-4 py-2">{pay.department}</td>
                                <td className="px-4 py-2 flex space-x-2 items-center">
                                    <Link to={`/dashboard/edit/${pay.employee_id}`} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded flex items-center">
                                        <AiFillEdit className="w-5 h-5" />
                                    </Link>
                                    <button onClick={() => handleDelete(pay.payroll_id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded flex items-center">
                                        <AiFillDelete className="w-5 h-5" />
                                    </button>
                                    <Link to={`/dashboard/payroll/singlePayroll/${pay.employee_id}`} className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded flex items-center">
                                        <AiOutlineEye className="w-5 h-5" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex justify-center mt-4">
                    {[...Array(Math.ceil(totalNumPeople / limit)).keys()].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`mx-1 px-3 py-1 rounded ${page === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};

export default PayRollList;
