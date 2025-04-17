import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaSchool, FaPhone, FaMapMarkerAlt, FaEnvelope, FaMap } from 'react-icons/fa';
import { useNavigate, useParams } from "react-router-dom";

const EditParticipant = () => {
    const [participant, setParticipant] = useState([]);
    const [error, setErrors] = useState('')
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/v1/center/edit/${id}`, {
                    headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
                });
                setParticipant(res.data);
            } catch (error) {
                console.log("Database error:", error);
            }
        };
        fetchData();
    }, [id]);

    const formik = useFormik({
        initialValues: {
            studentId: "",
            school: "",
            address: "",
            email: "",
            telephone: "",
            region: "",
            coordinator: "",
            area: ""
        },
        validationSchema: Yup.object({
            studentId: Yup.string()
                .matches(/^[0-9]+$/, 'Student ID must be a number')
                .required("Student ID is required")
                .min(8, "Must be exactly 8 digits")
                .max(8, "Must be exactly 8 digits"),
            telephone: Yup.string()
                .matches(/^[0-9]+$/, "Phone number must be numeric")
                .min(7, "Phone number must be exactly 7 digits")
                .max(7, "Phone number must be exactly 7 digits")
                .required("Phone number is required"),
            school: Yup.string().required("School name is required"),
            address: Yup.string().required("Address is required"),
            email: Yup.string().email('Invalid email format').required('Email is required'),
            region: Yup.string().required("Region is required"),
            coordinator: Yup.string().required("Coordinator name is required").min(3, "Name must be at least 3 letters"),
            area: Yup.string().required("Area is required"),
        }),
        onSubmit: async (values) => {
            try {
                const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/v1/center/update/${id}`, values, {
                    headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
                });
                toast.success(res.data.message);
                setErrors('')

                // Wait for 2 seconds before navigating
                setTimeout(() => {
                    navigate(-1);
                }, 2000);
            } catch (error) {
                console.log("Update Error:", error);
                setErrors(error.response.data.error)
                toast.error("Failed to update participant.");
            }
        },
    });
    useEffect(() => {
        if (participant) {
            formik.setValues({
                studentId: participant.studentId || "",
                school: participant.school || "",
                address: participant.address || "",
                email: participant.email || "",
                telephone: participant.telephone || "",
                region: participant.region || "Region One",  
                coordinator: participant.coordinator || "",
                area: participant.area || ""
            });
        }
    }, [participant]);
    

    return (
        <>
            <button className='bg-blue-900 text-white p-2' onClick={() => navigate(-1)}>Back</button>
            <div className='w-full flex justify-center p-4'>
                <form onSubmit={formik.handleSubmit} className="w-full max-w-2xl bg-white shadow-lg p-6 rounded-lg space-y-4">
                    <h1 className="text-2xl text-center font-semibold">Edit Registration Form</h1>
                    <h4 className="text-red-500 text-center justify-center ml-8 pt-2">{error}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="studentId" className="text-gray-600 flex items-center gap-2"><FaUser /> Student ID</label>
                            <input className="w-full border rounded-md p-2" type="text" name="studentId" value={formik.values.studentId} onChange={formik.handleChange} />
                            {formik.errors.studentId && <p className='text-red-500 text-sm'>{formik.errors.studentId}</p>}
                        </div>
                        <div>
                            <label htmlFor="school" className="text-gray-600 flex items-center gap-2"><FaSchool /> School Name</label>
                            <input className="w-full border rounded-md p-2" type="text" name="school" value={formik.values.school} onChange={formik.handleChange} />
                            {formik.errors.school && <p className='text-red-500 text-sm'>{formik.errors.school}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="email" className="text-gray-600 flex items-center gap-2"><FaEnvelope /> Email</label>
                            <input className="w-full border rounded-md p-2" type="email" name="email" value={formik.values.email} onChange={formik.handleChange} />
                            {formik.errors.email && <p className='text-red-500 text-sm'>{formik.errors.email}</p>}
                        </div>
                        <div>
                            <label htmlFor="address" className="text-gray-600 flex items-center gap-2"><FaMapMarkerAlt /> Address</label>
                            <input className="w-full border rounded-md p-2" type="text" name="address" value={formik.values.address} onChange={formik.handleChange} />
                            {formik.errors.address && <p className='text-red-500 text-sm'>{formik.errors.address}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="coordinator" className="text-gray-600 flex items-center gap-2"><FaUser /> Teacher Coordinator</label>
                            <input className="w-full border rounded-md p-2" type="text" name="coordinator" value={formik.values.coordinator} onChange={formik.handleChange} />
                            {formik.errors.coordinator && <p className='text-red-500 text-sm'>{formik.errors.coordinator}</p>}
                        </div>
                        <div>
                            <label htmlFor="telephone" className="text-gray-600 flex items-center gap-2"><FaPhone /> Telephone</label>
                            <input className="w-full border rounded-md p-2" type="text" name="telephone" value={formik.values.telephone} onChange={formik.handleChange} />
                            {formik.errors.telephone && <p className='text-red-500 text-sm'>{formik.errors.telephone}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 w-full">
    <select 
        className="border border-gray-700 w-full p-2 rounded bg-white" 
        name="region" 
        value={formik.values.region}  
        onChange={formik.handleChange}
    >
        <option value="Region One">Region One</option>
        <option value="Region Two">Region Two</option>
        <option value="Region Three">Region Three</option>
        <option value="Region Four">Region Four</option>
    </select>
    {formik.errors.region && <p className='text-red-500 text-sm'>{formik.errors.region}</p>}
</div>

                        <div>
                            <label htmlFor="area" className="text-gray-600 flex items-center gap-2"><FaMap /> Area</label>
                            <input className="w-full border rounded-md p-2" type="text" name="area" value={formik.values.area} onChange={formik.handleChange} />
                            {formik.errors.area && <p className='text-red-500 text-sm'>{formik.errors.area}</p>}
                        </div>
                    </div>

                    <button type='submit' className='w-full p-2 bg-green-700 text-white rounded-md hover:bg-green-800'>Update</button>
                </form>
                <ToastContainer position="top-center" autoClose={3000} />
            </div>
        </>
    );
};

export default EditParticipant;
