import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Homepage';
import Login from './components/Login';
import './App.css';
import Register from './components/Register';
import CalendarPage from './components/Calendar';
import UserCCInfo from './components/UserCCInfo';
import CompanySearch from './components/CompanySearch';
import Compcreation from './components/CompCreation';
import TOS from './components/TOS';
import PrivacyP from './components/PrivacyP';



const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>}/>
          <Route path="/calendar" element={<CalendarPage/>}/>
          <Route path="/CCinfo"   element={<UserCCInfo/>} />
          <Route path="/companysearch" element={<CompanySearch/>}/>
          <Route path="/Compcreation" element={<Compcreation/>}/>
          <Route path='/TOS' element={<TOS/>} />
          <Route path='/PrivacyPolicy' element={<PrivacyP/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;