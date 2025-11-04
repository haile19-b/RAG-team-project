'use client'
import { Input } from "@/components/ui/input"
import Toggle from "./toggle-theme"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowUp } from "lucide-react"

function Page() {
  const [chat, setChat] = useState([
    {
      subject: "user",
      text: "this text from user"
    },
    {
      subject: "ai",
      text: "this text from ai"
    },
    {
      subject: "user",
      text: "this text from user"
    },
  ])

  const [isOnChat, setIsOnChat] = useState(true)

  return (
    <div className="min-h-screen p-4 bg-white dark:bg-gray-900 w-full flex flex-col justify-between">
      <div className="w-full flex justify-end fixed top-2 right-4">
        <Toggle/>
      </div>
      
      {isOnChat ? (
        <div className="flex flex-col items-center w-full max-w-5xl mx-auto mt-16 mb-24">
          <h1 className="text-2xl font-bold mb-8">Haile's AI Assistant!</h1>
          <ScrollArea className="w-full h-[60vh] px-4">
            <div className="space-y-6">
              {/* Map through chat messages */}
              {chat.map((message, index) => (
                <div
                  key={index}
                  className={`rounded-3xl px-6 py-4 max-w-2xl w-fit ${
                    message.subject === "user" 
                      ? "bg-slate-100 dark:bg-slate-800 rounded-br-none ml-auto" 
                      : "bg-slate-200 dark:bg-slate-700 rounded-bl-none mr-auto"
                  }`}
                >
                  <p>{message.text}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      ) : (
        <div className="flex flex-col gap-5 max-w-2xl justify-center items-center mb-10 mt-16">
          <h2 className="text-3xl font-bold">👋 Hello! I'm Haile's AI Assistant</h2>
          <p className="text-xl text-center text-gray-600 dark:text-gray-300">
            Curious about <strong>Haile</strong>?  
            Ask me anything — I'll tell you all you need to know.
          </p>
        </div>
      )}
      
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4">
        <div className="flex bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <Input 
            type="text" 
            placeholder="Ask me anything" 
            className="outline-0 border-0 flex-1"
          />
          <Button size='icon' variant="outline" className="border-0 border-l rounded-l-none">
            <ArrowUp/>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Page