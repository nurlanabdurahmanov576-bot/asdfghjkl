// Currency exchange rates relative to 1 USD
export const currencies = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar (Доллар США)', rate: 1.0, flag: '🇺🇸' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro (Евро)', rate: 0.92, flag: '🇪🇺' },
  RUB: { code: 'RUB', symbol: '₽', name: 'Russian Ruble (Российский рубль)', rate: 91.5, flag: '🇷🇺' },
  UZS: { code: 'UZS', symbol: 'soʻm', name: 'Uzbek Som (Узбекский сум)', rate: 12750.0, flag: '🇺🇿' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen (Японская иена)', rate: 154.5, flag: '🇯🇵' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound (Фунт стерлингов)', rate: 0.78, flag: '🇬🇧' },
  AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham (Дирхам ОАЭ)', rate: 3.67, flag: '🇦🇪' },
  TRY: { code: 'TRY', symbol: '₺', name: 'Turkish Lira (Турецкая лира)', rate: 34.2, flag: '🇹🇷' },
  KZT: { code: 'KZT', symbol: '₸', name: 'Kazakhstani Tenge (Казахстанский тенге)', rate: 485.0, flag: '🇰🇿' },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan (Китайский юань)', rate: 7.24, flag: '🇨🇳' }
};

export const currencyList = Object.values(currencies);

/**
 * Converts an amount from USD to a target currency code
 */
export function convertFromUSD(amountUSD, targetCurrencyCode = 'USD') {
  const numeric = Number(amountUSD) || 0;
  const target = currencies[targetCurrencyCode] || currencies.USD;
  return numeric * target.rate;
}

/**
 * Converts an amount between any two currency codes
 */
export function convertCurrency(amount, fromCode = 'USD', toCode = 'USD') {
  const numeric = Number(amount) || 0;
  const from = currencies[fromCode] || currencies.USD;
  const to = currencies[toCode] || currencies.USD;
  // Convert from source currency to USD, then to target currency
  const inUSD = numeric / from.rate;
  return inUSD * to.rate;
}

/**
 * Formats a USD amount nicely with target currency symbol and proper number formatting
 */
export function formatCurrencyAmount(amountUSD, targetCurrencyCode = 'USD') {
  const numeric = Number(amountUSD) || 0;
  const target = currencies[targetCurrencyCode] || currencies.USD;
  const converted = numeric * target.rate;

  // Format decimal places based on magnitude
  let formattedNumber;
  if (target.rate >= 1000) {
    // For large numbers like UZS or JPY, format as whole rounded thousands
    formattedNumber = Math.round(converted).toLocaleString();
  } else if (target.rate >= 50) {
    formattedNumber = Math.round(converted).toLocaleString();
  } else {
    // For currencies like EUR, USD, GBP, show 2 decimal places if needed or integer
    formattedNumber = converted.toLocaleString(undefined, {
      minimumFractionDigits: converted % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2
    });
  }

  // Symbol placement
  if (targetCurrencyCode === 'UZS') {
    return `${formattedNumber} ${target.symbol}`;
  } else if (targetCurrencyCode === 'RUB') {
    return `${formattedNumber} ${target.symbol}`;
  } else {
    return `${target.symbol}${formattedNumber}`;
  }
}
