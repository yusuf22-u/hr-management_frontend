import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';


// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend);

const EmployeeDistributionChart = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/v1/employees/distribution',{
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
              },
        });
        const data = response.data;

        const labels = data.map(item => item.department);
        const values = data.map(item => item.count);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Employee Distribution',
              data: values,
              backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
              ],
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching employee distribution data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 h-80 flex justify-center flex-col items-center">
      <h2 className="text-lg font-bold mb-4">Employee Distribution by Department</h2>
      {chartData.labels ? <Pie data={chartData}  /> : <p>Loading chart...</p>}
    </div>
  );
};

export default EmployeeDistributionChart;
