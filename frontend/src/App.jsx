import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Load from './Pages/Load';
import Home from './Pages/Home';
import AdminLogin from './Pages/Admin/AdminLogin';
import ForgetPassword from './Pages/Admin/ForgetPassword';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import PageNotFound from './Pages/PageNotFound';
import AdminCreator from './Pages/Admin/AdminCreator';

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
