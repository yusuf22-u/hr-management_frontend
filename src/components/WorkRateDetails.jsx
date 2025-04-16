import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FaComments, FaUserTie, FaToolbox, FaUsers, FaClock, FaTasks, FaShieldAlt, FaStar, FaCheckCircle, FaCogs } from 'react-icons/fa';

const skillsData = [
    { label: "Communication", key: "communication_skills", color: "from-green-400 to-green-600", icon: <FaComments /> },
    { label: "Technical Skills", key: "technical_skills", color: "from-blue-400 to-blue-600", icon: <FaToolbox /> },
    { label: "Teamwork", key: "teamwork", color: "from-yellow-400 to-yellow-600", icon: <FaUsers /> },
    { label: "Problem Solving", key: "problem_solving", color: "from-red-400 to-red-600", icon: <FaTasks /> },
    { label: "Punctuality", key: "punctuality", color: "from-purple-400 to-purple-600", icon: <FaClock /> },
    { label: "Expertise", key: "expertise", color: "from-indigo-400 to-indigo-600", icon: <FaStar /> },
    { label: "Responsibility", key: "responsibility", color: "from-yellow-400 to-yellow-600", icon: <FaShieldAlt /> },
    { label: "Reliability", key: "reliability", color: "from-blue-400 to-blue-600", icon: <FaCheckCircle /> },
    { label: "Skills", key: "skills", color: "from-green-400 to-green-600", icon: <FaCogs /> },
    { label: "Dependability", key: "dependability", color: "from-orange-400 to-orange-600", icon: <FaUserTie /> },
];

function WorkRateDetails({ evals }) {
    return (
        <div className="max-w-3xl w-full mx-auto  rounded-xl p-6">
            <h1 className="text-center capitalize mb-4 text-2xl font-semibold text-gray-700">Work Rate Details</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {skillsData.map(({ label, key, color, icon }) => (
                    <div key={key} className="w-full">
                        <div className="flex items-center gap-2">
                            <span className="text-lg text-gray-700">{icon}</span>
                            <p className="text-gray-600 font-medium">{label}</p>
                        </div>
                        <div className="relative w-full bg-gray-300 rounded-full h-5 mt-1 shadow-md">
                            <div
                                className={`absolute top-0 left-0 h-full bg-gradient-to-r ${color} rounded-full flex items-center justify-center text-xs font-bold text-white`}
                                style={{ width: `${evals[key] * 10}%` }}
                            >
                                {evals[key]}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Overall Performance */}
            <div className="mt-6 flex flex-col items-center">
                <p className="text-gray-600 text-lg font-semibold">Overall Performance</p>
                <div className="w-28 h-28">
                    <CircularProgressbar
                        value={evals.overall_performance}
                        text={`${evals.overall_performance}%`}
                        styles={buildStyles({
                            pathColor: evals.overall_performance >= 70 ? '#22c55e' : evals.overall_performance >= 50 ? '#facc15' : '#ef4444',
                            textColor: '#333',
                            trailColor: '#e5e7eb',
                        })}
                    />
                </div>
                <p className="mt-2 font-semibold text-gray-700">
                    {evals.overall_performance <= 49
                        ? 'Needs Improvement'
                        : evals.overall_performance >= 90
                            ? 'Outstanding'
                            : evals.overall_performance >= 70
                                ? 'Very Good'
                                : 'Satisfactory'}
                </p>
            </div>

            <p className="mt-6 text-gray-700 text-center"><strong>Comments:</strong> {evals.comments}</p>
        </div>
    );
}

export default WorkRateDetails;
