import { Component, OnInit } from '@angular/core';
import { QuestionnaireService } from 'src/app/services/questionnaire.service';
import { Questionnaire } from 'src/app/models/Questionnaire';
import { Colective } from 'src/app/models/Colective';
import { ColectivesService } from 'src/app/services/colectives.service';
import { Question } from 'src/app/models/question';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { QuestionDialogComponent } from '../dialogs/question-dialog/question-dialog.component';

@Component({
  selector: 'app-user-q',
  templateUrl: './user-q.component.html',
  styleUrls: ['./user-q.component.scss'],
})
export class UserQComponent implements OnInit {
  constructor(
    private questionnaireService: QuestionnaireService,
    private colectivesService: ColectivesService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private dialog: MatDialog
  ) {}

  questionnaire: Questionnaire;
  colectives: Colective[];

  ngOnInit(): void {
    this.loadColectives();
    this.loadQuestionnaire();
  }

  getLang() {
    return this.languageService.selected;
  }

  getRequiredAnswerString(id, index) {
    const q = this.questionnaire.questions.find((q) => q._id === id);
    return q['possibleAnswers_' + this.getLang()][index];
  }

  getSizeString(size) {
    return this.translateService.instant('USERQ.options.size_' + size);
  }

  loadQuestionnaire() {
    this.questionnaireService.getLastUserQ().subscribe(
      (res) => {
        this.questionnaire = res;
        console.log(this.questionnaire);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  loadColectives() {
    this.colectivesService.getAllColectives().subscribe(
      (res) => {
        this.colectives = res;
        console.log(this.colectives);
      },
      (err) => {
        //this.snackBar.open(this.translate.instant('COLECTIVES.snackbar.error'));
        console.log(err);
      }
    );
  }

  addQuestion() {
    const dialogRef = this.dialog.open(QuestionDialogComponent, {
      width: '50%',
      data: { mode: 'new' },
    });
  }
}
