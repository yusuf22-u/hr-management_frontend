// src/components/GenderMaritalStatusChart.js
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

const GenderMaritalStatusChart = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGenderAndMaritalStatusCounts = async () => {
            try {
                const response = await axios.get('http://localhost:4000/v1/student/genderMaritalStatusCounts', {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                });

                const counts = response.data;
                const labels = counts.map(item => `${item.gender} - ${item.marital_status}`);
                const countsData = counts.map(item => item.count);

                // Generate random colors for each bar
                const colors = countsData.map(() => {
                    return `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`;
                });

                setData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Count',
                            data: countsData,
                            backgroundColor: ['#4CAF50', '#F44336','#F44356','#f54278'],
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching gender and marital status counts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGenderAndMaritalStatusCounts();
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Gender and Marital Status Distribution</h2>
            {loading ? (
                <div>Loading chart...</div>
            ) : (
                <Bar data={data} />
            )}
        </div>
    );
};

export default GenderMaritalStatusChart;
