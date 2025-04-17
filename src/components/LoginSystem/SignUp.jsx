import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

// Validation schema with Yup
const validationSchema = Yup.object({
  employee_id: Yup.number()
    .required('Employee ID is required')
    .positive('Employee ID must be a positive number')
    .integer('Employee ID must be an integer'),
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters long'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email address'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters long'),
  profile: Yup.mixed().test(
    'fileType',
    'Only JPG, JPEG, and PNG files are allowed',
    (value) => {
      if (!value) return true; // Allow empty value (default image logic)
      return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
    }
  ).required(null),
});

function SignUp() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const formik = useFormik({
    initialValues: {
      employee_id: '',
      username: '',
      email: '',
      password: '',
      profile: null, // Profile will be stored here
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('employee_id', values.employee_id);
      formData.append('username', values.username);
      formData.append('email', values.email);
      formData.append('password', values.password);
      
      // Append profile only if uploaded, otherwise use default
      if (selectedFile) {
        formData.append('profile', selectedFile);
      } else {
        formData.append('profile', 'default-profile.png'); // Default profile image
      }

      try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/v1/signUp`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log(res);
        navigate('/login');
      } catch (err) {
        setServerError(err.response ? err.response.data.error : 'An unexpected error occurred');
        console.error(err.response ? err.response.data : err.message);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Create an Account</h2>

        {serverError && <div className="text-red-600 text-center mb-4">{serverError}</div>}

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div className="flex justify-between w-full space-x-2 items-center">
          {/* Employee ID */}
          <div className="w-1/2">
            <label className="block text-gray-700 font-semibold mb-1">Employee ID</label>
            <input
              type="number"
              name="employee_id"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.employee_id}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your employee ID"
            />
            {formik.touched.employee_id && formik.errors.employee_id && (
              <div className="text-red-600 text-sm">{formik.errors.employee_id}</div>
            )}
          </div>

          {/* Username */}
          <div className="w-1/2">
            <label className="block text-gray-700 font-semibold mb-1">Username</label>
            <input
              type="text"
              name="username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
            {formik.touched.username && formik.errors.username && (
              <div className="text-red-600 text-sm">{formik.errors.username}</div>
            )}
          </div>
          </div>
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-600 text-sm">{formik.errors.email}</div>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-600 text-sm">{formik.errors.password}</div>
            )}
          </div>

          {/* Profile Picture Upload */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Profile Picture</label>
            <input
              type="file"
              name="profile"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(event) => {
                setSelectedFile(event.currentTarget.files[0]);
                formik.setFieldValue('profile', event.currentTarget.files[0]);
              }}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched.profile && formik.errors.profile && (
              <div className="text-red-600 text-sm">{formik.errors.profile}</div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Sign Up
          </button>

          <p className="text-center text-gray-600 mt-3">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
