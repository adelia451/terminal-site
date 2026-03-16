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

  //if someone tries to see in the browser
  if (!agent.includes('curl')) {
    res.send('Please view this site using:\n\ncurl ana.sh\n')
    return
  }

  runScript('make-home', res)
})

app.get('/contacts', (req,res)=>runScript('make-contacts',res))
app.get('/about', (req,res)=>runScript('make-about',res))

app.get('/install', (req, res) => {
  res.set('Content-Type', 'text/plain')
  res.sendFile(__dirname + '/scripts/install')
})

//app.use matches everything that didnt match above it - its the *) i used in install
app.use((req, res) => {
  res.set('Content-Type', 'text/plain')
  res.status(404).send(`
  ┌─────────────────────────────────┐
  │  404 — page not found           │
  └─────────────────────────────────┘

  Available pages:

  $ curl mimobox.sh
  $ curl mimobox.sh/about
  $ curl mimobox.sh/contacts
  $ curl mimobox.sh/install | bash

    `)
  })

app.listen(80, () => console.log('running on port 80'))
// changed all script files to lf, this ones crlf