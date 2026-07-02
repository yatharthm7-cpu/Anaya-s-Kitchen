import { useEffect, useState, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useInView,
  useReducedMotion,
  AnimatePresence
} from 'motion/react';
import {
  Banknote,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  ConciergeBell,
  Leaf,
  MapPin,
  Menu as MenuIcon,
  Smartphone,
  Navigation,
  Star,
  Sparkles,
  Users,
  CreditCard,
  X,
  Instagram
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const WHATSAPP_NUMBER = '919662521407';
const MAPS_URL =
  "https://maps.google.com/maps?q=Anaya's%20Kitchen,%20Orchid%20Blues,%20G%20806,%20Shela,%20Ahmedabad,%20Gujarat%20380058";

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'menu', label: 'Menu' },
  { id: 'about', label: 'About' },
  { id: 'faq', label: 'FAQ' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'contact', label: 'Contact' }
];

const whatsAppOrderLink = (dish?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    dish
      ? `Hi Anaya's Kitchen! I'd like to order the ${dish}. Is it available today?`
      : "Hi Anaya's Kitchen! I'd like to place an order."
  )}`;

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */

/** Live open/closed status in IST (kitchen hours 7:00 PM – 11:30 PM). */
function useKitchenStatus() {
  const compute = () => {
    const now = new Date();
    // Convert viewer's local time to IST (UTC+5:30)
    const ist = new Date(now.getTime() + (330 + now.getTimezoneOffset()) * 60000);
    const minutes = ist.getHours() * 60 + ist.getMinutes();
    const open = 19 * 60; // 7:00 PM
    const close = 23 * 60 + 30; // 11:30 PM
    if (minutes >= open && minutes < close) {
      return { isOpen: true, label: 'Open now · until 11:30 PM' };
    }
    if (minutes < open) {
      const mins = open - minutes;
      if (mins <= 60) return { isOpen: false, label: `Opens in ${mins} min` };
      return { isOpen: false, label: 'Opens at 7:00 PM' };
    }
    return { isOpen: false, label: 'Opens tomorrow at 7:00 PM' };
  };

  const [status, setStatus] = useState(compute);

  useEffect(() => {
    const t = setInterval(() => setStatus(compute()), 60000);
    return () => clearInterval(t);
  }, []);

  return status;
}

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */

function StatusPill({ className = '' }: { className?: string }) {
  const { isOpen, label } = useKitchenStatus();
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-label-md text-label-md border ${
        isOpen
          ? 'bg-[#e6f4ea] text-[#1e7e34] border-[#1e7e34]/20'
          : 'bg-surface-container-high text-on-surface-variant border-outline-variant/40'
      } ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {isOpen && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1e7e34] opacity-60" />
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isOpen ? 'bg-[#1e7e34]' : 'bg-outline'
          }`}
        />
      </span>
      {label}
    </span>
  );
}

/** Word-by-word reveal for the hero headline. */
function RevealHeadline({ text, className }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  const words = text.split(' ');
  return (
    <h1 className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: '110%', rotate: 4 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

/** Animated count-up number that starts when scrolled into view. */
function CountUp({ to, suffix = '', decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    let raf: number;
    const start = performance.now();
    const duration = 1400;
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduce]);

  return (
    <span ref={ref}>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/** Section heading with growing eyebrow rule + masked title reveal. */
function SectionHeading({
  eyebrow,
  title,
  align = 'center'
}: {
  eyebrow: string;
  title: string;
  align?: 'center' | 'left';
}) {
  return (
    <div className={align === 'center' ? 'text-center' : ''}>
      <div
        className={`flex items-center gap-3 ${align === 'center' ? 'justify-center' : ''}`}
      >
        <motion.span
          className="h-px bg-primary/60 hidden sm:block"
          initial={{ width: 0 }}
          whileInView={{ width: 40 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        <span className="font-label-md text-label-md text-primary uppercase tracking-widest">
          {eyebrow}
        </span>
        <motion.span
          className="h-px bg-primary/60 hidden sm:block"
          initial={{ width: 0 }}
          whileInView={{ width: 40 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      <span className="block overflow-hidden mt-2">
        <motion.h2
          className="font-headline-md text-headline-md"
          initial={{ y: '100%' }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {title}
        </motion.h2>
      </span>
    </div>
  );
}

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    damping: 30,
    stiffness: 200
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    damping: 30,
    stiffness: 200
  });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45 }}
      className="border border-outline-variant/30 rounded-2xl bg-surface overflow-hidden hover:bg-surface-container-lowest transition-colors"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full px-6 py-5 flex items-center justify-between text-left"
      >
        <h3 className="font-label-lg text-on-surface font-bold pr-8">{question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-primary"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-5 pt-0">
              <p className="font-body-md text-on-surface-variant leading-relaxed">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type Dish = {
  title: string;
  image: string;
  description: string;
  tag: string;
  bestseller?: boolean;
};

const dishesData: Dish[] = [
  {
    title: 'Most Wanted Dahi Bhalla',
    tag: 'Chaat',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBfT3QjwkjYiyYlGxjj6K_jEsMmbAXZkPIO90_XAXteVah-pR9c7yLk0rRI6MkJOhr707X7oMk9NG6Pn5u9GXS-cYPLPgX7Hv0-8GrzLWQ7Wn9nxnXUtG756DrkihmXlXHGhGwk1-GZZpsQql6kdU1OCZYpvQ9TZDYE4v41HOVcMjdLuGokp9bAMuov3VN_A9g4ZH6DXKjQ9xpBD2OpfZSExPzvOainvr90Z1jgZaZaKjTKEvcnXWD2VKgGeRdqRQEsuw',
    description:
      'Dahi bhalla is a refreshing North Indian snack featuring soft lentil dumplings soaked in creamy yogurt, topped with sweet tamarind chutney, spicy green chutney and a sprinkle of spices. A perfect balance of sweet, tangy and savory flavors.',
    bestseller: true
  },
  {
    title: 'Stuffed Cheese Paneer Kulcha',
    tag: 'Kulcha',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCW7EEpBs7Y6zPw8hT9zbMaWXYw959JEc8E0jsJM90ypOSI8jMW2Jo5aN3U3YW15kGJA1wd9D8D6gyaFZeXK21KMEJBBZZL4QsQ7OtZnIPI7DFkEnc4g-YHFyHD74TMtyenq6UFsxsMS-4ePNn9mmeGuhQGyBUa6Y7J9HSrdmopacub--YxBhAqQXTuinJDQv8kAjwNJvecP1Bp_6MaRvpXmFIe-GS5DAnzBdRyt-Ktcy2sBAoMWSMqsO8WhxvcUfeYBA',
    description:
      'Our signature Kulcha, stuffed generously with a delightful blend of premium cheese and spiced paneer. Baked to a perfect golden brown, offering a soft yet crisp texture in every bite.'
  },
  {
    title: 'Delhi Matar Kulcha',
    tag: 'Kulcha',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDIvLdpHuHGwy4CRXg9NM5Xju3Fd60XLHqf99WmtlzLMcuCMRQGSOa9xumf_su7VqvG-_CMClux59RTQ-TD3E0Mbl3pMrjjDBGsjVakKhT-1EYMDTOkcteMf2dHt_yHEfNtcMWHRdqRkCGtJpUSCaULwxoCeaEbTTofVySovjQ6svoVkQNV87x8RD8kSpxsoSwMd7hOOMlHcm412aBjL8tdMWxJqJxA-6w8VdxNHuV98YOi2nLGh0HdWfg2KBNXwnEOsw',
    description:
      'A classic street food from the heart of Delhi. Fluffy, warm kulchas served alongside a tangy, spicy, and perfectly cooked white pea (matar) curry, garnished with onions, green chilies, and a squeeze of lime.'
  },
  {
    title: 'Katori Chaat',
    tag: 'Chaat',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCfcRAhQPYBtk6gd7BePDQQNISmL5KmMX0SsW5axHTJMeVVYBpFDivdSuO-sS4gk_Gbc2m5xn2aGsb43bIOkzGHD-tEwjzxYNu0RPBAY9A2rbYh15YA7GvpK_sUdvtiYYaM3LQCi3ehB8awydSJdAxNzmVvXOnI0JDSv04QgGykmyMVuUUY0iMFrpXObCD1QtxFI5ue6MnrdIiimng8zfV5GlC4oEaGsqt1yubJ9osDioHaHsiaDVlOFa1yUYpx-eDZ8A',
    description:
      "An innovative chaat served in a crispy, edible 'katori' (bowl) made of fried potato or dough. Filled with a vibrant mix of sprouts, boiled potatoes, chutneys, yogurt, and spices, offering an explosion of flavors and textures."
  },
  {
    title: 'Spring Roll',
    tag: 'Snacks',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCxlL9OvikQwN42NmV6mDPZVM6wjsr-YsUwg0u9FRIGFJDnvUDyuJZ4HAgbgr0esQdv_hJZEjvbrUa918p9GLc1UxADTSty-1g63y1mQ_hGnulzmMTJB2kG6EO4_tSnhgGhontclJrzE7rY9IatlVUMkqZxodnLiD6Pe2SGQT7RrDlXlyS4n77vFQeMqAgQellsq12_0ZGaMyErHtX_jK9sKlQVFP0OEtMLTd-xbCjeFNdwZqMo1ROKonFHphpfzLjQjw',
    description:
      'Crispy, golden-fried rolls stuffed with a savory filling of finely shredded vegetables. Served piping hot with our house-special sweet chili sauce, these make for an irresistible appetizer.'
  },
  {
    title: 'Caramelized Rice Pudding',
    tag: 'Dessert',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCIBIa-9KCY5Dt7XZ2NuwQkb5QprPuKsij-ImWeU6xMFvPPoD6TyL-VwI8FR6WKdN9o3dJo1rW87Wx6j47zGMCPZwI_wQZRuik1ui3BnKUU_IB-xnU3k9ZVy96hqiqKwj3-kZatCdq7jEwi-2d4Scaynk6rIDU8RvLwuK_dlL2o7ScEqafpH7asmBebMfIT-pEugjSkgnryu-lEHsFE_CpuAsZurBoobn3AgbIV68aRh2H8q1JGBh3FluCXnWAfRNQNdA',
    description:
      'A rich and creamy traditional rice pudding, elevated with a luscious, torched caramel crust. This decadent dessert blends the comforting sweetness of slow-cooked rice with a sophisticated hint of burnt sugar.'
  }
];

const reviewsData = [
  {
    name: 'Anshu Sharma',
    meta: '2 reviews',
    when: '2 months ago',
    text: "If you're looking for a restaurant that serves hygienic and delicious home style food, your search ends at Anaya's Kitchen. I have ordered food from there many times and have never been disappointed. The food is very tasty and hygienic, and even my children love it."
  },
  {
    name: 'Mousmi Parmar',
    meta: '3 reviews · 2 photos',
    when: 'a year ago',
    text: 'Each and every food item is sooo delicious.. Superb presentation and taste is always beyond the expectations.. Keep it up..'
  },
  {
    name: 'palanethra shivacharya',
    meta: '4 reviews',
    when: '6 months ago',
    text: 'The flavors were perfectly balanced. Compliments to the chef! This was unbelievably delicious.'
  },
  {
    name: 'TUMPA MONDAL',
    meta: '2 reviews · 21 photos',
    when: 'a year ago',
    text: 'Every meal from this tiffin service feels like a warm, home-cooked treat. The quality of the ingredients, the balance of flavors, and the attention to detail in every dish make each delivery a delight.'
  }
];

const marqueeItems = [
  'Dahi Bhalla',
  'Matar Kulcha',
  'Katori Chaat',
  'Paneer Kulcha',
  'Spring Rolls',
  'Rice Pudding',
  '100% Vegetarian',
  'Made Fresh Daily'
];

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const carouselRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollY, scrollYProgress } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroScale = useTransform(scrollY, [0, 1000], [1, 1.2]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);

  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const filters = ['All', ...Array.from(new Set(dishesData.map((d) => d.tag)))];
  const visibleDishes =
    activeFilter === 'All' ? dishesData : dishesData.filter((d) => d.tag === activeFilter);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setShowToast(true), 800);
      setTimeout(() => setShowToast(false), 5800);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      let current = '';
      document.querySelectorAll('section').forEach((section) => {
        if (window.pageYOffset >= section.offsetTop - 150) {
          current = section.getAttribute('id') || '';
        }
      });
      if (current) setActiveSection(current);
      setShowBackToTop(window.pageYOffset > 800);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when modal / mobile menu is open
  useEffect(() => {
    document.body.style.overflow = selectedDish || mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedDish, mobileOpen]);

  // Close modal on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedDish(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const scrollCarousel = (direction: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction * carouselRef.current.offsetWidth * 0.8,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body-md overflow-x-hidden min-h-screen">
      {/* ---------------------------------------------------------- */}
      {/* Header                                                      */}
      {/* ---------------------------------------------------------- */}
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md shadow-sm">
        <nav className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
          <a href="#home" className="font-headline-md text-headline-sm md:text-headline-md text-primary tracking-tight">
            Anaya's Kitchen
          </a>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`relative font-label-md text-label-md transition-colors py-1 ${
                  activeSection === link.id
                    ? 'text-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <StatusPill className="hidden lg:inline-flex" />
            <a
              href={whatsAppOrderLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex bg-primary text-on-primary px-5 py-2.5 rounded-full font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all"
            >
              Order Now
            </a>
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant/50 text-on-surface"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
          </div>
        </nav>
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-primary origin-left"
          style={{ scaleX }}
        />
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[90] bg-on-background/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed top-0 right-0 bottom-0 z-[95] w-[82%] max-w-sm bg-surface shadow-2xl flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
                <span className="font-headline-sm text-headline-sm text-primary">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex flex-col px-6 py-6 gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={() => setMobileOpen(false)}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.05 }}
                    className={`px-4 py-3 rounded-xl font-label-lg font-bold transition-colors ${
                      activeSection === link.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>
              <div className="mt-auto px-6 pb-8 space-y-4">
                <StatusPill />
                <a
                  href={whatsAppOrderLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] text-white w-full py-4 rounded-full font-label-md text-label-md"
                >
                  Order on WhatsApp
                </a>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-outline text-on-surface w-full py-4 rounded-full font-label-md text-label-md"
                >
                  <Navigation className="w-4 h-4" /> Get Directions
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="pt-20">
        {/* -------------------------------------------------------- */}
        {/* Hero                                                      */}
        {/* -------------------------------------------------------- */}
        <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden" id="home">
          <motion.div className="absolute inset-0 z-0" style={{ y: heroY, scale: heroScale, opacity }}>
            <img
              alt="Anaya's Kitchen signature dishes"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXBStxReSqKrnKU7Cm77SHGafL2d8lCDtXbizEkosFT_4AXzOrrrUHcfpNIMY27J9T-NXZDYcfFeRLPDAV_J1C_CIt-tMvGmfJJhiHgrcVoskq5XhfcO1WkFdfHmYj2qkE8uA56vK78xFJGOBy-1Zu4DL5DbLR0nSICWSlETJGanUUeDbi59k6PMktkh8NR-YUJJQk5Hi-OaAvAnCi07rHKGJPKoLXSm1faxxVGNkbJW68YNkrptXJ"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-on-background/80 via-on-background/40 to-transparent" />
          </motion.div>

          {/* Ambient floating embers */}
          {!reduce &&
            [...Array(6)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full bg-secondary-container/50 blur-[1px] z-[5]"
                style={{
                  width: 5 + (i % 3) * 3,
                  height: 5 + (i % 3) * 3,
                  left: `${12 + i * 15}%`,
                  bottom: '8%'
                }}
                animate={{ y: [0, -260 - i * 40], opacity: [0, 0.7, 0] }}
                transition={{ duration: 7 + i * 1.6, repeat: Infinity, delay: i * 1.4, ease: 'easeInOut' }}
              />
            ))}

          <div className="relative z-10 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
            <div className="max-w-2xl text-on-primary">
              <motion.div
                className="flex flex-wrap items-center gap-3 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="flex items-center gap-1 bg-primary px-3 py-1 rounded-full">
                  <Star className="w-[18px] h-[18px] fill-current" />
                  <span className="font-label-md text-label-md">5.0</span>
                </div>
                <span className="text-surface-variant font-label-md text-label-md">
                  North Indian &amp; Street Food
                </span>
                <StatusPill />
              </motion.div>

              <RevealHeadline text="Anaya's Kitchen" className="font-display-lg text-display-lg mb-4" />

              <motion.p
                className="font-body-lg text-body-lg text-surface-variant mb-10 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
              >
                Refined Heritage Home-Style Cooking in Ahmedabad. Experience the warmth of
                traditional recipes crafted with modern elegance.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.8 }}
              >
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={whatsAppOrderLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary text-on-primary px-8 py-4 rounded-full font-label-md text-label-md shadow-lg shadow-primary/30 inline-flex items-center gap-2"
                >
                  <ConciergeBell className="w-5 h-5" /> Order on WhatsApp
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-surface-variant text-surface-variant px-8 py-4 rounded-full font-label-md text-label-md hover:bg-surface-variant hover:text-on-background transition-all inline-block"
                >
                  Get Directions
                </motion.a>
              </motion.div>
            </div>
          </div>

          {/* Scroll cue */}
          <motion.a
            href="#menu"
            aria-label="Scroll to menu"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-on-primary/80 flex flex-col items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <span className="font-label-md text-label-md tracking-widest uppercase text-xs">Explore</span>
            <motion.span
              animate={reduce ? undefined : { y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            >
              <ChevronDown className="w-6 h-6" />
            </motion.span>
          </motion.a>
        </section>

        {/* -------------------------------------------------------- */}
        {/* Marquee ticker                                            */}
        {/* -------------------------------------------------------- */}
        <div className="bg-primary text-on-primary py-3 overflow-hidden relative z-20">
          <div className={`flex whitespace-nowrap w-max ${reduce ? '' : 'marquee-track'}`}>
            {[...Array(2)].map((_, dup) => (
              <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
                {marqueeItems.map((item, i) => (
                  <span key={i} className="flex items-center font-label-md text-label-md tracking-widest uppercase">
                    <span className="px-6">{item}</span>
                    <Sparkles className="w-4 h-4 opacity-70" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/* Info bar                                                  */}
        {/* -------------------------------------------------------- */}
        <motion.section
          className="bg-surface-container-low py-8 relative z-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-2 md:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {[
              { icon: Banknote, label: 'Price Range', value: '₹1–200' },
              { icon: MapPin, label: 'Location', value: 'Shela, Ahmedabad' },
              { icon: Clock, label: 'Hours', value: '7:00 PM – 11:30 PM' },
              { icon: ConciergeBell, label: 'Services', value: 'Dine-in • Delivery' }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="flex items-center gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 6 }}
                  className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0"
                >
                  <item.icon className="w-6 h-6 text-primary" />
                </motion.div>
                <div>
                  <p className="font-label-md text-label-md text-outline">{item.label}</p>
                  <p className="font-label-md text-on-surface">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* -------------------------------------------------------- */}
        {/* Menu                                                      */}
        {/* -------------------------------------------------------- */}
        <section className="py-24 bg-surface scroll-mt-24" id="menu">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="mb-10">
              <SectionHeading eyebrow="Our Selection" title="Signature Offerings" />
            </div>

            {/* Category filter chips */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`relative px-5 py-2 rounded-full font-label-md text-label-md border transition-colors ${
                    activeFilter === f
                      ? 'text-on-primary border-primary'
                      : 'text-on-surface-variant border-outline-variant/50 hover:border-primary hover:text-primary'
                  }`}
                >
                  {activeFilter === f && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 bg-primary rounded-full -z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  {f}
                </button>
              ))}
            </div>

            <motion.div layout className="grid grid-cols-1 md:grid-cols-12 gap-8 h-auto">
              {isLoading ? (
                [1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="md:col-span-4 h-80">
                    <div className="rounded-xl bg-surface-container-high h-full animate-pulse border border-outline-variant/20 shadow-lg" />
                  </div>
                ))
              ) : (
                <AnimatePresence mode="popLayout">
                  {visibleDishes.map((dish, index) => (
                    <motion.div
                      key={dish.title}
                      layout
                      initial={{ opacity: 0, y: 40, scale: 0.96 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.55, delay: (index % 3) * 0.1 }}
                      className="md:col-span-4 h-80"
                    >
                      <TiltCard className="h-full">
                        <div
                          className="group relative overflow-hidden rounded-xl bg-surface-container-high h-full shadow-lg border border-outline-variant/20 cursor-pointer"
                          onClick={() => setSelectedDish(dish)}
                        >
                          <img
                            alt={dish.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            src={dish.image}
                            loading="lazy"
                            decoding="async"
                          />
                          {/* shine sweep on hover */}
                          <span className="shine pointer-events-none" />
                          <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-on-background/20 to-transparent group-hover:bg-on-background/40 transition-colors" />

                          <span className="absolute top-4 left-4 bg-surface/80 backdrop-blur-sm text-on-surface px-3 py-1 rounded-full font-label-md text-xs tracking-widest uppercase">
                            {dish.tag}
                          </span>

                          <div className="absolute bottom-0 left-0 right-0 p-6" style={{ transform: 'translateZ(50px)' }}>
                            {dish.bestseller && (
                              <motion.span
                                className="bg-[#D4AF37] text-on-primary px-4 py-1.5 rounded-full font-label-md text-label-md mb-3 inline-flex items-center gap-1.5 shadow-lg border border-[#F4C430]/30"
                                animate={reduce ? undefined : { y: [-3, 3, -3] }}
                                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                              >
                                <Sparkles className="w-4 h-4" /> Chef's Special
                              </motion.span>
                            )}
                            <h3 className="font-headline-sm text-on-primary text-headline-sm">{dish.title}</h3>
                            <p className="text-surface-variant text-sm mt-2 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-20 transition-all duration-500 line-clamp-2">
                              {dish.description}
                            </p>
                          </div>
                        </div>
                      </TiltCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </motion.div>
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/* About                                                     */}
        {/* -------------------------------------------------------- */}
        <motion.section
          className="py-24 bg-surface-container-low scroll-mt-24"
          id="about"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <TiltCard className="relative">
              <div
                className="aspect-[4/5] rounded-2xl overflow-hidden custom-shadow group"
                style={{ transform: 'translateZ(30px)' }}
              >
                <img
                  alt="Anaya's Kitchen authentic preparation"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGn9pc0_DchMfaSm9LNnNTB6DixccodiYwdOuVAsJTjyaEBcXIl878xB--8c-4QQEyZQglOnTb1SW5lCM7mR0-_92kR763pIJz8_ovm5LjA-_j4-QgmdXJDtgzg5YfDtNustybpLTVMwxzsydoy_kZG-ePZehdhN53Nyhq1NlT3KgQK6rB038Ehr-s9aBWvlBD6YwCMi-kkNmapbx8-Pio7YWDX5W4wyEnymmtre_f9bcbCHiRffb-"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <motion.div
                className="absolute -bottom-8 -right-8 bg-surface-container-highest p-8 rounded-xl hidden md:block max-w-[240px] shadow-xl"
                style={{ transform: 'translateZ(60px)' }}
                initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              >
                <p className="font-headline-sm text-primary italic">"Just like Home."</p>
              </motion.div>
            </TiltCard>

            <div className="space-y-8">
              <SectionHeading eyebrow="Our Heritage" title="Authentic Homemade Excellence" align="left" />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed"
              >
                At Anaya's Kitchen, we believe the best food comes from the heart. We specialize in
                bringing the soulful flavors of North Indian kitchens to Ahmedabad, emphasizing
                hygiene and the highest quality ingredients.
              </motion.p>

              {/* Animated stats */}
              <motion.div
                className="grid grid-cols-3 gap-4 py-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                {[
                  { node: <CountUp to={5.0} decimals={1} />, label: 'Google rating' },
                  { node: <CountUp to={100} suffix="%" />, label: 'Vegetarian' },
                  { node: <CountUp to={20} suffix="+" />, label: 'Dishes made fresh' }
                ].map((s, i) => (
                  <div key={i} className="text-center rounded-xl bg-surface p-4 border border-outline-variant/30">
                    <p className="font-headline-md text-headline-md text-primary">{s.node}</p>
                    <p className="font-label-md text-label-md text-outline mt-1">{s.label}</p>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {[
                  {
                    icon: Leaf,
                    title: 'Offerings',
                    text: 'Quick bites, small plates. 100% vegetarian, Jain options on request.'
                  },
                  {
                    icon: ConciergeBell,
                    title: 'Service Options',
                    text: 'Delivery, Drive-through, Takeaway, Dine-in.'
                  },
                  {
                    icon: Users,
                    title: 'Atmosphere & Crowd',
                    text: 'Casual vibe. Good for groups & kids. Popular for solo dining.'
                  },
                  {
                    icon: CreditCard,
                    title: 'Payments',
                    text: 'UPI, cards, cash and seamless NFC mobile payments.'
                  }
                ].map((f, i) => (
                  <motion.div
                    key={i}
                    variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                    whileHover={{ y: -4 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-surface-container-highest/50 border border-outline-variant/30 hover:bg-surface-container-highest transition-colors"
                  >
                    <f.icon className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-label-md text-on-surface font-bold">{f.title}</h4>
                      <p className="text-sm text-outline mt-1">{f.text}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* -------------------------------------------------------- */}
        {/* FAQ                                                       */}
        {/* -------------------------------------------------------- */}
        <section className="py-24 bg-surface-container-low scroll-mt-24" id="faq">
          <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="mb-16">
              <SectionHeading eyebrow="Questions" title="Frequently Asked" />
            </div>
            <div className="space-y-4">
              {[
                {
                  question: 'What are your delivery times?',
                  answer:
                    'We offer delivery from 11:00 AM to 11:00 PM every day. For scheduled or bulk orders, please place your request at least 24 hours in advance.'
                },
                {
                  question: 'Do you offer pure vegetarian options?',
                  answer:
                    'Yes! Our entire menu is 100% vegetarian. We also have Jain options available upon request for many of our dishes.'
                },
                {
                  question: 'How can I place a bulk order for an event?',
                  answer:
                    'For catering or bulk orders, you can contact us directly at our phone number or message us on WhatsApp. We offer customized menus and special pricing for large groups.'
                },
                {
                  question: 'Is the food prepared fresh?',
                  answer:
                    'Absolutely. We pride ourselves on using fresh, locally sourced ingredients daily, ensuring every meal tastes like a warm, home-cooked treat.'
                }
              ].map((faq, idx) => (
                <FAQItem key={idx} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/* Reviews                                                   */}
        {/* -------------------------------------------------------- */}
        <motion.section
          className="py-24 bg-surface overflow-hidden scroll-mt-24"
          id="reviews"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-16">
              <div>
                <SectionHeading eyebrow="Guest Experiences" title="What Our Diners Say" align="left" />
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex text-[#fbbc04] gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0, rotate: -90 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 300 }}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </motion.span>
                    ))}
                  </div>
                  <span className="font-label-md text-on-surface font-bold">5.0</span>
                  <span className="font-label-md text-label-md text-outline">on Google Reviews</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  aria-label="Previous reviews"
                  className="w-12 h-12 rounded-full border border-outline flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all group"
                  onClick={() => scrollCarousel(-1)}
                >
                  <ChevronLeft className="w-6 h-6 text-on-surface group-hover:text-on-primary transition-colors" />
                </button>
                <button
                  aria-label="Next reviews"
                  className="w-12 h-12 rounded-full border border-outline flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all group"
                  onClick={() => scrollCarousel(1)}
                >
                  <ChevronRight className="w-6 h-6 text-on-surface group-hover:text-on-primary transition-colors" />
                </button>
              </div>
            </div>

            <div
              className="flex gap-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8"
              ref={carouselRef}
            >
              {isLoading
                ? [1, 2, 3, 4].map((i) => (
                    <div key={i} className="min-w-[320px] md:min-w-[400px] snap-start min-h-[300px]">
                      <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/30 h-full animate-pulse" />
                    </div>
                  ))
                : reviewsData.map((review, i) => (
                    <motion.div
                      key={i}
                      className="min-w-[320px] md:min-w-[400px] snap-start h-auto"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      <TiltCard className="h-full">
                        <div
                          className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/30 h-full flex flex-col justify-between"
                          style={{ transform: 'translateZ(30px)' }}
                        >
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex text-[#fbbc04] gap-1">
                                {[...Array(5)].map((_, s) => (
                                  <Star key={s} className="w-5 h-5 fill-current" />
                                ))}
                              </div>
                              <span className="text-xs text-outline font-medium">{review.when}</span>
                            </div>
                            <p
                              className="font-body-md text-on-surface-variant mb-6"
                              style={{ transform: 'translateZ(20px)' }}
                            >
                              "{review.text}"
                            </p>
                          </div>
                          <div
                            className="flex items-center justify-between"
                            style={{ transform: 'translateZ(40px)' }}
                          >
                            <div className="flex items-center gap-4">
                              <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  review.name
                                )}&background=random`}
                                alt={review.name}
                                className="w-10 h-10 rounded-full"
                                loading="lazy"
                                decoding="async"
                              />
                              <div>
                                <p className="font-label-md text-on-surface">{review.name}</p>
                                <p className="text-xs text-outline">{review.meta}</p>
                              </div>
                            </div>
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                              alt="Google"
                              className="w-5 h-5 opacity-80"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                        </div>
                      </TiltCard>
                    </motion.div>
                  ))}
            </div>
          </div>
        </motion.section>

        {/* -------------------------------------------------------- */}
        {/* Contact                                                   */}
        {/* -------------------------------------------------------- */}
        <motion.section
          className="py-24 bg-surface-container-high scroll-mt-24"
          id="contact"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <SectionHeading eyebrow="Visit Us" title="Find Your Way" align="left" />
                <div className="space-y-6">
                  {[
                    {
                      icon: MapPin,
                      title: 'Address',
                      body: 'Orchid Blues, G 806, Shela, Ahmedabad, Gujarat 380058'
                    },
                    { icon: Smartphone, title: 'Contact', body: '+91 96625 21407' },
                    { icon: Clock, title: 'Opening Hours', body: 'Daily: 7:00 PM – 11:30 PM' }
                  ].map((row, i) => (
                    <motion.div
                      key={i}
                      className="flex gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <row.icon className="w-6 h-6 text-primary mt-1 shrink-0" />
                      <div>
                        <h4 className="font-label-md text-on-surface font-bold">{row.title}</h4>
                        <p className="text-on-surface-variant">{row.body}</p>
                        {row.title === 'Opening Hours' && <StatusPill className="mt-2" />}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4">
                  <motion.a
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary text-on-primary px-10 py-4 rounded-full font-label-md text-label-md shadow-lg shadow-primary/20 inline-flex items-center gap-2 w-fit"
                  >
                    <Navigation className="w-5 h-5" />
                    Get Directions
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    href={`tel:+${WHATSAPP_NUMBER}`}
                    className="border border-outline text-on-surface px-10 py-4 rounded-full font-label-md text-label-md inline-flex items-center gap-2 w-fit hover:border-primary hover:text-primary transition-colors"
                  >
                    <Smartphone className="w-5 h-5" />
                    Call Us
                  </motion.a>
                </div>
              </div>
              <motion.div
                className="rounded-2xl overflow-hidden h-[400px] shadow-lg relative bg-surface border border-outline-variant/30"
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <iframe
                  title="Anaya's Kitchen Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src="https://maps.google.com/maps?q=Anaya's%20Kitchen,%20Orchid%20Blues,%20G%20806,%20Shela,%20Ahmedabad,%20Gujarat%20380058&t=&z=15&ie=UTF8&iwloc=&output=embed"
                />
              </motion.div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* ---------------------------------------------------------- */}
      {/* Footer                                                      */}
      {/* ---------------------------------------------------------- */}
      <footer className="bg-surface-container-highest border-t border-outline-variant/30 pt-16 pb-8">
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="font-headline-sm text-headline-sm text-primary">Anaya's Kitchen</div>
              <p className="font-body-md text-on-surface-variant">
                Refined Heritage Home-Style Cooking. Authentic North Indian &amp; Street Food in
                Ahmedabad.
              </p>
              <div className="flex items-center gap-4 pt-4">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-[#25D366] hover:text-white transition-colors custom-shadow"
                >
                  <svg fill="currentColor" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.176 0 6.161 1.237 8.404 3.48s3.48 5.228 3.48 8.404c0 6.556-5.332 11.888-11.888 11.888-2.003 0-3.967-.506-5.717-1.464l-6.306 1.7zm6.3-4.064c1.551.921 3.284 1.408 5.053 1.408 5.403 0 9.803-4.401 9.803-9.803s-4.4-9.803-9.803-9.803-9.803 4.401-9.803 9.803c0 1.932.569 3.815 1.644 5.419l-.173.254-1.009 3.684 3.774-.99.254.173zm11.23-5.372c-.303-.152-1.794-.885-2.073-.986-.279-.101-.482-.152-.684.152-.202.304-.784.986-.962 1.189-.177.203-.355.228-.658.076-.303-.152-1.282-.472-2.441-1.507-.901-.803-1.509-1.796-1.686-2.099-.177-.304-.019-.468.133-.619.136-.136.303-.354.455-.532.152-.177.202-.304.304-.506.101-.203.051-.38-.025-.532-.076-.152-.684-1.646-.937-2.253-.247-.591-.498-.511-.684-.52l-.583-.008c-.202 0-.532.076-.811.38-.279.304-1.064 1.039-1.064 2.533s1.089 2.938 1.241 3.141c.152.203 2.142 3.272 5.19 4.587.724.312 1.291.498 1.731.638.728.231 1.391.198 1.915.12.584-.088 1.794-.734 2.047-1.443.254-.709.254-1.317.177-1.443-.076-.127-.279-.203-.582-.355z" />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-[#E1306C] hover:text-white transition-colors custom-shadow"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-label-lg font-bold text-on-surface">Location</h4>
              <p className="font-body-md text-on-surface-variant">
                Orchid Blues, G 806
                <br />
                Shela, Ahmedabad
                <br />
                Gujarat 380058
              </p>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-label-md text-primary hover:text-secondary inline-flex items-center gap-1 transition-colors"
              >
                <MapPin className="w-4 h-4" /> Get Directions
              </a>
            </div>
            <div className="space-y-4">
              <h4 className="font-label-lg font-bold text-on-surface">Contact &amp; Hours</h4>
              <p className="font-body-md text-on-surface-variant">
                <span className="block mb-2">
                  <strong>Phone:</strong>{' '}
                  <a href={`tel:+${WHATSAPP_NUMBER}`} className="hover:text-primary transition-colors">
                    +91 96625 21407
                  </a>
                </span>
                <span className="block mb-1">
                  <strong>Daily:</strong>
                </span>
                7:00 PM – 11:30 PM
              </p>
              <StatusPill />
            </div>
            <div className="space-y-4">
              <h4 className="font-label-lg font-bold text-on-surface">Payment Methods</h4>
              <p className="font-body-md text-on-surface-variant mb-2">
                We accept all major payment options:
              </p>
              <div className="flex gap-2 text-on-surface-variant">
                <CreditCard className="w-8 h-8 opacity-70" />
                <Banknote className="w-8 h-8 opacity-70" />
                <Smartphone className="w-8 h-8 opacity-70" />
              </div>
              <p className="font-label-md text-xs text-outline mt-2">UPI, Credit/Debit Cards, Cash</p>
            </div>
          </div>

          <div className="border-t border-outline-variant/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-on-surface-variant">
              © {new Date().getFullYear()} Anaya's Kitchen. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a className="text-sm text-on-surface-variant hover:text-secondary transition-colors" href="#">
                Privacy Policy
              </a>
              <a className="text-sm text-on-surface-variant hover:text-secondary transition-colors" href="#">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp FAB */}
      <motion.a
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-xl flex items-center justify-center group"
        href={whatsAppOrderLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1.6, type: 'spring', stiffness: 260, damping: 18 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
      >
        <svg fill="currentColor" height="32" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.176 0 6.161 1.237 8.404 3.48s3.48 5.228 3.48 8.404c0 6.556-5.332 11.888-11.888 11.888-2.003 0-3.967-.506-5.717-1.464l-6.306 1.7zm6.3-4.064c1.551.921 3.284 1.408 5.053 1.408 5.403 0 9.803-4.401 9.803-9.803s-4.4-9.803-9.803-9.803-9.803 4.401-9.803 9.803c0 1.932.569 3.815 1.644 5.419l-.173.254-1.009 3.684 3.774-.99.254.173zm11.23-5.372c-.303-.152-1.794-.885-2.073-.986-.279-.101-.482-.152-.684.152-.202.304-.784.986-.962 1.189-.177.203-.355.228-.658.076-.303-.152-1.282-.472-2.441-1.507-.901-.803-1.509-1.796-1.686-2.099-.177-.304-.019-.468.133-.619.136-.136.303-.354.455-.532.152-.177.202-.304.304-.506.101-.203.051-.38-.025-.532-.076-.152-.684-1.646-.937-2.253-.247-.591-.498-.511-.684-.52l-.583-.008c-.202 0-.532.076-.811.38-.279.304-1.064 1.039-1.064 2.533s1.089 2.938 1.241 3.141c.152.203 2.142 3.272 5.19 4.587.724.312 1.291.498 1.731.638.728.231 1.391.198 1.915.12.584-.088 1.794-.734 2.047-1.443.254-.709.254-1.317.177-1.443-.076-.127-.279-.203-.582-.355z" />
        </svg>
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-3 transition-all duration-300 font-label-md text-label-md">
          Order Now
        </span>
      </motion.a>

      {/* Back to top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })}
            aria-label="Back to top"
            className="fixed bottom-8 left-8 z-50 w-12 h-12 rounded-full bg-surface-container-highest border border-outline-variant/40 shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Welcome toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-surface-container-high border border-outline-variant/30 text-on-surface px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 max-w-[92vw]"
          >
            <div className="bg-primary/10 p-2 rounded-full text-primary">
              <ConciergeBell className="w-5 h-5" />
            </div>
            <div>
              <p className="font-label-md font-bold text-on-surface">Welcome to Anaya's Kitchen!</p>
              <p className="text-sm text-on-surface-variant">
                Experience the warmth of home-style cooking.
              </p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              aria-label="Dismiss"
              className="ml-4 text-on-surface-variant hover:text-on-surface transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dish lightbox */}
      <AnimatePresence>
        {selectedDish && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedDish(null)}
            role="dialog"
            aria-modal="true"
            aria-label={selectedDish.title}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-surface-container-low rounded-2xl overflow-hidden shadow-2xl max-w-2xl w-full border border-outline-variant/30 flex flex-col md:flex-row relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-surface/50 backdrop-blur-md rounded-full text-on-surface hover:bg-surface transition-colors"
                onClick={() => setSelectedDish(null)}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-full md:w-1/2 aspect-square md:aspect-auto h-64 md:h-auto relative">
                <img
                  src={selectedDish.image}
                  alt={selectedDish.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                {selectedDish.bestseller && (
                  <span className="bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full font-label-md text-xs mb-4 inline-flex items-center gap-1 w-fit border border-[#D4AF37]/30">
                    <Sparkles className="w-3 h-3" /> Chef's Special
                  </span>
                )}
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">
                  {selectedDish.title}
                </h3>
                <p className="font-body-md text-on-surface-variant leading-relaxed mb-6">
                  {selectedDish.description}
                </p>
                <a
                  href={whatsAppOrderLink(selectedDish.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white px-6 py-3 rounded-full font-label-md text-label-md inline-flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all w-fit"
                >
                  <ConciergeBell className="w-4 h-4" /> Order this on WhatsApp
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
