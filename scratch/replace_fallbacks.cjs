const fs = require('fs');
const path = require('path');

const COVER_FALLBACK = 'https://cdn-images.dzcdn.net/images/cover/9ad06bcb9f0bfe52bbd5e6ff464e4ca4/1000x1000-000000-80-0-0.jpg';
const ARTIST_FALLBACK = 'https://cdn-images.dzcdn.net/images/artist/0edaeb3873f37a794fe956d23b08107d/1000x1000-000000-80-0-0.jpg';

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      processDir(full);
    } else if (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js')) {
      let content = fs.readFileSync(full, 'utf8');
      if (content.includes('mzstatic.com')) {
        console.log('Processing file:', full);
        if (f.includes('ArtistCard')) {
          content = content.replace(/https:\/\/is1-ssl\.mzstatic\.com\/[^\s'"]+/g, ARTIST_FALLBACK);
        } else {
          content = content.replace(/https:\/\/is1-ssl\.mzstatic\.com\/[^\s'"]+/g, COVER_FALLBACK);
        }
        fs.writeFileSync(full, content, 'utf8');
        console.log('Updated:', full);
      }
    }
  }
}

processDir('src');
console.log('Done replacing fallbacks in src!');
