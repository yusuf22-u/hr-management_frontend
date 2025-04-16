import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaLock, FaEnvelope, FaBook } from "react-icons/fa";
import bgImage from "../../assets/background/b3.jpg";

// Validation schema with Yup
const validationSchema = Yup.object({
  email: Yup.string().required("Email is required").email("Invalid email address"),
  password: Yup.string().required("Password is required"),
});

function LoginForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const loginBg = {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.post("http://localhost:4000/v1/login", values);
        const token = response.data.token;
        const decodedToken = jwtDecode(token);

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("role", decodedToken.role);
        sessionStorage.setItem("username", decodedToken.username);
        sessionStorage.setItem("profilePic", decodedToken.profilePic);
        sessionStorage.setItem("userId", decodedToken.userId);

        setTimeout(() => {
          setLoading(false);
          navigate("/dashboard");
        }, 2000); // 2 seconds delay
      } catch (error) {
        setLoading(false);
        setError(error.response?.data?.error || "An unexpected error occurred");
      }
    },
  });

  return (
    <div style={loginBg} className="relative flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
      {/* Full-screen Loading Spinner Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Login Form Container */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg lg:max-w-xl relative z-10">
        {/* Welcome Message */}
        <div className="text-center mb-6">
          <FaBook className="text-5xl text-blue-600 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-800 mt-3">
            Welcome to <span className="text-blue-600">Human Resource Management System</span>
          </h2>
          <p className="text-gray-600 mt-2">Manage staff efficiently and securely</p>
        </div>

        {/* Form Section */}
        <form onSubmit={formik.handleSubmit}>
          {error && <p className="text-red-500 text-center mb-3">{error}</p>}

          {/* Email Input */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <div className="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
              <span className="px-3">
                <FaEnvelope className="text-gray-500" />
              </span>
              <input
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2 focus:outline-none"
                placeholder="Enter your email"
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-600 text-sm mt-1">{formik.errors.email}</div>
            )}
          </div>

          {/* Password Input */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <div className="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
              <span className="px-3">
                <FaLock className="text-gray-500" />
              </span>
              <input
                type="password"
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2 focus:outline-none"
                placeholder="Enter your password"
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-600 text-sm mt-1">{formik.errors.password}</div>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300"
            disabled={loading}
          >
            Login
          </button>

          {/* Forgot Password */}
          <div className="text-center mt-4">
            <Link to="/forgotPassword" className="text-blue-500 hover:underline">
              Forgot your password?
            </Link>
          </div>

          {/* Register Link */}
          <div className="mt-4 text-center">
            <p className="text-gray-700">
              Don't have an account?{" "}
              <Link to="/" className="text-blue-500 font-bold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
