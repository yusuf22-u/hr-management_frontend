import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiFillEdit, AiFillDelete, AiOutlinePlus, AiOutlineDollarCircle } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { FiBox } from 'react-icons/fi';
import { FaTrash, FaBoxOpen, FaClipboardList, FaFileExcel } from 'react-icons/fa';
import InventoryForm from './InventoryForm';

const DisplayItems = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalAmount, setTotalAmount] = useState(0);

  // Fetch Items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/items/item_list?page=${currentPage}&limit=${itemsPerPage}`, {
          headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` },
        });
        setItems(response.data.items);
        setFilteredItems(response.data.items);
        setTotalPages(response.data.totalPages);
        setTotalAmount(Number(response.data.totalAmount));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch items');
        setLoading(false);
      }
    };

    fetchItems();
  }, [currentPage, itemsPerPage]);

  const handleSearch = () => {
    const filtered = items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    setFilteredItems(filtered);
  };
console.log("items",items)
  const handleReset = () => {
    setSearch('');
    setFilteredItems(items);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/v1/items/deleteItem/${id}`, {
          headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` },
        });
        // Instead of reload, better to just refetch data
        const updatedItems = items.filter(item => item.id !== id);
        setItems(updatedItems);
        setFilteredItems(updatedItems);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  if (loading) return <div className="text-center text-gray-500 text-xl">Loading...</div>;
  if (error) return <div className="text-center text-red-600 text-xl">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Inventory Management</h2>

      {/* Top Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to='/dashboard/items/allocate_list' className='bg-white text-gray-700 hover:bg-indigo-600 hover:text-white p-6 rounded-lg shadow-md flex flex-col items-center'>
          <FiBox size={40} />
          <span className='mt-2 font-semibold'>Assigned Items</span>
        </Link>
        <Link to='/dashboard/stocks/stock_list' className='bg-white text-gray-700 hover:bg-indigo-600 hover:text-white p-6 rounded-lg shadow-md flex flex-col items-center'>
          <FaBoxOpen size={40} />
          <span className='mt-2 font-semibold'>Stocks In Store</span>
        </Link>
        <div className="flex items-center bg-gradient-to-r from-orange-400 to-red-400 p-4 rounded-xl shadow-md">
          <div className="w-full text-center">
            <AiOutlineDollarCircle className="mx-auto text-white w-10 h-10 mb-2" />
            <h2 className="text-base font-semibold text-white">Overall Items Total</h2>
            <p className="text-2xl font-bold text-white mt-1">
              D{totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end mb-6">
        <a
          href={`${process.env.REACT_APP_BACKEND_URL}/v1/items/donwload_items`}
          download target='__blank'
          className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 transition"
        >
          <FaFileExcel className="text-lg" />
          Download Items list to Excel
        </a>
      </div>

      {/* Search Box */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <input
            type="text"
            value={search}
            placeholder="Search by name"
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button onClick={handleSearch} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Search</button>
          <button onClick={handleReset} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400">Reset</button>
        </div>
      </div>

      {/* Top Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800">
          <AiOutlinePlus className="mr-2" /> Add Item
        </button>

        <div className="flex items-center space-x-2">
          <label htmlFor="itemsPerPage">Show</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
            className="border border-gray-300 rounded-md p-2"
          >
            {[5, 10, 15].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <span> entries of {items.length} Items</span>
        </div>

        <Link to="/dashboard/items/allocate" className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-white hover:text-green-800 border border-blue-600">
          <FaClipboardList className="mr-2" /> Allocate Item
        </Link>
      </div>

      {/* Inventory Form Modal */}
      {isModalOpen && (
        <InventoryForm isOpen={true} onClose={() => setIsModalOpen(false)} />
      )}

      {/* Items Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full table-auto">
          <thead className="bg-indigo-700 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Image</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Asset Number</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Physical Location</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Acquisition Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <img src={item.image_url} alt={item.name} className="h-12 w-12 rounded-full object-cover" />
                  </td>
                  <td className="px-6 py-4">{item.item_number}</td>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">{item.physical_location}</td>
                  <td className="px-6 py-4">{item.description}</td>
                  <td className="px-6 py-4">{item.amount}</td>
                  <td className="px-6 py-4">
                    {new Date(item.acquisition_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 flex space-x-2">
                    <Link to={`/dashboard/items_edit/${item.id}`}>
                      <AiFillEdit size={20} className="text-yellow-600 hover:text-yellow-800" />
                    </Link>
                    <AiFillDelete
                      size={20}
                      className="text-red-600 hover:text-red-800 cursor-pointer"
                      onClick={() => handleDelete(item.id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">No items found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 bg-indigo-600 text-white rounded-lg ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 bg-indigo-600 text-white rounded-lg ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DisplayItems;
