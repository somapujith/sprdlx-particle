import fs from 'fs';

const t = fs.readFileSync('c:/Users/somap/Downloads/download__3_.jsx', 'utf8');
const iPos = t.indexOf('const POS_DATA = [');
const iCol = t.indexOf('const COL_DATA = [', iPos);
if (iPos < 0 || iCol < 0) throw new Error('markers not found');

const sliceBracket = (s, startIdx) => {
  const open = s.indexOf('[', startIdx);
  let depth = 0;
  for (let i = open; i < s.length; i++) {
    const c = s[i];
    if (c === '[') depth++;
    if (c === ']') {
      depth--;
      if (depth === 0) return { text: s.slice(open, i + 1), end: i + 1 };
    }
  }
  throw new Error('unclosed bracket');
};

const pos = sliceBracket(t, iPos);
const col = sliceBracket(t, iCol);

const posInner = pos.text.slice(1, -1);
const colInner = col.text.slice(1, -1);

const posNums = posInner.split(',').map(Number);
const colNums = colInner.split(',').map(Number);

console.log('POS length', posNums.length, 'COL length', colNums.length);
console.log('expected particles', posNums.length / 3, colNums.length / 3);

const out = `// Auto-extracted from download__3_.jsx — static formation positions & RGB bytes
export const PARTICLE_COUNT = ${posNums.length / 3};

export const POS_DATA = new Float32Array([${posInner}]);

/** RGB 0-255 per particle */
export const COL_DATA = new Uint8Array([${colInner}]);
`;

fs.writeFileSync('H:/Super Delux Project/Creativity/sprdlx/src/data/particleFormation.ts', out);
console.log('wrote particleFormation.ts');
