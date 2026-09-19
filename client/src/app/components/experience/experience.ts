import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ExperienceItem {
    id: number;
    title: string;
    company: string;
    location: string;
    period: string;
    project?: string;
    responsibilities: string[];
    techStack: string[];
}

@Component({
    selector: 'app-experience',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './experience.html',
    styleUrls: ['./experience.css']
})
export class Experience {
    experiences: ExperienceItem[] = [
        {
            id: 1,
            title: 'Angular Developer',
            company: 'Sag Infotech',
            location: 'Jaipur, Rajasthan',
            period: 'April 2024 — Present',
            project: 'SDMT Website Builder & SAG GST Taxation SaaS Platform',
            responsibilities: [
                'Engineered high-performance data tables leveraging PrimeNG, implementing custom column persistence, lazy loading, and advanced filtering to smoothly process large-scale financial datasets without UI lag.',
                'Built an intuitive drag-and-drop website builder enabling non-technical users to create and customize websites, increasing user onboarding efficiency.',
                'Implemented automatic code generation to produce clean, deployment-ready HTML5/TypeScript output, reducing manual development effort.',
                'Optimized real-time UI rendering and state management using RxJS, ensuring a seamless, lag-free editing experience.',
                'Designed mobile-first interfaces using flexible layouts and CSS Grid systems to ensure responsiveness across all major browsers and devices.',
                'Developed a reusable UI component library with PrimeNG, standardizing design patterns and accelerating feature delivery cycles.',
                'Enhanced final site performance by integrating automated asset optimization and minification, achieving Lighthouse scores of 90+ for generated websites.',
                'Developed a comprehensive GST Taxation SaaS application for tax professionals, streamlining filing, payment processing, and regulatory compliance for 1,000+ business entities.',
                'Engineered dynamic, high-performance data tables using PrimeNG, featuring customizable column persistence, advanced filtering, and bulk-action capabilities to handle large financial datasets.',
                'Implemented multi-tenant architecture patterns to improve usability and efficiency for firms managing multiple client portfolios within a single, secure session.',
                'Integrated secure RESTful APIs for automated tax calculations and ledger synchronization, ensuring data integrity across complex financial workflows.'
            ],
            techStack: ['Angular 17 / 21', 'TypeScript', 'JavaScript (ES6+)', 'PrimeNG', 'RxJS', 'HTML5', 'CSS3', 'SCSS', 'REST APIs', 'JSON', 'Git', 'Jira']
        },
        {
            id: 2,
            title: 'SDE-1',
            company: 'Stoild',
            location: 'Jaipur, Rajasthan',
            period: 'Dec 2023 — April 2024',
            project: 'API-Driven Enterprise Architecture & Modular Workflows',
            responsibilities: [
                'Developed Angular applications using API-based architecture, demonstrating strong expertise in the Angular framework.',
                'Delivered application features using Agile Scrum methodology by breaking down development into multiple sprints.',
                'Developed a robust data-access layer by integrating RESTful APIs with Angular’s HttpClient, ensuring type-safety through the implementation of TypeScript interfaces and models.',
                'Utilized RxJS operators such as switchMap, mergeMap, forkJoin, and BehaviorSubject to efficiently manage asynchronous data streams and state updates.',
                'Created custom Angular services and interceptors for centralized API communication, error handling, request logging, and token management.',
                'Collaborated closely with backend teams to define API contracts, troubleshoot integration issues, and optimize data exchange workflows.',
                'Integrated third-party libraries and REST APIs to extend application functionality while maintaining performance and security standards.',
                'Refactored legacy features to take advantage of Angular 14 Standalone Components, reducing module complexity and improving the application’s initial bundle size.',
                'Leveraged Angular 14 Standalone Components to implement granular lazy loading at the component level, bypassing the overhead of traditional NgModules.'
            ],
            techStack: ['Angular 14', 'TypeScript', 'RxJS', 'HttpClient', 'Standalone Components', 'Services & Interceptors', 'REST APIs', 'Postman', 'Git', 'Jira']
        },
        {
            id: 3,
            title: 'Associate Engineer',
            company: 'Nagarro',
            location: 'Jaipur, Rajasthan',
            period: 'July 2022 — Dec 2023',
            project: 'Client-Side Inventory Management & Service Center Asset Tracking',
            responsibilities: [
                'Developed a client-side inventory management system to track and manage service center assets.',
                'Implemented real-time inventory tracking to monitor stock levels and updates.',
                'Implemented advanced search, filtering, sorting, and pagination features for large inventory datasets, enhancing user productivity.',
                'Implemented lazy loading and route guards to improve application performance and secure access to inventory management modules.',
                'Implemented audit tracking and activity logging features to maintain a complete history of inventory modifications and user actions.',
                'Added automated email notifications to alert users about inventory changes and important updates.',
                'Secured sensitive asset data by implementing Country Code Based Access and Role-Based Access Control to restrict inventory edits to authorized personnel.',
                'Developed complex reactive forms with custom validator to ensure data integrity and reduce user input errors during asset registration.',
                'Built comprehensive service center management features to streamline operations.'
            ],
            techStack: ['Angular 6 / 14', 'TypeScript', 'JavaScript', 'PrimeNG', 'Reactive Forms', 'Custom Validators', 'Route Guards', 'HTML5', 'SCSS', 'RBAC', 'Git']
        }
    ];
}
