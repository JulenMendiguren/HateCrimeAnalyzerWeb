import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { UsersService } from 'src/app/services/users.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: User[];
  editingUser: User;
  newUser: User = { name: '', email: '', role: '', password: '' };

  displayedColumns = ['name', 'email', 'role', 'actions'];

  constructor(
    private usersService: UsersService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  startEditingUser(user) {
    this.editingUser = user;
  }

  // Deletes user and reloads the list
  deleteUser(_id) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '30%',
      data: {
        title: this.translate.instant('COLECTIVES.confirm_title'),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Delete user: ' + _id);
        this.usersService.deteleUserById(_id).subscribe(
          (res) => {
            console.log(res);
            this.snackBar.open(
              this.translate.instant('USERS.snackbar.deleted')
            );
            this.loadUsers();
          },
          (err) => {
            console.log(err);
            this.snackBar.open(this.translate.instant('USERS.snackbar.error'));
            this.loadUsers();
          }
        );
      }
    });
  }

  // Stop editing current user
  cancelEditing() {
    this.editingUser = null;
    this.loadUsers();
  }

  // Updates a user and reloads the list
  updateUser() {
    console.log('updateUser: ', this.editingUser);
    this.usersService.updateUser(this.editingUser).subscribe(
      (res) => {
        console.log(res);
        this.editingUser = null;
        this.snackBar.open(this.translate.instant('USERS.snackbar.updated'));
        this.loadUsers();
      },
      (err) => {
        console.log(err);
        this.editingUser = null;
        this.snackBar.open(this.translate.instant('USERS.snackbar.error'));
        this.loadUsers();
      }
    );
  }

  // Loads users from DB
  loadUsers() {
    this.usersService.getAllUsers().subscribe(
      (res) => {
        this.users = res;
      },
      (err) => {
        this.snackBar.open(this.translate.instant('USERS.snackbar.error'));
        console.log(err);
      }
    );
  }

  // Creates a new user and reloads the list
  createUser() {
    this.usersService.createUser(this.newUser).subscribe(
      (res) => {
        console.log(res);
        this.newUser = { name: '', email: '', role: '', password: '' };
        this.snackBar.open(this.translate.instant('USERS.snackbar.created'));
        this.loadUsers();
      },
      (err) => {
        console.log(err);
        this.snackBar.open(this.translate.instant('USERS.snackbar.error'));
        this.loadUsers();
      }
    );
  }
}
