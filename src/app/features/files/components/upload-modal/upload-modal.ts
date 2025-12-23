import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';

interface UploadedFile {
  file: File;
  name: string;
  size: number;
}

@Component({
  selector: 'app-upload-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, FileUploadModule, ProgressBarModule],
  templateUrl: './upload-modal.html',
  styleUrls: ['./upload-modal.scss']
})
export class UploadModal {
  @ViewChild('fileUpload') fileUpload: any;

  visible = false;
  selectedFiles: UploadedFile[] = [];
  isUploading = false;
  uploadProgress = 0;

  open() {
    this.visible = true;
  }

  close() {
    this.visible = false;
    this.selectedFiles = [];
    this.uploadProgress = 0;
    this.isUploading = false;
    try {
      if (this.fileUpload && this.fileUpload.clear) this.fileUpload.clear();
    } catch {}
  }

  onSelect(event: any) {
    const files: File[] = event.files || [];
    files.forEach((f) => {
      if (!this.selectedFiles.some((sf) => sf.name === f.name && sf.size === f.size)) {
        this.selectedFiles.push({ file: f, name: f.name, size: f.size });
      }
    });
    try {
      if (this.fileUpload && this.fileUpload.clear) this.fileUpload.clear();
    } catch {}
  }

  removeFile(fileName: string) {
    this.selectedFiles = this.selectedFiles.filter((f) => f.name !== fileName);
  }

  async upload() {
    if (this.selectedFiles.length === 0) return;
    this.isUploading = true;
    this.uploadProgress = 0;

    const formData = new FormData();
    this.selectedFiles.forEach((f) => formData.append('files', f.file));

    const progressInterval = setInterval(() => {
      if (this.uploadProgress < 90) {
        this.uploadProgress += Math.random() * 20;
        if (this.uploadProgress > 90) this.uploadProgress = 90;
      }
    }, 200);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      clearInterval(progressInterval);
      if (res.ok) {
        this.uploadProgress = 100;
        setTimeout(() => this.close(), 400);
      } else {
        console.error('Upload failed', res.statusText);
        this.isUploading = false;
        this.uploadProgress = 0;
      }
    } catch (e) {
      console.error(e);
      clearInterval(progressInterval);
      this.isUploading = false;
      this.uploadProgress = 0;
    }
  }

  trackByName(_: number, item: UploadedFile) {
    return item.name + '|' + item.size;
  }
}
