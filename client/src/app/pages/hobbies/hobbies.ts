import { Component, effect, signal, computed, HostListener, OnDestroy, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { INDIA_STATES, INDIA_MAP_VIEWBOX, IndiaStateLocation } from '../../data/india-map.data';
import { TravelChroniclesService } from '../../services/travel-chronicles.service';

interface Stamp {
    id: number;
    image: string;
    rotation: number;
    top: number;
    left: number;
    speed: number;
    zIndex: number;
}

@Component({
    selector: 'app-hobbies',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './hobbies.html',
    styleUrls: ['./hobbies.css']
})
export class Hobbies implements AfterViewInit, OnDestroy {
    readonly travelService = inject(TravelChroniclesService);

    readonly allStates: IndiaStateLocation[] = INDIA_STATES;
    readonly viewBox = INDIA_MAP_VIEWBOX;

    currentTime = signal(new Date());

    // View Mode: 'states' (3D Bharat Yatra) or 'canvas' (Floating Polaroid Canvas)
    viewMode = signal<'states' | 'canvas'>('states');

    // Active highlighted state in the 3D map (default 'rj' - Rajasthan)
    activeStateId = signal<string>('rj');

    // State filter (null = show all states)
    selectedFilterStateId = signal<string | null>(null);

    // Filtered memories list based on state selection
    filteredMemories = computed(() => {
        const filterId = this.selectedFilterStateId();
        const all = this.travelService.memories();
        if (!filterId) return all;
        return all.filter(m => m.stateId === filterId);
    });

    // States that currently have one or more memories
    statesWithMemories = computed(() => {
        const all = this.travelService.memories();
        const ids = new Set(all.map(m => m.stateId));
        return this.allStates.filter(s => ids.has(s.id));
    });

    // Hovered state on the 3D map
    hoveredState = signal<IndiaStateLocation | null>(null);
    tooltipPos = signal<{ x: number; y: number }>({ x: 0, y: 0 });

    // 3D Perspective controls (top view by default)
    is3dAngle = signal<boolean>(false);
    tiltTransform = signal<string>('rotateX(0deg) rotateY(0deg) rotateZ(0deg)');

    // Scroll tracking for floating header visibility and scroll-to-top button
    isScrolledDown = signal<boolean>(false);

    // Fullscreen Preview State
    selectedImage = signal<string | null>(null);
    currentPreviewList = signal<string[]>([]);
    currentIndex = signal<number>(0);

    // Infinite Canvas State
    panX = signal(0);
    panY = signal(0);
    private targetPanX = 0;
    private targetPanY = 0;
    private animationFrameId: number | null = null;
    private observer: IntersectionObserver | null = null;

    readonly GRID_WIDTH = 2000;
    readonly GRID_HEIGHT = 1500;

    readonly STAMP_IMAGES = [
        'https://framerusercontent.com/images/2LJkBFtZIoI5F4qcuQfOsUrTWkc.jpg?width=1600',
        'https://framerusercontent.com/images/NxsYJYfP8F45xJEur7Fh8564Ufw.jpg?width=1600',
        'https://framerusercontent.com/images/kaNtc5VMI2U9SzYecDO3bcPqsY.jpg?width=1600',
        'https://framerusercontent.com/images/LDD2FKTUCCQMbUbBbhwBC04rnuI.jpg?width=1600',
        'https://framerusercontent.com/images/ZB6AZU2rWR5MSGd3AJLPCn2x7g.jpg?width=1600'
    ];

    stamps: Stamp[] = this.generateStamps(50);

    private generateStamps(count: number): Stamp[] {
        const stamps: Stamp[] = [];
        for (let i = 0; i < count; i++) {
            stamps.push({
                id: i,
                image: this.STAMP_IMAGES[i % this.STAMP_IMAGES.length],
                rotation: Math.floor(Math.random() * 50 - 25),
                top: Math.floor(Math.random() * this.GRID_HEIGHT),
                left: Math.floor(Math.random() * this.GRID_WIDTH),
                speed: 1.0,
                zIndex: Math.floor(Math.random() * 10) + 1
            });
        }
        return stamps;
    }

    constructor() {
        effect((onCleanup) => {
            const timer = setInterval(() => {
                this.currentTime.set(new Date());
            }, 1000);
            onCleanup(() => clearInterval(timer));
        });

        this.animate();
    }

    ngAfterViewInit() {
        this.setupObserver();
    }

    ngOnDestroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        if (this.observer) {
            this.observer.disconnect();
        }
        document.body.style.overflow = '';
        document.body.style.cursor = 'default';
    }

    setViewMode(mode: 'states' | 'canvas') {
        this.viewMode.set(mode);
        if (mode === 'states') {
            document.body.style.overflow = 'auto';
            setTimeout(() => {
                this.setupObserver();
            }, 100);
        } else {
            document.body.style.overflow = 'hidden';
        }
    }

    // Check if a state has any travel memories
    hasMemories(stateId: string): boolean {
        const list = this.travelService.memoriesByState().get(stateId);
        return !!(list && list.length > 0);
    }

    getMemoriesCount(stateId: string): number {
        const list = this.travelService.memoriesByState().get(stateId);
        return list ? list.length : 0;
    }

    // State Filter Methods
    filterByState(stateId: string) {
        if (this.selectedFilterStateId() === stateId) {
            this.selectedFilterStateId.set(null);
        } else {
            this.selectedFilterStateId.set(stateId);
            this.activeStateId.set(stateId);
            setTimeout(() => {
                const targetCard = document.querySelector(`[data-state-id="${stateId}"]`) as HTMLElement;
                if (targetCard) {
                    targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 60);
        }
    }

    clearStateFilter() {
        this.selectedFilterStateId.set(null);
    }

    getFilterStateName(): string {
        const id = this.selectedFilterStateId();
        if (!id) return '';
        const st = this.allStates.find(s => s.id === id);
        return st ? st.name : id;
    }

    // Scroll directly to a state card in the feed
    scrollToState(stateId: string) {
        this.activeStateId.set(stateId);
        const targetCard = document.querySelector(`[data-state-id="${stateId}"]`) as HTMLElement;
        if (targetCard) {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Interactive 3D SVG Map Events
    onStateHover(state: IndiaStateLocation, event: MouseEvent) {
        this.hoveredState.set(state);
        this.updateTooltipPos(event);
    }

    onStateMouseMove(event: MouseEvent) {
        this.updateTooltipPos(event);
    }

    onStateLeave() {
        this.hoveredState.set(null);
    }

    private updateTooltipPos(event: MouseEvent) {
        const container = (event.currentTarget as HTMLElement).closest('.map-3d-stage') as HTMLElement;
        if (container) {
            const rect = container.getBoundingClientRect();
            this.tooltipPos.set({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            });
        }
    }

    onStateClick(state: IndiaStateLocation) {
        if (this.hasMemories(state.id)) {
            this.filterByState(state.id);
        } else {
            this.activeStateId.set(state.id);
        }
    }

    // Scroll listener for floating switcher bar & scroll-to-top button
    @HostListener('window:scroll')
    onWindowScroll() {
        if (typeof window !== 'undefined') {
            const scrolled = window.scrollY > 80;
            if (this.isScrolledDown() !== scrolled) {
                this.isScrolledDown.set(scrolled);
            }
        }
    }

    scrollToTop() {
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // Interactive 3D Perspective Tilt on Mouse Move
    onPedestalMouseMove(event: MouseEvent) {
        if (!this.is3dAngle()) return;
        const stage = event.currentTarget as HTMLElement;
        const rect = stage.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (event.clientX - centerX) / (rect.width / 2);
        const deltaY = (event.clientY - centerY) / (rect.height / 2);

        // Subtle realistic 3D tilt
        const rotX = 20 - deltaY * 9;
        const rotY = -4 + deltaX * 11;
        const rotZ = deltaX * 1.5;

        this.tiltTransform.set(`rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg)`);
    }

    onPedestalMouseLeave() {
        if (this.is3dAngle()) {
            this.tiltTransform.set('rotateX(20deg) rotateY(-4deg) rotateZ(1deg)');
        } else {
            this.tiltTransform.set('rotateX(0deg) rotateY(0deg) rotateZ(0deg)');
        }
    }

    toggle3dAngle() {
        const next = !this.is3dAngle();
        this.is3dAngle.set(next);
        if (next) {
            this.tiltTransform.set('rotateX(20deg) rotateY(-4deg) rotateZ(1deg)');
        } else {
            this.tiltTransform.set('rotateX(0deg) rotateY(0deg) rotateZ(0deg)');
        }
    }

    // Observer setup for scrollytelling feed
    private setupObserver() {
        if (typeof window === 'undefined') return;
        if (this.observer) {
            this.observer.disconnect();
        }

        const observerOptions = {
            root: null,
            rootMargin: '-30% 0px -40% 0px',
            threshold: 0.2
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stateId = (entry.target as HTMLElement).dataset['stateId'];
                    if (stateId) {
                        this.activeStateId.set(stateId);
                    }
                }
            });
        }, observerOptions);

        const cards = document.querySelectorAll('.travel-card');
        cards.forEach(card => this.observer?.observe(card));
    }

    // Fullscreen Image Lightbox
    openPreview(image: string, type: 'canvas' | 'states' = 'canvas', event?: MouseEvent) {
        if (event) {
            event.stopPropagation();
        }

        if (type === 'canvas' && this.dragDistance > 8) {
            return;
        }

        let list: string[] = [];
        if (type === 'states') {
            const filtered = this.filteredMemories();
            list = filtered.length > 0 ? filtered.map(m => m.image) : this.travelService.memories().map(m => m.image);
        } else {
            list = this.STAMP_IMAGES;
        }

        this.currentPreviewList.set(list);
        const idx = list.indexOf(image);
        this.currentIndex.set(idx >= 0 ? idx : 0);
        this.selectedImage.set(image);

        document.body.style.overflow = 'hidden';
    }

    closePreview() {
        this.selectedImage.set(null);
        if (this.viewMode() === 'states') {
            document.body.style.overflow = 'auto';
        } else {
            document.body.style.overflow = 'hidden';
        }
    }

    prevImage(event?: MouseEvent) {
        if (event) event.stopPropagation();
        const list = this.currentPreviewList();
        if (list.length <= 1) return;
        const newIdx = (this.currentIndex() - 1 + list.length) % list.length;
        this.currentIndex.set(newIdx);
        this.selectedImage.set(list[newIdx]);
    }

    nextImage(event?: MouseEvent) {
        if (event) event.stopPropagation();
        const list = this.currentPreviewList();
        if (list.length <= 1) return;
        const newIdx = (this.currentIndex() + 1) % list.length;
        this.currentIndex.set(newIdx);
        this.selectedImage.set(list[newIdx]);
    }

    // Keyboard Shortcuts
    @HostListener('window:keydown', ['$event'])
    handleKeydown(event: KeyboardEvent) {
        if (this.selectedImage()) {
            if (event.key === 'Escape') {
                this.closePreview();
            } else if (event.key === 'ArrowLeft') {
                this.prevImage();
            } else if (event.key === 'ArrowRight') {
                this.nextImage();
            }
        }
    }

    // Canvas drag handling
    private isDragging = false;
    private startX = 0;
    private startY = 0;
    private initialPanX = 0;
    private initialPanY = 0;
    private dragDistance = 0;

    onMouseDown(event: MouseEvent) {
        if (this.viewMode() !== 'canvas' || this.selectedImage()) return;

        this.isDragging = true;
        this.startX = event.clientX;
        this.startY = event.clientY;
        this.initialPanX = this.targetPanX;
        this.initialPanY = this.targetPanY;
        this.dragDistance = 0;

        document.body.style.cursor = 'grabbing';
    }

    @HostListener('window:mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        if (!this.isDragging) return;

        const dx = event.clientX - this.startX;
        const dy = event.clientY - this.startY;
        this.dragDistance = Math.sqrt(dx * dx + dy * dy);

        this.targetPanX = this.initialPanX + dx;
        this.targetPanY = this.initialPanY + dy;
    }

    @HostListener('window:mouseup')
    onMouseUp() {
        if (!this.isDragging) return;
        this.isDragging = false;
        document.body.style.cursor = 'default';
    }

    private animate = () => {
        const currentX = this.panX();
        const currentY = this.panY();

        const newX = currentX + (this.targetPanX - currentX) * 0.1;
        const newY = currentY + (this.targetPanY - currentY) * 0.1;

        this.panX.set(newX);
        this.panY.set(newY);

        this.animationFrameId = requestAnimationFrame(this.animate);
    };

    getTransform(stamp: Stamp): string {
        const rotX = stamp.rotation;
        return `translate3d(${stamp.left}px, ${stamp.top}px, 0) rotate(${rotX}deg)`;
    }
}

