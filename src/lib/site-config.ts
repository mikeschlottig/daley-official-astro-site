// =============================================================================
// Daley Organics - Site Configuration
// =============================================================================
// Premium organic soil solutions for Grants Pass, Oregon
// =============================================================================

// -----------------------------------------------------------------------------
// Site Config
// -----------------------------------------------------------------------------
export interface SiteConfig {
  title: string;
  description: string;
  language: string;
  keywords: string;
  ogImage: string;
  canonical: string;
}

export const siteConfig: SiteConfig = {
  title: "Daley Organics - Premium Organic Soil Solutions | Grants Pass, Oregon",
  description: "Premium organic soil and fertilizer blends for healthier plants and a sustainable future. Born and raised in the Rogue Valley, committed to bringing prosperity through sustainable agriculture.",
  language: "en",
  keywords: "organic fertilizer, soil mix, worm castings, compost, Grants Pass, Oregon, Rogue Valley, sustainable gardening, organic gardening, bat guano, kelp meal",
  ogImage: "/images/hero-garden.jpg",
  canonical: "https://daleyorganics.com",
};

// -----------------------------------------------------------------------------
// Navigation Config
// -----------------------------------------------------------------------------
export interface NavDropdownItem {
  name: string;
  href: string;
}

export interface NavLink {
  name: string;
  href: string;
  icon: string;
  dropdown?: NavDropdownItem[];
}

export interface NavigationConfig {
  brandName: string;
  brandSubname: string;
  tagline: string;
  navLinks: NavLink[];
  ctaButtonText: string;
}

export const navigationConfig: NavigationConfig = {
  brandName: "Daley",
  brandSubname: "Organics",
  tagline: "Feed the Microbes. Grow More.",
  navLinks: [
    { name: "Home", href: "/", icon: "Home" },
    { name: "Products", href: "/products", icon: "Sprout" },
    { name: "Ingredients", href: "/ingredients", icon: "Leaf" },
    { name: "Blog", href: "/blog", icon: "Newspaper" },
    { name: "Research", href: "/research", icon: "BookOpen" },
    { name: "Contact", href: "/#contact", icon: "Mail" },
  ],
  ctaButtonText: "Schedule Bulk Pickup",
};

// -----------------------------------------------------------------------------
// Preloader Config
// -----------------------------------------------------------------------------
export interface PreloaderConfig {
  brandName: string;
  brandSubname: string;
  yearText: string;
}

export const preloaderConfig: PreloaderConfig = {
  brandName: "Daley",
  brandSubname: "Organics",
  yearText: "Grants Pass, Oregon",
};

// -----------------------------------------------------------------------------
// Hero Config
// -----------------------------------------------------------------------------
export interface HeroStat {
  value: number;
  suffix: string;
  label: string;
}

export interface HeroConfig {
  scriptText: string;
  mainTitle: string;
  ctaButtonText: string;
  ctaTarget: string;
  stats: HeroStat[];
  decorativeText: string;
  backgroundImage: string;
}

export const heroConfig: HeroConfig = {
  scriptText: "Feed the Microbes. Feed Your Plants.",
  mainTitle: "Grow Better\nwith Daley Organics",
  ctaButtonText: "See Our Soil Blends",
  ctaTarget: "#products",
  stats: [
    { value: 25, suffix: "+", label: "Organic Amendments" },
    { value: 100, suffix: "%", label: "Certified Organic" },
    { value: 1000, suffix: "+", label: "Rogue Valley Growers" },
  ],
  decorativeText: "FEED THE MICROBES • FEED YOUR PLANT",
  backgroundImage: "/images/hero-garden.jpg",
};

// -----------------------------------------------------------------------------
// Product Showcase Config
// -----------------------------------------------------------------------------
export interface Product {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  image: string;
  filter: string;
  glowColor: string;
  description: string;
  usage: string;
  season: string;
  releaseType: string;
}

export interface ProductFeature {
  icon: string;
  title: string;
  description: string;
}

export interface ProductQuote {
  text: string;
  attribution: string;
  prefix: string;
}

export interface ProductShowcaseConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  products: Product[];
  features: ProductFeature[];
  quote: ProductQuote;
}

export const productShowcaseConfig: ProductShowcaseConfig = {
  scriptText: "Our Signature Blends",
  subtitle: "PREMIUM ORGANIC SOLUTIONS",
  mainTitle: "The Daley Difference",
  products: [
    {
      id: "daleys-mix",
      name: "Daley's Mix",
      subtitle: "The Elite Professional Blend",
      badge: "Best Seller",
      image: "/images/soil-mix.jpg",
      filter: "",
      glowColor: "bg-amber-900/20",
      description: "Our flagship blend — a lighter texture premium mix of coco, peat, perlite, pumice, and bio fiber. Supercharged with 21 organic amendments plus 20 lbs of fertilizer and 10 extra lbs of 8-3-1 bat guano.",
      usage: "Raised beds, containers, in-ground planting. Ready to use straight from the tote.",
      season: "All Seasons",
      releaseType: "Slow & Steady",
    },
    {
      id: "premium-soil-mix",
      name: "Premium Soil Mix",
      subtitle: "The Foundation Blend",
      badge: "Foundation",
      image: "/images/compost-hands.jpg",
      filter: "",
      glowColor: "bg-green-900/20",
      description: "Professional-grade soil built on coco fiber, peat moss, perlite, pumice, and premium compost. Enhanced with 20 organic amendments and includes 20 lbs of our complete fertilizer blend.",
      usage: "Home gardens, raised beds, general planting, seasonal vegetables.",
      season: "All Seasons",
      releaseType: "Slow & Steady",
    },
    {
      id: "merlin-blend",
      name: "Merlin Blend",
      subtitle: "High-Volume Garden & Landscape",
      badge: "Best Value",
      image: "/images/farm-landscape.jpg",
      filter: "",
      glowColor: "bg-stone-800/20",
      description: "Organic compost, aged bark dust, bio fiber, pumice, and topsoil. Built for volume — when you need to move serious amounts of quality organic material for landscaping and large garden projects.",
      usage: "Large landscaping projects, yard top-dressing, bulk soil building.",
      season: "All Seasons",
      releaseType: "Long-Term Builder",
    },
  ],
  features: [
    {
      icon: "Sparkles",
      title: "Feeds the Microbiome",
      description: "Every blend supports the microbes, nematodes, and fungi that feed your plants",
    },
    {
      icon: "MapPin",
      title: "Rogue Valley Built",
      description: "Formulated for Southern Oregon's clay-heavy soil and growing conditions",
    },
    {
      icon: "Clock",
      title: "Slow & Steady Release",
      description: "Nutrients release gradually — your soil gets better every season",
    },
  ],
  quote: {
    text: "Born and raised in the Rogue Valley, I am committed to bringing prosperity and opportunity to the area while promoting sustainability through my actions. Build your soil, don't break it.",
    attribution: "Cameron Daley, Founder",
    prefix: "Our Promise",
  },
};

// -----------------------------------------------------------------------------
// Garden Carousel Config
// -----------------------------------------------------------------------------
export interface CarouselSlide {
  image: string;
  title: string;
  subtitle: string;
  area: string;
  unit: string;
  description: string;
}

export interface GardenCarouselConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  locationTag: string;
  slides: CarouselSlide[];
}

export const gardenCarouselConfig: GardenCarouselConfig = {
  scriptText: "Our Community",
  subtitle: "GROWING TOGETHER",
  mainTitle: "Gardens Transformed",
  locationTag: "Grants Pass, Oregon - Rogue Valley",
  slides: [
    {
      image: "/images/tomato-garden.jpg",
      title: "Vegetable Gardens",
      subtitle: "Bountiful Harvests",
      area: "10,000+",
      unit: "sq ft",
      description: "Our premium soil mixes and fertilizers have helped home gardeners achieve record-breaking harvests of tomatoes, peppers, and leafy greens throughout the Rogue Valley.",
    },
    {
      image: "/images/flower-garden.jpg",
      title: "Flower Gardens",
      subtitle: "Vibrant Blooms",
      area: "5,000+",
      unit: "sq ft",
      description: "From roses to wildflowers, our organic blends provide the perfect nutrition for stunning floral displays that bloom longer and brighter.",
    },
    {
      image: "/images/farm-landscape.jpg",
      title: "Small Farms",
      subtitle: "Sustainable Agriculture",
      area: "50+",
      unit: "acres",
      description: "Local farmers trust Daley Organics for their commercial operations, knowing our products support both productivity and soil health.",
    },
  ],
};

// -----------------------------------------------------------------------------
// Our Story Config (formerly Museum)
// -----------------------------------------------------------------------------
export interface TimelineEvent {
  year: string;
  event: string;
}

export interface StoryTabContent {
  title: string;
  description: string;
  highlight: string;
}

export interface StoryTab {
  id: string;
  name: string;
  icon: string;
  image: string;
  content: StoryTabContent;
}

export interface StoryQuote {
  prefix: string;
  text: string;
  attribution: string;
}

export interface OurStoryConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  introText: string;
  timeline: TimelineEvent[];
  tabs: StoryTab[];
  openingHours: string;
  openingHoursLabel: string;
  ctaButtonText: string;
  yearBadge: string;
  yearBadgeLabel: string;
  quote: StoryQuote;
  founderPhotoAlt: string;
  founderPhoto: string;
}

export const ourStoryConfig: OurStoryConfig = {
  scriptText: "Our Journey",
  subtitle: "ROOTED IN THE ROGUE VALLEY",
  mainTitle: "The Daley Story",
  introText: "Born and raised in the Rogue Valley, Cameron Daley founded Daley Organics with a vision: to bring prosperity and opportunity to the area while promoting sustainability through organic agriculture.",
  timeline: [
    { year: "2014", event: "Daley Organics founded in Grants Pass" },
    { year: "2019", event: "First soil mix formula perfected" },
    { year: "2020", event: "Expanded to 25+ ingredient blends" },
    { year: "2021", event: "Served 500+ local gardeners" },
    { year: "2023", event: "Recognized as Rogue Valley's premier organic supplier" },
    { year: "2025", event: "Continuing to grow with our community" },
  ],
  tabs: [
    {
      id: "philosophy",
      name: "Our Philosophy",
      icon: "BookOpen",
      image: "/images/compost-hands.jpg",
      content: {
        title: "Feed the Microbes. Feed Your Plants.",
        description: "Healthy soil is a living ecosystem. We build blends that feed the microbes, nematodes, and fungi that feed your plants — creating growing environments that improve year after year instead of depleting.",
        highlight: "Microbe-First • Organic • Rogue Valley",
      },
    },
    {
      id: "process",
      name: "Our Process",
      icon: "History",
      image: "/images/fertilizer-blend.jpg",
      content: {
        title: "Every Ingredient Earns Its Place",
        description: "Each of our 25+ organic amendments is chosen for what it feeds in the soil food web — not just for its NPK numbers. Chitin from crab meal feeds nematodes. Humic acids amplify microbial activity. Mycorrhiza extends root reach. We don't use fillers.",
        highlight: "25+ Amendments • Zero Fillers",
      },
    },
    {
      id: "community",
      name: "Community",
      icon: "Award",
      image: "/images/happy-gardener.jpg",
      content: {
        title: "Growing Together",
        description: "We're proud to support local gardeners, farmers, and agricultural initiatives throughout Southern Oregon. Your success is our success.",
        highlight: "Grants Pass • Rogue Valley • Oregon",
      },
    },
  ],
  openingHours: "Monday - Saturday: 9:00 AM - 5:00 PM",
  openingHoursLabel: "Visit Our Location",
  ctaButtonText: "Get Directions",
  yearBadge: "2014",
  yearBadgeLabel: "Founded",
  quote: {
    prefix: "Our Commitment",
    text: "Every bag we sell carries our promise: 100% organic, sustainably sourced, and crafted with care for our community and our planet.",
    attribution: "The Daley Organics Team",
  },
  founderPhotoAlt: "Cameron Daley, Founder of Daley Organics",
  founderPhoto: "/images/happy-gardener.jpg",
};

// -----------------------------------------------------------------------------
// News / Blog Config
// -----------------------------------------------------------------------------
export interface NewsConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  viewAllText: string;
  readMoreText: string;
  testimonialsScriptText: string;
  testimonialsSubtitle: string;
  testimonialsMainTitle: string;
  storyScriptText: string;
  storySubtitle: string;
  storyTitle: string;
  storyParagraphs: string[];
  storyTimeline: { value: string; label: string }[];
  storyQuote: { prefix: string; text: string; attribution: string };
  storyImage: string;
  storyImageCaption: string;
}

export const newsConfig: NewsConfig = {
  scriptText: "Latest Updates",
  subtitle: "GARDENING TIPS & NEWS",
  mainTitle: "From Our Blog",
  viewAllText: "View All Articles",
  readMoreText: "Read More",
  testimonialsScriptText: "What Gardeners Say",
  testimonialsSubtitle: "CUSTOMER TESTIMONIALS",
  testimonialsMainTitle: "Success Stories",
  storyScriptText: "Our Mission",
  storySubtitle: "SUSTAINABLE AGRICULTURE",
  storyTitle: "Growing a Better Future",
  storyParagraphs: [
    "At Daley Organics, we believe the key to growing more is growing smarter — and that starts underground. Healthy soil isn't dirt with nutrients added. It's a living ecosystem of bacteria, fungi, nematodes, protozoa, and earthworms working together to cycle nutrients into the exact forms your plants need.",
    "Our fertilizer feeds that ecosystem first. When you add Daley Organics to your soil, you're feeding the microbes, nematodes, and fungi that feed your plants. The result: soil that gets better every season — not depleted, not dependent on synthetic inputs, but genuinely improving year after year.",
  ],
  storyTimeline: [
    { value: "25+", label: "Premium Ingredients" },
    { value: "100%", label: "Organic" },
    { value: "1000+", label: "Happy Customers" },
  ],
  storyQuote: {
    prefix: "Our Promise",
    text: "When you choose Daley Organics, you're not just buying fertilizer – you're investing in the future of our planet, one garden at a time.",
    attribution: "Cameron Daley",
  },
  storyImage: "/images/farm-landscape.jpg",
  storyImageCaption: "Sustainable agriculture in the Rogue Valley",
};

// -----------------------------------------------------------------------------
// Contact Form Config
// -----------------------------------------------------------------------------
export interface ContactInfoItem {
  icon: string;
  label: string;
  value: string;
  subtext: string;
}

export interface ContactFormConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  introText: string;
  contactInfoTitle: string;
  contactInfo: ContactInfoItem[];
  mapsEmbedUrl: string;
  form: {
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    visitDateLabel: string;
    visitorsLabel: string;
    visitorsOptions: string[];
    messageLabel: string;
    messagePlaceholder: string;
    submitText: string;
    submittingText: string;
    successMessage: string;
    errorMessage: string;
  };
  privacyNotice: string;
  formEndpoint: string;
}

export const contactFormConfig: ContactFormConfig = {
  scriptText: "Get In Touch",
  subtitle: "WE'D LOVE TO HEAR FROM YOU",
  mainTitle: "Contact Daley Organics",
  introText: "Questions about which blend is right for your soil? Need help diagnosing a problem? Ready to schedule a bulk pickup? We're here — and we know soil.",
  contactInfoTitle: "Contact Information",
  contactInfo: [
    {
      icon: "MapPin",
      label: "Address",
      value: "8470 Monument Dr",
      subtext: "Grants Pass, OR 97526 · Pickup Only",
    },
    {
      icon: "Phone",
      label: "Phone",
      value: "(541) 441-0510",
      subtext: "Monday – Saturday, 9am – 5pm",
    },
    {
      icon: "Mail",
      label: "Email",
      value: "macmonk@live.com",
      subtext: "We reply within 24 hours",
    },
    {
      icon: "Clock",
      label: "Hours",
      value: "Mon – Sat: 9AM – 5PM",
      subtext: "Sunday: Closed",
    },
  ],
  mapsEmbedUrl: "https://maps.google.com/maps?q=42.5432168,-123.3884123&output=embed&z=16",
  form: {
    nameLabel: "Your Name",
    namePlaceholder: "Enter your full name",
    emailLabel: "Email Address",
    emailPlaceholder: "you@example.com",
    phoneLabel: "Phone Number",
    phonePlaceholder: "(541) 000-0000",
    visitDateLabel: "Preferred Contact Date",
    visitorsLabel: "Project Size",
    visitorsOptions: ["Small Garden", "Medium Garden", "Large Garden", "Small Farm", "Commercial"],
    messageLabel: "Your Message",
    messagePlaceholder: "Tell us about your project or questions...",
    submitText: "Send Message",
    submittingText: "Sending...",
    successMessage: "Thank you! We'll be in touch soon.",
    errorMessage: "Something went wrong. Please try again.",
  },
  privacyNotice: "We respect your privacy. Your information will never be shared.",
  formEndpoint: "https://formspree.io/f/YOUR_FORM_ID",
};

// -----------------------------------------------------------------------------
// Footer Config
// -----------------------------------------------------------------------------
export interface FooterConfig {
  brandName: string;
  tagline: string;
  description: string;
  socialLinks: { icon: string; label: string; href: string }[];
  linkGroups: { title: string; links: { name: string; href: string }[] }[];
  contactItems: { icon: string; text: string }[];
  newsletterLabel: string;
  newsletterPlaceholder: string;
  newsletterButtonText: string;
  newsletterSuccessText: string;
  newsletterErrorText: string;
  newsletterEndpoint: string;
  copyrightText: string;
  legalLinks: { name: string; href: string }[];
  backToTopText: string;
}

export const footerConfig: FooterConfig = {
  brandName: "Daley Organics",
  tagline: "Feed the Microbes. Grow More.",
  description: "Born and raised in the Rogue Valley. Our fertilizer feeds the microbiology in your soil — the microbes, nematodes, and fungi that feed your plants. Build your soil, don't break it.",
  socialLinks: [
    { icon: "Facebook", label: "Facebook", href: "https://www.facebook.com/people/Daley-Organics/100035320282815/" },
    { icon: "Instagram", label: "Instagram", href: "https://www.instagram.com/dirtydaley/" },
  ],
  linkGroups: [
    {
      title: "Products",
      links: [
        { name: "Daley's Mix", href: "/products#cat-a" },
        { name: "Premium Soil Mix", href: "/products#cat-a" },
        { name: "Merlin Blend", href: "/products#cat-c" },
        { name: "Fertilizer Blends", href: "/products#fertilizers" },
        { name: "Bulk Pickup Info", href: "/products#pickup" },
      ],
    },
    {
      title: "Learn",
      links: [
        { name: "Ingredient Library", href: "/ingredients" },
        { name: "Blog & Growing Tips", href: "/blog" },
        { name: "Research Report", href: "/research" },
        { name: "Contact", href: "#contact" },
      ],
    },
  ],
  contactItems: [
    { icon: "MapPin", text: "8470 Monument Dr, Grants Pass, OR 97526" },
    { icon: "Phone", text: "(541) 441-0510" },
    { icon: "Mail", text: "macmonk@live.com" },
  ],
  newsletterLabel: "Subscribe to our newsletter for gardening tips and updates:",
  newsletterPlaceholder: "Enter your email",
  newsletterButtonText: "Subscribe",
  newsletterSuccessText: "Thank you for subscribing!",
  newsletterErrorText: "Something went wrong. Please try again.",
  newsletterEndpoint: "https://formspree.io/f/YOUR_FORM_ID",
  copyrightText: "Daley Organics LLC. All Rights Reserved.",
  legalLinks: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "FAQ", href: "/faq" },
    { name: "LLMs.txt", href: "/llms.txt" },
  ],
  backToTopText: "Back to Top",
};

// -----------------------------------------------------------------------------
// Directory / Trust Badge Links
// -----------------------------------------------------------------------------
export interface DirectoryLink {
  label: string;
  shortLabel: string;
  href: string;
  badge?: string; // e.g. "A+"
}

export const directoryLinks: DirectoryLink[] = [
  {
    label: "Google Business Profile",
    shortLabel: "Google",
    href: "https://www.google.com/search?q=daley+organics+grants+pass+or",
  },
  {
    label: "Yelp",
    shortLabel: "Yelp",
    href: "https://www.yelp.com/biz/daley-organics-grants-pass",
  },
  {
    label: "Better Business Bureau",
    shortLabel: "BBB",
    href: "https://www.bbb.org/us/or/grants-pass/profile/soil/daley-organics-llc-1296-1000172000",
    badge: "A+",
  },
  {
    label: "Yellow Pages",
    shortLabel: "Yellow Pages",
    href: "https://www.yellowpages.com/grants-pass-or/mip/daley-organics-575888243",
  },
  {
    label: "Chamber of Commerce",
    shortLabel: "Chamber",
    href: "https://www.chamberofcommerce.com/business-directory/oregon/grants-pass/mulch-supplier/2026684095-daley-organics",
  },
];

// -----------------------------------------------------------------------------
// Scroll To Top Config
// -----------------------------------------------------------------------------
export const scrollToTopConfig = {
  ariaLabel: "Back to top",
};
