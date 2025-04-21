import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
// import logo from '../../assets/logo.jpeg';
import logo1 from '../../assets/logo1.png';
import award from '../../assets/award.png';

const StudentScore = () => {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/score/mark/${id}`);
                setScores(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching scores');
                setLoading(false);
            }
        };

        fetchScores();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div 
            className="max-w-3xl mx-auto shadow-md rounded-lg overflow-hidden relative" 
            style={{
                backgroundImage: `url(${award})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',  // Ensure the div has enough height
            }}
        >
            <div 
                className="absolute inset-0 bg-black opacity-30" 
                style={{ mixBlendMode: 'multiply' }}
            ></div>

            <div className="relative z-10 bg-white p-4 rounded-lg">
                {/* Header Section */}
                <header className="text-center mb-4">
                    <div className="header flex justify-between items-center">
                        <img className="w-16" src={logo1} alt="logo1" />
                        <img className="w-32" src={logo1} alt="logo2" />
                    </div>

                    <div className="text-header flex flex-col justify-center pb-4">
                        <h1 className="text-xl font-semibold">THE PRESIDENT’S INTERNATIONAL AWARD</h1>
                        <hr className="border-t-4 border-red-700 my-2" />
                        <p className="text-xs text-gray-800">P.O.Box 34567, Bakau opposite Friendship Hotel</p>
                    </div>

                    <h1 className="text-3xl font-bold mt-4">Participant Report</h1>
                </header>

                <div className="flex justify-between text-gray-500 p-4">
                    <hr />
                    {scores.length > 0 && (
                        <div className="mt-4 p-4 rounded-lg shadow-sm w-full">
                            <div className="flex flex-col space-y-2">
                                <p className="flex justify-between"><strong>Participant ID:</strong> <span>{scores[0].student_matNo}</span></p>
                                <p className="flex justify-between"><strong>Participant Name:</strong> <span>{scores[0].student_name}</span></p>
                                <p className="flex justify-between"><strong>Training Center:</strong> <span>{scores[0].center}</span></p>
                                <p className="flex justify-between"><strong>Level of Entry:</strong> <span>{scores[0].level_of_entry}</span></p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto p-4">
                    {scores.length > 0 ? (
                        <div className="mx-auto max-w-full">
                            <table className="w-full text-left border-collapse mx-auto">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 border-b font-medium text-gray-700">Category</th>
                                        <th className="px-4 py-2 border-b font-medium text-gray-700">Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { category: 'Adventures Journey', score: scores[0].adventures_journey },
                                        { category: 'Voluntary Service', score: scores[0].voluntary_service },
                                        { category: 'Physical Recreation', score: scores[0].physical_recreation },
                                        { category: 'Skills and Interest', score: scores[0].skills_and_interest },
                                        scores[0].residential_project !== null && { category: 'Residential Project', score: scores[0].residential_project }
                                    ].filter(Boolean).map((item, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="px-4 py-2">{item.category}</td>
                                            <td className="px-4 py-2">{item.score}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-4 text-gray-500">No scores found for this student.</div>
                    )}
                </div>

                {/* Footer Section */}
                <div className="mt-4">
                    <img src={award} alt="Footer" className="w-full" />
                </div>
            </div>
        </div>
    );
};

export default StudentScore;
