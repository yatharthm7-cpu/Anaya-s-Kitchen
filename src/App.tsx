import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate, AnimatePresence } from 'motion/react';
import {
  Banknote,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  ConciergeBell,
  Leaf,
  MapPin,
  Smartphone,
  Navigation,
  Map as MapIcon,
  Star,
  Sparkles,
  Users,
  CreditCard,
  X
} from 'lucide-react';

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { damping: 30, stiffness: 200 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { damping: 30, stiffness: 200 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = event.clientX - rect.left;
    const mouseYPos = event.clientY - rect.top;
    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-outline-variant/30 rounded-2xl bg-surface overflow-hidden hover:bg-surface-container-lowest transition-colors">
      <button 
        onClick={() => setIsOpen(!isOpen)}
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
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-5 pt-0">
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type Dish = {
  title: string;
  image: string;
  description: string;
  bestseller?: boolean;
};

const dishesData: Dish[] = [
  {
    title: "Most Wanted Dahi Bhalla",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfT3QjwkjYiyYlGxjj6K_jEsMmbAXZkPIO90_XAXteVah-pR9c7yLk0rRI6MkJOhr707X7oMk9NG6Pn5u9GXS-cYPLPgX7Hv0-8GrzLWQ7Wn9nxnXUtG756DrkihmXlXHGhGwk1-GZZpsQql6kdU1OCZYpvQ9TZDYE4v41HOVcMjdLuGokp9bAMuov3VN_A9g4ZH6DXKjQ9xpBD2OpfZSExPzvOainvr90Z1jgZaZaKjTKEvcnXWD2VKgGeRdqRQEsuw",
    description: "Dahi bhalla is a refreshing North Indian snack featuring soft lentil dumplings soaked in creamy yogurt, topped with sweet tamarind chutney, spicy green chutney and a sprinkle of spices. A perfect balance of sweet, tangy and savory flavors.",
    bestseller: true,
  },
  {
    title: "Stuffed Cheese Paneer Kulcha",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCW7EEpBs7Y6zPw8hT9zbMaWXYw959JEc8E0jsJM90ypOSI8jMW2Jo5aN3U3YW15kGJA1wd9D8D6gyaFZeXK21KMEJBBZZL4QsQ7OtZnIPI7DFkEnc4g-YHFyHD74TMtyenq6UFsxsMS-4ePNn9mmeGuhQGyBUa6Y7J9HSrdmopacub--YxBhAqQXTuinJDQv8kAjwNJvecP1Bp_6MaRvpXmFIe-GS5DAnzBdRyt-Ktcy2sBAoMWSMqsO8WhxvcUfeYBA",
    description: "Our signature Kulcha, stuffed generously with a delightful blend of premium cheese and spiced paneer. Baked to a perfect golden brown, offering a soft yet crisp texture in every bite.",
  },
  {
    title: "Delhi Matar Kulcha",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIvLdpHuHGwy4CRXg9NM5Xju3Fd60XLHqf99WmtlzLMcuCMRQGSOa9xumf_su7VqvG-_CMClux59RTQ-TD3E0Mbl3pMrjjDBGsjVakKhT-1EYMDTOkcteMf2dHt_yHEfNtcMWHRdqRkCGtJpUSCaULwxoCeaEbTTofVySovjQ6svoVkQNV87x8RD8kSpxsoSwMd7hOOMlHcm412aBjL8tdMWxJqJxA-6w8VdxNHuV98YOi2nLGh0HdWfg2KBNXwnEOsw",
    description: "A classic street food from the heart of Delhi. Fluffy, warm kulchas served alongside a tangy, spicy, and perfectly cooked white pea (matar) curry, garnished with onions, green chilies, and a squeeze of lime.",
  },
  {
    title: "Katori Chaat",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfcRAhQPYBtk6gd7BePDQQNISmL5KmMX0SsW5axHTJMeVVYBpFDivdSuO-sS4gk_Gbc2m5xn2aGsb43bIOkzGHD-tEwjzxYNu0RPBAY9A2rbYh15YA7GvpK_sUdvtiYYaM3LQCi3ehB8awydSJdAxNzmVvXOnI0JDSv04QgGykmyMVuUUY0iMFrpXObCD1QtxFI5ue6MnrdIiimng8zfV5GlC4oEaGsqt1yubJ9osDioHaHsiaDVlOFa1yUYpx-eDZ8A",
    description: "An innovative chaat served in a crispy, edible 'katori' (bowl) made of fried potato or dough. Filled with a vibrant mix of sprouts, boiled potatoes, chutneys, yogurt, and spices, offering an explosion of flavors and textures.",
  },
  {
    title: "Spring Roll",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxlL9OvikQwN42NmV6mDPZVM6wjsr-YsUwg0u9FRIGFJDnvUDyuJZ4HAgbgr0esQdv_hJZEjvbrUa918p9GLc1UxADTSty-1g63y1mQ_hGnulzmMTJB2kG6EO4_tSnhgGhontclJrzE7rY9IatlVUMkqZxodnLiD6Pe2SGQT7RrDlXlyS4n77vFQeMqAgQellsq12_0ZGaMyErHtX_jK9sKlQVFP0OEtMLTd-xbCjeFNdwZqMo1ROKonFHphpfzLjQjw",
    description: "Crispy, golden-fried rolls stuffed with a savory filling of finely shredded vegetables. Served piping hot with our house-special sweet chili sauce, these make for an irresistible appetizer.",
  },
  {
    title: "Caramelized Rice Pudding",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIBIa-9KCY5Dt7XZ2NuwQkb5QprPuKsij-ImWeU6xMFvPPoD6TyL-VwI8FR6WKdN9o3dJo1rW87Wx6j47zGMCPZwI_wQZRuik1ui3BnKUU_IB-xnU3k9ZVy96hqiqKwj3-kZatCdq7jEwi-2d4Scaynk6rIDU8RvLwuK_dlL2o7ScEqafpH7asmBebMfIT-pEugjSkgnryu-lEHsFE_CpuAsZurBoobn3AgbIV68aRh2H8q1JGBh3FluCXnWAfRNQNdA",
    description: "A rich and creamy traditional rice pudding, elevated with a luscious, torched caramel crust. This decadent dessert blends the comforting sweetness of slow-cooked rice with a sophisticated hint of burnt sugar.",
  }
];

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroScale = useTransform(scrollY, [0, 1000], [1, 1.2]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Active Nav Link Tracker
    const handleScroll = () => {
      let current = "";
      const sections = document.querySelectorAll("section");

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        // Subtract a bit more than the header height for a smoother transition
        if (window.pageYOffset >= sectionTop - 150) {
          current = section.getAttribute("id") || "";
        }
      });
      if (current) {
         setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollCarousel = (direction: number) => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth * 0.8;
      carouselRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body-md overflow-x-hidden min-h-screen">
      {/* Header (Shared Component: TopAppBar) */}
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md shadow-sm transition-all duration-300">
        <nav className="flex justify-between items-center px-margin-desktop py-4 max-w-container-max mx-auto">
          <div className="font-headline-md text-headline-md text-primary tracking-tight">Anaya's Kitchen</div>
          <div className="hidden md:flex items-center gap-8">
            <a 
              className={`font-label-md text-label-md transition-colors ${activeSection === 'home' ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`} 
              href="#home"
            >
              Home
            </a>
            <a 
              className={`font-label-md text-label-md transition-colors ${activeSection === 'menu' ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`} 
              href="#menu"
            >
              Menu
            </a>
            <a 
              className={`font-label-md text-label-md transition-colors ${activeSection === 'about' ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`} 
              href="#about"
            >
              About
            </a>
            <a 
              className={`font-label-md text-label-md transition-colors ${activeSection === 'reviews' ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`} 
              href="#reviews"
            >
              Reviews
            </a>
            <a 
              className={`font-label-md text-label-md transition-colors ${activeSection === 'contact' ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`} 
              href="#contact"
            >
              Contact
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://maps.google.com/maps?q=Anaya's%20Kitchen,%20Orchid%20Blues,%20G%20806,%20Shela,%20Ahmedabad,%20Gujarat%20380058"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:block font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
            >
              Directions
            </a>
          </div>
        </nav>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden" id="home">
          <motion.div 
            className="absolute inset-0 z-0"
            style={{ y: heroY, scale: heroScale, opacity }}
          >
            <img 
              alt="Anaya's Kitchen Header" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXBStxReSqKrnKU7Cm77SHGafL2d8lCDtXbizEkosFT_4AXzOrrrUHcfpNIMY27J9T-NXZDYcfFeRLPDAV_J1C_CIt-tMvGmfJJhiHgrcVoskq5XhfcO1WkFdfHmYj2qkE8uA56vK78xFJGOBy-1Zu4DL5DbLR0nSICWSlETJGanUUeDbi59k6PMktkh8NR-YUJJQk5Hi-OaAvAnCi07rHKGJPKoLXSm1faxxVGNkbJW68YNkrptXJ"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-on-background/80 via-on-background/40 to-transparent"></div>
          </motion.div>
          <motion.div 
            className="relative z-10 px-margin-desktop max-w-container-max mx-auto w-full"
            initial={{ opacity: 0, y: 50, rotateX: 45 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ perspective: 1000 }}
          >
            <motion.div 
              className="max-w-2xl text-on-primary"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1 bg-primary px-3 py-1 rounded-full">
                  <Star className="w-[18px] h-[18px] fill-current" />
                  <span className="font-label-md text-label-md">5.0</span>
                </div>
                <span className="text-surface-variant font-label-md text-label-md">North Indian &amp; Street Food</span>
              </div>
              <h1 className="font-display-lg text-display-lg mb-4">Anaya's Kitchen</h1>
              <p className="font-body-lg text-body-lg text-surface-variant mb-10 leading-relaxed">
                Refined Heritage Home-Style Cooking in Ahmedabad. Experience the warmth of traditional recipes crafted with modern elegance.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.a 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                  href="https://maps.google.com/maps?q=Anaya's%20Kitchen,%20Orchid%20Blues,%20G%20806,%20Shela,%20Ahmedabad,%20Gujarat%20380058"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-surface-variant text-surface-variant px-8 py-4 rounded-full font-label-md text-label-md hover:bg-surface-variant hover:text-on-background transition-all inline-block"
                >
                  Get Directions
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Info Bar */}
        <motion.section 
          className="bg-surface-container-low py-8 relative z-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Banknote className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-label-md text-label-md text-outline">Price Range</p>
                <p className="font-label-md text-on-surface">₹1–200</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-label-md text-label-md text-outline">Location</p>
                <p className="font-label-md text-on-surface">Shela, Ahmedabad</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-label-md text-label-md text-outline">Hours</p>
                <p className="font-label-md text-on-surface">Opens 7:00 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ConciergeBell className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-label-md text-label-md text-outline">Services</p>
                <p className="font-label-md text-on-surface">Dine-in • Delivery</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Featured Menu (Bento Grid Style) */}
        <motion.section 
          className="py-24 bg-surface" 
          id="menu"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-container-max mx-auto px-margin-desktop">
            <div className="text-center mb-16">
              <span className="font-label-md text-label-md text-primary uppercase tracking-widest">Our Selection</span>
              <h2 className="font-headline-md text-headline-md mt-2">Signature Offerings</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-auto">
              
              {isLoading ? (
                <>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <TiltCard key={i} className="md:col-span-4 h-80">
                      <div className="rounded-xl bg-surface-container-high h-full animate-pulse border border-outline-variant/20 shadow-lg"></div>
                    </TiltCard>
                  ))}
                </>
              ) : (
                <>
                  {dishesData.map((dish, index) => (
                    <TiltCard key={index} className="md:col-span-4 h-80">
                      <div 
                        className="group relative overflow-hidden rounded-xl bg-surface-container-high h-full shadow-lg border border-outline-variant/20 cursor-pointer"
                        onClick={() => setSelectedDish(dish)}
                      >
                        <img 
                          alt={dish.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                          src={dish.image} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-on-background/20 to-transparent group-hover:bg-on-background/40 transition-colors"></div>
                        <div className="absolute bottom-0 left-0 p-6" style={{ transform: "translateZ(50px)" }}>
                          {dish.bestseller && (
                            <span className="bg-secondary text-on-secondary px-3 py-1 rounded-full font-label-md text-label-md mb-2 inline-block">Bestseller</span>
                          )}
                          <h3 className="font-headline-sm text-on-primary text-headline-sm">{dish.title}</h3>
                        </div>
                      </div>
                    </TiltCard>
                  ))}
                </>
              )}
            </div>
          </div>
        </motion.section>

        {/* About Section */}
        <motion.section 
          className="py-24 bg-surface-container-low" 
          id="about"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <TiltCard className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden custom-shadow" style={{ transform: "translateZ(30px)" }}>
                <img 
                  alt="Anaya's Kitchen Authentic Prep" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGn9pc0_DchMfaSm9LNnNTB6DixccodiYwdOuVAsJTjyaEBcXIl878xB--8c-4QQEyZQglOnTb1SW5lCM7mR0-_92kR763pIJz8_ovm5LjA-_j4-QgmdXJDtgzg5YfDtNustybpLTVMwxzsydoy_kZG-ePZehdhN53Nyhq1NlT3KgQK6rB038Ehr-s9aBWvlBD6YwCMi-kkNmapbx8-Pio7YWDX5W4wyEnymmtre_f9bcbCHiRffb-" 
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-surface-container-highest p-8 rounded-xl hidden md:block max-w-[240px] shadow-xl" style={{ transform: "translateZ(60px)" }}>
                <p className="font-headline-sm text-primary italic">"Just like Home."</p>
              </div>
            </TiltCard>
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <span className="font-label-md text-label-md text-primary uppercase tracking-widest">Our Heritage</span>
                <h2 className="font-headline-md text-headline-md">Authentic Homemade Excellence</h2>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed"
              >
                At Anaya's Kitchen, we believe the best food comes from the heart. We specialize in bringing the soulful flavors of North Indian kitchens to Ahmedabad, emphasizing hygiene and the highest quality ingredients.
              </motion.p>
              
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-surface-container-highest/50 border border-outline-variant/30 hover:bg-surface-container-highest transition-colors"
                >
                  <Leaf className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-label-md text-on-surface font-bold">Offerings</h4>
                    <p className="text-sm text-outline mt-1">Quick bite, Small plates, Vegetarian options only.</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-surface-container-highest/50 border border-outline-variant/30 hover:bg-surface-container-highest transition-colors"
                >
                  <ConciergeBell className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-label-md text-on-surface font-bold">Service Options</h4>
                    <p className="text-sm text-outline mt-1">Delivery, Drive-through, Takeaway, Dine-in.</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-surface-container-highest/50 border border-outline-variant/30 hover:bg-surface-container-highest transition-colors"
                >
                  <Users className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-label-md text-on-surface font-bold">Atmosphere & Crowd</h4>
                    <p className="text-sm text-outline mt-1">Casual vibe. Good for groups & kids. Popular for solo dining.</p>
                  </div>
                </motion.div>

                <motion.div 
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-surface-container-highest/50 border border-outline-variant/30 hover:bg-surface-container-highest transition-colors"
                >
                  <CreditCard className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-label-md text-on-surface font-bold">Payments</h4>
                    <p className="text-sm text-outline mt-1">Seamless NFC mobile payments accepted.</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section 
          className="py-24 bg-surface-container-low" 
          id="faq"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-3xl mx-auto px-margin-desktop">
            <div className="text-center mb-16">
              <span className="font-label-md text-label-md text-primary uppercase tracking-widest">Questions</span>
              <h2 className="font-headline-md text-headline-md mt-4">Frequently Asked</h2>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  question: "What are your delivery times?",
                  answer: "We offer delivery from 11:00 AM to 11:00 PM every day. For scheduled or bulk orders, please place your request at least 24 hours in advance."
                },
                {
                  question: "Do you offer pure vegetarian options?",
                  answer: "Yes! Our entire menu is 100% vegetarian. We also have Jain options available upon request for many of our dishes."
                },
                {
                  question: "How can I place a bulk order for an event?",
                  answer: "For catering or bulk orders, you can contact us directly at our phone number or visit our restaurant. We offer customized menus and special pricing for large groups."
                },
                {
                  question: "Is the food prepared fresh?",
                  answer: "Absolutely. We pride ourselves on using fresh, locally sourced ingredients daily, ensuring every meal tastes like a warm, home-cooked treat."
                }
              ].map((faq, idx) => (
                <FAQItem key={idx} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </motion.section>

        {/* Reviews Section */}
        <motion.section 
          className="py-24 bg-surface overflow-hidden" 
          id="reviews"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-container-max mx-auto px-margin-desktop">
            <div className="flex justify-between items-end mb-16">
              <div>
                <span className="font-label-md text-label-md text-primary uppercase tracking-widest">Guest Experiences</span>
                <h2 className="font-headline-md text-headline-md mt-2">What Our Diners Say</h2>
              </div>
              <div className="flex gap-4">
                <button 
                  className="w-12 h-12 rounded-full border border-outline flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all group" 
                  onClick={() => scrollCarousel(-1)}
                >
                  <ChevronLeft className="w-6 h-6 text-on-surface group-hover:text-on-primary transition-colors" />
                </button>
                <button 
                  className="w-12 h-12 rounded-full border border-outline flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all group" 
                  onClick={() => scrollCarousel(1)}
                >
                  <ChevronRight className="w-6 h-6 text-on-surface group-hover:text-on-primary transition-colors" />
                </button>
              </div>
            </div>
            <div className="flex gap-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8" id="review-carousel" ref={carouselRef}>
              
              {isLoading ? (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <TiltCard key={i} className="min-w-[320px] md:min-w-[400px] snap-start h-full min-h-[300px]">
                      <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/30 h-full flex flex-col justify-between animate-pulse">
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <div className="h-4 w-24 bg-outline-variant/50 rounded"></div>
                            <div className="h-3 w-16 bg-outline-variant/50 rounded"></div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-3 w-full bg-outline-variant/50 rounded"></div>
                            <div className="h-3 w-full bg-outline-variant/50 rounded"></div>
                            <div className="h-3 w-3/4 bg-outline-variant/50 rounded"></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-8">
                          <div className="w-10 h-10 rounded-full bg-outline-variant/50"></div>
                          <div className="space-y-2">
                            <div className="h-3 w-20 bg-outline-variant/50 rounded"></div>
                            <div className="h-2 w-16 bg-outline-variant/50 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  ))}
                </>
              ) : (
                <>
                  {/* Testimonial 1 */}
                  <TiltCard className="min-w-[320px] md:min-w-[400px] snap-start h-full">
                <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/30 h-full flex flex-col justify-between" style={{ transform: "translateZ(30px)" }}>
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex text-[#fbbc04] gap-1">
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                      </div>
                      <span className="text-xs text-outline font-medium">2 months ago</span>
                    </div>
                    <p className="font-body-md text-on-surface-variant mb-6" style={{ transform: "translateZ(20px)" }}>"If you’re looking for a restaurant that serves hygienic and delicious home style food, your search ends at Anaya’s Kitchen. I have ordered food from there many times and have never been disappointed. The food is very tasty and hygienic, and even my children love it."</p>
                  </div>
                  <div className="flex items-center justify-between" style={{ transform: "translateZ(40px)" }}>
                    <div className="flex items-center gap-4">
                      <img src="https://ui-avatars.com/api/?name=Anshu+Sharma&background=random" alt="Anshu Sharma" className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-label-md text-on-surface">Anshu Sharma</p>
                        <p className="text-xs text-outline">2 reviews</p>
                      </div>
                    </div>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5 opacity-80" />
                  </div>
                </div>
              </TiltCard>
              
              {/* Testimonial 2 */}
              <TiltCard className="min-w-[320px] md:min-w-[400px] snap-start h-full">
                <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/30 h-full flex flex-col justify-between" style={{ transform: "translateZ(30px)" }}>
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex text-[#fbbc04] gap-1">
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                      </div>
                      <span className="text-xs text-outline font-medium">a year ago</span>
                    </div>
                    <p className="font-body-md text-on-surface-variant mb-6" style={{ transform: "translateZ(20px)" }}>"Each and every food item is sooo delicious.. Superb presentation and taste is always beyond the expectations.. Keep it up.."</p>
                  </div>
                  <div className="flex items-center justify-between" style={{ transform: "translateZ(40px)" }}>
                    <div className="flex items-center gap-4">
                      <img src="https://ui-avatars.com/api/?name=Mousmi+Parmar&background=random" alt="Mousmi Parmar" className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-label-md text-on-surface">Mousmi Parmar</p>
                        <p className="text-xs text-outline">3 reviews · 2 photos</p>
                      </div>
                    </div>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5 opacity-80" />
                  </div>
                </div>
              </TiltCard>
              
              {/* Testimonial 3 */}
              <TiltCard className="min-w-[320px] md:min-w-[400px] snap-start h-full">
                <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/30 h-full flex flex-col justify-between" style={{ transform: "translateZ(30px)" }}>
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex text-[#fbbc04] gap-1">
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                      </div>
                      <span className="text-xs text-outline font-medium">6 months ago</span>
                    </div>
                    <p className="font-body-md text-on-surface-variant mb-6" style={{ transform: "translateZ(20px)" }}>"The flavors were perfectly balanced Compliments to the chef! This was unbelievably delicious."</p>
                  </div>
                  <div className="flex items-center justify-between" style={{ transform: "translateZ(40px)" }}>
                    <div className="flex items-center gap-4">
                      <img src="https://ui-avatars.com/api/?name=palanethra+shivacharya&background=random" alt="palanethra shivacharya" className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-label-md text-on-surface">palanethra shivacharya</p>
                        <p className="text-xs text-outline">4 reviews</p>
                      </div>
                    </div>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5 opacity-80" />
                  </div>
                </div>
              </TiltCard>
              
              {/* Testimonial 4 */}
              <TiltCard className="min-w-[320px] md:min-w-[400px] snap-start h-full">
                <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/30 h-full flex flex-col justify-between" style={{ transform: "translateZ(30px)" }}>
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex text-[#fbbc04] gap-1">
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                      </div>
                      <span className="text-xs text-outline font-medium">a year ago</span>
                    </div>
                    <p className="font-body-md text-on-surface-variant mb-6" style={{ transform: "translateZ(20px)" }}>"Every meal from this tiffin service feels like a warm, home-cooked treat. The quality of the ingredients, the balance of flavors, and the attention to detail in every dish make each delivery a delight."</p>
                  </div>
                  <div className="flex items-center justify-between" style={{ transform: "translateZ(40px)" }}>
                    <div className="flex items-center gap-4">
                      <img src="https://ui-avatars.com/api/?name=TUMPA+MONDAL&background=random" alt="TUMPA MONDAL" className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-label-md text-on-surface">TUMPA MONDAL</p>
                        <p className="text-xs text-outline">2 reviews · 21 photos</p>
                      </div>
                    </div>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5 opacity-80" />
                  </div>
                </div>
              </TiltCard>
                </>
              )}
            </div>
          </div>
        </motion.section>

        {/* Location & Contact */}
        <motion.section 
          className="py-24 bg-surface-container-high" 
          id="contact"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-container-max mx-auto px-margin-desktop">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <span className="font-label-md text-label-md text-primary uppercase tracking-widest">Visit Us</span>
                  <h2 className="font-headline-md text-headline-md mt-2">Find Your Way</h2>
                </div>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <MapPin className="w-6 h-6 text-primary mt-1 shrink-0" />
                    <div>
                      <h4 className="font-label-md text-on-surface font-bold">Address</h4>
                      <p className="text-on-surface-variant">Orchid Blues, G 806, Shela, Ahmedabad, Gujarat 380058</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Smartphone className="w-6 h-6 text-primary mt-1 shrink-0" />
                    <div>
                      <h4 className="font-label-md text-on-surface font-bold">Contact</h4>
                      <p className="text-on-surface-variant">+91 96625 21407</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Clock className="w-6 h-6 text-primary mt-1 shrink-0" />
                    <div>
                      <h4 className="font-label-md text-on-surface font-bold">Opening Hours</h4>
                      <p className="text-on-surface-variant">Daily: 7:00 PM – 11:30 PM</p>
                    </div>
                  </div>
                </div>
                <a 
                  href="https://maps.google.com/maps?q=Anaya's%20Kitchen,%20Orchid%20Blues,%20G%20806,%20Shela,%20Ahmedabad,%20Gujarat%20380058"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary text-on-primary px-10 py-4 rounded-full font-label-md text-label-md shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all inline-flex items-center gap-2 w-fit"
                >
                  <Navigation className="w-5 h-5" />
                  Get Directions
                </a>
              </div>
              <div className="rounded-2xl overflow-hidden h-[400px] shadow-lg relative bg-surface border border-outline-variant/30">
                <iframe
                  title="Anaya's Kitchen Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src="https://maps.google.com/maps?q=Anaya's%20Kitchen,%20Orchid%20Blues,%20G%20806,%20Shela,%20Ahmedabad,%20Gujarat%20380058&t=&z=15&ie=UTF8&iwloc=&output=embed"
                ></iframe>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer (Shared Component) */}
      <footer className="bg-surface-container-highest border-t border-outline-variant/30">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 px-margin-desktop py-12 max-w-container-max mx-auto">
          <div className="space-y-4 max-w-sm">
            <div className="font-headline-sm text-headline-sm text-primary">Anaya's Kitchen</div>
            <p className="font-body-md text-on-surface-variant">© 2024 Anaya's Kitchen. Refined Heritage Home-Style Cooking.</p>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Business Hours</a>
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Privacy Policy</a>
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Terms of Service</a>
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Location</a>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Action Button */}
      <a 
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-xl hover:scale-110 transition-all flex items-center justify-center group" 
        href="https://wa.me/919662521407" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <svg fill="currentColor" height="32" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.176 0 6.161 1.237 8.404 3.48s3.48 5.228 3.48 8.404c0 6.556-5.332 11.888-11.888 11.888-2.003 0-3.967-.506-5.717-1.464l-6.306 1.7zm6.3-4.064c1.551.921 3.284 1.408 5.053 1.408 5.403 0 9.803-4.401 9.803-9.803s-4.4-9.803-9.803-9.803-9.803 4.401-9.803 9.803c0 1.932.569 3.815 1.644 5.419l-.173.254-1.009 3.684 3.774-.99.254.173zm11.23-5.372c-.303-.152-1.794-.885-2.073-.986-.279-.101-.482-.152-.684.152-.202.304-.784.986-.962 1.189-.177.203-.355.228-.658.076-.303-.152-1.282-.472-2.441-1.507-.901-.803-1.509-1.796-1.686-2.099-.177-.304-.019-.468.133-.619.136-.136.303-.354.455-.532.152-.177.202-.304.304-.506.101-.203.051-.38-.025-.532-.076-.152-.684-1.646-.937-2.253-.247-.591-.498-.511-.684-.52l-.583-.008c-.202 0-.532.076-.811.38-.279.304-1.064 1.039-1.064 2.533s1.089 2.938 1.241 3.141c.152.203 2.142 3.272 5.19 4.587.724.312 1.291.498 1.731.638.728.231 1.391.198 1.915.12.584-.088 1.794-.734 2.047-1.443.254-.709.254-1.317.177-1.443-.076-.127-.279-.203-.582-.355z"></path>
        </svg>
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-3 transition-all duration-300 font-label-md text-label-md">Chat with us</span>
      </a>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedDish && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedDish(null)}
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
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-full md:w-1/2 aspect-square md:aspect-auto h-64 md:h-auto relative">
                <img 
                  src={selectedDish.image} 
                  alt={selectedDish.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                {selectedDish.bestseller && (
                  <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full font-label-sm text-label-sm mb-4 inline-block w-fit">
                    Bestseller
                  </span>
                )}
                <h3 className="font-headline-sm text-on-surface mb-4">{selectedDish.title}</h3>
                <p className="font-body-md text-on-surface-variant leading-relaxed">
                  {selectedDish.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
