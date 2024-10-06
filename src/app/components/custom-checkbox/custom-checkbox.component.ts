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
    <input type="checkbox" [checked]="checked" (change)="onInputChange($event)" class="w-4 h-4" />
`,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CustomCheckboxComponent),
    multi: true
  }]
})
export class CustomCheckboxComponent implements ControlValueAccessor {
  checked: boolean = false; // The model value (checked/unchecked state)

  // These methods will be provided by Angular forms
  private onChange: (_: any) => void = () => { };
  private onTouched: () => void = () => { };

  // This will be called when the checkbox value changes
  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.checked = input.checked;
    this.onChange(this.checked); // Notify the change to Angular
    this.onTouched(); // Mark as touched
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    this.checked = value || false; // Set the checkbox's internal state
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Handle the disabled state here if needed
  }
}