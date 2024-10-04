import {
  Component,
  forwardRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-checkbox',
  standalone: true,
  imports: [CommonModule],
  template: `
       <input type="checkbox" [checked]="checked" (change)="onCheckboxChange($event)" />
      <ng-content></ng-content>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomCheckboxComponent),
      multi: true,
    },
  ],
})
export class CustomCheckboxComponent implements ControlValueAccessor {
  @Input() checked = false;
  @Output() change = new EventEmitter<boolean>();

  onChange: (value: boolean) => void = () => { };
  onTouched: () => void = () => { };

  writeValue(value: boolean): void {
    this.checked = value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onCheckboxChange(event: Event): void {
    this.checked = (event.target as HTMLInputElement).checked;
    this.onChange(this.checked);
    this.change.emit(this.checked);
  }
}