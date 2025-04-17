// src/components/StudentReport.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import logo from '../../assets/logo.jpeg'
import logo1 from '../../assets/logo1.png'

const StudentReport = () => {
    const { id } = useParams()
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/student/getStudent/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                });
                setStudent(response.data);
            } catch (error) {
                console.error('Error fetching student data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [id]);

    const handlePrint = () => {
        const printContent = document.getElementById("print-content").innerHTML;
        const newWindow = window.open("", "_blank");
        newWindow.document.open();
        newWindow.document.write(`
            <html>
                <head>
                    <title>Print Report</title>
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
                    <style>
                        /* Custom print styles */
                        @media print {
                            body { font-family: Arial, sans-serif; color: #333; }
                            .print-container { max-width: 800px; margin: auto; padding: 2rem; background-color: white; }
                            .header, .footer { text-align: center; margin-bottom: 1rem; }
                            .header img { width: 60px; }
                            .footer p { margin: 0.3rem 0; font-size: 12px; }
                            .text-header h1 { font-size: 1.25rem; }
                            .profile-img { width: 100px; height: 120px; object-fit: cover; border-radius: 5px; }
                            .bio{display:flex; width:80%; margin-top:20px; padding-top:1rem; margin:auto; justufy-content:space-between;}
                        }
                    </style>
                </head>
                <body onload="window.print(); window.close();">
                    <div class="print-container">${printContent}</div>
                </body>
            </html>
        `);
        newWindow.document.close();
    };
    
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) return <p>Loading...</p>;

    if (!student) return <p>No student data found.</p>;

    return (
        <div id='print-content' className="p-6  print-container  bg-white shadow-lg mx-auto rounded-lg print:bg-white">
            <header className="text-center mb-4">
                <div className="header flex justify-between items-center space-x-2">
                    <img className="w-16" src={logo1} alt="logo1" />
                    <img className="w-32" src={logo} alt="logo2" />
                </div>

                <div className="text-header flex flex-col justify-center pb-4">
                    <h1 className="text-center text-xl font-semibold">THE PRESIDENT’S INTERNATIONAL AWARD</h1>

                    {/* Styled hr for brown, thicker line */}
                    <hr className="border-t-4 border-red-700 my-2 text-[#964B00] w-3/4 mx-auto" />

                    <p className="text-center text-xs text-gray-800">
                        P.O.Box 34567, Bakau opposite Friendship Hotel
                    </p>
                </div>

                <h1 className="text-3xl font-bold mt-4">Participant Report</h1>
                <p className="text-gray-600">{student.full_name}</p>
            </header>


            <section className="mb-8 p-6 rounded-lg shadow-md border border-gray-200 bg-white">
                <h2 className="text-2xl font-bold text-gray-700 border-b pb-3 mb-6 text-center">Bio Information</h2>

                <div className="flex flex-col md:flex-row items-center justify-center mx-auto md:space-x-8">
                    <img
                        src={`${process.env.REACT_APP_BACKEND_URL}/uploads/student/${student.profile_pic}`}
                        alt="Profile"
                        className="w-28 h-32 profile-img   object-cover"
                    />

                    <div className=" w-full md:w-2/3 py-4 space-y-6">
                        <div className="bio grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                            <p className="flex flex-col">
                                <strong className="text-sm font-semibold text-gray-500">Participant ID</strong>
                                <span className="text-base">{student.student_matNo}</span>
                            </p>
                            <p className="flex flex-col">
                                <strong className="text-sm font-semibold text-gray-500">Full Name</strong>
                                <span className="text-base">{student.full_name}</span>
                            </p>
                            <p className="flex flex-col">
                                <strong className="text-sm font-semibold text-gray-500">Gender</strong>
                                <span className="text-base">{student.gender}</span>
                            </p>
                            <p className="flex flex-col">
                                <strong className="text-sm font-semibold text-gray-500">Date of Birth</strong>
                                <span className="text-base">{formatDate(student.date_of_birth)}</span>
                            </p>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-600 mt-4 border-b pb-2 text-center">Contact Details</h3>

                        <div className="grid bio grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
                            <p className="flex flex-col">
                                <strong className="text-sm font-semibold text-gray-500">Email</strong>
                                <span className="text-base">{student.email}</span>
                            </p>
                            <p className="flex flex-col">
                                <strong className="text-sm font-semibold text-gray-500">Address</strong>
                                <span className="text-base">{student.address}</span>
                            </p>
                            <p className="flex flex-col">
                                <strong className="text-sm font-semibold text-gray-500">Phone Number</strong>
                                <span className="text-base">{student.phone_number}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="mb-8 p-6 rounded-lg shadow-md border border-gray-200 bg-white">
                <h2 className="text-2xl font-bold text-gray-700 border-b pb-3 mb-6 text-center">Parent/Guardian Details</h2>

                <div className="grid grid-cols-1 bio md:grid-cols-2 gap-6 text-gray-700 px-4">
                    <p className="flex flex-col">
                        <strong className="text-sm font-semibold text-gray-500">Parent's Name</strong>
                        <span className="text-base">{student.parent_name}</span>
                    </p>
                    <p className="flex flex-col">
                        <strong className="text-sm font-semibold text-gray-500">Parent's Phone</strong>
                        <span className="text-base">{student.parent_tel}</span>
                    </p>
                    <p className="flex flex-col">
                        <strong className="text-sm font-semibold text-gray-500">Parent's Email</strong>
                        <span className="text-base">{student.parent_email}</span>
                    </p>
                </div>
            </section>

            <section className="mb-8 p-6 rounded-lg shadow-md border border-gray-200 bg-white">
                <h2 className="text-2xl font-bold text-gray-700 border-b pb-3 mb-6 text-center">Level Details</h2>

                <div className="grid bio grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 px-4">
                    <p className="flex flex-col">
                        <strong className="text-sm font-semibold text-gray-500">Occupation</strong>
                        <span className="text-base">{student.occupation}</span>
                    </p>
                    <p className="flex flex-col">
                        <strong className="text-sm font-semibold text-gray-500">Level of Entry</strong>
                        <span className="text-base">{student.level_of_entry}</span>
                    </p>
                    <p className="flex flex-col">
                        <strong className="text-sm font-semibold text-gray-500">Mode of Entry</strong>
                        <span className="text-base">{student.mode_of_entry}</span>
                    </p>
                    <p className="flex flex-col">
                        <strong className="text-sm font-semibold text-gray-500">Center</strong>
                        <span className="text-base">{student.center}</span>
                    </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-700 border-b pb-3 mt-8 mb-6 text-center">Health Details</h2>

                <div className="grid grid-cols-1 bio md:grid-cols-2 gap-6 text-gray-700 px-4">
                    <p className="flex flex-col">
                        <strong className="text-sm font-semibold text-gray-500">Health Conditions</strong>
                        <span className="text-base">{student.health_conditions}</span>
                    </p>
                    <p className="flex flex-col">
                        <strong className="text-sm font-semibold text-gray-500">Health Explanation</strong>
                        <span className="text-base">{student.health_explanation}</span>
                    </p>
                    <p className="flex flex-col">
                        <strong className="text-sm font-semibold text-gray-500">Differently Abled</strong>
                        <span className="text-base">{student.differently_abled}</span>
                    </p>
                </div>
            </section>

            <button
                onClick={handlePrint}
                className="mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            >
                Print Report
            </button>
            <footer className="mt-6 pt-6 pb-4 footer bg-gray-100 border-t-2 border-gray-300">
                <p className="text-center font-semibold text-gray-700">National Award Operator</p>
                <p className="text-center text-gray-600">P.O.Box 2971, Serrekunda, The Gambia</p>
                <p className="text-center text-gray-600">Website: <a target="_blank" href="http://www.piaward.org" className="text-blue-600 underline">www.piaward.org</a></p>
                <p className="text-center text-gray-600">Email: <a href="mailto:gambia@piaward.org" className="text-blue-600 underline">gambia@piaward.org</a> / <a href="mailto:info@piaward.org" className="text-blue-600 underline">info@piaward.org</a></p>
                <p className="text-center text-gray-600">Phone: (+220) 9960883 / 7207794 / 2200003</p>
            </footer>

        </div>
    );
};

export default StudentReport;
