import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSort, FaSearch, FaHistory } from "react-icons/fa";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import UpdateRoleModal from "./UpdateRoleModal";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [sortBy, setSortBy] = useState("id");
    const [order, setOrder] = useState("ASC");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newRole, setNewRole] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, [sortBy, order, page, limit]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:4000/v1/users?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}`,
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                }
            );
            setUsers(response.data.data);
            // console.log('user1',response.data.data)
            setError("");
        } catch (err) {
            setError(err.response?.data?.error || "Error fetching users");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/v1/delete_user/${id}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
            });
            fetchUsers();
            alert("User deleted successfully!");
        } catch (err) {
            alert("Error deleting user!");
        }
    };

    const openModal = (user) => {
        setSelectedUser(user);
        setNewRole(user.role);
        setShowModal(true);
    };

    const handleUpdateRole = async () => {
        try {
            await axios.put(
                `http://localhost:4000/v1/update_users/role/${selectedUser.id}`,  {role: newRole},
                {
                  
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                }
            );
            setShowModal(false);
            fetchUsers();
            alert("User role updated successfully!");
        } catch (err) {
            alert("Error updating role!");
        }
    };

    const toggleOrder = () => {
        setOrder(order === "ASC" ? "DESC" : "ASC");
    };

    // Filtered users based on search term
    const filteredUsers = users.filter(
        (user) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">User Management</h1>
    
            {/* Top Controls */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    onClick={() => navigate(-1)}
                >
                    Back
                </button>
                <Link
                    to={"/dashboard/users/login_out/history"}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
                >
                    <FaHistory /> History Views
                </Link>
                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Search by username or email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <FaSearch className="absolute top-3 right-4 text-gray-400" />
                </div>
            </div>
    
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse border border-gray-300 rounded-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 border-b text-center">Profile</th>
                            <th
                                className="p-4 border-b text-left cursor-pointer"
                                onClick={() => setSortBy("username")}
                            >
                                Name <FaSort className="inline ml-1" />
                            </th>
                            <th
                                className="p-4 border-b text-left cursor-pointer"
                                onClick={() => setSortBy("email")}
                            >
                                Email <FaSort className="inline ml-1" />
                            </th>
                            <th className="p-4 border-b text-center">Role</th>
                            <th className="p-4 border-b text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="p-4 text-center align-middle">
                                        {user.profile ? (
                                            <img
                                                src={`http://localhost:4000/uploads/userpic/${user.profile}`}
                                                alt={user.username}
                                                className="w-12 h-12 object-cover rounded-full mx-auto"
                                            />
                                        ) : (
                                            "No Image"
                                        )}
                                    </td>
                                    <td className="p-4 border-b align-middle">{user.username}</td>
                                    <td className="p-4 border-b align-middle">{user.email}</td>
                                    <td className="p-4 border-b text-center align-middle">{user.role}</td>
                                    <td className="p-4 border-b text-center align-middle">
                                        <div className="flex justify-center gap-4">
                                            <button
                                                className="text-blue-500 hover:text-blue-700"
                                                onClick={() => openModal(user)}
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
    
            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
                <button
                    className={`px-4 py-2 rounded ${
                        page === 1
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                    Previous
                </button>
                <span className="text-gray-700">
                    Page {page} | Limit:{" "}
                    <select
                        value={limit}
                        onChange={(e) => setLimit(parseInt(e.target.value))}
                        className="border rounded px-2 py-1"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                    </select>
                </span>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => setPage((prev) => prev + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    
        {/* Modal */}
        {showModal && selectedUser && (
            <UpdateRoleModal
                user={selectedUser}
                setShowModal={setShowModal}
                handleUpdateRole={handleUpdateRole}
                newRole={newRole}
                setNewRole={setNewRole}
            />
        )}
    </div>
    
    );
};

export default UserManagement;
