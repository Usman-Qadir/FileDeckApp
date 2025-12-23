# 🏗️ Architecture & Component Flow

## Component Structure

```
MyFiles (Parent Component)
│
├── Header Section
│   ├── Title: "My Files"
│   ├── Subtitle: "Manage your files"
│   └── Button: "Upload Files" → (click) openUploadModal()
│
├── Content Section
│   ├── Empty State (when no files)
│   │   ├── Icon
│   │   ├── Message
│   │   └── Upload Button
│   └── Files List/Grid (future implementation)
│
└── Upload Modal (Conditional: @if showUploadModal)
    │
    └── UploadModal Component
        │
        ├── Modal Overlay
        │   └── (click) closeUploadModal()
        │
        ├── Modal Header
        │   ├── Title: "Upload files"
        │   └── Close Button: (click) close()
        │
        ├── Modal Content
        │   │
        │   ├── PrimeNG FileUpload (Hidden)
        │   │   └── (onSelect) onSelect(event)
        │   │
        │   ├── Drop Zone
        │   │   ├── Icon
        │   │   ├── Text: "Drag & drop files here"
        │   │   └── Button: "Browse files" → click fileUpload.choose()
        │   │
        │   ├── Selected Files List (if selectedFiles.length > 0)
        │   │   └── @for file of selectedFiles
        │   │       ├── File Icon
        │   │       ├── File Name
        │   │       ├── File Size
        │   │       └── Remove Button: (click) removeFile(file.name)
        │   │
        │   └── Progress Bar (if isUploading)
        │       ├── Progress Label: "Uploading XX%"
        │       └── PrimeNG ProgressBar
        │
        └── Modal Actions
            ├── Upload Button: (click) upload() [disabled if no files]
            └── Cancel Button: (click) close() [disabled if uploading]
```

---

## User Interaction Flow

```
START
  │
  ├─→ User clicks "Upload Files" button
  │   └─→ showUploadModal = true
  │
  ├─→ Modal appears
  │   │
  │   ├─→ Option 1: Drag & drop files
  │   │   └─→ Files added to selectedFiles list
  │   │
  │   ├─→ Option 2: Click "Browse files"
  │   │   ├─→ File picker opens
  │   │   └─→ Select files → onSelect(event)
  │   │       └─→ Files added to selectedFiles list
  │   │
  │   ├─→ View selected files
  │   │   └─→ List shows name, size, and remove button
  │   │
  │   ├─→ Option A: Remove file
  │   │   └─→ Click remove button → removeFile()
  │   │       └─→ File removed from list
  │   │
  │   ├─→ Option B: Upload files
  │   │   ├─→ Click "Upload" button → upload()
  │   │   ├─→ isUploading = true
  │   │   ├─→ Progress bar appears
  │   │   ├─→ Files sent to /api/upload
  │   │   ├─→ Progress bar updates
  │   │   ├─→ On success → uploadProgress = 100
  │   │   ├─→ Modal closes → close()
  │   │   └─→ showUploadModal = false
  │   │
  │   └─→ Option C: Cancel
  │       ├─→ Click "Cancel" button → close()
  │       ├─→ selectedFiles = []
  │       ├─→ uploadProgress = 0
  │       └─→ showUploadModal = false
  │
  └─→ END
```

---

## Data Flow

```
┌─────────────────────────────────────┐
│        MyFiles Component            │
│  (showUploadModal: boolean)         │
└────────────┬────────────────────────┘
             │ pass: closeModal event
             │
             ▼
┌─────────────────────────────────────┐
│      UploadModal Component          │
│                                     │
│  Properties:                        │
│  ├─ selectedFiles: UploadedFile[]   │
│  ├─ isUploading: boolean            │
│  ├─ uploadProgress: number          │
│  └─ totalSize: number               │
│                                     │
│  Methods:                           │
│  ├─ onSelect(event)                 │
│  ├─ upload()                        │
│  ├─ removeFile(fileName)            │
│  └─ close()                         │
│                                     │
│  Output:                            │
│  └─ @Output closeModal              │
└────────┬─────────────────┬──────────┘
         │                 │
         │ Files           │ Progress
         │ Selected        │ Updates
         │                 │
    User Input         UI Rendering
```

---

## File Upload Process (Detailed)

```
1. User selects file(s)
   │
   ▼
2. Files added to selectedFiles[] list
   │ {name: "document.pdf", size: 1024000}
   │ {name: "image.jpg", size: 512000}
   │
   ▼
3. User clicks "Upload"
   │
   ├─→ isUploading = true
   ├─→ uploadProgress = 0
   ├─→ totalSize = sum of all file sizes
   │
   ▼
4. Create FormData object
   │ formData.append('files', fileObj1)
   │ formData.append('files', fileObj2)
   │
   ▼
5. Send to backend
   │ POST /api/upload
   │ Content-Type: multipart/form-data
   │
   ▼
6. Track Progress
   │ Every 200ms: uploadProgress += random(0-30)
   │ Max 90% before response
   │
   ▼
7. Backend Response
   │ ├─→ Success: {success: true, files: [...]}
   │ └─→ Error: {success: false, message: "..."}
   │
   ▼
8. On Success
   │ uploadProgress = 100
   │ Wait 500ms
   │ close() → emit closeModal
   │ Modal closes
   │
   ▼
9. Reset to initial state
   │ selectedFiles = []
   │ isUploading = false
   │ uploadProgress = 0
```

---

## Styling Architecture

```
SCSS Hierarchy:

upload-modal.scss
├── .overlay (backdrop)
├── .modal (main container)
│   ├── .modal-header
│   │   ├── h3 (title)
│   │   └── .close-btn
│   ├── .modal-content
│   │   ├── .drop-zone
│   │   ├── .files-list
│   │   ├── .progress-container
│   │   └── .actions
│   └── (animations)
│
├── .btn (base button)
│   ├── .btn-primary (color variant)
│   └── .btn-secondary (color variant)
│
├── Animations
│   ├── @keyframes fadeIn
│   └── @keyframes slideUp
│
└── @media (max-width: 640px)
    └── (responsive overrides)


my-files.scss
├── .my-files-container (main layout)
├── .files-header (title + button)
├── .files-content (content area)
├── .empty-state (empty screen)
├── .btn (button styles)
│
└── @media (max-width: 768px)
    └── (responsive overrides)
```

---

## Technology Stack

```
Frontend:
├── Angular 20.3.15
│   ├── @angular/core
│   ├── @angular/common
│   ├── @angular/forms
│   └── Standalone Components
├── PrimeNG 18.0.0
│   ├── FileUploadModule
│   └── ProgressBarModule
├── Bootstrap 5.3.7
├── SCSS/CSS
└── Tabler Icons

Backend (Your Choice):
├── Node.js/Express
├── Python/Flask
├── C#/ASP.NET Core
├── PHP
└── Any REST API

Browser APIs:
├── Fetch API
├── FormData API
├── File API
└── Drag & Drop API
```

---

## Module Dependencies

```
UploadModal Component
├── CommonModule (Angular)
├── FormsModule (Angular)
├── FileUploadModule (PrimeNG)
└── ProgressBarModule (PrimeNG)

MyFiles Component
├── CommonModule (Angular)
└── UploadModal (App Component)
```

---

## State Management

```
UploadModal Component State:

selectedFiles: UploadedFile[] = []
├── Updated by: onSelect()
├── Updated by: removeFile()
└── Reset by: close()

isUploading: boolean = false
├── Set to true: upload()
├── Set to false: close() or on success
└── Disables buttons when true

uploadProgress: number = 0
├── Set by: fetch request progress loop
├── Displayed: in template {{uploadProgress | number}}
└── Reset by: close()
```

---

## Event Flow

```
(Input Events)
  │
  ├─→ user clicks "Browse files"
  │   └─→ fileUpload.choose() [PrimeNG method]
  │       └─→ native file picker opens
  │
  ├─→ user selects files from picker
  │   └─→ (onSelect)="onSelect($event)" [PrimeNG event]
  │       └─→ onSelect(event) method
  │           └─→ Add to selectedFiles[]
  │
  ├─→ user drags files over drop-zone
  │   └─→ (dragover) prevents default
  │       └─→ Shows hover state
  │
  ├─→ user drops files on drop-zone
  │   └─→ fileUpload.uploadClick() [PrimeNG method]
  │       └─→ Same flow as file picker
  │
  ├─→ user clicks remove button
  │   └─→ (click)="removeFile(file.name)"
  │       └─→ Remove from selectedFiles[]
  │
  ├─→ user clicks "Upload"
  │   └─→ (click)="upload()"
  │       └─→ fetch() to /api/upload
  │           ├─→ trackProgress() updates uploadProgress
  │           └─→ close() on success
  │
  └─→ user clicks "Cancel"
      └─→ (click)="close()"
          └─→ Reset all state
```

---

## HTTP Request/Response Cycle

```
Angular App                       Backend Server
    │                                 │
    ├─→ POST /api/upload ────────────→│
    │   Headers:                      │
    │   Content-Type:               │
    │     multipart/form-data       │
    │                               │
    │   Body:                       │
    │   ├─ files[0]: File object   │
    │   ├─ files[1]: File object   │
    │   └─ files[N]: File object   │
    │                               │
    │   Processing...             │
    │                               │ Validate files
    │                               │ Save to storage
    │                               │ Return response
    │                               │
    │←──── {success: true} ─────────│
    │      {files: [...]}          │
    │                               │
    └─→ Update UI                  │
        ├─ Close modal             │
        ├─ Show success message    │
        └─ Refresh file list       │
```

---

## Responsive Breakpoints

```
Desktop (≥1024px)
├─ Modal: 600px width
├─ Full features visible
└─ Hover effects enabled

Tablet (768px - 1023px)
├─ Modal: Scaled down
├─ Content: Readable
└─ Touch-friendly buttons

Mobile (<768px)
├─ Modal: 90vw width, 85vh max height
├─ Layout: Column direction
├─ Buttons: Full width
└─ Scrollable content
```

---

This architecture provides:

- ✅ Clear separation of concerns
- ✅ Reusable components
- ✅ Easy to maintain
- ✅ Scalable structure
- ✅ Modern Angular practices
- ✅ No legacy code patterns
