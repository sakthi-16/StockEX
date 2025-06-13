import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LogoutConfirmationComponent } from '../logout-confirmation/logout-confirmation.component';
import { LoginService } from '../service/login.service';


@Component({
  selector: 'app-admin-nav-bar',
  standalone:true,
  imports: [RouterModule],
  templateUrl: './admin-nav-bar.component.html',
  styleUrl: './admin-nav-bar.component.css'
})
export class AdminNavBarComponent {

    constructor(private dialog: MatDialog,private loginService: LoginService, private router: Router) {}


  logout() {
     const dialogRef = this.dialog.open(LogoutConfirmationComponent, {
      width: '350px'
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
       
         this.loginService.logout();
      }
    });

}
}
