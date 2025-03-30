import { useEffect } from "react";
import NewDM from "./component/new-dm";
import ProfileInfo from "./component/profileinfo";
import { apiClient } from "@/lib/api-client";
import { GET_DM_CONTACTS_ROUTES, GET_USER_CHANNELS_ROUTE } from "@/utiles/constants";
import { useAppStore } from "@/store";
import Contactlist from "@/components/contact-list";
import CreateChannel from "./component/create-channel";

const ContactsContainer =() => { 

  const { setDirectMessagesContacts, directMessagesContacts, channels, setChannels} = useAppStore();
  
  useEffect(() => 
  {
    const getContacts = async() =>{
      const response = await apiClient.get(GET_DM_CONTACTS_ROUTES,{
        withCredentials: true,
      });

      if(response.data.contacts) {
        setDirectMessagesContacts(response.data.contacts)
      }
    }; 

    const getChannels = async() =>{
      const response = await apiClient.get(GET_USER_CHANNELS_ROUTE,{
        withCredentials: true,
      });

      if(response.data.channels) {
        console.log("Fetched channels:", response.data.channels);
        setChannels(response.data.channels)
      }
    }; 

    getContacts();
    getChannels();
  }, [setChannels, setDirectMessagesContacts])


  return ( 
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      
      <div className="pt-3">
        <Logo/>
      </div>
      <div className="my-5">
      <div className="flex items-center justify-between pr-10">
        <Title text="Direct Messages"/>
        <NewDM />
      </div>
      |<div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
        <Contactlist contacts={directMessagesContacts} />
      </div>
      </div>

      <div className="my-5">
      <div className="flex items-center justify-between pr-10">
        <Title text="Channels"/>
        <CreateChannel />
      </div>
      |<div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
        <Contactlist contacts={channels} isChannel={true} />
      </div>
      </div>
      <ProfileInfo/>
    </div>
  ) 
}

export default ContactsContainer;

const Logo = () => {
    return (
      <div className="flex p-5  justify-start items-center gap-10 ">
        
        <span className="text-3xl font-semibold ">BrainChat</span>
      </div>
    );
  };
  
const Title = ({text}) =>{
    return(
        <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity text-sm"> {text} </h6>
    )
}