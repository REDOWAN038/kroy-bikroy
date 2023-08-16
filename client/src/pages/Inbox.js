

// export default function Inbox () {
//     return <Layout><h1>This is chat box</h1></Layout>
// }
// import Layout from "../components/Layout/Layout";
// import { Box } from "@chakra-ui/layout";
// import { useState } from "react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../context/chatProvider";
// import { ChatState } from "../context/chatProvider";
import Layout from '../components/Layout/Layout'
import {Container, Box} from '@chakra-ui/react'
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/auth";
// import { AddIcon } from "@chakra-ui/icons";
// import { Box, Stack, Text } from "@chakra-ui/layout";
// import { useToast } from "@chakra-ui/toast";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { getSender } from "../config/ChatLogics";
// import ChatLoading from "./ChatLoading";
// import GroupChatModal from "./miscellaneous/GroupChatModal";
// import { Button } from "@chakra-ui/react";
// import { ChatState } from "../Context/ChatProvider";

const Inbox = () => {
  // const [loggedUser, setLoggedUser] = useState();
  const [message, setMessage] = useState('');
  const [allMessage, setAllMessage] = useState([]);

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const [selectedChatName, setSelectedChatName] = useState('');
  const [auth] = useAuth();

  const [updatePage, setUpdatePage] = useState(false);

  
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        };
        
        const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/chat`, config);
        console.log(data);
        setChats(data);
      } catch (error) {
        
      }
    };
    if(auth.token)  fetchChats();
  }, [auth.token, updatePage])

  useEffect(() => {
    const fetchAllMessage = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        };
        
        const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/message/${selectedChat}`, config);
        console.log(data);
        setAllMessage(data?.reverse());
      } catch (error) {
        
      }
    };
    if(selectedChat)  fetchAllMessage();
  }, [selectedChat, updatePage]);

  useEffect(() => {
    const filteredChat = chats?.find(chat => chat._id === selectedChat)
    const receiver = filteredChat?.users?.find(usersss => usersss._id !== user.id)
    receiver?.name && setSelectedChatName(receiver?.name);
  }, [chats, selectedChat, user.id])

  const submitMessage = async () => {
    const text = message;
    if(!text || !auth.token || !selectedChat) return;

    
    const config = {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
      
    };

    const Messagedata = {
        content: text,
        chatId: selectedChat
    }
    try {
    const {data} = await axios.post(`${process.env.REACT_APP_API}/api/v1/message/`, Messagedata, config)
    
    setMessage('');
    setUpdatePage(prev => !prev);

    } catch(e) {
      console.log(e);
    }
     
  }


  // useEffect(() => {
  //   setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
  //   fetchChats();
  //   // eslint-disable-next-line
  // },[fetchAgain]);

  return(
    <div style={{width:"100%"}}>
        <Layout>
      {/* {user && <SideDrawer/>}
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats/>}
        {user && <Chatbox/>}
      </Box> */}
      <div className="w-[70%] mx-auto mt-20">
        <div className="flex h-[70vh] border-2 shadow text-slate-800">
          {/* // left side  */}
          <div className="basis-[30%] bg-slate-300 px-3 py-3 overflow-y-auto">
            <h1 className="text-2xl uppercase font-bold tracking-widest mb-5">Users</h1>
            <div className="user-list overflow-y-auto">
              <ul className="flex flex-col gap-2 overflow-y-auto">
                {chats.length === 0 && <h1 className="text-center">No chats</h1>}
                {chats.map(chat => {
                  const receiver = chat.users.find(userss => userss._id !== user.id)
                  const lastMsg = chat.latestMessage?.content;

                  return <li key={chat._id} className="w-full px-2 py-2 bg-slate-400 hover:bg-slate-500 cursor-pointer duration-300 flex flex-col gap-2" onClick={() => setSelectedChat(chat._id)}>

                  <span className="">{receiver.name}</span>
                  <span className="text-sm font-bold">Message: 
                    <span className="font-normal">{lastMsg}</span>
                  </span>

                </li>
                })}
                
              </ul>
            </div>
          </div>
          {/* right side  */}
          <div className="basis-[70%]">
            {/* // show chats  */}
            <div className="flex flex-col justify-between h-full">
              <div className="bg-slate-400 py-2 px-4 font-bold text-xl">{selectedChatName || 'Chat'}</div>
              <div className="bg-slate-500 flex-grow overflow-y-hidden">
                {/* content  */}
                <div className="flex flex-col-reverse h-full gap-2 px-4 py-3 overflow-y-auto relative" id="messageContent">
                  {allMessage.length === 0 && <h1 className="text-center">Please select a chat</h1>}

                  {allMessage.map(message => {
                    const isSender = message.sender._id === user.id;
                    if(isSender) return <div key={message._id} className="msg sender ml-auto px-3 py-2 bg-[#eb3223] text-white rounded-lg max-w-[300px]">
                    {message?.content}
                  </div> 
                    else return <div key={message._id} className="msg receiver px-3 py-2 bg-gray-400 rounded-lg mr-auto">
                    {message?.content}
                  </div>
                  })}

                  
                </div>
              </div>
              <div className="px-4 py-3 flex gap-4">
                
                <input type="text" id="message" name="message" value={message} onChange={(e) => setMessage(e.target.value)} className="flex-grow px-4 py-2 focus:outline-none border-2 border-slate-800 " placeholder="Enter message" />
                <button type="submit" className="px-4 py-2 uppercase bg-slate-800 text-slate-100" onClick={submitMessage}>Send</button>
                
              </div>
            </div>
          </div>
        </div>
      </div>
      </Layout>
    </div>

    
  )
};

export default Inbox;