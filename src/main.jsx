import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import "./styles.css";
import { buildRsvpMessage, telegramRsvpUrl } from "./rsvp.js";
    // Header Component
    function Header({ isMusicPlaying, toggleMusic }) {
      const location = useLocation();
      const currentPath = location.pathname;
      const [menuOpen, setMenuOpen] = useState(false);
      useEffect(() => setMenuOpen(false), [currentPath]);

      const navItems = [
        { label: 'Приглашение', path: '/' },
        { label: 'Наша история', path: '/our-story' },
        { label: 'Место и программа', path: '/the-venue-and-itinerary' },
        { label: 'Дресс-код', path: '/dress-code' },
        { label: 'Ответить', path: '/rsvp' },
      ];

      return (
        <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="site-header-row h-20 max-w-[1120px] mx-auto px-margin flex items-center justify-between">
            <Link to="/" className="site-brand flex items-center gap-space-md no-underline">
              <img
                alt="Ruslan and Amaliya Wax Seal Monogram"
                className="h-8 w-auto object-contain"
                src="./reference-0.png"
              />
              <div className="flex flex-col">
                <span className="font-label-lg text-label-lg tracking-widest uppercase text-primary">Ruslan &amp; Amaliya</span>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-tertiary-container">Торжество любви</span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-space-lg">
              {navItems.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`font-label-md text-label-md uppercase tracking-wider transition-colors ${
                      isActive
                        ? "text-primary font-bold decoration-on-tertiary-container underline underline-offset-8"
                        : "text-on-surface-variant hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="site-header-actions flex items-center gap-space-md">
              <button
                aria-label="Toggle Wedding Chime"
                onClick={toggleMusic}
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                type="button"
                title={isMusicPlaying ? "Mute Ambience" : "Play Ambience"}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isMusicPlaying ? 'music_note' : 'music_off'}
                </span>
              </button>
              <button type="button" className="lg:hidden p-2 text-primary" aria-label="Открыть меню" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}><span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span></button>
            </div>
          </div>
          {menuOpen && <nav id="mobile-menu" aria-label="Навигация" className="lg:hidden bg-surface border-t border-outline-variant px-6 py-4 flex flex-col gap-4">{navItems.map(item => <Link key={item.path} to={item.path} aria-current={currentPath === item.path ? 'page' : undefined}>{item.label}</Link>)}</nav>}
        </header>
      );
    }

    // Shared Footer Component
    function Footer() {
      return (
        <footer className="w-full bg-surface-container-low py-space-xl border-t border-outline-variant/30">
          <div className="max-w-[1120px] mx-auto px-margin flex flex-col items-center justify-center text-center">
            <div className="mb-space-sm">
              <span className="font-headline-md text-headline-md italic text-primary">R &amp; A</span>
            </div>
            <p className="font-label-lg text-label-lg text-on-tertiary-container tracking-widest uppercase mb-space-xs">
              #RuslanAndAmaliya
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto mb-space-lg">
              С радостью и искренней благодарностью приглашаем вас разделить с нами праздник любви под звёздным небом.
            </p>
            <div className="w-16 h-px bg-outline-variant/60 mb-space-md"></div>
            <p className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
              © 2026 • Руслан &amp; Амалия • Все права защищены
            </p>
          </div>
        </footer>
      );
    }

    // Interactive Stars Canvas Background
    function AmbientStars() {
      const canvasRef = useRef(null);

      useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width = (canvas.width = canvas.parentElement.clientWidth || window.innerWidth);
        let height = (canvas.height = canvas.parentElement.clientHeight || 942);

        const handleResize = () => {
          if (!canvas.parentElement) return;
          width = canvas.width = canvas.parentElement.clientWidth;
          height = canvas.height = canvas.parentElement.clientHeight;
        };

        window.addEventListener('resize', handleResize);

        const stars = Array.from({ length: 65 }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.8 + 0.5,
          alpha: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.02 + 0.005,
          phase: Math.random() * Math.PI * 2
        }));

        let animationFrameId;
        function drawStars() {
          ctx.clearRect(0, 0, width, height);
          for (let s of stars) {
            s.phase += s.speed;
            const currentAlpha = Math.abs(Math.sin(s.phase)) * s.alpha;
            ctx.fillStyle = `rgba(217, 170, 82, ${currentAlpha})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();
          }
          if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) animationFrameId = requestAnimationFrame(drawStars);
        }
        drawStars();

        return () => {
          window.removeEventListener('resize', handleResize);
          cancelAnimationFrame(animationFrameId);
        };
      }, []);

      return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
    }

    // Screen 1: Wax Seal Envelope Opening Experience
    function EnvelopeInvitationPage({ isMusicPlaying, toggleMusic }) {
      const [isOpen, setIsOpen] = useState(false);
      const navigate = useNavigate();

      const handleOpen = () => {
        setIsOpen(true);
      };

      return (
        <main className="w-full pt-20 bg-surface min-h-[calc(100vh-80px)]">
          <div className="flex flex-col w-full">
            <section data-open={isOpen} className="invitation-scene relative w-full min-h-[942px] flex flex-col items-center justify-center overflow-hidden px-margin py-space-xl bg-primary text-on-primary">
              {/* Atmospheric Ambient Background */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary-container to-primary pointer-events-none opacity-95"></div>

              {/* Mountain Silhouette & Celestial Night Sky Graphic */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-end justify-center">
                <svg className="w-full h-96 text-primary-container/40 fill-current opacity-30 select-none scale-110" preserveAspectRatio="none" viewBox="0 0 1440 400">
                  <path d="M0,320 L120,240 L280,310 L440,210 L620,290 L780,180 L960,270 L1140,190 L1320,280 L1440,230 L1440,400 L0,400 Z"></path>
                  <path d="M0,340 L180,260 L360,330 L560,250 L720,320 L920,230 L1100,310 L1280,250 L1440,320 L1440,400 L0,400 Z" opacity="0.6"></path>
                </svg>
                <div className="absolute inset-0 bg-radial from-on-tertiary-container/10 via-transparent to-transparent opacity-60"></div>
              </div>

              {/* Floating Starlight Sparkles Canvas */}
              <AmbientStars />

              {/* Top Utility Controls Bar */}
              <div className="invitation-controls relative z-20 w-full max-w-[1120px] flex items-center justify-between mb-space-lg text-on-primary-container">
                {/* Music Ambience Toggle */}
                <button
                  onClick={toggleMusic}
                  className="group flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-primary-container/80 backdrop-blur-md shadow-sm hover:bg-primary-container transition-all"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px] text-tertiary-fixed transition-transform group-hover:scale-110">
                    {isMusicPlaying ? 'volume_up' : 'volume_off'}
                  </span>
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-tertiary-container">
                    Музыка: {isMusicPlaying ? 'Вкл' : 'Выкл'}
                  </span>
                  {isMusicPlaying && (
                    <span className="flex items-center gap-[2px] ml-1 h-3">
                      <span className="w-[2px] h-2 bg-on-tertiary-container rounded-full animate-pulse"></span>
                      <span className="w-[2px] h-3.5 bg-on-tertiary-container rounded-full animate-pulse delay-75"></span>
                      <span className="w-[2px] h-1.5 bg-on-tertiary-container rounded-full animate-pulse delay-150"></span>
                    </span>
                  )}
                </button>

                {/* Instant Access Control */}
                <button
                  onClick={handleOpen}
                  className="flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-primary-container/70 backdrop-blur-md hover:bg-primary-container transition-all text-on-surface-variant hover:text-tertiary-fixed cursor-pointer"
                  type="button"
                >
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-tertiary-fixed-dim">
                    {isOpen ? 'Приглашение открыто' : 'Открыть сразу'}
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">arrow_forward</span>
                </button>
              </div>

              {/* Envelope Stage & Spatial Arena */}
              <div className="relative z-10 w-full max-w-[760px] flex flex-col items-center select-none" style={{ perspective: "1400px" }}>
                <div className="envelope-stage relative w-full aspect-[16/10.5] max-h-[500px] flex items-center justify-center transition-transform duration-700">
                  {/* Deep Velvet Ambient Cast Shadow */}
                  <div className="absolute -bottom-8 w-11/12 h-16 bg-tertiary/80 rounded-full blur-2xl transform scale-y-50 pointer-events-none"></div>

                  {/* Envelope Body */}
                  <div className="envelope-body relative w-full h-full rounded-xl overflow-hidden shadow-2xl bg-gradient-to-tr from-[#0b1f15] via-primary-container to-[#102a1c] p-6 flex flex-col justify-between">
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#c5a059_1px,transparent_1px)] [background-size:16px_16px]"></div>

                    {/* Filigree Ornate Corners */}
                    <div className="absolute top-4 left-4 text-on-tertiary-container/70 pointer-events-none">
                      <svg fill="currentColor" height="48" viewBox="0 0 100 100" width="48">
                        <path d="M10,10 L90,10 C90,10 50,15 30,35 C15,50 10,90 10,90 Z" fill="none"></path>
                        <path d="M6,6 L70,6 Q20,20 6,70 Z" opacity="0.8"></path>
                        <circle cx="28" cy="28" r="4"></circle>
                        <path d="M30,12 Q45,25 60,18" fill="none" stroke="currentColor" strokeWidth="2"></path>
                      </svg>
                    </div>
                    <div className="absolute top-4 right-4 text-on-tertiary-container/70 pointer-events-none rotate-90">
                      <svg fill="currentColor" height="48" viewBox="0 0 100 100" width="48">
                        <path d="M10,10 L90,10 C90,10 50,15 30,35 C15,50 10,90 10,90 Z" fill="none"></path>
                        <path d="M6,6 L70,6 Q20,20 6,70 Z" opacity="0.8"></path>
                        <circle cx="28" cy="28" r="4"></circle>
                        <path d="M30,12 Q45,25 60,18" fill="none" stroke="currentColor" strokeWidth="2"></path>
                      </svg>
                    </div>
                    <div className="absolute bottom-4 left-4 text-on-tertiary-container/70 pointer-events-none -rotate-90">
                      <svg fill="currentColor" height="48" viewBox="0 0 100 100" width="48">
                        <path d="M10,10 L90,10 C90,10 50,15 30,35 C15,50 10,90 10,90 Z" fill="none"></path>
                        <path d="M6,6 L70,6 Q20,20 6,70 Z" opacity="0.8"></path>
                        <circle cx="28" cy="28" r="4"></circle>
                        <path d="M30,12 Q45,25 60,18" fill="none" stroke="currentColor" strokeWidth="2"></path>
                      </svg>
                    </div>
                    <div className="absolute bottom-4 right-4 text-on-tertiary-container/70 pointer-events-none rotate-180">
                      <svg fill="currentColor" height="48" viewBox="0 0 100 100" width="48">
                        <path d="M10,10 L90,10 C90,10 50,15 30,35 C15,50 10,90 10,90 Z" fill="none"></path>
                        <path d="M6,6 L70,6 Q20,20 6,70 Z" opacity="0.8"></path>
                        <circle cx="28" cy="28" r="4"></circle>
                        <path d="M30,12 Q45,25 60,18" fill="none" stroke="currentColor" strokeWidth="2"></path>
                      </svg>
                    </div>

                    {/* Gold Leaf Foil Inscription */}
                    <div className="relative z-10 w-full flex flex-col items-center text-center mt-6">
                      <span className="font-label-sm text-label-sm uppercase tracking-[0.3em] text-on-tertiary-container mb-2">
                        Церемония Бракосочетания
                      </span>
                      <div className="flex items-center gap-space-sm opacity-60 mb-2">
                        <span className="h-px w-12 bg-on-tertiary-container"></span>
                        <span className="text-tertiary-fixed text-xs">❦</span>
                        <span className="h-px w-12 bg-on-tertiary-container"></span>
                      </div>
                      <p className="font-headline-md text-headline-md italic tracking-wide text-tertiary-fixed-dim drop-shadow">
                        «Дорогому и желанному гостю»
                      </p>
                    </div>

                    {/* Bottom Geometric Envelope Fold Emulation */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[380px] border-l-transparent border-r-[380px] border-r-transparent border-b-[210px] border-b-primary-container/85 opacity-90"></div>
                      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-primary/95 to-transparent"></div>
                    </div>
                  </div>

                  {/* Parchment Invitation Card */}
                  <div
                    className={`invitation-card absolute w-[90%] max-w-[620px] rounded-lg bg-surface-bright text-on-surface shadow-2xl p-8 flex flex-col items-center text-center transition-all duration-1000 ease-out ${
                      isOpen
                        ? "opacity-100 pointer-events-auto z-50 -translate-y-[18%] scale-[1.03]"
                        : "opacity-0 pointer-events-none z-20 translate-y-8 scale-100"
                    }`}
                  >
                    <div className="absolute inset-3 border border-on-tertiary-container/40 rounded-sm pointer-events-none">
                      <div className="absolute inset-1 border border-dotted border-secondary/50 rounded-sm"></div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center my-auto">
                      <div className="w-12 h-12 mb-3 rounded-full bg-surface-container flex items-center justify-center text-primary shadow-sm">
                        <span className="font-headline-sm text-headline-sm italic text-on-tertiary-container">Р&amp;А</span>
                      </div>
                      <p className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-secondary mb-2">
                        Светлое Торжество Любви
                      </p>
                      <h2 className="font-headline-xl text-headline-xl text-primary font-normal mb-1">
                        Руслан &amp; Амалия
                      </h2>
                      <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto mb-4 italic leading-relaxed">
                        Приглашают вас разделить радость священного союза и стать почетным свидетелем рождения нашей семьи.
                      </p>
                      <div className="w-24 h-px bg-outline-variant/70 mb-4"></div>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-space-md text-primary mb-6">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-on-tertiary-container">calendar_today</span>
                          <span className="font-label-lg text-label-lg uppercase tracking-wider">24 Октября 2026</span>
                        </div>
                        <span className="hidden sm:inline text-on-tertiary-container">•</span>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-on-tertiary-container">location_on</span>
                          <span className="font-label-lg text-label-lg uppercase tracking-wider">Комплекс «Лотос», Паркент</span>
                        </div>
                      </div>

                      <Link
                        to="/celebration"
                        className="group relative inline-flex items-center gap-space-sm px-space-lg py-space-sm bg-primary text-on-primary rounded font-label-md text-label-md uppercase tracking-widest shadow-md hover:bg-primary-container transition-all duration-300"
                      >
                        <span className="relative z-10">Просмотреть программу и детали</span>
                        <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">east</span>
                        <div className="absolute inset-[3px] border border-on-tertiary-container/40 pointer-events-none rounded-sm"></div>
                      </Link>
                    </div>
                  </div>

                  {/* Envelope 3D Triangular Flap */}
                  <div
                    className="absolute top-0 left-0 w-full h-[52%] z-30 origin-top transition-transform duration-700 ease-in-out pointer-events-none"
                    style={{
                      transformStyle: "preserve-3d",
                      transform: isOpen ? "rotateX(180deg)" : "rotateX(0deg)"
                    }}
                  >
                    <svg className="w-full h-full drop-shadow-md" preserveAspectRatio="none" viewBox="0 0 100 60">
                      <polygon className="fill-primary-container" points="0,0 100,0 50,60"></polygon>
                      <polygon fill="url(#flapGradient)" opacity="0.3" points="0,0 50,60 100,0"></polygon>
                      <defs>
                        <linearGradient id="flapGradient" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#bd9852" stopOpacity="0.6"></stop>
                          <stop offset="100%" stopColor="#032517" stopOpacity="0.9"></stop>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  {/* 3D Wax Seal Interactive Focal Point */}
                  {!isOpen && (
                    <div role="button" tabIndex={0} aria-label="Открыть приглашение" onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleOpen(); } }}
                      onClick={handleOpen}
                      className="absolute z-40 top-[52%] -translate-y-1/2 flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
                    >
                      <div className="absolute w-24 h-24 rounded-full bg-on-tertiary-container/30 blur-xl animate-ping pointer-events-none"></div>
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#d9aa52] via-[#a3792c] to-[#593d0d] shadow-[0_10px_25px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.6),inset_0_-3px_6px_rgba(0,0,0,0.4)] flex items-center justify-center border border-tertiary-fixed-dim/40">
                        <div className="absolute inset-1.5 rounded-full border-2 border-dashed border-[#593d0d]/40 opacity-70"></div>
                        <div className="absolute inset-3 rounded-full bg-gradient-to-tl from-[#7a5416] to-[#c29643] shadow-inner flex flex-col items-center justify-center text-center">
                          <span className="font-headline-sm text-headline-sm italic text-tertiary-fixed drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] leading-none mb-0.5">Р &amp; А</span>
                          <span className="font-label-sm text-[9px] uppercase tracking-widest text-tertiary-fixed drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">24.10.2026</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Prompt Caption */}
                <div className="mt-space-lg text-center transition-opacity duration-500">
                  {!isOpen ? (
                    <p className="font-label-md text-label-md tracking-[0.2em] uppercase text-tertiary-fixed flex items-center justify-center gap-2">
                      <span>✦</span>
                      <span>Нажмите на сургучную печать, чтобы открыть приглашение</span>
                      <span>✦</span>
                    </p>
                  ) : (
                    <span className="font-headline-sm text-headline-sm italic text-tertiary-fixed-dim">
                      Мы будем искренне счастливы видеть Вас!
                    </span>
                  )}
                </div>
              </div>

              {/* Heritage Bottom Crest Details */}
              <div className="relative z-10 mt-space-xl flex flex-col items-center text-center opacity-70">
                <p className="font-label-sm text-label-sm uppercase tracking-[0.3em] text-on-tertiary-container">
                  Паркентские Предгорья • Узбекистан
                </p>
              </div>
            </section>
          </div>
        </main>
      );
    }

    // Comprehensive Wedding Details Component (Used by Место и программа, Дресс-код, and RSVP routes)
    function WeddingDetailsSuite({ initialSection = "top" }) {
      const [timeLeft, setTimeLeft] = useState({ days: 26, hours: 15, minutes: 53, seconds: 56 });
      const [isSubmitted, setIsSubmitted] = useState(false);

      const [submitError, setSubmitError] = useState("");
      const [formData, setFormData] = useState({
        name: "",
        attendance: "attending",
        transfer: "yes",
        overnight: "",
        drinks: ["wine"],
        wishes: ""
      });

      // Countdown to 24 October 2026 14:00 (Tashkent Time UTC+5)
      useEffect(() => {
        const targetDate = new Date('2026-10-24T14:00:00+05:00').getTime();

        const updateCountdown = () => {
          const now = new Date().getTime();
          const difference = targetDate - now;

          if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            setTimeLeft({ days, hours, minutes, seconds });
          } else { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); }
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
        return () => clearInterval(timer);
      }, []);

      // Auto scroll to target section if provided
      useEffect(() => {
        if (initialSection && initialSection !== "top") {
          const el = document.getElementById(initialSection);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, [initialSection]);

      const handleDrinkToggle = (drink) => {
        setFormData(prev => {
          const exists = prev.drinks.includes(drink);
          if (exists) {
            return { ...prev, drinks: prev.drinks.filter(d => d !== drink) };
          } else {
            return { ...prev, drinks: [...prev.drinks, drink] };
          }
        });
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim()) { setSubmitError('Укажите ваше имя.'); return; }
        setSubmitError('');
        setIsSubmitted(true);
        window.open(telegramRsvpUrl(formData), '_blank', 'noopener,noreferrer');
      };

      return (
        <main className="w-full pt-20 bg-surface min-h-[calc(100vh-80px)]">
          <div className="flex flex-col w-full">
            {/* HERO SECTION: HEIRLOOM STATIONERY SUITE */}
            <section className="relative w-full py-space-xl px-4 sm:px-margin flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary-container/10 blur-3xl pointer-events-none"></div>
              <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-tertiary-container/10 blur-3xl pointer-events-none"></div>

              <div className="relative w-full max-w-[880px] bg-surface-container-lowest shadow-2xl rounded-sm p-6 sm:p-12 md:p-16 flex flex-col items-center text-center">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-16 sm:w-24 h-px bg-on-tertiary-container/40"></div>
                  <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-tertiary-container shadow-md">
                    <span className="font-headline-sm text-headline-sm italic">Р&amp;А</span>
                  </div>
                  <div className="w-16 sm:w-24 h-px bg-on-tertiary-container/40"></div>
                </div>

                <p className="font-label-sm text-label-sm uppercase text-on-tertiary-container mb-3 tracking-widest">
                  Вместе с нашими родителями
                </p>

                <h1 className="font-display-lg text-display-lg sm:text-[68px] sm:leading-[76px] text-primary italic font-normal mb-4">
                  Руслан &amp; Амалия
                </h1>

                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed mb-8">
                  Приглашаем вас разделить радость священного союза и отпраздновать день нашей свадьбы среди благословенных предгорий Паркента.
                </p>

                {/* Date Badge */}
                <div className="wedding-date inline-flex items-center gap-6 py-3 px-8 bg-surface-container-low rounded-sm mb-10 shadow-sm">
                  <span className="font-label-md text-label-md uppercase text-secondary">Суббота</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span>
                  <span className="font-headline-md text-headline-md text-primary font-medium tracking-wide">24 Октября 2026</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span>
                  <span className="font-label-md text-label-md uppercase text-secondary">14:00</span>
                </div>

                {/* Live Countdown Widget */}
                <div className="wedding-countdown w-full max-w-lg bg-surface-container/60 rounded-sm p-6 shadow-inner mb-6">
                  <p className="font-label-sm text-label-sm uppercase text-on-surface-variant mb-4 tracking-widest">
                    До заветного дня осталось:
                  </p>
                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div className="flex flex-col items-center bg-surface-container-lowest p-3 rounded-sm shadow-sm">
                      <span className="font-headline-lg text-headline-lg text-primary font-normal">{String(timeLeft.days).padStart(2, '0')}</span>
                      <span className="font-label-sm text-label-sm uppercase text-secondary mt-1">Дней</span>
                    </div>
                    <div className="flex flex-col items-center bg-surface-container-lowest p-3 rounded-sm shadow-sm">
                      <span className="font-headline-lg text-headline-lg text-primary font-normal">{String(timeLeft.hours).padStart(2, '0')}</span>
                      <span className="font-label-sm text-label-sm uppercase text-secondary mt-1">Часов</span>
                    </div>
                    <div className="flex flex-col items-center bg-surface-container-lowest p-3 rounded-sm shadow-sm">
                      <span className="font-headline-lg text-headline-lg text-primary font-normal">{String(timeLeft.minutes).padStart(2, '0')}</span>
                      <span className="font-label-sm text-label-sm uppercase text-secondary mt-1">Минут</span>
                    </div>
                    <div className="flex flex-col items-center bg-surface-container-lowest p-3 rounded-sm shadow-sm">
                      <span className="font-headline-lg text-headline-lg text-primary font-normal">{String(timeLeft.seconds).padStart(2, '0')}</span>
                      <span className="font-label-sm text-label-sm uppercase text-secondary mt-1">Секунд</span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
                  <a
                    className="px-8 py-3.5 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest rounded-sm shadow hover:bg-primary-container transition-all"
                    href="#/rsvp"
                  >
                    Подтвердить Присутствие
                  </a>
                  <a
                    className="px-8 py-3.5 bg-surface-container-high text-primary font-label-md text-label-md uppercase tracking-widest rounded-sm hover:bg-surface-variant transition-all"
                    href="#/the-venue-and-itinerary"
                  >
                    Локация &amp; Маршрут
                  </a>
                </div>
              </div>
            </section>

            {/* SECTION 2: THE VENUE & LOGISTICS */}
            <section className="w-full py-space-xl bg-surface-container-low px-4 sm:px-margin" id="venue">
              <div className="max-w-[1120px] mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-tertiary-container block mb-2">Место Проведения</span>
                  <h2 className="font-headline-xl text-headline-xl text-primary mb-4 italic">Комплекс «Лотос»</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Оазис безмятежности среди величественных гор Паркента и Красногорска. Прохладный вечерний бриз, вековые сады и панорамный вид на осенние вершины Узбекистана.
                  </p>
                </div>

                {/* Bento Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
                  <div className="lg:col-span-7 flex flex-col justify-between bg-surface-container-lowest p-8 sm:p-10 rounded-sm shadow-md relative overflow-hidden">
                    <div>
                      <div className="flex items-center gap-3 text-secondary mb-4">
                        <span className="material-symbols-outlined text-[20px]">landscape</span>
                        <span className="font-label-md text-label-md uppercase tracking-widest">Атмосфера предгорий</span>
                      </div>
                      <h3 className="font-headline-md text-headline-md text-primary mb-4 font-normal">
                        Благословенный Паркентский край
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-6">
                        Комплекс «Лотос» объединяет живописный террасный парк с зеркальными фонтанами, просторный банкетный шатер из шелка и дерева, а также панорамную террасу, где на закате мы обменяемся нашими обетами.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 bg-surface-container-low/50 -mx-8 -mb-8 sm:-mx-10 sm:-mb-10 p-6">
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-on-tertiary-container text-[22px] mt-0.5">air</span>
                        <div>
                          <h4 className="font-label-md text-label-md uppercase text-primary mb-1">Горный микроклимат</h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">Свежий воздух и комфортная температура даже в вечерние часы.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-on-tertiary-container text-[22px] mt-0.5">wb_twilight</span>
                        <div>
                          <h4 className="font-label-md text-label-md uppercase text-primary mb-1">Золотой закат</h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">Церемония начнется в самые живописные закатные минуты.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Venue Location Map */}
                  <div className="lg:col-span-5 flex flex-col bg-surface-container-lowest rounded-sm shadow-md overflow-hidden">
                    <div
                      className="w-full h-64 bg-cover bg-center"
                      data-location="Lotos Complex, Parkent, Uzbekistan"
                      style={{ backgroundImage: "url('./reference-1.png')" }}
                    ></div>
                    <div className="p-6 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex items-center gap-2 text-on-tertiary-container mb-2">
                          <span className="material-symbols-outlined text-[18px]">location_on</span>
                          <span className="font-label-sm text-label-sm uppercase tracking-widest">Адрес</span>
                        </div>
                        <h4 className="font-headline-sm text-headline-sm text-primary mb-2">Паркентский район, пос. Красногорск</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                          Комплекс «Лотос», Ташкентская область, Узбекистан. 45 минут от центра столицы.
                        </p>
                      </div>
                      <a
                        className="inline-flex items-center justify-center gap-2 w-full py-3 bg-surface-container-high text-primary hover:bg-surface-variant font-label-sm text-label-sm uppercase tracking-wider rounded-sm transition-all"
                        href="https://www.google.com/maps/search/?api=1&query=Лотос+Красногорск+Паркент+Узбекистан"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <span>Открыть в Google Maps</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Transportation & Valet Services Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="transport-card bg-surface-container-lowest p-8 rounded-sm shadow-sm flex items-start gap-5">
                    <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px]">directions_bus</span>
                    </div>
                    <div>
                      <span className="font-label-sm text-label-sm uppercase text-secondary tracking-widest block mb-1">Комфорт гостей</span>
                      <h4 className="font-headline-sm text-headline-sm text-primary mb-2">Организованный трансфер</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-3">
                        Для вашего спокойствия и беззаботного отдыха организован комфортабельный трансфер в Ташкент после завершения торжества в вечернее время.
                      </p>
                      <div className="flex items-center gap-2 text-on-tertiary-container font-label-sm text-label-sm uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        <span>Вечерний выезд: по окончании банкета</span>
                      </div>
                    </div>
                  </div>

                  <div className="transport-card bg-surface-container-lowest p-8 rounded-sm shadow-sm flex items-start gap-5">
                    <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px]">local_parking</span>
                    </div>
                    <div>
                      <span className="font-label-sm text-label-sm uppercase text-secondary tracking-widest block mb-1">Личный транспорт</span>
                      <h4 className="font-headline-sm text-headline-sm text-primary mb-2">Охраняемая парковка</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-3">
                        Для гостей, прибывающих на личном автомобиле, на территории комплекса предусмотрена просторная, охраняемая и удобная парковочная зона.
                      </p>
                      <div className="flex items-center gap-2 text-secondary font-label-sm text-label-sm uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        <span>Охраняемая территория комплекса</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 3: ITINERARY / TIMELINE */}
            <section className="w-full py-space-xl px-4 sm:px-margin" id="itinerary">
              <div className="max-w-[800px] mx-auto flex flex-col items-center">
                <div className="text-center mb-16">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-tertiary-container block mb-2">Праздничный день</span>
                  <h2 className="font-headline-xl text-headline-xl text-primary italic mb-3">Программа Торжества</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
                    Каждое мгновение этого дня наполнено любовью, теплом и незабываемыми эмоциями.
                  </p>
                </div>

                {/* Timeline */}
                <div className="relative w-full flex flex-col">
                  <div className="absolute left-6 sm:left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-on-tertiary-container/30 pointer-events-none"></div>

                  {/* Event 1 */}
                  <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 w-full group">
                    <div className="sm:w-[42%] sm:text-right pl-14 sm:pl-0 mb-2 sm:mb-0">
                      <span className="font-label-sm text-label-sm uppercase text-on-tertiary-container tracking-widest block mb-1">14:00</span>
                      <h4 className="font-headline-sm text-headline-sm text-primary mb-1">Сбор гостей &amp; Welcome Cocktail</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        Легкий аперитив и прохладительные коктейли в цветущем саду, приятные знакомства, теплое общение и живописные фотозоны.
                      </p>
                    </div>
                    <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-surface-container-lowest shadow-md flex items-center justify-center text-primary z-10 group-hover:bg-primary group-hover:text-on-primary transition-all">
                      <span className="material-symbols-outlined text-[16px]">glass_cup</span>
                    </div>
                    <div className="sm:w-[42%] hidden sm:block"></div>
                  </div>

                  {/* Event 2 */}
                  <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 w-full group">
                    <div className="sm:w-[42%] hidden sm:block"></div>
                    <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-surface-container-lowest shadow-md flex items-center justify-center text-primary z-10 group-hover:bg-primary group-hover:text-on-primary transition-all">
                      <span className="material-symbols-outlined text-[16px]">favorite</span>
                    </div>
                    <div className="sm:w-[42%] pl-14 sm:pl-0">
                      <span className="font-label-sm text-label-sm uppercase text-on-tertiary-container tracking-widest block mb-1">15:00</span>
                      <h4 className="font-headline-sm text-headline-sm text-primary mb-1">Торжественная Церемония</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        Трогательное таинство и соединение любящих сердец в лучах предгорного солнца с панорамным видом на горные вершины.
                      </p>
                    </div>
                  </div>

                  {/* Event 3 */}
                  <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 w-full group">
                    <div className="sm:w-[42%] sm:text-right pl-14 sm:pl-0 mb-2 sm:mb-0">
                      <span className="font-label-sm text-label-sm uppercase text-on-tertiary-container tracking-widest block mb-1">17:30</span>
                      <h4 className="font-headline-sm text-headline-sm text-primary mb-1">Фотосессия &amp; Поздравления</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        Памятные фотографии с молодоженами в живописных фото-зонах и искренние пожелания родных и близких.
                      </p>
                    </div>
                    <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-surface-container-lowest shadow-md flex items-center justify-center text-primary z-10 group-hover:bg-primary group-hover:text-on-primary transition-all">
                      <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                    </div>
                    <div className="sm:w-[42%] hidden sm:block"></div>
                  </div>

                  {/* Event 4 */}
                  <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 w-full group">
                    <div className="sm:w-[42%] hidden sm:block"></div>
                    <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-surface-container-lowest shadow-md flex items-center justify-center text-primary z-10 group-hover:bg-primary group-hover:text-on-primary transition-all">
                      <span className="material-symbols-outlined text-[16px]">restaurant</span>
                    </div>
                    <div className="sm:w-[42%] pl-14 sm:pl-0">
                      <span className="font-label-sm text-label-sm uppercase text-on-tertiary-container tracking-widest block mb-1">18:30</span>
                      <h4 className="font-headline-sm text-headline-sm text-primary mb-1">Свадебный Гала-Банкет</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        Праздничный ужин, увлекательные конкурсы, праздничная музыкальная программа, душевные тосты и зажигательные танцы.
                      </p>
                    </div>
                  </div>

                  {/* Event 5 */}
                  <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between w-full group">
                    <div className="sm:w-[42%] sm:text-right pl-14 sm:pl-0 mb-2 sm:mb-0">
                      <span className="font-label-sm text-label-sm uppercase text-on-tertiary-container tracking-widest block mb-1">21:30</span>
                      <h4 className="font-headline-sm text-headline-sm text-primary mb-1">Свадебный Торт</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        Первый танец молодоженов под звездами и торжественное разрезание праздничного свадебного торта.
                      </p>
                    </div>
                    <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-on-primary shadow-md flex items-center justify-center z-10">
                      <span className="material-symbols-outlined text-[16px]">celebration</span>
                    </div>
                    <div className="sm:w-[42%] hidden sm:block"></div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 4: DRESS CODE & PALETTE */}
            <section className="w-full py-space-xl bg-surface-container-high px-4 sm:px-margin" id="dress-code">
              <div className="max-w-[960px] mx-auto flex flex-col items-center">
                <div className="text-center max-w-xl mb-12">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-tertiary-container block mb-2">Стиль Торжества</span>
                  <h2 className="font-headline-xl text-headline-xl text-primary italic mb-3">Дресс-код: Black Tie &amp; Cocktail Formal</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Мы будем искренне признательны, если в вашем праздничном образе будет хотя бы одна гармоничная деталь, элемент одежды или акцентный аксессуар в предложенной благородной палитре.
                  </p>
                </div>

                {/* Color Swatches Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mb-12">
                  <div className="flex flex-col items-center bg-surface-container-lowest p-5 rounded-sm shadow-sm text-center">
                    <div className="w-16 h-16 rounded-full bg-primary-container shadow-inner mb-3"></div>
                    <span className="font-label-md text-label-md text-primary block">Глубокий Изумруд</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">Deep Emerald</span>
                  </div>
                  <div className="flex flex-col items-center bg-surface-container-lowest p-5 rounded-sm shadow-sm text-center">
                    <div className="w-16 h-16 rounded-full bg-secondary shadow-inner mb-3"></div>
                    <span className="font-label-md text-label-md text-primary block">Оливковый Шалфей</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">Muted Sage</span>
                  </div>
                  <div className="flex flex-col items-center bg-surface-container-lowest p-5 rounded-sm shadow-sm text-center">
                    <div className="w-16 h-16 rounded-full bg-tertiary shadow-inner mb-3"></div>
                    <span className="font-label-md text-label-md text-primary block">Темный Шоколад</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">Antique Walnut</span>
                  </div>
                  <div className="flex flex-col items-center bg-surface-container-lowest p-5 rounded-sm shadow-sm text-center">
                    <div className="w-16 h-16 rounded-full bg-on-tertiary-container shadow-inner mb-3"></div>
                    <span className="font-label-md text-label-md text-primary block">Сусальное Золото</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">Burnished Gold</span>
                  </div>
                </div>

                {/* Guidelines Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                  <div className="bg-surface-container-lowest p-8 rounded-sm shadow-sm">
                    <div className="flex items-center gap-3 mb-4 text-primary">
                      <span className="material-symbols-outlined text-[24px]">man</span>
                      <h4 className="font-headline-sm text-headline-sm">Для Джентльменов</h4>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      Строгий смокинг вовсе не обязателен — вы можете выбрать костюм, блейзер или нарядный образ, в котором чувствуете себя легко, уверенно и свободно. Акцентный галстук, платок-паше или жилет в оттенках палитры будут прекрасным штрихом.
                    </p>
                  </div>
                  <div className="bg-surface-container-lowest p-8 rounded-sm shadow-sm">
                    <div className="flex items-center gap-3 mb-4 text-primary">
                      <span className="material-symbols-outlined text-[24px]">ac_unit</span>
                      <h4 className="font-headline-sm text-headline-sm">Забота о тепле &amp; Вечерний уют</h4>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      С наступлением заката в предгорьях разливается бодрящая вечерняя прохлада. Пожалуйста, обязательно возьмите с собой удобную теплую верхнюю одежду, палантин или пальто — особенно если планируете остаться с нами на ночь под звездным небом.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 5: RSVP POCKET ENVELOPE FORM */}
            <section className="w-full py-space-xl px-4 sm:px-margin flex flex-col items-center justify-center" id="rsvp">
              <div className="w-full max-w-[840px] bg-surface-container-lowest rounded-sm shadow-2xl p-6 sm:p-12 md:p-16 relative">
                <div className="text-center mb-10">
                  <div className="w-12 h-12 rounded-full bg-surface-container mx-auto flex items-center justify-center text-on-tertiary-container mb-4 shadow-sm">
                    <span className="material-symbols-outlined text-[24px]">mail</span>
                  </div>
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-tertiary-container block mb-2">Ответить на приглашение</span>
                  <h2 className="font-headline-xl text-headline-xl text-primary italic mb-3">Подтверждение Присутствия</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mx-auto">
                    Пожалуйста, подтвердите ваше присутствие до <strong className="text-primary font-medium">3 октября 2026 года</strong>, чтобы мы могли позаботиться о каждой детали вашего пребывания.
                  </p>
                </div>

                {/* Form */}
                <form className="space-y-8" onSubmit={handleSubmit}>
                  {/* Guest Full Name */}
                  <div className="flex flex-col space-y-2">
                    <label className="font-label-sm text-label-sm uppercase tracking-wider text-primary" htmlFor="guest-name">
                      Ваше Имя и Фамилия <span className="text-error">*</span>
                    </label>
                    <input
                      className="w-full py-3 px-4 bg-surface-container-low rounded-sm font-body-md text-body-md text-on-surface placeholder:italic placeholder:text-on-surface-variant/50 focus:outline-none focus:bg-surface-container-high transition-colors"
                      id="guest-name" maxLength={120} autoComplete="name"
                      placeholder="Например: Камиль и Динара Ахмедовы"
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  {/* Attendance Decision */}
                  <div className="flex flex-col space-y-3">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary">
                      Планируете ли вы разделить этот праздник с нами? <span className="text-error">*</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className={`flex items-center gap-3 p-4 rounded-sm cursor-pointer transition-colors ${formData.attendance === 'attending' ? 'bg-surface-container-high border border-primary/20' : 'bg-surface-container-low hover:bg-surface-container'}`}>
                        <input
                          className="accent-primary w-4 h-4 cursor-pointer"
                          name="attendance"
                          type="radio"
                          value="attending"
                          checked={formData.attendance === 'attending'}
                          onChange={() => setFormData({ ...formData, attendance: 'attending' })}
                        />
                        <span className="font-body-md text-body-md text-on-surface">С радостью приду!</span>
                      </label>
                      <label className={`flex items-center gap-3 p-4 rounded-sm cursor-pointer transition-colors ${formData.attendance === 'declined' ? 'bg-surface-container-high border border-primary/20' : 'bg-surface-container-low hover:bg-surface-container'}`}>
                        <input
                          className="accent-primary w-4 h-4 cursor-pointer"
                          name="attendance"
                          type="radio"
                          value="declined"
                          checked={formData.attendance === 'declined'}
                          onChange={() => setFormData({ ...formData, attendance: 'declined' })}
                        />
                        <span className="font-body-md text-body-md text-on-surface">К сожалению, не смогу</span>
                      </label>
                    </div>
                  </div>

                  {/* Transfer */}
                  <div>
                    <div className="flex flex-col space-y-2">
                      <label className="font-label-sm text-label-sm uppercase tracking-wider text-primary" htmlFor="transfer-need">
                        Трансфер из Лотоса в Ташкент (только вечерний отъезд)
                      </label>
                      <select
                        className="w-full py-3 px-4 bg-surface-container-low rounded-sm font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-high transition-colors"
                        id="transfer-need"
                        value={formData.transfer}
                        onChange={(e) => setFormData({ ...formData, transfer: e.target.value })}
                      >
                        <option value="yes">Да, нужен трансфер</option>
                        <option value="no">Доберусь самостоятельно</option>
                      </select>
                    </div>
                  </div>

                  {formData.attendance === 'attending' && (
                    <fieldset className="space-y-3">
                      <legend className="font-label-sm text-label-sm uppercase tracking-wider text-primary">Планируете ли вы остаться на ночь? <span className="text-error">*</span></legend>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[{ value: 'yes', label: 'Да, останемся на ночь' }, { value: 'no', label: 'Нет, уедем вечером' }].map(option => (
                          <label key={option.value} className={`flex items-center gap-3 p-4 rounded-sm cursor-pointer transition-colors ${formData.overnight === option.value ? 'bg-surface-container-high border border-primary/20' : 'bg-surface-container-low hover:bg-surface-container'}`}>
                            <input type="radio" name="overnight" value={option.value} required checked={formData.overnight === option.value} onChange={() => setFormData({ ...formData, overnight: option.value })} className="accent-primary w-4 h-4" />
                            <span className="font-body-md text-body-md">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  )}

                  {/* Beverage Preferences */}
                  <div className="flex flex-col space-y-3">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary">
                      Предпочтения по напиткам
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { key: "wine", label: "Вино" },
                        { key: "vodka", label: "Водка" },
                        { key: "cognac", label: "Коньяк" },
                        { key: "non_alcoholic", label: "Не пью" },
                      ].map((drink) => (
                        <label
                          key={drink.key}
                          className={`flex items-center gap-2 p-3 rounded-sm cursor-pointer transition-colors ${formData.drinks.includes(drink.key) ? 'bg-surface-container-high border border-primary/20' : 'bg-surface-container-low hover:bg-surface-container'}`}
                        >
                          <input
                            className="accent-primary rounded-sm w-4 h-4 cursor-pointer"
                            name="drink"
                            type="checkbox"
                            checked={formData.drinks.includes(drink.key)}
                            onChange={() => handleDrinkToggle(drink.key)}
                          />
                          <span className="font-body-sm text-body-sm text-on-surface">{drink.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Wishes and Song Request */}
                  <div className="flex flex-col space-y-2">
                    <label className="font-label-sm text-label-sm uppercase tracking-wider text-primary" htmlFor="guest-wishes">
                      Пожелания молодоженам или любимая композиция для плейлиста
                    </label>
                    <textarea
                      className="w-full py-3 px-4 bg-surface-container-low rounded-sm font-body-md text-body-md text-on-surface placeholder:italic placeholder:text-on-surface-variant/50 focus:outline-none focus:bg-surface-container-high transition-colors"
                      id="guest-wishes" maxLength={1000}
                      placeholder="Оставьте ваши теплые слова или песню, под которую вы захотите танцевать..."
                      rows="3"
                      value={formData.wishes}
                      onChange={(e) => setFormData({ ...formData, wishes: e.target.value })}
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 flex flex-col items-center">
                    <button
                      className={`w-full sm:w-auto px-12 py-4 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest rounded-sm shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-3 cursor-pointer ${
                        isSubmitted ? 'opacity-75' : ''
                      }`}
                      type="submit"

                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {isSubmitted ? 'check_circle' : 'drafts'}
                      </span>
                      <span>{isSubmitted ? 'Открыть Telegram ещё раз' : 'Ответить в Telegram'}</span>
                    </button>

                    {submitError && <p role="alert" className="mt-4 text-center text-error">{submitError}</p>}
                    {isSubmitted && <div className="w-full mt-4"><label htmlFor="message-preview" className="block mb-2">Ваше сообщение</label><textarea id="message-preview" readOnly rows={8} className="w-full p-4 bg-surface-container-low" value={buildRsvpMessage(formData)} /><p className="mt-2 text-center">Если текст не появился в Telegram, скопируйте его из поля выше.</p><a className="block text-center underline mt-2" href={telegramRsvpUrl(formData)} target="_blank" rel="noopener noreferrer">Открыть чат с Амалией</a></div>}
                    {isSubmitted && (
                      <p className="font-body-sm text-body-sm text-secondary mt-3 text-center">
                        Сообщение подготовлено. Нажмите «Отправить» в чате с Амалией в Telegram.
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </section>

            {/* SECTION 6: WEDDING COORDINATOR & WARM WISHES */}
            <section className="w-full py-space-xl bg-surface-container-high px-4 sm:px-margin">
              <div className="max-w-[760px] mx-auto text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center mb-6 shadow-sm">
                  <span className="material-symbols-outlined text-[28px]">support_agent</span>
                </div>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-tertiary-container block mb-2">Забота о гостях</span>
                <h3 className="font-headline-lg text-headline-lg text-primary mb-4 italic">Свадебный Координатор</h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mb-8 leading-relaxed">
                  Если у вас возникли вопросы по поводу навигации, трансфера или размещения, наш свадебный распорядитель с радостью поможет вам в любое время:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
                  <a className="flex items-center gap-3 bg-surface-container-lowest py-3 px-6 rounded-sm shadow-sm hover:bg-surface-container transition-colors" href="tel:+998887006750">
                    <span className="material-symbols-outlined text-secondary text-[20px]">call</span>
                    <span className="font-label-md text-label-md text-primary">+998887006750</span>
                  </a>
                  <a className="flex items-center gap-3 bg-surface-container-lowest py-3 px-6 rounded-sm shadow-sm hover:bg-surface-container transition-colors" href="https://t.me/u_amaliya" rel="noopener noreferrer" target="_blank">
                    <span className="material-symbols-outlined text-secondary text-[20px]">send</span>
                    <span className="font-label-md text-label-md text-primary">@u_amaliya</span>
                  </a>
                </div>
                <div className="w-24 h-px bg-on-tertiary-container/40 mb-8"></div>
                <p className="font-headline-sm text-headline-sm text-primary italic mb-2">
                  «С нетерпением ждем встречи с вами!»
                </p>
                <p className="font-label-lg text-label-lg uppercase tracking-widest text-on-tertiary-container">
                  С любовью, Руслан &amp; Амалия
                </p>
              </div>
            </section>
          </div>
        </main>
      );
    }

    // Story Page
    function StoryPage() {
      return (
        <main className="w-full pt-20 bg-surface min-h-[calc(100vh-80px)]">
          <div className="max-w-[880px] mx-auto py-space-xl px-4 sm:px-margin text-center">
            <div className="w-16 h-16 rounded-full bg-surface-container mx-auto flex items-center justify-center text-primary mb-6 shadow-sm">
              <span className="material-symbols-outlined text-[32px]">auto_stories</span>
            </div>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-tertiary-container block mb-3">
              История Нашей Любви
            </span>
            <h1 className="font-headline-xl text-headline-xl text-primary italic mb-8">
              Как начиналась наша сказка
            </h1>
            <div className="bg-surface-container-lowest p-8 sm:p-12 rounded-sm shadow-xl text-left space-y-6">
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                С первой встречи среди залитых солнцем улочек древнего Ташкента до тихих прогулок под звездным небом Паркентских предгорий — каждый день приближал нас к этому сокровенному торжеству.
              </p>
              <div className="w-16 h-px bg-on-tertiary-container/40 my-6"></div>
              <p className="font-body-md text-body-md text-on-surface leading-relaxed italic">
                «Любовь — это когда в глазах другого ты находишь свой дом и бесконечный покой».
              </p>
              <div className="flex justify-center pt-4">
                <Link
                  to="/the-venue-and-itinerary"
                  className="px-8 py-3.5 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest rounded-sm hover:bg-primary-container transition-all"
                >
                  Перейти к программе торжества
                </Link>
              </div>
            </div>
          </div>
        </main>
      );
    }

    // Main App Component with State & Routes
    function App() {
      const [isMusicPlaying, setIsMusicPlaying] = useState(false);
      const audioRef = useRef(null);

      const toggleMusic = () => {
        if (!audioRef.current) audioRef.current = new Audio(import.meta.env.VITE_MUSIC_URL || './ambience.wav');
        const audio = audioRef.current;
        audio.loop = true;
        audio.volume = 0.25;
        if (isMusicPlaying) { audio.pause(); setIsMusicPlaying(false); }
        else { audio.play().then(() => setIsMusicPlaying(true)).catch(() => setIsMusicPlaying(false)); }
      };

      return (
        <div className="min-h-screen flex flex-col justify-between">
          <Header isMusicPlaying={isMusicPlaying} toggleMusic={toggleMusic} />

          <Routes>
            <Route path="/" element={<EnvelopeInvitationPage isMusicPlaying={isMusicPlaying} toggleMusic={toggleMusic} />} />
            <Route path="/the-invitation" element={<EnvelopeInvitationPage isMusicPlaying={isMusicPlaying} toggleMusic={toggleMusic} />} />
            <Route path="/celebration" element={<WeddingDetailsSuite initialSection="top" />} />
            <Route path="/our-story" element={<StoryPage />} />
            <Route path="/the-venue-and-itinerary" element={<WeddingDetailsSuite initialSection="venue" />} />
            <Route path="/dress-code" element={<WeddingDetailsSuite initialSection="dress-code" />} />
            <Route path="/rsvp" element={<WeddingDetailsSuite initialSection="rsvp" />} />
            <Route path="*" element={<WeddingDetailsSuite initialSection="top" />} />
          </Routes>

          <Footer />
        </div>
      );
    }

    // Root initialization with MemoryRouter
    const container = document.getElementById('root');
    const root = createRoot(container);
    root.render(
      <HashRouter>
        <App />
      </HashRouter>
    );
