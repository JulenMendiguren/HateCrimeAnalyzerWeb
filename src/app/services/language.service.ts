import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  selected = '';
  constructor(private translate: TranslateService) {}

  setInitialLanguage() {
    let language = this.translate.getBrowserLang();
    this.translate.setDefaultLang(language);
    this.selected = language;
  }

  // Sets the language
  setLanguage(lng) {
    this.translate.use(lng);
    this.selected = lng;
  }

  // Avaliable languages
  getLanguages() {
    return [
      {
        text: 'Euskara',
        value: 'eu',
        img: 'assets/imgs/flags/eu.png',
      },
      {
        text: 'Español',
        value: 'es',
        img: 'assets/imgs/flags/es.png',
      },
      {
        text: 'English',
        value: 'en',
        img: 'assets/imgs/flags/en.png',
      },
      {
        text: 'Français',
        value: 'fr',
        img: 'assets/imgs/flags/fr.png',
      },
    ];
  }
}
