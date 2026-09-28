// Справочник ключевых аэропортов для городов и регионов
export const AIRPORTS = [
  {
    city: 'Сочи',
    airportName: 'Международный аэропорт Сочи (Адлер)',
    iata: 'AER',
    lat: 43.4499,
    lng: 39.9566,
    region: 'Краснодарский край',
    transferCostBase: 1400, // базовая цена трансфера в рублях
    taxiRatePerKm: 35
  },
  {
    city: 'Санкт-Петербург',
    airportName: 'Аэропорт Пулково',
    iata: 'LED',
    lat: 59.8003,
    lng: 30.2625,
    region: 'Ленинградская область',
    transferCostBase: 1200,
    taxiRatePerKm: 32
  },
  {
    city: 'Москва',
    airportName: 'Международный аэропорт Шереметьево',
    iata: 'SVO',
    lat: 55.9726,
    lng: 37.4146,
    region: 'Московская область',
    transferCostBase: 1500,
    taxiRatePerKm: 35
  },
  {
    city: 'Казань',
    airportName: 'Международный аэропорт Казань им. Тукая',
    iata: 'KZN',
    lat: 55.6062,
    lng: 49.2787,
    region: 'Республика Татарстан',
    transferCostBase: 900,
    taxiRatePerKm: 28
  },
  {
    city: 'Калининград',
    airportName: 'Аэропорт Храброво',
    iata: 'KGD',
    lat: 54.8900,
    lng: 20.5926,
    region: 'Калининградская область',
    transferCostBase: 950,
    taxiRatePerKm: 30
  },
  {
    city: 'Горно-Алтайск',
    airportName: 'Аэропорт Горно-Алтайск',
    iata: 'RGK',
    lat: 51.9686,
    lng: 85.8364,
    region: 'Республика Алтай',
    transferCostBase: 1600,
    taxiRatePerKm: 40
  },
  {
    city: 'Иркутск',
    airportName: 'Международный аэропорт Иркутск (Байкал)',
    iata: 'IKT',
    lat: 52.2680,
    lng: 104.3889,
    region: 'Иркутская область / Байкал',
    transferCostBase: 1200,
    taxiRatePerKm: 35
  },
  {
    city: 'Минеральные Воды',
    airportName: 'Международный аэропорт Минеральные Воды',
    iata: 'MRV',
    lat: 44.2251,
    lng: 43.0819,
    region: 'Ставропольский край / КМВ',
    transferCostBase: 1100,
    taxiRatePerKm: 30
  },
  {
    city: 'Кисловодск',
    airportName: 'Аэропорт Минводы (ближайший к Кисловодску)',
    iata: 'MRV',
    lat: 44.2251,
    lng: 43.0819,
    region: 'КМВ',
    transferCostBase: 1300,
    taxiRatePerKm: 32
  },
  {
    city: 'Петрозаводск',
    airportName: 'Аэропорт Петрозаводск (Бесовец)',
    iata: 'PES',
    lat: 61.8856,
    lng: 34.1553,
    region: 'Республика Карелия',
    transferCostBase: 1000,
    taxiRatePerKm: 32
  },
  {
    city: 'Сортавала',
    airportName: 'Аэропорт Пулково (Санкт-Петербург) / Бесовец',
    iata: 'LED/PES',
    lat: 61.8856,
    lng: 34.1553,
    region: 'Карелия',
    transferCostBase: 2500,
    taxiRatePerKm: 35
  },
  {
    city: 'Владивосток',
    airportName: 'Международный аэропорт Владивосток (Кневичи)',
    iata: 'VVO',
    lat: 43.3990,
    lng: 132.1480,
    region: 'Приморский край',
    transferCostBase: 1400,
    taxiRatePerKm: 35
  },
  {
    city: 'Екатеринбург',
    airportName: 'Международный аэропорт Кольцово',
    iata: 'SVX',
    lat: 56.7431,
    lng: 60.8027,
    region: 'Свердловская область / Урал',
    transferCostBase: 1100,
    taxiRatePerKm: 30
  },
  {
    city: 'Новосибирск',
    airportName: 'Международный аэропорт Толмачёво',
    iata: 'OVB',
    lat: 55.0126,
    lng: 82.6507,
    region: 'Новосибирская область',
    transferCostBase: 1200,
    taxiRatePerKm: 30
  },
  {
    city: 'Нижний Новгород',
    airportName: 'Международный аэропорт Чкалов',
    iata: 'GOJ',
    lat: 56.2300,
    lng: 43.7842,
    region: 'Нижегородская область',
    transferCostBase: 1000,
    taxiRatePerKm: 28
  }
];

// Функция расчёта расстояния между двумя координатами по формуле гаверсинусов (в км)
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; // Радиус Земли в км
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Определение времени в пути на авто по расстоянию
export function getEstimatedDriveTime(distanceKm) {
  if (distanceKm <= 5) return '10–15 минут';
  if (distanceKm <= 20) return '25–35 минут';
  if (distanceKm <= 40) return '45–55 минут';
  if (distanceKm <= 70) return '1 час 15 минут';
  if (distanceKm <= 120) return '1 час 45 минут';
  const hours = Math.floor(distanceKm / 60);
  const minutes = Math.round((distanceKm % 60) / 10) * 10;
  return `~${hours} ч ${minutes > 0 ? minutes + ' мин' : ''}`;
}

// Поиск ближайшего аэропорта для места
export function getNearestAirportForPlace(place) {
  if (!place) return AIRPORTS[0];

  // 1. Попытка точного совпадения по названию города
  const cityMatch = AIRPORTS.find(
    a => a.city.toLowerCase() === place.city.toLowerCase()
  );
  if (cityMatch) {
    const distanceKm = calculateDistanceKm(place.lat, place.lng, cityMatch.lat, cityMatch.lng);
    return {
      ...cityMatch,
      distanceKm: Math.max(12, distanceKm),
      driveTime: getEstimatedDriveTime(Math.max(12, distanceKm))
    };
  }

  // 2. Если город не совпал напрямую — ищем ближайший по географическим координатам
  let closest = AIRPORTS[0];
  let minDistance = Infinity;

  for (const airport of AIRPORTS) {
    const dist = calculateDistanceKm(place.lat, place.lng, airport.lat, airport.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = airport;
    }
  }

  return {
    ...closest,
    distanceKm: Math.max(15, minDistance),
    driveTime: getEstimatedDriveTime(Math.max(15, minDistance))
  };
}
