import { Component, OnInit } from '@angular/core';
import { QuestionnaireService } from 'src/app/services/questionnaire.service';
import { Questionnaire } from 'src/app/models/Questionnaire';
import { Colective } from 'src/app/models/Colective';
import { ColectivesService } from 'src/app/services/colectives.service';
import { Question } from 'src/app/models/question';

@Component({
  selector: 'app-user-q',
  templateUrl: './user-q.component.html',
  styleUrls: ['./user-q.component.scss'],
})
export class UserQComponent implements OnInit {
  constructor(
    private questionnaireService: QuestionnaireService,
    private colectivesService: ColectivesService
  ) {}

  questionnaire: Questionnaire;
  colectives: Colective[];

  ngOnInit(): void {
    this.loadColectives();
    this.loadQuestionnaire();
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
}
