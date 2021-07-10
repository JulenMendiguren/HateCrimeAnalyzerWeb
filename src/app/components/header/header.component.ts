import { Component, OnInit, Sanitizer } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Lang } from 'src/app/models/Lang';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  selectedLangValue;
  langs: Lang[];

  constructor(
    private languageService: LanguageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.langs = this.languageService.getLanguages();
    this.selectedLangValue = this.languageService.selected;
  }

  onLangSelected() {
    this.languageService.setLanguage(this.selectedLangValue);
  }

  isLogged() {
    return this.authService.isLogged();
  }

  logoutUser() {
    this.authService.logoutUser();
  }

  getRole(): string {
    return this.authService.getRole();
  }

  getName(): string {
    return this.authService.getName();
  }
}
