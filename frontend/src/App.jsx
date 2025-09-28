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
import AllProduct from './Pages/Sections/AllProduct';
import ProductDetail from './Pages/Sections/ProductDetail';
import Wishlist from './Pages/Customer/Wishlist';
import Cart from './Pages/Customer/Cart';
import Order from './Pages/Customer/Order';

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
        path: '/Wishlist',
        element: <Wishlist/>
      },
      {
        path: '/Cart',
        element: <Cart/>
      },
      {
        path: '/Order',
        element: <Order/>
      },
      {
        path: '/AllProduct',
        element: <AllProduct/>
      },
      {
        path: '/product/:id',
        element: <ProductDetail/>
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
