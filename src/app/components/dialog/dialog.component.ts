import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  open = input<boolean>(false);
  openChange = output<boolean>()

  close() {
    this.openChange.emit(false);
  }
}
