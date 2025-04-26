import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const EditStock = () => {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');
    const [items, setItems] = useState(null); // Handle loading state
    const { id } = useParams();

    // Fetch item data when the component mounts
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/stocks/single_items/${id}`,{
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            },
        })
            .then(response => {
                const { item_number, transactions_type, quantity } = response.data; // <<< item_number!
                setItems({
                    item_number,
                    transactions_type,
                    quantity
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
                item_number: items?.item_number || '',
                transactions_type: items?.transactions_type || '',
                quantity: items?.quantity || '',
            }}
            validationSchema={Yup.object({
                item_number: Yup.string().required('Item Number is required'), // <<< correct field
                transactions_type: Yup.string().required('Transaction type is required'),
                quantity: Yup.number()
                    .min(1, 'Quantity must be at least 1')
                    .required('Quantity is required'),
            })}
            onSubmit={async (values, { setSubmitting }) => {
                try {
                    await axios.put(
                        `${process.env.REACT_APP_BACKEND_URL}/v1/stocks/update_items/${id}`,
                        values,
                        {
                            headers: {
                                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                            },
                        }
                    );
                    navigate('/dashboard/stocks/stock_list');
                } catch (error) {
                    setServerError(error.response?.data?.error || 'An unexpected error occurred');
                    console.error('Error updating item:', error);
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ isSubmitting }) => (
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
                                    <label className="block text-sm font-medium text-gray-700">Item Number</label>
                                    <Field
                                        type="text"
                                        name="item_number"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                    <ErrorMessage name="item_number" component="div" className="text-red-600 text-sm" />
                                </div>

                                <div className="mb-4 w-1/2">
                                    <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
                                    <Field as="select" name="transactions_type" className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                                        <option value="">Select transaction type</option>
                                        <option value="stock-in">Stock-In</option>
                                        <option value="stock-out">Stock-Out</option>
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
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                {isSubmitting ? 'Updating...' : 'Update Stock'}
                            </button>
                        </Form>
                    </div>
                </div>
            )}
        </Formik>
    );
};

export default EditStock;
