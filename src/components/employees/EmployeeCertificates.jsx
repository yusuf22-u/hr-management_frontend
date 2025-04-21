import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { AiFillEdit, AiFillDelete, AiOutlineArrowLeft, AiOutlineEye } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';

const EmployeeCertificates = () => {
    const [employee, setEmployee] = useState(null);
    const { id } = useParams();  // Get the employeeId from the URL

    useEffect(() => {
        // Fetch employee details and certificates
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/certificates/view/${id}`,{
            headers: {
               
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            },
        })
            .then((res) => setEmployee(res.data))
            .catch((err) => console.error("Error fetching employee details:", err));
    }, [id]);
    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/v1/certificates/deleteCertificate/${id}`,{
                headers: {
               
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                },
            });
            toast.success(res.data.message);

            // Update employee state by removing the deleted certificate
            setEmployee((prevEmployee) => ({
                ...prevEmployee,
                certificates: prevEmployee.certificates.filter(cert => cert.id !== id)
            }));
        } catch (error) {
            toast.warning('Error deleting certificate', error.response?.data?.message || 'Something went wrong');
        }
    };


    return (
        <div className="p-6 bg-white shadow-lg rounded-xl">
            <Link
                to="/dashboard/employee/List"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 flex items-center gap-2"
            >
                <AiOutlineArrowLeft className="w-5 h-5" /> Back
            </Link>


            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center capitalize">Employee portfolio</h2>

            {employee ? (
                <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
                    {/* Employee Details Section */}
                    <div className="w-full max-w-xs  mt-0 top-0 md:max-w-md bg-gray-50 p-24 rounded-xl shadow-lg flex flex-col space-y-2 items-center">
                        <img
                            src={`${employee.profile_pic}`}
                            alt="Employee Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 mb-4"
                        />
                        <h3 className="text-2xl font-semibold capitalize text-gray-800">{employee.full_name}</h3>
                        <p className="text-lg text-blue-600 capitalize">{employee.position}</p>
                        <p className="text-sm text-gray-500 mt-2">Date of Admission: {new Date(employee.date_of_admission).toLocaleDateString()}</p>
                    </div>

                    {/* Certificates Section */}
                    <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {employee.certificates.length > 0 ? (
                            employee.certificates.map((cert) => (
                                <div key={cert.id} className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                                    {/* delete */}
                                    <button onClick={() => handleDelete(cert.id)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded flex items-center transition">
                                        <AiFillDelete className="w-5 h-5" />
                                    </button>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4">{cert.certificate_name}</h4>
                                    <div className="relative">
                                        <img
                                            src={`${cert.certificate_file}`}
                                            alt={cert.certificate_name}
                                            className="w-full h-48 object-cover rounded-md shadow-md"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200">
                                            <a
                                                href={`${cert.certificate_file}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-white bg-blue-500 px-5 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
                                                View / Download
                                            </a>
                                        </div>
                                    </div>

                                </div>

                            ))
                        ) : (
                            <p className="text-center text-gray-500 col-span-2">No certificates uploaded yet.</p>
                        )}
                    </div>

                </div>
            ) : (
                <p className="text-center text-gray-500">Loading employee details...</p>
            )}
            <ToastContainer
                position="top-center"
                className={'text-center'} />
        </div>

    );
};

export default EmployeeCertificates;
