import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';

const EditStudentScoreForm = () => {
    const {id}=useParams()
    const [studentData, setStudentData] = useState(null);
    const [levelOfEntry, setLevelOfEntry] = useState('');

    const maxScoreGold = 20;
    const maxScoreSilverBronze = 25;

    useEffect(() => {
        // Fetch existing data for the student based on student_matNo
        const fetchStudentData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/score/get_student/${id}`);
                setStudentData(response.data);
                setLevelOfEntry(response.data.level_of_entry);
            } catch (error) {
                console.error('Error fetching student data:', error);
                toast.error('Error fetching student data');
            }
        };

        fetchStudentData();
    }, [id]);

    const getValidationSchema = () => {
        const scoreValidation = levelOfEntry === 'Gold'
            ? Yup.number().max(maxScoreGold, `Max score is ${maxScoreGold}`).required('Required')
            : Yup.number().max(maxScoreSilverBronze, `Max score is ${maxScoreSilverBronze}`).required('Required');

        const baseSchema = {
            student_matNo: Yup.string().required('Student ID is required'),
            level_of_entry: Yup.string().required('Please select a level of entry'),
            adventures_journey: scoreValidation,
            voluntary_service: scoreValidation,
            physical_recreation: scoreValidation,
            skills_and_interest: scoreValidation,
        };

        if (levelOfEntry === 'Gold') {
            baseSchema.residential_project = Yup.number().max(maxScoreGold, `Max score is ${maxScoreGold}`).required('Required');
        }

        return Yup.object(baseSchema);
    };

    const handleSubmit = async (values, { setFieldError }) => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/v1/score/updateStudentScore/${id}`, values);

            if (response.status === 200) {
                toast.success('Student scores updated successfully!');
                // Close the form after successful submission
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.error || 'Update failed';

                if (error.response.data.fieldErrors) {
                    error.response.data.fieldErrors.forEach(({ field, message }) => {
                        setFieldError(field, message);
                    });
                } else {
                    toast.error(errorMessage);
                }
            } else {
                toast.error('An unexpected error occurred.');
            }
            console.error('Update error:', error);
        }
    };

    if (!studentData) return <div>Loading...</div>;

    return (
        <div className="p-4 max-w-md mx-auto bg-white rounded shadow">
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <Formik
                initialValues={{
                    student_matNo: studentData.student_matNo,
                    level_of_entry: studentData.level_of_entry,
                    adventures_journey: studentData.adventures_journey,
                    voluntary_service: studentData.voluntary_service,
                    physical_recreation: studentData.physical_recreation,
                    skills_and_interest: studentData.skills_and_interest,
                    residential_project: studentData.residential_project || '',
                }}
                validationSchema={getValidationSchema()}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ values, setFieldValue }) => (
                    <Form>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Student ID</label>
                            <Field
                                name="student_matNo"
                                type="text"
                                className="mt-1 block w-full border-gray-300 rounded-md"
                                placeholder="Enter Student ID"
                                disabled
                            />
                            <ErrorMessage name="student_matNo" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Level of Entry</label>
                            <Field
                                as="select"
                                name="level_of_entry"
                                onChange={(e) => {
                                    const level = e.target.value;
                                    setLevelOfEntry(level);
                                    setFieldValue("level_of_entry", level);
                                }}
                                className="mt-1 block w-full border-gray-300 rounded-md"
                                disabled
                            >
                                <option value="">Select Level</option>
                                <option value="Gold">Gold</option>
                                <option value="Silver">Silver</option>
                                <option value="Bronze">Bronze</option>
                            </Field>
                            <ErrorMessage name="level_of_entry" component="div" className="text-red-500 text-sm" />
                        </div>

                        {values.level_of_entry && (
                            <>
                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Adventures Journey</label>
                                    <Field
                                        name="adventures_journey"
                                        type="number"
                                        className="mt-1 block w-full border-gray-300 rounded-md"
                                    />
                                    <ErrorMessage name="adventures_journey" component="div" className="text-red-500 text-sm" />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Voluntary Service</label>
                                    <Field
                                        name="voluntary_service"
                                        type="number"
                                        className="mt-1 block w-full border-gray-300 rounded-md"
                                    />
                                    <ErrorMessage name="voluntary_service" component="div" className="text-red-500 text-sm" />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Physical Recreation</label>
                                    <Field
                                        name="physical_recreation"
                                        type="number"
                                        className="mt-1 block w-full border-gray-300 rounded-md"
                                    />
                                    <ErrorMessage name="physical_recreation" component="div" className="text-red-500 text-sm" />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Skills and Interest</label>
                                    <Field
                                        name="skills_and_interest"
                                        type="number"
                                        className="mt-1 block w-full border-gray-300 rounded-md"
                                    />
                                    <ErrorMessage name="skills_and_interest" component="div" className="text-red-500 text-sm" />
                                </div>

                                {levelOfEntry === 'Gold' && (
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Residential Project</label>
                                        <Field
                                            name="residential_project"
                                            type="number"
                                            className="mt-1 block w-full border-gray-300 rounded-md"
                                        />
                                        <ErrorMessage name="residential_project" component="div" className="text-red-500 text-sm" />
                                    </div>
                                )}
                            </>
                        )}

                        <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Update
                        </button>
                        <button
                            type="button"
                            className="mt-4 ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            
                        >
                            Cancel
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default EditStudentScoreForm;
