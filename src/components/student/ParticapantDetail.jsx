import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUserCircle, FaPhone, FaEnvelope, FaSchool, FaMapMarkerAlt } from 'react-icons/fa';


const ParticapantDetail = () => {
    const [participant, setParticipant] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate()
    useEffect(() => {
        const fetchParticipant = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/center/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                });
                setParticipant(res.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchParticipant();
    }, [id]);

    if (!participant) {
        return (
            <div className="flex items-center justify-center h-screen">
                <h1 className="text-4xl font-extrabold text-red-500">404</h1>
                <p className="ml-4 text-lg text-gray-600">No record found for this participant.</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6 mt-8">
            <button onClick={() => navigate(-1)} className="text-white p-2 rounded-md bg-blue-600">back</button>
            <h1 className="text-3xl font-bold text-center text-gray-700 font-sans mb-6">Participant Details</h1>

            {/* Profile Section */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <div className="flex flex-col items-center w-1/2  rounded-lg p-6 shadow-md">
                    <div className=" mx-auto">
                        <img
                            className="w-32 h-32 object-cover rounded-full "
                            src={`http://localhost:4000/uploads/student/${participant.profile_pic}`}
                            alt="Participant"
                        />
                        <h2 className="mt-4 text-lg font-semibold capitalize w-full text-blue-800">{participant.full_name}</h2>
                        <span className="text-sm text-center ml-4 text-gray-500">ID: {participant.studentId}</span>
                    </div>
                </div>

                {/* Personal & Center Details */}
                <div className="w-full flex justify-between ">
                    {/* Personal Details */}
                    <div className="capitalize">
                        <h2 className="text-lg font-bold leading-8 text-gray-800 flex items-center gap-2">
                            <FaUserCircle className="text-blue-500 font-serif" /> Personal Details
                        </h2>
                        <p className="text-gray-700"><strong className="font-mono">Level:</strong> {participant.level_of_entry}</p>
                        <p className="text-gray-700"><strong className="font-mono">Mode Of Entry:</strong> {participant.mode_of_entry}</p>
                        <p className="text-gray-700 flex items-center gap-2"><FaPhone className="text-blue-900" /> {participant.telephone}</p>
                        <p className="text-gray-700 flex items-center gap-2"><FaEnvelope /> {participant.email}</p>
                        <p className="text-gray-700"><strong className="font-mono">Registered On:</strong> {new Date(participant.created_at).toLocaleDateString()}</p>
                    </div>

                    {/* Center Details */}
                    <div className="w-1/2 space-y-1 ">
                        <h2 className="relative text-lg font-bold text-gray-800 flex items-center gap-2 group">
                            <FaSchool className="text-green-500" />
                            <span className="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-1 after:bg-green-500 after:transition-all after:duration-300 group-hover:after:w-full">
                                Center Details
                            </span>
                        </h2>

                        <p className="text-gray-700 capitalize"><strong className="font-mono">Region:</strong> {participant.region}</p>
                        <p className="text-gray-700 capitalize"><strong className="font-mono">School:</strong> {participant.school}</p>
                        <p className="text-gray-700 capitalize"><strong className="font-mono">Coordinator:</strong> {participant.coordinator}</p>
                        <p className="text-gray-700 capitalize flex items-center gap-2"><FaMapMarkerAlt className="text-red-700 text-2xl" /> {participant.area}</p>

                        {/* <p className="text-gray-700"><FaMarker className="text-red-400"/> {participant.area}</p> */}
                    </div>
                </div>
            </div>


        </div>
    );
};

export default ParticapantDetail;
