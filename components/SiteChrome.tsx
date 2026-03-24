"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Moon,
  Sun,
  Menu,
  X,
  ArrowRight,
  Plus,
  Minus,
  ArrowUp,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  MessageCircle,
  Mail,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Link, useLocation, useNavigate } from "@/lib/router";
import { useAppSelector } from "@/lib/store/hooks";
import { selectCartCount } from "@/lib/store/features/cartSlice";
import { products } from "@/data/products";

type MegaCard = {
  title: string;
  href: string;
  img: string;
};

type MegaItem = {
  title: string;
  href: string;
  cards: MegaCard[];
};

type MegaColumn = {
  title: string;
  links: { title: string; href: string }[];
};

type ShopMegaTab =
  | {
      key: string;
      title: string;
      type: "category-grid";
      items: MegaItem[];
    }
  | {
      key: string;
      title: string;
      type: "all-products";
      columns: MegaColumn[];
      promoCards: MegaCard[];
    }
  | {
      key: string;
      title: string;
      type: "offers";
      promoCards: MegaCard[];
    };

const navLinks = [

  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const shopMegaTabs: ShopMegaTab[] = [
  {
    key: "living-room",
    title: "Living room",
    type: "category-grid",
    items: [
      {
        title: "Sofas & Loungers",
        href: "/category/living-room/sofas-loungers",
        cards: [
          {
            title: "Sofas",
            href: "/category/living-room/sofas",
            img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200",
          },
          {
            title: "Sofa cum beds",
            href: "/category/living-room/sofa-cum-beds",
            img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1200",
          },
          {
            title: "L shaped and corner sofa",
            href: "/category/living-room/l-shaped-sofas",
            img: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1200",
          },
          {
            title: "Sofa sets",
            href: "/category/living-room/sofa-sets",
            img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1200",
          },
          {
            title: "Recliner Sofas",
            href: "/category/living-room/recliner-sofas",
            img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200",
          },
        ],
      },
      { title: "Tables", href: "/category/living-room/tables", cards: [] },
      { title: "Bean bags & pouffes", href: "/category/living-room/bean-bags-pouffes", cards: [] },
      { title: "Cabinets", href: "/category/living-room/cabinets", cards: [] },
      { title: "Chairs", href: "/category/living-room/chairs", cards: [] },
      { title: "Soft furnishing", href: "/category/living-room/soft-furnishing", cards: [] },
    ],
  },
  {
    key: "bedroom",
    title: "Bedroom",
    type: "category-grid",
    items: [
      {
        title: "Almirahs & wardrobes",
        href: "/category/bedroom/almirahs-wardrobes",
        cards: [
          {
            title: "Steel Almirahs",
            href: "/category/bedroom/steel-almirahs",
            img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1200",
          },
          {
            title: "Wooden Wardrobes",
            href: "/category/bedroom/wooden-wardrobes",
            img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1200",
          },
        ],
      },
      { title: "Beds", href: "/category/bedroom/beds", cards: [] },
      { title: "Bed and Mattress Sets", href: "/category/bedroom/bed-mattress-sets", cards: [] },
      { title: "Mattresses", href: "/category/bedroom/mattresses", cards: [] },
      { title: "Tables", href: "/category/bedroom/tables", cards: [] },
      { title: "Chairs", href: "/category/bedroom/chairs", cards: [] },
      { title: "Home lockers", href: "/category/bedroom/home-lockers", cards: [] },
      { title: "Cabinets", href: "/category/bedroom/cabinets", cards: [] },
      { title: "Bean bags and pouffes", href: "/category/bedroom/bean-bags-pouffes", cards: [] },
    ],
  },
  {
    key: "dining-room",
    title: "Dining room",
    type: "category-grid",
    items: [
      {
        title: "Dining Sets",
        href: "/category/dining-room/dining-sets",
        cards: [
          {
            title: "4 Seater",
            href: "/category/dining-room/4-seater",
            img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1200",
          },
          {
            title: "6 Seater",
            href: "/category/dining-room/6-seater",
            img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1200",
          },
          {
            title: "8 Seater",
            href: "/category/dining-room/8-seater",
            img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1200",
          },
        ],
      },
      { title: "Dining Tables", href: "/category/dining-room/dining-tables", cards: [] },
      { title: "Dining Chairs", href: "/category/dining-room/dining-chairs", cards: [] },
      { title: "Dining Benches", href: "/category/dining-room/dining-benches", cards: [] },
      { title: "Dining Accessories", href: "/category/dining-room/dining-accessories", cards: [] },
    ],
  },
  {
    key: "office-study",
    title: "Office and Study",
    type: "category-grid",
    items: [
      {
        title: "Office Chairs",
        href: "/category/office-study/office-chairs",
        cards: [
          {
            title: "Ergonomic Chairs",
            href: "/category/office-study/ergonomic-chairs",
            img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1200",
          },
          {
            title: "Study Tables",
            href: "/category/office-study/study-tables",
            img: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1200",
          },
          {
            title: "Storage Cabinets",
            href: "/category/office-study/storage-cabinets",
            img: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&q=80&w=1200",
          },
        ],
      },
      { title: "Study Tables", href: "/category/office-study/study-tables", cards: [] },
      { title: "Bookshelves", href: "/category/office-study/bookshelves", cards: [] },
      { title: "Filing Cabinets", href: "/category/office-study/filing-cabinets", cards: [] },
      { title: "Workstations", href: "/category/office-study/workstations", cards: [] },
    ],
  },

 
 
  
];

const Announcement = () => (
  <div className="fixed left-0 right-0 top-0 z-[1200] h-9 border-b border-white/10 bg-primary text-white/90">
    <div className="mx-auto grid h-full max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-3 sm:px-6 lg:px-[2%]">
      {/* left contact info */}
      <div className="hidden min-w-0 items-center gap-4 lg:flex">
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-white/90 transition hover:text-secondary"
        >
          <MessageCircle size={14} className="text-secondary" />
          <span className="truncate">+91 98765 43210</span>
        </a>

        <a
          href="mailto:hello@nestcraft.com"
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-white/90 transition hover:text-secondary"
        >
          <Mail size={14} className="text-secondary" />
          <span className="truncate">hello@nestcraft.com</span>
        </a>
      </div>

      {/* center text */}
      <div className="flex items-center justify-center text-center">
        <span className="truncate text-[10px] font-semibold uppercase tracking-[1.8px] text-white/90 sm:text-[11px]">
          <span className="mr-2 text-secondary">Free Delivery</span>
          on orders over ₹999
        </span>
      </div>

      {/* right socials */}
      <div className="flex items-center justify-end gap-1 sm:gap-1.5">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
          className="flex h-6 w-6 items-center justify-center rounded-full text-white/85 transition hover:bg-white/10 hover:text-secondary"
        >
          <Instagram size={13} />
        </a>

        <a
          href="https://facebook.com"
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook"
          className="flex h-6 w-6 items-center justify-center rounded-full text-white/85 transition hover:bg-white/10 hover:text-secondary"
        >
          <Facebook size={13} />
        </a>

        <a
          href="https://twitter.com"
          target="_blank"
          rel="noreferrer"
          aria-label="Twitter"
          className="hidden sm:flex h-6 w-6 items-center justify-center rounded-full text-white/85 transition hover:bg-white/10 hover:text-secondary"
        >
          <Twitter size={13} />
        </a>

        <a
          href="https://youtube.com"
          target="_blank"
          rel="noreferrer"
          aria-label="Youtube"
          className="hidden sm:flex h-6 w-6 items-center justify-center rounded-full text-white/85 transition hover:bg-white/10 hover:text-secondary"
        >
          <Youtube size={13} />
        </a>
      </div>
    </div>
  </div>
);

const MegaCardLink = ({ card }: { card: MegaCard }) => (
  <Link href={card.href} className="group block">
    <div className="overflow-hidden border border-[#d8d0c6] bg-white">
      <img
        src={card.img}
        alt={card.title}
        className="h-[160px] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />
    </div>
    <div className="flex items-center justify-between border-b border-[#d8d0c6] py-3">
      <span className="text-[14px] font-medium tracking-tight text-[#3d352e]">
        {card.title}
      </span>
      <ArrowRight size={18} className="text-[#5b5147]" />
    </div>
  </Link>
);

const MegaCardCarousel = ({
  cards,
  viewAllHref,
  viewAllLabel,
}: {
  cards: MegaCard[];
  viewAllHref: string;
  viewAllLabel: string;
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

  useEffect(() => {
    setStartIndex(0);
  }, [cards]);

  const canPrev = startIndex > 0;
  const canNext = startIndex + visibleCount < cards.length;

  const prev = () => setStartIndex((i) => Math.max(0, i - 1));
  const next = () =>
    setStartIndex((i) => Math.min(cards.length - visibleCount, i + 1));

  const visible = cards.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-x-8 gap-y-0">
        {visible.map((card) => (
          <MegaCardLink key={card.title} card={card} />
        ))}
      </div>

      {/* controls row */}
      <div className="flex items-center justify-between pt-3">
        {/* arrow pair */}
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            disabled={!canPrev}
            aria-label="Previous"
            className={`flex h-9 w-9 items-center justify-center rounded-full border shadow-sm transition-all duration-200 ${
              canPrev
                ? "border-[#bbb0a5] bg-white text-[#3d352e] hover:border-[#0d6533] hover:bg-[#0d6533] hover:text-white hover:shadow-md"
                : "cursor-not-allowed border-[#e5dfd9] bg-[#f8f5f1] text-[#c9c0b8]"
            }`}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={next}
            disabled={!canNext}
            aria-label="Next"
            className={`flex h-9 w-9 items-center justify-center rounded-full border shadow-sm transition-all duration-200 ${
              canNext
                ? "border-[#bbb0a5] bg-white text-[#3d352e] hover:border-[#0d6533] hover:bg-[#0d6533] hover:text-white hover:shadow-md"
                : "cursor-not-allowed border-[#e5dfd9] bg-[#f8f5f1] text-[#c9c0b8]"
            }`}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* view all pill */}
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-2 rounded-full bg-[#0d6533] px-5 py-2 text-[13px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0a5028] hover:shadow-md"
        >
          View all
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

const Navbar = ({
  theme,
  toggleTheme,
  onSearchOpen,
}: {
  theme: string;
  toggleTheme: () => void;
  onSearchOpen: () => void;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMegaOpen, setIsMobileMegaOpen] = useState(false);
  const [activeMegaTab, setActiveMegaTab] = useState("living-room");
  const [activeMegaItemIndex, setActiveMegaItemIndex] = useState(0);

  const cartCount = useAppSelector(selectCartCount);
  const { pathname } = useLocation();

  const activeTab = shopMegaTabs.find((tab) => tab.key === activeMegaTab) || shopMegaTabs[0];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setActiveMegaItemIndex(0);
  }, [activeMegaTab]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileMegaOpen(false);
    setIsMegaMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const desktopNavClass = (href: string) =>
    `group relative inline-flex items-center py-2 text-[14px] font-medium transition-colors ${
      pathname === href ? "text-secondary" : "text-foreground hover:text-secondary"
    }`;

  const currentCategoryItem =
    activeTab.type === "category-grid" ? activeTab.items[activeMegaItemIndex] : null;

  return (
    <>
      <nav
        className={`fixed left-0 right-0 top-9 z-[1100] h-[68px] border-b transition-all duration-200 sm:h-[74px] ${
          isScrolled
            ? "border-border bg-background/95 shadow-md backdrop-blur-md"
            : "border-border/70 bg-background/92 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-[2%]">
          {/* left side */}
          {/* <div className="flex min-w-0 items-center gap-6 xl:gap-8"> */}
            <div className="shrink-0">
              <Link href="/" className="block">
                <img
                  src="/assets/Image/nestcraft-logo.svg"
                  alt="NestCraft"
                  className="h-12 w-auto sm:h-9 lg:h-14"
                />
              </Link>
            </div>

            {/* desktop nav near logo */}
            <div
              className="relative hidden xl:block"
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <div className="flex items-center gap-7">
                {shopMegaTabs.map((tab) => {
                  const isActive = activeMegaTab === tab.key && isMegaMenuOpen;

                  return (
                    <button
                      key={tab.key}
                      onMouseEnter={() => {
                        setActiveMegaTab(tab.key);
                        setIsMegaMenuOpen(true);
                      }}
                      className={`group relative inline-flex items-center py-2 text-[14px] font-medium transition-colors ${
                        isActive
                          ? "text-[#3d352e] hover:text-[#98c45f]"
                          : "text-[#0b1610] hover:text-[#98c45f]"
                      }`}
                    >
                      <span className="whitespace-nowrap">{tab.title}</span>
                      <span
                        className={`absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 bg-[#98c45f] transition-all duration-200 ${
                          isActive ? "w-12" : "w-0 group-hover:w-12"
                        }`}
                      />
                    </button>
                  );
                })}

                {/* <div className="mx-1 h-5 w-px bg-border/70" /> */}

                {navLinks.map((item) => (
                  <Link key={item.href} href={item.href} className={desktopNavClass(item.href)}>
                    <span className="relative">
                      {item.label}
                      <span
                        className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-secondary transition-all duration-200 ${
                          pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      />
                    </span>
                  </Link>
                ))}
              </div>

              <AnimatePresence>
                {isMegaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute -left-40 top-full z-[1150] pt-3"
                    onMouseEnter={() => setIsMegaMenuOpen(true)}
                  >
                    <div className="w-[min(1180px,calc(100vw-180px))] overflow-hidden border border-[#ddd4ca] bg-[#f7f3ed] shadow-[0_25px_80px_rgba(0,0,0,0.16)] rounded-lg">
                      <div className="min-h-auto bg-[#fff]">
                        {activeTab.type === "category-grid" && currentCategoryItem && (
                          <div className="grid grid-cols-[320px_1fr]">
                            <div className="border-r border-[#ddd4ca] px-6 py-6">
                              <div className="space-y-0">
                                {activeTab.items.map((item, index) => {
                                  const isActive = index === activeMegaItemIndex;

                                  return (
                                    <button
                                      key={item.title}
                                      onMouseEnter={() => setActiveMegaItemIndex(index)}
                                      className={`flex w-full items-center border-b border-[#ddd4ca] px-4 py-2 text-left text-[14px] font-medium transition-all  ${
                                        isActive
                                          ? "hover:bg-[#98c45f]/10 text-[#0d6533]"
                                          : "text-[#4f4741] hover:bg-[#0d6533]"
                                      }`}
                                    >
                                      {item.title}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="px-7 py-6">
                              {currentCategoryItem.cards.length > 0 ? (
                                <MegaCardCarousel
                                  cards={currentCategoryItem.cards}
                                  viewAllHref={currentCategoryItem.href}
                                  viewAllLabel={currentCategoryItem.title}
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <Link
                                    href={currentCategoryItem.href}
                                    className="inline-flex items-center gap-2 rounded-full border border-[#cfc5b9] px-5 py-3 text-[14px] font-medium text-[#3d352e] transition hover:bg-white"
                                  >
                                    View {currentCategoryItem.title}
                                    <ArrowRight size={16} />
                                  </Link>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {activeTab.type === "all-products" && (
                          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_300px] gap-0 px-6 py-8">
                            {activeTab.columns.map((column) => (
                              <div
                                key={column.title}
                                className="min-w-0 border-r border-[#d6cdc2] px-5 last:border-r-0"
                              >
                                <h4 className="mb-5 text-[18px] font-medium text-[#ff5e4d]">
                                  {column.title}
                                </h4>
                                <ul className="space-y-2.5">
                                  {column.links.map((link) => (
                                    <li key={link.title}>
                                      <Link
                                        href={link.href}
                                        className="text-[15px] text-[#4b443e] transition hover:text-[#ff5e4d]"
                                      >
                                        {link.title}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}

                            <div className="pl-6">
                              <div className="space-y-6">
                                {activeTab.promoCards.map((card) => (
                                  <MegaCardLink key={card.title} card={card} />
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {activeTab.type === "offers" && (
                          <div className="grid grid-cols-3 gap-8 px-8 py-8">
                            {activeTab.promoCards.map((card) => (
                              <MegaCardLink key={card.title} card={card} />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
         

          {/* right actions */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={onSearchOpen}
              className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-all hover:bg-muted/10 sm:h-10 sm:w-10"
            >
              <Search size={18} />
            </button>

            <Link
              href="/cart"
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-all hover:bg-muted/10 sm:h-10 sm:w-10"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-secondary text-[9px] font-black text-white">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={toggleTheme}
              className="hidden lg:inline-flex py-2 px-2 cursor-pointer items-center gap-2 rounded-full border border-border bg-surface/70  text-[11px] font-extrabold uppercase tracking-wider text-foreground transition-all hover:border-secondary/50"
            >
              {theme === "dark" ? (
                <Sun size={16} className="text-secondary" />
              ) : (
                <Moon size={16} className="text-secondary" />
              )}
              {/* <span>{theme === "dark" ? "Light" : "Dark"}</span> */}
            </button>

            <button
              onClick={toggleTheme}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface/70 text-foreground transition-all hover:border-secondary/50 lg:hidden sm:h-10 sm:w-10"
            >
              {theme === "dark" ? (
                <Sun size={16} className="text-secondary" />
              ) : (
                <Moon size={16} className="text-secondary" />
              )}
            </button>

            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-all hover:bg-muted/10 xl:hidden sm:h-10 sm:w-10"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* mobile drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-[106px] z-[1098] bg-black/45 xl:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed right-0 top-[106px] z-[1099] h-[calc(100vh-106px)] w-[min(94vw,420px)] overflow-y-auto border-l border-border bg-background px-5 pb-8 pt-5 shadow-2xl xl:hidden"
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="text-[11px] font-black uppercase tracking-[2px] text-muted">
                  Menu
                </p>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-1 border-b border-border pb-4">
                <button
                  className="flex w-full items-center justify-between rounded-2xl px-1 py-3 text-left text-[13px] font-black uppercase tracking-[2px] text-foreground"
                  onClick={() => setIsMobileMegaOpen(!isMobileMegaOpen)}
                >
                  <span className="flex items-center gap-2">
                    Shop
                    <small className="text-[10px] tracking-[2px] text-muted">
                      Mega
                    </small>
                  </span>
                  {isMobileMegaOpen ? <Minus size={16} /> : <Plus size={16} />}
                </button>

                <AnimatePresence>
                  {isMobileMegaOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-5 pb-4">
                        {shopMegaTabs.map((tab) => (
                          <div key={tab.key} className="rounded-2xl border border-border bg-surface p-4">
                            <div className="mb-3 text-[14px] font-bold text-foreground">
                              {tab.title}
                            </div>

                            {tab.type === "category-grid" && (
                              <div className="space-y-2">
                                {tab.items.map((item) => (
                                  <Link
                                    key={item.title}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-[14px] text-muted transition hover:text-secondary"
                                  >
                                    {item.title}
                                  </Link>
                                ))}
                              </div>
                            )}

                            {tab.type === "all-products" && (
                              <div className="space-y-3">
                                {tab.columns.map((col) => (
                                  <div key={col.title}>
                                    <div className="mb-1 text-[13px] font-semibold text-secondary">
                                      {col.title}
                                    </div>
                                    <div className="space-y-1">
                                      {col.links.slice(0, 4).map((link) => (
                                        <Link
                                          key={link.title}
                                          href={link.href}
                                          onClick={() => setIsMobileMenuOpen(false)}
                                          className="block text-[14px] text-muted transition hover:text-secondary"
                                        >
                                          {link.title}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {tab.type === "offers" && (
                              <div className="space-y-2">
                                {tab.promoCards.map((card) => (
                                  <Link
                                    key={card.title}
                                    href={card.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-[14px] text-muted transition hover:text-secondary"
                                  >
                                    {card.title}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-2xl px-1 py-3 text-[13px] font-black uppercase tracking-[2px] text-foreground"
                  >
                    {item.label} <ArrowRight size={16} />
                  </Link>
                ))}
              </div>

              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary text-[13px] font-semibold uppercase tracking-wider text-white transition-all hover:bg-primary/90"
              >
                Book a Free Demo
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const SearchOverlay = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredProducts =
    query.length > 1
      ? products.filter(
          (p) =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase())
        )
      : [];

  const handleSelect = (id: number) => {
    navigate(`/product/${id}`);
    onClose();
    setQuery("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] flex flex-col items-center bg-background/95 px-4 pt-24 backdrop-blur-xl sm:px-[5%] sm:pt-32"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-border transition-all hover:bg-surface sm:right-10 sm:top-10 sm:h-12 sm:w-12"
          >
            <X size={22} />
          </button>

          <div className="w-full max-w-3xl">
            <div className="relative mb-10 sm:mb-12">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted sm:left-6"
                size={22}
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for furniture, decor, or collections..."
                className="h-16 w-full rounded-[24px] border border-border bg-surface pl-12 pr-4 text-lg font-bold outline-none transition-all placeholder:text-muted/30 focus:border-secondary sm:h-20 sm:pl-16 sm:pr-8 sm:text-2xl"
              />
            </div>

            <div className="space-y-8">
              {query.length > 1 ? (
                <>
                  <h4 className="text-[11px] font-black uppercase tracking-[3px] text-muted">
                    Search Results ({filteredProducts.length})
                  </h4>

                  <div className="grid gap-4">
                    {filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleSelect(product.id)}
                        className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-3 text-left transition-all hover:border-secondary sm:gap-6 sm:p-4"
                      >
                        <div className="h-16 w-14 overflow-hidden rounded-lg border border-border bg-background sm:h-20 sm:w-16">
                          <img
                            src={product.img}
                            alt={product.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-base font-bold tracking-tight transition-colors group-hover:text-secondary sm:text-lg">
                            {product.title}
                          </p>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-muted sm:text-xs">
                            {product.category}
                          </p>
                        </div>
                        <div className="ml-auto text-sm font-black text-secondary sm:text-base">
                          {product.price}
                        </div>
                      </button>
                    ))}

                    {filteredProducts.length === 0 && (
                      <div className="py-12 text-center">
                        <p className="text-lg font-bold text-muted sm:text-xl">
                          No results found for "{query}"
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h4 className="text-[11px] font-black uppercase tracking-[3px] text-muted">
                    Popular Categories
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {["Living Room", "Bedroom", "Dining Room", "Lighting", "Decor"].map(
                      (cat) => (
                        <Link
                          key={cat}
                          href={`/category/${cat.toLowerCase().replace(/\s+/g, "-")}`}
                          onClick={onClose}
                          className="flex h-11 items-center rounded-full border border-border bg-surface px-5 text-sm font-bold transition-all hover:border-secondary hover:text-secondary sm:h-12 sm:px-6"
                        >
                          {cat}
                        </Link>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Footer = () => (
  <footer
    data-annotate-id="site-footer"
    className="border-t border-border bg-surface px-[5%] pb-10 pt-20"
  >
    <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-6">
        <Link href="/" className="block">
          <img
            src="/assets/Image/nestcraft-logo.svg"
            alt="NestCraft"
            className="h-26 w-auto"
          />
        </Link>

        <p className="max-w-[300px] font-semibold text-muted">
          Sculpting personal spaces with design-led essentials. Minimalist
          furniture crafted for the modern home.
        </p>

        <div className="flex gap-4">
          {[
            { name: "Instagram", icon: Instagram, url: "#" },
            { name: "Facebook", icon: Facebook, url: "#" },
            { name: "Twitter", icon: Twitter, url: "#" },
            { name: "Youtube", icon: Youtube, url: "#" },
          ].map((social) => (
            <a
              key={social.name}
              href={social.url}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-all hover:border-secondary hover:text-secondary"
            >
              <span className="sr-only">{social.name}</span>
              <social.icon size={18} />
            </a>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-6 text-[11px] font-black uppercase tracking-[2px] text-foreground">
          Shop
        </h4>
        <ul className="space-y-4">
          {["Living Room", "Bedroom", "Dining Room", "Home Office", "Decor"].map(
            (item) => (
              <li key={item}>
                <Link
                  href="/shop"
                  className="font-bold text-muted transition-colors hover:text-secondary"
                >
                  {item}
                </Link>
              </li>
            )
          )}
        </ul>
      </div>

      <div>
        <h4 className="mb-6 text-[11px] font-black uppercase tracking-[2px] text-foreground">
          Company
        </h4>
        <ul className="space-y-4">
          {[
            { name: "Our Story", path: "/about" },
            { name: "Craftsmanship", path: "/about" },
            { name: "Sustainability", path: "/about" },
            { name: "Contact", path: "/contact" },
          ].map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className="font-bold text-muted transition-colors hover:text-secondary"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="mb-6 text-[11px] font-black uppercase tracking-[2px] text-foreground">
          Support
        </h4>
        <ul className="space-y-4">
          {[
            { name: "Shipping & Delivery", path: "/faq" },
            { name: "Returns & Exchanges", path: "/faq" },
            { name: "Care Guide", path: "/faq" },
            { name: "FAQ", path: "/faq" },
            { name: "Privacy Policy", path: "/faq" },
          ].map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className="font-bold text-muted transition-colors hover:text-secondary"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div className="huge-watermark">NESTCRAFT</div>

    <div className="md:flex text-center flex-col items-center justify-between gap-6 border-t border-border mt-10 pt-2 md:flex-row">
      <p className="py-2 text-[14px] font-medium transition-colors text-[#0b1610]">
        © 2026 NestCraft Interiors. All rights reserved.
      </p>
      <div className="flex items-center justify-center gap-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group relative text-center inline-flex items-center  text-[14px] font-medium transition-colors text-[#0b1610] hover:text-[#98c45f]"
        >
          Back to Top <ArrowUp size={14} />
        </button>
        <div className="hidden gap-8 md:flex">
          <a
            href="#"
            className="text-[14px] font-medium transition-colors text-[#0b1610] hover:text-[#98c45f]"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-[14px] font-medium transition-colors text-[#0b1610] hover:text-[#98c45f]"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-[14px] font-medium transition-colors text-[#0b1610] hover:text-[#98c45f]"
          >
            Cookies
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("light");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = prefersDark ? "dark" : "light";
      setTheme(initialTheme);
      document.documentElement.setAttribute("data-theme", initialTheme);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSearchOpen]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div
      data-annotate-id="site-shell"
      className="min-h-screen bg-background text-foreground selection:bg-secondary/30"
    >
      <Announcement />
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        onSearchOpen={() => setIsSearchOpen(true)}
      />
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <main data-annotate-id="site-main" className="pt-[106px] sm:pt-[110px]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
