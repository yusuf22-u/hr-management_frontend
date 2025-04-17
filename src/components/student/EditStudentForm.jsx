import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { FaArrowLeft } from 'react-icons/fa';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, useParams,Link } from 'react-router-dom';

const EditStudentForm = () => {
  const { id } = useParams(); // Get studentId from URL
  const [studentData, setStudentData] = useState(null);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  // Fetch the existing student data when the component mounts
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/student/getStudent/${id}`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
        setStudentData(response.data); // Set the data from the response
      } catch (error) {
        setServerError('Error fetching student data');
      }
    };
    fetchStudentData();
  }, [id]);

  // Form submission handler
  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append('student_matNo', values.student_matNo);
    formData.append('full_name', values.full_name);
    formData.append('gender', values.gender);
    formData.append('email', values.email);
    formData.append('address', values.address);
    formData.append('phone_number', values.phone_number);
    formData.append('profile_pic', values.profile_pic);
    formData.append('date_of_birth', values.date_of_birth);
    formData.append('date_of_admission', values.date_of_admission);
    formData.append('marital_status', values.marital_status);
    formData.append('parent_tel', values.parent_tel);
    formData.append('parent_name', values.parent_name);
    formData.append('parent_email', values.parent_email);
    formData.append('occupation', values.occupation);
    formData.append('level_of_entry', values.level_of_entry);
    formData.append('mode_of_entry', values.mode_of_entry);
    formData.append('health_conditions', values.health_conditions);
    formData.append('health_explanation', values.health_explanation);
    formData.append('differently_abled', values.differently_abled);
    formData.append('center', values.center);

    try {
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/v1/student/updateStudent`, formData, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Student updated successfully!');
      setServerError("");
      navigate('/dashboard/studentList'); // Redirect to the student list
    } catch (error) {
      console.error('Error updating student:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);
      } else {
        setServerError('Error updating student');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!studentData) {
    return <div>Loading...</div>; // Show loading state if student data isn't loaded yet
  }

  return (
    <div className="flex justify-center flex-col items-center min-h-screen bg-gray-100">
      <Link to={'/dashboard/studentList'} className="text-blue-600 flex items-center hover:text-blue-800">
        <FaArrowLeft className="mr-2" /> Back
      </Link>
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Edit Student</h2>
        {serverError && <div className="text-red-500 text-center mb-4">{serverError}</div>}
        
        <Formik
          initialValues={studentData}
          validationSchema={Yup.object({
            student_matNo: Yup.string().required('Matriculation number is required'),
            full_name: Yup.string().required('Full name is required'),
            gender: Yup.string().required('Gender is required'),
            email: Yup.string().email('Invalid email format').required('Email is required'),
            phone_number: Yup.string().matches(/^[0-9]+$/, "Phone number must be numeric")
              .min(7, "Phone number must be at least 7 digits")
              .max(7, "Phone number must be 7 digits").required("Phone number is required"),
            address: Yup.string().required('Address is required'),
            date_of_birth: Yup.date().required('Date of birth is required'),
            date_of_admission: Yup.date().required('Date of admission is required'),
            marital_status: Yup.string(),
            level_of_entry: Yup.string().required('Level of entry is required'),
            mode_of_entry: Yup.string().required('Mode of entry is required'),
            differently_abled: Yup.string().required('Please specify if differently abled'),
            center: Yup.string().required('Center is required'),
            parent_name: Yup.string().required('Parent/Guardian is required'),
            profile_pic: Yup.mixed().nullable().required('Profile picture is required')
              .test('fileSize', 'File size is too large', (value) => value && value.size <= 1024 * 1024 * 5)
              .test('fileType', 'Unsupported File Format', (value) => {
                const validTypes = ['image/jpg', 'image/jpeg', 'image/png'];
                return validTypes.includes(value.type);
              }),
          })}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              {/* Fields */}
              <div className="flex space-y-2 justify-between flex-col">
                <div className="flex space-x-2 justify-between w-full">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700">Matriculation Number</label>
                    <Field name="student_matNo" className="mt-1 p-2 border rounded-md w-full" />
                    <ErrorMessage name="student_matNo" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <Field name="full_name" className="mt-1 p-2 border rounded-md w-full" />
                    <ErrorMessage name="full_name" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>

                {/* Gender */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <Field as="select" name="gender" className="mt-1 p-2 border rounded-md w-full">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Field>
                  <ErrorMessage name="gender" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Email */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <Field name="email" type="email" className="mt-1 p-2 border rounded-md w-full" />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Phone Number */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <Field name="phone_number" className="mt-1 p-2 border rounded-md w-full" />
                  <ErrorMessage name="phone_number" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Address */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <Field name="address" className="mt-1 p-2 border rounded-md w-full" />
                  <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Date of Birth */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <Field type="date" name="date_of_birth" className="mt-1 p-2 border rounded-md w-full" />
                  <ErrorMessage name="date_of_birth" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Date of Admission */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Date of Admission</label>
                  <Field type="date" name="date_of_admission" className="mt-1 p-2 border rounded-md w-full" />
                  <ErrorMessage name="date_of_admission" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Marital Status */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                  <Field as="select" name="marital_status" className="mt-1 p-2 border rounded-md w-full">
                    <option value="">Select Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </Field>
                  <ErrorMessage name="marital_status" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Parent Information */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Parent/Guardian Name</label>
                  <Field name="parent_name" className="mt-1 p-2 border rounded-md w-full" />
                  <ErrorMessage name="parent_name" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Parent's Phone Number</label>
                  <Field name="parent_tel" className="mt-1 p-2 border rounded-md w-full" />
                  <ErrorMessage name="parent_tel" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Parent's Email</label>
                  <Field name="parent_email" className="mt-1 p-2 border rounded-md w-full" />
                  <ErrorMessage name="parent_email" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Occupation and Health */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Occupation</label>
                  <Field name="occupation" className="mt-1 p-2 border rounded-md w-full" />
                  <ErrorMessage name="occupation" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Health Conditions</label>
                  <Field name="health_conditions" className="mt-1 p-2 border rounded-md w-full" />
                  <ErrorMessage name="health_conditions" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Health Explanation</label>
                  <Field name="health_explanation" className="mt-1 p-2 border rounded-md w-full" />
                  <ErrorMessage name="health_explanation" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Differently Abled</label>
                  <Field as="select" name="differently_abled" className="mt-1 p-2 border rounded-md w-full">
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Field>
                  <ErrorMessage name="differently_abled" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Level of Entry */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Level of Entry</label>
                  <Field name="level_of_entry" className="mt-1 p-2 border rounded-md w-full" />
                  <ErrorMessage name="level_of_entry" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Mode of Entry */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Mode of Entry</label>
                  <Field name="mode_of_entry" className="mt-1 p-2 border rounded-md w-full" />
                  <ErrorMessage name="mode_of_entry" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Center */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Center</label>
                  <Field name="center" className="mt-1 p-2 border rounded-md w-full" />
                  <ErrorMessage name="center" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Profile Picture */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                  <input
                    type="file"
                    name="profile_pic"
                    accept="image/*"
                    onChange={(e) => setFieldValue("profile_pic", e.target.files[0])}
                    className="mt-1 p-2 border rounded-md w-full"
                  />
                  <ErrorMessage name="profile_pic" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Submit Button */}
                <div className="w-full mt-4">
                  <button
                    type="submit"
                    className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Updating..." : "Update Student"}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditStudentForm;
