import React, { createContext, useEffect, useState } from 'react';

export const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  // Define your global configuration here
  // const config = {
  //   appName: 'My App',
  //   apiUrl: 'https://api.example.com/',
  //   // Add more configuration options as needed
  // };

  // const [apiURL, setAPIURL] = useState('http://localhost:3100/');
  const [apiURL, setAPIURL] = useState('https://adminapi.carz7.com/');
  const [gdcURL, setGDCURL] = useState('https://dcapi.carz7.com/');
  const [dmURL, setDMURL] = useState('https://dataapi.ghayar.com/');
  // const [apiURL, setAPIURL] = useState('http://adminapi.carz7.com/');

  // const [token, setToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluIiwiaWF0IjoxNjk5MTc0MzE4LCJleHAiOjE2OTk1MzQzMTh9.tamL-Q7TbZIPf-SgTA6MLLyIwwKU-svKnrAz29JQzrs');
  const [token, setToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRzeXMiLCJpYXQiOjE3MDA4MTg2ODgsImV4cCI6MTcwMTQyMzQ4OH0.hY7vu96VmCqlq752lb3N3QZJsg__mRpXJyr7x5wcmao');
  // const [token, setToken] = useState('');

  useEffect(() => {
    // Retrieve token from local storage or any other storage mechanism
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);  // Update context with stored token
    }
  }, []); // Run useEffect only once on component mount

  const handleUpdateToken = (newToken) => {
    setToken(newToken); //// Update context with new token
    localStorage.setItem('token', newToken);  // Store token in local storage
  }

  const placeHolderImageURL = 'http://146.190.141.14:3010/public/placeholder_category.jpeg'

  var vals = {
    apiURL, setAPIURL,
    token,
    setToken,
    handleUpdateToken,
    placeHolderImageURL,
    gdcURL, dmURL
  };
  return (
    <ConfigContext.Provider value={vals}>
      {children}
    </ConfigContext.Provider>
  );
};
