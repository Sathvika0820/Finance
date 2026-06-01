import { BANKS } from '../src/data/banks';
import * as fs from 'fs';

const ids = BANKS.map(b => b.id);
fs.writeFileSync('bank_ids.txt', ids.join(', '));
