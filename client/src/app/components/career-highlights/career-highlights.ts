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
        { value: '4+', label: 'Years of Experience' },
        { value: '4', label: 'Enterprise Platforms' },
        { value: '1,000+', label: 'Businesses Supported' },
        { value: '90+', label: 'Lighthouse Score' },
        { value: 'v2–v21', label: 'Angular Depth' },
        { value: '100%', label: 'Pixel-Perfect Delivery' }
    ];
}
