<<<<<<< HEAD
import { Component, ViewChild } from '@angular/core';
=======
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
>>>>>>> 193895d (my files)
import { UploadModal } from '../../components/upload-modal/upload-modal';

@Component({
  selector: 'app-my-files',
  standalone: true,
<<<<<<< HEAD
  imports: [UploadModal],
  templateUrl: './my-files.html'
=======
  imports: [CommonModule, UploadModal],
  templateUrl: './my-files.html',
  styleUrl: './my-files.scss'
>>>>>>> 193895d (my files)
})
export class MyFiles {
  showUploadModal = false;

<<<<<<< HEAD
  @ViewChild('uploadModal')
  uploadModal!: UploadModal;

  openUpload(): void {
    this.uploadModal.open();
=======
  openUploadModal() {
    this.showUploadModal = true;
  }

  closeUploadModal() {
    this.showUploadModal = false;
>>>>>>> 193895d (my files)
  }
}
