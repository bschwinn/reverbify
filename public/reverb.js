import {getHelp} from './utils.js';

const defaultHelp = { id: 'help', name: "/rev <search>", description: "Sample command for opening up a teams conversation with someone.", data: { sample: true }, icon: "https://reverb.com/favicon.ico" };
const defaultHelpResult = [defaultHelp];

const helpRules = [
    { matchString: '/rev ', results: defaultHelpResult },
];

const search = async (query) => {
    const matches = query.match(/\/rev (.*)/);
    if (matches) {
        const q = matches[1];
        if (q && q !== "") {
            const res = await fetch(`/reverb?q=${q}`);
            const listings = await res.json();
            return listings.map(({ id, title, description, _links, photos }) => ({
                name: title,
                description: description,
                icon: photos && photos[0] && photos[0]._links.thumbnail.href,
                data: { id, url: _links.web.href }
            }));
        }
    }
    return getHelp(helpRules, query)
}

const showItem = (item) => {
    console.log('showing item', item);
    window.open(item.data.url, 'reverb')
}

export default { search, showItem }