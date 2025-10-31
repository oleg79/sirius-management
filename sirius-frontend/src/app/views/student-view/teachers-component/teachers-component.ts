import { Component } from '@angular/core';
import {httpResource} from '@angular/common/http';

@Component({
  selector: 'app-teachers-component',
  imports: [],
  templateUrl: './teachers-component.html',
  styleUrl: './teachers-component.scss',
})
export class TeachersComponent {
  teachers = httpResource(() => 'teachers');
}
