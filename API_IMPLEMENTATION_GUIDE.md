## Backend API Implementation Guide

### Upload Endpoint

**Endpoint:** `POST /api/upload`

**Content-Type:** `multipart/form-data`

**Request Format:**

```
POST /api/upload
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="files"; filename="file1.pdf"
Content-Type: application/pdf

[binary file content]
------WebKitFormBoundary
Content-Disposition: form-data; name="files"; filename="file2.doc"
Content-Type: application/msword

[binary file content]
------WebKitFormBoundary--
```

**Expected Response (Success):**

```json
{
  "success": true,
  "message": "Files uploaded successfully",
  "files": [
    {
      "name": "file1.pdf",
      "size": 1024000,
      "path": "/uploads/file1.pdf",
      "uploadedAt": "2024-12-22T10:30:00Z"
    },
    {
      "name": "file2.doc",
      "size": 512000,
      "path": "/uploads/file2.doc",
      "uploadedAt": "2024-12-22T10:30:00Z"
    }
  ]
}
```

**Expected Response (Error):**

```json
{
  "success": false,
  "message": "Upload failed",
  "error": "File size exceeds limit"
}
```

---

### Example Implementations

#### Node.js / Express

```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000000, // 1GB
    files: 10
  }
});

app.post('/api/upload', upload.array('files'), (req, res) => {
  if (!req.files) {
    return res.status(400).json({
      success: false,
      message: 'No files provided'
    });
  }

  const uploadedFiles = req.files.map((file) => ({
    name: file.originalname,
    size: file.size,
    path: `/uploads/${file.filename}`,
    uploadedAt: new Date().toISOString()
  }));

  res.json({
    success: true,
    message: 'Files uploaded successfully',
    files: uploadedFiles
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

#### Python / Flask

```python
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
from datetime import datetime

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 1000000000  # 1GB

ALLOWED_EXTENSIONS = set()  # Allow all extensions

@app.route('/api/upload', methods=['POST'])
def upload_files():
    if 'files' not in request.files:
        return jsonify({
            'success': False,
            'message': 'No files provided'
        }), 400

    files = request.files.getlist('files')
    uploaded_files = []

    for file in files:
        if file and file.filename:
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)

            file_size = os.path.getsize(filepath)
            uploaded_files.append({
                'name': file.filename,
                'size': file_size,
                'path': f'/uploads/{filename}',
                'uploadedAt': datetime.utcnow().isoformat()
            })

    return jsonify({
        'success': True,
        'message': 'Files uploaded successfully',
        'files': uploaded_files
    })

if __name__ == '__main__':
    os.makedirs('uploads', exist_ok=True)
    app.run(debug=True, port=3000)
```

#### C# / ASP.NET Core

```csharp
[HttpPost("api/upload")]
[Consumes("multipart/form-data")]
public async Task<IActionResult> UploadFiles(List<IFormFile> files)
{
    if (files == null || files.Count == 0)
    {
        return BadRequest(new {
            success = false,
            message = "No files provided"
        });
    }

    var uploadedFiles = new List<object>();
    var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");

    Directory.CreateDirectory(uploadPath);

    foreach (var file in files)
    {
        if (file.Length > 0)
        {
            var filePath = Path.Combine(uploadPath, file.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            uploadedFiles.Add(new {
                name = file.FileName,
                size = file.Length,
                path = $"/uploads/{file.FileName}",
                uploadedAt = DateTime.UtcNow
            });
        }
    }

    return Ok(new {
        success = true,
        message = "Files uploaded successfully",
        files = uploadedFiles
    });
}
```

#### PHP

```php
<?php
header('Content-Type: application/json');

// Check if files were uploaded
if (empty($_FILES['files'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'No files provided'
    ]);
    exit;
}

$uploadDir = 'uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$uploadedFiles = [];
$files = $_FILES['files'];

for ($i = 0; $i < count($files['name']); $i++) {
    if ($files['error'][$i] === UPLOAD_ERR_OK) {
        $filename = basename($files['name'][$i]);
        $filepath = $uploadDir . uniqid() . '_' . $filename;

        if (move_uploaded_file($files['tmp_name'][$i], $filepath)) {
            $uploadedFiles[] = [
                'name' => $files['name'][$i],
                'size' => $files['size'][$i],
                'path' => '/' . $filepath,
                'uploadedAt' => date('c')
            ];
        }
    }
}

echo json_encode([
    'success' => true,
    'message' => 'Files uploaded successfully',
    'files' => $uploadedFiles
]);
?>
```

---

### Important Notes

1. **CORS Configuration** - If API is on different domain:

   ```javascript
   // Express
   const cors = require('cors');
   app.use(
     cors({
       origin: 'http://localhost:4200',
       credentials: true
     })
   );
   ```

2. **File Validation** - Add security checks:
   - File size limits
   - File type validation
   - Virus scanning
   - Filename sanitization

3. **Storage** - Consider:
   - Local disk storage
   - Cloud storage (AWS S3, Azure Blob)
   - Database storage for metadata
   - CDN for file delivery

4. **Error Handling** - Implement proper logging and error responses

5. **Authentication** - Add token validation if needed:
   ```javascript
   // Check authorization header
   const token = req.headers.authorization;
   ```

---

### Testing the Upload

#### Using cURL

```bash
curl -X POST http://localhost:3000/api/upload \
  -F "files=@file1.pdf" \
  -F "files=@file2.doc"
```

#### Using Postman

1. Set method to POST
2. URL: `http://localhost:3000/api/upload`
3. Body: form-data
4. Key: "files" (type: File)
5. Value: Select multiple files
6. Send

#### Using the Angular App

1. Start the server: `npm start`
2. Navigate to My Files page
3. Click "Upload Files"
4. Select or drag files
5. Click "Upload"
6. Check server logs for success

---

### Troubleshooting API Issues

**CORS Error:**

```
Access to XMLHttpRequest at 'http://api.example.com/api/upload'
from origin 'http://localhost:4200' has been blocked by CORS policy
```

→ Enable CORS on backend

**413 Payload Too Large:**
→ Increase server's max file size limit

**405 Method Not Allowed:**
→ Ensure endpoint accepts POST method

**Timeout Error:**
→ Increase timeout or optimize file processing

---

### Security Best Practices

1. ✅ Validate file types (not just extension)
2. ✅ Scan for malware
3. ✅ Limit file size
4. ✅ Sanitize filenames
5. ✅ Use HTTPS in production
6. ✅ Implement rate limiting
7. ✅ Add authentication/authorization
8. ✅ Log all uploads
9. ✅ Use separate storage directory
10. ✅ Implement file cleanup policies
