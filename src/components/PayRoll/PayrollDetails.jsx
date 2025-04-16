import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const PayrollDetails = () => {
  const [payroll, setPayroll] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/v1/payrolls/singlePayroll/${id}`);
        setPayroll(res.data);
      } catch (err) {
        console.error('Error fetching payroll data:', err);
      }
    };
    fetchPayroll();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleMarkAsPaid = async () => {
    try {
      await axios.put(`http://localhost:4000/v1/payrolls/paySingle/${id}`);
      alert('Salary marked as Paid!');
      setPayroll({ ...payroll, payment_status: 'Paid' });
    } catch (err) {
      console.error('Error updating payroll status:', err);
    }
  };

  // Calculate total deductions and gross salary
  const totalDeductions = payroll
    ? (parseFloat(payroll.income_tax) || 0) + (parseFloat(payroll.social_security_contribution) || 0)
    : 0;

  const grossSalary = payroll
    ? (parseFloat(payroll.basic_salary) || 0) + (parseFloat(payroll.resident_allowance) || 0) + (parseFloat(payroll.transport_allowance) || 0)
    : 0;

  if (!payroll) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white shadow-lg rounded-lg border border-gray-300 print:p-12 print:border-none">
      <div className="mb-6 flex justify-between items-center print:hidden">
        <Link className='bg-blue-500 text-white px-4 py-2 rounded' to={'/dashboard/payroll/List'}>Back</Link>
        {payroll.payment_status !== 'Paid' && (
          <button 
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition" 
            onClick={handleMarkAsPaid}
          >
            Mark as Paid
          </button>
        )}
      </div>

      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">President's International Award</h2>
      <div className="mb-4">
        <p><strong>Name:</strong> {payroll.full_name}</p>
        <p><strong>Month:</strong> {new Date(payroll.salary_date).toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-2 gap-6 border-t border-gray-300 pt-4">
        <div>
          <h3 className="font-semibold mb-2">Earnings</h3>
          <p>Basic Salary: {payroll.basic_salary}</p>
          <p>Resident Allowance: {payroll.resident_allowance}</p>
          <p>Transport Allowance: {payroll.transport_allowance}</p>
          <p className="mt-2 font-semibold">Gross Salary:D {grossSalary.toLocaleString()}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Deductions</h3>
          <p>Income Tax: {payroll.income_tax}</p>
          <p>Social Security Contributions : D {payroll.social_security_contribution}</p>
          <p className="mt-2 font-semibold">Total Deductions: D -{totalDeductions.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="mt-6 border-t border-gray-300 pt-4">
        <h3 className="font-semibold text-gray-500">Net Salary: D{Number(payroll.net_salary).toLocaleString()}</h3>
      </div>

      <div className="mt-12">
        <p><strong>Signature:</strong> ______________________</p>
      </div>

      <div className="text-center mt-6 print:hidden">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition" 
          onClick={handlePrint}
        >
          Print Payroll
        </button>
      </div>
    </div>
  );
};

export default PayrollDetails;
