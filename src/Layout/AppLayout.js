
import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import { Suspense, useEffect } from "react"
import ProtectedRoute from "../Routes/ProtectedRoute"
import axios from "axios"


export default function AppLayout() {
    
    return (
        <ProtectedRoute>
       
            <Header />
            <main>
                <Suspense fallback={<div>Loading...</div>}>
                    
                    <Outlet />
                    
                </Suspense>
            </main>
            <Footer />
        </ProtectedRoute>
    )
}