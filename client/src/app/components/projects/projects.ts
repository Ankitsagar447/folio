import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PROJECTS, Project } from '../../data/projects.data';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class Projects {
  projects: Project[] = PROJECTS;
}
