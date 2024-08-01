import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // Import both
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppComponent, DynamicFormComponent],
  imports: [BrowserModule, ReactiveFormsModule, FormsModule, RouterModule, CommonModule], // Include both modules
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
