"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";

// ============================================
// MEDIUS ROI CALCULATOR - BENCHMARKS & CONSTANTS
// ============================================

// Processing cycle time benchmarks (days) - from Medius ROI PDF
const BENCHMARKS = {
  po: {
    average: 6.7,
    best: 2.6,
  },
  nonPo: {
    average: 6.3,
    best: 1.0,
  },
};

// Touchless benchmarks (PO invoices only)
const TOUCHLESS_RATE = {
  average: 0.667, // 66.7%
  best: 0.937,    // 93.7%
};

// Payment savings yield (on annual payables spend)
const PAYMENT_YIELD = {
  low: 0.0009975,  // 0.09975%
  high: 0.001875,  // 0.1875%
};

// Currency options
const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
];

// Default values for reset
const DEFAULT_VALUES = {
  currency: 'USD',
  poInvoiceVolume: 100000,
  nonPoInvoiceVolume: 50000,
  currentDaysToProcess: 10,
  poManualInterventionPct: 35,
  annualPayablesSpend: 100000000,
};

// ============================================
// CENTRALIZED FORMATTING FUNCTIONS
// ============================================

// Format days: 1 decimal if fractional, no decimal if whole
function formatDays(num: number): string {
  return num % 1 === 0 ? num.toFixed(0) : num.toFixed(1);
}

// Format days range: low end with 1 decimal if needed, high end floored
function formatDaysRange(low: number, high: number): string {
  const lowStr = low % 1 === 0 ? low.toFixed(0) : low.toFixed(1);
  const highStr = Math.floor(high).toString();
  return `${lowStr} – ${highStr}`;
}

// Format day/days label
function dayLabel(num: number): string {
  return num === 1 ? 'day' : 'days';
}

// Format percentages: 1 decimal for non-100%, no decimal for 100%
function formatPercent(num: number): string {
  return num === 100 ? '100%' : `${num.toFixed(1)}%`;
}

// Format currency: no cents, thousands separators
function formatCurrency(num: number, symbol: string): string {
  return `${symbol}${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(num))}`;
}

// Format invoice counts
function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(num));
}

// Custom hook for detecting when element is in view
function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

// ============================================
// ANIMATED VALUE COMPONENT
// ============================================

function AnimatedValue({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const prevChildrenRef = useRef(children);

  useEffect(() => {
    if (prevChildrenRef.current !== children) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      prevChildrenRef.current = children;
      return () => clearTimeout(timer);
    }
  }, [children]);

  return (
    <span
      className={`inline-block transition-all duration-300 ${
        isAnimating
          ? 'scale-105 text-primary'
          : 'scale-100'
      } ${className}`}
    >
      {children}
    </span>
  );
}

// ============================================
// SHARE BUTTON COMPONENT
// ============================================

function ShareButton({
  onClick,
  copied
}: {
  onClick: () => void;
  copied: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded transition-all duration-200 border border-white/20"
    >
      {copied ? (
        <>
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Link Copied!
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share Results
        </>
      )}
    </button>
  );
}

// ============================================
// RESET BUTTON COMPONENT
// ============================================

function ResetButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded transition-all duration-200 border border-white/20"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Reset
    </button>
  );
}

// ============================================
// BAR CHART COMPONENT
// ============================================

function BenchmarkChart({
  title,
  averageValue,
  bestValue,
  averageLabel,
  bestLabel,
  maxValue,
}: {
  title: string;
  averageValue: number;
  bestValue: number;
  averageLabel: string;
  bestLabel: string;
  maxValue: number;
}) {
  const { ref, isInView } = useInView(0.3);
  const averageHeight = (averageValue / maxValue) * 100;
  const bestHeight = (bestValue / maxValue) * 100;

  return (
    <div ref={ref} className="bg-white rounded-lg p-4 md:p-6 h-full flex flex-col transition-all duration-300 hover:shadow-lg">
      <h4 className="text-sm md:text-base font-semibold text-[#2d4242] mb-4 text-center">
        {title}
      </h4>
      <div className="flex-1 flex items-end justify-center gap-6 md:gap-10 min-h-[120px] md:min-h-[140px] pb-2">
        <div className="flex flex-col items-center h-full justify-end">
          <span className={`text-xs md:text-sm font-bold text-[#2d4242] mb-2 transition-opacity duration-500 ${isInView ? 'opacity-100' : 'opacity-0'}`}>
            {averageLabel}
          </span>
          <div
            className="w-14 md:w-20 bg-[#2d4242] rounded-t-md transition-all duration-1000 ease-out"
            style={{
              height: isInView ? `${averageHeight}%` : '0%',
              minHeight: isInView ? '20px' : '0px',
              transitionDelay: '100ms'
            }}
          />
        </div>
        <div className="flex flex-col items-center h-full justify-end">
          <span className={`text-xs md:text-sm font-bold text-primary mb-2 transition-opacity duration-500 ${isInView ? 'opacity-100' : 'opacity-0'}`}>
            {bestLabel}
          </span>
          <div
            className="w-14 md:w-20 bg-primary rounded-t-md transition-all duration-1000 ease-out"
            style={{
              height: isInView ? `${bestHeight}%` : '0%',
              minHeight: isInView ? '20px' : '0px',
              transitionDelay: '300ms'
            }}
          />
        </div>
      </div>
      <div className="flex justify-center gap-4 text-xs mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#2d4242]" />
          <span className="text-[#2d4242]/70">Average</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-[#2d4242]/70">Best-in-class</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function Home() {
  // Input state
  const [currency, setCurrency] = useState(DEFAULT_VALUES.currency);
  const [poInvoiceVolume, setPoInvoiceVolume] = useState(DEFAULT_VALUES.poInvoiceVolume);
  const [nonPoInvoiceVolume, setNonPoInvoiceVolume] = useState(DEFAULT_VALUES.nonPoInvoiceVolume);
  const [currentDaysToProcess, setCurrentDaysToProcess] = useState(DEFAULT_VALUES.currentDaysToProcess);
  const [poManualInterventionPct, setPoManualInterventionPct] = useState(DEFAULT_VALUES.poManualInterventionPct);
  const [annualPayablesSpend, setAnnualPayablesSpend] = useState(DEFAULT_VALUES.annualPayablesSpend);

  // Share state
  const [copied, setCopied] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Email capture modal state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Get currency symbol
  const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || '$';

  // ============================================
  // CALCULATIONS (following Medius ROI PDF model)
  // ============================================

  const poDaysSavedAvg = Math.max(0, currentDaysToProcess - BENCHMARKS.po.average);
  const poDaysSavedBest = Math.max(0, currentDaysToProcess - BENCHMARKS.po.best);
  const nonPoDaysSavedAvg = Math.max(0, currentDaysToProcess - BENCHMARKS.nonPo.average);
  const nonPoDaysSavedBest = Math.max(0, currentDaysToProcess - BENCHMARKS.nonPo.best);

  const currentTouchlessRate = 1 - (poManualInterventionPct / 100);
  const touchlessTotalAvg = poInvoiceVolume * TOUCHLESS_RATE.average;
  const touchlessTotalBest = poInvoiceVolume * TOUCHLESS_RATE.best;
  const touchlessAdditionalAvg = Math.max(0, poInvoiceVolume * (TOUCHLESS_RATE.average - currentTouchlessRate));
  const touchlessAdditionalBest = Math.max(0, poInvoiceVolume * (TOUCHLESS_RATE.best - currentTouchlessRate));

  const paymentSavingsLow = annualPayablesSpend * PAYMENT_YIELD.low;
  const paymentSavingsHigh = annualPayablesSpend * PAYMENT_YIELD.high;

  // ============================================
  // HANDLERS
  // ============================================

  // Reset to default values
  const handleReset = useCallback(() => {
    setCurrency(DEFAULT_VALUES.currency);
    setPoInvoiceVolume(DEFAULT_VALUES.poInvoiceVolume);
    setNonPoInvoiceVolume(DEFAULT_VALUES.nonPoInvoiceVolume);
    setCurrentDaysToProcess(DEFAULT_VALUES.currentDaysToProcess);
    setPoManualInterventionPct(DEFAULT_VALUES.poManualInterventionPct);
    setAnnualPayablesSpend(DEFAULT_VALUES.annualPayablesSpend);

    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Handle email form submission
  const handleEmailSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    setTimeout(() => {
      console.log('Lead captured:', {
        email, name, company,
        calculatorData: {
          currency, poInvoiceVolume, nonPoInvoiceVolume,
          currentDaysToProcess, poManualInterventionPct, annualPayablesSpend,
          paymentSavingsLow, paymentSavingsHigh,
        }
      });
      setIsSubmitting(false);
      setIsSubmitted(true);

      setTimeout(() => {
        setIsEmailModalOpen(false);
        setIsSubmitted(false);
        setEmail('');
        setName('');
        setCompany('');
      }, 3000);
    }, 1000);
  }, [email, name, company, currency, poInvoiceVolume, nonPoInvoiceVolume, currentDaysToProcess, poManualInterventionPct, annualPayablesSpend, paymentSavingsLow, paymentSavingsHigh]);

  // Load state from URL on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const c = params.get('c');
    const po = params.get('po');
    const npo = params.get('npo');
    const days = params.get('days');
    const manual = params.get('manual');
    const spend = params.get('spend');

    if (c && CURRENCIES.some(curr => curr.code === c)) setCurrency(c);
    if (po) setPoInvoiceVolume(Math.min(500000, Math.max(0, parseInt(po, 10) || DEFAULT_VALUES.poInvoiceVolume)));
    if (npo) setNonPoInvoiceVolume(Math.min(500000, Math.max(0, parseInt(npo, 10) || DEFAULT_VALUES.nonPoInvoiceVolume)));
    if (days) setCurrentDaysToProcess(Math.min(20, Math.max(1, parseFloat(days) || DEFAULT_VALUES.currentDaysToProcess)));
    if (manual) setPoManualInterventionPct(Math.min(80, Math.max(0, parseInt(manual, 10) || DEFAULT_VALUES.poManualInterventionPct)));
    if (spend) setAnnualPayablesSpend(Math.min(2000000000, Math.max(5000000, parseInt(spend, 10) || DEFAULT_VALUES.annualPayablesSpend)));

    setIsInitialized(true);
  }, []);

  // Update URL when values change
  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') return;

    const params = new URLSearchParams();
    params.set('c', currency);
    params.set('po', poInvoiceVolume.toString());
    params.set('npo', nonPoInvoiceVolume.toString());
    params.set('days', currentDaysToProcess.toString());
    params.set('manual', poManualInterventionPct.toString());
    params.set('spend', annualPayablesSpend.toString());

    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }, [isInitialized, currency, poInvoiceVolume, nonPoInvoiceVolume, currentDaysToProcess, poManualInterventionPct, annualPayablesSpend]);

  // Copy share link
  const handleShare = useCallback(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams();
    params.set('c', currency);
    params.set('po', poInvoiceVolume.toString());
    params.set('npo', nonPoInvoiceVolume.toString());
    params.set('days', currentDaysToProcess.toString());
    params.set('manual', poManualInterventionPct.toString());
    params.set('spend', annualPayablesSpend.toString());

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [currency, poInvoiceVolume, nonPoInvoiceVolume, currentDaysToProcess, poManualInterventionPct, annualPayablesSpend]);

  const handlePoVolumeChange = useCallback((value: number[]) => setPoInvoiceVolume(value[0]), []);
  const handleNonPoVolumeChange = useCallback((value: number[]) => setNonPoInvoiceVolume(value[0]), []);
  const handleDaysChange = useCallback((value: number[]) => setCurrentDaysToProcess(value[0]), []);
  const handleManualInterventionChange = useCallback((value: number[]) => setPoManualInterventionPct(value[0]), []);
  const handleSpendChange = useCallback((value: number[]) => setAnnualPayablesSpend(value[0]), []);

  return (
    <>
      <Header />

      {/* Email Capture Modal */}
      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#2d4242]">Get Your Custom ROI Report</DialogTitle>
            <DialogDescription>
              Enter your details to receive a personalized ROI analysis and schedule your free 15-minute consultation.
            </DialogDescription>
          </DialogHeader>

          {isSubmitted ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#2d4242] mb-2">Thank You!</h3>
              <p className="text-gray-600">We'll be in touch shortly with your personalized ROI report.</p>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2d4242] mb-1">Work Email *</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2d4242] mb-1">Full Name</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Smith"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2d4242] mb-1">Company</label>
                <Input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Inc."
                  className="w-full"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <p className="font-medium text-[#2d4242] mb-2">Your Estimated Savings:</p>
                <p className="text-primary font-bold text-lg">
                  {formatCurrency(paymentSavingsLow, currencySymbol)} – {formatCurrency(paymentSavingsHigh, currencySymbol)}/year
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !email}
                className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-semibold py-3 px-6 rounded transition-colors duration-200 text-sm uppercase tracking-wide"
              >
                {isSubmitting ? 'Submitting...' : 'Get My ROI Report'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                By submitting, you agree to receive communications from Medius. You can unsubscribe at any time.
              </p>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <section
        className="relative pt-20 md:pt-28 pb-28 md:pb-36"
        style={{
          backgroundImage: 'url(/images/medius-light-sand-background-6.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#2d4242] mb-6 leading-tight">
            How much could you save with Medius?
          </h1>
          <p className="text-lg md:text-xl text-[#2d4242]/80 max-w-3xl mx-auto mb-8">
            Compare yourself to average and best-in-class Medius customers.
          </p>
          <button
            type="button"
            onClick={() => {
              const element = document.getElementById('calculator-section');
              if (element) {
                const headerOffset = 120;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
              }
            }}
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded hover:bg-primary/90 transition-all uppercase tracking-wide text-sm"
          >
            See My Savings
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </section>

      {/* Benchmark Section */}
      <section className="relative bg-[#f4f4f2] pt-16 md:pt-20 pb-28 md:pb-36">
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none" style={{ transform: 'translateY(-99%) scaleX(-1)' }}>
          <svg className="w-full h-8 md:h-12 lg:h-16" viewBox="0 0 1512 160" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-0.00012207 160V26.2023C118.348 14.5718 260.76 8.19165 429.194 2.59521C823.48 -10.5054 1218.72 25.6423 1512 118.946L1512 160L-0.00012207 160Z" fill="#f4f4f2" />
          </svg>
        </div>
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2d4242] text-center mb-4">
            Are you leaving savings on the table?
          </h2>
          <p className="text-[#2d4242]/70 text-center max-w-2xl mx-auto mb-8 md:mb-12">
            Compare your AP KPIs to best-in-class Medius customers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="lg:col-span-2">
              <div className="bg-[#2d4242] text-white text-center py-3 rounded-t-lg font-semibold">PO Invoices</div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="col-span-2 grid grid-cols-3 gap-2 mb-2">
                  <div className="bg-white rounded-lg p-3 text-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                    <div className="text-lg md:text-xl font-bold text-primary">77% → 100%</div>
                    <p className="text-[9px] md:text-[10px] text-[#2d4242]/70 uppercase tracking-wide">PO Touchless Capture Rate</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                    <div className="text-xl md:text-2xl font-bold text-primary">96.3%</div>
                    <p className="text-[9px] md:text-[10px] text-[#2d4242]/70 uppercase tracking-wide">Touchless Processing Rate</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                    <div className="text-xl md:text-2xl font-bold text-primary">1.4 days</div>
                    <p className="text-[9px] md:text-[10px] text-[#2d4242]/70 uppercase tracking-wide">Total invoice processing cycle time</p>
                  </div>
                </div>
                <BenchmarkChart title="Touchless processing rate" averageValue={68.9} bestValue={96.3} averageLabel="68.9%" bestLabel="96.3%" maxValue={120} />
                <BenchmarkChart title="Total invoice processing cycle time" averageValue={5.1} bestValue={1.4} averageLabel="5.1 Days" bestLabel="1.4 Days" maxValue={6} />
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-[#2d4242] text-white text-center py-3 rounded-t-lg font-semibold">Non-PO Invoices</div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="col-span-2 grid grid-cols-3 gap-2 mb-2">
                  <div className="bg-white rounded-lg p-3 text-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                    <div className="text-lg md:text-xl font-bold text-primary">76.6% → 100%</div>
                    <p className="text-[9px] md:text-[10px] text-[#2d4242]/70 uppercase tracking-wide">Non-PO Touchless Capture Rate</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                    <div className="text-lg md:text-xl font-bold text-primary">65.7% → 99.5%</div>
                    <p className="text-[9px] md:text-[10px] text-[#2d4242]/70 uppercase tracking-wide">Non-PO Automatic Routing Rate</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                    <div className="text-lg md:text-xl font-bold text-primary">3.3 → 1.0 day</div>
                    <p className="text-[9px] md:text-[10px] text-[#2d4242]/70 uppercase tracking-wide">Non-PO Average Approval Time</p>
                  </div>
                </div>
                <BenchmarkChart title="Non-PO Touchless Capture Rate" averageValue={76.6} bestValue={100} averageLabel="76.6%" bestLabel="100%" maxValue={120} />
                <BenchmarkChart title="Total invoice processing cycle time" averageValue={7.4} bestValue={2.1} averageLabel="7.4 Days" bestLabel="2.1 Days" maxValue={8} />
              </div>
            </div>
          </div>

          {/* ROI Benchmark Download CTA */}
          <div className="mt-12 md:mt-16">
            <div className="relative bg-white rounded-xl shadow-lg p-8 md:p-10 overflow-hidden group hover:shadow-2xl transition-all duration-300">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Sparkle effects */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
              <div className="absolute top-8 right-16 w-1.5 h-1.5 bg-primary/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100" />
              <div className="absolute bottom-6 right-8 w-1 h-1 bg-primary/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200" />
              <div className="absolute top-6 left-1/3 w-1.5 h-1.5 bg-primary/50 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse delay-150" />

              <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex items-center justify-center lg:justify-start flex-shrink-0">
                  {/* Animated pill badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary/10 rounded-full border border-primary/20 animate-pulse">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                    </span>
                    <span className="text-xs md:text-sm font-semibold text-primary uppercase tracking-wide whitespace-nowrap">ROI Benchmark</span>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center lg:justify-start text-center lg:text-left px-4">
                  <p className="text-base md:text-lg lg:text-xl font-semibold text-[#2d4242] whitespace-nowrap">
                    See how top performers achieve up to 96.3% touchless processing
                  </p>
                </div>

                <div className="flex-shrink-0 flex items-center justify-center lg:justify-end">
                  <a
                    href="/pdf/medius_rr_ap-automation-benchmark_2025.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg group/btn"
                  >
                    <svg className="w-5 h-5 transition-transform group-hover/btn:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm uppercase tracking-wide whitespace-nowrap">Download Report</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none">
          <svg className="w-full h-8 md:h-12 lg:h-16" viewBox="0 0 1512 160" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-0.00012207 160V26.2023C118.348 14.5718 260.76 8.19165 429.194 2.59521C823.48 -10.5054 1218.72 25.6423 1512 118.946L1512 160L-0.00012207 160Z" fill="#2d4242" />
          </svg>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section id="calculator-section" className="relative bg-[#2d4242] py-16 md:py-20 pb-28 md:pb-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              See what spend automation is worth
            </h2>
            <p className="text-xl md:text-2xl text-white/70">
              Describe your AP process and see how much Medius could save you each year.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Left Column - Inputs */}
            <div className="bg-white rounded-lg p-6 md:p-8 lg:p-10">
              <h3 className="text-2xl md:text-3xl font-bold text-[#2d4242] mb-8">Your AP Process</h3>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-[#2d4242]">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 text-[#2d4242] font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.symbol} {c.code} - {c.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500">For display formatting only</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-[#2d4242]">PO invoice volume (annual)</label>
                      <p className="text-xs text-gray-500 mt-0.5">Purchase order invoices processed per year</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between border border-gray-200">
                    <span className="font-mono text-lg font-semibold text-[#2d4242]">{formatNumber(poInvoiceVolume)}</span>
                    <span className="text-sm text-gray-500">invoices</span>
                  </div>
                  <Slider value={[poInvoiceVolume]} onValueChange={handlePoVolumeChange} min={0} max={500000} step={5000} className="w-full" />
                  <div className="flex justify-between text-xs text-gray-500"><span>0</span><span>500,000+</span></div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-[#2d4242]">Non-PO invoice volume (annual)</label>
                      <p className="text-xs text-gray-500 mt-0.5">Expense invoices without purchase orders</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between border border-gray-200">
                    <span className="font-mono text-lg font-semibold text-[#2d4242]">{formatNumber(nonPoInvoiceVolume)}</span>
                    <span className="text-sm text-gray-500">invoices</span>
                  </div>
                  <Slider value={[nonPoInvoiceVolume]} onValueChange={handleNonPoVolumeChange} min={0} max={500000} step={5000} className="w-full" />
                  <div className="flex justify-between text-xs text-gray-500"><span>0</span><span>500,000+</span></div>
                  <p className="text-xs text-gray-500 mt-1">Non-PO invoices account for {Math.round((nonPoInvoiceVolume / (poInvoiceVolume + nonPoInvoiceVolume)) * 100)}% of total invoice volume.</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-[#2d4242]">Current days to process an invoice</label>
                      <p className="text-xs text-gray-500 mt-0.5">Most teams: 7-10 days. Best: 1-3.</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between border border-gray-200">
                    <span className="font-mono text-lg font-semibold text-[#2d4242]">{currentDaysToProcess % 1 === 0 ? currentDaysToProcess.toFixed(0) : currentDaysToProcess.toFixed(1)}</span>
                    <span className="text-sm text-gray-500">days</span>
                  </div>
                  <div className="relative">
                    <Slider value={[currentDaysToProcess]} onValueChange={handleDaysChange} min={1} max={20} step={0.1} className="w-full" />
                    {/* Benchmark dot markers */}
                    <div className="absolute top-1/2 left-0 right-0 h-0 pointer-events-none" style={{ transform: 'translateY(-50%)' }}>
                      <span className="absolute w-1.5 h-1.5 bg-gray-400 rounded-full" style={{ left: '0%', transform: 'translateX(-50%)' }} />
                      <span className="absolute w-1.5 h-1.5 bg-gray-400 rounded-full" style={{ left: '8.4%', transform: 'translateX(-50%)' }} />
                      <span className="absolute w-1.5 h-1.5 bg-gray-400 rounded-full" style={{ left: '27.9%', transform: 'translateX(-50%)' }} />
                      <span className="absolute w-1.5 h-1.5 bg-gray-400 rounded-full" style={{ left: '30%', transform: 'translateX(-50%)' }} />
                    </div>
                  </div>
                  {/* Min/Max labels */}
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1</span>
                    <span>20</span>
                  </div>
                  {/* Benchmark legend */}
                  <p className="text-xs text-gray-500">
                    Benchmarks: Best NPO (1.0) • Best PO (2.6) • Avg NPO (6.3) • Avg PO (6.7)
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-[#2d4242]">PO invoices requiring manual intervention</label>
                      <p className="text-xs text-gray-500 mt-0.5">Reducing manual intervention increases touchless, fully automated invoice processing.</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between border border-gray-200">
                    <span className="font-mono text-lg font-semibold text-[#2d4242]">{poManualInterventionPct}%</span>
                    <span className="text-sm text-gray-500">Current touchless rate: {100 - poManualInterventionPct}%</span>
                  </div>
                  <div className="relative">
                    <Slider value={[poManualInterventionPct]} onValueChange={handleManualInterventionChange} min={0} max={80} step={1} className="w-full" />
                    {/* Benchmark dot markers */}
                    <div className="absolute top-1/2 left-0 right-0 h-0 pointer-events-none" style={{ transform: 'translateY(-50%)' }}>
                      <span className="absolute w-1.5 h-1.5 bg-gray-400 rounded-full" style={{ left: '7.5%', transform: 'translateX(-50%)' }} />
                      <span className="absolute w-1.5 h-1.5 bg-gray-400 rounded-full" style={{ left: '41.25%', transform: 'translateX(-50%)' }} />
                    </div>
                  </div>
                  {/* Min/Max labels */}
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>80%</span>
                  </div>
                  {/* Benchmark legend */}
                  <p className="text-xs text-gray-500">
                    Benchmarks: Best (6%) • Avg (33%)
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-[#2d4242]">Annual payables spend</label>
                      <p className="text-xs text-gray-500 mt-0.5">Used to estimate annual payment processing savings.</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between border border-gray-200">
                    <span className="font-mono text-lg font-semibold text-[#2d4242]">{formatCurrency(annualPayablesSpend, currencySymbol)}</span>
                  </div>
                  <Slider value={[annualPayablesSpend]} onValueChange={handleSpendChange} min={5000000} max={2000000000} step={5000000} className="w-full" />
                  <div className="flex justify-between text-xs text-gray-500"><span>{currencySymbol}5M</span><span>{currencySymbol}2B+</span></div>
                </div>
              </div>
            </div>

            {/* Right Column - Live Outputs */}
            <div className="bg-white rounded-lg p-6 md:p-8 lg:p-10">
              <h3 className="text-2xl md:text-3xl font-bold text-[#2d4242] mb-8">Your Potential Savings</h3>

              <div className="space-y-6">
                <div className="p-5 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-[#2d4242]">Cycle time reduced (PO invoices)</h4>
                      <p className="text-xs text-gray-500">Medius average → Best-in-class</p>
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-primary">
                    {poDaysSavedAvg > 0 || poDaysSavedBest > 0 ? (
                      <AnimatedValue>{formatDaysRange(poDaysSavedAvg, poDaysSavedBest)} {dayLabel(Math.floor(poDaysSavedBest))}</AnimatedValue>
                    ) : (
                      <span className="text-[#2d4242]/50">Already optimized</span>
                    )}
                  </div>
                </div>

                <div className="p-5 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-[#2d4242]">Cycle time reduced (Non-PO invoices)</h4>
                      <p className="text-xs text-gray-500">Medius average → Best-in-class</p>
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-primary">
                    {nonPoDaysSavedAvg > 0 || nonPoDaysSavedBest > 0 ? (
                      <AnimatedValue>{formatDaysRange(nonPoDaysSavedAvg, nonPoDaysSavedBest)} {dayLabel(Math.floor(nonPoDaysSavedBest))}</AnimatedValue>
                    ) : (
                      <span className="text-[#2d4242]/50">Already optimized</span>
                    )}
                  </div>
                </div>

                <div className="p-5 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-[#2d4242]">More invoices processed automatically (PO)</h4>
                      <p className="text-xs text-gray-500">Medius average → Best-in-class</p>
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                    {touchlessAdditionalAvg > 0 || touchlessAdditionalBest > 0 ? (
                      <AnimatedValue>+{formatNumber(touchlessAdditionalAvg)} – +{formatNumber(touchlessAdditionalBest)}</AnimatedValue>
                    ) : (
                      <span className="text-[#2d4242]/50">Already at benchmark</span>
                    )}
                  </div>
                  <p className="text-sm text-[#2d4242]/70">
                    Total touchless: <AnimatedValue>{formatNumber(touchlessTotalAvg)} – {formatNumber(touchlessTotalBest)}</AnimatedValue> invoices
                  </p>
                </div>

                <div className="p-6 bg-primary/5 rounded-lg border-2 border-primary/20 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-[#2d4242]">Payment savings (annual)</h4>
                      <p className="text-xs text-gray-500">Estimated payment processing savings based on annual spend</p>
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-primary">
                    <AnimatedValue>{formatCurrency(paymentSavingsLow, currencySymbol)} – {formatCurrency(paymentSavingsHigh, currencySymbol)}</AnimatedValue>
                  </div>
                  <p className="text-sm text-[#2d4242]/70 mt-2">per year</p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(true)}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-6 rounded transition-colors duration-200 text-sm uppercase tracking-wide"
                >
                  Book a Free 15-min ROI Review
                </button>

                {/* Customer Video */}
                <div className="mt-8">
                  <p className="text-sm font-medium text-[#2d4242] mb-3">Hear from Medius customers</p>
                  <div className="relative aspect-video rounded-lg overflow-hidden shadow-md bg-gray-900">
                    <video
                      controls
                      muted
                      preload="metadata"
                      className="w-full h-full"
                      poster="/images/medius-light-sand-background-6.jpg"
                    >
                      <source src="/videos/medius-customers.mp4" type="video/mp4" />
                      Video loading…
                    </video>
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center mt-6">
                  Benchmarks based on millions of invoices processed by Medius customers globally. Best-in-class reflects the top 10% of performers.
                </p>
              </div>
            </div>
          </div>

          {/* Share and Reset buttons below calculator */}
          <div className="flex items-center justify-center gap-3 mt-10">
            <ShareButton onClick={handleShare} copied={copied} />
            <ResetButton onClick={handleReset} />
          </div>
        </div>

        {/* Bottom wave SVG */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none">
          <svg className="w-full h-12 md:h-16 lg:h-20" viewBox="0 0 1512 115" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1512 115H0V45C0 45 145 0 378 0C611 0 780 99 1165 99C1403 99 1512 20 1512 20V115Z" fill="white" transform="scale(-1,1) translate(-1512, 0)" />
          </svg>
        </div>
      </section>

      {/* Customer Proof Section */}
      <section className="bg-white py-20 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2d4242] text-center mb-12">
            Trusted by global brands achieving best-in-class AP performance
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* PUMA */}
            <div className="bg-gray-50 rounded-lg p-8 text-center flex flex-col items-center">
              <div className="h-20 flex items-center justify-center mb-6">
                <img src="/images/logos/puma.svg" alt="PUMA" className="max-h-16 w-auto" />
              </div>
              <a
                href="https://www.medius.com/resources/case-studies/puma-video/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium text-sm hover:underline inline-flex items-center gap-1"
              >
                Read the case study →
              </a>
            </div>

            {/* WD-40 */}
            <div className="bg-gray-50 rounded-lg p-8 text-center flex flex-col items-center">
              <div className="h-20 flex items-center justify-center mb-6">
                <img src="/images/logos/wd-40.png" alt="WD-40" className="max-h-16 w-auto" />
              </div>
              <a
                href="https://www.medius.com/resources/case-studies/wd-40-video/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium text-sm hover:underline inline-flex items-center gap-1"
              >
                Read the case study →
              </a>
            </div>

            {/* Briggs Industrial */}
            <div className="bg-gray-50 rounded-lg p-8 text-center flex flex-col items-center">
              <div className="h-20 flex items-center justify-center mb-6">
                <img src="/images/logos/briggs.png" alt="Briggs Industrial" className="max-h-16 w-auto" />
              </div>
              <a
                href="https://www.medius.com/resources/case-studies/briggs-equipment-ap-automation/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium text-sm hover:underline inline-flex items-center gap-1"
              >
                Read the case study →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#f4f4f2] py-20 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#2d4242] mb-8">Ready to transform your spend management with Medius?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button type="button" onClick={() => setIsEmailModalOpen(true)} className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold rounded hover:bg-primary/90 transition-colors uppercase tracking-wide text-sm">
              Book a Demo
            </button>
            <button type="button" className="inline-flex items-center justify-center px-8 py-4 bg-[#1a1a1a] text-white font-semibold rounded hover:bg-gray-800 transition-colors uppercase tracking-wide text-sm">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2d4242] py-10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <svg className="h-8 text-white" viewBox="0 0 120 24" fill="currentColor">
              <text x="0" y="18" fontFamily="Poppins, sans-serif" fontSize="18" fontWeight="600">medius</text>
            </svg>
          </div>
          <p className="text-white/60 text-sm">
            The estimated savings reflect the time saved across the entire purchase invoice handling
            process as a result of Medius automation's impact.
          </p>
        </div>
      </footer>
    </>
  );
}
