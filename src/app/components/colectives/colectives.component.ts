import { Component, OnInit } from '@angular/core';
import { ColectivesService } from 'src/app/services/colectives.service';
import { Colective } from 'src/app/models/Colective';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-colectives',
  templateUrl: './colectives.component.html',
  styleUrls: ['./colectives.component.scss'],
})
export class ColectivesComponent implements OnInit {
  colectives: Colective[];
  editingColective: Colective;
  newColective: Colective = {
    text_eu: '',
    text_es: '',
    text_en: '',
    text_fr: '',
  };
  displayedColumns = ['eu', 'es', 'en', 'fr', 'actions'];
  constructor(
    private colectivesService: ColectivesService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadColectives();
  }

  startEditingColective(col) {
    this.editingColective = col;
  }

  // Deletes colective and reloads the list
  deleteColective(_id) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '30%',
      data: {
        title: this.translate.instant('COLECTIVES.confirm_title'),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Delete colective: ' + _id);
        this.colectivesService.deteleColectiveById(_id).subscribe(
          (res) => {
            console.log(res);
            this.snackBar.open(
              this.translate.instant('COLECTIVES.snackbar.deleted')
            );
            this.loadColectives();
          },
          (err) => {
            console.log(err);
            this.snackBar.open(
              this.translate.instant('COLECTIVES.snackbar.error')
            );
            this.loadColectives();
          }
        );
      }
    });
  }

  // Stop editing current colective
  cancelEditing() {
    this.editingColective = null;
    this.loadColectives();
  }

  loadColectives() {
    this.colectivesService.getAllColectives().subscribe(
      (res) => {
        this.colectives = res;
        console.log(this.colectives);
      },
      (err) => {
        this.snackBar.open(this.translate.instant('COLECTIVES.snackbar.error'));
        console.log(err);
      }
    );
  }

  // Updates a colective and reloads the list
  updateColective() {
    console.log('updateColective: ', this.editingColective);
    this.colectivesService.updateColective(this.editingColective).subscribe(
      (res) => {
        console.log(res);
        this.editingColective = null;
        this.snackBar.open(
          this.translate.instant('COLECTIVES.snackbar.updated')
        );
        this.loadColectives();
      },
      (err) => {
        console.log(err);
        this.editingColective = null;
        this.snackBar.open(this.translate.instant('COLECTIVES.snackbar.error'));
        this.loadColectives();
      }
    );
  }

  // Creates a new colective and reloads the list
  createColective() {
    this.colectivesService.createColective(this.newColective).subscribe(
      (res) => {
        console.log(res);
        this.newColective = {
          text_eu: '',
          text_es: '',
          text_en: '',
          text_fr: '',
        };
        this.snackBar.open(
          this.translate.instant('COLECTIVES.snackbar.created')
        );
        this.loadColectives();
      },
      (err) => {
        console.log(err);
        this.snackBar.open(this.translate.instant('COLECTIVES.snackbar.error'));
        this.loadColectives();
      }
    );
  }
}
