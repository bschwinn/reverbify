import fetch from 'node-fetch';

const clientID = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
let basicbuff = Buffer.from(`${clientID}:${clientSecret}`)
let basicAuth = basicbuff.toString('base64')

let accessToken = '12345';

const refreshToken = async (query, scope) => {
    console.log('refreshing spotify access token')
    const tokParams = { method: 'POST', 
        headers: { 
            'Authorization': `Basic ${basicAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    }
    const tokResp = await fetch(`https://accounts.spotify.com/api/token`, tokParams)
    const tokens = await tokResp.json()
    if (tokResp.ok) {
        accessToken = tokens.access_token
        console.log(`access token refreshed: ${accessToken}`)
        return runSearch(query, scope, false)
    }
    console.error(`error refreshing token - status: ${tokResp.status}, response: ${JSON.stringify(tokens)}` )
    return []
}

const transform = (json,scope) => {
    let allResults = [];
    if (json.albums) {
        allResults = allResults.concat(json.albums.items.map( ({id, name, uri, external_urls, artists}) => {
            return { id, name, uri, weburl: external_urls.spotify, artists: artists.map((a)=>a.name), type: "album"}
        }))    
    }
    if (json.artists) {
        allResults = json.artists.items.map( ({id, name, uri, external_urls}) => {
            return { id, name, uri, weburl: external_urls.spotify, type: "artist"}
        })    
    }
    if (json.tracks) {
        allResults = allResults.concat(json.tracks.items.map( ({id, name, uri, external_urls, artists, album}) => {
            return { id, name, uri, album: album.name, artists: artists.map((a)=>a.name), weburl: external_urls.spotify, type: "track"}
        }))
    }
    return allResults
}

const validScopes = ['artist', 'album', 'track'];
const runSearch = async (query, scope, refresh) => {
    if (scope === 'all' || !validScopes.includes(scope)) {
        scope = 'album,track,artist';
    }
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${scope}`
    console.log(`calling spotify: ${url}`)
    const params = { method: 'GET', headers: { 'Authorization': `Bearer ${accessToken}` } }
    const resp = await fetch(url, params)
    if (refresh!==false && resp.status === 401) {
        return refreshToken(query)
    }
    const json = await resp.json();
    return transform(json,scope)
}

export default {
    search : runSearch
}
