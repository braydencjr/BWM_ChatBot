import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import type { ArchiveItem } from '../App';
import { toast } from 'sonner';

type AddArchiveModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: ArchiveItem) => void;
};

export function AddArchiveModal({ isOpen, onClose, onAdd }: AddArchiveModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'image' as ArchiveItem['type'],
    date: new Date().toISOString().split('T')[0],
    tags: '',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const simulateUpload = (): Promise<string> => {
    return new Promise((resolve) => {
      setIsUploading(true);
      setUploadProgress(0);
      
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            // Simulate uploaded file URL
            resolve(selectedFile ? URL.createObjectURL(selectedFile) : 'https://via.placeholder.com/400');
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    let fileUrl = 'https://via.placeholder.com/400';
    let thumbnail = undefined;

    if (selectedFile) {
      fileUrl = await simulateUpload();
      if (formData.type === 'image') {
        thumbnail = fileUrl;
      }
    }

    const newItem: ArchiveItem = {
      id: Date.now().toString(),
      title: formData.title,
      type: formData.type,
      date: formData.date,
      tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      description: formData.description,
      fileUrl,
      thumbnail,
    };

    onAdd(newItem);
    toast.success('Archive item added successfully');
    
    // Reset form
    setFormData({
      title: '',
      type: 'image',
      date: new Date().toISOString().split('T')[0],
      tags: '',
      description: '',
    });
    setSelectedFile(null);
    setUploadProgress(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Archive Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload */}
          <div>
            <Label>Upload File</Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 border-2 border-dashed border-stone-300 rounded-lg p-8 text-center cursor-pointer hover:border-forest hover:bg-stone-50 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
              />
              
              {selectedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="text-left">
                    <p className="text-sm text-stone-700">{selectedFile.name}</p>
                    <p className="text-xs text-stone-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <p className="text-sm text-stone-600">Click to upload file</p>
                  <p className="text-xs text-stone-500 mt-1">Images, Videos, Audio, Documents</p>
                </div>
              )}
            </div>
            
            {isUploading && (
              <Progress value={uploadProgress} className="mt-2" />
            )}
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Traditional Batik Pattern"
              required
            />
          </div>

          {/* Type and Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Media Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: ArchiveItem['type']) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="batik, heritage, traditional (comma separated)"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the archive item..."
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading} className="bg-forest hover:bg-forest">
              {isUploading ? 'Uploading...' : 'Add to Archive'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
