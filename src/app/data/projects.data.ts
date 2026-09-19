export interface Project {
    id: string;
    title: string;
    category: string;
    role: string;
    company: string;
    year: string;
    description: string;
    highlights: string[];
    technologies: string[];
    image: string;
    color: string;
    accentColor: string;
}

export const PROJECTS: Project[] = [
    {
        id: 'sdmt',
        title: 'SDMT - Website Builder Platform',
        category: 'Low-Code Platform',
        role: 'Angular Developer / Frontend Architect',
        company: 'Sag Infotech (Jaipur, Rajasthan)',
        year: '2024',
        description: 'A low-code website creation platform that enables businesses and individuals to build, customize, and publish professional websites without coding expertise. The platform offers drag-and-drop page design, reusable components, template-based development, real-time previews, theme customization, and automated code generation. It simplifies website development while ensuring responsive design, performance optimization, and cross-browser compatibility.',
        highlights: [
            'Built an intuitive drag-and-drop website builder enabling non-technical users to create and customize websites, increasing user onboarding efficiency.',
            'Implemented automatic code generation producing clean, deployment-ready HTML5/TypeScript output, reducing manual development effort.',
            'Optimized real-time UI rendering and state management using RxJS, ensuring a seamless, lag-free editing experience.',
            'Designed mobile-first interfaces using flexible layouts and CSS Grid systems to ensure responsiveness across all major browsers and devices.',
            'Enhanced final site performance by integrating automated asset optimization and minification, achieving Lighthouse scores of 90+ for generated websites.',
            'Developed a reusable UI component library with PrimeNG, standardizing design patterns and accelerating feature delivery cycles.'
        ],
        technologies: ['Angular 17', 'Angular 21', 'TypeScript', 'JavaScript', 'PrimeNG', 'RxJS', 'HTML5', 'CSS3', 'SCSS', 'REST APIs', 'JSON', 'Git'],
        image: 'assets/project-2.png',
        color: '#1E293B',
        accentColor: '#3B82F6'
    },
    {
        id: 'sag-gst',
        title: 'SAG GST - GST Taxation & Compliance Platform',
        category: 'FinTech SaaS',
        role: 'Angular Developer',
        company: 'Sag Infotech (Jaipur, Rajasthan)',
        year: '2024',
        description: 'A comprehensive GST compliance and taxation software solution designed for tax professionals, accountants, and businesses. The platform streamlines GST return filing, tax calculation, invoice management, compliance tracking, ledger reconciliation, and regulatory reporting for 1,000+ business entities. It supports multi-client management, secure financial data handling, and automated workflows to simplify complex taxation processes.',
        highlights: [
            'Engineered high-performance data tables leveraging PrimeNG, implementing custom column persistence, lazy loading, and advanced filtering to smoothly process large-scale financial datasets without UI lag.',
            'Developed a comprehensive GST Taxation SaaS application for tax professionals, streamlining filing, payment processing, and regulatory compliance for 1,000+ business entities.',
            'Implemented multi-tenant architecture patterns to improve usability and efficiency for firms managing multiple client portfolios within a single, secure session.',
            'Integrated secure RESTful APIs for automated tax calculations and ledger synchronization, ensuring data integrity across complex financial workflows.'
        ],
        technologies: ['Angular 8', 'TypeScript', 'JavaScript', 'PrimeNG', 'RxJS', 'HTML5', 'SCSS', 'REST APIs', 'Git'],
        image: 'assets/project-1.png',
        color: '#064E3B',
        accentColor: '#10B981'
    },
    {
        id: 'lms',
        title: 'LMS - Inventory Management System',
        category: 'Asset & Inventory Platform',
        role: 'Associate Engineer',
        company: 'Nagarro (Jaipur, Rajasthan)',
        year: '2023',
        description: 'A web-based inventory and asset management solution designed for service centers to efficiently track, manage, and monitor organizational assets. The system provides real-time inventory visibility, asset registration, stock monitoring, automated notifications, and role-based access controls. It helps organizations maintain accurate inventory records, improve operational efficiency, and reduce asset mismanagement.',
        highlights: [
            'Developed a client-side inventory management system to track and manage service center assets.',
            'Implemented real-time inventory tracking to monitor stock levels and updates.',
            'Implemented advanced search, filtering, sorting, and pagination features for large inventory datasets, enhancing user productivity.',
            'Implemented lazy loading and route guards to improve application performance and secure access to inventory management modules.',
            'Implemented audit tracking and activity logging features to maintain a complete history of inventory modifications and user actions.',
            'Added automated email notifications to alert users about inventory changes and important updates.',
            'Secured sensitive asset data by implementing Country Code Based Access and Role-Based Access Control (RBAC) to restrict inventory edits to authorized personnel.',
            'Developed complex reactive forms with custom validator to ensure data integrity and reduce user input errors during asset registration.'
        ],
        technologies: ['Angular 14', 'TypeScript', 'JavaScript', 'PrimeNG', 'Reactive Forms', 'HTML5', 'SCSS', 'RBAC', 'Git'],
        image: 'assets/project-3.png',
        color: '#312E81',
        accentColor: '#8B5CF6'
    },
    {
        id: 'rcaaid',
        title: 'RCAAID - Automobile Service Record Management Portal',
        category: 'Automotive Lifecycle Portal',
        role: 'Associate Engineer',
        company: 'Nagarro (Jaipur, Rajasthan)',
        year: '2022 – 2023',
        description: 'A web-based automobile service record management platform designed to digitally maintain and track vehicle service histories throughout their lifecycle. The system enables service centers, dealerships, and vehicle owners to store, manage, and access maintenance records, repair details, service schedules, warranty information, and vehicle history from a centralized platform. Digitizing vehicle maintenance data improves service transparency, streamlines workshop operations, and ensures accurate record keeping.',
        highlights: [
            'Provided real-time access to complete service records, automated service reminders, customer and vehicle management.',
            'Digitized vehicle maintenance lifecycle data, improving service transparency and workshop operations.',
            'Developed modular component architecture with PrimeNG data grids and responsive styling.',
            'Implemented automated workflows and reporting features for service centers and dealerships.'
        ],
        technologies: ['Angular 6', 'TypeScript', 'JavaScript', 'PrimeNG', 'HTML5', 'CSS3', 'Git'],
        image: 'assets/project-2.png',
        color: '#7C2D12',
        accentColor: '#F97316'
    }
];
