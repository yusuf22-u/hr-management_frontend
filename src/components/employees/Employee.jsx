import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const EmployeeForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState({}); // For handling server errors
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues: {
      employee_id: '',
      full_name: '',
      email: '',
      address: '',
      phone_number: '',
      profile_pic: null,
      position: '',
      date_of_birth: '',
      date_of_admission: '',
      department: '' // Add department field
    },
    validationSchema: Yup.object({
      employee_id: Yup.string().required('Employee ID is required'),
      full_name: Yup.string().required('Full Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      address: Yup.string().required('Address is required'),
      phone_number: Yup.string().required('Phone Number is required'),
      position: Yup.string().required('Position is required'),
      date_of_birth: Yup.date().required('Date of Birth is required'),
      date_of_admission: Yup.date().required('Date of Admission is required'),
      department: Yup.string().required('Department is required')
    }),
    onSubmit: (values, { resetForm }) => {
      setIsLoading(true);
      setServerErrors({}); // Reset errors
      const formData = new FormData();
      for (let key in values) {
        formData.append(key, values[key]);
      }
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/v1/employees/createEmployee`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => {
          console.log(response.data)
          if (response.data) {
            navigate('/dashboard/employee/List')
          }
        })
        .catch(error => {
          if (error.response && error.response.data) {
            setServerErrors(error.response.data); // Handle server errors
          } else {
            console.error('There was an error!', error);
          }
        })
        .finally(() => {
          setIsLoading(false);
          resetForm(); // Reset form after submission
        });
    }
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl mx-auto">
      <div className="flex justify-between items-center space-x-2">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Add Employee</h2>
      <Link to='/dashboard/employee/List' className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow-md hover:bg-gray-400 transition-all">Back</Link>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">

        {/* Employee ID */}
        <div className="flex justify-between space-x-3">
          <div className='w-1/2'>
            <label className="block text-gray-700">Employee ID</label>
            <input
              type="text"
              name="employee_id"
              value={formik.values.employee_id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 p-2 border border-gray-300 rounded-lg  w-full"
            />
            {formik.touched.employee_id && formik.errors.employee_id && (
              <div className="text-red-600 text-sm">{formik.errors.employee_id}</div>
            )}
            {serverErrors.employee_id && (
              <div className="text-red-600 text-sm">{serverErrors.employee_id}</div>
            )}
          </div>

          <div className='w-1/2'>
            <label className="block text-gray-700 ">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formik.values.full_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 p-2 border border-gray-300  rounded-lg w-full"
            />
            {formik.touched.full_name && formik.errors.full_name && (
              <div className="text-red-600 text-sm">{formik.errors.full_name}</div>
            )}
          </div>

        </div>



        {/* Email */}
        <div className="flex justify-between space-x-3">
          <div className="w-1/2">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-600 text-sm">{formik.errors.email}</div>
            )}
            {serverErrors.email && (
              <div className="text-red-600 text-sm">{serverErrors.email}</div>
            )}
          </div>

          {/* Department */}
          <div className="w-1/2">
            <label className="block text-gray-700">Department</label>
            <input
              type="text"
              name="department"
              value={formik.values.department}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
            {formik.touched.department && formik.errors.department && (
              <div className="text-red-600 text-sm">{formik.errors.department}</div>
            )}
          </div>
        </div>
        {/* Address */}
        <div className="flex justify-between space-x-3">
          <div className="w-1/2">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
            {formik.touched.address && formik.errors.address && (
              <div className="text-red-600 text-sm">{formik.errors.address}</div>
            )}
          </div>

          {/* Phone Number */}
          <div className="w-1/2">
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phone_number"
              value={formik.values.phone_number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
            {formik.touched.phone_number && formik.errors.phone_number && (
              <div className="text-red-600 text-sm">{formik.errors.phone_number}</div>
            )}
          </div>
        </div>
        {/* Position */}
        <div className="flex justify-between space-x-3">
          <div className="w-1/2">
            <label className="block text-gray-700">Position</label>
            <input
              type="text"
              name="position"
              value={formik.values.position}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
            {formik.touched.position && formik.errors.position && (
              <div className="text-red-600 text-sm">{formik.errors.position}</div>
            )}
          </div>

          {/* Date of Birth */}
          <div className="w-1/2">
            <label className="block text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={formik.values.date_of_birth}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
            {formik.touched.date_of_birth && formik.errors.date_of_birth && (
              <div className="text-red-600 text-sm">{formik.errors.date_of_birth}</div>
            )}
          </div>
        </div>
        {/* Date of Admission */}
        <div className="flex justify-between space-x-3">
          <div className="w-1/2">
            <label className="block text-gray-700">Date of Admission</label>
            <input
              type="date"
              name="date_of_admission"
              value={formik.values.date_of_admission}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
            {formik.touched.date_of_admission && formik.errors.date_of_admission && (
              <div className="text-red-600 text-sm">{formik.errors.date_of_admission}</div>
            )}
          </div>

          {/* Profile Picture */}
          <div className="w-1/2">
            <label className="block text-gray-700">Profile Picture</label>
            <input
              type="file"
              name="profile_pic"
              onChange={(event) => formik.setFieldValue('profile_pic', event.currentTarget.files[0])}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded-lg ${isLoading ? 'cursor-not-allowed opacity-50' : 'hover:bg-indigo-700'}`}
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add Employee'}
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;
