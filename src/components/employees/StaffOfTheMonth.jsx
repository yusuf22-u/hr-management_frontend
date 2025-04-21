import axios from "axios";
import { useRef, useState, useEffect } from "react";
// import logo from '../../assets/logo.jpeg'
import logo1 from '../../assets/logo.png'

const EmployeeCertificate = () => {
    const [staff, setStaff] = useState();
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/evaluations/staffOfTheMonth`,{
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            }
        })
            .then(response => setStaff(response.data))
            .catch(error => console.error("Error fetching staff of the month:", error));
    }, []);

    const certificateRef = useRef();

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
                            body {
                                font-family: Arial, sans-serif;
                                margin: 0;
                                padding: 0;
                                color: #333;
                                height: 100%;
                            }
                            .print-container {
                                width: 100%;
                                height: auto;
                                padding: 30px;
                                box-sizing: border-box;
                                
                                
                            }
                            .certificate {
                                width: 100%; /* Scale to 80% of the A4 size */
                                max-width: 3480px;
                                height: auto;
                                background-color: white;
                                border: 8px solid #007bff;
                                padding: 40px;
                                box-sizing: border-box;
                                text-align: center;
                                position: relative;
                            }
                            .certificate img {
                                width: 150px; /* Increase size of logos */
                                height: 150px;
                                margin-bottom: 20px;
                            }
                            .certificate h1, .certificate h2, .certificate p {
                                margin: 15px 0;
                            }
                            .certificate h1 {
                                font-size: 40px; /* Larger font for title */
                                color: #007bff;
                            }
                            .certificate h2 {
                                font-size: 32px; /* Adjust employee name size */
                                color: #003366;
                            }
                            .certificate p {
                                font-size: 20px; /* Increase body text size */
                                color: #333;
                            }
                            .certificate .signature {
                                margin-top: 50px;
                            }
                            .certificate .date {
                                margin-top: 10px;
                            }
                            button{
                                display:none;
                                }
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

    return (
        <div id="print-content" className="flex flex-col items-center justify-center bg-gray-100 p-4">
            {/* Certificate Design */}
            <div ref={certificateRef} className="certificate bg-white border-8 border-dash-blue border-blue-500 shadow-lg rounded-lg p-6 sm:p-8 relative print:certificate">
                {/* Certificate Header */}
                <div className="flex justify-between mb-6">
                    <img className='w-16 headerlogo rounded-full sm:w-20' src={logo1} alt="Logo" />
                    <img className='w-16 headerlogo rounded-full sm:w-20' src={logo1} alt="Logo" />
                </div>

                <div className="text-center mb-6">
                    <h1 className="text-3xl sm:text-4xl font-bold text-blue-500">Certificate of Excellence</h1>
                    <p className="text-gray-700 italic mt-2">Presented to</p>
                </div>

                {/* Employee Name */}
                <div className="mt-6 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold uppercase text-blue-800">{staff?.full_name}</h2>
                    <p className="text-lg text-gray-600 mt-2">{staff?.position}</p>
                </div>

                {/* Certificate Body */}
                <div className="mt-6 text-center text-gray-700">
                    <p className="text-lg sm:text-xl">
                        In recognition of outstanding performance and dedication, <br />
                        {staff?.full_name} is hereby awarded <strong>Employee of the Month</strong> <br />
                        for exceptional contributions to the organization.
                    </p>
                </div>

                {/* Employee Image */}
                <div className="flex justify-center mt-8 mb-6">
                    <img
                        src={`${staff?.profile_pic}`}
                        alt="Employee"
                        className="w-32 sm:w-40 h-32 sm:h-40 rounded-full border-4 border-yellow-500 shadow-md"
                    />
                </div>

                {/* Date & Signature */}
                <div className="mt-4 flex justify-between px-4 sm:px-8 text-gray-700 text-sm signature">
                    <p>Date: {new Date().toLocaleDateString()}</p>
                    <p className="text-right">________________________ <br /> Authorized Signature</p>
                </div>
            </div>

            {/* Print Button */}
            <button
                onClick={handlePrint}
                className="mt-6 px-6 py-2  bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 print:hidden"
            >
                Print Certificate
            </button>
        </div>
    );
};

export default EmployeeCertificate;
