
import React, { useState, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Header } from './Header';
import { OutputPanel } from './OutputPanel';
import { ShareDialog } from './ShareDialog';
import { useToast } from '@/hooks/use-toast';

export interface CodeSnippet {
  id: string;
  title: string;
  language: string;
  code: string;
  output?: string;
  createdAt: Date;
}

const SAMPLE_CODE = {
  javascript: `// Welcome to the Online Code Editor!
console.log("Hello, World!");

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci sequence:");
for (let i = 0; i < 8; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}`,
  python: `# Welcome to the Online Code Editor!
print("Hello, World!")

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print("Fibonacci sequence:")
for i in range(8):
    print(f"F({i}) = {fibonacci(i)}")`,
  cpp: `// Welcome to the Online Code Editor!
#include <iostream>
using namespace std;

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    cout << "Hello, World!" << endl;
    
    cout << "Fibonacci sequence:" << endl;
    for (int i = 0; i < 8; i++) {
        cout << "F(" << i << ") = " << fibonacci(i) << endl;
    }
    
    return 0;
}`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            text-align: center;
            padding: 2rem;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to the Online Code Editor!</h1>
        <p>Start coding and see your results instantly.</p>
    </div>
</body>
</html>`,
  css: `/* Welcome to the Online Code Editor! */
body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.welcome-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  animation: fadeInUp 0.6s ease-out;
}

.welcome-card h1 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.welcome-card p {
  color: #666;
  line-height: 1.6;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`
};

export const CodeEditor: React.FC = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(SAMPLE_CODE.javascript);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [currentSnippet, setCurrentSnippet] = useState<CodeSnippet | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const editorRef = useRef(null);
  const { toast } = useToast();

  const handleEditorDidMount = useCallback((editor: any) => {
    editorRef.current = editor;
    editor.focus();
  }, []);

  const handleLanguageChange = useCallback((newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(SAMPLE_CODE[newLanguage as keyof typeof SAMPLE_CODE] || '');
    setOutput('');
  }, []);

  const simulateCodeExecution = useCallback((code: string, language: string) => {
    // Simulate code execution with realistic output
    let simulatedOutput = '';
    
    switch (language) {
      case 'javascript':
        if (code.includes('console.log')) {
          simulatedOutput = `Hello, World!
Fibonacci sequence:
F(0) = 0
F(1) = 1
F(2) = 1
F(3) = 2
F(4) = 3
F(5) = 5
F(6) = 8
F(7) = 13`;
        } else {
          simulatedOutput = '// Code executed successfully';
        }
        break;
      case 'python':
        simulatedOutput = `Hello, World!
Fibonacci sequence:
F(0) = 0
F(1) = 1
F(2) = 1
F(3) = 2
F(4) = 3
F(5) = 5
F(6) = 8
F(7) = 13`;
        break;
      case 'cpp':
        simulatedOutput = `Hello, World!
Fibonacci sequence:
F(0) = 0
F(1) = 1
F(2) = 1
F(3) = 2
F(4) = 3
F(5) = 5
F(6) = 8
F(7) = 13`;
        break;
      case 'html':
        simulatedOutput = 'HTML rendered successfully! Check the preview above.';
        break;
      case 'css':
        simulatedOutput = 'CSS styles applied successfully!';
        break;
      default:
        simulatedOutput = 'Code executed successfully!';
    }
    
    return simulatedOutput;
  }, []);

  const handleRunCode = useCallback(async () => {
    setIsRunning(true);
    setOutput('Running code...');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const result = simulateCodeExecution(code, language);
      setOutput(result);
      toast({
        title: "Code executed successfully!",
        description: `${language} code ran without errors.`,
      });
    } catch (error) {
      setOutput(`Error: ${error}`);
      toast({
        title: "Execution failed",
        description: "There was an error running your code.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  }, [code, language, simulateCodeExecution, toast]);

  const handleSaveSnippet = useCallback(() => {
    const snippet: CodeSnippet = {
      id: Math.random().toString(36).substr(2, 9),
      title: `${language} snippet`,
      language,
      code,
      output,
      createdAt: new Date(),
    };
    
    setSnippets(prev => [snippet, ...prev]);
    setCurrentSnippet(snippet);
    toast({
      title: "Snippet saved!",
      description: "Your code snippet has been saved successfully.",
    });
  }, [code, language, output, toast]);

  const handleShareCode = useCallback(() => {
    const shareId = Math.random().toString(36).substr(2, 9);
    const url = `${window.location.origin}/share/${shareId}`;
    setShareUrl(url);
    setShowShareDialog(true);
    
    // In a real app, you'd save this to a database
    console.log('Sharing code snippet:', { shareId, code, language });
  }, [code, language]);

  const handleLoadSnippet = useCallback((snippet: CodeSnippet) => {
    setLanguage(snippet.language);
    setCode(snippet.code);
    setOutput(snippet.output || '');
    setCurrentSnippet(snippet);
    toast({
      title: "Snippet loaded!",
      description: `Loaded ${snippet.title}`,
    });
  }, [toast]);

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        onRunCode={handleRunCode}
        onSaveSnippet={handleSaveSnippet}
        onShareCode={handleShareCode}
        isRunning={isRunning}
        snippets={snippets}
        onLoadSnippet={handleLoadSnippet}
      />
      
      <div className="flex-1 flex">
        <div className="flex-1 border-r border-gray-700">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(value) => setCode(value || '')}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              minimap: { enabled: true },
              wordWrap: 'on',
              formatOnPaste: true,
              formatOnType: true,
            }}
          />
        </div>
        
        <OutputPanel 
          output={output} 
          language={language}
          code={code}
          isRunning={isRunning}
        />
      </div>

      <ShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        shareUrl={shareUrl}
      />
    </div>
  );
};
