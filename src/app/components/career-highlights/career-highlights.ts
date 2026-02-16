import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-career-highlights',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './career-highlights.html',
    styleUrls: ['./career-highlights.css']
})
export class CareerHighlights {
    highlights = [
        { value: '3.5+', label: 'Years of Experience' },
        { value: '7+', label: 'Projects Delivered' },
        { value: '4', label: 'Certifications' },
        { value: '9+', label: 'Technologies Mastered' },
        { value: '85%', label: 'Test Coverage Achieved' },
        { value: '70%', label: 'Downtime Reduction' },
        { value: '35%', label: 'Performance Improvement' }
    ];
}
