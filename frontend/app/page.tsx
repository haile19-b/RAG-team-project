'use client'
import { Input } from "@/components/ui/input"
import Toggle from "./toggle-theme"
import { Button } from "@/components/ui/button"
import { useState } from "react"

function page() {

  const [chat,setChat] = useState([
    {
      subject:"user",
      text:"this text from user"
    },
    {
      subject:"ai",
      text:"this text from ai"
    },
    {
      subject:"user",
      text:"this text from user"
    },
  ])

  const [isOnChat,setIsOnChat] = useState(true)

  return (
    <div className="min-h-screen p-4 bg-white dark:bg-gray-900 w-full flex flex-col justify-center items-center">
      <div className="w-full h-fit flex justify-end px-30 fixed top-2"><Toggle/></div>
      {isOnChat ?
      (
        <div className="min-h-[80vh] w-7xl">
          <h1 className="text-center">Haile's ai assistance!</h1>
          <div className="flex flex-col justify-center items-center max-w-full p-4 gap-10">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-4xl rounded-br-none max-w-2xl ml-auto px-10 py-5">
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsa error reprehenderit magnam ratione laboriosam 
              molestias consequuntur quas! Reprehenderit iusto dignissimos quo quaerat laboriosam.
               Quisquam quidem qui explicabo aperiam! Veritatis, distinctio!</p>
          </div>

          <div className="bg-slate-200 dark:bg-slate-700 rounded-4xl rounded-bl-none max-w-2xl mr-auto px-10 py-5">
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsa error reprehenderit magnam ratione laboriosam 
              molestias consequuntur quas! Reprehenderit iusto dignissimos quo quaerat laboriosam.
               Quisquam quidem qui explicabo aperiam! Veritatis, distinctio!</p>
          </div>
          </div>
        </div>
      ):
      (
        <div className="flex flex-col gap-5 max-w-2xl justify-center items-center mb-10">
      <h2 className="text-3xl">👋 Hello! I'm Haile’s AI Assistant</h2>
      <p className="text-2xl text-center">
        Curious about <strong>Haile</strong>?  
        Ask me anything — I’ll tell you all you need to know.
        </p>
      </div>
      )
      }
      <div className="flex w-3xl">
      <Input type="text" placeholder="Ask me anything" className="outline-0 border-0" />
      <Button variant="outline">Send</Button>
      </div>
    </div>
  )
}

export default page