import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';

const EditEmployee = () => {
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/employees/getSingleEmployee/${id}`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
      }
    }).then(res => {
      const { employee_id, full_name, email, address, phone_number, position, department, date_of_birth, date_of_admission, profile_pic } = res.data;
      // Format dates to YYYY-MM-DD
      const formattedDateOfBirth = new Date(date_of_birth).toISOString().substring(0, 10);
      const formattedDateOfAdmission = new Date(date_of_admission).toISOString().substring(0, 10);
      setEmployee({
        employee_id,
        full_name,
        email,
        address,
        position,
        department,
        phone_number,
        date_of_birth: formattedDateOfBirth,
        date_of_admission: formattedDateOfAdmission,
        profile_pic,
      });
      console.log('employ',employee)
    }).catch(err => {
      console.error("error fetching employee data: ", err);
    });
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      employee_id: employee?.employee_id || '',
      full_name: employee?.full_name || '',
      position: employee?.position || '',
      department: employee?.department || '',
      email: employee?.email || '',
      address: employee?.address || '',
      phone_number: employee?.phone_number || '',
      date_of_birth: employee?.date_of_birth || '',
      date_of_admission: employee?.date_of_admission || '',
      profile_pic: null,
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
      department: Yup.string().required('Department is required'),
      profile_pic: Yup.mixed().required(null)
        .test('fileSize', 'File too large. Maximum size is 5MB.', value => !value || (value.size <= 5 * 1024 * 1024))
        .test('fileFormat', 'Only jpg, jpeg, and png files are allowed', value => !value || ['image/jpeg', 'image/png', 'image/jpg'].includes(value?.type)),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      setIsLoading(true);
      setServerErrors({});
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (key === 'profile_pic' && values.profile_pic) {
          formData.append(key, values.profile_pic);
        } else {
          formData.append(key, values[key]);
        }
      });
      try {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/v1/employees/updateEmployee/${id}`, formData, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        navigate('/dashboard/employee/List');
      } catch (error) {
        if (error.response && error.response.data.error) {
          setServerErrors({ ...serverErrors, ...error.response.data.errors });
        } else {
          console.error('An unexpected error occurred:', error);
        }
      } finally {
        setSubmitting(false);
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl mx-auto">
      <div className="flex justify-between items-center space-x-2">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Update Employee</h2>
        <Link to='/dashboard/employee/List' className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow-md hover:bg-gray-400 transition-all">Back</Link>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Employee ID */}
        <div className="flex justify-between space-x-3">
          

          <div className='w-1/2'>
            <label className="block text-gray-700 ">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formik.values.full_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
            {formik.touched.full_name && formik.errors.full_name && (
              <div className="text-red-600 text-sm">{formik.errors.full_name}</div>
            )}
          </div>
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
        </div>

        {/* Date of Admission */}
        <div className="flex justify-between space-x-3">
         
          <div className="w-1/2">
            <label className="block text-gray-700">Profile Picture</label>
            <input
              type="file"
              name="profile_pic"
              onChange={(event) => formik.setFieldValue('profile_pic', event.currentTarget.files[0])}
              className="mt-1"
            />
            {formik.touched.profile_pic && formik.errors.profile_pic && (
              <div className="text-red-600 text-sm">{formik.errors.profile_pic}</div>
            )}
          </div>
        </div>

        

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-all"
        >
          {isLoading ? 'Updating...' : 'Update Employee'}
        </button>
      </form>
    </div>
  );
};

export default EditEmployee;
