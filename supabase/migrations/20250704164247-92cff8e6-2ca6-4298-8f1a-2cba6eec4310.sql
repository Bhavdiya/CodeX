
-- Create a table to store code execution sessions
CREATE TABLE public.code_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  language TEXT NOT NULL,
  code TEXT NOT NULL,
  output TEXT,
  error TEXT,
  executed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add index for better performance
CREATE INDEX idx_code_executions_session_id ON public.code_executions(session_id);
CREATE INDEX idx_code_executions_executed_at ON public.code_executions(executed_at);

-- Enable Row Level Security (optional - for now we'll make it public)
ALTER TABLE public.code_executions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since this is a public code editor)
CREATE POLICY "Allow all operations on code_executions" 
  ON public.code_executions 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);
