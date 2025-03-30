import Background from "@/assets/logins.jpg"
import {Tabs, TabsList} from "@/components/ui/tabs"
import { TabsContent, TabsTrigger } from "@radix-ui/react-tabs"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { apiClient} from "@/lib/api-client"
import { SIGNUP_ROUTE } from "@/utiles/constants"
import { LOGIN_ROUTE } from "@/utiles/constants"
import { useNavigate } from "react-router-dom"
import { useAppStore } from "@/store"

const Auth = () => { 

    const navigate=useNavigate()
    const {setUserInfo} = useAppStore() 
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("") 
    const [confirm, setconfirm] = useState("")

    const validateLogin = ()=>{
        if (!email.length)
        {
            toast.error("Email is required"); 
            return false;
        }

        if (!password.length)
            {
                toast.error("Password is required");
                return false;
            }
            return true;
    };

    const validateSignup= ()=>{
    

        if (!email.length)
        {
            toast.error("Email is required");
            return false;
        }
    

        if (!password.length)
            {
                toast.error("Password is required");
                return false;
            }

        if (confirm!==password)
        {
            toast.error("Confirm password must be the same with password");
            return false;
        }
            return true;
    

    };
     
    const handleLogin = async () => {
 
     if (!validateLogin()) return;

    try {
        const response = await apiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true });

        if (response.data?.user?.id) {
            setUserInfo(response.data.user);
            navigate(response.data.user.profileSetup ? "/chat" : "/profile");
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Login failed. Try again.");
    }
            
   
        }      
            

    const handleSignup = async () => {
        if (!validateSignup()) return;

    try {
        const response = await apiClient.post(SIGNUP_ROUTE, { email, password }, { withCredentials: true });

        if (response.status === 201) {
            setUserInfo(response.data.user);
            navigate("/profile");
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Signup failed. Try again.");
    }
    
    };

  return (
    <div className="h-[100vw] flex items-center justify-center">
        <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">

        <div className="flex flex-col gap-10 items-center justify-center">
            <div className="flex items-center justify-center flex-col">
                <div className="flex items-center justify-center">
                    <h1 className="text-5xl font-bold md:text-6xl"> Welcome </h1>
                </div>
                <p className="font-small text-center flex flex-col gap-3 mt-4">Connect, collaborate, and chat smarter.<br/> Fill in your details to get started! </p>
            </div>
            <div className="flex items-center justify-center w-full">
                <Tabs className="w-3/4" defaultValue="login"> 
                    <TabsList className="bg-transparent rounded-none w-full">
                        <TabsTrigger value="login"
                        className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-green-500 p-3 transition-all duration-300">Login</TabsTrigger>

                        <TabsTrigger value="signup"
                        className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-green-500 p-3 transition-all duration-300"> Signup</TabsTrigger>                      
                    </TabsList>
                    
                    <TabsContent className="flex flex-col gap-5 mt-8" value="login">
                        <Input
                        placeholder="Email"
                        type="email"
                        className="rounded-full p-6"
                        value={email}
                        onChange={(e) => setemail(e.target.value)} />

                    <Input
                        placeholder="Password"
                        type="password"
                        className="rounded-full p-6"
                        value={password}
                        onChange={(e) => setpassword(e.target.value)} />
                    <Button className="rounded-full p-6" onClick={handleLogin}> Login </Button>
                    </TabsContent>
                    
                    <TabsContent className="flex flex-col gap-5 mt-8" value="signup">
                    
                    <Input
                        placeholder="Email"
                        type="email"
                        className="rounded-full p-6"
                        value={email}
                        onChange={(e) => setemail(e.target.value)} />

                    <Input
                        placeholder="Password"
                        type="password"
                        className="rounded-full p-6"
                        value={password}
                        onChange={(e) => setpassword(e.target.value)} />

                    <Input
                        placeholder="Confirm Password"
                        type="password"
                        className="rounded-full p-6"
                        value={confirm}
                        onChange={(e) => setconfirm(e.target.value)} />

                    <Button className="rounded-full p-6 " onClick={handleSignup}> Signup </Button>
                    </TabsContent>
                </Tabs>
            </div>
        </div>

        <div className="hidden xl:flex justify-center items-center">
            <img src={Background} alt="background login" className="h-[500px]" /> 
        </div>

        </div>
    </div>
  ) 
}
 
export default Auth
