'use client'
import { Input } from "@/components/ui/input"
import Toggle from "./toggle-theme"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowUp } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChatValues, UseChat } from "@/util/FormValidation"
import { chatType } from "@/type"
import { Skeleton } from "@/components/ui/skeleton"
import { askAIStream } from "@/Requests/ai.response"
import Typewriter from "typewriter-effect"

function Page() {
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<ChatValues>({
    resolver: zodResolver(UseChat),
    defaultValues: {
      type: "user",
      text: ""
    }
  })

  const [chat, setChat] = useState<chatType[]>([])
  const [isOnChat, setIsOnChat] = useState(false)
  const [currentStreamingText, setCurrentStreamingText] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chat, currentStreamingText])

  const sendRequest = async (data: ChatValues) => {
    setIsOnChat(true)
    setChat(prev => [...prev, data])
    setIsStreaming(true)
    setCurrentStreamingText("")
    reset()

    try {
      await askAIStream(
        data.text,
        // Called for each chunk
        (chunk: string) => setCurrentStreamingText(prev => prev + chunk),
        // Called when streaming completes
        (fullText: string) => {
          setChat(prev => [...prev, { type: "ai", text: fullText }])
          setCurrentStreamingText("")
          setIsStreaming(false)
        }
      )
    } catch (error) {
      console.error("Error:", error)
      setChat(prev => [...prev, { type: "ai", text: "Sorry, I encountered an error. Please try again." }])
      setIsStreaming(false)
    }
  }

  return (
    <div className="min-h-screen p-4 bg-white dark:bg-gray-900 flex flex-col items-center">
      <div className="w-full flex justify-end fixed top-2 right-4">
        <Toggle />
      </div>

      {isOnChat ? (
        <div className="flex flex-col items-center w-full max-w-5xl mx-auto mt-16 mb-24">
          <h1 className="text-2xl font-bold mb-8">Haile's AI Assistant!</h1>

          <ScrollArea className="w-full h-[60vh] px-4">
            <div className="space-y-6">
              {chat.map((message, index) => (
                <div
                  key={index}
                  className={`rounded-3xl px-6 py-4 max-w-2xl w-fit ${
                    message.type === "user"
                      ? "bg-slate-100 dark:bg-slate-800 rounded-br-none ml-auto"
                      : "bg-slate-200 dark:bg-slate-700 rounded-bl-none mr-auto"
                  }`}
                >
                  {message.type === "ai" ? (
                    <Typewriter
                      options={{
                        strings: [message.text],
                        autoStart: true,
                        delay: 15,
                        cursor: "",
                        loop: false,
                        deleteSpeed:Infinity
                      }}
                    />
                  ) : (
                    <p>{message.text}</p>
                  )}
                </div>
              ))}

              {/* Streaming response */}
              {isStreaming && (
                <div className="rounded-3xl px-6 py-4 max-w-2xl w-fit bg-slate-200 dark:bg-slate-700 rounded-bl-none mr-auto">
                  {currentStreamingText ? (
                    <p>{currentStreamingText}<span className="animate-pulse">|</span></p>
                  ) : (
                    <Skeleton className="h-[20px] w-[200px]" />
                  )}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>
      ) : (
        <div className="flex flex-col gap-5 max-w-2xl items-center mb-10 mt-16">
          <h2 className="text-3xl font-bold">👋 Hello! I'm Haile's AI Assistant</h2>
          <p className="text-xl text-center text-gray-600 dark:text-gray-300">
            Curious about <strong>Haile</strong>? Ask me anything — I'll tell you all you need to know.
          </p>
        </div>
      )}

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4">
        <div className="flex bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <Input
            type="text"
            {...register("text")}
            placeholder="Ask me anything"
            className="outline-0 border-0 flex-1"
            disabled={isSubmitting || isStreaming}
          />
          <Button
            onClick={handleSubmit(sendRequest)}
            type="submit"
            size="icon"
            variant="outline"
            className="border-0 border-l rounded-l-none"
            disabled={isSubmitting || isStreaming}
          >
            <ArrowUp />
          </Button>
        </div>
        {errors.text && (
          <p className="text-right text-red-400 font-sans mt-1">{errors.text.message}</p>
        )}
      </div>
    </div>
  )
}

export default Page