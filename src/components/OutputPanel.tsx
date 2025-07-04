
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Terminal, Eye, AlertCircle } from 'lucide-react';

interface OutputPanelProps {
  output: string;
  language: string;
  code: string;
  isRunning: boolean;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  output,
  language,
  code,
  isRunning,
}) => {
  const renderHTMLPreview = () => {
    if (language === 'html') {
      return (
        <div className="w-full h-full bg-white rounded">
          <iframe
            srcDoc={code}
            className="w-full h-full border-0 rounded"
            title="HTML Preview"
            sandbox="allow-scripts"
          />
        </div>
      );
    }
    
    if (language === 'css') {
      const htmlWithCSS = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>${code}</style>
        </head>
        <body>
          <div class="welcome-card">
            <h1>CSS Preview</h1>
            <p>Your styles are applied to this preview.</p>
          </div>
        </body>
        </html>
      `;
      return (
        <div className="w-full h-full bg-white rounded">
          <iframe
            srcDoc={htmlWithCSS}
            className="w-full h-full border-0 rounded"
            title="CSS Preview"
            sandbox="allow-scripts"
          />
        </div>
      );
    }
    
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Preview not available for {language}</p>
        </div>
      </div>
    );
  };

  const hasErrors = output.toLowerCase().includes('error');

  return (
    <div className="w-96 bg-gray-800 flex flex-col">
      <Tabs defaultValue="output" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 bg-gray-700 m-2">
          <TabsTrigger value="output" className="data-[state=active]:bg-gray-600">
            <Terminal className="h-4 w-4 mr-2" />
            Console
          </TabsTrigger>
          <TabsTrigger value="preview" className="data-[state=active]:bg-gray-600">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="output" className="flex-1 m-2 mt-0">
          <Card className="h-full bg-gray-900 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                {hasErrors ? (
                  <>
                    <AlertCircle className="h-4 w-4 mr-2 text-red-400" />
                    <span className="text-red-400">Error Output</span>
                  </>
                ) : (
                  <>
                    <Terminal className="h-4 w-4 mr-2 text-green-400" />
                    <span className="text-green-400">Console Output</span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <ScrollArea className="h-full">
                <div className="p-4">
                  {isRunning ? (
                    <div className="flex items-center space-x-2 text-yellow-400">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
                      <span>Executing code...</span>
                    </div>
                  ) : output ? (
                    <pre className={`text-sm font-mono whitespace-pre-wrap ${
                      hasErrors ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {output}
                    </pre>
                  ) : (
                    <div className="text-gray-500 text-sm">
                      Click "Run Code" to see output here...
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview" className="flex-1 m-2 mt-0">
          <Card className="h-full bg-gray-900 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Eye className="h-4 w-4 mr-2 text-blue-400" />
                <span className="text-blue-400">Live Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 flex-1">
              {renderHTMLPreview()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
