
// help rule is { matchString: '/[cmd] [search]', results: [] }
export const getHelp = (rules, query) => {
    const matches = rules.filter((c) => (c.matchString.indexOf(query) == 0) );
    const matchedResults = matches.reduce((p,c) => {
        return p.concat(c.results)
    }, []);
    return matchedResults.filter( (val,idx,matches) => matches.findIndex(v => (v.id === val.id) )=== idx);
}
