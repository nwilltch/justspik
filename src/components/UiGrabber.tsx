'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Crosshair,
  Copy,
  Check,
  Trash2,
  X,
  Minus,
  Maximize2,
  GripHorizontal,
  Sparkles,
} from 'lucide-react';

interface GrabbedItem {
  id: string;
  tag: string;
  classes: string;
  textSnippet: string;
  componentHint: string;
  instruction: string;
}

export const UiGrabber: React.FC = () => {
  // Strict check: strictly invisible and disabled in production
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isInspecting, setIsInspecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [promptText, setPromptText] = useState('');

  // Position for the draggable panel
  const [position, setPosition] = useState({ x: 24, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, startX: 0, startY: 0 });

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const overlayBadgeRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const initialX = Math.max(20, window.innerWidth - 420);
      setPosition({ x: initialX, y: 70 });
    }
  }, []);

  // Keyboard shortcut Ctrl+G or Cmd+G
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        setIsOpen((prev) => {
          const next = !prev;
          if (next) setIsInspecting(true);
          else setIsInspecting(false);
          return next;
        });
      }
      if (e.key === 'Escape' && isInspecting) {
        setIsInspecting(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInspecting]);

  // Create overlay DOM elements once
  useEffect(() => {
    if (!mounted) return;

    const overlay = document.createElement('div');
    overlay.className =
      'fixed pointer-events-none z-[999998] transition-all duration-75 ease-out rounded-xl border-2 border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.35)] hidden';

    const overlayBadge = document.createElement('div');
    overlayBadge.className =
      'absolute -top-7 left-0 px-2.5 py-0.5 rounded-md bg-stone-900 text-white font-mono text-[10px] font-bold shadow-md flex items-center gap-1.5 border border-stone-700 pointer-events-none whitespace-nowrap';
    overlayBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span><span id="grabber-overlay-label"></span>`;

    overlay.appendChild(overlayBadge);
    document.body.appendChild(overlay);

    overlayRef.current = overlay;
    overlayBadgeRef.current = overlayBadge;

    return () => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    };
  }, [mounted]);

  // Detect likely React component file name based on DOM hierarchy & attributes
  const guessComponentSource = (el: HTMLElement): string => {
    let current: HTMLElement | null = el;
    while (current && current !== document.body) {
      // Check data attributes or role
      if (current.tagName === 'HEADER') return 'src/components/Header.tsx';
      if (current.closest('[data-modal]')) return 'src/components/AuthModal.tsx';
      if (current.tagName === 'BUTTON' && current.innerText.includes('Ajouter'))
        return 'src/components/Header.tsx';
      if (current.closest('header')) return 'src/components/Header.tsx';
      if (current.closest('.bg-blue-50') || current.closest('[title*="prononciation"]'))
        return 'src/components/ResultDrawer.tsx';
      if (current.tagName === 'BUTTON' && (current.querySelector('svg') || current.innerText.includes('parler')))
        return 'src/components/VoiceTrigger.tsx';
      if (current.innerText.includes('Traduis en') || current.closest('.max-w-xl'))
        return 'src/components/PromptCard.tsx';
      if (current.closest('nav') || current.innerText.includes('Routine'))
        return 'src/components/CategoryBar.tsx';
      current = current.parentElement;
    }
    return 'src/app/page.tsx';
  };

  // Inspect events (mouse move & click to grab)
  useEffect(() => {
    if (!isInspecting) {
      if (overlayRef.current) overlayRef.current.classList.add('hidden');
      document.body.classList.remove('cursor-crosshair');
      return;
    }

    document.body.classList.add('cursor-crosshair');

    const handleMouseMove = (e: MouseEvent) => {
      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (!target || !overlayRef.current) return;

      // Ignore grabber panel itself and overlay
      if (panelRef.current?.contains(target) || overlayRef.current.contains(target)) {
        overlayRef.current.classList.add('hidden');
        return;
      }

      const rect = target.getBoundingClientRect();
      overlayRef.current.style.top = `${rect.top}px`;
      overlayRef.current.style.left = `${rect.left}px`;
      overlayRef.current.style.width = `${rect.width}px`;
      overlayRef.current.style.height = `${rect.height}px`;
      overlayRef.current.classList.remove('hidden');

      const label = document.getElementById('grabber-overlay-label');
      if (label) {
        const tag = target.tagName.toLowerCase();
        const id = target.id ? `#${target.id}` : '';
        const firstClass = target.classList.length > 0 ? `.${target.classList[0]}` : '';
        label.textContent = `<${tag}${id}${firstClass}>`;
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || panelRef.current?.contains(target) || overlayRef.current?.contains(target)) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const tag = target.tagName.toLowerCase();
      const id = target.id ? `#${target.id}` : '';
      const classes = Array.from(target.classList)
        .filter((c) => !c.startsWith('focus:') && !c.startsWith('hover:'))
        .slice(0, 4)
        .join('.');
      const classStr = classes ? `.${classes}` : '';
      const textSnippet = target.innerText
        ? target.innerText.trim().replace(/\s+/g, ' ').slice(0, 60)
        : '';
      const componentSource = guessComponentSource(target);

      const snippet = `📍 [${componentSource}] <${tag}${id}${classStr}>${
        textSnippet ? ` "${textSnippet}"` : ''
      }\n> `;

      setPromptText((prev) => (prev.trim().length > 0 ? `${prev.trim()}\n\n${snippet}` : snippet));

      // Scroll textarea to end and focus
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const len = textareaRef.current.value.length;
          textareaRef.current.setSelectionRange(len, len);
        }
      }, 50);

      // Keep inspecting so user can grab multiple elements in one go!
    };

    window.addEventListener('mousemove', handleMouseMove, true);
    window.addEventListener('click', handleClick, true);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove, true);
      window.removeEventListener('click', handleClick, true);
      document.body.classList.remove('cursor-crosshair');
    };
  }, [isInspecting]);

  // Dragging logic for the floating panel
  const handleMouseDownDrag = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: position.x,
      startY: position.y,
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartRef.current.mouseX;
      const deltaY = e.clientY - dragStartRef.current.mouseY;

      const newX = Math.max(10, Math.min(window.innerWidth - 380, dragStartRef.current.startX + deltaX));
      const newY = Math.max(10, Math.min(window.innerHeight - 150, dragStartRef.current.startY + deltaY));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleCopy = () => {
    if (!promptText.trim()) return;
    navigator.clipboard.writeText(promptText.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Floating launcher trigger pill in bottom-left corner */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsInspecting(true);
          }}
          className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3.5 py-2 rounded-full bg-stone-900/90 hover:bg-stone-900 text-white text-xs font-semibold shadow-xl border border-stone-700/80 backdrop-blur-md transition-all active:scale-95 cursor-pointer group"
          title="Ouvrir UI Grabber (Ctrl+G)"
        >
          <Crosshair className="w-4 h-4 text-emerald-400 group-hover:rotate-45 transition-transform" />
          <span>UI Grabber</span>
          <kbd className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-400 text-[10px] font-mono border border-stone-700">
            Ctrl+G
          </kbd>
        </button>
      )}

      {/* Draggable Dock Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
            width: isMinimized ? '280px' : '400px',
          }}
          className="fixed top-0 left-0 z-[999999] flex flex-col bg-stone-900/95 backdrop-blur-xl border border-stone-700/80 rounded-2xl shadow-2xl overflow-hidden transition-size duration-150 text-white select-none"
        >
          {/* Header - Drag Handle */}
          <div
            onMouseDown={handleMouseDownDrag}
            className="flex items-center justify-between px-3.5 py-2.5 bg-stone-950/80 border-b border-stone-800 cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center gap-2">
              <GripHorizontal className="w-4 h-4 text-stone-500" />
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold tracking-tight text-white">
                  UI Grabber <span className="text-emerald-400 text-[10px]">Dev</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Crosshair Inspect Toggle */}
              <button
                type="button"
                onClick={() => setIsInspecting(!isInspecting)}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isInspecting
                    ? 'bg-emerald-500 text-stone-950 ring-2 ring-emerald-400 font-bold'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
                title={isInspecting ? 'Désactiver le sélecteur' : 'Cliquer pour inspecter des éléments'}
              >
                <Crosshair className="w-3.5 h-3.5" />
              </button>

              {/* Minimize / Expand */}
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                title={isMinimized ? 'Agrandir' : 'Réduire'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsInspecting(false);
                }}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                title="Fermer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Panel Body (Hidden if minimized) */}
          {!isMinimized && (
            <div className="p-3 flex flex-col gap-2.5">
              {/* Status info banner */}
              <div className="flex items-center justify-between text-[11px] text-stone-400 px-1">
                <span>
                  {isInspecting ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Clique sur n'importe quel élément de la page...
                    </span>
                  ) : (
                    'Clique sur 🎯 pour capturer plusieurs éléments'
                  )}
                </span>
                <span className="text-[10px] font-mono text-stone-500">Ctrl+G</span>
              </div>

              {/* Prompt Textarea */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder={`Clique sur les éléments de ton interface pour composer ton prompt IA multi-modifications...\n\nExemple :\n📍 [src/components/Header.tsx] <button.bg-blue-600>\n> Remplace la couleur par un vert émeraude plus doux`}
                  rows={7}
                  className="w-full p-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-y placeholder:text-stone-600 selection:bg-emerald-500/30 selection:text-white leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setPromptText('')}
                  disabled={!promptText.trim()}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-400 hover:text-stone-200 hover:bg-stone-800 disabled:opacity-30 transition-colors cursor-pointer"
                  title="Effacer le texte"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Effacer</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!promptText.trim()}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-40 ${
                    copied
                      ? 'bg-emerald-500 text-stone-950 shadow-emerald-500/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-stone-950 shadow-emerald-600/20'
                  }`}
                  title="Copier le prompt pour Antigravity / IA"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Copié dans le presse-papier !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier pour l'IA</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
