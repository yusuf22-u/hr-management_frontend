import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginSystem/Login';
import Dashboard from './components/Dashboard';
import SignUp from './components/LoginSystem/SignUp';
// import ForgotPassword from './components/ForgotPassword';
import Employee from './components/employees/Employee';
import Home from './components/Home';
import EditEmployee from './components/employees/EditEmployee';
import StaffEvaluation from './components/employees/staffEvaluation';
import EvaluationList from './components/employees/EvaluationList';
import StudentForm from './components/student/StudentForm';
import StudentList from './components/student/StudentList';
import EditStudentForm from './components/student/EditStudentForm';
import ParticipantForm from './components/student/StudentScoreForm';
import ViewParticipant from './components/student/ViewParticipant';
import StudentDashboard from './components/student/studentDashboard';
import EmployeeDashboard from './components/employees/employeeDashboard';
import PrivateRoute from './components/routers/PrivateRoute';
import LeaveRequestForm from './components/LeavesModule/LeaveRequestForm';
import LeaveList from './components/LeavesModule/leaveList';
import Notifications from './components/LeavesModule/Notifications';
import EmployeeList from './components/employees/EmployeeList';
import InventoryForm from './components/inventory/InventoryForm';
import DisplayItems from './components/inventory/DisplayItems';
import EditItems from './components/inventory/EditItems';
import AllocateItem from './components/inventory/AllocateItem';
import AllocationCards from './components/inventory/AllocationCards';
import StockList from './components/inventory/StockList';
import StockForm from './components/inventory/StockForm';
import ItemDetailModal from './components/inventory/ItemDetailModal';
import EditStock from './components/inventory/EditStock';
import PayrollForm from './components/PayRoll/PayrollForm';
import PayRollList from './components/PayRoll/PayRollList';
import PayrollDetails from './components/PayRoll/PayrollDetails';
import StudentReport from './components/student/StudentReport';
import StudentScore from './components/student/StudentScore';
import StudentGrades from './components/student/StudentGrades';
import StudentSearchAndPrint from './components/student/StudentSearchAndPrint';
import EditStudentScoreForm from './components/student/EditStudentScoreForm';
import UserManagement from './components/LoginSystem/UserManagement';
import LoginLogoutHistory from './components/LoginSystem/LoginLogoutHistory';
import UserMessage from './components/LeavesModule/UserMessage';
// import EmployeeQualification from './components/employees/EmployeeQualification';
import AddCertificateForm from './components/employees/AddCertificateForm';
import EmployeeCertificates from './components/employees/EmployeeCertificates';
import EmployeePerformance from './components/employees/EmployeePerformance';
import StaffOfTheMonth from './components/employees/StaffOfTheMonth';
import EvaluationGraph from './components/employees/EvaluationGraph';
import EmailTable from './components/Admin/EmailTable';
import UserAcount from './components/LoginSystem/UserAcount';
import ParentDashboard from './components/Layouts/ParentDashboard';
import CenterForm from './components/student/CenterForm';
import ParticapantDetail from './components/student/ParticapantDetail';
import ParticipantList from './components/student/ParticipantList';
import AdvanceSearch from './components/student/AdvanceSearch';
import EditParticipant from './components/student/EditParticipant';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<SignUp />} />
        <Route path='/login' element={<LoginForm />} />
        {/* <Route path="/dashboard" element={<PrivateRoute requiredRole="admin"><Dashboard /></PrivateRoute>} /> */}

        {/* Protected Dashboard Routes */}
        <Route path='/dashboard' element={<PrivateRoute requiredRole="admin"><Dashboard /></PrivateRoute>}>
          {/* Default Home Route */}
          <Route path='' element={<ParentDashboard />} />
          {/* Child Dashboard Routes */}
          <Route path='employee/add' element={<Employee />} />
          <Route path='edit/:id' element={<EditEmployee />} />
          <Route path='employee/List' element={<EmployeeList />} />
          <Route path='staff_evaluation/create' element={<StaffEvaluation />} />
          <Route path='evaluations/:id' element={<EvaluationList />} />
          <Route path='student' element={<StudentForm />} />
          <Route path='studentList' element={<StudentList />} />
          <Route path='edit_student/:id' element={<EditStudentForm />} />
          <Route path='award/create' element={<ParticipantForm />} />
          <Route path='award/view' element={<ViewParticipant />} />
          <Route path='award/home' element={<StudentDashboard />} />
          <Route path='leave/leave_reguest' element={<LeaveRequestForm />} />
          <Route path='leave/leave_List' element={<LeaveList />} />
          <Route path='leave/notification' element={<Notifications />} />
          <Route path='employee/layout' element={<EmployeeDashboard />} />
          <Route path='items/add' element={<InventoryForm />} />
          <Route path='items/list' element={<DisplayItems />} />
          <Route path='items_edit/:id' element={<EditItems />} />
          <Route path='items/allocate' element={<AllocateItem />} />
          <Route path='items/allocate_list' element={<AllocationCards/>} />
          <Route path='stocks/stock_list' element={<StockList/>} />
          <Route path='stocks/stock_create' element={<StockForm/>} />
          <Route path='view/stock/:id' element={<ItemDetailModal/>} />
          <Route path='update/stock/:id' element={<EditStock/>} />
          <Route path='payroll/add' element={<PayrollForm/>} />
          <Route path='payroll/List' element={<PayRollList/>} />
          <Route path='payroll/singlePayroll/:id' element={<PayrollDetails/>} />
          <Route path='student_report/:id' element={<StudentReport/>} />
          <Route path='student_Score/:id' element={<StudentScore/>} />
          <Route path='student_Score/grade' element={<StudentGrades/>} />
          <Route path='student/search' element={<StudentSearchAndPrint/>} />
          <Route path='students/edit/:id' element={<EditStudentScoreForm/>} />
          <Route path='users' element={<UserManagement/>} />
          <Route path='users/login_out/history' element={<LoginLogoutHistory/>} />
          <Route path='users/message' element={<UserMessage/>} />
          <Route path='employee/doc' element={<AddCertificateForm/>} />
          <Route path='employee/certificates/:id' element={<EmployeeCertificates/>} />
          <Route path='evaluations/rates/:id' element={<EvaluationGraph/>} />
          <Route path='employee/evaluation_list/' element={<EmployeePerformance/>} />
          <Route path='employee/StaffOfMonth/' element={<StaffOfTheMonth/>} />
          <Route path='admin/email' element={<EmailTable/>} />
          <Route path='account' element={<UserAcount/>} />
          <Route path='centerForm' element={<CenterForm/>} />
          <Route path='participant/:id' element={<ParticapantDetail/>} />
          <Route path='participant/' element={<ParticipantList/>} />
          <Route path='advance/search' element={<AdvanceSearch/>} />
          <Route path='edit_particpant/:id' element={<EditParticipant/>} />
          


          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
