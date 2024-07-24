import { Component, effect, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PrimeNGConfig } from 'primeng/api';
import { utils } from './utils';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'simas-exam';

  constructor(
    private primeConfig: PrimeNGConfig,
    private titleService: Title
  ) {

    effect(() => {
      const pageTitle = utils.pageTitle();
      this.titleService.setTitle(pageTitle);
    })
  }

  ngOnInit(): void {
    this.primeConfig.ripple = true;

    window.addEventListener('load', (event: any) => {
      if (event) utils.isPageRefreshed.set(true);
    })

  }
}
