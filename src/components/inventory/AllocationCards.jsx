import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AiFillEdit, AiFillDelete, AiOutlineEye, AiOutlinePlus } from 'react-icons/ai';
import { MdUndo,MdRedo } from 'react-icons/md'; // Importing the icon from React Icons
import { Link } from 'react-router-dom';



const AllocationCards = () => {
    const [allocations, setAllocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAllocations = async () => {
            try {
                const response = await axios.get('http://localhost:4000/v1/allocateItem/assign_list');
                setAllocations(response.data.data); // Adjust according to the response structure
                console.log('allow', response.data.data)
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
            await axios.delete(`http://localhost:4000/v1/allocateItem/delete_allocation/${id}`); // Adjust endpoint
            setAllocations(allocations.filter(allocation => allocation.id !== id));
        } catch (err) {
            setError('Error deleting allocation');
        }
    };



    const handleReturn = async (id) => {
        await axios.put(`http://localhost:4000/v1/allocateItem/return/${id}`); // Your API call
        setAllocations(prev =>
            prev.map(allocation =>
                allocation.id === id ? { ...allocation, returned_at: new Date(), is_returned: true } : allocation
            )
        );
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-600">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Item Allocations</h2>
            <Link to='/dashboard/items/list'>back</Link>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className='bg-indigo-600 text-white'>
                        <tr>
                            <th className="py-2 px-4 text-left">Employee Name</th>
                            <th className="py-2 px-4 text-left">Item Name</th>
                            <th className="py-2 px-4 text-left">Department</th>
                            <th className="py-2 px-4 text-left">Quantity</th>
                            <th className="py-2 px-4 text-left">Allocated Date</th>
                            <th className="py-2 px-4 text-left">Returned At</th>
                            <th className="py-2 px-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allocations.map((allocation) => (
                            <tr key={allocation.id} className="border-b">
                                <td className="py-2 px-4 capitalize">{allocation.employee_name}</td>
                                <td className="py-2 px-4 capitalize">{allocation.name}</td>
                                <td className="py-2 px-4 capitalize">{allocation.department}</td>
                                <td className="py-2 px-4">{allocation.quantity}</td>
                                <td className="py-2 px-4">{new Date(allocation.allocated_at).toLocaleDateString()}</td>
                                <td className="py-2 px-4">{allocation.returned_at ? new Date(allocation.returned_at).toLocaleDateString() : 'Not Returned'}</td>
                                <td className="py-2 px-4 flex space-x-2 items-center">
                                    <AiFillDelete
                                        size={20}
                                        className="text-red-600 hover:text-red-800 ml-2 cursor-pointer"
                                        onClick={() => handleDelete(allocation.id)}
                                    />

                                    <button
                                        onClick={() => handleReturn(allocation.id)}
                                        className={`flex items-center text-white font-semibold py-2 px-4 rounded transition duration-200 
                ${allocation.returned_at ? 'text-red-400 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-600 hover:text-white'}`}
                                        disabled={!!allocation.returned_at}
                                    >
                                       {allocation.returned_at ?  <MdUndo className="mr-2" />:<MdRedo className="mr-2"/>} 
                                        {/* {allocation.returned_at ? `Returned `: `Return`} */}
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
