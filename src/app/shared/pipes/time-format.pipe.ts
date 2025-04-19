import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
  standalone: true
})
export class TimeFormatPipe implements PipeTransform {
  transform(seconds: number | string): string {
    if (!seconds && seconds !== 0) return '';
    
    // Convert to number if it's a string
    const totalSeconds = typeof seconds === 'string' ? parseInt(seconds, 10) : seconds;
    
    // Calculate hours, minutes and seconds
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;
    
    // Format minutes and seconds to always have two digits
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
    
    // Include hours only if there are any
    if (hours > 0) {
      return `${hours}:${formattedMinutes}:${formattedSeconds}`;
    }
    
    return `${formattedMinutes}:${formattedSeconds}`;
  }
} 