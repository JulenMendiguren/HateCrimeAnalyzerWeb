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
        this.colectives.splice(0, 0, {
          _id: 'all',
          text_eu: 'All EU',
          text_es: 'General',
          text_en: 'All',
          text_fr: 'All FR',
        });
        console.log(this.colectives);
      },
      (err) => {
        //this.snackBar.open(this.translate.instant('COLECTIVES.snackbar.error'));
        console.log(err);
      }
    );
  }

  addSubquestion(question, pos) {
    console.log(question, pos);
    pos = pos + 1;

    const dialogRef = this.dialog.open(QuestionDialogComponent, {
      width: '70%',
      data: {
        mode: 'subquestion',
        parentQuestion: question,
        tag: question.tag,
        pos,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.questionnaire.questions.splice(pos, 0, result);
      }
    });
  }

  // Deletes question and all of its subquestions
  deleteQuestion(question) {
    this.questionnaire.questions = this.questionnaire.questions.filter(
      (q) => q._id !== question._id
    );
    this.questionnaire.questions = this.questionnaire.questions.filter(
      (q) => q.options.subquestionOf !== question._id
    );
  }

  // Opens the dialog to create a new question for this colective
  addQuestion(col) {
    let numQuestionsPassed = 0;
    let pos;
    const allColArray = [];

    this.colectives.forEach((c) => {
      allColArray.push(c._id);
    });

    // Loops through all the colectives and questions to find the
    allColArray.forEach((colId) => {
      this.questionnaire.questions.forEach((q) => {
        if (q.tag === colId) {
          numQuestionsPassed++;
        }
        if (colId === col) {
          pos = numQuestionsPassed;
        }
      });
    });

    console.log('pos: ', pos);
    const dialogRef = this.dialog.open(QuestionDialogComponent, {
      width: '70%',
      data: { mode: 'new', tag: col, pos },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.questionnaire.questions.splice(pos, 0, result);
      }
    });
  }
}
