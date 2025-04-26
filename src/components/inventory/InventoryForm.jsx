import React, { useState } from 'react';
import axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const InventoryFormModal = ({ isOpen, onClose, onSuccess }) => {
  const [serverError, setServerError] = useState('');
const  navigate=useNavigate()
  if (!isOpen) return null;

  const validationSchema = Yup.object({
    item_number: Yup.string().required('Item number is required'),
    name: Yup.string().required('Item name is required'),
    physical_location: Yup.string().required('Physical location is required'),
    amount: Yup.number().min(0.01, 'Amount must be greater than 0').required('Amount is required'),
    description: Yup.string().required('Description is required'),
    acquisition_date: Yup.date().required('Acquisition date is required').nullable(),
    image_url: Yup.mixed()
      .test('fileSize', 'File too large', value => !value || value.size <= 5 * 1024 * 1024)
      .test('fileFormat', 'Only jpg, jpeg, and png files are allowed', value =>
        !value || ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)
      ),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => {
      formData.append(key, val);
    });

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/v1/items/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
      });

      setServerError(null);
      toast.success('Item created successfully!', {
        position: 'top-center',
        autoClose: 2000,
      });
      
      resetForm();
      navigate('/dashboard/items/list');
      // if (onSuccess) onSuccess(); // e.g., refresh list
      // setTimeout(onClose, 2000);  // close modal after success
    } catch (error) {
      if (error.response?.data) {
        setServerError(error.response.data.error || 'Server error occurred');
      } else {
        setServerError('An unexpected error occurred.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-2xl w-[95%] sm:w-full max-w-3xl mx-auto my-8 p-4 sm:p-6 lg:p-8 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-red-500 hover:text-red-700 font-semibold text-xl"
          >
            ✕
          </button>

          <Formik
            initialValues={{
              item_number: '',
              name: '',
              physical_location: '',
              amount: '',
              description: '',
              acquisition_date: '',
              image_url: null,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-blue-700 border-b pb-2">Add Inventory Item</h2>

                {serverError && (
                  <div className="bg-red-100 text-red-700 text-sm px-3 py-2 rounded">
                    {serverError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Number</label>
                    <Field name="item_number" type="text" className="form-input" />
                    <ErrorMessage name="item_number" component="div" className="error-msg" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                    <Field name="name" type="text" className="form-input" />
                    <ErrorMessage name="name" component="div" className="error-msg" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Physical Location</label>
                    <Field name="physical_location" type="text" className="form-input" />
                    <ErrorMessage name="physical_location" component="div" className="error-msg" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <Field name="amount" type="number" step="0.01" className="form-input" />
                    <ErrorMessage name="amount" component="div" className="error-msg" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Acquisition Date</label>
                    <Field name="acquisition_date" type="date" className="form-input" />
                    <ErrorMessage name="acquisition_date" component="div" className="error-msg" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image Upload</label>
                    <input
                      type="file"
                      name="image_url"
                      accept="image/jpeg, image/png, image/jpg"
                      onChange={(e) => setFieldValue('image_url', e.currentTarget.files[0])}
                      className="form-input file:border-0 file:px-3 file:py-1 file:bg-blue-100 file:text-blue-700"
                    />
                    <ErrorMessage name="image_url" component="div" className="error-msg" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <Field name="description" as="textarea" rows={3} className="form-input resize-none" />
                  <ErrorMessage name="description" component="div" className="error-msg" />
                </div>

                <div className="text-right pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm rounded-md transition duration-300 shadow-sm"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Item'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default InventoryFormModal;
