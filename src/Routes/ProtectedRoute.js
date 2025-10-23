//  import React, {useContext} from 'react'

import {  Navigate } from 'react-router-dom';
// import { ConfigContext } from '../Context/ConfigContext';

const ProtectedRoute = ({children}) => {
   //  const {token} = useContext(ConfigContext);
const  localStorageToken = localStorage.getItem('token');


 if(localStorageToken) {
    return children;
    
 }
 else{
    return <Navigate to='/Login' />
      
 }
}

export default ProtectedRoute 

