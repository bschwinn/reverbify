import express from 'express'
import http from 'http';
import path from 'path'

import './config.js'
import reverb from './reverb.js'
import spotify from './spotify.js'

const port = Number(process.env.PORT)
const staticPath = path.join('public')

reverb.primeTheDatas()

const app = express();
app.use(express.json());

app.use('/reverb', async (req, res) => {
    const results = await reverb.search(req.query.q)
    res.json(results)
})

app.use('/spotify', async (req, res) => {
    const results = await spotify.search(req.query.q, req.query.scope)
    res.json(results)
})

app.get('/health', (req, res) => res.sendStatus(200))

app.use(express.static(staticPath))
  
http.createServer(app).listen(port)
console.log(`express serving listening on port:${port}`)
