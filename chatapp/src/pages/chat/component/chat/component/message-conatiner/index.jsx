import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTE, GET_CHANNEL_MESSAGES, HOST } from "@/utiles/constants";
import moment from "moment";
import { useEffect, useRef } from "react";
import { getColor } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; 

const MessageContainer = () => {
  const scrollRef= useRef();
 const { selectedChatType, selectedChatData, userInfo, selectedChatMessages, setselectedChatMessages, setselectedChatType, setselectedChatData} = useAppStore();

 useEffect(() => {

  const getMessages = async () => {
    try{
      const response = await apiClient.post(GET_ALL_MESSAGES_ROUTE,
        { id: selectedChatData._id},
        {withCredentials:true}
        );
        if(response.data.messages)
        {
          setselectedChatMessages(response.data.messages) 
        }
    }catch(error)
    {
      console.log({error});
    }
  };

  const getChannelMessages = async()=>{
    try{
      const response = await apiClient.get (`${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`, {withCredentials:true}); 
      console.log("Fetched channel messages:", response.data.messages);
        if(response.data.messages)
        {
        setselectedChatMessages(response.data.messages) 
        }
    }catch(error)
    {
      console.log("Error fetching channel messages:", error);
    }
  }

  if(selectedChatData._id)
  {
    if(selectedChatType === "contact") {getMessages();}
    else if (selectedChatType === "channel"){ getChannelMessages()};
  }
 }, [selectedChatData, selectedChatType,setselectedChatMessages])


 
  useEffect(() => {
    if(scrollRef.current){
      scrollRef.current.scrollIntoView({ behavior: "smooth"});
    }
  }, [selectedChatMessages]); 
 
  const renderMessages =() =>{
    let lastDate = null;

    return selectedChatMessages.map((message, index)=> {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate != lastDate;
      lastDate = messageDate;
      
      return (
        <div key ={index }>
          { showDate && (
          <div className="text-center text-gray-500 my-2">
            { moment (message.timestamp).format("LL")}
        </div>
      )}
    {  selectedChatType=== "contact" && renderDMMessages(message)}
    { selectedChatType=== "channel" && renderChannelMessages(message) } 
    </div>
    );
  });
  };

    const renderDMMessages = (message)=> (
      <div className={ `${message.sender === selectedChatData._id ? "text-left" : "text-right"}`}>
        { message.messageType === "text" && (

          <div className={`${
      message.sender !== selectedChatData._id
      ? "bg-[#8417ff]/5 text-white border-[#8417ff]/50: "
      : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
    } 
    border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
    >
      {message.content}
    </div>
        )} 
       <div className="text-xs text-gray-600"> 
        { moment(message.timestamp).format("LT")}
        </div>     
    </div>
    );
    
    
    const renderChannelMessages = (message) =>{
      const handleMentionClick = (mentionedName) => {
        const channel = useAppStore.getState().channels.find((ch) => ch._id === selectedChatData._id);
        const mentionedUser = [...channel.members, channel.admin].find(
          (m) => m.firstName === mentionedName
        );
        if (mentionedUser) {
          setselectedChatType("contact");
          setselectedChatData(mentionedUser);
          setselectedChatMessages([]);
        }
      };

      const contentWithMentions = message.content.split(" ").map((word, index) => {
        if (word.startsWith("@")) {
          const mentionName = word.slice(1); 
          return (
            <span
              key={index}
              className="text-green-400 cursor-pointer hover:underline"
              onClick={() => handleMentionClick(mentionName)}
            >
              {word}
            </span>
          );
        }
        return <span key={index}>{word}</span>;
      }).reduce((prev, curr) => [prev, " ", curr]);

      return(
        <div className={`mt-5 ${message.sender._id !== userInfo.id ? "text-left" : "text-right"}`}>
        {message.messageType === "text" && (
          <div
          className={`${
            message.sender._id !== userInfo.id
              ? "bg-[#8417ff]/5 text-white border-[#ffffff]/20" // White border for others
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20" // White border for own
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >{contentWithMentions}</div>
        )}
        {message.sender._id !== userInfo.id ? (
          <div className="flex items-center justify-start gap-3">
            <Avatar className="h-8 w-8 rounded-full overflow-hidden">
              {message.sender.image && (
                <AvatarImage src={`${HOST}/${message.sender.image}`} alt="profile" className="object-cover w-full h-full bg-black" />
              )}
              <AvatarFallback className={`uppercase h-8 w-8 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(message.sender.color)}`}>
                {message.sender.firstName ? message.sender.firstName.split("")[0] : message.sender.email.split("")[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-white/60">{message.sender.firstName}</span>
            <span className="text-xs text-white/60">{moment(message.timestamp).format("LT")}</span>
          </div>
        ) : (
          <div className="text-xs text-white/60 mt-1">{moment(message.timestamp).format("LT")}</div>
        )}
      </div>
    );
  };

  return ( 

    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full ">
      {renderMessages()}
      <div ref={scrollRef} />
    </div> 
  )
}

export default MessageContainer
