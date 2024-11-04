import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Navbar from "./components/Navbar"
import Home from './components/Home';
import NotFound from './components/NotFound';
import CreditSimulate from './components/CreditSimulate';
import CreditEval from './components/CreditEval';
import CreditRequest from './components/CreditRequest';
import CreditView from './components/CreditView';
import CreditList from './components/CreditList';
import CreditConfirm from './components/CreditConfirm';
import ClientProfile from './components/ClientProfile';
import ClientInfo from './components/ClientInfo';
import ClientRegister from './components/ClientRegister';
import ExecutiveProfile from './components/ExecutiveProfile';
import Login from './components/Login';
import Documents from './components/Documents';


function App() {
  return (
      <Router>
          <div className="container">
          <Navbar></Navbar>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/credit/simulate" element={<CreditSimulate/>} />
              <Route path="/credit/request" element={<CreditRequest/>} />
              <Route path="/credit/edit/:id" element={<CreditView/>} />
              <Route path="/credit/all" element={<CreditList/>} />
              <Route path="/client/:id" element={<ClientProfile/>} />
              <Route path="/client/info/:id" element={<ClientInfo/>} />
              <Route path="/client/register" element={<ClientRegister/>} />
              <Route path="/executive/:id" element={<ExecutiveProfile/>} />
              <Route path="/credit/eval/:id" element={<CreditEval/>} />
              <Route path="/credit/confirm/:id" element={<CreditConfirm/>} />
              <Route path="/documents/:id" element={<Documents/>} />
              <Route path="*" element={<NotFound/>} />
            </Routes>
          </div>
      </Router>
  );
}

export default App