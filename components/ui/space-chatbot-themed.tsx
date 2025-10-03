"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useThemeSync } from '@/components/ui/hero-space';
import { Send, Bot, User, X, MessageSquare, Sparkles } from 'lucide-react';

type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

const SpaceChatbotThemed = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m Rei Ayanami, your cosmic guide. How can I assist with your space exploration today?',
      role: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [theme] = useThemeSync();
  const [scrolled, setScrolled] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Add scroll detection to hide chatbot when scrolling down
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    const initialViewportHeight = window.innerHeight;

    // Throttle scroll events for better performance
    const updateScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Check if we're on a mobile device to handle virtual keyboard differently
      const isMobile = window.innerWidth <= 768;
      
      // Check if mobile keyboard might be open (viewport height significantly reduced)
      const currentViewportHeight = window.innerHeight;
      const keyboardThreshold = 150; // pixels that typically indicate keyboard is open
      const isKeyboardOpen = (initialViewportHeight - currentViewportHeight > keyboardThreshold);
      
      // If we're on mobile and the keyboard is open, don't update scroll state
      if (isMobile && isKeyboardOpen) {
        lastScrollY = currentScrollY;
        ticking = false;
        return;
      }
      
      // If scrolling down and scrolled more than 100px, hide the chatbot
      // On mobile (when keyboard is not open), be more conservative
      if (currentScrollY > lastScrollY && currentScrollY > (isMobile && !isKeyboardOpen ? 200 : 100)) {
        // Only hide if there's a significant scroll (not just virtual keyboard)
        const scrollThreshold = isMobile && !isKeyboardOpen ? 50 : 10; // Minimum scroll distance to trigger hiding
        if (currentScrollY - lastScrollY > scrollThreshold) {
          setScrolled(true);
          // Only close if chat is open
          if (isOpen) {
            setIsOpen(false);
          }
        }
      } else if (currentScrollY < lastScrollY) {
        // Show chatbot when scrolling up
        setScrolled(false);
      }
      
      lastScrollY = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    // Also handle resize events to detect mobile keyboard appearance
    const handleResize = () => {
      // Debounce resize events
      setTimeout(() => {
        // Update the scroll state based on the new viewport height
        requestAnimationFrame(updateScroll);
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
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

  // Get theme-specific styles
  const palette = theme === 'dark' 
    ? {
        surface: "bg-black text-white",
        subtle: "text-white/60",
        border: "border-white/12",
        card: "bg-white/6",
        accent: "bg-white/12",
        glow: "rgba(255,255,255,0.14)",
      }
    : {
        surface: "bg-white text-neutral-950",
        subtle: "text-neutral-600",
        border: "border-neutral-200/80",
        card: "bg-neutral-100/80",
        accent: "bg-neutral-100",
        glow: "rgba(17,17,17,0.08)",
      };

  return (
    <>
      {/* Chat toggle button */}
      <button
        onClick={toggleChat}
        className={`
          fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center
          hover:shadow-xl transition-all duration-300
          ${theme === 'dark' 
            ? 'bg-white text-black hover:bg-white/90 border border-white/30' 
            : 'bg-black text-white hover:bg-black/90 border border-black/30'}
          ${scrolled ? 'translate-y-20 opacity-0' : 'translate-y-0 opacity-100'}
        `}
        aria-label="Open chatbot"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Sparkles className="w-6 h-6" />
        )}
      </button>

      {/* Chat window */}
      <div 
        className={`
          fixed bottom-20 right-5 z-50
          ${isOpen 
            ? 'opacity-100 scale-100 translate-y-0 visible' 
            : 'opacity-0 scale-95 translate-y-5 invisible pointer-events-none'}
          w-80 max-h-[600px] flex flex-col 
          ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-950'}
          border rounded-2xl shadow-xl overflow-hidden
          transition-all duration-300 ease-out
          ${palette.border}
        `}
        // Add a data attribute to identify when the chat is open for scroll detection
        data-chat-open={isOpen}
      >
        {/* Header */}
        <div className={`
          flex items-center justify-between p-4 
          ${theme === 'dark' ? 'bg-white/6' : 'bg-neutral-100/80'}
          ${palette.border} border-b
        `}>
          <div className="flex items-center gap-3">
            <div className={`
              rounded-full p-2
              ${theme === 'dark' ? 'bg-white/12' : 'bg-neutral-200/80'}
            `}>
              <Bot className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
            </div>
            <div>
              <h3 className="font-semibold">Rei Ayanami</h3>
              <p className={`text-xs ${palette.subtle}`}>Space exploration assistant</p>
            </div>
          </div>
          <button 
            onClick={toggleChat}
            className={`
              rounded-full p-1.5
              hover:bg-white/10 transition-colors
              ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-200'}
            `}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages container */}
        <div className={`
          flex-1 overflow-y-auto p-4 space-y-4
          ${theme === 'dark' ? 'bg-black' : 'bg-white'}
        `}>
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`
                flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}
              `}
            >
              <div className={`
                max-w-[80%] rounded-2xl px-4 py-3
                ${message.role === 'user'
                  ? theme === 'dark'
                    ? 'bg-white text-black rounded-br-none'
                    : 'bg-black text-white rounded-br-none'
                  : theme === 'dark'
                    ? 'bg-white/6 text-white rounded-bl-none'
                    : 'bg-neutral-100 text-gray-950 rounded-bl-none'
                }
              `}>
                <div className="flex items-start gap-2">
                  {message.role === 'assistant' && (
                    <div className={`
                      mt-0.5 flex-shrink-0
                      ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}
                    `}>
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div className="text-sm">{message.content}</div>
                  {message.role === 'user' && (
                    <div className={`
                      mt-0.5 flex-shrink-0
                      ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                    `}>
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className={`
                max-w-[80%] rounded-2xl px-4 py-3
                ${theme === 'dark' 
                  ? 'bg-white/6 text-white rounded-bl-none' 
                  : 'bg-neutral-100 text-gray-950 rounded-bl-none'}
              `}>
                <div className="flex items-center gap-2">
                  <div className={`
                    w-2 h-2 rounded-full animate-pulse
                    ${theme === 'dark' ? 'bg-white/60' : 'bg-gray-500'}
                  `}></div>
                  <div className={`
                    w-2 h-2 rounded-full animate-pulse
                    ${theme === 'dark' ? 'bg-white/60' : 'bg-gray-500'}
                  `} style={{ animationDelay: '0.2s' }}></div>
                  <div className={`
                    w-2 h-2 rounded-full animate-pulse
                    ${theme === 'dark' ? 'bg-white/60' : 'bg-gray-500'}
                  `} style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className={`
          p-4 border-t
          ${theme === 'dark' ? 'border-white/12 bg-white/6' : 'border-neutral-200 bg-neutral-100/80'}
        `}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="relative flex gap-2"
          >
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about space..."
              className={`
                flex-1 rounded-xl px-4 py-3 text-sm
                ${theme === 'dark'
                  ? 'bg-black/60 text-white placeholder:text-white/60 border border-white/12' 
                  : 'bg-white text-gray-950 placeholder:text-gray-600 border border-neutral-200'}
                focus:outline-none focus:ring-1 focus:ring-offset-0
              `}
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="sm" 
              disabled={isLoading || !inputValue.trim()}
              className={`
                h-11 px-4
                ${theme === 'dark' 
                  ? 'bg-white text-black hover:bg-white/90' 
                  : 'bg-black text-white hover:bg-black/90'}
              `}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SpaceChatbotThemed;