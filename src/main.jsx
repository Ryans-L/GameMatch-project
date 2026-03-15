import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { RouterProvider } from 'react-router-dom'
import { router } from './router.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <div className='mb-10 p-4 w-full bg-gray-700'>
        <h1 className='text-white text-3xl'> GameMatch </h1>
      </div>
      <AuthContextProvider>
        <RouterProvider router={router}/>
      </AuthContextProvider>
    </>
  </StrictMode>,
)
