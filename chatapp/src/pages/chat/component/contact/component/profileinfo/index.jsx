import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { useAppStore } from "@/store"
import { HOST } from "@/utiles/constants"
import {  getColor  } from "@/lib/utils";
import { useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { IoPowerSharp} from"react-icons/io5"
import { apiClient } from "@/lib/api-client";
import { LOGOUT_ROUTE } from "@/utiles/constants";

 

    const ProfileInfo=()=> {
    
    const {userInfo, setUserInfo}= useAppStore()
    const navigate= useNavigate()

    const logOut= async () => {
       try{
            const response= await apiClient.post(
                LOGOUT_ROUTE,
                {},
                {withCredentials: true}
            );

            if(response.status===200)
            { setUserInfo(null);
                navigate("/auth");               
            }
       } catch(error)
        
       {
        console.log(error)
       }
    }
    useEffect(() => {
        console.log("User Info:", userInfo); 
      }, [userInfo]);

  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
      
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
        <Avatar className="h-12 w-12 rounded-full overflow-hidden">
          { 
            userInfo.image ? (
              <AvatarImage 
              src={`${HOST}/${userInfo.image}`}
              alt="profile"
              className="object-cover w-full h-full bg-black"/>
            ) : (

              <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(userInfo.color)} `}>

                {  userInfo.firstName 
                
                ?userInfo.firstName.split("").shift() 
                : userInfo.email.split("").shift() 

                }
              </div>
            )
          }
        </Avatar>
        </div>
        <div>
            {
             userInfo.firstName && userInfo.lastName
    ? `${userInfo.firstName} ${userInfo.lastName}`
    : userInfo.firstName || userInfo.email
               
            }
        </div>
      </div>
      <div className="flex gap-5">
      <TooltipProvider>
  <Tooltip>
    <TooltipTrigger>
        <FiEdit2 className="text-purple-500 text-xl font-medium"
        onClick={()=>navigate('/profile')}/>
    </TooltipTrigger>
    <TooltipContent>
      Edit Profile
    </TooltipContent>
  </Tooltip>
</TooltipProvider>


<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>
        <IoPowerSharp className="text-red-500 text-xl font-medium"
        onClick={logOut}/>
    </TooltipTrigger>
    <TooltipContent>
     LogOut
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
      </div>
    </div>
  )
}

export default ProfileInfo
