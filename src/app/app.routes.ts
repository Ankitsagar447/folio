import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { ProjectDetail } from './pages/project-detail/project-detail';
import { Hobbies } from './pages/hobbies/hobbies';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'about', loadComponent: () => import('./pages/about-page/about-page').then(m => m.AboutPage) },
    { path: 'work', loadComponent: () => import('./pages/work-page/work-page').then(m => m.WorkPage) },
    { path: 'contact', loadComponent: () => import('./pages/contact-page/contact-page').then(m => m.ContactPage) },
    { path: 'projects/hobbies', component: Hobbies },
    { path: 'projects/:id', component: ProjectDetail },
    { path: '**', redirectTo: '' }
];

