import { useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const AddCertificateForm = ({ employeeId }) => {
    const navigate = useNavigate()
    const[error, setError]=useState('')

    const validationSchema = Yup.object().shape({
        employee_id: Yup.string().required("Employee ID is required"),
        certificate_name: Yup.string().required("Certificate name is required"),
        certificate_files: Yup.mixed()
            .required("At least one certificate file is required")
            .test(
                "is-image",
                "Only image files (JPG, JPEG, PNG) are allowed",
                (value) => {
                    if (!value || value.length === 0) return false;
                    for (let i = 0; i < value.length; i++) {
                        if (!["image/jpeg", "image/jpg", "image/png"].includes(value[i].type)) {
                            return false;
                        }
                    }
                    return true;
                }
            ),
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
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/v1/certificates/upload_certificate`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                },
            });
            toast.success(res.data.message)
            // setMessage(res.data.message);
            resetForm();
            setError('')
        } catch (error) {
           
            const errorMessage = error.response?.data?.error || "Something went wrong!";
            setError(errorMessage);  // 
        }
        setSubmitting(false);
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-lg">
            <button onClick={()=>navigate(-1)} className="bg-blue-500 text-white p-2 rounded-md">back</button>
            <h2 className="text-xl font-bold mb-4 text-center">Upload Certificates</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
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
                            accept=".pdf,.jpeg.jpg,.png,.docx"
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
                className={'text-center'} />
        </div>


    );
};

export default AddCertificateForm;
