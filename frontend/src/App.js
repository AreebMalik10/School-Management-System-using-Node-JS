import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SuperAdmin from "./components/superAdmin";
import AdminLogin from "./components/adminLogin";
import AdminDashboard from "./components/adminDashboard";
import SuperadminLogin from './components/superAdminlogin';
import Home from './components/home';


function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path="/salogin" element={<SuperadminLogin/>}></Route>
        <Route path="/superadmin" element={<SuperAdmin />}></Route>
        <Route path="/adminlogin" element={<AdminLogin />}></Route>
        <Route path="/admindashboard" element={<AdminDashboard />}></Route>
      </Routes>
      
    </div>
    </Router>
  );
}

export default App;
