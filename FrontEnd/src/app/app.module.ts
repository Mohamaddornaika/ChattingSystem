import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { JwtModule, JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt'; // Import JwtModule and JwtHelperService

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    JwtModule.forRoot({
      // Your JWT configuration options here
    }),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    JwtHelperService, // Add JwtHelperService to the providers
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
