const UpdateRoleModal = ({ user, setShowModal, handleUpdateRole, newRole, setNewRole }) => {
//   console.log('users',user)
  
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div key={user.id} className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-center">Update User Role</h2>
                {/* User Details */}
                <div className="flex w-1/2 mx-auto flex-col space-y-2 items-center space-x-4 mb-4">
                    <img
                        src={`http://localhost:4000/uploads/userpic/${user.profile}`}
                        alt={user.username}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                        <h3 className="text-sm pt-1 pb-1  text-gray-600 capitalize">Username: <span className="text-blue-800 font-semibold italic">{user.username}</span> </h3>
                        <p className="text-sm text-gray-600 capitalize">Current Role: <span className="text-red-500 font-medium italic">{user.role}</span> </p>
                    </div>
                </div>

                {/* Update Role Form */}
                
                <div className="mb-4">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Select Role
                    </label>
                    <select
                        id="role"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="mt-1 pb-2 pt-2 px-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="award">Award</option>
                    </select>
                </div>
                <div className="flex justify-end gap-4">
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        onClick={() => setShowModal(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => handleUpdateRole(user.id)}
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
};
export default UpdateRoleModal