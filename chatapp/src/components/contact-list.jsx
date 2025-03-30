import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store"
import { HOST } from "@/utiles/constants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

const Contactlist = ({ contacts, isChannel = false}) => {

    const {
        selectedChatData,
        selectedChatType,
        setselectedChatType,
        setselectedChatData,
        setselectedChatMessages, 
    } = useAppStore();

    const handleClick =(contact) => {
        if(isChannel) setselectedChatType("channel");
        else setselectedChatType("contact");
        setselectedChatData(contact);
        if(selectedChatData && selectedChatData._id !== contact._id){
            setselectedChatMessages([])
        }
    };

    return (
    <div className="mt-5">
     { contacts.map((contact) => (
        <div 
        key={contact._id} 
        className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${selectedChatData && (selectedChatData._id === contact._id )
        ? "bg-green-800 hover: bg-green-800"
        :"hover:bg-[#f1f1f111]" }`} 
        onClick={() => handleClick(contact)}
        >
           <div className="flex gap-5 items-center justify-start text-neutral-300">
            {
            !isChannel && (<Avatar className="h-10 w-10 rounded-full overflow-hidden">
            { 
              contact.image ? (
                <AvatarImage
                src={`${HOST}/${contact.image}`}
                alt="profile"
                className="object-cover w-full h-full bg-black"/>
              ) : (
  
                <div className={`uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)} `}>
  
                  { contact.firstName                 
                  ?contact.firstName.split("").shift() 
                  : contact.email.split("").shift()}
                </div>
              )
            }
          </Avatar> 
           ) }
           {
            isChannel && (
            <div className="bg-[#ffffff22] h-10 w-10 flex item-center justify-center rounded-full">#</div>
           )}
            { 
                isChannel ? (<span>{contact.name}</span> ) : (
                    <span> {contact.firstName
                    ? `${contact.firstName}`
                    : contact.email }</span>
                )
            }
           </div>
           </div>  
     ) )}
   
    </div>
  ) 
}

export default Contactlist;
