import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Layers, Box, MonitorPlay, Code, Sparkles, Send, Copy, Wand2,
  Download, FileJson, FileCode, Globe, Save, Trash2, Clock, Zap, Brain,
  GripVertical, Target, ChevronDown, ChevronRight, Scale, Dumbbell, Trophy, Moon, Medal,
  FlaskConical, Activity, Edit3, GitMerge, Loader, Users
} from 'lucide-react';
import { TEMPLATE_LIBRARY } from './constants';
import { GeminiService, GeminiModel } from './services/geminiService';
import { ExportService } from './services/exportService';
import { StorageService, SavedWidget } from './services/storageService';
import { A2UIMediator } from './components/WidgetRenderer';
import { DeviceFrame, DeviceSelector, DeviceType } from './components/DeviceFrame';
import { HistoryControls } from './components/HistoryControls';
import { ValidationErrors, ValidationIndicator } from './components/ValidationErrors';
import { ThemePanel } from './components/ThemePanel';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { useJSONHistory, useKeyboardShortcuts } from './hooks/useJSONHistory';
import { parseAndValidate } from './schemas/layoutSchemas';
import { GOAL_TEMPLATES, GoalCategory, GoalTemplate, templateToJSON } from './utils/templateBuilder';
import { Message, TemplateItem, WidgetPayload } from './types';
import { A2UI_LAB_DEMOS, A2UILabDemo } from './a2ui-lab/types';

// Main App Content (uses theme context)
const AppContent = () => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([{ role: 'system', text: 'Bienvenido a NGX Studio. Conectado a Gemini 3.0. Pideme un widget o usa las plantillas.' }]);

  // JSON History with Undo/Redo
  const {
    json: currentJSON,
    setJSON: setCurrentJSON,
    setJSONImmediate, // For templates, AI generation - saves to history immediately
    undo,
    redo,
    canUndo,
    canRedo,
    historyLength,
    futureLength
  } = useJSONHistory(JSON.stringify(TEMPLATE_LIBRARY["Entrenamiento"][0], null, 2));

  // Keyboard shortcuts for undo/redo
  useKeyboardShortcuts(undo, redo, canUndo, canRedo);

  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState<GeminiModel>('flash');
  const [savedWidgets, setSavedWidgets] = useState<SavedWidget[]>([]);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [deviceType, setDeviceType] = useState<DeviceType>('mobile');
  const [editMode, setEditMode] = useState(false);
  const [expandedGoals, setExpandedGoals] = useState<Record<string, boolean>>({});
  const [showValidation, setShowValidation] = useState(true);
  const [expandedA2UILab, setExpandedA2UILab] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Real-time validation using Zod schemas (with error handling)
  const validationResult = useMemo(() => {
    if (!currentJSON.trim()) return null;
    try {
      return parseAndValidate(currentJSON);
    } catch (e) {
      // Zod validation error - return null to prevent crash
      console.warn('Validation error:', e);
      return null;
    }
  }, [currentJSON]);

  // Cargar historial al iniciar
  useEffect(() => {
    setSavedWidgets(StorageService.getHistory());
  }, []);

  // Auto-scroll chat
  useEffect(() => { 
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    } 
  }, [messages]);

  // Handle Template Selection
  const loadTemplate = (item: TemplateItem) => {
    const json = JSON.stringify({ type: item.type, props: item.props }, null, 2);
    setJSONImmediate(json); // Save to history immediately for undo support
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

    const result = await GeminiService.callAPI(currentPrompt, undefined, { model: selectedModel });

    setIsGenerating(false);

    if (result) {
      setJSONImmediate(JSON.stringify(result, null, 2)); // Save to history immediately
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `Widget generado con Gemini 3.0 ${selectedModel.toUpperCase()}.`,
        thought: result.thought
      }]);
    }
  };

  // Handle AI Code Refinement
  const handleRefine = async () => {
    setIsGenerating(true);
    const prompt = `Toma este JSON de widget y mejoralo/hazlo mas intenso/variado: ${currentJSON}`;
    const result = await GeminiService.callAPI(prompt, undefined, { model: selectedModel });
    setIsGenerating(false);
    if (result) {
      setJSONImmediate(JSON.stringify(result, null, 2)); // Save to history immediately
      setMessages(prev => [...prev, { role: 'assistant', text: "He refinado el JSON actual.", thought: result.thought }]);
    }
  };

  // Guardar widget actual
  const handleSaveWidget = () => {
    try {
      const payload = JSON.parse(currentJSON) as WidgetPayload;
      const saved = StorageService.saveWidget(payload, `gemini-3-${selectedModel}`);
      setSavedWidgets(StorageService.getHistory());
      setMessages(prev => [...prev, { role: 'system', text: `Widget guardado: ${saved.name}` }]);
    } catch {
      setMessages(prev => [...prev, { role: 'system', text: 'Error: JSON invalido, no se puede guardar.' }]);
    }
  };

  // Cargar widget guardado
  const handleLoadSaved = (saved: SavedWidget) => {
    setJSONImmediate(JSON.stringify(saved.payload, null, 2)); // Save to history immediately
    setMessages(prev => [...prev, { role: 'system', text: `Cargado: ${saved.name}` }]);
  };

  // Eliminar widget guardado
  const handleDeleteSaved = (id: string) => {
    StorageService.deleteWidget(id);
    setSavedWidgets(StorageService.getHistory());
  };

  // Exportar como JSON
  const handleExportJSON = () => {
    try {
      const payload = JSON.parse(currentJSON) as WidgetPayload;
      ExportService.downloadJSON(payload, `gemini-3-${selectedModel}`);
      setShowExportMenu(false);
      setMessages(prev => [...prev, { role: 'system', text: 'JSON exportado correctamente.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'system', text: 'Error: JSON invalido.' }]);
    }
  };

  // Exportar como HTML
  const handleExportHTML = () => {
    try {
      const payload = JSON.parse(currentJSON) as WidgetPayload;
      ExportService.downloadHTML(payload);
      setShowExportMenu(false);
      setMessages(prev => [...prev, { role: 'system', text: 'HTML exportado correctamente.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'system', text: 'Error: JSON invalido.' }]);
    }
  };

  // Copiar componente React
  const handleCopyReact = async () => {
    try {
      const payload = JSON.parse(currentJSON) as WidgetPayload;
      const success = await ExportService.copyReactComponent(payload);
      setShowExportMenu(false);
      setMessages(prev => [...prev, { role: 'system', text: success ? 'Componente React copiado al clipboard.' : 'Error al copiar.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'system', text: 'Error: JSON invalido.' }]);
    }
  };

  // Handle widget reorder from drag and drop
  const handleWidgetReorder = useCallback((newWidgets: WidgetPayload[]) => {
    try {
      const parsed = JSON.parse(currentJSON);
      // Update the widgets array in the layout
      if (parsed.type === 'stack' || parsed.type === 'grid') {
        const updated = { ...parsed, widgets: newWidgets };
        setJSONImmediate(JSON.stringify(updated, null, 2));
        setMessages(prev => [...prev, { role: 'system', text: 'Widgets reordenados.' }]);
      }
    } catch {
      // Ignore JSON parse errors
    }
  }, [currentJSON, setJSONImmediate]);

  // Load goal template
  const loadGoalTemplate = (template: GoalTemplate) => {
    const json = templateToJSON(template);
    setJSONImmediate(json);
    setMessages(prev => [...prev, { role: 'system', text: `Template cargado: ${template.name}` }]);
  };

  // Toggle goal category expansion
  const toggleGoalExpansion = (goalKey: string) => {
    setExpandedGoals(prev => ({ ...prev, [goalKey]: !prev[goalKey] }));
  };

  // Get icon for goal category
  const getGoalIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      scale: <Scale size={12} />,
      dumbbell: <Dumbbell size={12} />,
      trophy: <Trophy size={12} />,
      moon: <Moon size={12} />,
      medal: <Medal size={12} />
    };
    return icons[iconName] || <Target size={12} />;
  };

  // Get icon for A2UI Lab demo
  const getA2UILabIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      Layers: <Layers size={12} />,
      Activity: <Activity size={12} />,
      Edit3: <Edit3 size={12} />,
      GitMerge: <GitMerge size={12} />,
      Loader: <Loader size={12} />,
      Users: <Users size={12} />
    };
    return icons[iconName] || <FlaskConical size={12} />;
  };

  // Load A2UI Lab demo
  const loadA2UILabDemo = (demo: A2UILabDemo) => {
    const json = JSON.stringify({ type: demo.component, props: demo.defaultProps }, null, 2);
    setJSONImmediate(json);
    setMessages(prev => [...prev, { role: 'system', text: `A2UI Lab: ${demo.name} cargado. Capacidad: ${demo.capability}` }]);
  };

  // Parse JSON safely
  let parsedWidget = null;
  try { parsedWidget = JSON.parse(currentJSON); } catch (e) {}

  return (
    <div
      className="flex h-screen text-white font-sans overflow-hidden transition-colors duration-300"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        fontSize: `${theme.fontScale}rem`
      }}
    >

      {/* SIDEBAR (Spaces & Library) */}
      <div
        className="w-64 border-r flex flex-col transition-colors duration-300"
        style={{
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface
        }}
      >
        <div
          className="p-5 border-b flex items-center gap-2"
          style={{
            borderColor: theme.colors.border,
            color: theme.colors.accent
          }}
        >
          <Layers size={20} />
          <h1 className="font-bold tracking-widest text-sm">NGX STUDIO</h1>
        </div>
        
        {/* Theme Panel */}
        <ThemePanel />

        {/* Spaces Nav */}
        <div className="p-3 border-b border-white/10">
          <p className="text-[10px] text-white/40 uppercase mb-2 font-bold pl-2">Espacios</p>
          {['Training Lab', 'Nutrition Lab', 'Recovery', 'UI Library'].map(space => (
            <button key={space} className="w-full text-left px-3 py-2 rounded-lg text-xs text-white/60 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2">
              <Box size={12} /> {space}
            </button>
          ))}
        </div>

        {/* Saved Widgets History */}
        {savedWidgets.length > 0 && (
          <div className="p-3 border-b border-white/10 max-h-48 overflow-y-auto no-scrollbar">
            <p className="text-[10px] text-white/40 uppercase mb-2 font-bold pl-2 flex items-center gap-1">
              <Clock size={10} /> Mis Widgets
            </p>
            {savedWidgets.slice(0, 10).map((saved) => (
              <div key={saved.id} className="flex items-center gap-1 mb-1 group">
                <button
                  onClick={() => handleLoadSaved(saved)}
                  className="flex-1 text-left px-2 py-1.5 rounded-lg text-xs text-white/70 hover:bg-white/5 hover:text-white transition-colors truncate"
                >
                  {saved.name}
                </button>
                <button
                  onClick={() => handleDeleteSaved(saved.id)}
                  className="p-1 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
                >
                  <Trash2 size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Goal Templates Section */}
        <div className="p-3 border-b border-white/10">
          <p className="text-[10px] text-white/40 uppercase mb-2 font-bold pl-2 flex items-center gap-1">
            <Target size={10} /> Por Objetivo
          </p>
          {Object.entries(GOAL_TEMPLATES).map(([goalKey, category]) => (
            <div key={goalKey} className="mb-1">
              <button
                onClick={() => toggleGoalExpansion(goalKey)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs hover:bg-white/5 transition-colors"
                style={{ color: category.color }}
              >
                {expandedGoals[goalKey] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                {getGoalIcon(category.icon)}
                <span className="font-medium">{category.name}</span>
              </button>
              {expandedGoals[goalKey] && (
                <div className="ml-4 mt-1 space-y-0.5">
                  {category.templates.map((template, i) => (
                    <button
                      key={i}
                      onClick={() => loadGoalTemplate(template)}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-[11px] text-white/60 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <span>{template.preview}</span>
                      <span className="truncate">{template.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* A2UI Lab Section */}
        <div className="p-3 border-b border-white/10">
          <button
            onClick={() => setExpandedA2UILab(!expandedA2UILab)}
            className="w-full flex items-center gap-2 text-[10px] text-white/40 uppercase mb-2 font-bold pl-2 hover:text-white/60 transition-colors"
          >
            {expandedA2UILab ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
            <FlaskConical size={10} className="text-[#00FF88]" />
            <span>A2UI Lab</span>
            <span className="ml-auto text-[8px] bg-[#00FF88]/20 text-[#00FF88] px-1.5 py-0.5 rounded-full">NEW</span>
          </button>
          {expandedA2UILab && (
            <div className="space-y-1">
              {A2UI_LAB_DEMOS.map((demo) => (
                <button
                  key={demo.id}
                  onClick={() => loadA2UILabDemo(demo)}
                  className="w-full text-left px-2 py-2 rounded-lg text-xs hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center"
                      style={{ backgroundColor: `${demo.color}20` }}
                    >
                      <span style={{ color: demo.color }}>{getA2UILabIcon(demo.icon)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 font-medium truncate group-hover:text-white">{demo.name}</p>
                      <p className="text-[9px] text-white/40 truncate">{demo.capability}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
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
        <div
          className="h-14 border-b flex justify-between items-center px-6 transition-colors duration-300"
          style={{
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface
          }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse"></span>
              <span className="text-xs text-white/60">Gemini 3.0</span>
            </div>

            {/* Model Selector */}
            <div className="flex bg-white/5 rounded-lg p-0.5">
              <button
                onClick={() => setSelectedModel('flash')}
                className={`px-3 py-1.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all ${selectedModel === 'flash' ? 'text-white' : 'text-white/50 hover:text-white'}`}
                style={selectedModel === 'flash' ? { backgroundColor: theme.colors.accent } : {}}
              >
                <Zap size={10} /> FLASH
              </button>
              <button
                onClick={() => setSelectedModel('pro')}
                className={`px-3 py-1.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all ${selectedModel === 'pro' ? 'text-white' : 'text-white/50 hover:text-white'}`}
                style={selectedModel === 'pro' ? { backgroundColor: theme.colors.accentHover } : {}}
              >
                <Brain size={10} /> PRO
              </button>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            {/* Device Selector */}
            <DeviceSelector currentDevice={deviceType} onDeviceChange={setDeviceType} />

            {/* Edit Mode Toggle */}
            <button
              onClick={() => setEditMode(!editMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                editMode
                  ? 'bg-[#FFB800] text-black'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
              title="Toggle Edit Mode (Drag & Drop)"
            >
              <GripVertical size={14} />
              <span className="hidden sm:inline">{editMode ? 'Editing' : 'Edit'}</span>
            </button>

            <div className="w-px h-6 bg-white/10" />

            {/* Save Button */}
            <button onClick={handleSaveWidget} className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-[#00FF88]" title="Guardar Widget">
              <Save size={16} />
            </button>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-[#6D00FF] flex items-center gap-1"
              >
                <Download size={16} />
              </button>
              {showExportMenu && (
                <div className="absolute right-0 top-full mt-1 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl z-50 min-w-[180px] py-2">
                  <button onClick={handleExportJSON} className="w-full px-4 py-2 text-left text-xs text-white/80 hover:bg-white/5 flex items-center gap-2">
                    <FileJson size={14} className="text-[#00FF88]" /> Descargar JSON
                  </button>
                  <button onClick={handleCopyReact} className="w-full px-4 py-2 text-left text-xs text-white/80 hover:bg-white/5 flex items-center gap-2">
                    <FileCode size={14} className="text-[#6D00FF]" /> Copiar React
                  </button>
                  <button onClick={handleExportHTML} className="w-full px-4 py-2 text-left text-xs text-white/80 hover:bg-white/5 flex items-center gap-2">
                    <Globe size={14} className="text-[#00D4FF]" /> Descargar HTML
                  </button>
                </div>
              )}
            </div>

            <button className="p-2 hover:bg-white/10 rounded-lg text-white/60"><MonitorPlay size={16} /></button>
            <button className="p-2 hover:bg-white/10 rounded-lg text-white/60"><Code size={16} /></button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT: CHAT & EDITOR */}
          <div
            className="w-1/2 flex flex-col border-r transition-colors duration-300"
            style={{ borderColor: theme.colors.border }}
          >
            {/* Chat History */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar transition-colors duration-300"
              ref={scrollRef}
              style={{ backgroundColor: theme.colors.surface }}
            >
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm max-w-[90%] ${m.role === 'user' ? 'border' : ''}`}
                    style={m.role === 'user'
                      ? {
                          backgroundColor: `${theme.colors.accent}20`,
                          borderColor: `${theme.colors.accent}30`,
                          color: theme.colors.text
                        }
                      : {
                          backgroundColor: `${theme.colors.text}08`,
                          color: theme.colors.textMuted
                        }
                    }
                  >
                    {m.text}
                  </div>
                  {m.thought && (
                    <div className="flex items-center gap-2 mt-1 ml-2 text-[10px]" style={{ color: theme.colors.textMuted }}>
                      <Sparkles size={10} /> {m.thought}
                    </div>
                  )}
                </div>
              ))}
              {isGenerating && (
                <div className="text-xs animate-pulse ml-4" style={{ color: theme.colors.accent }}>
                  Gemini está diseñando...
                </div>
              )}
            </div>

            {/* Input */}
            <div
              className="p-4 border-t transition-colors duration-300"
              style={{
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.surface
              }}
            >
              <form onSubmit={handleChat} className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe el widget: 'Crea una rutina de pecho intensa'..."
                  className="w-full rounded-xl py-4 pl-5 pr-14 text-sm outline-none transition-colors duration-300"
                  style={{
                    backgroundColor: theme.colors.surfaceHover,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: theme.colors.border,
                    color: theme.colors.text
                  }}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-white hover:opacity-90 transition-colors"
                  style={{ backgroundColor: theme.colors.accent }}
                >
                  <Send size={16} />
                </button>
              </form>
            </div>

            {/* JSON Editor (Bottom Half) */}
            <div
              className="h-1/3 border-t flex flex-col transition-colors duration-300"
              style={{
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.background
              }}
            >
              <div
                className="px-4 py-2 border-b flex justify-between items-center"
                style={{ borderColor: `${theme.colors.border}50` }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-white/40 uppercase">Live JSON Editor</span>
                  {/* Validation Indicator */}
                  <ValidationIndicator
                    result={validationResult?.validation || null}
                    parseError={validationResult?.parseError || null}
                  />
                  {/* Undo/Redo Controls */}
                  <HistoryControls
                    onUndo={undo}
                    onRedo={redo}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    historyLength={historyLength}
                    futureLength={futureLength}
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleRefine} className="text-[10px] text-[#A855F7] hover:text-white flex items-center gap-1 border border-[#A855F7]/30 px-2 py-1 rounded hover:bg-[#A855F7]/10"><Wand2 size={10} /> Mejorar con IA</button>
                  <button onClick={() => navigator.clipboard.writeText(currentJSON)} className="text-[10px] text-[#6D00FF] hover:text-white flex items-center gap-1"><Copy size={10} /> Copiar</button>
                </div>
              </div>
              {/* Validation Errors Panel */}
              {showValidation && (validationResult?.parseError || (validationResult?.validation && (!validationResult.validation.valid || validationResult.validation.warnings.length > 0))) && (
                <div className="px-4 pt-2 max-h-32 overflow-y-auto no-scrollbar">
                  <ValidationErrors
                    result={validationResult?.validation || null}
                    parseError={validationResult?.parseError || null}
                    isCollapsed={false}
                  />
                </div>
              )}
              <textarea
                value={currentJSON}
                onChange={(e) => setCurrentJSON(e.target.value)}
                className="flex-1 w-full bg-transparent font-mono text-xs p-4 outline-none resize-none no-scrollbar"
                style={{ color: theme.colors.success }}
                spellCheck="false"
              />
            </div>
          </div>

          {/* RIGHT: LIVE PREVIEW */}
          <div
            className="w-1/2 relative flex items-center justify-center p-8 overflow-hidden transition-colors duration-300"
            style={{ backgroundColor: theme.colors.background }}
          >
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

            {/* Edit Mode Indicator */}
            {editMode && (
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-[#FFB800]/20 text-[#FFB800] px-3 py-1.5 rounded-full text-[10px] font-bold uppercase">
                <span className="w-2 h-2 bg-[#FFB800] rounded-full animate-pulse" />
                Modo Edición
              </div>
            )}

            {/* Responsive Device Frame */}
            <DeviceFrame device={deviceType}>
              {parsedWidget ? (
                <A2UIMediator
                  payload={parsedWidget}
                  onAction={(id, val) => console.log(`Action: ${id}`, val)}
                  editMode={editMode}
                  onReorder={handleWidgetReorder}
                />
              ) : (
                <div className="text-center text-white/20 text-xs mt-20">JSON Inválido o Vacío</div>
              )}
            </DeviceFrame>
          </div>

        </div>
      </div>
    </div>
  );
};

// Wrap with ThemeProvider
const App = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;