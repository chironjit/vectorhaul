export type Locale = 'en' | 'ms';

export interface FeatureEntry {
  icon: string;
  title: string;
  description: string;
}

export interface UseCaseEntry {
  icon: string;
  title: string;
  description: string;
  benefits: string[];
}

export interface FooterLinkEntry {
  label: string;
  href: string;
}

export interface FooterSectionEntry {
  title: string;
  links: FooterLinkEntry[];
}

export interface TranslationsShape {
  navbar: {
    brand: string;
    features: string;
    useCases: string;
    contact: string;
    dashboard: string;
    ariaToggleTheme: string;
    ariaSelectLanguage: string;
    langEn: string;
    langMs: string;
  };
  hero: {
    badge: string;
    words: string[];
    headingUnified: string;
    headingTrackingPlatform: string;
    tagline: string;
    viewDashboard: string;
    learnMore: string;
    statActiveAssets: string;
    statCountries: string;
    statUptime: string;
    statUpdateLatency: string;
  };
  features: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    list: FeatureEntry[];
  };
  useCases: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    list: UseCaseEntry[];
  };
  cta: {
    title: string;
    description: string;
    viewLiveDemo: string;
    requestDemo: string;
    secureEncrypted: string;
    realTimeUpdates: string;
    support247: string;
  };
  footer: {
    brand: string;
    tagline: string;
    sections: FooterSectionEntry[];
    copyright: string;
    privacyPolicy: string;
    termsOfService: string;
    cookiePolicy: string;
  };
  meta: {
    title: string;
    description: string;
  };
}

const en: TranslationsShape = {
  navbar: {
    brand: 'VectorHaul',
    features: 'Features',
    useCases: 'Use Cases',
    contact: 'Contact',
    dashboard: 'Dashboard',
    ariaToggleTheme: 'Toggle theme',
    ariaSelectLanguage: 'Select language',
    langEn: 'EN',
    langMs: 'BM',
  },
  hero: {
    badge: 'Real-Time Tracking Capable',
    words: ['Fleet', 'Driver', 'Asset'],
    headingUnified: 'Unified',
    headingTrackingPlatform: 'Datahub',
    tagline:
      'Track and manage your fleet across the globe. Collate data and utilise advanced analytics to gain visibility into your fleet operations ',
    viewDashboard: 'Request Demo',
    learnMore: 'Learn More',
    statActiveAssets: 'Active Assets',
    statCountries: 'Countries',
    statUptime: 'Uptime',
    statUpdateLatency: 'Update Latency',
  },
  features: {
    badge: 'Features',
    title: 'Everything You Need for ',
    titleHighlight: 'Fleet Management',
    subtitle:
      'Our platform provides comprehensive tools to monitor, manage, and optimize your logistics operations across Southeast Asia.',
    list: [
      {
        icon: 'location',
        title: 'Real-Time Tracking',
        description:
          'Monitor your fleet with live GPS updates. See exact locations, speeds, and routes in real-time on an interactive map.',
      },
      {
        icon: 'data',
        title: 'Multi-Source Integration',
        description:
          'Integrate data from multiple GPS devices and tracking sources. Unified dashboard for all your logistics assets.',
      },
      {
        icon: 'chart',
        title: 'Advanced Analytics',
        description:
          'Gain insights with comprehensive analytics. Track performance metrics, route efficiency, and fleet utilization.',
      },
      {
        icon: 'shield',
        title: 'Enterprise Security',
        description:
          'Enterprise-grade security with encrypted data transmission. Role-based access control and audit logging.',
      },
    ],
  },
  useCases: {
    badge: 'Use Cases',
    title: 'Built for ',
    titleHighlight: 'Every Logistics Need',
    subtitle:
      "Whether you're managing a delivery fleet or coordinating complex supply chains, our platform adapts to your needs.",
    list: [
      {
        icon: 'truck',
        title: 'Fleet Management',
        description: 'Complete visibility and control over your vehicle fleet.',
        benefits: [
          'Real-time vehicle tracking',
          'Driver performance monitoring',
          'Fuel efficiency optimization',
        ],
      },
      {
        icon: 'chain',
        title: 'Supply Chain Visibility',
        description: 'End-to-end visibility across your entire supply chain.',
        benefits: [
          'Shipment tracking',
          'Warehouse integration',
          'Delivery status updates',
        ],
      },
      {
        icon: 'package',
        title: 'Last-Mile Delivery',
        description: 'Optimize your last-mile delivery operations.',
        benefits: [
          'Route optimization',
          'Delivery ETAs',
          'Customer notifications',
        ],
      },
      {
        icon: 'network',
        title: 'Multi-Partner Logistics',
        description: 'Coordinate seamlessly with multiple logistics partners.',
        benefits: [
          'Unified tracking view',
          'Partner performance metrics',
          'SLA monitoring',
        ],
      },
    ],
  },
  cta: {
    title: 'Ready to Transform Your Logistics Operations?',
    description:
      'Join leading logistics companies across Southeast Asia who trust our platform for real-time fleet visibility and operational excellence.',
    viewLiveDemo: 'View Live Demo',
    requestDemo: 'Request Demo',
    secureEncrypted: 'Secure & Encrypted',
    realTimeUpdates: 'Real-time Updates',
    support247: '24/7 Support',
  },
  footer: {
    brand: 'VectorHaul',
    tagline:
      'Unified logistics tracking platform for real-time fleet visibility across Southeast Asia.',
    sections: [
      {
        title: 'Product',
        links: [
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Features', href: '#features' },
          { label: 'Use Cases', href: '#use-cases' },
          { label: 'Pricing', href: '#pricing' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'Documentation', href: '#' },
          { label: 'API Reference', href: '#' },
          { label: 'Support', href: '#' },
          { label: 'Status', href: '#' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About Us', href: '#' },
          { label: 'Contact', href: '#contact' },
          { label: 'Careers', href: '#' },
          { label: 'Blog', href: '#' },
        ],
      },
    ],
    copyright: 'Logistics Tracker Platform. All rights reserved.',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    cookiePolicy: 'Cookie Policy',
  },
  meta: {
    title: 'VectorHaul - Unified Fleet Datahub',
    description:
      'Track and manage your fleet across the globe. Collate data and utilise advanced analytics to gain visibility into your fleet operations',
  },
};

const ms: TranslationsShape = {
  navbar: {
    brand: 'VectorHaul',
    features: 'Ciri-ciri',
    useCases: 'Kes Penggunaan',
    contact: 'Hubungi',
    dashboard: 'Papan Pemuka',
    ariaToggleTheme: 'Tukar tema',
    ariaSelectLanguage: 'Pilih bahasa',
    langEn: 'EN',
    langMs: 'BM',
  },
  hero: {
    badge: 'Platform Penjejakan GPS Masa Nyata',
    words: ['Armada', 'Pemandu', 'Aset'],
    headingUnified: 'Penyatuan',
    headingTrackingPlatform: 'Platform Penjejakan',
    tagline:
      'Jejak armada anda secara masa nyata di seluruh Asia Tenggara. Dapatkan visibiliti penuh operasi logistik anda dengan penyelesaian penjejakan peringkat perusahaan.',
    viewDashboard: 'Lihat Papan Pemuka',
    learnMore: 'Ketahui Lebih Lanjut',
    statActiveAssets: 'Aset Aktif',
    statCountries: 'Negara',
    statUptime: 'Masa Beroperasi',
    statUpdateLatency: 'Kependaman Kemas Kini',
  },
  features: {
    badge: 'Ciri-ciri',
    title: 'Semua Yang Anda Perlukan untuk ',
    titleHighlight: 'Pengurusan Armada',
    subtitle:
      'Platform kami menyediakan alat menyeluruh untuk memantau, mengurus dan mengoptimumkan operasi logistik anda di seluruh Asia Tenggara.',
    list: [
      {
        icon: 'location',
        title: 'Penjejakan Masa Nyata',
        description:
          'Pantau armada anda dengan kemas kini GPS secara langsung. Lihat lokasi tepat, kelajuan dan laluan secara masa nyata pada peta interaktif.',
      },
      {
        icon: 'data',
        title: 'Integrasi Pelbagai Sumber',
        description:
          'Integrasikan data daripada pelbagai peranti GPS dan sumber penjejakan. Papan pemuka bersatu untuk semua aset logistik anda.',
      },
      {
        icon: 'chart',
        title: 'Analitik Lanjutan',
        description:
          'Dapatkan pandangan dengan analitik menyeluruh. Jejak metrik prestasi, kecekapan laluan dan penggunaan armada.',
      },
      {
        icon: 'shield',
        title: 'Keselamatan Perusahaan',
        description:
          'Keselamatan peringkat perusahaan dengan penghantaran data disulitkan. Kawalan akses berasaskan peranan dan audit log.',
      },
    ],
  },
  useCases: {
    badge: 'Kes Penggunaan',
    title: 'Dibina untuk ',
    titleHighlight: 'Setiap Keperluan Logistik',
    subtitle:
      'Sama ada anda mengurus armada penghantaran atau menyelaraskan rantaian bekalan yang kompleks, platform kami menyesuaikan dengan keperluan anda.',
    list: [
      {
        icon: 'truck',
        title: 'Pengurusan Armada',
        description: 'Visibiliti dan kawalan penuh ke atas armada kenderaan anda.',
        benefits: [
          'Penjejakan kenderaan masa nyata',
          'Pemantauan prestasi pemandu',
          'Pengoptimuman kecekapan bahan api',
        ],
      },
      {
        icon: 'chain',
        title: 'Visibiliti Rantaian Bekalan',
        description: 'Visibiliti hujung-ke-hujung merentasi keseluruhan rantaian bekalan anda.',
        benefits: [
          'Penjejakan penghantaran',
          'Integrasi gudang',
          'Kemas kini status penghantaran',
        ],
      },
      {
        icon: 'package',
        title: 'Penghantaran Batu Terakhir',
        description: 'Optimumkan operasi penghantaran batu terakhir anda.',
        benefits: [
          'Pengoptimuman laluan',
          'ETA penghantaran',
          'Notifikasi pelanggan',
        ],
      },
      {
        icon: 'network',
        title: 'Logistik Pelbagai Rakan Kongsi',
        description: 'Berkordinasi dengan lancar bersama pelbagai rakan kongsi logistik.',
        benefits: [
          'Pandangan penjejakan bersatu',
          'Metrik prestasi rakan kongsi',
          'Pemantauan SLA',
        ],
      },
    ],
  },
  cta: {
    title: 'Bersedia untuk Mengubah Operasi Logistik Anda?',
    description:
      'Sertai syarikat logistik terkemuka di seluruh Asia Tenggara yang mempercayai platform kami untuk visibiliti armada masa nyata dan kecemerlangan operasi.',
    viewLiveDemo: 'Lihat Demo Langsung',
    requestDemo: 'Minta Demo',
    secureEncrypted: 'Selamat & Disulitkan',
    realTimeUpdates: 'Kemas Kini Masa Nyata',
    support247: 'Sokongan 24/7',
  },
  footer: {
    brand: 'Logistics Tracker',
    tagline:
      'Platform penjejakan logistik bersatu untuk visibiliti armada masa nyata di seluruh Asia Tenggara.',
    sections: [
      {
        title: 'Produk',
        links: [
          { label: 'Papan Pemuka', href: '/dashboard' },
          { label: 'Ciri-ciri', href: '#features' },
          { label: 'Kes Penggunaan', href: '#use-cases' },
          { label: 'Harga', href: '#pricing' },
        ],
      },
      {
        title: 'Sumber',
        links: [
          { label: 'Dokumentasi', href: '#' },
          { label: 'Rujukan API', href: '#' },
          { label: 'Sokongan', href: '#' },
          { label: 'Status', href: '#' },
        ],
      },
      {
        title: 'Syarikat',
        links: [
          { label: 'Tentang Kami', href: '#' },
          { label: 'Hubungi', href: '#contact' },
          { label: 'Kerjaya', href: '#' },
          { label: 'Blog', href: '#' },
        ],
      },
    ],
    copyright: 'Platform Logistics Tracker. Hak cipta terpelihara.',
    privacyPolicy: 'Dasar Privasi',
    termsOfService: 'Terma Perkhidmatan',
    cookiePolicy: 'Dasar Kuki',
  },
  meta: {
    title: 'Logistics Tracker - Platform Penjejakan Armada Masa Nyata',
    description:
      'Platform Penjejakan Logistik Bersatu - Penjejakan GPS masa nyata di seluruh Asia Tenggara',
  },
};

export const translations: Record<Locale, TranslationsShape> = { en, ms };
