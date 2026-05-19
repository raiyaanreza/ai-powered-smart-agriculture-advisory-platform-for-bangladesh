"use client";
import { useState, useEffect } from "react";
import { AdvisorySidebar } from "./AdvisorySidebar";
import { ChatInterface } from "./AdvisoryContent";
import { CropAnalysisView } from "./CropAnalysisView";
import { HistoryModal } from "./HistoryModal";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  image?: string;
  diagnosis?: {
    title: string;
    description: string;
    steps: { label: string; action: string; status?: string }[];
  };
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  date: string;
}

const DEFAULT_CONVERSATIONS: ChatSession[] = [
  {
    id: "default_1",
    title: "টমেটোর পাতা কোঁকড়ানো রোগ দমন",
    date: "আজ সকাল ১০:১৫",
    messages: [
      {
        id: "m1",
        role: "user",
        text: "টমেটো গাছের পাতা কুঁকড়ে যাচ্ছে, কী সার বা ঔষধ দেব?"
      },
      {
        id: "m2",
        role: "bot",
        text: "টমেটো গাছের পাতা কোঁকড়ানো (Leaf Curl) সাধারণত সাদা মাছি (Whitefly) বাহিত ভাইরাসের কারণে হয়ে থাকে।\n\n### প্রতিকার:\n১. আক্রান্ত গাছ তুলে নষ্ট করে ফেলুন।\n২. সাদা মাছি দমনের জন্য ইমিডাক্লোপ্রিড গ্রুপের কীটনাশক (যেমন: টিডো বা এডমায়ার) প্রতি লিটার পানিতে ০.৫ মিলি মিশিয়ে স্প্রে করুন।\n৩. শেষ উপায় হিসেবে সতর্কতার সাথে ও সঠিক ডোজে বালাইনাশক ব্যবহার করুন এবং আমাদের উপজেলা কৃষি কর্মকর্তার (UAO) পরামর্শ নিন।"
      }
    ]
  },
  {
    id: "default_2",
    title: "সরিষা চাষে সারের সঠিক অনুপাত",
    date: "গতকাল বিকাল ৪:৩০",
    messages: [
      {
        id: "m3",
        role: "user",
        text: "সরিষার ফলন ভালো করার জন্য কী কী সার প্রয়োগ করতে হবে?"
      },
      {
        id: "m4",
        role: "bot",
        text: "সরিষা একটি তেলজাতীয় ফসল। এতে ইউরিয়া, টিএসপি, এমওপি এবং জিপসাম সারের সুষম প্রয়োগ অত্যন্ত গুরুত্বপূর্ণ।\n\n### সার প্রয়োগের মাত্রা (শতক প্রতি):\n- ইউরিয়া: ১.২ কেজি (অর্ধেক শেষ চাষে, বাকি অর্ধেক ফুল আসার সময়ে চাপান হিসেবে)\n- টিএসপি: ৮০০ গ্রাম\n- এমওপি: ৪০০ গ্রাম\n- জিপসাম: ৬০০ গ্রাম\n- বোরন সার: ৪০ গ্রাম (ভালো দানা গঠনে সহায়তা করে)"
      }
    ]
  }
];

/** Offline chat is the default until online Gemini advisory is restored. */
const USE_OFFLINE_CHAT =
  process.env.NEXT_PUBLIC_USE_OFFLINE_CHAT !== "false";

const OFFLINE_CHAT_ERROR =
  "দুঃখিত, অফলাইন পরামর্শ সার্ভারের সাথে সংযোগ করা যাচ্ছে না। অনুগ্রহ করে নিশ্চিত করুন যে advisory-service (পোর্ট 8001) চালু আছে।";

export function AdvisoryDashboard() {
  const [activeTab, setActiveTab] = useState<string>("Chat History");
  const [conversations, setConversations] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const advisoryApiBase =
    process.env.NEXT_PUBLIC_ADVISORY_API_URL || "http://127.0.0.1:8001";

  // Load conversations from local storage
  useEffect(() => {
    const saved = localStorage.getItem("agri_conversations");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ChatSession[];
        setConversations(parsed);
        if (parsed.length > 0) {
          setCurrentSessionId(parsed[0].id);
        }
      } catch (e) {
        console.error(e);
        setConversations(DEFAULT_CONVERSATIONS);
        setCurrentSessionId(DEFAULT_CONVERSATIONS[0].id);
      }
    } else {
      localStorage.setItem("agri_conversations", JSON.stringify(DEFAULT_CONVERSATIONS));
      setConversations(DEFAULT_CONVERSATIONS);
      setCurrentSessionId(DEFAULT_CONVERSATIONS[0].id);
    }
  }, []);

  // Update localStorage when conversations change
  const saveConversations = (updated: ChatSession[]) => {
    setConversations(updated);
    localStorage.setItem("agri_conversations", JSON.stringify(updated));
  };

  const handleSelectChat = (id: string) => {
    setCurrentSessionId(id);
    setActiveTab("Chat History");
    setIsHistoryModalOpen(false);
  };

  const handleNewChat = () => {
    const newId = `chat_${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: "নতুন আলোচনা...",
      messages: [],
      date: "আজ " + new Date().toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" })
    };
    const updated = [newSession, ...conversations];
    saveConversations(updated);
    setCurrentSessionId(newId);
    setActiveTab("Chat History");
  };

  const handleSendMessage = async (text: string, image: string | null) => {
    if (!currentSessionId) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text,
      image: image || undefined
    };

    const targetSession = conversations.find(c => c.id === currentSessionId) || {
      id: currentSessionId,
      title: text.slice(0, 15) + (text.length > 15 ? "..." : ""),
      messages: [],
      date: "আজ " + new Date().toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" })
    };

    const updatedMessages = [...targetSession.messages, userMsg];
    
    // Auto generate title if it is default name
    let updatedTitle = targetSession.title;
    if (targetSession.title === "নতুন আলোচনা..." && text.trim()) {
      updatedTitle = text.slice(0, 20) + (text.length > 20 ? "..." : "");
    }

    const updatedSession: ChatSession = {
      ...targetSession,
      title: updatedTitle,
      messages: updatedMessages
    };

    const updatedConversations = conversations.map(c => c.id === currentSessionId ? updatedSession : c);
    saveConversations(updatedConversations);
    setChatLoading(true);

    const persistBotReply = (botMsg: Message) => {
      const finalSession = {
        ...updatedSession,
        messages: [...updatedMessages, botMsg],
      };
      saveConversations(
        updatedConversations.map((c) =>
          c.id === currentSessionId ? finalSession : c
        )
      );
    };

    try {
      let data: { text: string; diagnosis?: Message["diagnosis"] };

      if (USE_OFFLINE_CHAT) {
        const response = await fetch(
          `${advisoryApiBase}/advisory/chat/offline`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: text,
              history: [],
              image_data: null,
            }),
          }
        );

        if (!response.ok) throw new Error("Offline chat request failed");

        data = await response.json();
      } else {
        const response = await fetch(`${advisoryApiBase}/advisory/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            image_data: image ? image.split(",")[1] : null,
            history: updatedMessages.slice(0, -1).map((m) => ({
              role: m.role === "bot" ? "assistant" : "user",
              content: m.text,
            })),
          }),
        });

        if (!response.ok) throw new Error("Online chat request failed");

        data = await response.json();
      }

      persistBotReply({
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: data.text,
        diagnosis: data.diagnosis,
      });
    } catch (err) {
      console.error(err);
      persistBotReply({
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: USE_OFFLINE_CHAT
          ? OFFLINE_CHAT_ERROR
          : "দুঃখিত, আমাদের বিশেষজ্ঞ সার্ভারের সাথে সংযোগ করা যাচ্ছে না। অনুগ্রহ করে নিশ্চিত করুন যে আপনার ইন্টারনেট সংযোগ ঠিক আছে এবং ব্যাকএন্ড সার্ভিসটি চালু আছে।",
      });
    } finally {
      setChatLoading(false);
    }
  };

  const activeSession = conversations.find(c => c.id === currentSessionId) || {
    id: "",
    title: "",
    messages: [],
    date: ""
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <AdvisorySidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        conversations={conversations}
        currentChatId={currentSessionId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden h-full">
        <main className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
          {activeTab === "Crop Analysis" ? (
            <CropAnalysisView />
          ) : (
            <ChatInterface
              messages={activeSession.messages}
              isLoading={chatLoading}
              isOfflineMode={USE_OFFLINE_CHAT}
              onSendMessage={handleSendMessage}
            />
          )}
        </main>
      </div>

      {/* History Drawer Modal */}
      <HistoryModal 
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        conversations={conversations}
        onSelectChat={handleSelectChat}
        onDeleteChat={(id) => {
          const updated = conversations.filter(c => c.id !== id);
          saveConversations(updated);
          if (currentSessionId === id && updated.length > 0) {
            setCurrentSessionId(updated[0].id);
          }
        }}
      />
    </div>
  );
}
