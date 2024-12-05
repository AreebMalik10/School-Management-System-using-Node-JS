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
      </Routes>
      
    </div>
    </Router>
  );
}

export default App;
