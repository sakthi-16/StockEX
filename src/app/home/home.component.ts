import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { LoginService } from '../service/login.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LogoutConfirmationComponent } from '../logout-confirmation/logout-confirmation.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';




@Component({
  selector: 'app-home',
  standalone:true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {


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
