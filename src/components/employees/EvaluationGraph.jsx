import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import axios from "axios"; // Make sure to import axios
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Colors,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EvaluationGraph = () => {
    const [data, setData] = useState(null); // Ensure initial value is null
    const { id } = useParams();

    useEffect(() => {
        const fetchingData = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/v1/evaluations/rates/${id}`,{
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    }
                });
                console.log('Evaluation Data:', res.data);
                setData(res.data); // Set data from API
            } catch (error) {
                console.log("Error fetching data:", error);
            }
        };
        fetchingData();
    }, [id]);

    if (!data) {
        return <div>Loading...</div>; // You can add a loading state while data is being fetched
    }

    // Define labels for each evaluation criterion
    const labels = [
        "Communication",
        "Technical Skills",
        "Teamwork",
        "Problem Solving",
        "Punctuality",
        "Responsibility",
        "Expertise",
        "Dependability",
        "Reliability",
        "Skills",
    ];

    // Directly extract values from the fetched data object
    const values = [
        data.communication_skills,
        data.technical_skills,
        data.teamwork,
        data.problem_solving,
        data.punctuality,
        data.responsibility,
        data.expertise,
        data.dependability,
        data.reliability,
        data.skills,
    ];

    // Chart.js Data
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: "Evaluation Scores",
                data: values,
                backgroundColor: [
                    "rgba(54, 162, 235, 0.6)", // Blue
                    "rgba(255, 99, 132, 0.6)", // Red
                    "rgba(75, 192, 192, 0.6)", // Green
                    "rgba(255, 206, 86, 0.6)", // Yellow
                    "rgba(153, 102, 255, 0.6)", // Purple
                    "rgba(255, 159, 64, 0.6)", // Orange
                    "rgba(199, 199, 199, 0.6)", // Gray
                    "rgba(83, 102, 255, 0.6)", // Dark Blue
                    "rgba(255, 69, 0, 0.6)", // Dark Red
                    "rgba(46, 204, 113, 0.6)", // Light Green
                ],
                borderColor: "rgba(0, 0, 0, 0.1)",
                borderWidth: 1,
            },
        ],
    };

    // Chart.js Options
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                
                text: `Employee Evaluation Scores ${data.overall_performance}%`,
                font: {
                    size: 18,
                    
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 10, // Since scores are out of 10
            },
        },
    };

    return (
        <>
        <div className="flex lg:h-full flex-col sm:flex-row justify-between bg-white p-4 sm:p-6 rounded-lg shadow-md space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Left section: Employee Details */}
            <div className="flex lg:ml-8 flex-col lg:items-center items-center space-y-1 lg:justify-center sm:items-start text-center sm:text-left">
                <h1 className="text-gray-600 text-xl sm:text-2xl font-semibold capitalize">Employee</h1>
                <img
                    src={`http://localhost:4000/uploads/profile/${data.profile_pic}`}
                    alt="Employee"
                    className="w-32 sm:w-40 h-32 sm:h-40 rounded-full border-4  shadow-lg mb-4"
                />
                <h3 className="text-lg sm:text-xl font-serif capitalize text-gray-800 mb-1">{data.full_name}</h3>
                <h3 className="text-sm sm:text-lg text-blue-500 italic capitalize mb-2">{`(${data.position})`}</h3>
                <h3 className="text-sm sm:text-md text-gray-500 font-serif">{data.department}</h3>
            </div>
    
            {/* Right section: Bar chart */}
            <div className="w-full sm:w-2/3 lg:w-1/2 lg:h-auto lg:space-x-8">
                <Bar data={chartData} options={options} />
            </div>
        </div>
    </>
    
    )
};

export default EvaluationGraph;
