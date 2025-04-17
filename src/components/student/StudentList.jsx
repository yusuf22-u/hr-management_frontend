import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiFillEdit, AiFillDelete, AiOutlineEye } from 'react-icons/ai';
import { FaUserPlus, FaTrophy, FaEye, FaPrint,FaSchool } from 'react-icons/fa'; 
import { FaClipboardCheck } from 'react-icons/fa';
// import StudentDetailModal from './StudentDetailModal';
import StudentDetailModal from './StudentDetailModal';
import FlashMessage from '../FlashMessage';
import { useNavigate } from 'react-router-dom';
import { FaBookOpen } from 'react-icons/fa';
import GenderMaritalStatusChart from './GenderMaritalStatusChart';

const StudentList = () => {
    const navigate = useNavigate()
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const itemsPerPage = 5;
    const [flash, setFlash] = useState({ message: '', type: '' });
    const [flashMessage, setFlashMessage] = useState()
    const userRole = sessionStorage.getItem('role');


    useEffect(() => {
        setIsLoading(true);
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/student/allStudents?page=${currentPage}&limit=${itemsPerPage}`, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
            .then(response => {
                const studentWithProfilePic = response.data.students.map(student => ({
                    ...student,
                    profile_pic: student.profile_pic ? `${process.env.REACT_APP_BACKEND_URL}/uploads/student/${student.profile_pic}` : null
                }));
                setStudents(studentWithProfilePic);
                setFilteredStudents(studentWithProfilePic);
                setTotalPages(Math.ceil(response.data.totalCount / itemsPerPage));
            })
            .catch(error => {
                console.error('There was an error fetching student data!', error);
                setErrorMessage('Error fetching student data');
            })
            .finally(() => {
                setIsLoading(false);
                if (flashMessage) {
                    const timer = setTimeout(() => setFlashMessage(null), 3000);
                    return () => clearTimeout(timer);
                }
            });
    }, [currentPage, flashMessage, itemsPerPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDelete = async (id) => {
        try {
            const result = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/v1/student/delete_Student/${id}`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });

            if (result.status === 200 || result.data.Status) {
                // Remove the deleted student from the state
                setStudents(prevStudents => prevStudents.filter(student => student.student_matNo !== id));

                // Show flash message
                setFlashMessage('Student has been deleted successfully');
                setTimeout(() => setFlashMessage(null), 3000);  // Clear after 3 seconds
            }
        } catch (err) {
            console.error(err);
        }
    };


    const handleSearch = () => {
        const searchStudents = students.filter(student =>
            student.full_name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredStudents(searchStudents);
    };

    const resetSearch = () => {
        setSearch('');
        setFilteredStudents(students);
    };

    const handleView = (studentId) => {
        setIsLoading(true);
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/student/getStudent/${studentId}`, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
            .then(response => {
                setSelectedStudent(response.data);
                setIsModalOpen(true);
            })
            .catch(error => {
                console.error('There was an error fetching student data!', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedStudent(null);
    };

    return (
        <>

            <div className="container mx-auto p-4">
                <div className="px-3 py-2">
                <GenderMaritalStatusChart />
                </div>
            
                <div className="flex flex-col md:flex-row py-2 justify-between items-center mb-6">
                    {userRole === 'admin' && (
                         <div className="flex space-x-3">
                         <Link
                             to='/dashboard/student'
                             className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-all"
                         >
                             <FaUserPlus className="mr-2" /> {/* Add an icon */}
                             Add Participant
                         </Link>
                         <Link
                             to='/dashboard/award/create'
                             className="flex items-center bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-400 transition-all"
                         >
                             <FaTrophy className="mr-2" />
                             Add Score
                         </Link>
                         <Link
                             to='/dashboard/student_Score/grade'
                             className="flex items-center bg-blue-300 text-gray-700 py-2 px-4 rounded-lg shadow-md hover:bg-gray-400 transition-all"
                         >
                             <FaEye className="mr-2 text-white" />
                             View Scores
                         </Link>
                         <Link
                             to='/dashboard/student/search'
                             className="flex  items-center bg-white text-blue-800 py-2 px-4 rounded-lg shadow-md hover:bg-gray-400 transition-all"
                         >
                             <FaPrint className="mr-2" />
                             Print Participant
                         </Link>
                         <Link
                             to='/dashboard/centerForm'
                             className="flex  items-center bg-orange-400  text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-400 transition-all"
                         >
                             <FaSchool className="mr-2" />
                             Center Register Form
                         </Link>
                     </div>
                    )}




                    <div className="search px-4 flex items-center space-x-2 mt-4 md:mt-0">
                        <input
                            type="text"
                            name="search"
                            value={search}
                            placeholder="Search by name"
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button onClick={handleSearch} className="bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-all">
                            Search
                        </button>
                        <button onClick={resetSearch} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow-md hover:bg-gray-400 transition-all">
                            Reset
                        </button>
                    </div>
                </div>
                {flashMessage && (
                    <div className="mx-auto w-[50%] bg-green-300 text-white p-4 text-center">
                        {flashMessage}
                    </div>
                )}

                <div className="flex justify-between items-center mb-4">


                    <h2 className="text-2xl font-bold text-gray-800">Participants List</h2>

                </div>

                {isLoading ? (
                    <div className="text-center py-4">Loading...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full bg-white rounded-lg shadow-md">
                            <thead className="bg-blue-500 text-white">
                                <tr>
                                    <th className="px-4 py-2 text-left">Profile</th>
                                    <th className="px-4 py-2 text-left">Full Name</th>
                                    <th className="px-4 py-2 text-left">Email</th>
                                    <th className="px-4 py-2 text-left">Address</th>
                                    <th className="px-4 py-2 text-left">Phone Number</th>
                                    <th className="px-4 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student, index) => (
                                    <tr key={index} className={`hover:bg-gray-100 transition-all ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                                        <Link to={`/dashboard/participant/${student.student_matNo}`}>
                                        <td className="px-4 py-2">
                                            {student.profile_pic ? <img src={student.profile_pic} alt={student.full_name} className="w-12 h-12 object-cover rounded-full" /> : 'No Image'}
                                        </td>
                                        </Link>
                                        
                                        <td className="px-4 py-2">{student.full_name}</td>
                                        <td className="px-4 py-2">{student.email}</td>
                                        <td className="px-4 py-2">{student.address}</td>
                                        <td className="px-4 py-2">{student.phone_number}</td>

                                        <td className="px-4 py-2 flex space-x-2 items-center">
                                            <button onClick={() => handleView(student.student_matNo)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded shadow-md flex items-center transition-all">
                                                <AiOutlineEye size={24} />
                                            </button>
                                            {userRole === 'admin' && (
                                                <div className="flex space-x-2">
                                                    <Link to={'/dashboard/edit_student/' + student.student_matNo} className="text-green-600 hover:text-green-800">
                                                        <AiFillEdit size={24} />
                                                    </Link>
                                                    <button onClick={() => handleDelete(student.student_matNo)} className="text-red-600 hover:text-red-800">
                                                        <AiFillDelete size={24} />
                                                    </button>
                                                </div>


                                            )}
                                            <Link to={'/dashboard/student_report/' + student.student_matNo} className="bg-blue-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded shadow-md flex items-center transition-all">
                                                <FaBookOpen  size={24} />
                                            </Link>
                                        </td>
                                        {/* <button onClick={() => handleView(student.student_matNo)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded shadow-md flex items-center transition-all">
                                                 <AiOutlineEye size={24} />
                                             </button>
                                        */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

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


            <StudentDetailModal student={selectedStudent} isOpen={isModalOpen} onClose={closeModal} />
        </>
    );
};

export default StudentList;
