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
    <header className="mx-4 mt-4 rounded-2xl shadow-lg bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 flex items-center justify-between transition-all duration-300">
      <a href="/" className="flex items-center space-x-3 group hover:scale-105 transition-transform">
        <img 
          src="/android-chrome-192x192.png" 
          alt="Codex Logo" 
          className="h-10 w-10 rounded-xl shadow group-hover:shadow-lg transition-shadow"
        />
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-white via-blue-400 to-purple-500 bg-clip-text text-transparent tracking-tight group-hover:from-blue-200 group-hover:to-purple-300 transition-colors">
          Codex
        </h1>
      </a>
      <div className="flex items-center space-x-4">
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-40 bg-white/20 border-white/30 text-white hover:bg-white/30 transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-900/90 border-white/20 text-white shadow-xl rounded-xl">
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.value} value={lang.value} className="text-white hover:bg-blue-500/20 rounded transition-colors">
                <span className="flex items-center space-x-2">
                  <span>{lang.icon}</span>
                  <span>{lang.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30 transition-colors shadow rounded-lg">
              <FolderOpen className="h-4 w-4 mr-2" />
              Open ({snippets.length})
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-900/90 border-white/20 text-white shadow-xl rounded-xl">
            {snippets.length === 0 ? (
              <DropdownMenuItem disabled className="text-gray-400">
                No saved snippets
              </DropdownMenuItem>
            ) : (
              snippets.map((snippet) => (
                <DropdownMenuItem
                  key={snippet.id}
                  onClick={() => onLoadSnippet(snippet)}
                  className="text-white hover:bg-blue-500/20 rounded transition-colors cursor-pointer"
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
          className="bg-white/20 border-white/30 text-white hover:bg-blue-500/20 transition-colors shadow rounded-lg"
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button
          onClick={onShareCode}
          variant="outline"
          size="sm"
          className="bg-white/20 border-white/30 text-white hover:bg-purple-500/20 transition-colors shadow rounded-lg"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button
          onClick={onRunCode}
          disabled={isRunning}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow rounded-lg px-4 py-2 font-semibold transition-all duration-200"
          size="sm"
        >
          <Play className="h-4 w-4 mr-2" />
          {isRunning ? 'Running...' : 'Run Code'}
        </Button>
        {/* Avatar placeholder */}
        <div className="ml-4">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg border-2 border-white/30">
            <span className="text-white font-bold text-lg select-none">B</span>
          </div>
        </div>
      </div>
    </header>
  );
};
