import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css'
})
export class ProjectCard {
  @Input() id!: string;
  @Input() title!: string;
  @Input() category!: string;
  @Input() year!: string;
  @Input() color!: string;
  @Input() image!: string;
  @Input() textColor: string = '#1A1A1A'; // Default to dark text
}
