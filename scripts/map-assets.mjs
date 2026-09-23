// Copies the professional product photos from src/assets into public/images/menu/<folder>/<slug>.webp
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const SRC = 'src/assets';
const OUT = 'public/images/menu';

// [destFolder, destSlug, sourceBasename]
const map = [
  ['hot-coffee', 'vanilla-latte', 'vanilla-latte'],
  ['hot-coffee', 'caramel-macchiato', 'caramel-macchiato'],
  ['hot-coffee', 'toffee-nut-latte', 'toffee-nut-latte'],
  ['hot-coffee', 'chocolate-mocha', 'chocolate-mocha'],
  ['hot-coffee', 'cinnamon-honey-latte', 'cinnamon-honey-latte'],
  ['hot-coffee', 'spanish-latte', 'spanish-latte'],
  ['hot-coffee', 'brown-sugar-latte', 'brown-sugar-latte'],
  ['hot-coffee', 'cookie-latte', 'cookie-latte'],
  ['hot-coffee', 'hazelnut-latte', 'hazelnut-latte'],
  ['hot-coffee', 'americano', 'americano'],
  ['hot-coffee', 'espresso', 'espresso'],
  ['hot-coffee', 'cappuccino', 'cappuccino'],
  ['hot-coffee', 'flat-white', 'flat-white'],
  ['hot-coffee', 'cafe-turc', 'cafe-turc'],
  ['hot-coffee', 'cappucin', 'cappuccin'],
  ['extras', 'coffee-shot-capsule', 'coffee-shot-capsule'],
  ['extras', 'sirop', 'sirop'],
  ['extras', 'non-dairy-milk', 'non-dairy-milk'],
  ['iced-coffee', 'iced-vanilla', 'iced-vanilla'],
  ['iced-coffee', 'iced-toffee-nut', 'iced-toffee-nut'],
  ['iced-coffee', 'iced-salted-caramel', 'iced-salted-caramel'],
  ['iced-coffee', 'iced-chocolate-mocha', 'iced-chocolate-mocha'],
  ['iced-coffee', 'iced-cookie-butter', 'iced-cookie-butter'],
  ['iced-coffee', 'iced-hazelnut', 'iced-hazelnut'],
  ['iced-coffee', 'iced-blueberry', 'iced-blueberry'],
  ['iced-coffee', 'iced-strawberry', 'iced-strawberry'],
  ['iced-coffee', 'iced-spanish', 'iced-spanish'],
  ['iced-coffee', 'iced-honey-cinnamon', 'iced-honey-cinnamon'],
  ['iced-coffee', 'iced-tiramisu', 'iced-tiramisu'],
  ['iced-coffee', 'iced-brown-sugar', 'iced-brown-sugar'],
  ['iced-coffee', 'iced-latte', 'iced-latte'],
  ['shaken-espresso', 'hazelnut-shaken-espresso', 'hazelnut-shaken-espresso'],
  ['shaken-espresso', 'brown-sugar-shaken-espresso', 'brown-sugar-shaken-espresso'],
  ['shaken-espresso', 'honey-shaken-espresso', 'honey-shaken-espresso'],
  ['drinks', 'hot-chocolate', 'hot-chocolate'],
  ['drinks', 'hot-chocolate-marshmallow', 'hot-chocolate-marshmallow'],
  ['drinks', 'hot-chocolate-whipped-cream', 'hot-white-chocolate'],
  ['drinks', 'frappuccino-chocolat', 'frappuccino-chocolate'],
  ['drinks', 'frappuccino-speculoos', 'frappuccino-speculoos'],
  ['drinks', 'frappuccino-caramel', 'frappuccino-caramel'],
  ['drinks', 'mojito-virgin', 'mojito-virgin'],
  ['drinks', 'mojito-bleu', 'mojito-bleu'],
  ['drinks', 'mojito-red', 'mojito-red'],
  ['drinks', 'mojito-energetique', 'mojito-energetique'],
  ['drinks', 'the-vert-menthe', 'the-vert-menthe'],
  ['drinks', 'the-vert-amandes', 'the-vert-amandes'],
  ['drinks', 'the-vert-pignons', 'the-vert-pignons'],
  ['drinks', 'iced-tea-peach', 'iced-tea-peach'],
  ['juices', 'jus-fraise', 'jus-fraise'],
  ['juices', 'citronnade', 'citronnade'],
  ['juices', 'pink-lemonade', 'pink-lemonade'],
  ['juices', 'fruit-de-bois', 'fruit-de-bois'],
  ['juices', 'kiwi', 'kiwi'],
  ['juices', 'peche-mangue', 'peche-mangue'],
];

let ok = 0;
for (const [folder, slug, source] of map) {
  const srcPath = join(SRC, `${source}.webp`);
  const destPath = join(OUT, folder, `${slug}.webp`);
  if (!existsSync(srcPath)) {
    console.log('MISSING SOURCE:', srcPath);
    continue;
  }
  mkdirSync(dirname(destPath), { recursive: true });
  copyFileSync(srcPath, destPath);
  ok++;
}
console.log(`Mapped ${ok}/${map.length} images.`);
