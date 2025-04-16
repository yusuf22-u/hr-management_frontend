import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ScoreGraph = () => {
    const [performanceData, setPerformanceData] = useState(null);
    const [currentMonth, setCurrentMonth] = useState("");

    useEffect(() => {
        axios.get("http://localhost:4000/v1/evaluations/scoreDistribution",{
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            }
        })
            .then(response => {
                setPerformanceData(response.data);
                setCurrentMonth(response.data.current_month); // Get the current month
            })
            .catch(error => console.error("Error fetching performance data:", error));
    }, []);

    if (!performanceData) return <p>Loading chart...</p>;

    // Chart Data
    const chartData = {
        labels: ["Above 90", "Above 60", "Below 59", "Below 49"],
        datasets: [
            {
                label: "Employees Satistic ",
                data: [
                    performanceData.above_90,
                    performanceData.above_60,
                    performanceData.below_59,
                    performanceData.below_49
                ],
                backgroundColor: ["#4caf50", "#2196f3", "#ff9800", "#f44336"],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: `Overall Performance for ${currentMonth}`,
                font: { size: 20 },
            },
        },
    };

    return (
        <div className="w-full max-w-lg mx-auto lg:w-full lg:h-1/2 lg:p-12 p-6 rounded-lg shadow-lg">
            <Bar className="lg:h-[300px]"  data={chartData} options={chartOptions}  />
        </div>
    );
};

export default ScoreGraph;
