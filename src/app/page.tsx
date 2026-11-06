'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Header } from '@/components/Header';
import { ModeSelector, GameMode } from '@/components/ModeSelector';
import { CategoryBar } from '@/components/CategoryBar';
import { ChronoHUD } from '@/components/ChronoHUD';
import { SurvivalHUD } from '@/components/SurvivalHUD';
import { PromptCard } from '@/components/PromptCard';
import { VoiceTrigger } from '@/components/VoiceTrigger';
import { ResultDrawer } from '@/components/ResultDrawer';
import { SummaryModal } from '@/components/SummaryModal';
import { LeaderboardDrawer } from '@/components/LeaderboardDrawer';
import { CustomPhraseModal } from '@/components/CustomPhraseModal';
import { useAuth, MAX_FREE_ATTEMPTS } from '@/contexts/AuthContext';
import { audioRecorder } from '@/lib/audioRecorder';
import {
  MULTILINGUAL_ENTRIES,
  buildChallenge,
  evaluateSpokenAnswer,
  getLanguageInfo,
} from '@/lib/data';
import { Challenge, EvaluationResult, MultilingualEntry, PhraseCategory, SupportedLang } from '@/lib/types';
import { sound } from '@/lib/soundFx';
import { getGhostRecord, saveGhostRecord, getDailyStreak, recordDayActivity } from '@/lib/ghostStore';

export default function JustSpikApp() {
  const { user, guestAttempts, isLimitReached, incrementGuestAttempt, openAuthModal } = useAuth();

  // Game Modes & Sound
  const [gameMode, setGameMode] = useState<GameMode>('focus');
  const [isMuted, setIsMuted] = useState(false);

  // Survival Mode states
  const [survivalSecondsLeft, setSurvivalSecondsLeft] = useState(45.0);
  const [survivalScore, setSurvivalScore] = useState(0);
  const [timeBonusDelta, setTimeBonusDelta] = useState<number | null>(null);

  // Daily Sprint states
  const [dailyStep, setDailyStep] = useState(1);
  const [dailySymbols, setDailySymbols] = useState<('lightning' | 'normal' | 'error')[]>([]);

  // Session Stats for Summary Modal & Leaderboard
  const [sessionAttemptCount, setSessionAttemptCount] = useState(0);
  const [sessionCorrectCount, setSessionCorrectCount] = useState(0);
  const [sessionTotalTime, setSessionTotalTime] = useState(0);
  const [bestUserSpeed, setBestUserSpeed] = useState<number | null>(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [streak, setStreak] = useState(1);

  // Languages configuration
  const [sourceLang, setSourceLang] = useState<SupportedLang>('fr');
  const [targetLang, setTargetLang] = useState<SupportedLang>('en');

  // Categories & entries loaded from database
  const [currentCategory, setCurrentCategory] = useState<PhraseCategory>('routine');
  const [savedEntries, setSavedEntries] = useState<MultilingualEntry[]>(MULTILINGUAL_ENTRIES);
  const [customChallenges, setCustomChallenges] = useState<Challenge[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // Ghost Mode Record for current phrase
  const [ghostRecord, setGhostRecord] = useState<number | null>(null);

  // Load saved phrases & streak on mount
  useEffect(() => {
    fetch('/api/phrases')
      .then((res) => res.json())
      .then((data) => {
        if (data.phrases && data.phrases.length > 0) {
          setSavedEntries(data.phrases);
        }
      })
      .catch((err) => console.warn('Erreur chargement phrases:', err));

    setStreak(getDailyStreak());
  }, []);

  // Compute active challenges list dynamically based on chosen languages and category
  const activeChallenges = useMemo(() => {
    if (currentCategory === 'custom') {
      return customChallenges.filter(
        (c) => c.sourceLang === sourceLang && c.targetLang === targetLang
      );
    }
    const filteredEntries = savedEntries.filter(
      (entry) => entry.category === currentCategory
    );
    return filteredEntries.map((entry) =>
      buildChallenge(entry, sourceLang, targetLang)
    );
  }, [currentCategory, sourceLang, targetLang, savedEntries, customChallenges]);

  const currentChallenge: Challenge | undefined =
    activeChallenges[currentIndex % Math.max(activeChallenges.length, 1)];

  // Update ghost record when current challenge changes
  useEffect(() => {
    if (currentChallenge) {
      setGhostRecord(getGhostRecord(currentChallenge.id));
    }
  }, [currentChallenge]);

  // Chronometer & Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0.0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // References
  const startTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const survivalIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Survival Mode Timer Loop
  useEffect(() => {
    if (gameMode !== 'survival' || evaluation !== null || isSummaryModalOpen) {
      if (survivalIntervalRef.current) clearInterval(survivalIntervalRef.current);
      return;
    }

    survivalIntervalRef.current = setInterval(() => {
      setSurvivalSecondsLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(survivalIntervalRef.current!);
          setIsSummaryModalOpen(true);
          return 0;
        }

        const next = Math.max(0, prev - 0.1);
        if (next <= 5 && Math.floor(next) !== Math.floor(prev)) {
          sound.playUrgentTick();
        }
        return next;
      });
    }, 100);

    return () => {
      if (survivalIntervalRef.current) clearInterval(survivalIntervalRef.current);
    };
  }, [gameMode, evaluation, isSummaryModalOpen]);

  // Mode Selection handler
  const handleSelectMode = (mode: GameMode) => {
    setGameMode(mode);
    setEvaluation(null);
    setElapsedTime(0.0);

    if (mode === 'survival') {
      setSurvivalSecondsLeft(45.0);
      setSurvivalScore(0);
      setTimeBonusDelta(null);
      setSessionAttemptCount(0);
      setSessionCorrectCount(0);
      setSessionTotalTime(0);
      setDailySymbols([]);
    } else if (mode === 'daily') {
      setDailyStep(1);
      setDailySymbols([]);
      setSessionAttemptCount(0);
      setSessionCorrectCount(0);
      setSessionTotalTime(0);
    }
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const nextMuted = sound.toggleMuted();
    setIsMuted(nextMuted);
  };

  // Generate and add a new phrase in the selected category
  const handleGenerateNewPhrase = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const categoryToGenerate = currentCategory === 'custom' ? 'routine' : currentCategory;
      const res = await fetch('/api/generate-phrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: categoryToGenerate }),
      });
      const data = await res.json();
      if (data.entry) {
        setSavedEntries((prev) => {
          const exists = prev.some((e) => e.id === data.entry.id);
          return exists ? prev : [...prev, data.entry];
        });
        if (currentCategory === 'custom') {
          setCurrentCategory(categoryToGenerate);
        }
        const newFiltered = [...savedEntries, data.entry].filter(
          (e) => e.category === categoryToGenerate
        );
        setCurrentIndex(newFiltered.length - 1);
        setEvaluation(null);
        setElapsedTime(0.0);
      }
    } catch (err) {
      console.error('Erreur ajout nouvelle phrase:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Swap languages with arrow click inside card
  const handleSwapLanguages = () => {
    const prevSource = sourceLang;
    const prevTarget = targetLang;
    setSourceLang(prevTarget);
    setTargetLang(prevSource);
    setEvaluation(null);
    setElapsedTime(0.0);
    setCurrentIndex(0);
  };

  const handleChangeSourceLang = (lang: SupportedLang) => {
    if (lang === targetLang) {
      handleSwapLanguages();
      return;
    }
    setSourceLang(lang);
    setEvaluation(null);
    setElapsedTime(0.0);
  };

  const handleChangeTargetLang = (lang: SupportedLang) => {
    if (lang === sourceLang) {
      handleSwapLanguages();
      return;
    }
    setTargetLang(lang);
    setEvaluation(null);
    setElapsedTime(0.0);
  };

  // Initialize Speech Recognition with selected target language locale
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = getLanguageInfo(targetLang).locale;

        recognition.onresult = async (event: any) => {
          const transcript = event.results[0][0].transcript;
          const userAudioUrl = await audioRecorder.stop();
          handleProcessVoiceInput(transcript, undefined, userAudioUrl);
        };

        recognition.onerror = () => {
          stopTimer();
          setIsRecording(false);
          audioRecorder.stop();
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [targetLang, currentChallenge]);

  // Start Chronometer
  const startTimer = useCallback(() => {
    startTimeRef.current = performance.now();
    setElapsedTime(0.0);
    setIsTimerRunning(true);

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      const now = performance.now();
      const seconds = (now - startTimeRef.current) / 1000;
      setElapsedTime(seconds);
    }, 25);
  }, []);

  // Stop Chronometer
  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsTimerRunning(false);
    const finalSeconds = (performance.now() - startTimeRef.current) / 1000;
    setElapsedTime(finalSeconds);
    return finalSeconds;
  }, []);

  // Recording controls
  const handleStartRecording = () => {
    if (isLimitReached) {
      openAuthModal('signup', undefined, 'limit_reached');
      return;
    }

    setEvaluation(null);
    setIsRecording(true);
    startTimer();

    // Démarrer l'enregistrement audio physique du micro pour réécoute
    audioRecorder.start();

    try {
      if (recognitionRef.current) {
        recognitionRef.current.lang = getLanguageInfo(targetLang).locale;
        recognitionRef.current.start();
      }
    } catch {
      // Ignore
    }
  };

  const handleStopRecording = () => {
    stopTimer();
    setIsRecording(false);

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } catch {
      // Ignore
    }
  };

  // Process voice input and trigger audio/game mechanics
  const handleProcessVoiceInput = (
    transcript: string,
    simulatedTime?: number,
    userAudioUrl?: string | null
  ) => {
    const finalTime = simulatedTime ?? stopTimer();
    if (!currentChallenge) return;

    const result = evaluateSpokenAnswer(transcript, currentChallenge, finalTime);
    result.userAudioUrl = userAudioUrl || audioRecorder.getCurrentAudioUrl() || null;
    setEvaluation(result);

    // Update global session stats
    setSessionAttemptCount((prev) => prev + 1);
    setSessionTotalTime((prev) => prev + finalTime);

    // Suivi du quota d'essais pour les invités non connectés
    if (!user) {
      const updatedAttempts = incrementGuestAttempt();
      if (updatedAttempts >= MAX_FREE_ATTEMPTS) {
        setTimeout(() => {
          openAuthModal('signup', undefined, 'limit_reached');
        }, 1500);
      }
    }

    if (result.isCorrect) {
      setSessionCorrectCount((prev) => prev + 1);
      setBestUserSpeed((prev) => (prev === null || finalTime < prev ? finalTime : prev));

      // Play soft crystalline audio chime
      sound.playSuccessChime(finalTime <= 2.2);

      // Ghost Mode: Save and check if personal record was beaten!
      const { isNewRecord } = saveGhostRecord(currentChallenge.id, finalTime);
      if (isNewRecord) {
        setGhostRecord(finalTime);
      }

      // Survival Mode bonuses (+4s)
      if (gameMode === 'survival') {
        setSurvivalScore((s) => s + 1);
        setSurvivalSecondsLeft((sec) => Math.min(60, sec + 4.0));
        setTimeBonusDelta(4);
        setTimeout(() => setTimeBonusDelta(null), 1200);
      }

      // Daily Sprint progress
      if (gameMode === 'daily') {
        const symbol = finalTime <= 2.5 ? 'lightning' : 'normal';
        setDailySymbols((prev) => [...prev, symbol]);
        if (dailyStep >= 7) {
          const newStreak = recordDayActivity();
          setStreak(newStreak);
          setTimeout(() => setIsSummaryModalOpen(true), 900);
        } else {
          setDailyStep((s) => s + 1);
        }
      }
    } else {
      // Play soft wooden error tap
      sound.playErrorTap();

      // Survival penalty (-5s)
      if (gameMode === 'survival') {
        setSurvivalSecondsLeft((sec) => Math.max(0, sec - 5.0));
        setTimeBonusDelta(-5);
        setTimeout(() => setTimeBonusDelta(null), 1200);
      }

      // Daily Sprint error mark
      if (gameMode === 'daily') {
        setDailySymbols((prev) => [...prev, 'error']);
        if (dailyStep >= 7) {
          const newStreak = recordDayActivity();
          setStreak(newStreak);
          setTimeout(() => setIsSummaryModalOpen(true), 900);
        } else {
          setDailyStep((s) => s + 1);
        }
      }
    }
  };

  // Instant simulator for testing
  const handleSimulateAnswer = (preset: 'perfect' | 'with-error') => {
    if (!currentChallenge) return;
    const simTime = preset === 'perfect' ? 1.65 : 3.82;
    setElapsedTime(simTime);

    const phraseToUse =
      preset === 'perfect'
        ? currentChallenge.optimalAnswer
        : `${currentChallenge.optimalAnswer.split(' ')[0]} incorrect version`;

    handleProcessVoiceInput(phraseToUse, simTime);
  };

  // Next challenge
  const handleNextChallenge = () => {
    audioRecorder.cleanupCurrentAudio();

    if (isLimitReached) {
      openAuthModal('signup', undefined, 'limit_reached');
      return;
    }

    setEvaluation(null);
    setElapsedTime(0.0);
    setCurrentIndex((prev) => prev + 1);

    // Auto-génération en tâche de fond jusqu'à 2 000 phrases (non-bloquant)
    fetch('/api/cron/fill-phrases', { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (data.isFull) {
          console.log('[JustSpik] Objectif de 2 000 phrases atteint !');
        }
      })
      .catch(() => {});
  };

  // Retry challenge
  const handleRetry = () => {
    audioRecorder.cleanupCurrentAudio();

    if (isLimitReached) {
      openAuthModal('signup', undefined, 'limit_reached');
      return;
    }
    setEvaluation(null);
    setElapsedTime(0.0);
  };

  // Audio Speech Synthesis for Source phrase
  const handlePlayPromptAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && currentChallenge) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentChallenge.sourceText);
      utterance.lang = getLanguageInfo(sourceLang).locale;
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Audio Speech Synthesis for Solution
  const handlePlaySolutionAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && currentChallenge) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentChallenge.optimalAnswer);
      utterance.lang = getLanguageInfo(targetLang).locale;
      utterance.rate = 0.92;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Add custom phrase (processed & translated by DeepSeek, saved on disk)
  const handlePhraseAdded = (newEntry: MultilingualEntry) => {
    setSavedEntries((prev) => {
      const exists = prev.some((e) => e.id === newEntry.id);
      return exists ? prev : [...prev, newEntry];
    });
    setCurrentCategory(newEntry.category);
    const filtered = [...savedEntries, newEntry].filter(
      (e) => e.category === newEntry.category
    );
    setCurrentIndex(Math.max(0, filtered.length - 1));
    setEvaluation(null);
    setElapsedTime(0.0);
  };

  // Replay handler from summary modal
  const handleReplayFromModal = () => {
    setIsSummaryModalOpen(false);
    handleSelectMode(gameMode);
  };

  const avgReactionTime = sessionAttemptCount > 0 ? sessionTotalTime / sessionAttemptCount : 0;
  const accuracyRate =
    sessionAttemptCount > 0 ? Math.round((sessionCorrectCount / sessionAttemptCount) * 100) : 0;

  return (
    <main className="min-h-screen bg-[#fafaf9] flex flex-col justify-between p-4 md:p-8">
      {/* Top Header with Mode Dropdown & Actions */}
      <Header
        currentMode={gameMode}
        onSelectMode={handleSelectMode}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        isGenerating={isGenerating}
        onGenerateNewPhrase={handleGenerateNewPhrase}
      />

      {/* Main Focus Canvas */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full my-4">
        {/* Only One Filter Bar: Category Pills */}
        <CategoryBar
          currentCategory={currentCategory}
          onSelectCategory={(cat) => {
            setCurrentCategory(cat);
            setCurrentIndex(0);
            setEvaluation(null);
            setElapsedTime(0.0);
          }}
        />

        {/* Survival or Daily HUD (if active) */}
        <SurvivalHUD
          mode={gameMode}
          survivalSecondsLeft={survivalSecondsLeft}
          survivalScore={survivalScore}
          dailyStep={dailyStep}
          dailyTotal={7}
          timeBonusDelta={timeBonusDelta}
        />

        {/* Chrono */}
        <ChronoHUD
          timeSeconds={elapsedTime}
          isRunning={isTimerRunning}
          targetBenchmark={currentChallenge?.targetTimeSec || 3.0}
        />

        {/* Prompt Card with integrated Language Change, Swap & Ghost Mode Record */}
        {currentChallenge ? (
          <PromptCard
            challenge={currentChallenge}
            isRecording={isRecording}
            onPlayPromptAudio={handlePlayPromptAudio}
            onSwapLanguages={handleSwapLanguages}
            onChangeSourceLang={handleChangeSourceLang}
            onChangeTargetLang={handleChangeTargetLang}
            onSkip={handleNextChallenge}
            ghostRecord={ghostRecord}
          />
        ) : (
          <div className="w-full max-w-xl text-center p-8 rounded-2xl bg-white border border-stone-200/80 shadow-sm">
            <p className="text-stone-500 text-sm mb-3">
              Aucune phrase pour la combinaison {getLanguageInfo(sourceLang).flag} ➔ {getLanguageInfo(targetLang).flag}.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handleGenerateNewPhrase}
                disabled={isGenerating}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                Découvrir une phrase
              </button>
            </div>
          </div>
        )}

        {/* Voice Trigger (Mic) */}
        {!evaluation && currentChallenge && (
          <VoiceTrigger
            isRecording={isRecording}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            onSimulateAnswer={handleSimulateAnswer}
            onSkip={handleNextChallenge}
            isLimitReached={isLimitReached}
            onLimitReached={() => openAuthModal('signup', undefined, 'limit_reached')}
          />
        )}

        {/* Evaluation & Solution Drawer with Audio Pronunciation Button */}
        {evaluation && (
          <ResultDrawer
            result={evaluation}
            onRetry={handleRetry}
            onNext={handleNextChallenge}
            onPlaySolutionAudio={handlePlaySolutionAudio}
          />
        )}
      </div>

      {/* Discrete minimal bottom brand */}
      <footer className="w-full text-center text-[11px] text-stone-400 pb-2">
        <span>JustSpik — Reflex Speech Training</span>
      </footer>

      {/* Custom Phrase Modal with Auto AI Translation */}
      <CustomPhraseModal
        isOpen={isCustomModalOpen}
        currentSourceLang={sourceLang}
        onClose={() => setIsCustomModalOpen(false)}
        onPhraseAdded={handlePhraseAdded}
      />

      {/* Summary Recap Modal (Survival Game Over / Daily Sprint Finished) */}
      <SummaryModal
        isOpen={isSummaryModalOpen}
        mode={gameMode === 'survival' ? 'survival' : 'daily'}
        score={gameMode === 'survival' ? survivalScore : sessionCorrectCount}
        totalAttempted={sessionAttemptCount}
        avgTimeSeconds={avgReactionTime}
        accuracyRate={accuracyRate}
        historySymbols={dailySymbols}
        streak={streak}
        onReplay={handleReplayFromModal}
        onClose={() => setIsSummaryModalOpen(false)}
      />
      {/* Leaderboard Slide-out Drawer */}
      <LeaderboardDrawer
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        userBestSurvivalScore={survivalScore}
        userBestSpeedSeconds={bestUserSpeed}
        userStreak={streak}
      />
    </main>
  );
}
