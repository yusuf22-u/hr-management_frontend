import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const UserAccount = () => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:4000/v1/account", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        console.log("Error fetching user data:", err);
      }
    };

    fetchUser();
  }, [user]);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    profile: Yup.mixed().nullable(),
  });

  const handleUpdate = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("email", values.email);
      if (values.profile) {
        formData.append("profile", values.profile);
      }

      await axios.put("http://localhost:4000/v1/accountUpdate", formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile updated successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Error updating account:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        {user ? (
          <div className="text-center">
            <h2 className="text-center p-2 text-gray-700 capitalize">My Account</h2>
            <div className="w-24 h-24 mx-auto mb-4">
              <img
                src={`http://localhost:4000/uploads/userpic/${user.profile}`}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-2 border-gray-300"
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">{user.username}</h2>
            <p className="text-gray-500">{user.role}</p>
            <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>

            {/* Edit Profile Button */}
            <button
              onClick={() => setShowModal(true)}
              className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading user data...</p>
        )}
      </div>

      {/* Modal for Edit Profile */}
      {showModal && user && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white shadow-lg p-6 rounded-lg w-96">
            <h2 className="text-center text-gray-700 capitalize p-4 font-bold">Edit Your Account</h2>

            <Formik
              initialValues={{
                username: user.username || "",
                email: user.email || "",
                profile: null,
              }}
              validationSchema={validationSchema}
              onSubmit={handleUpdate}
            >
              {({ setFieldValue }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Username</label>
                    <Field
                      type="text"
                      name="username"
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your username"
                    />
                    <ErrorMessage name="username" component="p" className="text-red-500 text-sm" />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Email</label>
                    <Field
                      type="email"
                      name="email"
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                    />
                    <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Profile Picture</label>
                    <input
                      type="file"
                      name="profile"
                      accept="image/png, image/jpeg, image/jpg"
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      onChange={(event) => setFieldValue("profile", event.currentTarget.files[0])}
                    />
                    <ErrorMessage name="profile" component="p" className="text-red-500 text-sm" />
                  </div>

                  <button
                    type="submit"
                    className="bg-green-500 text-white p-2 w-full rounded-md hover:bg-green-600"
                  >
                    Update Account
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="mt-2 bg-red-500 text-white p-2 w-full rounded-md hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAccount;
