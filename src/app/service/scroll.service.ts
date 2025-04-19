import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private sliderOpacitySubject = new BehaviorSubject<number>(1);
  
  public sliderOpacity$: Observable<number> = this.sliderOpacitySubject.asObservable();
  
  constructor() {}
  
  updateSliderOpacity(opacity: number): void {
    this.sliderOpacitySubject.next(opacity);
  }
} 