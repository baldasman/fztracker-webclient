import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Mixin, Stores } from '@app/base';

interface Languages {
  language: string;
  name: string;
  active?: boolean;
}

@Component({
  selector: 'main-theme-header-topbar-language-selector',
  templateUrl: './language-selector.component.html'
})
export class LanguageSelectorComponent extends Mixin(Stores) implements OnInit {

  currentLanguage: Languages;
  languages: Languages[] = [
    { language: 'en', name: 'English' },
    { language: 'pt', name: 'Português' }
  ];

  constructor(
    private translateService: TranslateService
  ) { super(); }

  ngOnInit() {

    this.setLanguage(this.store.environment.language);

  }


  setLanguage(lang: string) {

    this.languages.forEach((language: Languages) => {
      if (language.language === lang) {
        language.active = true;
        this.currentLanguage = language;
      } else {
        language.active = false;
      }
    });

    this.store.environment.setLanguage(this.currentLanguage.language);
    this.translateService.use(this.currentLanguage.language);

  }

}
