import User from "../models/UserModel.js";
import Channel from "../models/ChannelModel.js";
import mongoose from "mongoose";

export const createChannel =  async (request,response,next) => {
    try{      
       const{name, members} =request.body;
       const userId = request.userId;

        const admin = await User.findById(userId);

        if(!admin)
        {
            return response.status(400).send("Admin user not fiund");
        }

        
        const validMembers=await User.find({_id: { $in: members}});

        if(validMembers.length !== members.length){
            return response.status(400).send("Some members are not valid users");
        }
        const newChannel = new Channel({
            name,
            members: validMembers.map(m => m._id),
            admin: userId, 
        });

        await newChannel.save();
        const populatedChannel = await Channel.findById(newChannel._id).populate("members", "firstName email color").populate("admin", "firstName email color");
        return response.status(201).json({channel: populatedChannel});

    } catch(error){
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
}; 

export const getUserChannels =  async (request,response,next) => {
    try{      
    const userId = request.userId;
    const channels = await Channel.find({ $or: [{ admin: userId }, { members: userId }] })
      .populate("members", "firstName email color")
      .populate("admin", "firstName email color");
    return response.status(200).json({ channels });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
    
    }
}; 
 

export const getChannelMessages =  async (request,response,next) => {
    try{      
      const{channelId} = request.params;
      console.log(`Fetching messages for channelId: ${channelId}`);
       const channel = await Channel.findById(channelId).populate({ 
        path:"messages",
        populate:{
            path:"sender",
            select: "firstName email color"
        },
       });
       if(!channel){
        return response.status(404).send("Channel not found");
       } 
       console.log(`Found channel: ${channel._id}, messages: ${channel.messages.length}`);
       const messages = channel.messages;

      return response.status(200).json({ messages }); 
    } catch(error){
        console.log({ error });
        return response.status(500).send("Internet Server Error");
    }
}; 