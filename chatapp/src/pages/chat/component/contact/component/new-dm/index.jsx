import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { FaPlus } from "react-icons/fa"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader, 
    DialogTitle,
  } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { HOST, SEARCH_CONTACTS_ROUTES } from "@/utiles/constants"
import { apiClient } from "@/lib/api-client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { getColor } from "@/lib/utils"
import { useAppStore } from "@/store"

const NewDM=()=> {
  
    const {setselectedChatType, setselectedChatData} = useAppStore();
    const [openNewContactModal, setOpenNewContactModal]=useState(false)
    const [searchedContacts, setSearchedcontacts]= useState([])
   
    const searchContacts= async(searchTerm)=> {
        try{
                if(searchTerm.length > 0)
                {
                    const response = await apiClient.post(
                        SEARCH_CONTACTS_ROUTES,
                        { searchTerm},
                        { withCredentials: true}
                    );
                    
                    if(response.status===200 && response.data.contacts )
                    {
                        setSearchedcontacts(response.data.contacts);
                    }
                }
                    else{
                        setSearchedcontacts([]);
                    }

                
        }catch(error)
        { console.log ({error})}
    }
    
    const selectNewContact = (contact) =>{
      console.log("Selected Contact:", contact);
        setOpenNewContactModal(false);
        setselectedChatType("contact");
        setselectedChatData(contact);
        setSearchedcontacts([]);
    }

    return (

<>    
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>
        <FaPlus
        className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"

        onClick={() => setOpenNewContactModal(true)}
        />
    </TooltipTrigger>
    <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
      Select New Contact
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
    
<Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
  <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col ">
    <DialogHeader>
      <DialogTitle>Please select a contact </DialogTitle>
      <DialogDescription>
       
      </DialogDescription>
    </DialogHeader> 
    <div>
        <Input placeholder="Search Contact"
        className="rounded-lg p-6 bg-[#2c2e3b] border-none" 
        onChange={ e => searchContacts(e.target.value)}/>
    </div>

    <ScrollArea className="h-[250px]">
        <div className="flex flex-col gap-5">
            {
                searchedContacts.map((contact)=>(
                    <div key={ contact._id} 
                    className="flex gap-3 items-center cursor-pointer"
                    onClick={()=> selectNewContact(contact)}>

<div className="w-12 h-12 relative">
        <Avatar className="h-12 w-12 rounded-full overflow-hidden">
          { 
            contact.image ? (
              <AvatarImage 
              src={`${HOST}/${contact.image}`}
              alt="profile"
              className="object-cover w-full h-full bg-black"/>
            ) : (

              <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)} `}>

                { contact.firstName 
                
                ?contact.firstName.split("").shift() 
                : contact.email.split("").shift()}
              </div>
            )
          }
        </Avatar>
        </div>
        <div className="flex flex-col">
            <span>                           
                <span className="text-white font-medium">
                {contact.firstName && contact.lastName 
                ? `${contact.firstName} ${contact.lastName}` 
                : contact.firstName || contact.email}
            </span>

                        {contact.email && (
                <span className="text-gray-400 text-sm block">
                {contact.email}
                </span> )}

           </span>

           <span className="text-xs"> 

            </span>

        </div>
                    </div>
                ))
            }
        </div>
    </ScrollArea>
    {
        searchedContacts.length<=0 && (
     
       
        <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-20 lg:text-xl text-m transition-all duration-300 text-center"> 

        <h5 className="poppins-thin "> Find your contacts here </h5>
        </div> )
    }
  </DialogContent>
</Dialog>

</>
  )

}
  

export default NewDM

