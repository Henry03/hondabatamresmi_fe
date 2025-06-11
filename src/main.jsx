import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './pages/App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from './components/Layout.jsx'
import Cars from './pages/Cars.jsx'
import AboutMe from './pages/AboutMe.jsx'
import CarDetail from './pages/CarDetail.jsx'
import CarDetailEditor from './pages/admin/CarDetailEditor.jsx'
import Login from './pages/admin/Login.jsx'
import AuthLayout from './components/AuthLayout.jsx'
import axios from 'axios';
import Register from './pages/admin/Register.jsx'
import AdminLayout from './components/AdminLayout.jsx'
import CarsList from './pages/admin/CarsList.jsx'
import TagsList from './pages/admin/TagsList.jsx'
import CarUpdateEditor from './pages/admin/CarUpdate.jsx'

axios.defaults.baseURL = 'http://localhost:3000/';

if(localStorage.getItem('token')){
  axios.defaults.headers.common['Authorization'] =  'Bearer ' + localStorage.getItem('token');
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route element={<Layout/>}>
        <Route index path="/" element={<App />} />
        <Route path="/mobil" element={<Cars />} />
        <Route path="/aboutme" element={<AboutMe />} />
        <Route path="/detail/:id" element={<CarDetail />} />

      </Route>
      {/* <Route element={<AuthLayout/>}> */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
      {/* </Route> */}
      <Route element={<AdminLayout/>}>
        <Route path='/admin/cars' element={<CarsList/>}/>
        <Route path='/admin/tags' element={<TagsList/>}/>
        <Route path="/admin/cars/editor" element={<CarDetailEditor />} />
        <Route path="/admin/cars/edit/:id" element={<CarUpdateEditor />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
