import fetch from 'node-fetch';

const apiToken = process.env.REVERB_TOKEN

let catalog = [];

export default {
    primeTheDatas : async () => {
        const params = { method: 'GET', headers: { 'Authorization': `Bearer ${apiToken}`, 'Accept-Version' : '3.0' } };
        const resp = await fetch('https://api.reverb.com/api/listings', params);
        const json = await resp.json();
        catalog = json.listings;
    },
    search : async (q) => {
        const query = q.toLowerCase();
        return catalog.filter((listing) => {
            const title = listing.title.toLowerCase();
            return (title.indexOf(query) >= 0)
        })
    }
}
