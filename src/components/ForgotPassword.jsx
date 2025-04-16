import React from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export const ForgotPassword = () => {
    // Validation schema with Yup
    const validationSchema = Yup.object({

        email: Yup.string()
            .required('Email is required')
            .email('Invalid email address'),
    });
    const navigate = useNavigate();
    const [serverError, setServerError] = React.useState('');

    const formik = useFormik({
        initialValues: {

            email: '',

        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const res = await axios.post('http://localhost:4000/v1/forgotPassword', values);
                console.log(res);
                navigate('/login'); // Or any other route you want to redirect to
            } catch (err) {
                setServerError(err.response ? err.response.data.error : 'An unexpected error occurred');
                console.error(err.response ? err.response.data : err.message);
            }
        },
    });

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md lg:max-w-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Reset your password</h2>
            <form onSubmit={formik.handleSubmit}>
                {serverError && <div className="text-red-600 text-center mb-4">{serverError}</div>}

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <div className="text-red-600 text-sm">{formik.errors.email}</div>
                    ) : null}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300 focus:outline-none"
                >
                    Send
                </button>


            </form>
        </div>
        </div>
    )
}
