import type { Metadata } from "next";
import ChatbotBuilder from "./ChatbotBuilder";

export const metadata: Metadata = {
  title: "Create Chatbot — Voice AI System",
  description: "Build your custom AI chatbot with voice capabilities in 5 easy steps",
};

export default function CreateChatbotPage() {
  return <ChatbotBuilder />;
}
