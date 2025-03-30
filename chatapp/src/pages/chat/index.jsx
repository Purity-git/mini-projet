import { useAppStore } from "@/store"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./component/contact";
import Emptychatcontainer from "./component/empty_chat";
import ChatContainer from "./component/chat";
import { apiClient } from "@/lib/api-client";
import { GET_ALL_MESSAGES_ROUTE } from "@/utiles/constants";


const Chat = () => {
  const {userInfo,selectedChatType,selectedChatData, setSelectedChatMessages} = useAppStore();
const navigate= useNavigate();

useEffect(() => {
  if (!userInfo.profileSetup){
    toast("Kindly setup profile to continue.");
    navigate("/profile");
  }

  console.log("userInfo:", userInfo);
    console.log("selectedChatData:", selectedChatData);
}, [userInfo, navigate, selectedChatData]);


return (
<div className="flex h-screen text-white overflow-hidden">

  
<ContactsContainer /> 

<div className="flex-1 flex flex-col bg-[#1c1d25]">
        {selectedChatType === undefined ? <Emptychatcontainer /> : <ChatContainer />}
      </div>

  {
 
    }
</div>
)
};

export default Chat
