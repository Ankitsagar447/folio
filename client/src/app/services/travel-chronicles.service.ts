import { Injectable, signal, computed } from '@angular/core';

export interface TravelMemory {
  id: string;
  stateId: string;
  stateName: string;
  title: string;
  month: string;
  tag: string;
  image: string;
  caption: string;
  moments: string[];
}

const DEFAULT_MEMORIES: TravelMemory[] = [
  {
    id: 'rj-1',
    stateId: 'rj',
    stateName: 'Rajasthan',
    title: 'Desert Dunes of Jaisalmer',
    month: 'Jan 2024',
    tag: 'Desert Safari',
    image: 'https://framerusercontent.com/images/2LJkBFtZIoI5F4qcuQfOsUrTWkc.jpg?width=1600',
    caption: 'Golden sand dunes stretching endlessly under the amber Rajasthani sky.',
    moments: ['🐪 Camel Ride', '🌅 Sunrise Dunes', '🏰 Jaisalmer Fort', '🎵 Folk Music']
  },
  {
    id: 'gj-1',
    stateId: 'gj',
    stateName: 'Gujarat',
    title: 'Rann of Kutch — Salt Flats',
    month: 'Feb 2024',
    tag: 'White Desert',
    image: 'https://framerusercontent.com/images/NxsYJYfP8F45xJEur7Fh8564Ufw.jpg?width=1600',
    caption: 'The infinite white expanse of the Rann under full moon light.',
    moments: ['🌕 Full Moon Night', '🎪 Rann Utsav', '🎨 Handicrafts', '🦩 Flamingos']
  },
  {
    id: 'hp-1',
    stateId: 'hp',
    stateName: 'Himachal Pradesh',
    title: 'Snow Peaks of Spiti',
    month: 'Jul 2023',
    tag: 'Mountain Trek',
    image: 'https://framerusercontent.com/images/kaNtc5VMI2U9SzYecDO3bcPqsY.jpg?width=1600',
    caption: 'Ancient monasteries clinging to dramatic Himalayan cliffs in cold desert.',
    moments: ['🏔️ Himalayan Trek', '🕌 Key Monastery', '🌌 Stargazing', '❄️ Snow Peaks']
  },
  {
    id: 'la-1',
    stateId: 'la',
    stateName: 'Ladakh',
    title: 'Pangong Lake at Sunrise',
    month: 'Aug 2023',
    tag: 'High Altitude',
    image: 'https://framerusercontent.com/images/LDD2FKTUCCQMbUbBbhwBC04rnuI.jpg?width=1600',
    caption: 'The surreal blue-green waters of Pangong Tso mirroring the high-altitude sky.',
    moments: ['🏔️ Khardung La', '🌊 Pangong Tso', '🛺 Leh City', '⭐ Milky Way']
  },
  {
    id: 'kl-1',
    stateId: 'kl',
    stateName: 'Kerala',
    title: 'Backwaters of Alleppey',
    month: 'Dec 2023',
    tag: 'Backwaters',
    image: 'https://framerusercontent.com/images/ZB6AZU2rWR5MSGd3AJLPCn2x7g.jpg?width=1600',
    caption: 'Drifting through calm backwaters on a traditional houseboat.',
    moments: ['🚢 Houseboat', '🌴 Palm Shores', '🐟 Fishing Nets', '🍛 Kerala Cuisine']
  }
];

const STORAGE_KEY = 'portfolio-travel-memories';

import { getApiUrl } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class TravelChroniclesService {
  // Master travel memory signals
  memories = signal<TravelMemory[]>([]);

  // Computed mappings
  memoriesByState = computed(() => {
    const map = new Map<string, TravelMemory[]>();
    for (const mem of this.memories()) {
      if (!map.has(mem.stateId)) {
        map.set(mem.stateId, []);
      }
      map.get(mem.stateId)!.push(mem);
    }
    return map;
  });

  exploredStatesCount = computed(() => this.memoriesByState().size);

  private get apiUrl(): string {
    return getApiUrl('/api/memories');
  }

  constructor() {
    this.syncFromBackend();
  }

  private async syncFromBackend() {
    try {
      const res = await fetch(this.apiUrl);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Ensure Ladakh is included
          const hasLadakh = data.some(m => m.stateId === 'la');
          if (!hasLadakh) {
            const ladakhDef = DEFAULT_MEMORIES.find(m => m.stateId === 'la');
            if (ladakhDef) data.push(ladakhDef);
          }
          this.memories.set(data);
          this.persist();
        }
      }
    } catch {
      // Backend not running or offline; local memories used
    }
  }

  private loadMemories(): TravelMemory[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as TravelMemory[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Guarantee Ladakh and all core states are present
          const hasLadakh = parsed.some(m => m.stateId === 'la');
          if (!hasLadakh) {
            const ladakhDef = DEFAULT_MEMORIES.find(m => m.stateId === 'la');
            if (ladakhDef) parsed.push(ladakhDef);
          }
          return parsed;
        }
      }
    } catch {}
    return [...DEFAULT_MEMORIES];
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.memories()));
    } catch {}
  }

  saveMemory(data: Omit<TravelMemory, 'id'>): TravelMemory {
    const newMemory: TravelMemory = {
      ...data,
      id: `${data.stateId}-${Date.now()}`
    };
    this.memories.update(list => [...list, newMemory]);
    this.persist();

    // Async sync to backend
    fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMemory)
    }).catch(() => {});

    return newMemory;
  }

  deleteMemory(id: string) {
    this.memories.update(list => list.filter(m => m.id !== id));
    this.persist();

    // Async sync to backend
    fetch(`${this.apiUrl}/${id}`, {
      method: 'DELETE'
    }).catch(() => {});
  }

  resetToDefaults() {
    this.memories.set([...DEFAULT_MEMORIES]);
    this.persist();

    // Async sync to backend
    fetch(`${this.apiUrl}/reset`, {
      method: 'POST'
    }).catch(() => {});
  }
}
