"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowLeft, Bot, User, FileText, Briefcase, Code2, Mail, User as UserIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import Image from "next/image";

interface Message {
  id: string;
  text?: string;
  message?: string;
  sender: "user" | "bot";
  timestamp: Date;
  context?: string;
  source?: string;
  image?: string; // Added image field
}

interface ChatContext {
  type: "general" | "me" | "resume" | "projects" | "skills" | "contact";
  title: string;
  description: string;
  icon: any;
}

const chatContexts: Record<string, ChatContext> = {
  general: {
    type: "general",
    title: "AI Assistant",
    description: "Ask me anything about Vivek's portfolio or general questions",
    icon: Bot,
  },
  me: {
    type: "me",
    title: "About Me",
    description: "Learn more about Vivek's background and interests",
    icon: UserIcon,
  },
  resume: {
    type: "resume",
    title: "Resume & Experience",
    description: "Ask about Vivek's work experience and qualifications",
    icon: FileText,
  },
  projects: {
    type: "projects",
    title: "Projects",
    description: "Explore Vivek's projects and technical work",
    icon: Briefcase,
  },
  skills: {
    type: "skills",
    title: "Skills & Technologies",
    description: "Learn about Vivek's technical skills and expertise",
    icon: Code2,
  },
  contact: {
    type: "contact",
    title: "Contact Information",
    description: "Get in touch with Vivek",
    icon: Mail,
  },
};

function LanguagesSpokenCard() {
  return (
    <div className="rounded-xl bg-white/80 shadow p-4 flex flex-col gap-2">
      <div className="font-semibold text-lg flex items-center gap-2">
        🗣️ Languages Spoken
      </div>
      <div className="flex flex-wrap gap-2 mt-1">
        <span className="bg-black text-white rounded px-3 py-1 text-sm">English</span>
        <span className="bg-black text-white rounded px-3 py-1 text-sm">Malayalam</span>
        <span className="bg-black text-white rounded px-3 py-1 text-sm">Hindi</span>
      </div>
    </div>
  );
}

function AvailabilityCard() {
  return (
    <div className="rounded-xl bg-white/80 shadow p-4 flex flex-col gap-2">
      <div className="font-semibold text-lg flex items-center gap-2">
        🟢 Open to Internships
      </div>
      <div className="text-gray-700">
        Actively searching for internships for <b>Summer 2026</b>.<br/>
        If you have an opportunity or want to collaborate, feel free to reach out!
      </div>
    </div>
  );
}

function IcebreakersCard() {
  return (
    <div className="rounded-xl bg-white/80 shadow p-4 flex flex-col gap-2">
      <div className="font-semibold text-lg flex items-center gap-2">
        🎉 Fun Facts / Icebreakers
      </div>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>I'm currently building an app to plan my studies. Now I just need to actually study!</li>
        <li>My code runs better than my sleep schedule.</li>
        <li>Some people meditate. I write <code>console.log('why')</code>.</li>
      </ul>
    </div>
  );
}

function ChatbotContent() {
  const searchParams = useSearchParams();
  const context = searchParams.get("context") || "general";
  const initialQuery = searchParams.get("query") || "";
  const chatContext = chatContexts[context] || chatContexts.general;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      text: `Hello! I'm Vivek's AI assistant. ${chatContext.description}`,
      sender: "bot",
      timestamp: new Date(),
      context: context,
      source: "custom",
    };
    setMessages([welcomeMessage]);

    // Add initial query if provided
    if (initialQuery) {
      setTimeout(() => {
        handleSendMessage(initialQuery);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, initialQuery, chatContext.description]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
      context: context,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text.trim(),
          context: context,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      console.log('Chatbot received data:', data);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        message: data.message,
        image: data.image,
        sender: "bot",
        timestamp: new Date(),
        context: context,
        source: data.source,
      };
      console.log('Created bot message:', botMessage);
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', {
        message: text.trim(),
        context: context,
        error: error instanceof Error ? error.message : error
      });
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
        context: context,
        source: "error",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  const renderMessageContent = (message: Message) => {
    console.log('Rendering message:', message);
    
    let customCard: React.ReactNode = null;
    if (message.sender === "bot" && message.source === "custom") {
      const msg = (message.message || message.text || "").toLowerCase();
      
      // Only show custom cards for very specific messages, not for full "about me" responses
      if (msg.includes("internship") && msg.includes("open to internships") && !msg.includes("about me")) {
        customCard = <AvailabilityCard />;
      } else if (
        // Only show ice breakers for standalone ice breaker responses, not full about me responses
        (msg.includes("my code runs better than my sleep schedule") ||
        msg.includes("console.log('why')") ||
        msg.includes("building an app to plan my studies") ||
        msg.includes("actually study")) &&
        !msg.includes("about me") &&
        !msg.includes("education") &&
        !msg.includes("experience") &&
        !msg.includes("interests")
      ) {
        customCard = <IcebreakersCard />;
      }
    }
    
    // If there's a custom card, return it
    if (customCard) {
      console.log('Returning custom card');
      return customCard;
    }
    
    // Check if the message contains HTML (starts with <div or contains HTML tags)
    const messageContent = message.message || message.text || "";
    console.log('Message content:', messageContent);
    
    if (messageContent.includes('<div') || messageContent.includes('<span') || messageContent.includes('<a')) {
      console.log('Returning HTML content');
      return <div className="text-sm" dangerouslySetInnerHTML={{ __html: messageContent }} />;
    }
    
    // Otherwise return plain text
    console.log('Returning plain text');
    return <p className="text-sm">{messageContent}</p>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Portfolio</span>
          </Link>
          <div className="flex items-center gap-3">
            <chatContext.icon className="w-6 h-6 text-green-600" />
            <div>
              <h1 className="text-lg font-semibold text-gray-800">{chatContext.title}</h1>
              <p className="text-sm text-gray-600">{chatContext.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 min-h-[400px] sm:h-[600px] flex flex-col w-full">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-6 space-y-2 sm:space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "bot" && message.source === "custom" ? (
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Image src="/vivek.jpg" alt="Vivek's Avatar" width={32} height={32} className="rounded-full border-2 border-green-400 shadow-md mt-1 w-8 h-8 sm:w-10 sm:h-10" />
                      <div className={`max-w-[90vw] sm:max-w-[80%] rounded-2xl px-2 sm:px-4 py-2 sm:py-3 bg-gray-100 text-gray-800`}>
                        {renderMessageContent(message)}
                        {message.image && (
                          <img
                            src={message.image}
                            alt="Vivek's photo"
                            className="mt-2 sm:mt-3 rounded-full w-24 h-24 sm:w-40 sm:h-40 object-cover border-2 border-green-400 shadow-md"
                          />
                        )}
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <span className="text-xs opacity-50">👤 Vivek</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`max-w-[90vw] sm:max-w-[80%] rounded-2xl px-2 sm:px-4 py-2 sm:py-3 ${
                        message.sender === "user"
                          ? "bg-green-600 text-black"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {renderMessageContent(message)}
                      {message.image && (
                        <img
                          src={message.image}
                          alt="Vivek's photo"
                          className="mt-2 sm:mt-3 rounded-full w-24 h-24 sm:w-40 sm:h-40 object-cover border-2 border-green-400 shadow-md"
                        />
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {message.sender === "bot" && (
                          <span className="text-xs opacity-50">
                            {message.source === "openai" ? "🤖 AI" : message.source === "custom" ? "👤 Vivek" : "⚠️ Error"}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-gray-100 text-gray-800 rounded-2xl px-2 sm:px-4 py-2 sm:py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-2 sm:p-6 border-t border-white/50">
            <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-2 sm:px-4 py-2 sm:py-3 rounded-xl bg-white/90 border border-white/70 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-900 placeholder:text-gray-800 text-sm sm:text-base md:text-lg"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="px-3 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-base"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 

export default function ChatbotPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chatbot...</p>
        </div>
      </div>
    }>
      <ChatbotContent />
    </Suspense>
  );
} 