import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AiOutlineClose, AiOutlinePrinter, AiOutlineEdit, AiOutlineCalendar, AiOutlineClockCircle } from 'react-icons/ai'; // Importing necessary icons
import logo from '../../assets/logo.jpeg'
import logo1 from '../../assets/logo1.png'
const ItemDetailModal = () => {
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/stocks/single_items/${id}`);
        setItem(response.data);
      } catch (error) {
        setError('Failed to fetch item details.');
      }
    };
    fetchItemDetails();
  }, [id]);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Item Details</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .print-container { padding: 20px; }
            .item-header { text-align: center; }
            .item-header img { width: 100px; height: 100px; }
            .item-details { margin-top: 20px; margin:auto; }
            h2 { font-size: 24px; }
            p { font-size: 16px; }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="item-header">
              <img src="${process.env.REACT_APP_BACKEND_URL}/uploads/items/${item.item_pic}" alt="${item.item_name}" />
              <h2>${item.item_name}</h2>
            </div>
            <div class="item-details">
              <p><strong>Description:</strong> ${item.description}</p>
              <p><strong>Quantity:</strong> ${item.quantity}</p>
              <p><strong>Transaction Type:</strong> ${item.transactions_type}</p>
              <p><strong>Date:</strong> ${new Date(item.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${new Date(item.date).toLocaleTimeString()}</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!item) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Item Details</h2>
        <div className="header flex justify-between items-center space-x-2">
          <img className='w-32 headerlogo  border-none' src={logo} alt="log" />
          <img className='w-16 border-none ' src={logo1} alt="log" />
        </div>
        <div className="text-header pb-4">
          <h1 className='text-center'>𝔓𝔯𝔢𝔰𝔦𝔡𝔢𝔫𝔱 ℑ𝔫𝔱𝔢𝔯𝔫𝔞𝔱𝔦𝔬𝔫𝔞𝔩 𝔞𝔴𝔞𝔯𝔡</h1>
          <p className='text-center text-xs text-gray-800 '>P.O.Box 34567, Bakau opposite friendship hotel</p>
        </div>
        <div className="py-4 px-2 w-full mx-auto">
          <div className="header w-full text-center">
            <img
              src={`${process.env.REACT_APP_BACKEND_URL}/uploads/items/${item.item_pic}`}
              alt={item.name}
              className="w-32 h-32  mx-auto mb-4 "
            />
            <h3 className="text-xl font-bold mt-4 capitalize">
              {item.item_name}
            </h3>
          </div>
          <hr className="my-4" />
          <p className="text-gray-700 mt-2 text-center">
            {/* <AiOutlineInfoCircle className="inline-block mr-2" /> */}
            Description: {item.description}
          </p>
          <hr className="my-4" />

          <div className="flex space-x-0 items-center justify-between mx-auto px-8 py-2 w-full">
            <p className="text-gray-700 mt-2">

              Quantity: {item.quantity}
            </p>
            <p className="text-gray-700 mt-2">

              Transaction Type: {item.transactions_type}
            </p>
          </div>
          <div className="flex space-x-0 items-center justify-between mx-auto px-8 py-2">
            <p className="text-gray-700 mt-2">
              <AiOutlineCalendar className="inline-block mr-2" />
              Date: {new Date(item.date).toLocaleDateString()}
            </p>
            <p className="text-gray-700 mt-2">
              <AiOutlineClockCircle className="inline-block mr-2" />
              Time: {new Date(item.date).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <Link to="/dashboard/stocks/stock_list" className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
            <AiOutlineClose className="mr-2" /> Close
          </Link>
          <button
            onClick={handlePrint}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            <AiOutlinePrinter className="mr-2" /> Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;
