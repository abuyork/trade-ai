import React, { useState, useRef, useEffect } from 'react';
import OpenAI from "openai";
import { FaPaperPlane, FaRobot } from 'react-icons/fa';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // This is required for client-side usage
});

interface ChatGPTProps {
  messages: { role: string; content: string }[];
  onSendMessage: (message: string, role: 'user' | 'assistant') => void;
  tradingData: any; // Add this prop
}

export const ChatGPT: React.FC<ChatGPTProps> = ({ messages, onSendMessage, tradingData }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      setIsLoading(true);
      onSendMessage(input, 'user');
      setInput('');
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            ...messages,
            { role: 'system', content: `Current trading data: ${JSON.stringify(tradingData)}` },
            { role: 'user', content: input }
          ] as OpenAI.Chat.ChatCompletionMessageParam[],
        });

        const assistantMessage = completion.choices[0].message.content;
        if (assistantMessage) {
          onSendMessage(assistantMessage, 'assistant');
        } else {
          console.error('Unexpected API response structure:', completion);
          onSendMessage('Error: Unexpected API response structure. Please check the console for more details.', 'assistant');
        }
      } catch (error) {
        console.error('Error calling OpenAI API:', error);
        onSendMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check the console for more details.`, 'assistant');
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-center p-4 bg-gray-800 text-white">
        <FaRobot className="text-2xl mr-2" />
        <h1 className="text-xl font-bold">ChatGPT</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <span
              className={`inline-block p-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.content}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            <FaPaperPlane size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};
