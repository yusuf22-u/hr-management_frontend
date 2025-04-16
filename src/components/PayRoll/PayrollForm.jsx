import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const PayrollForm = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [serverError, setServerError] = useState('');
  const [employeePosition, setEmployeePosition] = useState('');

  // Validation schema using Yup
  const validationSchema = Yup.object({
    employee_id: Yup.number().required('Employee ID is required').positive('Employee ID must be a positive number'),
    basic_salary: Yup.number().required('Basic salary is required').positive('Salary must be positive'),
    resident_allowance: Yup.number().min(0, 'Resident Allowance cannot be negative').optional(),
    responsibility_allowance: Yup.number().min(0, 'Responsibility Allowance cannot be negative').optional(),
    transport_allowance: Yup.number().min(0, 'Transport Allowance cannot be negative').optional(),
    income_tax: Yup.number().min(0, 'Income Tax cannot be negative').required('Income Tax is required'),
    social_security_contribution: Yup.number().min(0, 'Social Security Contribution cannot be negative').required('Social Security Contribution is required'),
  });

  const formik = useFormik({
    initialValues: {
      employee_id: '',
      basic_salary: '',
      resident_allowance: '',
      responsibility_allowance: '',
      transport_allowance: '',
      income_tax: '',
      social_security_contribution: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await axios.post('http://localhost:4000/v1/payrolls/addPayroll', values);
        onClose();
        setServerError('');
        setMessage('Payroll added successfully');
      } catch (error) {
        if (error.response && error.response.data) {
          setServerError(error.response.data.error || 'Server error occurred');
        }
        setMessage('Failed to add payroll');
      }
    },
  });

  // Fetch employee position when employee_id changes
  useEffect(() => {
    if (formik.values.employee_id) {
      axios.get(`http://localhost:4000/v1/employees/getSingleEmployee/${formik.values.employee_id}`,{
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
      })
        .then(response => {
          setEmployeePosition(response.data.position);
          console.log('position',response.data.position)
        })
        .catch(error => {
          console.error('Error fetching employee data:', error);
          setEmployeePosition('');
        });
    }
  }, [formik.values.employee_id]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Payroll</h2>
      <p className="text-red-500">{serverError}</p>
      <div className="mb-5">
        <label className="block text-gray-700 font-semibold mb-2">Employee ID</label>
        <input type="number" name="employee_id" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.employee_id} className="border rounded-lg w-full py-2 px-3 focus:ring-2 focus:ring-blue-500" />
        {formik.touched.employee_id && formik.errors.employee_id && <p className="text-red-500 text-sm">{formik.errors.employee_id}</p>}
      </div>

      <div className="flex justify-between w-full space-x-2">
        <div className="mb-5 w-1/2">
          <label className="block text-gray-700 font-semibold mb-2">Basic Salary</label>
          <input type="number" name="basic_salary" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.basic_salary} className="border rounded-lg w-full py-2 px-3 focus:ring-2 focus:ring-blue-500" />
          {formik.touched.basic_salary && formik.errors.basic_salary && <p className="text-red-500 text-sm">{formik.errors.basic_salary}</p>}
        </div>

        <div className="mb-5 w-1/2">
          <label className="block text-gray-700 font-semibold mb-2">Resident Allowance</label>
          <input type="number" name="resident_allowance" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.resident_allowance} className="border rounded-lg w-full py-2 px-3 focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      {employeePosition === 'cleaner' ? (
        <div className="mb-5">
          <label className="block text-gray-700 font-semibold mb-2">Responsibility Allowance</label>
          <input type="number" name="responsibility_allowance" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.responsibility_allowance} className="border rounded-lg w-full py-2 px-3 focus:ring-2 focus:ring-blue-500" />
        </div>
      ) : (
        <div className="mb-5">
          <label className="block text-gray-700 font-semibold mb-2">Transport Allowance</label>
          <input type="number" name="transport_allowance" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.transport_allowance} className="border rounded-lg w-full py-2 px-3 focus:ring-2 focus:ring-blue-500" />
        </div>
      )}
      <div className="flex justify-between w-full space-x-2">
        <div className="mb-5 w-1/2">
          <label className="block text-gray-700 font-semibold mb-2">Income Tax</label>
          <input type="number" name="income_tax" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.income_tax} className="border rounded-lg w-full py-2 px-3 focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="mb-5 w-1/2">
          <label className="block text-gray-700 font-semibold mb-2">Social Security Contribution</label>
          <input type="number" name="social_security_contribution" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.social_security_contribution} className="border rounded-lg w-full py-2 px-3 focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full font-semibold hover:bg-blue-600 transition duration-200">Submit Payroll</button>
      {message && <p className="mt-4 text-green-600 text-lg">{message}</p>}
    </form>
  );
};

export default PayrollForm;
