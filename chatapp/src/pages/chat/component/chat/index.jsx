import { useEffect } from "react";
import { useAppStore } from "@/store";
import Emptychatcontainer from "../empty_chat";
import ChatHeader from "./component/chat-header";
import MessageContainer from "./component/message-conatiner";
import MessageBar from "./message-bar";
import { apiClient } from "@/lib/api-client";
import { GET_USER_CHANNELS_ROUTE } from "@/utiles/constants";


const ChatContainer = ()=>{
    const { selectedChatType , setChannels} = useAppStore();

    useEffect(() => {
      const fetchChannels = async () => {
        try {
          const response = await apiClient.get(GET_USER_CHANNELS_ROUTE, { withCredentials: true });
          if (response.data.channels) {
            setChannels(response.data.channels);
          }
        } catch (error) {
          console.log("Error fetching channels:", error);
        }
      };
      fetchChannels();
    }, [setChannels]);

    return (
        <div className="flex-1 flex flex-col bg-[#1c1d25] min-h-0">
        {selectedChatType === undefined ? (
          <Emptychatcontainer />
        ) : (
          <>
            <ChatHeader />
            <MessageContainer />
          </>
        )}
        <div >
          <MessageBar />
        </div>
      </div>
      
    );
}
 
export default ChatContainer;