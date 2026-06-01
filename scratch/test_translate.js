import { translate } from '@vitalets/google-translate-api';

async function test() {
  try {
    const res = await translate('State Bank of India', { to: 'or' });
    console.log(res.text);
  } catch (e) {
    console.error(e);
  }
}
test();
