import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';

interface Lang {
  text: string;
  value: string;
  img: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  selectedLangValue;
  langs: Lang[];

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.langs = this.languageService.getLanguages();
    this.selectedLangValue = this.languageService.selected;
  }
  onLangSelected() {
    this.languageService.setLanguage(this.selectedLangValue);
  }
}
