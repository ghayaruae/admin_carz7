// import logo from './logo.svg';
import './App.css';
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import Page404 from './Layout/Page404';
import {ConfigProvider} from '../src/Context/ConfigContext'


import routes from './Routes/Routes'
import AppLayout from './Layout/AppLayout';
import Login from './Pages/Login';
import ProtectedRoute from './Routes/ProtectedRoute';
function App() {
  const router = createBrowserRouter([
{ path: '/Login',  element: localStorage.getItem('token') ? <AppLayout /> : <Login/>},

    {
      element:  <AppLayout />,
     
      errorElement: <Page404 />,
      // specify the routes defined in the
      // routing layer directly
     
      children: routes
     
      
    },
  ])
  return (<>
    
    <ConfigProvider>
      <RouterProvider router={router} />
    </ConfigProvider>
    </> )
  
}

export default App;
