import React, { useState, useEffect, useRef } from 'react';
import { 
  Layers, Box, MonitorPlay, Code, Sparkles, Send, Copy, Wand2
} from 'lucide-react';
import { TEMPLATE_LIBRARY } from './constants';
import { GeminiService } from './services/geminiService';
import { A2UIMediator } from './components/WidgetRenderer';
import { Message, TemplateItem } from './types';

const App = () => {
  const [messages, setMessages] = useState<Message[]>([{ role: 'system', text: 'Bienvenido a NGX Studio. Conectado a Gemini 2.5 Flash. Pídeme un widget o usa las plantillas.' }]);
  const [currentJSON, setCurrentJSON] = useState<string>(JSON.stringify(TEMPLATE_LIBRARY["Entrenamiento"][0], null, 2));
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => { 
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    } 
  }, [messages]);

  // Handle Template Selection
  const loadTemplate = (item: TemplateItem) => {
    const json = JSON.stringify({ type: item.type, props: item.props }, null, 2);
    setCurrentJSON(json);
    setMessages(prev => [...prev, { role: 'system', text: `Plantilla cargada: ${item.name}` }]);
  };

  // Handle AI Generation (Chat)
  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    const currentPrompt = input;
    setInput('');
    setIsGenerating(true);

    const result = await GeminiService.callAPI(currentPrompt);
    
    setIsGenerating(false);
    
    if (result) {
      setCurrentJSON(JSON.stringify(result, null, 2));
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: "He generado el widget basado en tu descripción.",
        thought: result.thought 
      }]);
    }
  };

  // Handle AI Code Refinement
  const handleRefine = async () => {
    setIsGenerating(true);
    const prompt = `Toma este JSON de widget y mejóralo/hazlo más intenso/variado: ${currentJSON}`;
    const result = await GeminiService.callAPI(prompt);
    setIsGenerating(false);
    if (result) {
      setCurrentJSON(JSON.stringify(result, null, 2));
      setMessages(prev => [...prev, { role: 'assistant', text: "He refinado el JSON actual.", thought: result.thought }]);
    }
  };

  // Parse JSON safely
  let parsedWidget = null;
  try { parsedWidget = JSON.parse(currentJSON); } catch (e) {}

  return (
    <div className="flex h-screen bg-[#000] text-white font-sans overflow-hidden">
      
      {/* SIDEBAR (Spaces & Library) */}
      <div className="w-64 border-r border-white/10 flex flex-col bg-[#050505]">
        <div className="p-5 border-b border-white/10 flex items-center gap-2 text-[#6D00FF]">
          <Layers size={20} />
          <h1 className="font-bold tracking-widest text-sm">NGX STUDIO</h1>
        </div>
        
        {/* Spaces Nav */}
        <div className="p-3 border-b border-white/10">
          <p className="text-[10px] text-white/40 uppercase mb-2 font-bold pl-2">Espacios</p>
          {['Training Lab', 'Nutrition Lab', 'Recovery', 'UI Library'].map(space => (
            <button key={space} className="w-full text-left px-3 py-2 rounded-lg text-xs text-white/60 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2">
              <Box size={12} /> {space}
            </button>
          ))}
        </div>

        {/* Templates List */}
        <div className="flex-1 overflow-y-auto p-3 no-scrollbar">
          <p className="text-[10px] text-white/40 uppercase mb-2 font-bold pl-2">Plantillas</p>
          {Object.entries(TEMPLATE_LIBRARY).map(([category, items]) => (
            <div key={category} className="mb-4">
              <p className="text-[9px] text-[#6D00FF] font-bold uppercase mb-1 pl-2">{category}</p>
              {items.map((item, i) => (
                <button key={i} onClick={() => loadTemplate(item)} className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-white/70 hover:bg-white/5 hover:text-white transition-colors truncate">
                  {item.name}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT (Split View) */}
      <div className="flex-1 flex flex-col">
        
        {/* Header */}
        <div className="h-14 border-b border-white/10 flex justify-between items-center px-6 bg-[#050505]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse"></span>
            <span className="text-xs text-white/60">Gemini 2.5 Flash (API Active)</span>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-white/10 rounded-lg text-white/60"><MonitorPlay size={16} /></button>
            <button className="p-2 hover:bg-white/10 rounded-lg text-white/60"><Code size={16} /></button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT: CHAT & EDITOR */}
          <div className="w-1/2 flex flex-col border-r border-white/10">
            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#050505] no-scrollbar" ref={scrollRef}>
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm max-w-[90%] ${m.role === 'user' ? 'bg-[#6D00FF]/20 border border-[#6D00FF]/30 text-white' : 'bg-white/5 text-white/80'}`}>
                    {m.text}
                  </div>
                  {m.thought && (
                    <div className="flex items-center gap-2 mt-1 ml-2 text-[10px] text-white/30">
                      <Sparkles size={10} /> {m.thought}
                    </div>
                  )}
                </div>
              ))}
              {isGenerating && <div className="text-xs text-[#6D00FF] animate-pulse ml-4">Gemini está diseñando...</div>}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-[#050505]">
              <form onSubmit={handleChat} className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe el widget: 'Crea una rutina de pecho intensa'..." 
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl py-4 pl-5 pr-14 text-sm text-white focus:border-[#6D00FF] outline-none"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[#6D00FF] rounded-lg text-white hover:opacity-90">
                  <Send size={16} />
                </button>
              </form>
            </div>

            {/* JSON Editor (Bottom Half) */}
            <div className="h-1/3 border-t border-white/10 bg-[#080808] flex flex-col">
              <div className="px-4 py-2 border-b border-white/5 flex justify-between items-center">
                <span className="text-[10px] font-bold text-white/40 uppercase">Live JSON Editor</span>
                <div className="flex gap-2">
                  <button onClick={handleRefine} className="text-[10px] text-[#A855F7] hover:text-white flex items-center gap-1 border border-[#A855F7]/30 px-2 py-1 rounded hover:bg-[#A855F7]/10"><Wand2 size={10} /> Mejorar con IA</button>
                  <button onClick={() => navigator.clipboard.writeText(currentJSON)} className="text-[10px] text-[#6D00FF] hover:text-white flex items-center gap-1"><Copy size={10} /> Copiar</button>
                </div>
              </div>
              <textarea 
                value={currentJSON}
                onChange={(e) => setCurrentJSON(e.target.value)}
                className="flex-1 w-full bg-transparent text-[#00FF88] font-mono text-xs p-4 outline-none resize-none no-scrollbar"
                spellCheck="false"
              />
            </div>
          </div>

          {/* RIGHT: LIVE PREVIEW */}
          <div className="w-1/2 bg-[#000] relative flex items-center justify-center p-8">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
            
            {/* Phone Frame */}
            <div className="w-[375px] h-[700px] bg-[#0A0A0A] rounded-[3rem] border-[8px] border-[#1a1a1a] shadow-2xl overflow-hidden relative flex flex-col">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-28 bg-[#000] rounded-b-2xl z-20" />
              <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pt-12">
                {parsedWidget ? (
                  <A2UIMediator payload={parsedWidget} onAction={(id, val) => console.log(`Action: ${id}`, val)} />
                ) : (
                  <div className="text-center text-white/20 text-xs mt-20">JSON Inválido o Vacío</div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;