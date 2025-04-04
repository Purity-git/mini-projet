import React from 'react'
import ReactDOM from "react-dom/client"
import './index.css'
import App from './App.jsx'
import { Toaster } from './components/ui/sonner.jsx'
import { SocketProvider } from './context/SocketContext'

ReactDOM.createRoot(document.getElementById('root')).render(

  <SocketProvider>
    <App />
    <Toaster closeButton/>
    </SocketProvider>

);