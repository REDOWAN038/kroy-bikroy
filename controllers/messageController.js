const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const Chat = require('../models/chatModel');

const sendMessage = asyncHandler(async (req,res)=>
{
    const { content ,chatId } = req.body;
    if(!content || ! chatId)
    {
        console.log("Invalid data passed into request")
        return res.json({
            message: "Invalid data passed into request"
        })
    }

    var newMessage = {
        sender: req.user._id,
        content:content,
        chat: chatId,
    };

    console.log(newMessage);
    
    try{
        // var message = await Message.Create(newMessage);
        let message = new Message(newMessage);
        let messageData = await message.save();

        // message = await Message.populate("sender","name pic");
        // message = await Message.populate("chat");
        // message = await User.populate(message,{
        //     path : "chat-users",
        //     select : "name pic email",

        // });
        messageData.populate('chat')
        messageData.populate('sender', 'name pic')
        // messageData.populate('chat')
        
        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage: message,

        });
        res.json(message);
    }
    catch(error){
        console.log("Errrrro");
        res.status(400);
        throw new Error(error.message);

    }

});

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessage = asyncHandler(async (req, res) => {
    try {
      const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "name pic email")
        .populate("chat");
      res.json(messages);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });


module.exports={sendMessage, allMessage};