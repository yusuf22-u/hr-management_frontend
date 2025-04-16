import axios from 'axios';
import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import { FaUserGraduate, FaPrint, FaSchool } from 'react-icons/fa';
import { AiFillEdit, AiFillDelete, AiOutlineEye } from 'react-icons/ai';
import { FiSearch } from "react-icons/fi";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from "react-router-dom"

const ParticipantList = () => {
    const [participant, setParticipant] = useState([]);
    const [filteredParticipant, setFilteredParticipant] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const itemsPerPage = 5;
const navigate=useNavigate()

    useEffect(() => {
        const fetchParticipant = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/v1/center/?page=${currentPage}&limit=${itemsPerPage}`, {
                    headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
                });
                setParticipant(res.data.participant);
                setFilteredParticipant(res.data.participant); // Initially set filtered data to all participants
                setTotalPages(Math.ceil(res.data.totalCount / itemsPerPage));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchParticipant();
    }, [currentPage, itemsPerPage]);
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    // Update filtered list whenever `search` changes
    useEffect(() => {
        const filterData = participant.filter((p) =>
            p.region.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredParticipant(filterData);

    }, [search, participant]); // Runs whenever `search` or `participant` updates
    //handle delete
    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:4000/v1/center/${id}`, {
                headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
            });

            // Display success message
            toast.success(res.data.message || "Participant deleted successfully");

            // Remove the deleted participant from state
            setParticipant((prevParticipants) => prevParticipants.filter((p) => p.id !== id));

        } catch (error) {
            console.error("Error deleting participant:", error);

            // Handle errors properly
            const errorMessage = error.response?.data?.error || "An error occurred";
            toast.error(errorMessage);
        }
    };
    
    const dateFormatted = (dates) => new Date(dates).getUTCFullYear();

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <button onClick={()=>navigate(-1)} className="bg-blue-800 text-white rounded-md m-2 shadow-md p-2">Back</button>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">Participant List</h1>
                {/* Top Links */}
                <div className="flex flex-wrap justify-between items-center mb-4">
                    <Link to="/dashboard/award/home" className="group flex flex-col items-center text-center">
                        <div className="bg-green-100 p-4 rounded-full shadow-md group-hover:scale-110 transition-transform">
                            <FaUserGraduate className="text-green-600" size={36} />
                        </div>
                        <span className="text-gray-600 mt-2 font-medium">Participants</span>
                    </Link>

                    <div className="flex space-x-4">
                        <Link to='/dashboard/advance/search' className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-all">
                            <FiSearch className="mr-2" /> Advance Search
                        </Link>
                        <Link to='/dashboard/centerForm' className="flex items-center bg-orange-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-orange-600 transition-all">
                            <FaSchool className="mr-2" /> Register Center
                        </Link>
                    </div>
                </div>
                {/* Region Filter Dropdown */}
                <div className="p-3 w-full">
                    <select
                        className="border border-gray-700 w-full p-2 rounded bg-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    >
                        <option value="">All Regions</option>
                        <option value="Region One">Region One</option>
                        <option value="Region Two">Region Two</option>
                        <option value="Region Three">Region Three</option>
                        <option value="Region Four">Region Four</option>
                    </select>
                </div>


                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full bg-white border-collapse rounded-lg shadow-lg overflow-hidden">
                        <thead className="bg-blue-500 text-white">
                            <tr>
                                <th className="px-4 py-3 text-left">Profile</th>
                                <th className="px-4 py-3 text-left">Full Name</th>
                                <th className="px-4 py-3 text-left">Level</th>
                                <th className="px-4 py-3 text-left">Region</th>
                                <th className="px-4 py-3 text-left">Area</th>
                                <th className="px-4 py-3 text-left">School</th>
                                <th className="px-4 py-3 text-left">Year</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredParticipant.map((student, index) => (
                                <tr key={index} className={`hover:bg-gray-100 transition-all ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                                    <Link to={`/dashboard/participant/${student.studentId}`}>
                                        <td className="px-4 py-3">
                                            <img src={`http://localhost:4000/uploads/student/${student.profile_pic}`} alt={student.full_name} className="w-12 h-12 object-cover rounded-full" />
                                        </td>
                                    </Link>

                                    <td className="px-4 py-3">{student.full_name}</td>
                                    <td className="px-4 py-3">{student.level_of_entry}</td>
                                    <td className="px-4 py-3">{student.region}</td>
                                    <td className="px-4 py-3">{student.area}</td>
                                    <td className="px-4 py-3">{student.school}</td>
                                    <td className="px-4 py-3">{dateFormatted(student.created_at)}</td>
                                    <td className="px-4 py-3 flex space-x-2">

                                        <Link to={`/dashboard/edit_particpant/${student.id}`} className="text-blue-600 hover:text-blue-800">
                                            <AiFillEdit size={20} />
                                        </Link>
                                        <button onClick={() => handleDelete(student.id)} className="text-red-600 hover:text-red-800">
                                            <AiFillDelete size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredParticipant.length === 0 && <p className="text-gray-500 text-center mt-4">No participants found</p>}
                </div>
                <div className="mt-6 flex justify-center space-x-2">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-4 py-2 rounded-full ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>

            <ToastContainer
                position="top-center"
                autoClose={3000}
                className={'text-center'}
                // hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

        </div>
    );
};

export default ParticipantList;
