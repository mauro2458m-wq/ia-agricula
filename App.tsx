import React, { useState } from 'react';
import { AppView, Crop } from './types';
import { CropSelector } from './components/CropSelector';
import { Diagnosis } from './components/Diagnosis';
import { Chat } from './components/Chat';
import { Sprout, MessageSquareText, Home, Leaf } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);

  const handleCropSelect = (crop: Crop) => {
    setSelectedCrop(crop);
    // If we are in home, auto move to diagnosis for better flow
    if (view === AppView.HOME) {
      setView(AppView.DIAGNOSIS);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f9f5] pb-24 font-sans text-gray-800">
      {/* Header */}
      <header className="bg-emerald-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white p-1.5 rounded-lg">
              <Leaf className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Agricultura IA</h1>
              <p className="text-emerald-100 text-xs">Seu Agrônomo Digital</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto pt-6 px-2">
        {/* Persistent Crop Selector (Small bar if not home) */}
        <div className="mb-6">
          <CropSelector selectedCrop={selectedCrop} onSelect={handleCropSelect} />
        </div>

        {view === AppView.HOME && (
          <div className="text-center py-10 px-4">
             <div className="bg-white rounded-3xl p-8 shadow-sm border border-emerald-100 mb-8">
               <Sprout className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
               <h2 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo, Produtor!</h2>
               <p className="text-gray-600 mb-6">
                 Selecione uma cultura acima para começar. Posso identificar pragas por fotos ou tirar dúvidas via chat.
               </p>
               <div className="flex gap-4 justify-center">
                 <button 
                   onClick={() => setView(AppView.DIAGNOSIS)}
                   className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-emerald-700 transition"
                 >
                   Diagnóstico por Foto
                 </button>
                 <button 
                   onClick={() => setView(AppView.CHAT)}
                   className="bg-white text-emerald-700 border border-emerald-200 px-6 py-3 rounded-xl font-semibold shadow-sm hover:bg-emerald-50 transition"
                 >
                   Chat Agrônomo
                 </button>
               </div>
             </div>
          </div>
        )}

        {view === AppView.DIAGNOSIS && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <Diagnosis selectedCrop={selectedCrop} />
          </div>
        )}

        {view === AppView.CHAT && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <Chat selectedCrop={selectedCrop} />
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <div className="flex justify-around items-center max-w-3xl mx-auto">
          <button
            onClick={() => setView(AppView.HOME)}
            className={`flex flex-col items-center py-3 px-6 transition-colors ${
              view === AppView.HOME ? 'text-emerald-600' : 'text-gray-400 hover:text-emerald-500'
            }`}
          >
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Início</span>
          </button>
          
          <button
            onClick={() => setView(AppView.DIAGNOSIS)}
            className={`flex flex-col items-center py-3 px-6 transition-colors ${
              view === AppView.DIAGNOSIS ? 'text-emerald-600' : 'text-gray-400 hover:text-emerald-500'
            }`}
          >
            <div className={`p-1 rounded-full ${view === AppView.DIAGNOSIS ? 'bg-emerald-100' : ''}`}>
               <Sprout className="w-6 h-6 mb-1" />
            </div>
            <span className="text-xs font-medium">Diagnóstico</span>
          </button>

          <button
            onClick={() => setView(AppView.CHAT)}
            className={`flex flex-col items-center py-3 px-6 transition-colors ${
              view === AppView.CHAT ? 'text-emerald-600' : 'text-gray-400 hover:text-emerald-500'
            }`}
          >
            <MessageSquareText className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Chat</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
