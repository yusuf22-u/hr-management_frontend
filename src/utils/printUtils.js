// src/utils/printUtils.js

export const handlePrint = (contentId) => {
    const content = document.getElementById(contentId).innerHTML;
    const printWindow = window.open('', '_blank');
    const tailwindCssPath = '/src/index.css'; // Adjust path as needed

    printWindow.document.write(`
        <html>
            <head>
                <title>Print Evaluation</title>
                <link rel="stylesheet" href="${tailwindCssPath}">
                <style>
                    /* Add any inline styles specific to printing here */
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                        background: blue; /* You might want to remove this background color */
                    }
                    .evaluation-card {
                        background-color: white;
                        padding: 30px;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        width: 100%;
                        max-width: 800px;
                        margin: auto;
                    }
                    .evaluation-card img {
                        width: 150px;
                        height: 150px;
                        object-fit: cover;
                        border-radius: 50%;
                        border: 5px solid #1E90FF;
                    }
                    .evaluation-card h2 {
                        font-size: 24px;
                        color: #1E90FF;
                    }
                    .evaluation-card p {
                        color: #555;
                        font-size: 18px;
                    }
                    .grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 10px;
                    }
                    .score-bar-container {
                        width: 100%;
                        background-color: #e0e0e0; /* Light gray background for the bar */
                        border-radius: 5px;
                        margin-bottom: 8px;
                    }
                    .score-bar {
                        height: 24px;
                        border-radius: 5px;
                        color: white;
                        text-align: center;
                        line-height: 24px; /* Center text vertically */
                        font-weight: bold;
                    }
                    .score-bar.communication-skills { background-color: #1e90ff; } /* Blue */
                    .score-bar.technical-skills { background-color: #32cd32; } /* Green */
                    .score-bar.teamwork { background-color: #ffa500; } /* Orange */
                    .score-bar.problem-solving { background-color: #ff6347; } /* Tomato */
                    .score-bar.punctuality { background-color: #ff69b4; } /* Hot pink */
                    .score-bar.overall-performance { background-color: #9370db; } /* Medium purple */

                    @media print {
                        .print-button {
                            display: none;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="evaluation-card">
                    ${content}
                </div>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
};
