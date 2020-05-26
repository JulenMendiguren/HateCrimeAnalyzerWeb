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
  }

  logQuestion() {
    console.log('full question', this.qForm.value);
    console.log('possibleAnswers', this.qForm.controls.possibleAnswers.value);
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
    this.setTypePossibleAnswers(type);
  }

  // A bit messy... Sets the default possibleAnswers for certain types
  setTypePossibleAnswers(type: string) {
    this.clearPossibleAnswers();
    if (type === 'yesno') {
      this.addPossibleAnswers();
      this.addPossibleAnswers();
      const pa = this.qForm.controls.possibleAnswers['controls'];

      pa[0]['controls']['possibleAnswers_eu'].setValue('Bai');
      pa[0]['controls']['possibleAnswers_es'].setValue('Sí');
      pa[0]['controls']['possibleAnswers_en'].setValue('Yes');
      pa[0]['controls']['possibleAnswers_fr'].setValue('Oui');

      pa[1]['controls']['possibleAnswers_eu'].setValue('Ez');
      pa[1]['controls']['possibleAnswers_es'].setValue('No');
      pa[1]['controls']['possibleAnswers_en'].setValue('No');
      pa[1]['controls']['possibleAnswers_fr'].setValue('Ne pas');
    } else if (type === 'likert') {
      this.addPossibleAnswers();
      this.addPossibleAnswers();
      this.addPossibleAnswers();
      this.addPossibleAnswers();
      this.addPossibleAnswers();

      const pa = this.qForm.controls.possibleAnswers['controls'];

      pa[0]['controls']['possibleAnswers_eu'].setValue('Muy de acuerdo EU');
      pa[0]['controls']['possibleAnswers_es'].setValue('Muy de acuerdo');
      pa[0]['controls']['possibleAnswers_en'].setValue('Strongly agree');
      pa[0]['controls']['possibleAnswers_fr'].setValue('Muy de acuerdo FR');

      pa[1]['controls']['possibleAnswers_eu'].setValue('De acuerdo EU');
      pa[1]['controls']['possibleAnswers_es'].setValue('De acuerdo');
      pa[1]['controls']['possibleAnswers_en'].setValue('Agree');
      pa[1]['controls']['possibleAnswers_fr'].setValue('De acuerdo FR');

      pa[2]['controls']['possibleAnswers_eu'].setValue('Neutral EU');
      pa[2]['controls']['possibleAnswers_es'].setValue('Neutral');
      pa[2]['controls']['possibleAnswers_en'].setValue('Neutral');
      pa[2]['controls']['possibleAnswers_fr'].setValue('Neutral FR');

      pa[3]['controls']['possibleAnswers_eu'].setValue('En desacuerdo EU');
      pa[3]['controls']['possibleAnswers_es'].setValue('En desacuerdo');
      pa[3]['controls']['possibleAnswers_en'].setValue('Disagree');
      pa[3]['controls']['possibleAnswers_fr'].setValue('En desacuerdo FR');

      pa[4]['controls']['possibleAnswers_eu'].setValue('Muy en desacuerdo EU');
      pa[4]['controls']['possibleAnswers_es'].setValue('Muy en desacuerdo');
      pa[4]['controls']['possibleAnswers_en'].setValue('Strongly disagree');
      pa[4]['controls']['possibleAnswers_fr'].setValue('Muy en desacuerdo FR');
    } else if (type === 'multiselect') {
      this.addPossibleAnswers();
    } else if (type === 'radio') {
      this.addPossibleAnswers();
    }
    this.cd.detectChanges();
  }

  addPossibleAnswers() {
    this.getPossibleAnswersControls().push(this.createNewPossibleAnswers());
    this.cd.detectChanges();
  }

  clearPossibleAnswers() {
    this.qForm.setControl('possibleAnswers', this.formBuilder.array([]));
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

  // Deletes a row of possibleAnswers
  deletePossibleAnswers(i) {
    this.getPossibleAnswersControls().splice(i, 1);
  }

  // True if possibleAnswers section will be shown
  showPossibleAnswers() {
    const type = this.qForm.value.type;
    return (
      type === 'likert' ||
      type === 'yesno' ||
      type === 'multiselect' ||
      type === 'radio'
    );
  }

  onSubmit() {
    this.qForm.controls.possibleAnswers.updateValueAndValidity();
    const q: Question = this.createQuestion();
    console.log('Sending question... ', q);
    this.questionService.createQuestion(q).subscribe(
      (res) => {
        console.log('Created question ', res);
        this.dialogRef.close(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  createQuestion(): Question {
    const q: Question = this.qForm.value;
    console.log('qForm Value: ', this.qForm.value);
    q.tag = this.data.tag;

    let possibleAnswers_eu = [];
    let possibleAnswers_es = [];
    let possibleAnswers_en = [];
    let possibleAnswers_fr = [];

    const type = q.type;

    if (
      type === 'likert' ||
      type === 'yesno' ||
      type === 'multiselect' ||
      type === 'radio'
    ) {
      this.qForm.value.possibleAnswers.forEach((ansRow) => {
        possibleAnswers_eu.push(ansRow.possibleAnswers_eu);
        possibleAnswers_en.push(ansRow.possibleAnswers_en);
        possibleAnswers_es.push(ansRow.possibleAnswers_es);
        possibleAnswers_fr.push(ansRow.possibleAnswers_fr);
      });
    }

    q.possibleAnswers_eu = possibleAnswers_eu;
    q.possibleAnswers_es = possibleAnswers_es;
    q.possibleAnswers_en = possibleAnswers_en;
    q.possibleAnswers_fr = possibleAnswers_fr;
    return q;
  }

  checkIfInvalid(): boolean {
    this.qForm.controls.possibleAnswers.updateValueAndValidity();

    return this.qForm.invalid;
  }
}
