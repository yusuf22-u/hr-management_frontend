import React from 'react';
import { AiOutlineMail, AiOutlineHome, AiOutlinePhone } from 'react-icons/ai';

const StudentDetailModal = ({ student, isOpen, onClose }) => {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-xl font-bold mb-2 text-center text-gray-800">Student Details</h2>
                <div className="flex justify-center mb-4">
                    {student.profile_pic ? (
                        <img src={`http://localhost:4000/uploads/student/${student.profile_pic}`} alt={student.full_name} className="w-24 h-24 object-cover rounded-full" />
                    ) : (
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                            No Image
                        </div>
                    )}
                </div>

                {student ? (
                    <>
                        <h3 className="text-md font-semibold text-gray-700 mb-2">Personal Details</h3>
                        <div className="bg-gray-50 p-3 rounded-lg mb-3 flex justify-between space-x-2">
                            <div className="mb-1">
                                <span className="font-semibold text-gray-600">Name:</span>
                                <span className="capitalize text-gray-700 ml-2">{student.full_name}</span>
                            </div>
                            <div className="mb-1">
                                <span className="font-semibold text-gray-600">D.O.B:</span>
                                <span className="capitalize text-gray-700 ml-2">{formatDate(student.date_of_birth)}</span>
                            </div>
                            <div className="mb-1">
                                <span className="font-semibold text-gray-600">Gender:</span>
                                <span className="capitalize text-gray-700 ml-2">{student.gender}</span>
                            </div>
                        </div>

                        <h3 className="text-md font-semibold text-gray-700 mb-2">Contact Details</h3>
                        <div className="bg-gray-50 p-3 rounded-lg flex justify-between mb-3 space-y-1">
                            <div className="flex items-center">
                                <AiOutlineMail className="text-blue-500 w-5 h-5 mr-2" />
                                <span className="text-gray-700 text-sm">{student.email}</span>
                            </div>
                            <div className="flex items-center">
                                <AiOutlineHome className="text-green-500 w-5 h-5 mr-2" />
                                <span className="capitalize text-gray-700 text-sm">{student.address}</span>
                            </div>
                            <div className="flex items-center">
                                <AiOutlinePhone className="text-red-500 w-5 h-5 mr-2" />
                                <span className="text-gray-700 text-sm">{student.phone_number}</span>
                            </div>
                        </div>

                        <h3 className="text-md font-semibold text-gray-700 mb-2">Admission Details</h3>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex justify-between">
                                <span className="font-semibold text-gray-600">Date of Admission:</span>
                                <span className="text-gray-700 text-sm">{formatDate(student.date_of_admission)}</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-gray-600">Loading...</div>
                )}

                <button
                    onClick={onClose}
                    className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-all"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default StudentDetailModal;
