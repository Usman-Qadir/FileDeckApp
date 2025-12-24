import { Component, ViewChild, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { UploadModal } from '../../components/upload-modal/upload-modal';
import { FileSizePipe } from '../../../../shared/pipes/file-size.pipe';

interface FileItem {
  name: string;
  size: number;
  uploadedAt?: string;
}

@Component({
  selector: 'app-my-files',
  standalone: true,
  imports: [UploadModal, FileSizePipe, DatePipe],
  templateUrl: './my-files.html',
  styleUrls: ['./my-files.scss']
})
export class MyFiles {
  @ViewChild('uploadModal') uploadModal!: UploadModal;

  // ───────────────────────────────
  // State (Signals)
  // ───────────────────────────────
  files = signal<FileItem[]>([]);
  search = signal('');
  loading = signal(false);

  // ───────────────────────────────
  // Derived state
  // ───────────────────────────────
  filteredFiles = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.files();
    return this.files().filter((f) => f.name.toLowerCase().includes(q));
  });

  constructor() {
    this.refreshFiles();
  }

  // ───────────────────────────────
  // UI Actions
  // ───────────────────────────────
  openUpload(): void {
    this.uploadModal.open();
  }

  async refreshFiles(): Promise<void> {
    this.loading.set(true);

    try {
      const res = await fetch('/api/files');
      if (!res.ok) {
        this.files.set([]);
        return;
      }

      const json = await res.json();
      const mapped: FileItem[] = (json.files || json || []).map((f: any) => ({
        name: f.name,
        size: f.size ?? 0,
        uploadedAt: f.uploadedAt ?? f.createdAt
      }));

      this.files.set(mapped);
    } catch (err) {
      console.error('Failed to load files', err);
      this.files.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  downloadFile(file: FileItem): void {
    window.open(`/api/files/download/${encodeURIComponent(file.name)}`, '_blank');
  }

  async deleteFile(file: FileItem): Promise<void> {
    if (!confirm(`Delete "${file.name}"?`)) return;

    try {
      const res = await fetch(`/api/files/${encodeURIComponent(file.name)}`, { method: 'DELETE' });
      if (res.ok) {
        this.refreshFiles();
      }
    } catch (err) {
      console.error(err);
    }
  }

  // ───────────────────────────────
  // Helpers
  // ───────────────────────────────
  fileIcon(name: string): string {
    const ext = name.split('.').pop()?.toLowerCase();

    switch (ext) {
      case 'pdf':
        return 'ti ti-file-text';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return 'ti ti-photo';
      case 'zip':
      case 'rar':
        return 'ti ti-archive';
      case 'doc':
      case 'docx':
        return 'ti ti-file-text';
      default:
        return 'ti ti-file';
    }
  }
}
