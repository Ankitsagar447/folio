import { Component, effect, signal, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Stamp {
    id: number;
    image: string;
    rotation: number;
    top: number; // Initial Grid Position Y
    left: number; // Initial Grid Position X
    speed: number;
    zIndex: number;
}

@Component({
    selector: 'app-bangla-blur',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './bangla-blur.html',
    styleUrls: ['./bangla-blur.css']
})
export class BanglaBlur implements OnDestroy {
    currentTime = signal(new Date());

    // Infinite Canvas State
    panX = signal(0);
    panY = signal(0);

    // Smooth Scroll Targets
    private targetPanX = 0;
    private targetPanY = 0;
    private animationFrameId: number | null = null;

    readonly GRID_WIDTH = 2000;
    readonly GRID_HEIGHT = 1500;

    readonly STAMP_IMAGES = [
        'https://framerusercontent.com/images/2LJkBFtZIoI5F4qcuQfOsUrTWkc.jpg?width=1000',
        'https://framerusercontent.com/images/NxsYJYfP8F45xJEur7Fh8564Ufw.jpg?width=1000',
        'https://framerusercontent.com/images/kaNtc5VMI2U9SzYecDO3bcPqsY.jpg?width=1000',
        'https://framerusercontent.com/images/LDD2FKTUCCQMbUbBbhwBC04rnuI.jpg?width=1000',
        'https://framerusercontent.com/images/ZB6AZU2rWR5MSGd3AJLPCn2x7g.jpg?width=1000'
    ];

    stamps: Stamp[] = this.generateStamps(50);

    private generateStamps(count: number): Stamp[] {
        const stamps: Stamp[] = [];
        for (let i = 0; i < count; i++) {
            stamps.push({
                id: i,
                image: this.STAMP_IMAGES[i % this.STAMP_IMAGES.length],
                rotation: Math.floor(Math.random() * 60 - 30), // -30 to 30 deg
                top: Math.floor(Math.random() * this.GRID_HEIGHT), // 0 to GRID_HEIGHT
                left: Math.floor(Math.random() * this.GRID_WIDTH), // 0 to GRID_WIDTH
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

    ngOnDestroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

    private animate() {
        this.smoothScroll();
        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    private smoothScroll() {
        const ease = 0.12;
        const currentX = this.panX();
        const currentY = this.panY();

        const nextX = currentX + (this.targetPanX - currentX) * ease;
        const nextY = currentY + (this.targetPanY - currentY) * ease;

        if (Math.abs(nextX - currentX) > 0.05 || Math.abs(nextY - currentY) > 0.05) {
            this.panX.set(nextX);
            this.panY.set(nextY);
        }
    }

    // Interaction Support
    private isDragging = false;
    private startX = 0;
    private startY = 0;

    // Capture targets for dragging references
    private initialTargetX = 0;
    private initialTargetY = 0;

    @HostListener('mousedown', ['$event'])
    onMouseDown(e: MouseEvent) {
        this.isDragging = true;
        this.startX = e.clientX;
        this.startY = e.clientY;

        // Sync drag start with current target to avoid jumps
        this.initialTargetX = this.targetPanX;
        this.initialTargetY = this.targetPanY;

        document.body.style.cursor = 'grabbing';
    }

    @HostListener('window:mouseup')
    onMouseUp() {
        this.isDragging = false;
        document.body.style.cursor = 'default';
    }

    @HostListener('window:mousemove', ['$event'])
    onMouseMove(e: MouseEvent) {
        if (!this.isDragging) return;

        const deltaX = e.clientX - this.startX;
        const deltaY = e.clientY - this.startY;

        this.targetPanX = this.initialTargetX + deltaX;
        this.targetPanY = this.initialTargetY + deltaY;
    }

    @HostListener('wheel', ['$event'])
    onWheel(e: WheelEvent) {
        e.preventDefault();
        const scrollSpeed = 0.8;
        this.targetPanY -= e.deltaY * scrollSpeed;
        this.targetPanX -= e.deltaX * scrollSpeed;
    }

    getTransform(stamp: Stamp): string {
        // Infinite Loop Logic using Modulo

        // 1. Calculate raw position including pan
        let rawX = stamp.left + this.panX();
        let rawY = stamp.top + this.panY();

        // 2. Wrap around the Grid Dimensions
        // Use modulo to constrain within [0, GRID_WIDTH]
        // Adding GRID_WIDTH before modulo handles negative values correctly in JS (mostly)
        // But specifically: ((n % m) + m) % m ensures positive result

        let wrappedX = ((rawX % this.GRID_WIDTH) + this.GRID_WIDTH) % this.GRID_WIDTH;
        let wrappedY = ((rawY % this.GRID_HEIGHT) + this.GRID_HEIGHT) % this.GRID_HEIGHT;

        // 3. Centering Adjustment (Optional but looks better)
        // To make it feel 'centered' initially or fill screen properly, we might need offsets.
        // For now, let's just map 0..GRID to the screen. 
        // Improvement: If we want negative space, we subtract half GRID.
        // Let's stick to positive space 0..GRID first.

        // 4. Boundary Buffer
        // If an item is near the edge (e.g. 1950px), it might get clipped.
        // To truly loop, we might need to render it ‘before’ 0 if it’s at the end.
        // Standard infinite grid usually centers the view. 

        // Simpler approach for "infinite scroll":
        // Just wrap. If it pops, we adjust the buffer.
        // Let's create a "view window" centering effect.

        // If wrapped position is > GRID_WIDTH - 250 (viewport edge), maybe move it to left?
        // Actually, just wrapping 0..2000 is fine if the 2000 space covers the viewport.
        // If viewport > 2000, we see gaps. Assuming viewport < 2000.

        return `translate(${wrappedX}px, ${wrappedY}px) rotate(${stamp.rotation}deg)`;
    }
}
