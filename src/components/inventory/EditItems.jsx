import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const EditItems = () => {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');
    const [items, setItems] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/items/getItem/${id}`, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            },
        })
            .then(response => {
                const { name, physical_location, amount, acquisition_date, description, image_url } = response.data;
                setItems({
                    name,
                    physical_location,
                    amount,
                    acquisition_date: acquisition_date ? acquisition_date.split('T')[0] : '', // Format date
                    description,
                    image_url,
                });
            })
            .catch(error => {
                console.error('Error fetching item data:', error);
            });
    }, [id]);

    if (!items) {
        return <div>Loading...</div>;
    }

    return (
        <Formik
            enableReinitialize
            initialValues={{
                name: items?.name || '',
                physical_location: items?.physical_location || '',
                amount: items?.amount || '',
                acquisition_date: items?.acquisition_date || '',
                description: items?.description || '',
                image_url: null, 
            }}
            validationSchema={Yup.object({
                name: Yup.string().required('Item name is required'),
                physical_location: Yup.string().required('Physical location is required'),
                amount: Yup.number().min(1, 'Amount must be at least 1').required('Amount is required'),
                acquisition_date: Yup.date().required('Acquisition date is required'),
                description: Yup.string().required('Description is required'),
                image_url: Yup.mixed()
                    .nullable()
                    .test('fileSize', 'File too large', value => !value || (value && value.size <= 5 * 1024 * 1024))
                    .test('fileFormat', 'Only jpg, jpeg, and png files are allowed', value =>
                        !value || (value && ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type))
                    ),
            })}
            onSubmit={async (values, { setSubmitting }) => {
                try {
                    const formData = new FormData();
                    Object.keys(values).forEach(key => {
                        if (key === 'image_url' && values.image_url) {
                            formData.append(key, values.image_url);
                        } else {
                            formData.append(key, values[key]);
                        }
                    });

                    await axios.put(`${process.env.REACT_APP_BACKEND_URL}/v1/items/update_item/${id}`, formData, {
                        headers: {
                            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    navigate('/dashboard/items/list');
                } catch (error) {
                    setServerError('An unexpected error occurred');
                    console.error('Error updating item:', error);
                } finally {
                    setSubmitting(false);
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
                                    <label className="block text-sm font-medium text-gray-700">Physical Location</label>
                                    <Field
                                        type="text"
                                        name="physical_location"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                    <ErrorMessage name="physical_location" component="div" className="text-red-600 text-sm" />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Amount</label>
                                <Field
                                    type="number"
                                    name="amount"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                                <ErrorMessage name="amount" component="div" className="text-red-600 text-sm" />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Acquisition Date</label>
                                <Field
                                    type="date"
                                    name="acquisition_date"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                                <ErrorMessage name="acquisition_date" component="div" className="text-red-600 text-sm" />
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
