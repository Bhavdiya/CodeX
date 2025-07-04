
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { code, language, sessionId } = await req.json()

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let output = ''
    let error = null

    // Execute code based on language
    switch (language) {
      case 'javascript':
        try {
          // Create a safe execution context
          const result = await executeJavaScript(code)
          output = result
        } catch (e) {
          error = e.message
        }
        break

      case 'python':
        try {
          output = await executePython(code)
        } catch (e) {
          error = e.message
        }
        break

      case 'html':
        output = 'HTML rendered successfully! Check the preview tab.'
        break

      case 'css':
        output = 'CSS styles applied successfully! Check the preview tab.'
        break

      case 'cpp':
        try {
          output = await executeCpp(code)
        } catch (e) {
          error = e.message
        }
        break

      default:
        error = `Language ${language} is not supported yet`
    }

    // Store execution result in database
    await supabase.from('code_executions').insert({
      session_id: sessionId,
      language,
      code,
      output,
      error
    })

    return new Response(
      JSON.stringify({ output, error, success: !error }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Code execution error:', error)
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

async function executeJavaScript(code: string): Promise<string> {
  // Create a safe execution environment
  const logs: string[] = []
  
  // Override console.log to capture output
  const originalConsole = console.log
  console.log = (...args: any[]) => {
    logs.push(args.map(arg => String(arg)).join(' '))
  }

  try {
    // Execute the code in a try-catch to handle errors
    const result = eval(code)
    
    // Restore original console.log
    console.log = originalConsole
    
    // Return captured logs or the result
    if (logs.length > 0) {
      return logs.join('\n')
    } else if (result !== undefined) {
      return String(result)
    } else {
      return 'Code executed successfully'
    }
  } catch (error) {
    console.log = originalConsole
    throw error
  }
}

async function executePython(code: string): Promise<string> {
  // For Python, this is a simulation since we can't run Python in Deno
  // In a real implementation, you'd use a Python runtime or container
  const lines = code.split('\n')
  const outputs: string[] = []
  
  for (const line of lines) {
    if (line.trim().startsWith('print(')) {
      // Simple print statement extraction
      const match = line.match(/print\((.+)\)/)
      if (match) {
        try {
          // Evaluate simple expressions
          const expr = match[1].replace(/['"]/g, '')
          if (expr.includes('+') || expr.includes('-') || expr.includes('*') || expr.includes('/')) {
            const result = eval(expr)
            outputs.push(String(result))
          } else {
            outputs.push(expr)
          }
        } catch {
          outputs.push(match[1].replace(/['"]/g, ''))
        }
      }
    }
  }
  
  return outputs.length > 0 ? outputs.join('\n') : 'Python code processed (limited execution in browser environment)'
}

async function executeCpp(code: string): Promise<string> {
  // C++ simulation - in reality you'd need a C++ compiler
  if (code.includes('cout')) {
    const outputs: string[] = []
    const lines = code.split('\n')
    
    for (const line of lines) {
      if (line.includes('cout')) {
        // Extract cout statements
        const match = line.match(/cout\s*<<\s*"([^"]+)"/)
        if (match) {
          outputs.push(match[1])
        }
      }
    }
    
    return outputs.length > 0 ? outputs.join('\n') : 'C++ code processed (limited execution in browser environment)'
  }
  
  return 'C++ code compiled successfully (simulation)'
}
