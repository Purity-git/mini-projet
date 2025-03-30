import { useSocket } from "@/context/SocketContext";
import { useAppStore } from "@/store";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";

const MessageBar = () => {
  const emojiRef = useRef();
  const mentionRef = useRef();
  const socket = useSocket();
  const { selectedChatType, selectedChatData, userInfo, addMessage, channels} = useAppStore();
  const [selectedChatMessages, setselectedChatMessages] = useState([]);

  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionPosition, setMentionPosition] = useState(0);


  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
        if (mentionRef.current && !mentionRef.current.contains(event.target)) setShowMentionDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  useEffect(() => {
    
    socket?.on("receiveMessage", (messageData) => {
      console.log("Received new message (contact):", messageData);
      if (messageData.recipient === selectedChatData._id || messageData.sender._id === userInfo.id) {
      setselectedChatMessages((prev) => {
        const exists = prev.some((msg) => msg._id === messageData._id);
        return exists ? prev : [...prev, messageData];
      }); 
      }
    });

    socket?.on("receive-channel-message", (channelData) => {
      console.log("Received new channel message:", channelData);
      if (channelData.channelId === selectedChatData._id) {
        setselectedChatMessages((prev) => {
          const exists = prev.some((msg) => msg._id === channelData._id);
          return exists ? prev : [...prev, channelData];
        });
      }
    });

    socket?.on("error", (errorData) => {
      console.log("Server error:", errorData);
    });

    return () => {
      socket?.off("receiveMessage");
      socket?.off("receive-channel-message");
      socket?.off("error"); 
    };
    
  
  }, [socket, addMessage, selectedChatData, userInfo]);

  
  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    if (selectedChatType === "channel") {
      const cursorPosition = e.target.selectionStart;
      const textBeforeCursor = value.slice(0, cursorPosition);
      const lastAtIndex = textBeforeCursor.lastIndexOf("@");

      if (lastAtIndex !== -1 && cursorPosition > lastAtIndex && !textBeforeCursor.slice(lastAtIndex).includes(" ")) {
        const query = textBeforeCursor.slice(lastAtIndex + 1);
        setMentionQuery(query);
        setMentionPosition(lastAtIndex);
        setShowMentionDropdown(true);
      } else {
        setShowMentionDropdown(false);
        setMentionQuery("");
      }
    }
  };

  const getChannelMembers = () => {
    const channel = channels.find((ch) => ch._id === selectedChatData._id);
    return channel ? [...channel.members, channel.admin] : [];
  };

  const filteredMembers = () => {
    const members = getChannelMembers();
    return members
      .filter((member) => member && member.firstName && member.firstName.toLowerCase().includes(mentionQuery.toLowerCase()))
      .map((member) => ({
        id: member._id,
        name: member.firstName,
      }));
  };

  const handleMentionSelect = (member) => {
    const beforeMention = message.slice(0, mentionPosition);
    const afterMention = message.slice(mentionPosition + mentionQuery.length + 1);
    const newMessage = `${beforeMention}@${member.name} ${afterMention}`;
    setMessage(newMessage);
    setShowMentionDropdown(false);
    setMentionQuery("");
  };

  const handleSendMessage = async () => {
   
    if (selectedChatType === "contact") {
      const messageData = {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
      };
      socket.emit("sendMessage", messageData);
    } 
    
    else if (selectedChatType === "channel") {
      const channelData = {
        sender: userInfo.id,
        content: message,
        messageType: "text",
        channelId: selectedChatData._id,
      };
      socket.emit("send-channel-message", channelData);         
    }
    setMessage("");
    setShowMentionDropdown(false);
  };
  

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex items-center px-8 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5 relative">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none text-white"
          placeholder="Enter Message"
          value={message}
          onChange={handleInputChange}
          disabled={selectedChatType === undefined}
        />

{showMentionDropdown && selectedChatType === "channel" && (
          <div ref={mentionRef} className="absolute bottom-14 left-0 bg-[#2a2b33] text-white rounded-md shadow-lg max-h-40 overflow-y-auto">
            {filteredMembers().length > 0 ? (
              filteredMembers().map((member) => (
                <div
                  key={member.id}
                  className="p-2 hover:bg-green-600 cursor-pointer"
                  onClick={() => handleMentionSelect(member)}
                >
                  {member.name}
                </div>
              ))
            ) : (
              <div className="p-2 text-gray-500">... </div>
            )}
          </div>
        )}

        <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
          <GrAttachment className="text-2xl" />
        </button>
        <div className="relative">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={() => setEmojiPickerOpen(true)}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        className="bg-green-700 rounded-md flex items-center justify-center p-5 focus:border-none hover:bg-green-00 focus:bg-green-600 focus:outline-none focus:text-white duration-300 transition-all"
       onClick={handleSendMessage}
      
        disabled={selectedChatType === undefined || !message.trim()}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;  
