import React, { createContext, useContext, useState } from "react"

const ChatContext = createContext()

export function useChat() {
  return useContext(ChatContext)
}

export function ChatProvider({ children }) {
  const [selectedChat, setSelectedChat] = useState()
  //const [user, setUser] = useState()
  const [notification, setNotification] = useState([])
  const [chats, setChats] = useState([])

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        //user,
        //setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
