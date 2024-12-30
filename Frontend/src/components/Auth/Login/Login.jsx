import { GalleryVerticalEnd } from "lucide-react"
import  Img from "../../../assets/Login&register/loginProfile.jpg"
import { LoginForm } from "../../ui/login-form"


export default function LoginPage() {
  return (
    <div className="grid max-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-slate-400">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Byron Josue Alejandro Coc Palomo
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center" >
          <div className="w-full max-w-xs">
            <LoginForm className="shadow-lg bg-slate-200 p-5 rounded-lg"/>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img src={Img} alt="Login" className="object-cover w-full h-full" />
      </div>
    </div>
  )
}
