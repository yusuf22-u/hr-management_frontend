import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const InventoryForm = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const validationSchema = Yup.object({
    name: Yup.string().required('Item name is required'),
    category: Yup.string().required('Category is required'),
    quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
    description: Yup.string().required('Description is required'),

    image_url: Yup.mixed().test('fileSize', 'File too large', value => !value || (value && value.size <= 5 * 1024 * 1024)).test(
      'fileFormat',
      'Only jpg, jpeg, and png files are allowed',
      (value) => !value || (value && ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type))
    ),

  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('category', values.category);
    formData.append('quantity', values.quantity);
    formData.append('description', values.description);
    formData.append('image_url', values.image_url);

    try {
      const response = await axios.post('http://localhost:4000/v1/items/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);

      navigate('/dashboard/items/list');
    } catch (error) {
      console.error('Error:', error.response);
      if (error.response && error.response.data) {
        setServerError(error.response.data.error || 'Server error occurred');
        // Optional: Set specific field errors from server-side validation, if applicable
      } else {
        setServerError('An unexpected error occurred.');
      }
    }
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{
        name: '',
        category: '',
        quantity: '',
        description: '',
        image_url: null
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form className=" p-6 max-w-2xl mx-auto ">
          <h2 className="text-xl font-bold mb-4">Add Item</h2>

          {serverError && <div className="text-red-600 mb-4">{serverError}</div>}

          <div className="flex justify-between space-x-2">
            <div className="mb-4 w-1/2">
              <label className="block text-sm font-medium text-gray-700">Item Name</label>
              <Field
                type="text"
                name="name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage name="name" component="div" className="text-red-600 text-sm" />
            </div>

            <div className="mb-4 w-1/2">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <Field
                type="text"
                name="category"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage name="category" component="div" className="text-red-600 text-sm" />
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <Field
              as="textarea"
              name="description"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <ErrorMessage name="description" component="div" className="text-red-600 text-sm" />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              name="image_url"
              accept="image/jpeg, image/png, image/jpg"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              onChange={(e) => {
                setFieldValue('image_url', e.currentTarget.files[0]);
              }}
            />
            <ErrorMessage name="image_url" component="div" className="text-red-600 text-sm" />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default InventoryForm;
