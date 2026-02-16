import { Component } from '@angular/core';
import { Projects } from '../../components/projects/projects';
import { Experience } from '../../components/experience/experience';
import { CareerHighlights } from '../../components/career-highlights/career-highlights';

@Component({
    selector: 'app-work-page',
    standalone: true,
    imports: [Projects, Experience, CareerHighlights],
    template: `
        <app-projects></app-projects>
        <app-experience></app-experience>
        <app-career-highlights></app-career-highlights>
    `
})
export class WorkPage { }
