import { Component } from '@angular/core';
import { About } from '../../components/about/about';

@Component({
    selector: 'app-about-page',
    standalone: true,
    imports: [About],
    template: `<app-about></app-about>`
})
export class AboutPage { }
