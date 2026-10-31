import React, { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  Sparkles, 
  Utensils, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  Activity, 
  Award, 
  Footprints, 
  Droplets, 
  Share2, 
  FileText, 
  Clock, 
  Eye, 
  Camera,
  Menu,
  X,
  Play
} from 'lucide-react';
import { ODI_DATA, calculateCatAge } from './data/catData';
import { CertificateModal } from './components/CertificateModal';

export const App: React.FC = () => {
  const [purrCount, setPurrCount] = useState<number>(42);
  const [isPurring, setIsPurring] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [isCertOpen, setIsCertOpen] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const heroImageRef = useRef<HTMLDivElement>(null);
  const floatingPawsRef = useRef<HTMLDivElement>(null);

  const ageData = calculateCatAge(ODI_DATA.dob);

  // Anime.js animations
  useEffect(() => {
    // Hero floating effect
    animate('.animate-hero-float', {
      translateY: [-6, 6],
      alternate: true,
      loop: true,
      ease: 'inOutSine',
      duration: 3400,
    });

    // Badge pulse
    animate('.pulse-badge', {
      scale: [1, 1.04, 1],
      loop: true,
      ease: 'inOutQuad',
      duration: 2600,
    });

    // Floating paw prints
    animate('.floating-paw', {
      translateY: [-10, 10],
      translateX: [-6, 6],
      rotate: [-10, 10],
      alternate: true,
      loop: true,
      ease: 'inOutQuad',
      duration: 3600,
    });
  }, []);

  const handlePetCat = (e: React.MouseEvent) => {
    setPurrCount((prev: number) => prev + 1);
    setIsPurring(true);
    setTimeout(() => setIsPurring(false), 900);

    // Anime.js click pop effect
    animate('.pet-heart-btn', {
      scale: [1, 1.25, 1],
      duration: 400,
      ease: 'outElastic(1, .5)',
    });

    // Confetti burst
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 26,
      spread: 55,
      origin: { x, y },
      colors: ['#334155', '#f59e0b', '#fbbf24', '#94a3b8', '#0f172a'],
      shapes: ['circle'],
      scalar: 0.85,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Meet Odi the Kitten!",
        text: "Check out Odi's official landing page - Turkish Angora & Persian smoke gray kitten!",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden font-sans bg-[#F8FAFC] text-slate-900 selection:bg-amber-200 selection:text-amber-950">
      
      {/* Decorative subtle ambient warm gradients */}
      <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 rounded-full blur-3xl pointer-events-none -z-0 bg-amber-100/60" />
      <div className="absolute top-1/3 right-4 w-72 sm:w-96 h-72 sm:h-96 rounded-full blur-3xl pointer-events-none -z-0 bg-slate-200/50" />
      <div className="absolute bottom-10 left-4 w-72 sm:w-96 h-72 sm:h-96 rounded-full blur-3xl pointer-events-none -z-0 bg-amber-100/50" />

      {/* Floating Paw Prints */}
      <div ref={floatingPawsRef} className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-0">
        <span className="floating-paw absolute top-16 left-4 text-3xl sm:text-4xl opacity-15">🐾</span>
        <span className="floating-paw absolute top-40 right-6 text-2xl sm:text-3xl opacity-10">🐾</span>
        <span className="floating-paw absolute top-[45%] left-4 text-3xl sm:text-5xl opacity-10">🐾</span>
        <span className="floating-paw absolute top-[65%] right-8 text-3xl sm:text-4xl opacity-15">🐾</span>
        <span className="floating-paw absolute top-[85%] left-1/4 text-2xl sm:text-3xl opacity-10">🐾</span>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center shadow-md text-slate-950 font-bold text-lg shrink-0">
              🐾
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl sm:text-2xl tracking-tight font-display text-slate-900 leading-none">
                Odi
              </span>
              <span className="text-amber-800 text-xs font-bold bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                Smoke Boy
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-bold text-slate-700">
            <a href="#about" className="hover:text-amber-600 transition-colors">About</a>
            <a href="#pedigree" className="hover:text-amber-600 transition-colors">Pedigree</a>
            <a href="#diet" className="hover:text-amber-600 transition-colors">Nutrition</a>
            <a href="#health" className="hover:text-amber-600 transition-colors">Health & Training</a>
            <a href="#gallery" className="hover:text-amber-600 transition-colors">Moments & Video</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* Download Certificate Header Button (Desktop) */}
            <button
              onClick={() => setIsCertOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              <span>Certificate</span>
            </button>

            {/* Share Button (Desktop) */}
            <button
              onClick={handleShare}
              className="hidden sm:flex p-2 rounded-xl transition-all text-xs items-center gap-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              title="Share Odi's page"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Pet Cat Button */}
            <button
              onClick={handlePetCat}
              className="pet-heart-btn flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs sm:text-sm font-black px-4 py-2 rounded-xl shadow-md shadow-amber-500/20 transition-all transform active:scale-95 cursor-pointer shrink-0"
            >
              <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isPurring ? 'fill-slate-950 animate-ping' : 'fill-slate-950'}`} />
              <span>Pet ({purrCount})</span>
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl transition-all border border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 py-3 space-y-2 text-sm font-bold shadow-xl border-b border-slate-200 bg-white text-slate-800">
            <a 
              href="#about" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-xl hover:bg-slate-100"
            >
              🎂 About & Age
            </a>
            <a 
              href="#pedigree" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-xl hover:bg-slate-100"
            >
              👑 Pedigree & Lineage
            </a>
            <a 
              href="#diet" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-xl hover:bg-slate-100"
            >
              🥣 Nutrition & Diet
            </a>
            <a 
              href="#health" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-xl hover:bg-slate-100"
            >
              🛡️ Health & Habits
            </a>
            <a 
              href="#gallery" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-xl hover:bg-slate-100"
            >
              📸 Real Life Moments & Video
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsCertOpen(true);
              }}
              className="w-full text-left py-2.5 px-3 rounded-xl bg-amber-50 text-amber-900 font-black flex items-center justify-between border border-amber-300"
            >
              <span>📜 Download PDF Certificate</span>
              <FileText className="w-4 h-4 text-amber-600" />
            </button>
          </div>
        )}
      </header>

      {/* Share Toast Notification */}
      {copiedNotification && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-sm border border-slate-700 max-w-[90vw]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">Link copied to clipboard!</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-6 pb-12 sm:pt-14 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headlines & Key Stats */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-black shadow-xs pulse-badge border bg-amber-100 border-amber-300 text-amber-950">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate">Turkish Angora × Persian • Smoke Gray Royalty</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight font-display leading-[1.1] text-slate-900">
              Hi, I’m <span className="text-amber-600">Odi</span>! 
              <span className="inline-block hover:rotate-12 transition-transform cursor-pointer ml-1 sm:ml-2">🐾</span>
            </h1>

            <p className="text-base sm:text-lg font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 text-slate-700">
              A gorgeous smoky-gray kitten with mesmerizing amber eyes and a chic bandana style. 
              Certified cuddle lover, explorer, and 100% litter & bath trained.
            </p>

            {/* Birthday & Live Age Milestone Box */}
            <div className="p-4 sm:p-5 rounded-2xl shadow-sm max-w-xl mx-auto lg:mx-0 bg-white border-2 border-slate-200">
              <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 text-center sm:text-left">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-2xl shrink-0">
                    🎂
                  </div>
                  <div>
                    <span className="text-[11px] font-black text-amber-700 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
                      <Clock className="w-3.5 h-3.5" /> Current Age Milestone
                    </span>
                    <h3 className="text-2xl font-black font-display text-slate-900 mt-0.5">
                      {ageData.headline}
                    </h3>
                  </div>
                </div>
                <div className="sm:text-right border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0 w-full sm:w-auto">
                  <span className="text-xs font-bold text-slate-500 block">
                    Born {ODI_DATA.dob}
                  </span>
                  <p className="text-xs text-amber-700 font-extrabold mt-0.5">{ageData.detail}</p>
                </div>
              </div>
            </div>

            {/* Quick Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-1 text-left">
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-xs">
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">Coat & Eyes</span>
                <p className="font-black text-sm mt-0.5 text-slate-900 truncate">Smoke Gray • Amber</p>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-xs">
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">Gender</span>
                <p className="font-black text-sm mt-0.5 text-slate-900">♂ Male Prince</p>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-xs col-span-2 sm:col-span-1">
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">Training</span>
                <p className="font-black text-emerald-700 text-sm mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Trained
                </p>
              </div>
            </div>

            {/* Hero CTA & Interactive Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={handlePetCat}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transform active:scale-95 transition-all text-base cursor-pointer"
              >
                <Heart className="w-5 h-5 fill-slate-950" />
                Give Odi a Cuddle
              </button>
              
              <button
                onClick={() => setIsCertOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold border-2 border-slate-300 bg-white text-slate-800 hover:bg-slate-50 shadow-sm flex items-center justify-center gap-2 transform active:scale-95 transition-all text-base cursor-pointer"
              >
                <FileText className="w-4 h-4 text-amber-500" />
                Download PDF Certificate
              </button>
            </div>

            {/* Micro Purr Indicator */}
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs pt-1 text-slate-600 font-semibold">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <span>Status: Snuggled on cozy blanket, purring happily</span>
            </div>
          </div>

          {/* Right Column: Hero Visual Card with Frame */}
          <div className="lg:col-span-5 relative flex justify-center mt-4 lg:mt-0">
            <div ref={heroImageRef} className="animate-hero-float relative w-full max-w-xs sm:max-w-md">
              {/* Back ambient ring */}
              <div className="absolute -inset-3 sm:-inset-4 bg-amber-200/50 rounded-[2rem] sm:rounded-[2.5rem] blur-xl opacity-60 animate-pulse-subtle -z-10" />

              {/* Main Photo Card */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
                <img
                  src="/odi-portrait.jpg"
                  alt="Odi the Turkish Angora and Persian Kitten"
                  className="w-full h-80 sm:h-[430px] object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />

                {/* Floating sticker overlay on the photo */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-slate-900/85 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md text-xs font-bold text-white border border-slate-700">
                  <span>🐾</span>
                  <span>Odi's Official Portrait</span>
                </div>

                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-slate-950/85 backdrop-blur-md text-white px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-semibold border border-slate-700">
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Amber Eyes</span>
                </div>
              </div>

              {/* Decorative mini card pinned to bottom-left */}
              <div className="absolute -bottom-4 -left-2 sm:-bottom-6 sm:-left-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl border border-slate-200 bg-white max-w-[170px] sm:max-w-[210px] flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0 text-base">
                  🐾
                </div>
                <div className="text-left">
                  <p className="text-[10px] sm:text-[11px] font-bold text-slate-500">Purr Meter</p>
                  <p className="text-xs sm:text-base font-black text-amber-600">{purrCount} Love Paws</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Birthday & Milestones Strip */}
      <section id="about" className="py-6 sm:py-8 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-center">
            
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 shadow-xs">
              <Calendar className="w-5 h-5 mx-auto text-amber-600 mb-1" />
              <p className="text-xs font-bold uppercase text-slate-500">Date of Birth</p>
              <p className="text-base font-black mt-0.5 text-slate-900">{ODI_DATA.dob}</p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 shadow-xs">
              <Clock className="w-5 h-5 mx-auto text-amber-600 mb-1" />
              <p className="text-xs font-bold uppercase text-slate-500">Current Age</p>
              <p className="text-base font-black text-amber-700 mt-0.5">{ageData.headline}</p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 shadow-xs">
              <ShieldCheck className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
              <p className="text-xs font-bold uppercase text-slate-500">Dewormed</p>
              <p className="text-base font-black text-emerald-700 mt-0.5">3x Complete</p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 shadow-xs">
              <Sparkles className="w-5 h-5 mx-auto text-amber-600 mb-1" />
              <p className="text-xs font-bold uppercase text-slate-500">Coat Color</p>
              <p className="text-base font-black mt-0.5 text-slate-900">Silky Smoke Gray</p>
            </div>

          </div>
        </div>
      </section>

      {/* Pedigree & Family Tree Section */}
      <section id="pedigree" className="py-12 sm:py-24 px-4 sm:px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-2 sm:space-y-3 mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border bg-amber-100 text-amber-950 border-amber-300">
              🐾 Family Lineage
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-display text-slate-900">
              Royal Pedigree & Lineage
            </h2>
            <p className="max-w-xl mx-auto text-xs sm:text-base font-medium text-slate-600">
              Odi combines the best feline genes: the silky elegance and curious charm of the Turkish Angora mixed with the lush tranquility of the Persian.
            </p>
          </div>

          {/* Interactive Pedigree Tree Layout */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              
              {/* Father Card */}
              <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-xl shadow-inner shrink-0">
                    👑
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-amber-700">
                      Father
                    </span>
                    <h3 className="text-xl font-black text-slate-900">{ODI_DATA.father}</h3>
                  </div>
                </div>
                <p className="text-sm leading-relaxed font-medium text-slate-600">
                  Purebred Persian ancestry giving Odi his sweet facial contours, calm composure, and thick plush coat texture.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>Heritage</span>
                  <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs border border-amber-300">
                    100% Persian
                  </span>
                </div>
              </div>

              {/* Mother Card */}
              <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xl shadow-inner shrink-0">
                    🌸
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-rose-700">
                      Mother
                    </span>
                    <h3 className="text-xl font-black text-slate-900">{ODI_DATA.mother}</h3>
                  </div>
                </div>
                <p className="text-sm leading-relaxed font-medium text-slate-600">
                  A beautiful hybrid mother bringing the legendary grace, luminous amber eyes, and active playful personality of the Turkish Angora.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>Heritage</span>
                  <span className="bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full text-xs border border-rose-300">
                    50% Angora • 50% Persian
                  </span>
                </div>
              </div>

            </div>

            {/* Center Connection Arrow */}
            <div className="my-5 flex flex-col items-center justify-center">
              <div className="w-0.5 h-5 bg-slate-300" />
              <div className="px-3.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] sm:text-xs tracking-wider uppercase shadow-md flex items-center gap-1">
                <span>🐾 Resulting In</span>
              </div>
              <div className="w-0.5 h-5 bg-slate-300" />
            </div>

            {/* Odi Crown Card */}
            <div className="p-6 sm:p-8 rounded-3xl border-2 border-amber-300 bg-white shadow-md text-center relative overflow-hidden">
              <div className="max-w-md mx-auto space-y-2">
                <span className="text-3xl">🐱</span>
                <h3 className="text-2xl sm:text-3xl font-black font-display text-slate-900">
                  Odi • Smoke Gray Angora / Persian
                </h3>
                <p className="text-sm leading-relaxed font-medium text-slate-600">
                  Combines stunning smoky fur, golden amber eyes, loving cuddliness, and gentle manners.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setIsCertOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-amber-700 hover:text-amber-800 underline underline-offset-4 cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    View official pedigree certification document
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nutrition & Diet Section */}
      <section id="diet" className="py-12 sm:py-24 px-4 sm:px-6 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-2 sm:space-y-3 mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border bg-amber-100 text-amber-950 border-amber-300">
              <Utensils className="w-3.5 h-3.5" /> Gourmet Kitty Menu
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-display text-slate-900">
              Odi’s Favorite Meals & Nutrition
            </h2>
            <p className="max-w-xl mx-auto text-xs sm:text-base font-medium text-slate-600">
              Carefully chosen meals to keep his smoke-gray fur silky, teeth healthy, and energy thriving!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
            {/* Dry Food Card */}
            <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-xs">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl font-bold shrink-0">
                  🥣
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Dry Kibbles</h3>
                  <span className="text-xs font-bold text-slate-500">
                    Everyday Crunch & Dental Support
                  </span>
                </div>
              </div>

              <div className="rounded-2xl p-4.5 border border-amber-200 bg-amber-50/70 flex items-start gap-3">
                <Award className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-base text-slate-900">{ODI_DATA.dryFood}</h4>
                  <p className="text-xs mt-1 leading-relaxed font-medium text-slate-700">
                    Specially formulated for growing kittens with essential calcium, DHA for brain function, and protein for lean muscle.
                  </p>
                </div>
              </div>
            </div>

            {/* Wet Food Feast Card */}
            <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-xs">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl font-bold shrink-0">
                  🐟
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Wet Food & Fresh Feasts</h3>
                  <span className="text-xs font-bold text-slate-500">
                    Hydration, Flavor & High Quality Protein
                  </span>
                </div>
              </div>

              <ul className="space-y-3">
                {ODI_DATA.wetFood.map((dish, i) => (
                  <li key={i} className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50">
                    <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xs shrink-0">
                      0{i + 1}
                    </span>
                    <span className="text-sm font-bold text-slate-900">{dish}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Health, Vitamins & Training Badges */}
      <section id="health" className="py-12 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-2 sm:space-y-3 mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border bg-emerald-100 text-emerald-900 border-emerald-300">
              <Activity className="w-3.5 h-3.5" /> Veterinary Records & Habits
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-display text-slate-900">
              Health, Wellness & Training
            </h2>
            <p className="max-w-xl mx-auto text-xs sm:text-base font-medium text-slate-600">
              A well-cared-for kitten with complete preventive care and exemplary civilized indoor habits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            
            {/* Vitamins & Supplements */}
            <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl mb-3 font-bold">
                  💊
                </div>
                <h3 className="text-lg font-black mb-1.5 text-slate-900">Vitamins & Supplements</h3>
                <p className="text-xs mb-3 font-medium text-slate-500">
                  Daily coat shine and immune defense support:
                </p>
                <div className="space-y-2">
                  {ODI_DATA.vitamins.map((vitamin, idx) => (
                    <div key={idx} className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border bg-amber-50 border-amber-200 text-amber-900">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{vitamin}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500">
                Guarantees coat lustre and smooth skin
              </div>
            </div>

            {/* Deworming Status */}
            <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl mb-3 font-bold">
                  🛡️
                </div>
                <h3 className="text-lg font-black mb-1.5 text-slate-900">Deworming Schedule</h3>
                <p className="text-xs mb-3 font-medium text-slate-500">
                  Complete veterinary prevention:
                </p>
                
                <div className="p-4 rounded-2xl text-center border bg-emerald-50 border-emerald-200">
                  <span className="text-4xl font-black text-emerald-700 font-display">
                    {ODI_DATA.dewormingCount}×
                  </span>
                  <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide mt-1">
                    Doses Administered
                  </p>
                  <p className="text-xs font-medium text-emerald-700 mt-1">Healthy, verified parasite-free</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500">
                100% up to date with feline care schedule
              </div>
            </div>

            {/* Training Achievements */}
            <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl mb-3 font-bold">
                  🎓
                </div>
                <h3 className="text-lg font-black mb-1.5 text-slate-900">Trained Behaviors</h3>
                <p className="text-xs mb-3 font-medium text-slate-500">
                  Well-mannered indoor prince:
                </p>
                
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl flex items-center justify-between border bg-emerald-50 border-emerald-200">
                    <div className="flex items-center gap-2">
                      <Footprints className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span className="text-xs font-bold text-slate-900">Litter Trained</span>
                    </div>
                    <span className="text-xs bg-emerald-700 text-white font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
                      ✅ 100%
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl flex items-center justify-between border bg-blue-50 border-blue-200">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-700 shrink-0" />
                      <span className="text-xs font-bold text-slate-900">Bath Trained</span>
                    </div>
                    <span className="text-xs bg-blue-700 text-white font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
                      ✅ Calm Boy
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500">
                Zero mess, patient during bath times
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Real Life Moments of Odi with Video Integration */}
      <section id="gallery" className="py-12 sm:py-24 px-4 sm:px-6 bg-slate-100/70 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center space-y-2 sm:space-y-3 mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border bg-amber-100 text-amber-950 border-amber-300">
              <Camera className="w-3.5 h-3.5 text-amber-600" /> Photo & Video Moments
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-display text-slate-900">
              Real Life Moments of Odi
            </h2>
            <p className="max-w-xl mx-auto text-xs sm:text-base font-medium text-slate-600">
              Watch Odi in live video action, cozy up in blankets, and see his everyday adventures!
            </p>
          </div>

          {/* Featured Video Player Card */}
          <div className="mb-8 sm:mb-12 rounded-3xl overflow-hidden border-2 border-amber-300 bg-white shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
              
              <div className="lg:col-span-8 bg-slate-950 relative aspect-video flex items-center justify-center">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full max-h-[460px] object-contain"
                  poster="/odi-portrait.jpg"
                >
                  <source src="/odi-video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="lg:col-span-4 p-6 sm:p-8 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs uppercase tracking-wider border border-amber-300">
                  <Play className="w-3 h-3 fill-amber-700 text-amber-700" /> Exclusive Video Clip
                </div>
                <h3 className="text-xl sm:text-2xl font-black font-display text-slate-900">
                  Odi Caught On Camera! 🐾
                </h3>
                <p className="text-sm leading-relaxed font-medium text-slate-600">
                  Experience the fluff in motion! Odi showing off his silky smoke gray coat, inquisitive amber gaze, and affectionate personality in this candid clip.
                </p>
                <div className="pt-2 border-t border-slate-200 text-xs font-bold text-slate-500 flex items-center gap-2">
                  <span>Format: 1080p Mobile Capture</span>
                  <span>•</span>
                  <span className="text-amber-700">HD Ready</span>
                </div>
              </div>

            </div>
          </div>

          {/* 3-Photo Showcase Compilation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Photo 1: Close-up Portrait with Bandana */}
            <div 
              onClick={() => setSelectedPhoto('/odi-portrait.jpg')}
              className="cursor-pointer group relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-md border-4 border-white bg-slate-900 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src="/odi-portrait.jpg"
                  alt="Odi close up portrait"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-4 sm:p-5 text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">The Signature Look</span>
                <h4 className="font-bold text-base mt-0.5">Bandana Gentleman</h4>
                <p className="text-xs text-slate-300 mt-1">Deep amber eyes & luscious smoky gray fur.</p>
              </div>
            </div>

            {/* Photo 2: Sleeping Bliss on Pillow */}
            <div 
              onClick={() => setSelectedPhoto('/odi-sleeping.png')}
              className="cursor-pointer group relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-md border-4 border-white bg-slate-900 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src="/odi-sleeping.png"
                  alt="Odi fast asleep on fluffy pillow"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-4 sm:p-5 text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Dreamland</span>
                <h4 className="font-bold text-base mt-0.5">Golden Fleece Nap</h4>
                <p className="text-xs text-slate-300 mt-1">Peacefully buried in his warmest plush blanket.</p>
              </div>
            </div>

            {/* Photo 3: Space Carrier Travel */}
            <div 
              onClick={() => setSelectedPhoto('/odi-carrier.png')}
              className="cursor-pointer group relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-md border-4 border-white bg-slate-900 transition-all hover:-translate-y-1 hover:shadow-xl sm:col-span-2 md:col-span-1 max-w-md sm:max-w-none mx-auto w-full"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src="/odi-carrier.png"
                  alt="Odi inside cat carrier"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-4 sm:p-5 text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">On The Move</span>
                <h4 className="font-bold text-base mt-0.5">Spaceship Traveler</h4>
                <p className="text-xs text-slate-300 mt-1">Ready for trips with his trusted cat backpack.</p>
              </div>
            </div>

          </div>

          {/* Personality bullet highlights */}
          <div className="mt-8 sm:mt-12 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-xs">
            <h3 className="font-black text-lg mb-4 flex items-center gap-2 text-slate-900">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
              <span>Odi's Trademark Behaviors & Highlights</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {ODI_DATA.personalityTraits.map((trait, i) => (
                <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl text-sm font-bold shadow-xs border bg-slate-50 border-slate-200 text-slate-800">
                  <span className="text-amber-500 font-black">✔</span>
                  <span>{trait}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 bg-slate-900 text-slate-300 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🐾</span>
            <span className="font-extrabold text-xl text-white font-display">Odi The Kitten</span>
            <span className="text-xs bg-slate-800 text-amber-400 px-2.5 py-0.5 rounded-full border border-slate-700">
              Turkish Angora / Persian
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={() => setIsCertOpen(true)}
              className="text-amber-400 hover:text-amber-300 underline underline-offset-4 flex items-center gap-1 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              Download Official Certificate (PDF)
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePetCat}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-slate-950" />
              Pet Odi ({purrCount})
            </button>
          </div>
        </div>
      </footer>

      {/* PDF Certificate Modal */}
      <CertificateModal
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
        currentAge={ageData.headline}
      />

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)} 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 cursor-pointer"
        >
          <div className="relative max-w-full sm:max-w-3xl max-h-[90vh]">
            <img 
              src={selectedPhoto} 
              alt="Odi Preview" 
              className="max-h-[80vh] sm:max-h-[85vh] w-auto max-w-full rounded-2xl sm:rounded-3xl shadow-2xl border-4 border-slate-700 object-contain mx-auto"
            />
            <p className="text-center text-xs text-slate-300 mt-3 font-medium">Tap anywhere to close</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
