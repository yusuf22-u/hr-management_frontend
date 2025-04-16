import React from 'react'
import Home from '../Home'
// import usersDashboard from './UsersDashboard'
import UsersDashboard from '../Layouts/UsersDashboard'

const ParentDashboard = () => {
    const userRole = sessionStorage.getItem("role");
    if (userRole === "admin") {
        return (
            <Home />
        )
    }
    if (userRole === 'award' || userRole === 'user') {
        return (
            <UsersDashboard />
        )
    }
    return null

}

export default ParentDashboard