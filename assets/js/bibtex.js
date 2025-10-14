// Tiny BibTeX parser to extract entries into a JS array.
// This is intentionally lightweight and supports common fields.
// Usage:
//   const entries = Bib.parse(bibtexString);
//   // map to your PUBLICATIONS shape as needed
(function(){
  function parseBibtex(text){
    const entries = [];
    const blocks = text.split(/@(?=[a-zA-Z]+)/).map(s=>s.trim()).filter(Boolean);
    for (const block of blocks){
      const m = block.match(/^([a-zA-Z]+)\s*\{\s*([^,]+),([\s\S]*)\}\s*$/);
      if(!m) continue;
      const [, type, key, body] = m;
      const fields = {};
      const re = /([a-zA-Z]+)\s*=\s*(\{[^}]*\}|"[^"]*"|[^,]+)\s*,?/g;
      let fm;
      while((fm = re.exec(body))){
        let val = fm[2].trim();
        if ((val.startsWith('{') && val.endsWith('}')) || (val.startsWith('"') && val.endsWith('"'))){
          val = val.slice(1,-1);
        }
        fields[fm[1].toLowerCase()] = val.replace(/\s+/g,' ').trim();
      }
      entries.push({ type: type.toLowerCase(), key, fields });
    }
    return entries;
  }
  window.Bib = { parse: parseBibtex };
})();
