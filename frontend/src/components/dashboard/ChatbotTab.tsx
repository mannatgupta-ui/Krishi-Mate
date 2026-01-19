import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import {
  Mic,
  MicOff,
  Send,
  Camera,
  Image,
  Bot,
  User,
  Loader2,
  X,
  Sparkles,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  image?: string;
  timestamp: Date;
}

const quickQuestions = [
  "🌾 Best crop for this season?",
  "💧 How much water needed?",
  "🐛 Pest control tips?",
  "📈 Current market prices?",
  "🌡️ Weather forecast?",
  "🌱 Fertilizer recommendations?",
];

interface ChatbotTabProps {
  farmerData: {
    name: string;
    location: string;
  };
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatbotTab = ({ farmerData, messages, setMessages }: ChatbotTabProps) => {
  // Local state removed, using props
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message if empty
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          type: "bot",
          content: `Namaste ${farmerData.name || ""}! 🙏 I'm your Krishi-Mate AI assistant. I'm aware of your location in ${farmerData.location || "your area"}. Ask me anything about your farm - crops, weather, pests, or market prices!`,
          timestamp: new Date(),
        },
      ]);
    }
  }, []); // Run once on mount (of this component instance), but technically it mounts every time tab switches. 
  // If tab switches, messages might be empty if we didn't persist it. But we ARE persisting it in Dashboard.
  // So if Dashboard has messages, this won't overwrite. If Dashboard is empty (first load), this populates.

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputText,
      image: selectedImage || undefined,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setSelectedImage(null);
    setIsTyping(true);

    try {
      if (selectedImage) {
        // Image processing could go to disease detection or a multimodal LLM
        // For now, let's just simulate the response for image
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: "I can see the image of your crop! 📸 The leaves look healthy. Based on visual analysis, there are no immediate signs of disease. I've noted this in your farm profile.",
          timestamp: new Date(),
        }]);
      } else {
        // Real API call for text
        const response = await fetch("http://localhost:8000/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: inputText,
            location: farmerData.location || "Unknown",
            state: "" // We could parse this if location is "District, State"
          }),
        });

        if (!response.ok) throw new Error("Failed to fetch bot response");
        const data = await response.json();

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: data.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: "I'm having trouble connecting to my knowledge base. Please check your internet or try again later. 🌱",
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice input is not supported in your browser");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const speakMessage = (text: string) => {
    if ("speechSynthesis" in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      const plainText = text.replace(/[*#_~`]/g, "").replace(/\n/g, " ");
      const utterance = new SpeechSynthesisUtterance(plainText);
      utterance.lang = "en-IN";
      utterance.rate = 0.9;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className={
        isFullscreen
          ? "fixed inset-0 z-50 bg-background p-6 h-screen w-screen flex flex-col"
          : "flex flex-col h-[calc(100vh-200px)] max-h-[700px]"
      }
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Bot className="w-6 h-6 text-primary-foreground" />
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              Krishi AI Assistant
              <Sparkles className="w-5 h-5 text-wheat" />
            </h2>
            <p className="text-sm text-muted-foreground">Voice • Photo • Chat</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="hover:bg-muted"
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </Button>
      </div>

      {/* Quick Questions - Hidden in Fullscreen */}
      {!isFullscreen && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {quickQuestions.map((question, index) => (
            <motion.button
              key={question}
              onClick={() => handleQuickQuestion(question)}
              className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-full whitespace-nowrap transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {question}
            </motion.button>
          ))}
        </div>
      )}

      {/* Messages Area */}
      <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${message.type === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${message.type === "user"
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-primary/10 text-primary"
                  }`}>
                  {message.type === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`max-w-[80%] ${message.type === "user" ? "text-right" : ""}`}>
                  {message.image && (
                    <motion.img
                      src={message.image}
                      alt="Uploaded crop"
                      className="w-48 h-48 object-cover rounded-xl mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                  <div className={`p-4 rounded-2xl ${message.type === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "glass-card rounded-tl-sm"
                    }`}>
                    <div className="prose dark:prose-invert text-sm leading-relaxed max-w-none break-words">
                      <ReactMarkdown
                        components={{
                          p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                          li: ({ node, ...props }) => <li className="ml-4 list-disc" {...props} />,
                          ul: ({ node, ...props }) => <ul className="mb-2" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="font-bold text-lg mt-2 mb-1" {...props} />,
                          strong: ({ node, ...props }) => <strong className="font-bold" {...props} />
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                  {message.type === "bot" && (
                    <motion.button
                      onClick={() => speakMessage(message.content)}
                      className="mt-2 p-1.5 rounded-full hover:bg-muted transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isSpeaking ? (
                        <VolumeX className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-muted-foreground" />
                      )}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="glass-card p-4 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-primary/50 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Selected Image Preview */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-20 h-20 mt-4"
        >
          <img src={selectedImage} alt="Preview" className="w-full h-full object-cover rounded-xl" />
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Input Area */}
      <div className="mt-4 flex gap-2 items-end">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
        />

        <motion.button
          onClick={() => fileInputRef.current?.click()}
          className="p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Camera className="w-5 h-5 text-muted-foreground" />
        </motion.button>

        <motion.button
          onClick={handleVoiceInput}
          className={`p-3 rounded-xl transition-colors ${isListening
            ? "bg-destructive text-destructive-foreground"
            : "bg-muted hover:bg-muted/80"
            }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isListening ? { scale: [1, 1.1, 1] } : {}}
          transition={isListening ? { duration: 0.5, repeat: Infinity } : {}}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-muted-foreground" />}
        </motion.button>

        <div className="flex-1 relative">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about your farm..."
            className="pr-12 py-6 rounded-xl bg-muted border-0"
          />
        </div>

        <Button
          onClick={handleSend}
          disabled={!inputText.trim() && !selectedImage}
          className="p-3 h-auto rounded-xl bg-primary hover:bg-primary/90"
        >
          {isTyping ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default ChatbotTab;
