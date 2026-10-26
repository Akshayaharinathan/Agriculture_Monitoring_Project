import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SmartAgriproject');
}

// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatListModule } from '@angular/material/list';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.html',
//   styleUrls: ['./app.css'],
//   standalone: true,
//   imports: [
//     RouterOutlet,
//     MatToolbarModule, MatIconModule, MatButtonModule,
//     MatSidenavModule, MatListModule
//   ]
// })
// export class AppComponent { }
