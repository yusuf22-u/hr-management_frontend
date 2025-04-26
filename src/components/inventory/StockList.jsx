import React, { useEffect, useState } from 'react';
import { FaTrash, FaBoxOpen } from 'react-icons/fa'; // Importing some icons
import axios from 'axios'; // For making HTTP requests
import { Link } from 'react-router-dom';
import { AiOutlineDownload, AiOutlinePlus, AiOutlineUpload, AiOutlineBarChart } from 'react-icons/ai';
import Modal from '../Model';
import StockForm from './StockForm';
import { AiFillEdit } from 'react-icons/ai';

const StockList = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stock_In, setStock_In] = useState(0)
    const [stock_Out, setStock_Out] = useState(0)
    const [totalStockOutQuantity, setTotalStockOutQuantity] = useState(0);
    const [totalStockInQuantity, setTotalStockInQuantity] = useState(0);

    useEffect(() => {
        fetchStockList();
    }, []);
    console.log('first', stocks)

    const fetchStockList = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/stocks/stock_list`,{
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                },
            });
            const { result, totalStock_In, totalStock_Out } = response.data;
            setStocks(result);
            setStock_In(totalStock_In)
            setStock_Out(totalStock_Out)
            setLoading(false);
            // Calculate total quantity of stock-out items
            const totalStockIn = result
                .filter(stock => stock.transactions_type === 'stock-in') // Filter items with "stock-out"
                .reduce((acc, curr) => acc + curr.quantity, 0); // Sum their quantities

            setTotalStockInQuantity(totalStockIn);
            // Calculate total quantity of stock-out items
            const totalStockOut = result
                .filter(stock => stock.transactions_type === 'stock-out') // Filter items with "stock-out"
                .reduce((acc, curr) => acc + curr.quantity, 0); // Sum their quantities

            setTotalStockOutQuantity(totalStockOut);
        } catch (error) {
            setError('Failed to fetch stock data.');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this stock?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/v1/stocks/delete_stock/${id}`,{
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    },
                });
                setStocks(stocks.filter(stock => stock.id !== id));
            } catch (error) {
                setError('Failed to delete the stock.');
            }
        }
    };

    // onClose function to close the modal
    const onClose = () => {
        setIsModalOpen(false);
    };

    if (loading) return <div>Loading stocks...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Stock List</h1>
            <div className="px-2 py-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Stock-in Card */}
                    <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-indigo-500 p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
                        <div className="text-white text-center mx-auto space-y-2">
                            <h2 className="text-2xl font-bold">Stock-in</h2>
                            <AiOutlineDownload className="text-4xl mx-auto" />
                            <p className="text-lg font-semibold rounded-full bg-red-400 text-white">{stock_In}</p>
                            <p className="text-md">Total quantity {totalStockInQuantity}</p>
                        </div>
                    </div>

                    {/* Stock-out Card */}
                    <div className="flex items-center justify-between bg-gradient-to-r from-pink-500 to-red-500 p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
                        <div className="text-white mx-auto text-center space-y-2">
                            <h2 className="text-2xl font-bold">Stock-out</h2>
                            <AiOutlineUpload className="text-4xl mx-auto" />
                            <p className="text-lg font-semibold rounded-full bg-blue-400 text-white">{stock_Out}</p>
                            <p className="text-md">Total quantity {totalStockOutQuantity}</p>
                        </div>
                    </div>

                    {/* Total Stock Card */}
                    <div className="flex items-center justify-between bg-gradient-to-r from-green-500 to-teal-500 p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
                        <div className="text-white mx-auto text-center space-y-2">
                            <h2 className="text-2xl font-bold">Total Stocks</h2>
                            <AiOutlineBarChart className="text-4xl mx-auto" />
                            <p className="text-lg font-semibold">{totalStockInQuantity + totalStockOutQuantity}</p>
                        </div>
                    </div>
                </div>

                <Link
                    className="px-4 mt-4 w-1/6 py-2 text-green-600 hover:bg-green-900 hover:text-white bg-white font-semibold rounded-lg shadow-md transition duration-300 flex items-center"
                    onClick={() => setIsModalOpen(true)}
                >
                    <AiOutlinePlus size={24} className="mr-2" />
                    <span>Add stock</span>
                </Link>
            </div>

            {/* Stock Form Modal */}
            <Modal isOpen={isModalOpen} onClose={onClose}>
                <StockForm onClose={onClose} />
            </Modal>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-800 text-white text-left">
                            <th className="py-3 px-4">Item</th>
                            <th className="py-3 px-4">Image</th>
                            <th className="py-3 px-4">Transaction Type</th>
                            <th className="py-3 px-4">Quantity</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stocks.map(stock => (
                            <tr key={stock.id} className="border-b hover:bg-gray-100">
                                <td className="py-3 px-4">{stock.item_name}</td>
                                <td className="py-3 px-4">
                                    <img
                                        src={`${stock.item_image_url}`}
                                        alt={stock.name}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                </td>
                                <td className="py-3 px-4">{stock.transactions_type}</td>
                                <td className="py-3 px-4">{stock.quantity}</td>
                                <td className="py-3 px-4">{new Date(stock.date).toLocaleDateString()}</td>
                                <td className="py-3 px-4">
                                    <button
                                        className="text-red-600 hover:text-red-800 mr-2"
                                        onClick={() => handleDelete(stock.id)}
                                    >
                                        <FaTrash /> {/* Trash icon for delete */}
                                    </button>
                                    <Link to={`/dashboard/view/stock/${stock.id}`} className="text-blue-600 hover:text-blue-800">
                                        <FaBoxOpen /> {/* Edit or view stock details icon */}
                                    </Link>
                                    <Link to={`/dashboard/update/stock/${stock.id}`} className="text-blue-600 hover:text-blue-800">
                                        < AiFillEdit color='green'/> {/* Edit or view stock details icon */}
                                    </Link>
                                    
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
        </div>
    );
};

export default StockList;
