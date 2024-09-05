import { Component, computed, inject, OnInit } from '@angular/core';
import { ThemingService } from '../../services/theming.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [],
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.scss'
})
export class ThemeSwitcherComponent implements OnInit {
  themeSvc = inject(ThemingService);

  selectedTheme = computed(() => this.themeSvc.theme()?.name);
  themes = computed(() => this.themeSvc.themes().map(x => x.name));

  ngOnInit() {
    const theme = localStorage.getItem('theme');
    if (theme)
      this.themeSvc.setTheme(theme);
    else
      this.themeSvc.setTheme('Default');
  }

  changeTheme(name: string) {
    const theme = this.themeSvc.setTheme(name);
    localStorage.setItem('theme', theme.name);
  }
}
