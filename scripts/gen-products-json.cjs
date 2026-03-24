const fs = require('fs');
const src = fs.readFileSync('src/data/products.ts', 'utf8');

const products = [];
const blockRegex = /\{\s*id:\s*'([^']+)'[\s\S]*?details:\s*\[[\s\S]*?\]\s*\}/g;

let match;
while ((match = blockRegex.exec(src)) !== null) {
  const block = match[0];

  const getStr = (key) => {
    const m = block.match(new RegExp(key + ":\\s*'([^']*?)'"));
    return m ? m[1] : '';
  };

  const getBool = (key) => {
    const m = block.match(new RegExp(key + ':\\s*(true|false)'));
    return m ? m[1] === 'true' : false;
  };

  const getArr = (key) => {
    const m = block.match(new RegExp(key + ':\\s*\\[([\\s\\S]*?)\\]'));
    if (!m) return [];
    const items = [];
    const itemRegex = /'([^']+)'/g;
    let im;
    while ((im = itemRegex.exec(m[1])) !== null) items.push(im[1]);
    return items;
  };

  products.push({
    id: getStr('id'),
    name: getStr('name'),
    price: getStr('price'),
    description: getStr('description'),
    category: getStr('category'),
    sizes: getArr('sizes'),
    color: getStr('color'),
    code: getStr('code'),
    featured: getBool('featured'),
    inStock: getBool('inStock'),
    image: getStr('image'),
    hoverImage: getStr('hoverImage'),
    images: getArr('images'),
    cloudinaryIds: getArr('cloudinaryIds'),
    details: getArr('details'),
  });
}

fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
console.log(`Generated products.json with ${products.length} products`);
