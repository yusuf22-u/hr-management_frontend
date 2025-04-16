import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const StaffEvaluationForm = () => {
    const [formData, setFormData] = useState({
        employee_id: '',
        evaluation_date: '',
        evaluator_name: '',
        communication_skills: '',
        technical_skills: '',
        teamwork: '',
        problem_solving: '',
        punctuality: '',
        responsibility: '',
        expertise: '',
        dependability: '',
        reliability: '',
        skills: '',
        comments: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const errors = {};
        const requiredFields = [
            'employee_id',
            'evaluation_date',
            'evaluator_name',
            'communication_skills',
            'technical_skills',
            'teamwork',
            'problem_solving',
            'punctuality',
            'responsibility',
            'expertise',
            'dependability',
            'reliability',
            'skills'
        ];

        requiredFields.forEach(field => {
            if (!formData[field]) errors[field] = 'This field is required';
        });

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await axios.post('http://localhost:4000/v1/evaluations/create', formData, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                }
            });

            if (response.data.success) {
                // alert('Evaluation submitted successfully');
                toast.success("Evaluation submitted successfully")
                setFormData({
                    employee_id: '',
                    evaluation_date: '',
                    evaluator_name: '',
                    communication_skills: '',
                    technical_skills: '',
                    teamwork: '',
                    problem_solving: '',
                    punctuality: '',
                    responsibility: '',
                    expertise: '',
                    dependability: '',
                    reliability: '',
                    skills: '',
                    comments: ''
                });
            }
        } catch (error) {
            console.error('There was an error submitting the form:', error);
            toast.warning("Evaluation not added")
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[400px] bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Staff Evaluation Form</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Employee ID */}
                    <div>
                        <label className="block mb-2 text-gray-700">Employee ID</label>
                        <input
                            type="text"
                            name="employee_id"
                            value={formData.employee_id}
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.employee_id && <p className="text-red-500 text-sm mt-1">{errors.employee_id}</p>}
                    </div>

                    {/* Evaluation Date */}
                    <div>
                        <label className="block mb-2 text-gray-700">Evaluation Date</label>
                        <input
                            type="date"
                            name="evaluation_date"
                            value={formData.evaluation_date}
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.evaluation_date && <p className="text-red-500 text-sm mt-1">{errors.evaluation_date}</p>}
                    </div>

                    {/* Evaluator Name */}
                    <div>
                        <label className="block mb-2 text-gray-700">Evaluator Name</label>
                        <input
                            type="text"
                            name="evaluator_name"
                            value={formData.evaluator_name}
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.evaluator_name && <p className="text-red-500 text-sm mt-1">{errors.evaluator_name}</p>}
                    </div>

                    {/* Rating Fields */}
                    {[
                        'communication_skills',
                        'technical_skills',
                        'teamwork',
                        'problem_solving',
                        'punctuality',
                        'responsibility',
                        'expertise',
                        'dependability',
                        'reliability',
                        'skills'
                    ].map(field => (
                        <div key={field}>
                            <label className="block mb-2 text-gray-700 capitalize">
                                {field.replace('_', ' ')} (1-10)
                            </label>
                            <input
                                type="number"
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                min="1"
                                max="10"
                            />
                            {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
                        </div>
                    ))}

                    {/* Comments */}
                    <div className="md:col-span-2">
                        <label className="block mb-2 text-gray-700">Comments</label>
                        <textarea
                            name="comments"
                            value={formData.comments}
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            rows="4"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="md:col-span-2 flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
                        >
                            Submit Evaluation
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer 
             position="top-center"
             className={'text-center'}/>
        </div>
    );
};

export default StaffEvaluationForm;
