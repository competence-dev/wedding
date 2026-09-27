const drinkNames = { wine: 'Вино', vodka: 'Водка', cognac: 'Коньяк', non_alcoholic: 'Не пью' };
export function buildRsvpMessage(data) {
  const attending = data.attendance === 'attending';
  return [
    'Ответ на приглашение — Руслан и Амалия, 24 октября 2026',
    `Имя: ${data.name.trim()}`,
    `Присутствие: ${attending ? 'С радостью приду!' : 'К сожалению, не смогу'}`,
    ...(attending ? [`Ночёвка: ${data.overnight === 'yes' ? 'Останемся на ночь' : 'Уедем вечером'}`, `Вечерний трансфер: ${data.transfer === 'yes' ? 'Нужен' : 'Не нужен'}`, `Напитки: ${data.drinks.map(d => drinkNames[d]).join(', ') || 'Не указаны'}`] : []),
    ...(data.wishes.trim() ? [`Пожелания / музыка: ${data.wishes.trim()}`] : []),
  ].join('\n');
}
export function telegramRsvpUrl(data) {
  return `https://t.me/u_amaliya?text=${encodeURIComponent(buildRsvpMessage(data))}`;
}
