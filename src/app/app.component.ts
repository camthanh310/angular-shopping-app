import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { LoggingService } from './logging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'shopping-app';

  constructor(
    private router: Router,
    private authService: AuthService,
    private loggingService: LoggingService
  ) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe({
      error: (e) => {
        if ([401].includes(e)) {
          this.router.navigate(['/auth']);
        }
      },
    });

    this.loggingService.printLog('hello from app component ng OnInit')
  }
}
