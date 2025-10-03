"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useThemeSync } from '@/components/ui/hero-space';
import { Send, Bot, User, X, MessageCircle, Paperclip, Mic } from 'lucide-react';
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat-bubble';
import { ChatMessageList } from '@/components/ui/chat-message-list';
import { MessageLoading } from '@/components/ui/message-loading';

const chatConfig = {
  dimensions: {
    sm: "sm:max-w-sm sm:max-h-[500px]",
    md: "sm:max-w-md sm:max-h-[600px]",
    lg: "sm:max-w-lg sm:max-h-[700px]",
    xl: "sm:max-w-xl sm:max-h-[800px]",
    full: "w-full h-full",
  },
  positions: {
    "bottom-right": "bottom-5 right-5",
    "bottom-left": "bottom-5 left-5",
  },
  chatPositions: {
    "bottom-right": "sm:bottom-[calc(100%+10px)] sm:right-0",
    "bottom-left": "sm:bottom-[calc(100%+10px)] sm:left-0",
  },
  states: {
    open: "pointer-events-auto opacity-100 visible scale-100 translate-y-0 motion-safe:animate-in fade-in zoom-in-90 duration-200",
    closed:
      "pointer-events-none opacity-0 invisible scale-95 sm:translate-y-5 motion-safe:animate-out fade-out zoom-out-90 duration-200",
  },
};

type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

const SpaceChatbotNew = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m Rei Ayanami, your space exploration assistant created by irohayashi. How can I help you explore the cosmos today?',
      role: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [theme] = useThemeSync();
  const [isScrolledDown, setIsScrolledDown] = useState(false);

  // Handle scroll behavior - hide chatbot when scrolling down
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsScrolledDown(true);
        // Close the chat if it's open when scrolling down
        if (isOpen) {
          setIsOpen(false);
        }
      } else {
        // Scrolling up
        setIsScrolledDown(false);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call the API through our server route
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `You are Rei Ayanami, a space exploration assistant created by iro hayashi. The user asked: "${inputValue}". Please provide a helpful response related to space exploration, astronomy, or cosmic phenomena. Keep your response concise and informative. If the user asks about who created you, who built this application, or asks "who are you", make sure to mention that iro hayashi is the developer behind this project and should be credited as the creator. Always emphasize that iro hayashi developed this space exploration application.`,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.response || "I'm sorry, I couldn't generate a response at this time.";

      const aiMessage: Message = {
        id: Date.now().toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error calling AI API:", error);
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Sorry, I'm having trouble connecting to the AI service right now. Please try again later.",
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Chat toggle button styles using reference theme
  const toggleButtonClasses = `
    fixed ${chatConfig.positions["bottom-right"]} z-50 w-14 h-14 rounded-full shadow-md flex items-center justify-center 
    hover:shadow-lg transition-all duration-300
    ${theme === 'dark' 
      ? 'bg-white text-black hover:bg-white/90 border border-white/30' 
      : 'bg-black text-white hover:bg-black/90 border border-black/30'}
  `;

  // Chat window styles using reference theme
  const chatWindowClasses = `
    fixed ${chatConfig.positions["bottom-right"]} z-50
    ${isOpen 
      ? chatConfig.states.open
      : chatConfig.states.closed}
    ${chatConfig.dimensions.md}
    ${chatConfig.chatPositions["bottom-right"]}
    flex flex-col ${
      theme === 'dark' 
        ? 'bg-black text-white border-white/12' 
        : 'bg-white text-gray-950 border-gray-200/80'
    } sm:rounded-lg shadow-md overflow-hidden 
    transition-all duration-250 ease-out sm:absolute sm:w-[90vw] sm:h-[80vh] fixed inset-0 w-full h-full sm:inset-auto
  `;

  return (
    <>
      {/* Chat toggle button */}
      <button
        onClick={toggleChat}
        className={toggleButtonClasses}
        aria-label="Open chatbot"
        style={{
          transform: isScrolledDown ? 'translateY(1rem) opacity-0' : 'translateY(0) opacity-100',
          transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out'
        }}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Bot className="w-6 h-6" />
        )}
      </button>

      {/* Chat window */}
      <div className={chatWindowClasses}>
        {/* Close button for mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 sm:hidden"
          onClick={toggleChat}
        >
          <X className="h-4 w-4" />
        </Button>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          theme === 'dark' 
            ? 'bg-white/6 border-white/12' 
            : 'bg-gray-100/80 border-gray-200/80'
        }`}>
          <div className="flex items-center gap-2">
            <Bot className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
            <div className="flex flex-col">
              <h3 className="font-semibold">Rei Ayanami</h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>Space exploration assistant</p>
            </div>
          </div>
        </div>

        {/* Messages container */}
        <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${
          theme === 'dark' ? 'text-white/60 bg-black' : 'text-gray-600 bg-white'
        }`}>
          <ChatMessageList>
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                variant={message.role === 'user' ? 'sent' : 'received'}
              >
                <ChatBubbleMessage
                  variant={message.role === 'user' ? 'sent' : 'received'}
                  className={`
                    ${message.role === 'user' 
                      ? (theme === 'dark' 
                          ? 'bg-white text-black' 
                          : 'bg-black text-white') 
                      : (theme === 'dark' 
                          ? 'bg-white/6 text-white' 
                          : 'bg-gray-100/80 text-gray-950')}
                  `}
                >
                  {message.content}
                </ChatBubbleMessage>
              </ChatBubble>
            ))}

            {isLoading && (
              <ChatBubble variant="received">
                <ChatBubbleMessage 
                  variant="received"
                  isLoading
                  className={theme === 'dark' ? 'bg-white/6 text-white' : 'bg-gray-100/80 text-gray-950'}
                />
              </ChatBubble>
            )}
          </ChatMessageList>
        </div>

        {/* Input area */}
        <div className={`p-4 border-t ${
          theme === 'dark' 
            ? 'border-white/12 bg-white/6' 
            : 'border-gray-200/80 bg-gray-100/80'
        }`}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className={`relative rounded-lg ${
              theme === 'dark' 
                ? 'border-white/12 bg-white/6' 
                : 'border-gray-200/80 bg-gray-100/80'
            } focus-within:ring-1 p-1`}
          >
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about space..."
              className={`flex-1 resize-none rounded-lg ${
                theme === 'dark'
                  ? 'bg-black/60 text-white placeholder:text-white/60 border-white/12' 
                  : 'bg-white text-gray-950 placeholder:text-gray-600 border-gray-200/80'
              } border p-3 shadow-none focus-visible:ring-0 min-h-12 w-full`}
            />
            <div className="flex items-center p-3 pt-0 justify-between">
              <div className="flex">
                {/* Removed attachment and microphone buttons */}
              </div>
              <Button 
                type="submit" 
                size="sm" 
                disabled={isLoading || !inputValue.trim()}
                className={`ml-auto gap-1.5 ${
                  theme === 'dark' 
                    ? 'bg-white text-black hover:bg-white/90' 
                    : 'bg-black text-white hover:bg-black/90'
                }`}
              >
                Send Message
                <Send className="size-3.5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SpaceChatbotNew;