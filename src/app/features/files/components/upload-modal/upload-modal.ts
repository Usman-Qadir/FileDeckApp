import { Component, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, DialogModule, ProgressBarModule],
  templateUrl: './upload-modal.html',
  styleUrls: ['./upload-modal.scss']
})
export class UploadModal {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Output() uploaded = new EventEmitter<void>();

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
      if (this.fileInput && this.fileInput.nativeElement) this.fileInput.nativeElement.value = '';
    } catch {}
  }

  onSelect(event: any) {
    // support PrimeNG event shape or FileList
    const files: File[] = event?.files || (event?.target?.files ? Array.from(event.target.files) : []);
    this.addFiles(files);
    try {
      if (this.fileInput && this.fileInput.nativeElement) this.fileInput.nativeElement.value = '';
    } catch {}
  }

  onFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input?.files) return;
    this.addFiles(Array.from(input.files));
    input.value = '';
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dt = event.dataTransfer;
    if (!dt) return;
    this.addFiles(Array.from(dt.files || []));
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  private addFiles(files: File[]) {
    files.forEach((f) => {
      if (!this.selectedFiles.some((sf) => sf.name === f.name && sf.size === f.size)) {
        this.selectedFiles.push({ file: f, name: f.name, size: f.size });
      }
    });
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
        try {
          this.uploaded.emit();
        } catch {}
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
