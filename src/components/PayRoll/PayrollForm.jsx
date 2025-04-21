import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const PayrollForm = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [serverError, setServerError] = useState('');
  const [employeePosition, setEmployeePosition] = useState('');

  const validationSchema = Yup.object({
    employee_id: Yup.number().required('Employee ID is required').positive('Employee ID must be a positive number'),
    grade: Yup.string().required('Grade is required'),
    basic_salary: Yup.number().required('Basic salary is required').positive('Salary must be positive'),
    resident_allowance: Yup.number().min(0, 'Resident Allowance cannot be negative'),
    responsibility_allowance: Yup.number().min(0, 'Responsibility Allowance cannot be negative'),
    transport_allowance: Yup.number().min(0, 'Transport Allowance cannot be negative'),
    income_tax: Yup.number().min(0, 'Income Tax cannot be negative').required('Income Tax is required'),
    social_security_contribution: Yup.number().min(0, 'Social Security Contribution cannot be negative').required('Social Security Contribution is required'),
  });

  const formik = useFormik({
    initialValues: {
      employee_id: '',
      grade: '',
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
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/v1/payrolls/addPayroll`, values, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            withCredentials: true
          }
        });
        onClose();
        window.location.reload()
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

  useEffect(() => {
    if (formik.values.employee_id) {
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/employees/getSingleEmployee/${formik.values.employee_id}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          withCredentials: true
        },
      })
        .then(response => {
          setEmployeePosition(response.data.position);
          // window.location.reload()
        })
        .catch(error => {
          console.error('Error fetching employee data:', error);
          setEmployeePosition('');
        });
    }
  }, [formik.values.employee_id]);

  return (
    <form onSubmit={formik.handleSubmit} className="w-full max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add Payroll</h2>
      <p className="text-red-500 text-center mb-4">{serverError}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Employee ID */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Employee ID</label>
          <input type="number" name="employee_id" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.employee_id} className="input-field" />
          {formik.touched.employee_id && formik.errors.employee_id && <p className="text-red-500 text-sm">{formik.errors.employee_id}</p>}
        </div>

        {/* Grade */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Grade</label>
          <input type="text" name="grade" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.grade} className="input-field" />
          {formik.touched.grade && formik.errors.grade && <p className="text-red-500 text-sm">{formik.errors.grade}</p>}
        </div>

        {/* Basic Salary */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Basic Salary</label>
          <input type="number" name="basic_salary" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.basic_salary} className="input-field" />
          {formik.touched.basic_salary && formik.errors.basic_salary && <p className="text-red-500 text-sm">{formik.errors.basic_salary}</p>}
        </div>

        {/* Resident Allowance */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Resident Allowance</label>
          <input type="number" name="resident_allowance" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.resident_allowance} className="input-field" />
          {formik.touched.resident_allowance && formik.errors.resident_allowance && <p className="text-red-500 text-sm">{formik.errors.resident_allowance}</p>}
        </div>

        {/* Responsibility Allowance or Transport Allowance */}
        {employeePosition === 'cleaner' ? (
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-1">Responsibility Allowance</label>
            <input type="number" name="responsibility_allowance" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.responsibility_allowance} className="input-field" />
            {formik.touched.responsibility_allowance && formik.errors.responsibility_allowance && <p className="text-red-500 text-sm">{formik.errors.responsibility_allowance}</p>}
          </div>
        ) : (
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-1">Transport Allowance</label>
            <input type="number" name="transport_allowance" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.transport_allowance} className="input-field" />
            {formik.touched.transport_allowance && formik.errors.transport_allowance && <p className="text-red-500 text-sm">{formik.errors.transport_allowance}</p>}
          </div>
        )}

        {/* Income Tax */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Income Tax</label>
          <input type="number" name="income_tax" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.income_tax} className="input-field" />
          {formik.touched.income_tax && formik.errors.income_tax && <p className="text-red-500 text-sm">{formik.errors.income_tax}</p>}
        </div>

        {/* Social Security */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Social Security Contribution</label>
          <input type="number" name="social_security_contribution" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.social_security_contribution} className="input-field" />
          {formik.touched.social_security_contribution && formik.errors.social_security_contribution && <p className="text-red-500 text-sm">{formik.errors.social_security_contribution}</p>}
        </div>
      </div>

      <button type="submit" className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-lg w-full font-semibold hover:bg-blue-700 transition duration-200">Submit Payroll</button>

      {message && <p className="mt-4 text-green-600 text-center text-lg">{message}</p>}
    </form>
  );
};

export default PayrollForm;
