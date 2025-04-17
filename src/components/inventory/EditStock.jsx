import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const EditStock = () => {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');
    const [items, setItems] = useState(null); // Initialize as null to handle loading state
    const { id } = useParams();

    // Fetch item data when the component mounts
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/stocks/single_items/${id}`)
            .then(response => {
                const { item_id, transactions_type, quantity } = response.data;
                setItems({
                    item_id,
                    transactions_type,
                    quantity

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
                item_id: items?.item_id || '',
                transactions_type: items?.transactions_type || '',
                quantity: items?.quantity || '',

            }}
            validationSchema={Yup.object({
                item_id: Yup.string().required('Item Number is required'),
                transactions_type: Yup.string().required('transactions type is required'),
                quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),

            })}
            onSubmit={async (values, { setSubmitting }) => {
                try {

                    const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/v1/stocks/update_items/${id}`, values);

                    navigate('/dashboard/stocks/stock_list');
                } catch (error) {
                    setServerError(error.response?.data?.error || 'An unexpected error occurred');
                    console.error('Error updating item:', error);

                } finally {
                    setSubmitting(false); // Ensure the form submission is marked complete
                }
            }}
        >
            {({ isSubmitting, setFieldValue }) => (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <Link to='/dashboard/stocks/stock_list' className="text-red-600 hover:text-red-800">
                            Close
                        </Link>
                        <Form className="p-6 max-w-2xl mx-auto">
                            <h2 className="text-xl font-bold mb-4">Edit Stock</h2>

                            {serverError && <div className="text-red-600 mb-4">{serverError}</div>}

                            <div className="flex justify-between space-x-2">
                                <div className="mb-4 w-1/2">
                                    <label className="block text-sm font-medium text-gray-700">Item Id</label>
                                    <Field
                                        type="text"
                                        name="item_id"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                    <ErrorMessage name="item_id" component="div" className="text-red-600 text-sm" />
                                </div>

                                <div className="mb-4 w-1/2">
                                    <label className="block text-sm font-medium text-gray-700">transactions type</label>
                                    <Field as="select" name="transactions_type" className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                                        <option value="">Select transactions type </option>
                                        <option value="stock-in">stock-in</option>
                                        <option value="stock-out">stock-out</option>

                                    </Field>
                                    <ErrorMessage name="transactions_type" component="div" className="text-red-600 text-sm" />
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
                                {isSubmitting ? 'Updating...' : 'Update stocks'}
                            </button>
                        </Form>
                    </div>
                </div>

            )}
        </Formik>
    );
};

export default EditStock;
