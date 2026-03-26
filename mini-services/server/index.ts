import { spawn } from 'child_process'
import { createServer } from 'http'

// Simple health check server on port 3001
createServer((req, res) => {
  res.writeHead(200)
  res.end('OK')
}).listen(3001)

// Start Next.js server
const nextServer = spawn('node', ['.next/standalone/server.js'], {
  cwd: '/home/z/my-project',
  stdio: 'inherit',
  detached: true
})

nextServer.on('error', (err) => console.error('Server error:', err))
nextServer.on('exit', (code) => console.log('Server exited with code:', code))

console.log('Started Next.js server')
