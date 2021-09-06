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
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';

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
    private dialog: MatDialog,
    private snackBar: MatSnackBar
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
      },
      (err) => {
        //this.snackBar.open(this.translate.instant('COLECTIVES.snackbar.error'));
        console.log(err);
      }
    );
  }

  addSubquestion(question, pos) {
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
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '30%',
      data: {
        title: this.translateService.instant('USERQ.confirm_title'),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.questionnaire.questions = this.questionnaire.questions.filter(
          (q) => q._id !== question._id
        );
        this.questionnaire.questions = this.questionnaire.questions.filter(
          (q) => q.options.subquestionOf !== question._id
        );
      }
    });
  }

  editQuestion(question) {
    const data = {
      editingQuestion: question,
      tag: question.tag,
    };
    if (question.options.subquestionOf) {
      data['mode'] = 'edit_subquestion';
      const parentQuestion = this.questionnaire.questions.find(
        (q) => q._id === question.options.subquestionOf
      );
      data['parentQuestion'] = parentQuestion;
    } else {
      data['mode'] = 'edit_question';
    }
    const dialogRef = this.dialog.open(QuestionDialogComponent, {
      width: '70%',
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.questionnaire.questions.indexOf(question);
        this.questionnaire.questions[index] = result;
      }
    });
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

    const dialogRef = this.dialog.open(QuestionDialogComponent, {
      width: '70%',
      data: { mode: 'new', tag: col },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.questionnaire.questions.splice(pos, 0, result);
      }
    });
  }

  createQuestionnaire() {
    const newQ: Questionnaire = {
      category: 'user',
      questions: this.questionnaire.questions,
    };
    this.questionnaireService.createNewQ(newQ).subscribe(
      (res) => {
        this.snackBar.open(
          this.translateService.instant('USERQ.snackbar.saved')
        );
      },
      (err) => {
        this.snackBar.open(
          this.translateService.instant('USERQ.snackbar.error')
        );
        console.log(err);
      }
    );
  }

  // Hardcoded, better solution?
  showQuestionButtons(question) {
    if (
      question._id === '5e9f0b944f646009fdb1734c' ||
      question._id === '5e9f0b944f646009fdb1734b'
    ) {
      return false;
    } else {
      return true;
    }
  }
}
