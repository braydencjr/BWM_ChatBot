import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import type { ArchiveItem } from '../App';

type ArchiveDetailModalProps = {
  isOpen: boolean;
  item: ArchiveItem | null;
  onClose: () => void;
  onSave?: (updated: ArchiveItem) => void;
};

export function ArchiveDetailModal({ isOpen, item, onClose, onSave }: ArchiveDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<ArchiveItem | null>(item);

  useEffect(() => {
    setDraft(item);
    setIsEditing(false);
  }, [item]);

  if (!item || !draft) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Archive Item' : 'Archive Item Details'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!isEditing && (
            <div className="space-y-2">
              <h3 className="text-stone-800">{item.title}</h3>
              <p className="text-sm text-stone-600">{item.description}</p>
              <div className="text-xs text-stone-500">{new Date(item.date).toLocaleDateString('en-MY')}</div>
              <div className="flex gap-1 flex-wrap">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </div>
          )}

          {isEditing && (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={new Date(draft.date).toISOString().slice(0,10)} onChange={(e) => setDraft({ ...draft, date: new Date(e.target.value).toISOString() })} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input id="tags" value={draft.tags.join(', ')} onChange={(e) => setDraft({ ...draft, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            {!isEditing && onSave && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>Edit</Button>
            )}
            <Button variant="outline" onClick={onClose}>Close</Button>
            {isEditing && onSave && (
              <Button onClick={() => { onSave(draft); setIsEditing(false); }}>Save</Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ArchiveDetailModal;

