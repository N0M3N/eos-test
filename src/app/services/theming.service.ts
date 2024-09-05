import { signal } from "@angular/core";

export interface ITheme {
  name: string;

  primaryColor: string;
  primaryColorContrast: string;

  secondaryColor: string;
  secondaryColorContrast: string;

  tertiaryColor: string;
  tertiaryColorContrast: string;

  backgroundColor: string;
  textColor: string;
}

export class ThemingService {
  theme = signal<ITheme | null>(null);
  themes = signal<ITheme[]>([{
    name: 'Green',

    primaryColor: 'green',
    primaryColorContrast: 'white',

    secondaryColor: 'darkgreen',
    secondaryColorContrast: 'white',

    tertiaryColor: 'limegreen',
    tertiaryColorContrast: 'darkgreen',

    backgroundColor: '#333',
    textColor: '#fff'
  },
  {
    name: 'Pastelle',

    primaryColor: '#E6C79C',
    primaryColorContrast: 'black',

    secondaryColor: '#7b9ea8',
    secondaryColorContrast: 'white',

    tertiaryColor: '#6fd08c',
    tertiaryColorContrast: 'black',

    backgroundColor: '#78586F',
    textColor: '#fff'
  }]);

  setTheme(name: string): ITheme {
    const themes = this.themes();
    const theme = themes.find(x => x.name === name);
    if (theme) {
      this.theme.set(theme);
      return theme;
    } else {
      this.theme.set(themes[0]);
      return themes[0];
    }
  }
}