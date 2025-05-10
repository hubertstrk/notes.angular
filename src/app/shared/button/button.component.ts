import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'transparent' =
    'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() rounded = false;

  @Input() iconSvg?: string;
  @Input() iconPosition: 'left' | 'right' = 'left';

  @Output() clicked = new EventEmitter<Event>();

  get computedClasses(): string {
    const base = `
      ${this.rounded ? 'rounded-full' : 'rounded'}
      px-4 py-2 font-medium focus:outline-none transition
    `;
    const sizes = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    const variants = {
      primary: 'bg-blue-500 text-white hover:bg-blue-600',
      secondary: 'bg-green-500 text-white hover:bg-green-600',
      danger: 'bg-red-500 text-white hover:bg-red-600',
      transparent: 'bg-transparent text-gray-700 hover:bg-gray-100',
    };

    return `${base} ${sizes[this.size]} ${variants[this.variant]} ${
      this.disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`;
  }

  onClick(event: Event) {
    if (!this.disabled) {
      this.clicked.emit(event);
    }
  }
}
