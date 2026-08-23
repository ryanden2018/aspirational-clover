import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

@Component({
  selector: 'app-root',
  standalone: false,
  styleUrls: ['./app.css'],
  templateUrl: './app.html',
})
export class App implements OnInit {
  // null = not loaded yet, [] = loaded but empty
  public forecasts: WeatherForecast[] | null = null;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.getForecasts();
  }

  getForecasts() {
    this.http.get<WeatherForecast[]>('/weatherforecast').subscribe(
      (result) => {
        console.log('weatherforecast result', result);
        this.forecasts = result;
        // Ensure the UI updates if change detection did not run for some reason
        try { this.cdr.detectChanges(); } catch {}
      },
      (error) => {
        console.error(error);
        // mark as loaded but empty to show a helpful message in the UI
        this.forecasts = [];
      }
    );
  }

  protected readonly title = signal('aspirational-clover.client');
}
