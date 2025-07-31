import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserLogin } from './user-login';
import { Dashboard } from './dashboard';
import { ViewTasks } from './view-tasks';
import { PrivateRoute } from './private-route';
import { AddTask } from './add-task';
import { EditTask } from './edit-task';
import { Users } from './users';
import { Navbar } from './navbar';
import { AddEmployee } from './add-employee';
import { EditEmployee } from './edit-employee';
import { EmployeeList } from './employee-list';


function App() {
  return (
    <BrowserRouter>
     <Navbar/>
      <Routes>
        <Route path='/' element={<UserLogin/>}/>
        <Route path='/login' element={<UserLogin/>}/>
        <Route path='/dashboard' element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
        <Route path='/users' element={<PrivateRoute><Users/></PrivateRoute>}/>
        <Route path='/tasks' element={<PrivateRoute><ViewTasks/></PrivateRoute>}/>
        <Route path='/add-task' element={<PrivateRoute><AddTask/></PrivateRoute>}/>
        <Route path='/edit-task/:id' element={<PrivateRoute><EditTask/></PrivateRoute>}/>
        <Route path="/employees" element={<PrivateRoute><EmployeeList /></PrivateRoute>} />
        <Route path="/employees/add" element={<PrivateRoute><AddEmployee /></PrivateRoute>} />
        <Route path="/employees/edit/:id" element={<PrivateRoute><EditEmployee /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
