import React,{useState} from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { FaEye, FaEdit, FaTrash, FaArrowLeft, FaPlus } from 'react-icons/fa';
import * as Yup from 'yup';
import axios from 'axios';
import { Link } from 'react-router-dom';


const StudentForm = () => {
  const [showHealthExplanation, setShowHealthExplanation] = useState(false);
  const [serverError, setServerError] = useState("");
  const initialValues = {
    student_matNo: '',
    full_name: '',
    gender: '',
    email: '',
    phone_number: '',
    address: '',
    date_of_birth: '',
    date_of_admission: '',
    marital_status: 'Single',
    parent_tel: '',
    parent_name: '',
    parent_email: '',
    occupation: '',
    level_of_entry: '',
    mode_of_entry: '',
    health_conditions: '',
    health_explanation: '',
    differently_abled: '',
    center: '',
    profile_pic: null,
  };

  const validationSchema = Yup.object({
    student_matNo: Yup.string().required('Matriculation number is required'),
    full_name: Yup.string().required('Full name is required'),
    gender: Yup.string().required('Gender is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phone_number: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must be numeric")
    .min(7, "Phone number must be at least 7 digits")
    .max(7,"Phone number must  7 digits")
    .required("Phone number is required"),
    address: Yup.string().required('Address is required'),
    date_of_birth: Yup.date().required('Date of birth is required'),
    date_of_admission: Yup.date().required('Date of admission is required'),
    marital_status: Yup.string(),
    level_of_entry: Yup.string().required('Level of entry is required'),
    mode_of_entry: Yup.string().required('Mode of entry is required'),
    differently_abled: Yup.string().required('Please specify if differently abled'),
    center: Yup.string().required('Center is required'),
    parent_name: Yup.string().required('Parent/Guardian is required'),
    profile_pic: Yup.mixed()
      .nullable()
      .required('Profile picture is required')
      .test('fileSize', 'File size is too large', (value) => {
        if (value && value.size) {
          return value.size <= 1024 * 1024 * 5; // 5MB
        }
        return true; // if no file, return true (it will be handled by required)
      })
      .test('fileType', 'Unsupported File Format', (value) => {
        if (value) {
          const validTypes = ['image/jpg', 'image/jpeg', 'image/png'];
          return validTypes.includes(value.type);
        }
        return true; // if no file, return true
      }),
  });
  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append('student_matNo', values.student_matNo);
    formData.append('full_name', values.full_name);
    formData.append('gender', values.gender);
    formData.append('email', values.email);
    formData.append('address', values.address); // Add address field
    formData.append('phone_number', values.phone_number); // Fixed the typo
    formData.append('profile_pic', values.profile_pic); // Ensure to include profile picture
    formData.append('date_of_birth', values.date_of_birth); // Add date of birth
    formData.append('date_of_admission', values.date_of_admission); // Add date of admission
    formData.append('marital_status', values.marital_status); // Add marital status
    formData.append('parent_tel', values.parent_tel); // Add parent's telephone
    formData.append('parent_name', values.parent_name); // Add parent's telephone
    formData.append('parent_email', values.parent_email); // Add parent's email
    formData.append('occupation', values.occupation); // Add occupation
    formData.append('level_of_entry', values.level_of_entry); // Add level of entry
    formData.append('mode_of_entry', values.mode_of_entry); // Add mode of entry
    formData.append('health_conditions', values.health_conditions); // Add health conditions
    formData.append('health_explanation', values.health_explanation); // Add health explanation
    formData.append('differently_abled', values.differently_abled); // Add differently abled status
    formData.append('center', values.center); // Add center

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/v1/student/createStudent`, formData, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      console.log('Student added:', response.data);
      alert('Student added successfully!');
      setServerError("");  // Clear error message on successful submission
    } catch (error) {
      console.error('Error adding student:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);  // Set error message from the server
      } else {
        setServerError('Error adding student');  // Generic error message
      }
    } finally {
      setSubmitting(false);
    }
  ;

  };
  const handleHealthConditionsChange = (value) => {
    setShowHealthExplanation(value === 'Yes');
  };



  return (
    <div className="flex justify-center flex-col items-center min-h-screen bg-gray-100">
      <Link to={'/dashboard/studentList'} className="text-blue-600 flex items-center hover:text-blue-800">
                    <FaArrowLeft className="mr-2" /> Back
                </Link>
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Add Student</h2>
        {serverError && <div className="text-red-500 text-center mb-4">{serverError}</div>}  {/* Display server error */}
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="">
              <div className="flex space-y-2  justify-between flex-col">
                {/* Matriculation Number */}
                <div className="flex space-x-2 justify-between w-full">
                  <div className='w-1/2'>
                    <label className="block text-sm font-medium text-gray-700">Matriculation Number</label>
                    <Field name="student_matNo" className="mt-1 p-2 border rounded-md w-full" />
                    <ErrorMessage name="student_matNo" component="div" className="text-red-500 text-sm" />
                  </div>

                  {/* Full Name */}
                  <div className='w-1/2'>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <Field name="full_name" className="mt-1 p-2 border rounded-md w-full" />
                    <ErrorMessage name="full_name" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>
                {/* second row */}
                <div className="flex space-x-2 justify-between w-full">
                  {/* Gender */}
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <div role="group" aria-labelledby="gender" className="flex space-x-4">
                      <label>
                        <Field type="radio" name="gender" value="Male" className="mr-2" />
                        Male
                      </label>
                      <label>
                        <Field type="radio" name="gender" value="Female" className="mr-2" />
                        Female
                      </label>
                      <label>
                        <Field type="radio" name="gender" value="Other" className="mr-2" />
                        Other
                      </label>
                    </div>
                    <ErrorMessage name="gender" component="div" className="text-red-500 text-sm" />
                  </div>

                  {/* Email */}
                  <div className='w-1/2'>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <Field name="email" type="email" className="mt-1 p-2 border rounded-md w-full" />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>
                {/* third row */}
                <div className="flex justify-between space-x-2 w-full">
                  {/* Phone Number */}

                  <div className='w-1/2'>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <Field name="phone_number" className="mt-1 p-2 border rounded-md w-full" />
                    <ErrorMessage name="phone_number" component="div" className="text-red-500 text-sm" />
                  </div>

                  {/* Address */}
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <Field name="address" className="mt-1 p-2 border rounded-md w-full" />
                    <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>
                {/* fourth */}
                <div className="flex space-x-2 justify-between w-full">
                  {/* Date of Birth */}
                  <div className='w-1/2'>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <Field name="date_of_birth" type="date" className="mt-1 p-2 border rounded-md w-full" />
                    <ErrorMessage name="date_of_birth" component="div" className="text-red-500 text-sm" />
                  </div>

                  {/* Date of Admission */}
                  <div className='w-1/2'>
                    <label className="block text-sm font-medium text-gray-700">Date of Admission</label>
                    <Field name="date_of_admission" type="date" className="mt-1 p-2 border rounded-md w-full" />
                    <ErrorMessage name="date_of_admission" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>
                {/* fifth row */}
                <div className="flex justify-between space-x-2 w-full">
                  {/* Marital Status */}
                  <div className='w-1/2'>
                    <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                    <Field as="select" name="marital_status" className="mt-1 p-2 border rounded-md w-full">
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </Field>
                    <ErrorMessage name="marital_status" component="div" className="text-red-500 text-sm" />
                  </div>

                  {/* Parent Tel */}

                  <div className='w-1/2'>
                    <label className="block text-sm font-medium text-gray-700">Parent/Guardian Name</label>
                    <Field name="parent_name" className="mt-1 p-2 border rounded-md w-full" />
                    <ErrorMessage name="parent_name" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>
                {/* six row */}
                <div className="flex justify-between space-x-2 w-full">
                  <div className='w-1/2'>
                    <label className="block text-sm font-medium text-gray-700">Parent Tel</label>
                    <Field name="parent_tel" className="mt-1 p-2 border rounded-md w-full" />
                    <ErrorMessage name="parent_tel" component="div" className="text-red-500 text-sm" />
                  </div>

                  {/* Parent Email */}
                  <div className='w-1/2'>
                    <label className="block text-sm font-medium text-gray-700">Parent Email</label>
                    <Field name="parent_email" type="email" className="mt-1 p-2 border rounded-md w-full" />
                    <ErrorMessage name="parent_email" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>
                {/* seven row */}
                {/* Occupation */}
                <div className="flex w-full justify-between space-x-2">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700">Occupation</label>
                    <Field name="occupation" className="mt-1 p-2  border rounded-md w-full" />
                    <ErrorMessage name="occupation" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div className='w-1/2'>
                    <label className="block text-sm font-medium text-gray-700">Center</label>
                    <Field name="center" className="mt-1 p-2 border rounded-md w-full" />
                    <ErrorMessage name="center" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>
                {/* Level of Entry */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Level of Entry</label>
                  <Field as="select" name="level_of_entry" className="mt-1 p-2 border rounded-md w-full">
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Bronze">Bronze</option>
                  </Field>
                  <ErrorMessage name="level_of_entry" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Mode of Entry */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Mode of Entry</label>
                  <div role="group" aria-labelledby="mode_of_entry" className="flex space-x-4">
                    <label>
                      <Field type="radio" name="mode_of_entry" value="New Entry" className="mr-2" />
                      New Entry
                    </label>
                    <label>
                      <Field type="radio" name="mode_of_entry" value="Direct Entry" className="mr-2" />
                      Direct Entry
                    </label>
                    <label>
                      <Field type="radio" name="mode_of_entry" value="Continuation" className="mr-2" />
                      Continuation
                    </label>
                  </div>
                  <ErrorMessage name="mode_of_entry" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Differently Abled */}
                <div className="w-full">
                  <label className="block w-full text-sm font-medium text-gray-700">Differently Abled</label>
                  <div role="group" aria-labelledby="differently_abled" className="flex w-1/2 col-span-2 space-x-4">
                    <label>
                      <Field type="radio" name="differently_abled" value="Yes" className="mr-2" />
                      Yes
                    </label>
                    <label>
                      <Field type="radio" name="differently_abled" value="No" className="mr-2" />
                      No
                    </label>
                  </div>
                  <ErrorMessage name="differently_abled" component="div" className="text-red-500 text-sm" />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700">Health Conditions</label>
                <Field
                  as="select"
                  name="health_conditions"
                  onChange={(e) => {
                    handleHealthConditionsChange(e.target.value);
                    setFieldValue("health_conditions", e.target.value);
                  }}
                  className="mt-1 p-2 border rounded-md w-full"
                >
                  <option value="">-- Select Condition --</option>
                  <option value="None">None</option>
                  <option value="Yes">Yes</option>
                </Field>
                <ErrorMessage name="health_conditions" component="div" className="text-red-500 text-sm" />
              </div>

               {/* Conditional Health Explanation */}
              {showHealthExplanation && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Health Explanation</label>
                  <Field
                    as="textarea"
                    name="health_explanation"
                    className="mt-1 p-2 border rounded-md w-full"
                  />
                  <ErrorMessage name="health_explanation" component="div" className="text-red-500 text-sm" />
                </div>
              )}

                {/* Profile Picture */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                  <input
                    type="file"
                    name="profile_pic"
                    onChange={(event) => {
                      setFieldValue("profile_pic", event.currentTarget.files[0]);
                    }}
                    className="mt-1 p-2 border rounded-md w-full"
                  />
                  <ErrorMessage name="profile_pic" component="div" className="text-red-500 text-sm" />
                </div>



                {/* Center */}


                {/* Submit Button */}
                <div className=" flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-500 w-full text-white font-bold py-2 px-8 rounded hover:bg-blue-700"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
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

export default StudentForm;
