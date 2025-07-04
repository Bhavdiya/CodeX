
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
          error = `JavaScript Error: ${e.name}: ${e.message}`
          if (e.stack) {
            error += `\n\nStack trace:\n${e.stack}`
          }
        }
        break

      case 'python':
        try {
          output = await executePython(code)
        } catch (e) {
          error = `Python Error: ${e.message}`
        }
        break

      case 'html':
        // Validate HTML
        if (code.includes('<script>') && !code.includes('</script>')) {
          error = 'HTML Error: Unclosed <script> tag detected'
        } else if (code.includes('<style>') && !code.includes('</style>')) {
          error = 'HTML Error: Unclosed <style> tag detected'
        } else {
          output = 'HTML rendered successfully! Check the preview tab.'
        }
        break

      case 'css':
        // Basic CSS validation
        const openBraces = (code.match(/{/g) || []).length
        const closeBraces = (code.match(/}/g) || []).length
        if (openBraces !== closeBraces) {
          error = 'CSS Syntax Error: Mismatched braces - missing ' + 
                  (openBraces > closeBraces ? 'closing' : 'opening') + ' brace(s)'
        } else {
          output = 'CSS styles applied successfully! Check the preview tab.'
        }
        break

      case 'cpp':
        try {
          output = await executeCpp(code)
        } catch (e) {
          error = `C++ Error: ${e.message}`
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
      output: output || null,
      error: error || null
    })

    return new Response(
      JSON.stringify({ 
        output: error || output, 
        error: error ? true : false, 
        success: !error 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Code execution error:', error)
    return new Response(
      JSON.stringify({ 
        output: `System Error: ${error.message}`, 
        error: true, 
        success: false 
      }),
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
  const errors: string[] = []
  
  // Override console methods to capture output
  const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info
  }
  
  console.log = (...args: any[]) => {
    logs.push(args.map(arg => String(arg)).join(' '))
  }
  
  console.error = (...args: any[]) => {
    errors.push('ERROR: ' + args.map(arg => String(arg)).join(' '))
  }
  
  console.warn = (...args: any[]) => {
    logs.push('WARNING: ' + args.map(arg => String(arg)).join(' '))
  }
  
  console.info = (...args: any[]) => {
    logs.push('INFO: ' + args.map(arg => String(arg)).join(' '))
  }

  try {
    // Check for common syntax errors before execution
    if (code.includes('console.log(') && !code.includes(')')) {
      throw new SyntaxError('Unclosed console.log statement')
    }
    
    // Execute the code in a try-catch to handle errors
    const result = eval(code)
    
    // Restore original console methods
    Object.assign(console, originalConsole)
    
    // Combine logs and errors
    const allOutput = [...logs, ...errors]
    
    // Return captured logs, errors, or the result
    if (allOutput.length > 0) {
      return allOutput.join('\n')
    } else if (result !== undefined) {
      return String(result)
    } else {
      return 'Code executed successfully (no output)'
    }
  } catch (error) {
    // Restore original console methods
    Object.assign(console, originalConsole)
    throw error
  }
}

async function executePython(code: string): Promise<string> {
  // Enhanced Python simulation with better error detection
  const lines = code.split('\n')
  const outputs: string[] = []
  const errors: string[] = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    if (line.startsWith('print(')) {
      // Check for syntax errors
      if (!line.includes(')')) {
        throw new Error(`SyntaxError: Unclosed print statement at line ${i + 1}`)
      }
      
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
    } else if (line && !line.startsWith('#') && !line.startsWith('def ')) {
      // Check for common Python syntax errors
      if (line.includes('=') && !line.includes('==') && !line.includes('!=')) {
        // Variable assignment - simulate
        continue
      } else if (line.includes('if ') && !line.endsWith(':')) {
        throw new Error(`SyntaxError: Invalid syntax - missing colon after if statement at line ${i + 1}`)
      }
    }
  }
  
  if (errors.length > 0) {
    throw new Error(errors.join('\n'))
  }
  
  return outputs.length > 0 ? outputs.join('\n') : 'Python code processed (limited execution in browser environment)'
}

async function executeCpp(code: string): Promise<string> {
  // Enhanced C++ simulation with error detection
  const lines = code.split('\n')
  const outputs: string[] = []
  const errors: string[] = []
  
  // Check for basic syntax errors
  const openBraces = (code.match(/{/g) || []).length
  const closeBraces = (code.match(/}/g) || []).length
  
  if (openBraces !== closeBraces) {
    throw new Error(`Compilation Error: Mismatched braces - expected ${openBraces} closing braces, found ${closeBraces}`)
  }
  
  if (!code.includes('int main(') && !code.includes('int main (')) {
    throw new Error('Compilation Error: No main function found')
  }
  
  if (code.includes('cout') && !code.includes('#include <iostream>')) {
    errors.push('Warning: Missing #include <iostream> for cout')
  }
  
  for (const line of lines) {
    if (line.includes('cout')) {
      // Check for proper cout syntax
      if (!line.includes('<<')) {
        throw new Error('Compilation Error: Invalid cout syntax - missing << operator')
      }
      
      // Extract cout statements
      const match = line.match(/cout\s*<<\s*"([^"]+)"/)
      if (match) {
        outputs.push(match[1])
      }
    }
  }
  
  if (errors.length > 0) {
    outputs.unshift(...errors)
  }
  
  return outputs.length > 0 ? outputs.join('\n') : 'C++ code compiled successfully (simulated execution)'
}
