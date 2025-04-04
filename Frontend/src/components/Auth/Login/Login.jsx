import { GalleryVerticalEnd } from "lucide-react"
import  Img from "../../../assets/Login&register/loginProfile.jpg"
import {  Outlet } from 'react-router-dom';
import { Suspense } from "react";


export default function LoginPage() {
  return (
    <div className="grid h-screen lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-slate-400">
        <div className="flex flex-1 items-center justify-center" >
          <div className="w-full max-w-sm">
           <Suspense>
              
              
              
              <Outlet/>
           </Suspense>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img src={Img} alt="Login" className="object-left w-full h-full" />
      </div>
    </div>
  )
}
