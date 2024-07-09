import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.component.html',
})
export class CheckOutComponent {
  isChecked = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  onBack(): void {
    this.router.navigate(['../cart'], { relativeTo: this.activatedRoute });
  }
}
