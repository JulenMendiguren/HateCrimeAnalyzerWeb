import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: User[];
  editingUser: User;
  newUser = { name: '', email: '', role: '', password: '' };

  displayedColumns = ['name', 'email', 'role', 'actions'];

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  startEditingUser(user) {
    console.log('Started editing ', user);
    this.editingUser = user;
  }

  deleteUser(_id) {
    console.log('Delete user: ' + _id);
    this.usersService.deteleUserById(_id).subscribe(
      (res) => {
        console.log(res);
        this.loadUsers();
      },
      (err) => {
        console.log(err);
        this.loadUsers();
      }
    );
  }
  cancelEditing() {
    this.editingUser = null;
    this.loadUsers();
  }

  updateUser() {
    console.log('updateUser: ', this.editingUser);
    this.usersService.updateUser(this.editingUser).subscribe(
      (res) => {
        console.log(res);
        this.editingUser = null;
        this.loadUsers();
      },
      (err) => {
        console.log(err);
        this.editingUser = null;
        this.loadUsers();
      }
    );
  }

  loadUsers() {
    this.usersService.getAllUsers().subscribe(
      (res) => {
        this.users = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  createUser() {
    this.usersService.createUser(this.newUser).subscribe(
      (res) => {
        console.log(res);
        this.newUser = { name: '', email: '', role: '', password: '' };
        this.loadUsers();
      },
      (err) => {
        console.log(err);
        this.loadUsers();
      }
    );
  }
}
