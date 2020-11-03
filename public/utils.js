
// help rule is { matchString: '/[cmd] [query]', results: [] }
export const getHelp = (rules, query) => {
    const matches = rules.filter((c) => (c.matchString.indexOf(query) == 0) );
    const matchedResults = matches.reduce((p,c) => {
        return p.concat(c.results)
    }, []);
    return matchedResults.filter( (val,idx,matches) => matches.findIndex(v => (v.id === val.id) )=== idx);
}

// process query and return first matching rule
export const processQuery = (query, rules) => {
    rules.sort((a, b) => {
        return b.matchString.length - a.matchString.length;
    });
    for(let i=0; i<rules.length; i++) {
        const r = rules[i];
        if (query.indexOf(r.matchString) == 0) {
            return { q: query.replace(r.matchString, ''), scope: r.scope }
        }
    }
    return { q: '', scope: ''}
}
