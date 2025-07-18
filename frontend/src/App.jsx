import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Load from './Pages/Load';
import Home from './Pages/Home';
import PageNotFound from './Pages/PageNotFound';

import AdminCreator from './Pages/Admin/AdminCreator';
import AdminLogin from './Pages/Admin/AdminLogin';
import ForgetPassword from './Pages/Admin/ForgetPassword';
import AdminDashboard from './Pages/Admin/AdminDashboard';

import Addproducts from './Pages/Admin/Components/AddProduct';
import Generatebill from './Pages/Admin/Components/GenerateBill';
import Listallproducts from './Pages/Admin/Components/ListAllProducts';
import Showbudget from './Pages/Admin/Components/ShowBudget';

import Login from './Pages/Customer/Login';
import Signup from './Pages/Customer/Signup';
import Profile from './Pages/Customer/Profile';
import ResetPassword from './Pages/Customer/ResetPassword';
import Saree from './Pages/sections/Saree';
import Lehnga from './Pages/sections/Lehnga';
import Chunni from './Pages/sections/Chunni';
import AllProduct from './Pages/sections/AllProduct';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Load/>,
    children: [
      {
        index: true,
        element: <Home/>
      },
      {
        path: 'Home',
        element: <Home/>
      },
      {
        path: '/AdminCreator',
        element: <AdminCreator/>
      },
      {
        path: '/AdminLogin',
        element: <AdminLogin/>
      },
      {
        path: '/ForgetPassword',
        element: <ForgetPassword/>
      },
      {
        path: '/AdminDashboard',
        element: <AdminDashboard/>
      },
      {
        path: '/Addproducts',
        element: <Addproducts/>
      },
      {
        path: '/Generatebill',
        element: <Generatebill/>
      },
      {
        path: '/Listallproducts',
        element: <Listallproducts/>
      },
      {
        path: '/Showbudget',
        element: <Showbudget/>
      },
      {
        path: '/Login',
        element: <Login/>
      },
      {
        path: '/Signup',
        element: <Signup/>
      },
      {
        path: '/ResetPassword',
        element: <ResetPassword/>
      },
      {
        path: '/Profile',
        element: <Profile/>
      },
      {
        path: '/sections/saree',
        element: <Saree/>
      },
      {
        path: '/sections/lehnga',
        element: <Lehnga/>
      },
      {
        path: '/sections/chunni',
        element: <Chunni/>
      },
      {
        path: '/sections/allproduct',
        element: <AllProduct/>
      },
      {
        path: '*',
        element: <PageNotFound/>
      }
    ]
  }
])

function App() {

  return <RouterProvider router={router}/>;
}

export default App
