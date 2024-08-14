import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import jsPDF from 'jspdf';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule], 
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css'],
})
export class DynamicFormComponent {
  inputSentence: string = '';
  formGroup: FormGroup; 
  fields: { name: string; type: string; options?: string[] }[] = []; 

  
  private fieldPatterns: { [key: string]: { label: string; type: string; options?: string[] } } = {
    name: { label: '(name|full name|username)', type: 'text' },
    email: { label: '(email|e-mail)', type: 'email' },
    address: { label: '(address|home address|residential address)', type: 'text' },
    gender: { label: '(gender)', type: 'radio', options: ['Male', 'Female', 'Other'] },
    phone: { label: '(phone|phone no|phone number|contact number|mobile number)', type: 'tel' },
    country: { label: '(country)', type: 'dropdown', options: ['USA', 'Canada', 'UK'] },
    dob: { label: 'dob', type: 'date' }
  };

  
  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({}); 
  }

  
  generateForm() {
    this.fields = []; 
    this.formGroup = this.fb.group({}); 

    
    for (const [key, config] of Object.entries(this.fieldPatterns)) {
      const regex = new RegExp(config.label, 'i');
      if (regex.test(this.inputSentence)) {
        this.fields.push({ name: key, type: config.type, options: config.options });
        this.formGroup.addControl(
          key,
          this.fb.control('')
        );
      }
    }
  }

  
  removeField(fieldName: string) {
    this.fields = this.fields.filter((field) => field.name !== fieldName);
    this.formGroup.removeControl(fieldName);
  }

  
  getFieldType(field: { name: string; type: string; options?: string[] }): string {
    return field.type;
  }

  downloadFormData() {
    const formData = this.formGroup.value;
    console.log(formData);

    const isFieldEmpty = Object.values(formData).every(value=>value==='');

    if(isFieldEmpty){
      alert('Please fill atleast one field before submitting.')
    }else{
    
    const textData = Object.entries(formData)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    this.downloadPDF(formData);
  }
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
