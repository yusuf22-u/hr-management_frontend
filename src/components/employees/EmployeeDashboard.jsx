import React from 'react';
import { Link } from 'react-router-dom';
import {FaArrowAltCircleRight, FaRegCalendarCheck,FaMoneyCheckAlt  } from "react-icons/fa";
import { HiUsers } from "react-icons/hi";
import { FaClipboardCheck, FaBoxes } from "react-icons/fa"; // Icons for evaluation and inventory
import { MdAssessment, MdInventory } from "react-icons/md"; // Alternative icons



const EmployeeDashboard = () => {
  return (
    <>
      <h2 className="text-xl text-center font-semibold mb-2">Employee Management</h2>
   <Link to='/dashboard/staff_evaluation/create'>create Evaluation</Link>
    <div className="flex flex-wrap justify-center gap-6 p-6">
      <Card
        title="Employee Section"
        description="Manage employees and view details."
        link="/dashboard/employee/List"
        color="bg-white"
        icon={HiUsers}
        Icon2={FaArrowAltCircleRight }
        
      />
      <Card
        title="Leave Request"
        description="View and manage leave requests."
        link="/dashboard/leave/leave_reguest"
        color="bg-white"
        icon={ FaRegCalendarCheck}
        Icon2={FaArrowAltCircleRight }
        
      />
      <Card
        title="Staff Evaluation"
        description="Evaluate staff performance and review evaluations."
        link="/dashboard/evaluation_view"
        color="bg-white"
        icon={FaBoxes}
        Icon2={FaArrowAltCircleRight }
      />
      <Card
        title="Inventory Section"
        description="Manage inventory and view stock details."
        link="/dashboard/items/add"
        color="bg-white"
        icon={MdInventory}
        Icon2={FaArrowAltCircleRight }
      />
       <Card
        title="Inventory items"
        description="Manage inventory and view stock details."
        link="/dashboard/items/list"
        color="bg-white"
        icon={MdInventory}
        Icon2={FaArrowAltCircleRight }
      />
      <Card
        title="PayRoll Section"
        description="Manage payroll and view  details."
        link="/dashboard/payroll/add"
        color="bg-white"
        icon={FaMoneyCheckAlt}
        Icon2={FaArrowAltCircleRight }
      />
    </div>
    </>
  );
};

 // Make sure you import Link from 'react-router-dom'
 const Card = ({ title, description, link, color, icon: Icon, Icon2 }) => {
  return (
    <div className={`w-64 p-3 rounded-lg  border-gray-300 ${color} text-gray-700 flex flex-col items-center`}>
      {/* Title */}
      <h2 className="text-lg mt-2 font-semibold mb-1 text-center">{title}</h2>

      {/* Icon */}
      {Icon && <Icon className="text-4xl mb-1 text-blue-700 mx-auto mt-4" />} {/* Adjusted size */}

      {/* Description */}
      <p className="mb-3 text-sm text-center">{description}</p> {/* Smaller text */}

      {/* Icon2 as link */}
      <Link to={link}>
        {Icon2 && <Icon2 className="text-3xl text-blue-500 mx-auto mt-2" />} {/* Smaller size */}
      </Link>
    </div>
  );
};




export default EmployeeDashboard;
