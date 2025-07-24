import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserLogin } from './user-login';
import { AdminLogin } from './admin-login';
import { Home } from './home';
import { Dashboard } from './dashboard';
import { ViewTasks } from './view-tasks';
import { PrivateRoute } from './private-route';
import { AddTask } from './add-task';
import { EditTask } from './edit-task';
import { Users } from './users';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<UserLogin/>}/>
        <Route path='/admin-login' element={<AdminLogin/>}/>
        <Route path='/dashboard' element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
        <Route path='/tasks' element={<PrivateRoute><ViewTasks/></PrivateRoute>}/>
        <Route path='/add-task' element={<PrivateRoute><AddTask/></PrivateRoute>}/>
        <Route path='/edit-task/:id' element={<PrivateRoute><EditTask/></PrivateRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
