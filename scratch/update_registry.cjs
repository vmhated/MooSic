const fs = require('fs');

const resolved = JSON.parse(fs.readFileSync('scratch/resolved_data.json', 'utf8'));
let registryTs = fs.readFileSync('src/services/metadata/authenticCatalogRegistry.ts', 'utf8');

// For each artist
for (const [artistId, artistData] of Object.entries(resolved.artists)) {
  if (artistData.avatarUrl) {
    // Replace avatarUrl and bannerUrl inside this artist block
    // We match artist block: artistId: { ... }
    const regex = new RegExp(`(${artistId}:\\s*\\{[\\s\\S]*?avatarUrl:\\s*')([^']+)('[\\s\\S]*?bannerUrl:\\s*')([^']+)(')`);
    if (regex.test(registryTs)) {
      registryTs = registryTs.replace(regex, (match, p1, oldAv, p3, oldBan, p5) => {
        return `${p1}${artistData.avatarUrl}${p3}${artistData.bannerUrl || artistData.avatarUrl}${p5}`;
      });
      console.log(`Updated artist ${artistId}`);
    } else {
      // maybe only avatarUrl without bannerUrl or formatted differently
      const regexAv = new RegExp(`(${artistId}:\\s*\\{[\\s\\S]*?avatarUrl:\\s*')([^']+)(')`);
      if (regexAv.test(registryTs)) {
        registryTs = registryTs.replace(regexAv, (match, p1, oldAv, p3) => `${p1}${artistData.avatarUrl}${p3}`);
        console.log(`Updated artist (av only) ${artistId}`);
      } else {
        console.warn(`Could not match artist ${artistId}`);
      }
    }
  }
}

// For each album
for (const [albumId, albumData] of Object.entries(resolved.albums)) {
  if (albumData.coverUrl) {
    const regex = new RegExp(`(${albumId}:\\s*\\{[\\s\\S]*?coverUrl:\\s*')([^']+)(')`);
    if (regex.test(registryTs)) {
      registryTs = registryTs.replace(regex, (match, p1, oldCov, p3) => `${p1}${albumData.coverUrl}${p3}`);
      console.log(`Updated album ${albumId}`);
    } else {
      console.warn(`Could not match album ${albumId}`);
    }
  }
}

fs.writeFileSync('src/services/metadata/authenticCatalogRegistry.ts', registryTs, 'utf8');
console.log('Registry updated successfully!');
