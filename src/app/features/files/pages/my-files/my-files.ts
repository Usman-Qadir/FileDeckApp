import { Component, ViewChild } from '@angular/core';
import { UploadModal } from '../../components/upload-modal/upload-modal';

@Component({
  selector: 'app-my-files',
  standalone: true,
  imports: [UploadModal],
  templateUrl: './my-files.html'
})
export class MyFiles {

  @ViewChild('uploadModal')
  uploadModal!: UploadModal;

  openUpload(): void {
    this.uploadModal.open();
  }
}
