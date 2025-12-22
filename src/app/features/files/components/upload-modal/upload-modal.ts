import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-upload-modal',
  standalone: true,
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
  

  
   

}
