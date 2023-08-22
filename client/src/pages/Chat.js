import React from "react"
import Layout from "../components/Layout/Layout"
import MyChat from "../components/MyChat"
import ChatBox from "../components/ChatBox"
import { useAuth } from "../context/auth"
import { Box } from "@chakra-ui/layout"

const Chat = () => {
  const [auth] = useAuth()
  return (
    <Layout>
      <div className='row'>
        <div className='col-md-4'>{auth?.user && <MyChat />}</div>
        <div className='col-md-8'>{auth?.user && <ChatBox />}</div>
      </div>
      {/* <Box
        d='flex'
        flexDir='row'
        justifyContent='space-between'
        w='100%'
        h='91.5vh'
        p='10px'
      >
        {auth?.user && <MyChat />}
        {auth?.user && <ChatBox />}
      </Box> */}
    </Layout>
  )
}

export default Chat
