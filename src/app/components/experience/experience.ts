import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ExperienceItem {
    id: number;
    title: string;
    company: string;
    location?: string;
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
            company: 'SAG Infotech Private Ltd.',
            period: 'April 2024 – Present',
            project: 'Drag-and-Drop Website Builder & Taxation Platforms',
            responsibilities: [
                'Developed a scalable drag-and-drop website builder using Angular’s component-based architecture, enabling users to dynamically add, configure, and rearrange UI components.',
                'Implemented dynamic rendering of components, real-time preview, and layout management using grid-based responsive design principles.',
                'Built automatic code generation modules to export deployment-ready HTML, CSS, and Angular-compatible structures, reducing manual development effort.',
                'Integrated multiple REST APIs using RxJS observables for data handling, configuration saving, and preview rendering.',
                'Optimized application performance by applying lazy loading modules, on-push change detection, and efficient state handling.',
                'Ensured cross-browser compatibility and mobile-first responsiveness across Chrome, Firefox, Edge, and mobile browsers.',
                'Worked closely with backend, QA, and product teams to understand business requirements and deliver production-ready features.',
                'Used Git for version control, handled feature branches, code reviews, and merge conflict resolution.',
                'Actively participated in sprint planning, daily stand-ups, and release cycles in an Agile environment.'
            ],
            techStack: ['Angular 8 / 12 / 17', 'TypeScript', 'JavaScript', 'HTML5', 'SCSS', 'RxJS', 'PrimeNG', 'Bootstrap', 'REST APIs', 'Git', 'Jira']
        },
        {
            id: 2,
            title: 'Software Development Engineer – 1 (SDE-1)',
            company: 'STOILD',
            period: 'December 2023 – April 2024',
            project: 'API-Based Enterprise Web Application',
            responsibilities: [
                'Developed frontend modules using Angular with REST API integration, focusing on reusable components and modular architecture.',
                'Implemented role-based UI flows, form validations, and dynamic dashboards based on API responses.',
                'Worked on data binding, reactive forms, and RxJS-based service layers for asynchronous operations.',
                'Collaborated with backend teams working on Java Spring Boot services to align request/response models.',
                'Followed Agile Scrum methodology, delivering features in sprints and participating in sprint reviews and retrospectives.',
                'Performed debugging, bug fixing, and performance tuning to improve application stability.',
                'Ensured cross-browser compatibility and responsive behavior across devices.',
                'Used Postman for API testing and validation before frontend integration.'
            ],
            techStack: ['Angular', 'TypeScript', 'JavaScript', 'HTML5', 'SCSS', 'RxJS', 'REST APIs', 'Spring Boot (integration)', 'Postman', 'Git', 'Jira']
        },
        {
            id: 3,
            title: 'Associate Engineer',
            company: 'ATCS',
            period: 'July 2022 – December 2023',
            project: 'Enterprise Dashboard & API-Driven Applications',
            responsibilities: [
                'Developed enterprise-level UI modules using Angular 6, following component-based and modular design patterns.',
                'Integrated RESTful APIs for dashboards, reports, and data management features.',
                'Improved performance and maintainability by implementing lazy-loaded modules and reusable shared components.',
                'Worked extensively on PrimeNG UI components and custom styling for business dashboards.',
                'Participated in daily Scrum meetings, task estimation, and sprint planning using Jira.',
                'Collaborated with QA teams for bug tracking and production issue resolution.',
                'Supported migration planning for newer Angular versions by following best practices in architecture and coding standards.',
                'Gained exposure to backend workflows in Spring Boot-based services and API debugging.'
            ],
            techStack: ['Angular 6', 'TypeScript 2.9', 'JavaScript', 'HTML5', 'CSS', 'PrimeNG', 'Bootstrap', 'RxJS', 'REST APIs', 'Git', 'Jira', 'Postman']
        }
    ];
}
