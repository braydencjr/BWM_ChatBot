import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ChatPanel } from './components/ChatPanel';
import { CuratorDashboard } from './components/CuratorDashboard';
import { SettingsPanel } from './components/SettingsPanel';
import { Toaster } from './components/ui/sonner';

export type ArchiveItem = {
  id: string;
  title: string;
  type: 'image' | 'video' | 'document' | 'audio';
  date: string;
  tags: string[];
  description: string;
  fileUrl: string;
  thumbnail?: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  files?: { name: string; url: string; type: string }[];
  archiveResults?: ArchiveItem[];
};

export type ViewMode = 'chat' | 'archive' | 'settings';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('chat');
  const [archives, setArchives] = useState<ArchiveItem[]>([
    {
      id: '1',
      title: 'Traditional Batik Pattern Collection',
      type: 'image',
      date: '2024-03-15',
      tags: ['batik', 'textile', 'traditional'],
      description: 'Green and gold batik patterns from Kelantan region',
      fileUrl: 'https://images.unsplash.com/photo-1610701596007-bc4c34b4c318?w=800',
      thumbnail: 'https://images.unsplash.com/photo-1610701596007-bc4c34b4c318?w=400',
    },
    {
      id: '2',
      title: 'Heritage Building Documentation',
      type: 'video',
      date: '2024-02-20',
      tags: ['architecture', 'colonial', 'heritage'],
      description: 'Video walkthrough of historic Penang shophouses',
      fileUrl: 'https://example.com/video.mp4',
    },
    {
      id: '3',
      title: 'Oral History Interview - Craftsman',
      type: 'audio',
      date: '2024-01-10',
      tags: ['oral history', 'crafts', 'interview'],
      description: 'Interview with traditional woodcarving master',
      fileUrl: 'https://example.com/audio.mp3',
    },
    {
      id: '4',
      title: 'Malay Traditional Costume Study',
      type: 'document',
      date: '2023-12-05',
      tags: ['costume', 'culture', 'research'],
      description: 'Research paper on evolution of traditional Malay attire',
      fileUrl: 'https://example.com/document.pdf',
    },
    {
      id: '5',
      title: 'Wayang Kulit Performance',
      type: 'image',
      date: '2024-04-01',
      tags: ['performance', 'traditional', 'puppet'],
      description: 'Shadow puppet theater performance documentation',
      fileUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
      thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400',
    },
  ]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Selamat datang! Welcome to the Badan Warisan Digital Archive. 

I can help you search through our collection of heritage items. Try asking me:
• "Find batik patterns from Kelantan"
• "Show me traditional architecture photos"
• "Search for oral history interviews about crafts"

You can also upload files for AI-assisted tagging and metadata enrichment.`,
      timestamp: new Date(),
    },
  ]);

  return (
    <div className="flex h-screen bg-stone-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="flex flex-col flex-1">
        <TopBar />
        
        <main className="flex-1 overflow-hidden">
          {currentView === 'chat' && (
            <div className="h-full p-6">
              <ChatPanel 
                messages={messages} 
                setMessages={setMessages}
                archives={archives}
              />
            </div>
          )}
          
          {currentView === 'archive' && (
            <div className="h-full overflow-auto">
              <CuratorDashboard 
                archives={archives}
                setArchives={setArchives}
              />
            </div>
          )}
          
          {currentView === 'settings' && (
            <div className="h-full overflow-auto">
              <SettingsPanel />
            </div>
          )}
        </main>
      </div>
      
      <Toaster />
    </div>
  );
}

export default App;