import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Leaf } from 'lucide-react';
import { ChatMessage, Crop } from '../types';
import { sendChatMessage } from '../services/geminiService';

interface ChatProps {
  selectedCrop: Crop | null;
}

export const Chat: React.FC<ChatProps> = ({ selectedCrop }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Olá! Sou seu assistente agrônomo virtual. Posso tirar dúvidas sobre plantio, adubação, pragas e defensivos. Como posso ajudar sua lavoura hoje?',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Construct history for Gemini
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const responseText = await sendChatMessage(
        history, 
        userMsg.text, 
        selectedCrop?.name
      );

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[400px] bg-white rounded-2xl shadow-lg m-2 overflow-hidden border border-emerald-100">
      <div className="bg-emerald-600 p-4 text-white flex items-center gap-2">
        <Bot className="w-6 h-6" />
        <div>
          <h2 className="font-bold">Agrônomo Virtual</h2>
          {selectedCrop && <p className="text-xs text-emerald-100 opacity-90">Contexto: {selectedCrop.name}</p>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 opacity-70 text-xs">
                 {msg.role === 'user' ? <User size={12}/> : <Leaf size={12}/>}
                 <span>{msg.role === 'user' ? 'Você' : 'IA'}</span>
              </div>
              <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 rounded-full px-4 py-2 flex gap-1 items-center">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white border-t border-gray-200 flex gap-2 items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua dúvida aqui..."
          className="flex-1 bg-gray-100 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all resize-none max-h-32 text-sm"
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
