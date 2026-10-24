import { SHLOKAS } from '../src/data/shlokas';
import { PADACHHEDA_DATA } from '../src/data/padachhedaData';

console.log('Total shlokas:', SHLOKAS.length);

const s1 = SHLOKAS[0];
console.log('Shloka 1 Sanskrit:', s1.sanskritGujarati);
console.log('Shloka 1 Padachheda:', PADACHHEDA_DATA[1]?.slice(0, 3));
