import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiFillEdit, AiFillDelete, AiOutlineEye, AiOutlinePlus } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import InventoryForm from './InventoryForm'; // Adjust the import path accordingly
import Modal from '../Model';
import { FiBox } from 'react-icons/fi';
import { FaTrash, FaBoxOpen } from 'react-icons/fa'; 
import { FaClipboardList } from 'react-icons/fa';



const DisplayItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState(''); // State for search
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Fetch items from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/items/item_list?page=${currentPage}&limit=${itemsPerPage}`);
        setItems(response.data.items);
        setFilteredItems(response.data.items); // Initialize filtered items
        setTotalPages(response.data.totalPages); // Assuming your API returns total pages
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch items');
        setLoading(false);
      }
    };
    fetchItems();
  }, [currentPage, itemsPerPage]); // Update when currentPage or itemsPerPage changes

  // Handle search functionality
  const handleSearch = () => {
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/v1/items/deleteItem/${id}`).then(result => {
      if (result.data.Status) {
        window.location.reload();
      }
    }).catch(err => {
      console.log(err);
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Pagination buttons logic
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  return (
    <div className="container mx-auto p-3">
      <h2 className="text-3xl font-bold text-center px-2 pb-2">Inventory Management</h2>
      <div className="bg-white p-6 rounded-lg shadow-md text-white mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 hover:bg-blue-300 hover:text-white border border-gray-100 px-2 py-2 rounded-md">
            <Link to='/dashboard/items/allocate_list' className='flex flex-col  hover:text-white space-y-2 items-center'>
            <span className='text-gray-700 hover:text-white'>Assigned Items</span>
            <FiBox size={40} />
            </Link>
          </div>
          <div className="text-gray-500 hover:text-white hover:bg-blue-300 border border-gray-100 px-2 py-2 rounded-md">
            <Link to='/dashboard/stocks/stock_list' className='flex flex-col space-y-2 items-center'>
            <span className='text-gray-900'>Stocks In Store</span>
            < FaBoxOpen size={40} />
            </Link>
          </div>
          <div className="flex flex-col md:flex-row space-x-0 md:space-x-4 items-center">
            <div className="flex items-center space-x-2 text-gray-600">
              <input
                type="text"
                name="search"
                value={search}
                placeholder="Search by name"
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSearch} // Call search function
                className="bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-all"
              >
                Search
              </button>
              <button
                onClick={() => { setSearch(''); setFilteredItems(items); }} // Reset search
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow-md hover:bg-gray-400 transition-all"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between space-x-2 mt-[-20px] items-center pb-4">
        <button
          className="px-4 py-2 text-green-600 hover:bg-green-900 hover:text-white bg-white font-semibold rounded-lg shadow-md transition duration-300 flex items-center"
          onClick={() => setIsModalOpen(true)}
        >
          <AiOutlinePlus size={24} className="mr-2" />
          <span>Add Item</span>
        </button>

        <div className="mb-4">
        <label htmlFor="itemsPerPage" className="mr-2">showing</label>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(parseInt(e.target.value, 10))}
          className="border rounded-md p-2 bg-white w-16"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      <span className='px-2'>  entries of {items.length} Items</span>
      </div>
        <Link
          className="px-4 py-2 bg-blue-600 flex hover:bg-white hover:text-green-800 text-white font-semibold rounded-lg shadow-md transition duration-300"
          to="/dashboard/items/allocate"
        >
          < FaClipboardList size={24}/>
         <span className='px-2'> Allocate Item</span>
        </Link>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <InventoryForm />
      </Modal>

     

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-300">
        <table className="min-w-full table-auto">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Image</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Quantity</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}/uploads/items/${item.image_url}`}
                    alt={item.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                
                  <Link to={`/dashboard/items_edit/${item.id}`}>
                    <AiFillEdit size={20} className="text-yellow-600 hover:text-yellow-800 ml-2" />
                  </Link>
                  <AiFillDelete
                    size={20}
                    className="text-red-600 hover:text-red-800 ml-2 cursor-pointer"
                    onClick={() => handleDelete(item.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 bg-indigo-600 text-white rounded-lg ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Previous
        </button>
        <p>Page {currentPage} of {totalPages}</p>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 bg-indigo-600 text-white rounded-lg ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DisplayItems;
