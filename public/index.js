import * as tdmod from 'https://cdn.skypack.dev/throttle-debounce@^2.1.0';

import spotify from './spotify.js';
import reverb from './reverb.js';

document.addEventListener('DOMContentLoaded', async () => {

    const showItem = (item) => {
        if (item.source==="spotify") {
            reverb.showItem(item)
        } else if (item.source==="reverb") {
            spotify.showItem(item)
        }
    }

    const getResults = async (query) => {
        const resElem = document.getElementById('searchresults');
        resElem.innerHTML = '';
        const results = await Promise.all([reverb.search(query), spotify.search(query)])
        if (!results) {
            return;
        }
        const items = results.reduce((p, c) => p.concat(c), []);
        for(let i=0; i<items.length; i++) {
            const li = document.createElement('li');
            if (items[i].icon) {
                const img = document.createElement('img');
                img.setAttribute('src', items[i].icon)
                li.append(img);    
            }
            const span = document.createElement('div');
            span.innerText = items[i].name;
            span.addEventListener('click', () => showItem(items[i]))
            li.append(span);
            resElem.append(li);
        }
    }

    const searchDebounced = tdmod.debounce(500, getResults);
    const searchThrottled = tdmod.throttle(500, getResults);

    document.getElementById('searchbox').addEventListener('keyup', (evt) => {
        const q = evt.target.value;
        if (q.length < 5 || q.endsWith(' ')) {
            searchThrottled(q);
        } else {
            searchDebounced(q);
        }
    });

    if (window['fin']) {
        const searchTopic = await fin.Search.subscribe();
        await searchTopic.register({
            name: "Reverber",
            onSearch: reverb.search,
            onResultDispatch: reverb.showItem
        });
    }
});