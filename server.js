const express = require('express')
const app = express()
const { execSync } = require('child_process')

function runScript(script, res) {
  const output = execSync(`bash scripts/${script}`).toString()
  res.set('Content-Type', 'text/plain')
  res.send(output)
}

app.get('/', (req, res) => {

  const agent = req.headers['user-agent'] || ''

  if (!agent.includes('curl')) {
    res.send('Please view this site using:\n\ncurl ana.sh\n')
    return
  }

  runScript('make-home', res)
})
app.get('/contacts', (req,res)=>runScript('make-contacts',res))
app.get('/aboutme', (req,res)=>runScript('make-about',res))

app.get('/install', (req, res) => {
  res.set('Content-Type', 'text/plain')
  res.sendFile(__dirname + '/scripts/install')
})

app.listen(3000, () => console.log('running on port 3000'))