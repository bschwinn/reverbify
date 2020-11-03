import {getHelp, processQuery} from './utils.js';

const command = '/spot';
const commandDelim = '/';

// help stuff
const defaultHelp = { id: 'all', name: `${command} <album artist or track name>`, description: "Search spotify for artists, albums or songs.", data: { sample: true }, icon: "https://spotify.com/favicon.ico" };
const artistHelp = { id: 'artist', name: `${command}${commandDelim}artist <artist name>`, description: "Search spotify for artists.", data: { sample: true }, icon: "https://spotify.com/favicon.ico" };
const trackHelp = { id: 'track', name: `${command}${commandDelim}track <track name>`, description: "Search spotify for tracks.", data: { sample: true }, icon: "https://spotify.com/favicon.ico" };
const albumHelp = { id: 'album', name: `${command}${commandDelim}album <album name>`, description: "Search spotify for albums.", data: { sample: true }, icon: "https://spotify.com/favicon.ico" };
const defaultHelpResult = [defaultHelp];

const helpRules = [
    { matchString: `${command} `, results: defaultHelpResult, scope: 'all' },
    { matchString: `${command}${commandDelim}track `, results: [trackHelp], scope: 'track' },
    { matchString: `${command}${commandDelim}album `, results: [albumHelp], scope: 'album' },
    { matchString: `${command}${commandDelim}artist `, results: [artistHelp], scope: 'artist' },
];

const formatName = (type, name, artists, album) => {
    switch(type) {
        case "artist":
            return `Artist: ${name}`
        case "album":
            return `Album: ${name} by ${artists && artists.join(', ')}`
        case "track":
            return `Track: ${name} by ${artists && artists.join(', ')} appears on ${album}`
    }
}

const search = async (query) => {
    const { q, scope } = processQuery(query, helpRules);
    if (q && q !== "") {
        console.log(`doing a spotify query: q = ${q}, query: ${query}, scope: ${scope}`)
        const res = await fetch(`/spotify?q=${q}&scope=${scope}`);
        const results = await res.json();
        return results.map(({ id, name, uri, weburl, artists, album, type }) => ({
            name: formatName(type, name, artists, album),
            description: formatName(type, name, artists, album),
            data: { id, uri, weburl, type }
        }));    
    }
    return getHelp(helpRules, query)
}

const showItem = (item) => {
    console.log('showing item', item);
    window.open(item.data.url, 'spotify')
}

export default { search, showItem }