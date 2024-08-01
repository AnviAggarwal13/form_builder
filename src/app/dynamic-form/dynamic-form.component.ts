import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule here
import jsPDF from 'jspdf';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule], // Import FormsModule
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css'],
})
export class DynamicFormComponent {
  inputSentence: string = '';
  formGroup: FormGroup; // Declare FormGroup
  fields: { name: string; type: string; options?: string[] }[] = []; // Array to hold fields with types

  // Define regex patterns for different field types
  private fieldPatterns: { [key: string]: { pattern: string; type: string; options?: string[] } } = {
    name: { pattern: '(name|full name|username)', type: 'text' },
    email: { pattern: '(email|e-mail)', type: 'email' },
    address: { pattern: '(address|home address|residential address)', type: 'text' },
    gender: { pattern: '(gender)', type: 'radio', options: ['Male', 'Female', 'Other'] },
    phone: { pattern: '(phone|phone no|phone number|contact number|mobile number)', type: 'tel' },
    country: { pattern: '(country)', type: 'dropdown', options: ['USA', 'Canada', 'UK'] }, // Example dropdown
  };

  // Inject FormBuilder through the constructor
  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({}); // Initialize formGroup
  }

  // Parse the sentence and create form controls
  generateForm() {
    this.fields = []; // Clear any existing fields
    this.formGroup = this.fb.group({}); // Reset form group

    // Check for matches in the input sentence
    for (const [key, config] of Object.entries(this.fieldPatterns)) {
      const regex = new RegExp(config.pattern, 'i');
      if (regex.test(this.inputSentence)) {
        this.fields.push({ name: key, type: config.type, options: config.options });
        this.formGroup.addControl(
          key,
          this.fb.control('', [Validators.required])
        );
      }
    }
  }

  // Remove a field from the form
  removeField(fieldName: string) {
    this.fields = this.fields.filter((field) => field.name !== fieldName);
    this.formGroup.removeControl(fieldName);
  }

  // Determine the input type based on the field
  getFieldType(field: { name: string; type: string; options?: string[] }): string {
    return field.type;
  }

  downloadFormData() {
    const formData = this.formGroup.value;
    console.log(formData);
    // Convert form data to text
    const textData = Object.entries(formData)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    // Create a Blob and download as a text file
    // const blob = new Blob([textData], { type: 'text/plain' });
    // const url = URL.createObjectURL(blob);
    // const link = document.createElement('a');
    // link.href = url;
    // link.download = 'form-data.txt';
    // link.click();
    // URL.revokeObjectURL(url);

    // Alternatively, generate and download as a PDF
    if(formData)
    this.downloadPDF(formData);
  else
  alert("enter details")
  }

  private downloadPDF(formData: any) {
    const doc = new jsPDF();
    let y = 10;

    doc.setFontSize(12);
    for (const [key, value] of Object.entries(formData)) {
      doc.text(`${key}: ${value}`, 10, y);
      y += 10;
    }

    doc.save('form-data.pdf');
  }
}
