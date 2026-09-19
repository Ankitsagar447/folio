import { Component, signal, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TravelChroniclesService, TravelMemory } from '../../../services/travel-chronicles.service';
import { INDIA_STATES } from '../../../data/india-map.data';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  private router = inject(Router);
  readonly travelService = inject(TravelChroniclesService);

  readonly allStates = INDIA_STATES;

  activeTab = signal<'add' | 'manage'>('add');

  // Form fields
  formStateId = signal('rj');
  formTitle = signal('');
  formMonth = signal('');
  formTag = signal('');
  formImageUrl = signal('');
  formImagePreview = signal('');
  formCaption = signal('');
  formMoments = signal('');
  formFeedback = signal<{ type: 'success' | 'error'; message: string } | null>(null);

  memories = computed(() => this.travelService.memories());
  exploredCount = computed(() => this.travelService.exploredStatesCount());

  logout() {
    localStorage.removeItem('admin-auth');
    localStorage.removeItem('admin-token');
    this.router.navigate(['/admin/login']);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        this.formImagePreview.set(result);
        this.formImageUrl.set(result);
      };
      reader.readAsDataURL(file);
    }
  }

  saveMemory() {
    const stateId = this.formStateId();
    const stateObj = this.allStates.find(s => s.id === stateId);
    const stateName = stateObj ? stateObj.name : 'India';

    const image = this.formImagePreview() || this.formImageUrl().trim();
    if (!image) {
      this.formFeedback.set({ type: 'error', message: 'Please upload an image or provide an image URL.' });
      return;
    }

    const moments = this.formMoments()
      .split(',')
      .map(m => m.trim())
      .filter(m => m.length > 0);

    if (moments.length === 0) {
      moments.push('📸 Photography', '✨ Expedition', '📍 ' + stateName);
    }

    this.travelService.saveMemory({
      stateId,
      stateName,
      title: this.formTitle().trim() || `${stateName} Journey`,
      month: this.formMonth().trim() || 'Travel Chronicle',
      tag: this.formTag().trim() || 'Visual Story',
      image,
      caption: this.formCaption().trim() || `Memories from ${stateName}.`,
      moments
    });

    this.formFeedback.set({ type: 'success', message: `Memory for ${stateName} published!` });
    this.formTitle.set('');
    this.formMonth.set('');
    this.formTag.set('');
    this.formImageUrl.set('');
    this.formImagePreview.set('');
    this.formCaption.set('');
    this.formMoments.set('');
    setTimeout(() => this.formFeedback.set(null), 3000);
  }

  deleteMemory(id: string) {
    if (confirm('Delete this memory?')) {
      this.travelService.deleteMemory(id);
    }
  }

  resetDefaults() {
    if (confirm('Reset all memories to defaults?')) {
      this.travelService.resetToDefaults();
      this.formFeedback.set({ type: 'success', message: 'Reset to default memories.' });
      setTimeout(() => this.formFeedback.set(null), 2000);
    }
  }

  goToPortfolio() {
    this.router.navigate(['/projects/hobbies']);
  }
}
