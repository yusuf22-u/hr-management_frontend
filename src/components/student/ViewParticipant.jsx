import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from '../../assets/logo.jpeg'
import logo1 from '../../assets/logo1.png'

const ViewParticipant = () => {
    const [participant, setParticipant] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 1;

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/participant/viewParticipant`,{
            headers:{
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            }
        })
            .then(response =>{
                const{results}=response.data;
                setParticipant(results)
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    // Function to calculate age based on date of birth
    const calculateAge = (dateOfBirth) => {
        const dob = new Date(dateOfBirth);
        const currentDate = new Date();
        let age = currentDate.getFullYear() - dob.getFullYear();

        // Adjust age if the birthday hasn't occurred this year yet
        const isBirthdayPassedThisYear = (
            currentDate.getMonth() > dob.getMonth() ||
            (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() >= dob.getDate())
        );

        if (!isBirthdayPassedThisYear) {
            age--;
        }
        return age;
    };

    const handlePrint = (index) => {
        const content = document.getElementById(`evaluation-${index}`).innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Evaluation</title>
                    <link rel="stylesheet" href="../src/index.css">
                </head>
                <body>
                    <div class="evaluation-card">
                        ${content}
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentEvaluations = participant.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="main max-w-2xl mx-auto p-6 bg-gray-100">
            <h1 className="text-3xl font-bold text-center mb-8">Participant Report</h1>
            {currentEvaluations.map((evals, index) => (
                <div
                    key={index}
                    id={`evaluation-${startIndex + index}`}
                    className="evaluation-card bg-white p-10 mb-10 rounded-lg shadow-lg relative"
                >
                    <div className="absolute top-0 right-0 p-4 print-button">
                        <button
                            onClick={() => handlePrint(startIndex + index)}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Print
                        </button>
                    </div>
                    <div className="header flex justify-between items-center space-x-2">
                        <img className='w-32 headerlogo  border-none' src={logo} alt="log" />
                        <img className='w-16 border-none ' src={logo1} alt="log" />
                    </div>
                    <div className="text-header pb-4">
                        <h1 className='text-center'>𝔓𝔯𝔢𝔰𝔦𝔡𝔢𝔫𝔱 ℑ𝔫𝔱𝔢𝔯𝔫𝔞𝔱𝔦𝔬𝔫𝔞𝔩 𝔞𝔴𝔞𝔯𝔡</h1>
                        <p className='text-center text-xs text-gray-800 '>P.O.Box 34567, Bakau opposite friendship hotel</p>
                    </div>
                    <hr className='px-3' />
                    <div className="profile flex items-center mb-6 space-x-8">
                        <img
                            src={`${process.env.REACT_APP_BACKEND_URL}/uploads/student/${evals.profile_pic}`}
                            alt={evals.full_name}
                            className="w-32 h-32 object-cover mt-4 rounded-full border-4 border-gray-100 mr-6"
                        />
                        <p className='capitalize text-blue-900'> {evals.full_name}</p>
                        <p className='capitalize'>Gender:<br /> {evals.gender}</p>
                        <p className='capitalize'>
                            Age: {' '}
                            {
                                (() => {
                                    const birthDate = new Date(evals.date_of_birth);
                                    const currentDate = new Date();
                                    const age = currentDate.getFullYear() - birthDate.getFullYear();
                                    const isFutureDate = birthDate > currentDate;

                                    if (isFutureDate) {
                                        return "Invalid Date"; // Handle future dates
                                    }

                                    return age >= 0 ? age : 0; // Ensures no negative age
                                })()
                            }
                            <span className='px-2'>year</span></p>
                    </div>
                    <hr />
                    <div className="flex flex-col pb-8">
                        <div className="middle bg-gray-50 flex justify-between space-x-3">
                            <p>Completion Date:<br /> {new Date(evals.expected_completion_date).toISOString().split('T')[0]}</p>
                            <p>Participant Date:<br /> {new Date(evals.participation_date).toISOString().split('T')[0]}</p>
                            <p className='capitalize'>Conditor:<br /> {evals.condinator}</p>
                        </div>
                        <hr />
                    </div>
                    <div className="middle flex justify-between space-x-3">
                        <p className='w-full flex items-center space-x-3 px-3'>
                           <span className='px-3'> Level:</span> {' '}
                            <span
                                className={`w-12 h-12 px-8 rounded-full flex items-center justify-center text-white font-bold`}
                                style={{
                                    backgroundColor:
                                        evals.level === 'gold' ? '#FFD700' :
                                            evals.level === 'silver' ? '#C0C0C0' :
                                                evals.level === 'bronze' ? '#CD7F32' : '#E5E7EB' // Default: gray
                                }}
                            >
                                {evals.level.charAt(0).toUpperCase() + evals.level.slice(1)}
                            </span>
                        </p>

                        <div className="w-full bg-gray-200 rounded-full h-6 mb-4">
                            <div
                                className={`bg-blue-500 h-6 rounded-full`}
                                style={{ width: `${evals.score}%` }}
                            >
                                <span className="text-white text-sm font-medium pl-2">{evals.score}%</span>
                            </div>
                            <p className='text-gray-600 italic ml-2'>score {evals.score}%</p>
                        </div>

                    </div>
                    <footer className=' bg-gray-100 py-4 mt-3 px-6 rounded-b-lg'>
                        <p className='text-gray-600 text-lg font-semibold capitalize mb-2'>
                            {evals.full_name} has successfully completed the <span className='font-bold'>{evals.level}</span> level
                        </p>
                        <p className='text-gray-600 text-sm'>
                            The participant has shown excellent performance over the past 2 years. We wish them continued success in future endeavors.
                        </p>
                        <div className="signature mt-4 flex justify-between items-center">
                            <p className='text-sm text-gray-600 e italic'>Certified by: <span className='font-bold not-italic'>{evals.condinator}</span></p>
                            <p className='text-sm text-blue-900 italic'>Date: {new Date(evals.participation_date).toISOString().split('T')[0]}</p>
                        </div>
                    </footer>


                </div>
            ))}

            <div className="flex justify-between items-center mt-8">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <p className="text-gray-700">Page {currentPage} of {Math.ceil(participant.length / itemsPerPage)}</p>
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === Math.ceil(participant.length / itemsPerPage)}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ViewParticipant;
