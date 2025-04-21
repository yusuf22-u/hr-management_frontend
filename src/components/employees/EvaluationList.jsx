import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import logo from '../../assets/logo.jpeg'
import logo1 from '../../assets/logo.png'
import WorkRateDetails from '../WorkRateDetails';
import { Link, useParams } from 'react-router-dom';

const EvaluationReport = () => {
    const [evaluations, setEvaluations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 1;
    const { id } = useParams()

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/evaluations/${id}`, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            }
        })
            .then(response => {
                // const sortedEval=response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setEvaluations(response.data)
                console.log('ff', evaluations)
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handlePrint = (index) => {
        const content = document.getElementById(`content`).innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
               <head>
                <title>Print Evaluation</title>
                <link rel="stylesheet" href="../src/index.css">
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
                
            </head>
                <body>
                <style>
                .text-header{
                    text-align:center;
                    margin:20px;
                    margin-Top:-20px;
                }
                .header{
                    display:flex;
                    justify-content:space-between;
                    gap:10px;
                    padding:10px;
                
                }
                    .header img{
                    width:9rem;
                    }
                    .header .headerlogo{
                        width:200px;
                    }
                    .profile{
                       display:flex;
                        justify-content:space-between;
                        gap:6px;
                         padding:2px 20px;
                         align-item:center;

                
                    }
                        body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                       
                    }
                    .evaluation-card {
                        background-color: white;
                        padding: 5px;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        width: 100%;
                        max-width: 800px;
                        margin: auto;
                    }
                    
                    .evaluation-card h2 {
                        font-size: 24px;
                        color: #1E90FF;
                    }
                    .evaluation-card p {
                        color: #555;
                        font-size: 18px;
                    }
                    .grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 10px;
                    }
                    
                    .main{
                        max-width:1024px;
                        }
                    .middle {
                        display:flex;
                        justify-content:space-between;
                        padding:2px 20px;
                        

                    }
                        
                        .score h1{
                        text-align:center;
                        }
                       
                        
                       
                       button{
                       display:none} 
                    
                </style>
                    <div class="evaluation-card">
                         ${content}
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };


    return (
        <div className="main evaluation-card max-w-3xl mx-auto mt-[-20px] p-6 bg-gray-100">
            <div className="flex justify-between space-x-2">
                <h1 className="text-3xl font-bold text-center mb-4">Staff Evaluation Report</h1>
                <Link
                    className="print:hidden inline-flex items-center gap-2 px-2 py-1 m-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition duration-300 ease-in-out"
                    to="/dashboard/employee/evaluation_list"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Back
                </Link>

            </div>

            {evaluations.map((evals, index) => (
                <div
                    key={index}
                    id='content'
                    className="evaluation-card bg-white p-10 mb-10 rounded-lg shadow-lg relative"

                >
                    <div className="absolute top-0 right-0 p-4 print-button">
                        <button
                            onClick={() => handlePrint()}
                            className="bg-blue-500 print:hidden text-white px-4 py-2 rounded"
                        >
                            Print
                        </button>
                    </div>
                    <div className="header flex justify-between items-center space-x-2">
                        <img className='w-16 headerlogo rounded-full  border-none' src={logo1} alt="log" />
                        <img className='w-16 border-none rounded-full ' src={logo1} alt="log" />
                    </div>
                    <div className="text-header pb-4">
                        <h1 className='text-center'>𝔓𝔯𝔢𝔰𝔦𝔡𝔢𝔫𝔱 ℑ𝔫𝔱𝔢𝔯𝔫𝔞𝔱𝔦𝔬𝔫𝔞𝔩 𝔞𝔴𝔞𝔯𝔡</h1>
                        <p className='text-center text-xs text-gray-800 '>P.O.Box 34567, Bakau opposite friendship hotel</p>
                    </div>
                    <hr className='px-3' />
                    <div className="profile flex items-center mb-6 space-x-8">
                        <img
                            src={`${evals.profile_pic}`}
                            alt={evals.full_name}
                            className="w-32 h-32 object-cover mt-4 rounded-full border-4 border-gray-100 mr-6"
                        />
                        <div>
                            <h2 className="text-2xl font-semibold text-blue-900 capitalize">{evals.full_name}</h2>
                            <p className="text-gray-700 capitalize">{evals.position}</p>
                        </div>
                        <p>Date of Birth:<br /> {new Date(evals.date_of_birth).toISOString().split('T')[0]}</p>
                        <p> <span className='text-gray-900 font-semibold'>Department:</span><br />{evals.department}</p>
                    </div>
                    <hr />
                    <div className="flex flex-col  pb-8 ">
                        <div className="middle  bg-gray-50 flex justify-between space-x-3 ">

                            <p>Date of Admission:<br /> {new Date(evals.date_of_admission).toISOString().split('T')[0]}</p>
                            <p>Evaluation Date:<br /> {new Date(evals.evaluation_date).toISOString().split('T')[0]}</p>
                            <p>Evaluator:<br /> {evals.evaluator_name}</p>
                        </div>
                        <hr />
                        {/* score detail */}
                        <WorkRateDetails evals={evals} />
                        {/* score detail end */}

                    </div>
                </div>
            ))}


        </div>
    );
};

export default EvaluationReport;
