import { Component } from '@angular/core';
import { Projects } from '../../components/projects/projects';

@Component({
    selector: 'app-work-page',
    standalone: true,
    imports: [Projects],
    template: `<app-projects></app-projects>`
})
export class WorkPage { }
