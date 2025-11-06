# API Integration Guide

## Backend Integration Points

This frontend application includes placeholder functions ready for backend integration. Below are the main integration points:

### 1. Chatbot Message API
**Location:** `/components/ChatPanel.tsx`
**Function:** `handleSend()`

```typescript
// Replace mock response with actual API call
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: input,
    filters: filters,
    files: selectedFiles
  })
});
const data = await response.json();
```

### 2. File Upload API
**Location:** `/components/AddArchiveModal.tsx`
**Function:** `simulateUpload()`

```typescript
// Replace simulation with actual upload
const formData = new FormData();
formData.append('file', selectedFile);

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
});
const { fileUrl, thumbnailUrl } = await response.json();
```

### 3. Archive CRUD Operations

#### Get Archives
**Location:** `App.tsx`
```typescript
// Fetch archives from backend
const getArchives = async (filters?: object) => {
  const response = await fetch('/api/archives', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  const archives = await response.json();
  setArchives(archives);
};
```

#### Create Archive
**Location:** `/components/AddArchiveModal.tsx`
```typescript
const createArchive = async (archiveData: ArchiveItem) => {
  const response = await fetch('/api/archives', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(archiveData)
  });
  return await response.json();
};
```

#### Delete Archive
**Location:** `/components/ArchiveCard.tsx`
```typescript
const deleteArchive = async (id: string) => {
  await fetch(`/api/archives/${id}`, {
    method: 'DELETE'
  });
};
```

### 4. Search & Filter API
**Location:** `/components/ChatPanel.tsx`
**Function:** `searchArchives()`

```typescript
// Replace local filtering with backend search
const searchArchives = async (query: string, filters: object) => {
  const response = await fetch('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, filters })
  });
  return await response.json();
};
```

## Expected Backend Response Formats

### Archive Item
```json
{
  "id": "string",
  "title": "string",
  "type": "image" | "video" | "audio" | "document",
  "date": "YYYY-MM-DD",
  "tags": ["string"],
  "description": "string",
  "fileUrl": "string",
  "thumbnail": "string (optional)"
}
```

### Chat Response
```json
{
  "message": "string",
  "results": [ArchiveItem],
  "timestamp": "ISO 8601 date"
}
```

### File Upload Response
```json
{
  "fileUrl": "string",
  "thumbnailUrl": "string (optional)",
  "fileType": "string",
  "fileSize": number
}
```

## Environment Variables

Create a `.env` file with:
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_UPLOAD_MAX_SIZE=10485760
VITE_AI_MODEL=gpt-4
```

## Authentication

Add authentication headers to all API calls:
```typescript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};
```

## Error Handling

All API calls should include error handling:
```typescript
try {
  const response = await fetch('/api/endpoint');
  if (!response.ok) throw new Error('API Error');
  const data = await response.json();
} catch (error) {
  toast.error('Operation failed. Please try again.');
  console.error(error);
}
```
