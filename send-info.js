const { sendInfoPanel } = require('./index.js');

// Укажи ID канала куда отправить информацию
const CHANNEL_ID = process.env.INFO_CHANNEL_ID || 'YOUR_CHANNEL_ID';

console.log(`📤 Отправляю информационную панель в канал ${CHANNEL_ID}...`);

setTimeout(() => {
  sendInfoPanel(CHANNEL_ID).then(() => {
    console.log('✅ Информационная панель успешно отправлена!');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Ошибка при отправке:', error);
    process.exit(1);
  });
}, 2000);
