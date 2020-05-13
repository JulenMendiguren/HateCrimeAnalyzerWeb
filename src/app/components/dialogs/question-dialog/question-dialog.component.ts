import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Question } from 'src/app/models/question';

@Component({
  selector: 'app-question-dialog',
  templateUrl: './question-dialog.component.html',
  styleUrls: ['./question-dialog.component.scss'],
})
export class QuestionDialogComponent implements OnInit {
  question: Question = {
    text_eu: '',
    text_es: '',
    text_en: '',
    text_fr: '',
    type: 'textbox',
    tag: 'all',
    options: {
      required: false,
    },
  };

  constructor(
    public dialogRef: MatDialogRef<QuestionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

  logQuestion() {
    console.log(this.question);
  }
}
