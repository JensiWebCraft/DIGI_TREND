export const sampleUsers = [
  {
    _id: 'u0',
    name: 'Mahek Kureshi',
    email: 'mahek@digi-trend.com',
    role: 'Agency Owner / Manager',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    department: 'Executive & Ops'
  },
  {
    _id: 'u1',
    name: 'Kavita Shah',
    email: 'kavita@digi-trend.com',
    role: 'Creative Team Member',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    department: 'Design & Visuals'
  },
  {
    _id: 'u2',
    name: 'Aman Verma',
    email: 'aman@digi-trend.com',
    role: 'Graphic Designer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    department: 'Graphic Production'
  },
  {
    _id: 'u3',
    name: 'Rohan Mehta',
    email: 'rohan@digi-trend.com',
    role: 'Developer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    department: 'Web & ERP Tech'
  },
  {
    _id: 'u4',
    name: 'Pooja Patel',
    email: 'pooja@digi-trend.com',
    role: 'Marketing Team Member',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    department: 'Performance Marketing'
  }
];

export const sampleClients = [
  {
    _id: 'c1',
    name: 'Jagdamba Agro Polymers',
    industry: 'Industrial & Polymers',
    contactPerson: 'Suresh Patel',
    email: 'info@jagdambapolymers.in',
    phone: '+91 98250 11223',
    status: 'Active',
    monthlyRetainer: 75000,
    brandColors: ['#0f766e', '#0284c7']
  },
  {
    _id: 'c2',
    name: 'RK World Tower Developers',
    industry: 'Real Estate & Infrastructure',
    contactPerson: 'Harshvardhan Jadeja',
    email: 'connect@rkworldtower.com',
    phone: '+91 94281 63116',
    status: 'Active',
    monthlyRetainer: 120000,
    brandColors: ['#b45309', '#1e293b']
  },
  {
    _id: 'c3',
    name: 'Aura Luxury Ayurvedic Spa',
    industry: 'Hospitality & Wellness',
    contactPerson: 'Dr. Meera Trivedi',
    email: 'meera@auraspa.co',
    phone: '+91 99099 44332',
    status: 'Active',
    monthlyRetainer: 45000,
    brandColors: ['#059669', '#fef08a']
  },
  {
    _id: 'c4',
    name: 'Vortex Global ERP Systems',
    industry: 'B2B Software & SaaS',
    contactPerson: 'Rajiv Parekh',
    email: 'partners@vortexerp.io',
    phone: '+91 97230 55667',
    status: 'Active',
    monthlyRetainer: 90000,
    brandColors: ['#6366f1', '#4338ca']
  },
  {
    _id: 'c5',
    name: 'Kavya Organic Superfoods',
    industry: 'FMCG & D2C',
    contactPerson: 'Sneha Dave',
    email: 'order@kavyaorganics.com',
    phone: '+91 94080 22119',
    status: 'Active',
    monthlyRetainer: 55000,
    brandColors: ['#ea580c', '#15803d']
  }
];

export const sampleTasks = [
  {
    _id: 't1',
    taskTitle: 'Diwali Festive Product Catalog & 3D Render Banner',
    client: 'c1',
    clientName: 'Jagdamba Agro Polymers',
    service: 'Graphic Design',
    platform: 'Instagram & LinkedIn',
    assignedEmployee: 'u2',
    assignedEmployeeName: 'Aman Verma (Graphic Designer)',
    priority: 'Urgent',
    status: 'In Progress',
    startDate: new Date('2026-10-10'),
    dueDate: new Date('2026-10-15'),
    description: 'Design premium festive 1:1 post highlighting durable industrial PVC piping solutions with golden warm festive accents.',
    referenceLink: 'https://drive.google.com/drive/folders/jagdamba-diwali-2026'
  },
  {
    _id: 't2',
    taskTitle: 'Navratri Garba Night Event Campaign Carousel',
    client: 'c2',
    clientName: 'RK World Tower Developers',
    service: 'Social Media',
    platform: 'Instagram',
    assignedEmployee: 'u1',
    assignedEmployeeName: 'Kavita Shah (Creative Lead)',
    priority: 'High',
    status: 'Review',
    startDate: new Date('2026-10-08'),
    dueDate: new Date('2026-10-13'),
    description: '5-slide carousel showcasing the prestigious corporate tower lobby lighting and seasonal celebration invite for premium tenants.',
    referenceLink: 'https://figma.com/file/rk-world-navratri-post'
  },
  {
    _id: 't3',
    taskTitle: 'Modern Client Portal & Task Dashboard Interface',
    client: 'c4',
    clientName: 'Vortex Global ERP Systems',
    service: 'ERP Development',
    platform: 'Website',
    assignedEmployee: 'u3',
    assignedEmployeeName: 'Rohan Mehta (Developer)',
    priority: 'High',
    status: 'In Progress',
    startDate: new Date('2026-10-05'),
    dueDate: new Date('2026-10-18'),
    description: 'Build responsive invoice & order tracking dashboard screen using React and Tailwind.',
    referenceLink: 'https://github.com/digi-trend/vortex-erp-portal'
  },
  {
    _id: 't4',
    taskTitle: 'DiGi Trend 2026 Brand Positioning Ad Film (30s Reel)',
    client: 'c2',
    clientName: 'RK World Tower Developers',
    service: 'Video Editing',
    platform: 'YouTube & Instagram',
    assignedEmployee: 'u2',
    assignedEmployeeName: 'Aman Verma',
    priority: 'Medium',
    status: 'To Do',
    startDate: new Date('2026-10-12'),
    dueDate: new Date('2026-10-20'),
    description: 'Fast-paced cinematic montage with sound design, typography animations, and drone footage of the Rajkot skyline.',
    referenceLink: 'https://frame.io/project/rk-world-cut1'
  },
  {
    _id: 't5',
    taskTitle: 'Ayurvedic Skincare Rebrand - Typography & Color Kit',
    client: 'c3',
    clientName: 'Aura Luxury Ayurvedic Spa',
    service: 'Branding',
    platform: 'Cross-Platform',
    assignedEmployee: 'u1',
    assignedEmployeeName: 'Kavita Shah',
    priority: 'Medium',
    status: 'Completed',
    startDate: new Date('2026-09-28'),
    dueDate: new Date('2026-10-05'),
    description: 'Complete brand guide deck containing typography hierarchies, secondary palettes, and packaging guidelines.',
    referenceLink: 'https://behance.net/gallery/aura-ayurveda-identity'
  },
  {
    _id: 't6',
    taskTitle: 'Meta Ads Retargeting Campaign & Audience Segmentation',
    client: 'c5',
    clientName: 'Kavya Organic Superfoods',
    service: 'Digital Marketing',
    platform: 'Facebook & Instagram',
    assignedEmployee: 'u4',
    assignedEmployeeName: 'Pooja Patel (Marketing Strategist)',
    priority: 'Urgent',
    status: 'Review',
    startDate: new Date('2026-10-09'),
    dueDate: new Date('2026-10-14'),
    description: 'Configure custom Lookalike audiences for organic cold-pressed oils with festive discount promo codes.',
    referenceLink: 'https://business.facebook.com/adsmanager/kavya'
  }
];

export const sampleContentPosts = [];

export const sampleAIGenerations = [
  {
    _id: 'ai1',
    prompt: 'Create an Instagram post idea for a plastic manufacturing company for Diwali',
    client: 'Jagdamba Agro Polymers',
    platform: 'Instagram',
    generatedResult: {
      headline: 'Shaping Sustainable Brilliance: Where Precision Engineering Meets Festive Light.',
      visualConcept: 'A high-contrast cinematic visual: Minimalist golden diyas arranged around precision-engineered translucent polymer components. Soft volumetric lighting highlights the sleek edges, with golden bokeh in the deep slate-blue background.',
      caption: 'This Diwali, we celebrate the power of innovation that molds the future. At Jagdamba Agro Polymers, every component is crafted with relentless quality, sustainability, and purpose.\n\nMay the festival of lights illuminate fresh milestones of growth, strong partnerships, and engineering excellence.',
      hashtags: ['#Diwali2026', '#ManufacturingExcellence', '#PlasticEngineering', '#SustainableIndustry', '#MakeInIndia'],
      cta: 'Explore our certified industrial polymers catalog - Link in bio.',
      alternateIdea: 'Behind-the-scenes 15s Reel: Transition from factory molten molding line spark to a glowing golden Diwali diya flame.'
    },
    createdBy: 'Kavita Shah (Creative Lead)',
    generatedAt: new Date(Date.now() - 3600000 * 4)
  },
  {
    _id: 'ai2',
    prompt: 'Why Businesses Need Strong Branding in 2026 post for DiGi Trend agency',
    client: 'DiGi Trend Branding Solutions',
    platform: 'LinkedIn',
    generatedResult: {
      headline: 'In 2026, If Your Brand Looks Like A Template, Your Margins Look Like A Commodity.',
      visualConcept: 'Split visual showing generic grey template on the left vs bespoke high-voltage typographic aesthetic on the right with custom gradient branding.',
      caption: 'When AI can generate 10,000 generic logos in 10 seconds, originality is no longer a luxury—it is your single surviving commercial moat.\n\nBranding is not what you tell people you are; it is the instinctive emotional certainty they feel when choosing you over competitors.',
      hashtags: ['#Branding2026', '#AgencyStrategy', '#DiGiTrend', '#BrandIdentity', '#CommercialDesign'],
      cta: 'Book an executive brand audit with our strategy team.',
      alternateIdea: 'Short carouse on 3 subtle symptoms that your branding is eroding your sales pricing power.'
    },
    createdBy: 'Pooja Patel',
    generatedAt: new Date(Date.now() - 3600000 * 24)
  }
];

export default {
  sampleUsers,
  sampleClients,
  sampleTasks,
  sampleContentPosts,
  sampleAIGenerations
};
