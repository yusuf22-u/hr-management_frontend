// src/components/StudentLevelDistribution.js
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

const StudentLevelDistribution = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLevelDistribution = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/student/level`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });

        const counts = response.data;

        const labels = counts.map(item => item.level_of_entry); // Level labels
        const values = counts.map(item => item.count); // Corresponding counts

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Number of Students in each level',
              data: values,
              backgroundColor:['#FFD700','#b7b7b7','#CD7F32'],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching student level distribution:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLevelDistribution();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg w-full shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Student Level Distribution</h2>
      {loading ? (
        <div>Loading chart...</div>
      ) : (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default StudentLevelDistribution;
