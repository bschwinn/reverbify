import {getHelp} from './utils.js';

// help stuff
const defaultHelp = { id: 'all', name: "/spot <album artist or track name>", description: "Search spotify for artists, albums or songs.", data: { sample: true }, icon: "https://spotify.com/favicon.ico" };
const artistHelp = { id: 'artist', name: "/spot/artist <artist name>", description: "Search spotify for artists.", data: { sample: true }, icon: "https://spotify.com/favicon.ico" };
const trackHelp = { id: 'track', name: "/spot/track <artist name>", description: "Search spotify for tracks.", data: { sample: true }, icon: "https://spotify.com/favicon.ico" };
const albumHelp = { id: 'album', name: "/spot/album <artist name>", description: "Search spotify for albums.", data: { sample: true }, icon: "https://spotify.com/favicon.ico" };
const scopeChoiceHelpResult = [artistHelp, albumHelp, trackHelp];
const defaultHelpResult = [defaultHelp];

const helpRules = [
    { matchString: '/music ', results: defaultHelpResult, scope: 'all' },
    { matchString: '/music/', results: scopeChoiceHelpResult },
    { matchString: '/music/track ', results: [trackHelp], scope: 'track' },
    { matchString: '/music/album ', results: [albumHelp], scope: 'album' },
    { matchString: '/music/artist ', results: [artistHelp], scope: 'artist' },
];

const processQuery = (query) => {
    for(let i=0; i<helpRules.length; i++) {
        const r = helpRules[helpRules.length-1-i];
        if (query.indexOf(r.matchString) == 0) {
            return { q: query.replace(r.matchString, ''), scope: r.scope }
        }
    }
    return { q: '', scope: ''}
}

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
    const { q, scope } = processQuery(query);
    if (q && q !== "") {
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