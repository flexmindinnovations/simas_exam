import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { FadeAnimation } from '../../utils/animations';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
  animations: [FadeAnimation]
})
export class LoadingComponent {
  @Input({ required: true }) showLoader = false;
}
