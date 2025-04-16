import { useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from 'react-toastify';
const AddCertificateForm = ({ employeeId }) => {
    const [message, setMessage] = useState("");

    // Validation schema using Yup
    const validationSchema = Yup.object().shape({
        employee_id: Yup.string().required("Employee ID is required"),
        certificate_name: Yup.string().required("Certificate name is required"),
        certificate_files: Yup.mixed().required("At least one certificate file is required"),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        const formData = new FormData();
        formData.append("employee_id", values.employee_id);
        formData.append("certificate_name", values.certificate_name);

        // Append all selected certificate files
        for (let i = 0; i < values.certificate_files.length; i++) {
            formData.append("certificate_files", values.certificate_files[i]);
        }

        try {
            const res = await axios.post("http://localhost:4000/v1/certificates/addCertificates", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success(res.data.message)
            // setMessage(res.data.message);
            resetForm();
        } catch (error) {
            // setMessage("Error adding certificates");
            toast.warning('Error deleting certificate', error.response?.data?.error || 'Something went wrong');
        
            console.log('erro',error)
        }
        setSubmitting(false);
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">Upload Certificates</h2>
            {message && <p className="text-green-500">{message}</p>}
            <Formik
                initialValues={{
                    employee_id: employeeId || "",
                    certificate_name: "",
                    certificate_files: null,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue, isSubmitting }) => (
                    <Form className="space-y-3">
                        {/* Employee ID */}
                        <label className="block font-medium">Employee ID</label>
                        <Field
                            type="text"
                            name="employee_id"
                            placeholder="Enter Employee ID"
                            className="w-full p-2 border rounded"
                        />
                        <ErrorMessage name="employee_id" component="p" className="text-red-500 text-sm" />

                        {/* Certificate Name */}
                        <label className="block font-medium">Certificate Name</label>
                        <Field
                            type="text"
                            name="certificate_name"
                            placeholder="Enter Certificate Name"
                            className="w-full p-2 border rounded"
                        />
                        <ErrorMessage name="certificate_name" component="p" className="text-red-500 text-sm" />

                        {/* File Upload */}
                        <label className="block font-medium">Upload Certificate(s)</label>
                        <input
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.png"
                            onChange={(event) => setFieldValue("certificate_files", event.currentTarget.files)}
                            className="w-full p-2 border rounded"
                        />
                        <ErrorMessage name="certificate_files" component="p" className="text-red-500 text-sm" />

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-500 text-white p-2 rounded w-full"
                        >
                            {isSubmitting ? "Uploading..." : "Upload Certificates"}
                        </button>
                    </Form>
                )}
            </Formik>
            <ToastContainer 
             position="top-center"
             className={'text-center'}/>
       </div>

     
    );
};

export default AddCertificateForm;
