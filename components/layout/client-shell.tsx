"use client";

import dynamic from "next/dynamic";

const ChatbotWidget = dynamic(
  () =>
    import("@/components/chat/chatbot-widget").then((mod) => mod.ChatbotWidget),
  { ssr: false },
);
const CookieConsent = dynamic(
  () =>
    import("@/components/layout/cookie-consent").then(
      (mod) => mod.CookieConsent,
    ),
  { ssr: false },
);

export function ClientShell() {
  return (
    <>
      <ChatbotWidget />
      <CookieConsent />
    </>
  );
}
