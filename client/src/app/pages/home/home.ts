import { Component } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { IntroSectionComponent } from '../../components/intro-section/intro-section';

@Component({
  selector: 'app-home',
  imports: [Hero, IntroSectionComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
}
