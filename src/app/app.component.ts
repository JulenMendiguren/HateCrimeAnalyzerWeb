import { Component } from '@angular/core';
import { LanguageService } from './services/language.service';
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'HateCrimeWeb';
  constructor(private languageService: LanguageService) {
    this.initialize();
  }

  initialize() {
    this.languageService.setInitialLanguage();
  }
}
