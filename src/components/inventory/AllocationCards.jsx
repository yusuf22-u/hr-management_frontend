import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AiFillDelete } from 'react-icons/ai';
import { MdUndo, MdRedo } from 'react-icons/md';
import { Link } from 'react-router-dom';

const AllocationCards = () => {
    const [allocations, setAllocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAllocations = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/allocateItem/assign_list`,{
                    headers: {  'Authorization': `Bearer ${sessionStorage.getItem('token')}`, },
                });
                setAllocations(response.data.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching allocation data');
                setLoading(false);
            }
        };
        fetchAllocations();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/v1/allocateItem/delete_allocation/${id}`,{
                headers: {  'Authorization': `Bearer ${sessionStorage.getItem('token')}`, },
            });
            setAllocations(allocations.filter(allocation => allocation.id !== id));
        } catch (err) {
            setError('Error deleting allocation');
        }
    };

    const handleReturn = async (id) => {
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/v1/allocateItem/return/${id}`,{},{
                headers: {  'Authorization': `Bearer ${sessionStorage.getItem('token')}`, },
            });
            setAllocations(prev =>
                prev.map(allocation =>
                    allocation.id === id ? { ...allocation, returned_at: new Date(), is_returned: true } : allocation
                )
            );
        } catch (err) {
            setError('Error updating return status');
        }
    };

    if (loading) return <div className="text-center text-indigo-600 font-semibold mt-10">Loading allocations...</div>;
    if (error) return <div className="text-red-600 text-center mt-4">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-indigo-700">Item Allocations</h2>
                <Link
                    to="/dashboard/items/list"
                    className="text-indigo-600 border border-indigo-600 px-4 py-2 rounded hover:bg-indigo-600 hover:text-white transition"
                >
                    Back to Items
                </Link>
            </div>

            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-indigo-600 text-white">
                        <tr>
                            <th className="px-4 py-3">Employee</th>
                            <th className="px-4 py-3">Item No</th>
                            <th className="px-4 py-3">Item</th>
                            <th className="px-4 py-3">Department</th>
                            <th className="px-4 py-3">Quantity</th>
                            <th className="px-4 py-3">Allocated At</th>
                            <th className="px-4 py-3">Returned</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {allocations.map((allocation) => (
                            <tr key={allocation.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 capitalize">{allocation.employee_name}</td>
                                <td className="px-4 py-3 capitalize">{allocation.item_number}</td>
                                <td className="px-4 py-3 capitalize">{allocation.name}</td>
                                <td className="px-4 py-3 capitalize">{allocation.department}</td>
                                <td className="px-4 py-3">{allocation.quantity}</td>
                                <td className="px-4 py-3">
                                    {new Date(allocation.allocated_at).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                    {allocation.returned_at ? (
                                        <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                            {new Date(allocation.returned_at).toLocaleDateString()}
                                        </span>
                                    ) : (
                                        <span className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">
                                            Not Returned
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-center space-x-2 flex justify-center items-center">
                                    <button
                                        onClick={() => handleDelete(allocation.id)}
                                        className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600"
                                        title="Delete"
                                    >
                                        <AiFillDelete size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleReturn(allocation.id)}
                                        className={`flex items-center px-3 py-1 rounded-full text-sm font-medium transition duration-200 
                                            ${allocation.returned_at
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                                        disabled={!!allocation.returned_at}
                                        title={allocation.returned_at ? "Already returned" : "Mark as returned"}
                                    >
                                        {allocation.returned_at ? <MdUndo size={18} /> : <MdRedo size={18} />}
                                        <span className="ml-1">{allocation.returned_at ? 'Returned' : 'Return'}</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllocationCards;
