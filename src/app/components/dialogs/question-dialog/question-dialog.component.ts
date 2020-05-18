import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Question } from 'src/app/models/question';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { QuestionService } from 'src/app/services/question.service';

@Component({
  selector: 'app-question-dialog',
  templateUrl: './question-dialog.component.html',
  styleUrls: ['./question-dialog.component.scss'],
})
export class QuestionDialogComponent implements OnInit {
  qForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<QuestionDialogComponent>,
    private cd: ChangeDetectorRef,
    private questionService: QuestionService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.initializeFormGroup();
    this.qForm.valueChanges.subscribe((val) => console.log(val));
  }

  logQuestion() {
    console.log('full question', this.qForm.value);
    console.log('possibleAnswers', this.qForm.controls.possibleAnswers.value);
    console.log(
      'possibleAnswers[2]',
      this.qForm.controls.possibleAnswers['controls'][2].value
    );
  }

  initializeFormGroup() {
    this.qForm = this.formBuilder.group({
      text_eu: new FormControl('', Validators.required),
      text_es: new FormControl('', Validators.required),
      text_en: new FormControl('', Validators.required),
      text_fr: new FormControl('', Validators.required),
      type: new FormControl('textbox', Validators.required),
    });
    this.initializeOptionsGroup();
  }

  // Clears and sets options and possible answers
  initializeOptionsGroup() {
    this.clearPossibleAnswers();
    const type = this.qForm.get('type').value;
    let options = {
      required: new FormControl({
        value: false,
        disabled: this.data.mode === 'subquestion',
      }),
    };
    switch (type) {
      case 'textbox':
        options['size'] = 'small';
        options['minLength'] = '';
        options['maxLength'] = '';
        break;
      case 'number':
        options['minValue'] = '';
        options['maxValue'] = '';
        options['slider'] = false;
    }
    this.qForm.setControl('options', this.formBuilder.group(options));
  }

  addPossibleAnswers() {
    this.getPossibleAnswersControls().push(this.createNewPossibleAnswers());
    this.cd.detectChanges();
  }

  clearPossibleAnswers() {
    this.qForm.setControl(
      'possibleAnswers',
      this.formBuilder.array([this.createNewPossibleAnswers()])
    );
  }

  createNewPossibleAnswers() {
    return this.formBuilder.group({
      possibleAnswers_eu: new FormControl(
        {
          value: '',
          disabled:
            this.qForm.get('type').value !== 'radio' &&
            this.qForm.get('type').value !== 'multiselect',
        },
        Validators.required
      ),
      possibleAnswers_es: new FormControl(
        {
          value: '',
          disabled:
            this.qForm.get('type').value !== 'radio' &&
            this.qForm.get('type').value !== 'multiselect',
        },
        Validators.required
      ),
      possibleAnswers_en: new FormControl(
        {
          value: '',
          disabled:
            this.qForm.get('type').value !== 'radio' &&
            this.qForm.get('type').value !== 'multiselect',
        },
        Validators.required
      ),
      possibleAnswers_fr: new FormControl(
        {
          value: '',
          disabled:
            this.qForm.get('type').value !== 'radio' &&
            this.qForm.get('type').value !== 'multiselect',
        },
        Validators.required
      ),
    });
  }

  getPossibleAnswersControls() {
    const pa = this.qForm.get('possibleAnswers') as FormArray;
    return pa.controls;
  }

  deletePossibleAnswers(i) {
    this.getPossibleAnswersControls().splice(i, 1);
  }

  onSubmit() {
    const q: Question = this.createQuestion();
    console.log('Sending question... ', q);
    this.questionService.createQuestion(q).subscribe(
      (res) => {
        console.log('Created question ', res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  createQuestion(): Question {
    const q: Question = this.qForm.value;
    q.tag = this.data.tag;

    let possibleAnswers_eu = [];
    let possibleAnswers_es = [];
    let possibleAnswers_en = [];
    let possibleAnswers_fr = [];
    //Check if enabled?
    this.getPossibleAnswersControls().forEach((ctrl) => {
      possibleAnswers_eu.push(ctrl['controls']['possibleAnswers_eu'].value);
      possibleAnswers_en.push(ctrl['controls']['possibleAnswers_en'].value);
      possibleAnswers_es.push(ctrl['controls']['possibleAnswers_es'].value);
      possibleAnswers_fr.push(ctrl['controls']['possibleAnswers_fr'].value);
    });

    q.possibleAnswers_eu = possibleAnswers_eu;
    q.possibleAnswers_es = possibleAnswers_es;
    q.possibleAnswers_en = possibleAnswers_en;
    q.possibleAnswers_fr = possibleAnswers_fr;
    return q;
  }
}
