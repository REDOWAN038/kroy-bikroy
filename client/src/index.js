import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./context/auth"
import { CategoryProvider } from "./context/CategoryContext"
import { SearchProvider } from "./context/SearchContext"
import "antd/dist/reset.css"
import ChatProvider from "./context/chatProvider"
// import ChatProvider from "./contex/chatProvider"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <AuthProvider>
    <CategoryProvider>
      <SearchProvider>
        <BrowserRouter>
          <ChatProvider>
            <App />
          </ChatProvider>
        </BrowserRouter>
      </SearchProvider>
    </CategoryProvider>
  </AuthProvider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
