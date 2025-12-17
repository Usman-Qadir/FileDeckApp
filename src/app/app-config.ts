import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export class BerryConfig {
  static isCollapse_menu = false;
  static font_family = 'Roboto'; // Roboto, poppins, inter
}

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient()]
};
