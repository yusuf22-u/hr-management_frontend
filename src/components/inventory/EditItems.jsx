import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const EditItems = () => {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');
    const [items, setItems] = useState(null); // Initialize as null to handle loading state
    const { id } = useParams();

    // Fetch item data when the component mounts
    useEffect(() => {
        axios.get(`http://localhost:4000/v1/items/getItem/${id}`)
            .then(response => {
                const { name, category, quantity, description, image_url } = response.data;
                setItems({
                    name,
                    category,
                    quantity,
                    description,
                    image_url
                });
            })
            .catch(error => {
                console.error('Error fetching item data:', error);
            });
    }, [id]);

    // Render loading message if item data is not yet loaded
    if (!items) {
        return <div>Loading...</div>;
    }

    return (
        <Formik
            enableReinitialize
            initialValues={{
                name: items?.name || '',
                category: items?.category || '',
                quantity: items?.quantity || '',
                description: items?.description || '',
                image_url: null, // Initialize file as null
            }}
            validationSchema={Yup.object({
                name: Yup.string().required('Item name is required'),
                category: Yup.string().required('Category is required'),
                quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
                description: Yup.string().required('Description is required'),
                image_url: Yup.mixed().required(null)
                    .test('fileSize', 'File too large', value => !value || (value && value.size <= 5 * 1024 * 1024))
                    .test('fileFormat', 'Only jpg, jpeg, and png files are allowed', value =>
                        !value || (value && ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type))
                    ),
            })}
            onSubmit={async (values, { setSubmitting }) => {
                try {
                    const formData = new FormData();

                    // Append each value, including handling the file
                    Object.keys(values).forEach(key => {
                        if (key === 'image_url' && values.image_url) {
                            formData.append(key, values.image_url);  // Only append new file if it exists
                        } else {
                            formData.append(key, values[key]);
                        }
                    });

                    await axios.put(`http://localhost:4000/v1/items//update_item/${id}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    navigate('/dashboard/items/list');
                } catch (error) {
                    setServerError('An unexpected error occurred');
                    console.error('Error updating item:', error);
                } finally {
                    setSubmitting(false); // Ensure the form submission is marked complete
                }
            }}
        >
            {({ isSubmitting, setFieldValue }) => (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <Link to='/dashboard/items/list' className="text-red-600 hover:text-red-800">
                            Close
                        </Link>
                        <Form className="p-6 max-w-2xl mx-auto">
                            <h2 className="text-xl font-bold mb-4">Edit Item</h2>

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
                                {isSubmitting ? 'Updating...' : 'Update Item'}
                            </button>
                        </Form>
                    </div>
                </div>

            )}
        </Formik>
    );
};

export default EditItems;
