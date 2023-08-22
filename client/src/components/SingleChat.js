import React, { useState, useEffect } from "react"
import { FormControl } from "@chakra-ui/form-control"
import { Input } from "@chakra-ui/input"
import { Box, Text } from "@chakra-ui/layout"
import { IconButton, Spinner } from "@chakra-ui/react"
import axios from "axios"
import { ArrowBackIcon } from "@chakra-ui/icons"
import Lottie from "lottie-web"
import animationData from "./animations/typing.json"
import io from "socket.io-client"
import { useChat } from "../context/chatContext"
import { useAuth } from "../context/auth"
import { getSenderFull, getSenderR } from "./ChatLogics"
import ScrollableChat from "./ScrollableChat"

const ENDPOINT = "http://localhost:8080"
var socket, selectedChatCompare

const SingleChat = () => {
  const [auth] = useAuth()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [istyping, setIsTyping] = useState(false)

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  }

  const { selectedChat, setSelectedChat, notification, setNotification } =
    useChat()

  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit("setup", auth?.user)
    socket.on("connected", () => setSocketConnected(true))
    socket.on("typing", () => setIsTyping(true))
    socket.on("stop typing", () => setIsTyping(false))

    // eslint-disable-next-line
  }, [])

  const fetchMessages = async () => {
    if (!selectedChat) return

    try {
      setLoading(true)
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/message/${selectedChat._id}`
      )

      setMessages(data?.messages)
      setLoading(false)

      socket.emit("join chat", selectedChat._id)
    } catch (error) {
      console.log(error)
    }
  }

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id)
      try {
        setNewMessage("")

        const { data } = await axios.post(
          `${process.env.REACT_APP_API}/api/v1/message`,
          {
            content: newMessage,
            chatId: selectedChat,
          }
        )

        socket.emit("new message", data?.message)
        setMessages([...messages, data?.message])
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    fetchMessages()

    selectedChatCompare = selectedChat
    // eslint-disable-next-line
  }, [selectedChat])

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification])
        }
      } else {
        setMessages([...messages, newMessageRecieved])
      }
    })
  })

  const typingHandler = (e) => {
    setNewMessage(e.target.value)

    if (!socketConnected) return

    if (!typing) {
      setTyping(true)
      socket.emit("typing", selectedChat._id)
    }
    let lastTypingTime = new Date().getTime()
    var timerLength = 3000
    setTimeout(() => {
      var timeNow = new Date().getTime()
      var timeDiff = timeNow - lastTypingTime
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id)
        setTyping(false)
      }
    }, timerLength)
  }

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w='100%'
            fontFamily='Work sans'
            d='flex'
            justifyContent={{ base: "space-between" }}
            alignItems='center'
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
              style={{ marginRight: "20px" }}
            />
            {messages && selectedChat.chatName.toUpperCase()}
            {/* // (!selectedChat.isGroupChat ? (
              //   <>{getSenderR(user, selectedChat.users)}</>
              // ) : (
                <>{selectedChat.chatName.toUpperCase()}</>
              )} */}
          </Text>
          <Box
            d='flex'
            flexDir='column'
            justifyContent='flex-end'
            p={3}
            bg='#E8E8E8'
            w='100%'
            h='100%'
            borderRadius='lg'
            overflowY='hidden'
          >
            {loading ? (
              <Spinner
                size='xl'
                w={20}
                h={20}
                alignSelf='center'
                margin='auto'
              />
            ) : (
              <div className='messages'>
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id='first-name'
              isRequired
              mt={3}
            >
              {/* {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )} */}
              <Input
                variant='filled'
                bg='#E0E0E0'
                placeholder='Enter a message..'
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box d='flex' alignItems='center' justifyContent='center' h='100%'>
          <Text fontSize='3xl' pb={3} fontFamily='Work sans'>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  )
}

export default SingleChat
