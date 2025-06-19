import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { LoginService } from '../service/login.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LogoutConfirmationComponent } from '../logout-confirmation/logout-confirmation.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ShowStocksService } from '../service/show-stocks.service';
import { NotyfService } from '../service/notyf.service';
import { CommonModule } from '@angular/common';
import { FavouritesComponent } from '../favourites/favourites.component';




@Component({
  selector: 'app-home',
  standalone:true,
  imports: [RouterModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  favouriteCollections: string[] = [];
selectedCollectionStocks: any[] = [];
selectedCollectionName: string = '';




  constructor(private dialog: MatDialog,private loginService: LoginService, private router: Router, private stockService: ShowStocksService, private notyf: NotyfService  ) {}

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


loadFavourites() {
  this.stockService.getUserCollections().subscribe({
    next: (collections: string[]) => {
      console.log(collections,"collections received.")
      this.favouriteCollections = collections || [];
    },
    error: (err) => {
      console.error("Error loading favourites", err);
      this.notyf.error("Failed to load favourites");
    }
  });
}

loadCollection(collectionName: string) {
  this.selectedCollectionName = collectionName; // ✅ add this line
  this.stockService.getCollectionByName(collectionName).subscribe({
    next: (stocks: any[]) => {
      console.log("Stocks in selected collection:", stocks);
      this.selectedCollectionStocks = stocks;
    },
    error: (err) => {
      console.error("Error fetching collection", err);
      this.notyf.error("Failed to load collection");
    }
  });
}



  

}
