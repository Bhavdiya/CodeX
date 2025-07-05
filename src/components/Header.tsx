
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Play, Save, Share2, FolderOpen, Code2 } from 'lucide-react';
import { CodeSnippet } from './CodeEditor';

interface HeaderProps {
  language: string;
  onLanguageChange: (language: string) => void;
  onRunCode: () => void;
  onSaveSnippet: () => void;
  onShareCode: () => void;
  isRunning: boolean;
  snippets: CodeSnippet[];
  onLoadSnippet: (snippet: CodeSnippet) => void;
}

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', icon: '🟨' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'cpp', label: 'C++', icon: '⚡' },
  { value: 'html', label: 'HTML', icon: '🌐' },
  { value: 'css', label: 'CSS', icon: '🎨' },
];

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onRunCode,
  onSaveSnippet,
  onShareCode,
  isRunning,
  snippets,
  onLoadSnippet,
}) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <img 
            src="/android-chrome-192x192.png" 
            alt="Codex Logo" 
            className="h-8 w-8 rounded-lg"
          />
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue -400 bg-clip-text text-transparent">
            Codex
          </h1>
        </div>
        
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-48 bg-gray-700 border-gray-600">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.value} value={lang.value} className="text-white hover:bg-gray-700">
                <span className="flex items-center space-x-2">
                  <span>{lang.icon}</span>
                  <span>{lang.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-gray-700 border-gray-600 hover:bg-gray-600">
              <FolderOpen className="h-4 w-4 mr-2" />
              Open ({snippets.length})
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-800 border-gray-600 w-64">
            {snippets.length === 0 ? (
              <DropdownMenuItem disabled className="text-gray-400">
                No saved snippets
              </DropdownMenuItem>
            ) : (
              snippets.map((snippet) => (
                <DropdownMenuItem
                  key={snippet.id}
                  onClick={() => onLoadSnippet(snippet)}
                  className="text-white hover:bg-gray-700 cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{snippet.title}</span>
                    <span className="text-xs text-gray-400">
                      {snippet.language} • {snippet.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          onClick={onSaveSnippet}
          variant="outline"
          size="sm"
          className="bg-gray-700 border-gray-600 hover:bg-gray-600"
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>

        <Button
          onClick={onShareCode}
          variant="outline"
          size="sm"
          className="bg-gray-700 border-gray-600 hover:bg-gray-600"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>

        <Button
          onClick={onRunCode}
          disabled={isRunning}
          className="bg-green-600 hover:bg-green-700 text-white"
          size="sm"
        >
          <Play className="h-4 w-4 mr-2" />
          {isRunning ? 'Running...' : 'Run Code'}
        </Button>
      </div>
    </header>
  );
};
