import { Component } from '@angular/core';


@Component({
  selector: 'app-projects',
  imports: [],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class Projects {
  projects = [
    {
      id: 1,
      title: 'Brand Design',
      category: 'Identity',
      year: '2024',
      image: 'assets/project-1.png',
      color: '#E0E0E0',
      textColor: '#000000'
    },
    {
      id: 2,
      title: 'UI/UX Design',
      category: 'Mobile App',
      year: '2023',
      image: 'assets/project-2.png',
      color: '#1A1A1A',
      textColor: '#FFFFFF'
    },
    {
      id: 3,
      title: 'Motion Design',
      category: 'Interaction',
      year: '2024',
      image: 'assets/project-3.png',
      color: '#F5F5F5',
      textColor: '#000000'
    },
    {
      id: 4,
      title: 'Web Design',
      category: 'Portfolio',
      year: '2023',
      image: 'assets/project-1.png', // Reusing for loop
      color: '#E0E0E0',
      textColor: '#000000'
    }
  ];
}
