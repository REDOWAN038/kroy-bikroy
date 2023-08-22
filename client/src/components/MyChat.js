import React, { useEffect, useState } from "react"
// import { AddIcon } from "@chakra-ui/icons"
import { Box, Stack, Text } from "@chakra-ui/layout"
import axios from "axios"
import { getSender, getSenderR } from "../components/ChatLogics"
import ChatLoading from "../components/ChatLoading"
import { useChat } from "../context/chatContext"
import { useAuth } from "../context/auth"

const MyChat = () => {
  const [loggedUser, setLoggedUser] = useState()
  const [auth] = useAuth()
  const { selectedChat, setSelectedChat, chats, setChats } = useChat()

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/chat`
      )
      setChats(data?.results)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("auth")))
    fetchChats()
    // eslint-disable-next-line
  }, [])

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir='column'
      alignItems='center'
      p={3}
      bg='white'
      //w={{ base: "100%", md: "31%" }}
      //w={"31%"}
      borderRadius='lg'
      borderWidth='1px'
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily='Work sans'
        d='flex'
        w='100%'
        justifyContent='space-between'
        alignItems='center'
      >
        My Chats
      </Box>
      <Box
        d='flex'
        flexDir='column'
        p={3}
        bg='#F8F8F8'
        w='100%'
        h='100%'
        borderRadius='lg'
        overflowY='hidden'
      >
        {chats ? (
          <Stack overflowY='scroll'>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor='pointer'
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius='lg'
                key={chat._id}
              >
                <h5 fontSize='2xl'>
                  {getSenderR(chat.chatName, auth?.user, chat.users)}
                </h5>
                {chat.latestMessage && (
                  <h6>
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 40
                      ? chat.latestMessage.content.substring(0, 41) + "..."
                      : chat.latestMessage.content}
                  </h6>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  )
}

export default MyChat
