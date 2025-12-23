<<<<<<< HEAD
import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';

=======
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';

interface UploadedFile {
  name: string;
  size: number;
}
>>>>>>> 193895d (my files)

@Component({
  selector: 'app-upload-modal',
  standalone: true,
<<<<<<< HEAD
  imports: [DialogModule, FileUploadModule, ButtonModule],
  templateUrl: './upload-modal.html'
})
export class UploadModal  {
  visible = false;

  open(): void{
    this.visible = true;
  }
  close(): void{
    this.visible = false;
  }
  onSelect(event: any): void{
    console.log('Files selected:', event.files);
  }
  onClear(): void{
    console.log('File selection cleared');
  }
  

  
   

=======
  imports: [CommonModule, FormsModule, FileUploadModule, ProgressBarModule],
  templateUrl: './upload-modal.html',
  styleUrls: ['./upload-modal.scss']
})
export class UploadModal {
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild('fileUpload') fileUpload: any;

  selectedFiles: UploadedFile[] = [];
  isUploading = false;
  uploadProgress = 0;
  totalSize = 0;
  uploadedSize = 0;

  onSelect(event: any) {
    // Add selected files to our list
    const files = event.files || [];
    files.forEach((file: File) => {
      // Check if file already exists
      if (!this.selectedFiles.some((f) => f.name === file.name && f.size === file.size)) {
        this.selectedFiles.push({
          name: file.name,
          size: file.size
        });
      }
    });
    // Clear the hidden PrimeNG file upload input so same files can be selected again
    try {
      if (this.fileUpload && this.fileUpload.clear) {
        this.fileUpload.clear();
      }
    } catch (e) {
      // ignore if fileUpload reference isn't ready
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!event.dataTransfer || !event.dataTransfer.files) return;

    Array.from(event.dataTransfer.files).forEach((file) => {
      if (!this.selectedFiles.some((f) => f.name === file.name && f.size === file.size)) {
        this.selectedFiles.push({ name: file.name, size: file.size });
      }
    });

    // Clear the hidden PrimeNG file upload input so same files can be selected again
    try {
      if (this.fileUpload && this.fileUpload.clear) {
        this.fileUpload.clear();
      }
    } catch (e) {
      // ignore if fileUpload reference isn't ready
    }
  }

  trackByName(index: number, item: { name: string; size: number }) {
    return item.name + '|' + item.size;
  }

  removeFile(fileName: string) {
    this.selectedFiles = this.selectedFiles.filter((f) => f.name !== fileName);
  }

  async upload() {
    if (this.selectedFiles.length === 0) {
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;
    this.uploadedSize = 0;
    this.totalSize = this.selectedFiles.reduce((sum, f) => sum + f.size, 0);

    try {
      const formData = new FormData();

      // Get actual file objects from the file input
      const fileInputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      let totalFiles = 0;

      fileInputs.forEach((input) => {
        if (input.files) {
          Array.from(input.files).forEach((file) => {
            // Only add files that are in our selectedFiles list
            if (this.selectedFiles.some((sf) => sf.name === file.name && sf.size === file.size)) {
              formData.append('files', file);
              totalFiles++;
            }
          });
        }
      });

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        if (this.uploadProgress < 90) {
          this.uploadProgress += Math.random() * 30;
          if (this.uploadProgress > 90) {
            this.uploadProgress = 90;
          }
        }
      }, 200);

      // Send to server
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);

      if (response.ok) {
        this.uploadProgress = 100;
        await new Promise((resolve) => setTimeout(resolve, 500));
        this.close();
      } else {
        console.error('Upload failed:', response.statusText);
        this.isUploading = false;
        this.uploadProgress = 0;
      }
    } catch (error) {
      console.error('Upload error:', error);
      this.isUploading = false;
      this.uploadProgress = 0;
    }
  }

  close() {
    this.selectedFiles = [];
    this.uploadProgress = 0;
    this.isUploading = false;
    this.closeModal.emit();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
>>>>>>> 193895d (my files)
}
