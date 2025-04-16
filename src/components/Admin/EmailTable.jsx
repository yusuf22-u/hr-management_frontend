import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaCheckCircle, FaRegCircle, FaCalendarAlt } from 'react-icons/fa'; // React Icons

const EmailTable = () => {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch email data from the backend API
    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const response = await axios.get('http://localhost:4000/v1/payrolls/message');  // Change to your actual endpoint
                setEmails(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching email data:', error);
                setLoading(false);
            }
        };

        fetchEmails();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Email Notifications</h2>
            
            {loading ? (
                <div className="text-center text-lg text-gray-500">Loading...</div>
            ) : (
                <div className="space-y-4">
                    {emails.map((email) => (
                        <div
                            key={email.id}
                            className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition duration-300"
                        >
                            <div className="flex items-center space-x-4">
                                <div>
                                    <FaEnvelope size={24} className="text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-800 truncate">{email.message}</h3>
                                    <p className="text-sm text-gray-500">{new Date(email.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {email.is_read ? (
                                        <FaCheckCircle size={20} className="text-green-500" />
                                    ) : (
                                        <FaRegCircle size={20} className="text-gray-400" />
                                    )}
                                </div>
                            </div>
                            <hr className="my-4 border-t border-gray-200" />
                            <div className="flex items-center justify-between">
                                <button className="text-sm text-blue-600 hover:underline">
                                    <FaCalendarAlt size={16} className="inline-block mr-1" />
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EmailTable;
