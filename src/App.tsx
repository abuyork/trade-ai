import { useState } from 'react';
import TradingViewWidget from './components/TradingViewWidget';
import { ChatGPT } from './components/ChatGPT';

function App() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [tradingData, setTradingData] = useState<any>(null);

  const handleSendMessage = (message: string, role: 'user' | 'assistant') => {
    setMessages(prevMessages => [...prevMessages, { role, content: message }]);
  };

  const handleTradingDataUpdate = (data: any) => {
    setTradingData(data);
  };

  return (
    <div className="flex h-screen">
      <div className="w-2/3 h-full">
        <TradingViewWidget onDataUpdate={handleTradingDataUpdate} />
      </div>
      <div className="w-1/3 h-full">
        <ChatGPT 
          messages={messages} 
          onSendMessage={handleSendMessage} 
          tradingData={tradingData}
        />
      </div>
    </div>
  );
}

export default App;
