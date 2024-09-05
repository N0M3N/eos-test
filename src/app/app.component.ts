import { Component, HostBinding, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemingService } from './services/theming.service';
import { ThemeSwitcherComponent } from './components/theme-switcher/theme-switcher.component';
import { NotificationsComponent } from "./components/notifications/notifications.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ThemeSwitcherComponent, NotificationsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = ' Správce týmů ve sportovním klubu';

  themeSvc = inject(ThemingService);

  theme = this.themeSvc.theme;

  @HostBinding('style')
  get setStyle() {
    const theme = this.theme();
    return {
      '--primaryColor': theme?.primaryColor,
      '--primaryColorContrast': theme?.primaryColorContrast,
      '--secondaryColor': theme?.secondaryColor,
      '--secondaryColorContrast': theme?.secondaryColorContrast,
      '--tertiaryColor': theme?.tertiaryColor,
      '--tertiaryColorContrast': theme?.tertiaryColorContrast,
      '--backgroundColor': theme?.backgroundColor,
      '--textColor': theme?.textColor,
    }
  }
}
