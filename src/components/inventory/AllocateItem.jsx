import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const AllocateItemForm = () => {
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  // Validation schema
  const validationSchema = Yup.object({
    item_id: Yup.string().required('Item ID is required'),
    staff_id: Yup.string().required('Staff ID is required'),
    quantity: Yup.number()
      .min(1, 'Quantity must be at least 1')
      .required('Quantity is required'),
  });

  // Form submission
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setSubmitting(true);
    setServerError('');

    try {
      const response = await axios.post('http://localhost:4000/v1/allocateItem/allocate', values);
      console.log(response.data);
      navigate('/dashboard/items/list');
    } catch (error) {
      if (error.response && error.response.data) {
        setServerError(error.response.data.error);
        console.error('Error:', error.response.data);
      } else {
        setServerError('An unexpected error occurred');
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <Link to="/dashboard/items/list" className="text-red-600 font-bold hover:text-red-800">
          Close
        </Link>

        <Formik
          initialValues={{
            item_id: '',
            staff_id: '',
            quantity: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="p-6 max-w-2xl mx-auto">
              <h2 className="text-xl font-bold mb-4 text-center">Allocate Items</h2>

              {serverError && <div className="text-red-600 mb-4">{serverError}</div>}

              <div className="flex justify-between space-x-2">
                <div className="mb-4 w-1/2">
                  <label className="block text-sm font-medium text-gray-700">Item ID</label>
                  <Field
                    type="text"
                    name="item_id"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <ErrorMessage name="item_id" component="div" className="text-red-600 text-sm" />
                </div>

                <div className="mb-4 w-1/2">
                  <label className="block text-sm font-medium text-gray-700">Staff ID</label>
                  <Field
                    type="text"
                    name="staff_id"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <ErrorMessage name="staff_id" component="div" className="text-red-600 text-sm" />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <Field
                  type="number"
                  name="quantity"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <ErrorMessage name="quantity" component="div" className="text-red-600 text-sm" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                {isSubmitting ? 'Allocating...' : 'Allocate Item'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AllocateItemForm;
