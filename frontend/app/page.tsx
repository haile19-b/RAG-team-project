'use client'

import { askAI } from "@/Requests/ai.response";
import { ChatValues, UseChat } from "@/util/FormValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface ChatMessage extends ChatValues {
  id: number;
  isLoading?: boolean;
  isError?: boolean;
}

export default function Home() {
  const [chat, setChat] = useState<ChatMessage[]>([
    {
      id: 1,
      type: "ai",
      text: "Hi! I'm your RAAG assistant. How can I help you today?"
    }
  ]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ChatValues>({
    resolver: zodResolver(UseChat),
    defaultValues: {
      text: "",
      type: "user"
    }
  });

  const sendRequest = async (data: ChatValues) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now(),
      type: "user",
      text: data.text
    };
    setChat(prev => [...prev, userMessage]);
    reset();

    try {
      // Add loading message
      const loadingMessage: ChatMessage = {
        id: Date.now() + 1,
        type: "ai",
        text: "Thinking...",
        isLoading: true
      };
      setChat(prev => [...prev, loadingMessage]);

      // Get AI response
      const response = await askAI(data.text);
      
      // Remove loading and add AI response
      setChat(prev => 
        prev.filter(msg => !msg.isLoading).concat({
          id: Date.now() + 2,
          text: response.text,
          type: "ai"
        })
      );

    } catch (error) {
      // Remove loading and show error
      setChat(prev => 
        prev.filter(msg => !msg.isLoading).concat({
          id: Date.now() + 2,
          type: "ai",
          text: "Sorry, I encountered an error. Please try again.",
          isError: true
        })
      );
      console.error("AI request failed:", error);
    }
  };

  const clearChat = () => {
    setChat([{
      id: 1,
      type: "ai",
      text: "Hi! I'm your RAAG assistant. How can I help you today?"
    }]);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex justify-center items-center p-4">
      <div className="w-full max-w-4xl h-full flex flex-col items-center">
        
        {/* Header with Logo */}
        <div className="w-full flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full border-4 border-white shadow-lg">
              <Image
                src='/logo.png'
                width={60}
                height={60}
                alt="RAAG AI Logo"
                className="rounded-full"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">RAG AI Assistant</h1>
              <p className="text-gray-600">Powered by your data</p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 transition-colors"
          >
            Clear Chat
          </button>
        </div>

        {/* Chat Container */}
        <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col h-[70vh]">
          
          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {chat.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "ai" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      message.isLoading
                        ? "bg-gray-300 text-gray-600 animate-pulse"
                        : message.isError
                        ? "bg-red-100 text-red-800 border border-red-200"
                        : message.type === "ai"
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        : "bg-gray-800 text-white"
                    } ${
                      message.type === "ai" ? "rounded-bl-none" : "rounded-br-none"
                    } shadow-md`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.text}
                    </p>
                    {message.isLoading && (
                      <div className="flex space-x-1 mt-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white p-4">
            <form onSubmit={handleSubmit(sendRequest)} className="flex items-center gap-3">
              <div className="flex-1">
                <div className={`border-2 rounded-xl px-4 py-3 transition-all ${
                  errors.text ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-300 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100'
                }`}>
                  <input
                    {...register('text')}
                    type="text"
                    placeholder="Ask me anything..."
                    className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-400 text-sm"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.text && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.text.message}</p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 transition-all shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed"
              >
                send
              </button>
            </form>
            
            <p className="text-xs text-gray-500 text-center mt-2">
              RAAG AI • Ask questions based on your data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}