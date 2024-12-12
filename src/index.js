import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Provider } from 'react-redux';
import store from './Store/index';
import { BrowserRouter as Router, Route, Routes } from 'react-router'
import Login from './Components/Login/Login';
import ChatUser from './Components/Chats/ChatUser';
import ProtectedRoute from './ProtectedRoute';
import { Navigate } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
const token = localStorage.getItem('access_token');
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path='/' element={token ? <Navigate to='/chats' /> : <Login />} />
          <Route path='/chats' element={<ProtectedRoute element={<App />} />} />
          <Route path='/chat/:id' element={<ProtectedRoute element={<ChatUser />} />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
