import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PROJECTS, Project } from '../../data/projects.data';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css'
})
export class ProjectDetail implements OnInit {
  private route = inject(ActivatedRoute);
  projectId: string | null = null;
  project: Project | undefined;

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.project = PROJECTS.find(p => p.id === this.projectId) || PROJECTS[0];
  }
}
