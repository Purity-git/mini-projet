import { useAppStore } from "@/store";
import { HOST, GET_ALL_MESSAGES_ROUTE } from "@/utiles/constants";
import  { createContext, useContext, useEffect, useRef } from "react";
import { io} from "socket.io-client";
import { apiClient } from "@/lib/api-client";

const SocketContext = createContext(null);

export const useSocket =() => {
    return useContext(SocketContext);
}

export const SocketProvider = ({children}) =>{
    const socket = useRef();
    const { userInfo, selectedChatData, selectedChatType, addMessage, setselectedChatMessages } = useAppStore();
 
    useEffect(() => {
        if(userInfo) {
            socket.current =io(HOST,{
                withCredentials: true,
                query: {userId: userInfo.id}
            });

           socket.current.on("connect", () => {
            console.log("Connected to  socket server");

            if (selectedChatType === "contact" && selectedChatData?._id) {
                const fetchMessages = async () => {
                  try {
                    const response = await apiClient.post(
                      GET_ALL_MESSAGES_ROUTE,
                      { id: selectedChatData._id },
                      { withCredentials: true }
                    );
                    if (response.data.messages) {
                      setselectedChatMessages(response.data.messages);
                    }
                  } catch (error) {
                    console.log("Error fetching messages on socket connect:", error);
                  }
                };
                fetchMessages();
              }
           });

           const handleReceiveMessage =(message) => {
            const {selectedChatData, selectedChatType, addMessage, addContactsInDMContacts} = useAppStore.getState();
        
            if(selectedChatType !== undefined && 
                (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)
    ){
        console.log("message received", message); 
        addMessage(message);
    }
    addContactsInDMContacts(message);
}; 

const handleReceiveChannelMessage = (message)=> {
  console.log("Received channel message from server:", message);
const { selectedChatData, selectedChatType, addMessage, addChannelInChannelList} = useAppStore.getState();

if(selectedChatType !== undefined && selectedChatData._id === message.channelId)
{
  addMessage(message);
}
addChannelInChannelList(message);
}


socket.current.on("receiveMessage", handleReceiveMessage);
socket.current.on("receive-channel-message", handleReceiveChannelMessage);
           return () => {
            socket.current.disconnect();
           }
        } }, [userInfo, selectedChatData, selectedChatType, addMessage, setselectedChatMessages]) 

    return (
        <SocketContext.Provider value={socket.current}> 
            {children}
        </SocketContext.Provider>
    )
}