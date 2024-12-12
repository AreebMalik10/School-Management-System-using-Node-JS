import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SuperAdmin from "./components/superAdmin";
import AdminLogin from "./components/adminLogin";
import AdminDashboard from "./components/adminDashboard";
import SuperadminLogin from './components/superAdminlogin';
import Home from './components/home';
import LoginPage from './components/loginPage';
import Student from './components/student';
import Teacher from './components/teacher';
import Parent from './components/parent';
import ChallanForm from './components/challanForm';
import ViewChallanAdmin from './components/viewChallanAdmin';
import ChallanShowParent from './components/challanShowParent';
import AdminCreateClass from './components/adminCreateClass';
import AdminAssignTeacherClass from './components/adminAssignTeacherToClass';
import AdminAssignTeacherToClass from './components/adminAssignTeacherToClass';
import FetchClasses from './components/fetchClasses';
import AssignSubjectToTeacher from './components/assignSubjectToTeacher';
import DisplayAssignedSubjectsToTeacher from './components/displayAssignedSubjectsToTeacher';
import AdminCreateStudent from './components/adminCreateStudent';
import StudentList from './components/studentList';
import StudentViewHisChallan from './components/studentViewHisChallan';
import TeacherFetchStudent from './components/teacherFetchStudent';
import StudentClassDetails from './components/studentClassDetailsForAdmin';
import StudentClassDetailsForAdmin from './components/studentClassDetailsForAdmin';
import StudentSubjects from './components/studentSubjects';
import StudentLeaveRequest from './components/studentLeaveRequest';
import TeacherViewLeaveRequest from './components/teacherViewLeaveRequest';
import StudentViewLeaveRequest from './components/studentViewLeaveRequest';


function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path='/' element={<LoginPage/>}></Route>
        <Route path='/home' element={<Home/>}></Route>
        <Route path="/salogin" element={<SuperadminLogin/>}></Route>
        <Route path="/superadmin" element={<SuperAdmin />}></Route>
        <Route path="/adminlogin" element={<AdminLogin />}></Route>
        <Route path="/admindashboard" element={<AdminDashboard />}></Route>
        <Route path='/student' element={<Student/>}></Route>
        <Route path='/teacher' element={<Teacher/>}></Route>
        <Route path='/parent' element={<Parent/>}></Route>
        <Route path='/challan' element={<ChallanForm/>}></Route>
        <Route path='/viewChallanAdmin' element={<ViewChallanAdmin/>}></Route>
        <Route path='/challanshowparent' element={<ChallanShowParent/>}></Route>
        <Route path='/admincreateclass' element={<AdminCreateClass/>}></Route>
        <Route path='/adminassignteachertoclass' element={<AdminAssignTeacherToClass/>}></Route>
        <Route path='/fetchclasses' element={<FetchClasses/>}></Route>
        <Route path='/assignsubject' element={<AssignSubjectToTeacher/>}></Route>
        <Route path='/displaysubjectsteacher' element={<DisplayAssignedSubjectsToTeacher/>}></Route>
        <Route path='/createstudent' element={<AdminCreateStudent/>}></Route>
        <Route path='/studentlist' element={<StudentList/>}></Route>
        <Route path='/studentviewchallan' element={<StudentViewHisChallan/>}></Route>
        <Route path='/teacherviewstudent' element={<TeacherFetchStudent/>}></Route>
        <Route path='/studentclassdetailsforadmin' element={<StudentClassDetailsForAdmin/>}></Route>
        <Route path='/studentclassdetails' element={<StudentClassDetails/>}></Route>
        <Route path='/studentsubject' element={<StudentSubjects/>}></Route>
        <Route path='/studentleaverequest' element={<StudentLeaveRequest/>}></Route>
        <Route path='/teacherviewleaverequest' element={<TeacherViewLeaveRequest/>}></Route>
        <Route path='/studentviewleaverequest' element={<StudentViewLeaveRequest/>}></Route>
      </Routes>
      
    </div>
    </Router>
  );
}

export default App;
