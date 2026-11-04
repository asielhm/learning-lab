import{writeFileSync}from'node:fs';
import{classCover,acidComparison,examplePicture,alcoholNaming,acidNaming}from'../assets/y10-chemistry/alcohols/art.mjs';
const dir=new URL('../assets/y10-chemistry/alcohols/',import.meta.url);
writeFileSync(new URL('cover.svg',dir),classCover());writeFileSync(new URL('acids.svg',dir),acidComparison());
for(const kind of['vinegar','fuel','fermentation','fizz'])writeFileSync(new URL(kind+'.svg',dir),examplePicture(kind));

writeFileSync(new URL('naming-alcohols.svg',dir),alcoholNaming());writeFileSync(new URL('naming-acids.svg',dir),acidNaming());
