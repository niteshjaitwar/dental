"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircleMore, Mic, MicOff, Send, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { requestChatbotReplyAction } from "@/app/actions/forms";
import { useToast } from "@/components/providers/toast-provider";
import { clinicConfig } from "@/lib/config";

type Message = {
  role: "bot" | "user";
  text: string;
};

type BookingDraft = {
  doctorId?: string;
  date?: string;
};

export function ChatbotWidget() {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [bookingDraft, setBookingDraft] = useState<BookingDraft>({});
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: clinicConfig.chatbot.welcome },
  ]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const links = useMemo(
    () => ({
      book: "/book",
      services: "/services",
      contact: "/contact",
    }),
    [],
  );

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role !== "bot") {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(lastMessage.text);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [messages]);

  const pushMessage = (message: Message) => {
    setMessages((current) => [...current, message]);
  };

  const handleServerReply = (message: string) => {
    const formData = new FormData();
    formData.set("message", message);

    if (bookingDraft.doctorId) {
      formData.set("doctorId", bookingDraft.doctorId);
    }

    if (bookingDraft.date) {
      formData.set("date", bookingDraft.date);
    }

    startTransition(async () => {
      const response = await requestChatbotReplyAction(
        {
          status: "idle",
          message: "",
          fieldErrors: {},
        },
        formData,
      );

      if (response.status === "error" && response.message) {
        showToast({
          title: "Assistant error",
          description: response.message,
          tone: "error",
          duration: 5000,
        });
      }

      if (response.payload?.doctorId || response.payload?.date) {
        setBookingDraft({
          doctorId: response.payload.doctorId,
          date: response.payload.date,
        });
      } else {
        setBookingDraft({});
      }

      pushMessage({ role: "bot", text: response.message });
    });
  };

  const handleUserMessage = (message: string) => {
    const cleanMessage = message.trim();

    if (!cleanMessage) {
      return;
    }

    pushMessage({ role: "user", text: cleanMessage });
    setInput("");
    handleServerReply(cleanMessage);
  };

  const startVoiceInput = () => {
    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      pushMessage({ role: "user", text: "Use voice assistant" });
      pushMessage({
        role: "bot",
        text: clinicConfig.chatbot.unsupportedVoiceMessage,
      });
      return;
    }

    recognitionRef.current?.stop();

    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognitionRef.current = recognition;
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      handleUserMessage(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
      pushMessage({ role: "user", text: "Voice input" });
      pushMessage({
        role: "bot",
        text: clinicConfig.chatbot.voiceRetryMessage,
      });
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <>
      <div className="fixed right-5 bottom-5 z-50">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl"
          style={{
            background:
              "linear-gradient(135deg, var(--primary), var(--secondary))",
          }}
          aria-label={clinicConfig.chatbot.openLabel}
        >
          {open ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircleMore className="h-6 w-6" />
          )}
        </button>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            className="fixed right-5 bottom-24 z-50 w-[calc(100vw-2.5rem)] max-w-sm rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4 shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-[color:var(--border)] pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--primary)]/10">
                <Bot className="h-5 w-5 text-[color:var(--primary)]" />
              </div>
              <div>
                <p className="font-semibold">{clinicConfig.brand.clinicName}</p>
                <p className="text-xs text-[color:var(--muted)]">
                  {clinicConfig.chatbot.assistantLabel}
                </p>
              </div>
            </div>
            <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "bot"
                      ? "bg-[color:var(--background)]"
                      : "ml-auto bg-[color:var(--primary)] text-white"
                  }`}
                >
                  {message.text}
                </div>
              ))}
              {isPending ? (
                <div className="max-w-[85%] rounded-2xl bg-[color:var(--background)] px-4 py-3 text-sm leading-6">
                  {clinicConfig.chatbot.thinkingLabel}
                </div>
              ) : null}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {clinicConfig.chatbot.quickReplies.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  className="rounded-full border border-[color:var(--border)] px-3 py-2 text-xs font-medium"
                  onClick={() => handleUserMessage(reply)}
                >
                  {reply}
                </button>
              ))}
            </div>
            <form
              className="mt-4 flex items-center gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                handleUserMessage(input);
              }}
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={clinicConfig.chatbot.placeholder}
                className="h-11 flex-1 rounded-full border border-[color:var(--border)] bg-transparent px-4 text-sm outline-none"
              />
              <button
                type="button"
                onClick={startVoiceInput}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--border)]"
                aria-label={clinicConfig.chatbot.voiceInputLabel}
              >
                {isListening ? (
                  <MicOff className="h-4 w-4 text-rose-500" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </button>
              <button
                type="submit"
                className="flex h-11 w-11 items-center justify-center rounded-full text-white disabled:opacity-60"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary), var(--secondary))",
                }}
                aria-label={clinicConfig.chatbot.sendLabel}
                disabled={isPending}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            <div className="mt-4 flex gap-2 text-xs text-[color:var(--muted)]">
              <Link
                href={links.book}
                className="inline-flex items-center gap-1"
              >
                <Send className="h-3.5 w-3.5" />{" "}
                {clinicConfig.chatbot.shortcuts.book}
              </Link>
              <Link href={links.services}>
                {clinicConfig.chatbot.shortcuts.services}
              </Link>
              <Link href={links.contact}>
                {clinicConfig.chatbot.shortcuts.contact}
              </Link>
            </div>
            <p className="mt-2 text-[11px] leading-5 text-[color:var(--muted)]">
              {clinicConfig.chatbot.disclaimer}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
