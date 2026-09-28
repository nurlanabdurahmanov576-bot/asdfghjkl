import { useState, useMemo } from 'react';
import { getNearestAirportForPlace } from '../data/airports';
import * as storage from '../lib/storage';

export function useTripSummary(place, initialBudget = null) {
  const airport = useMemo(() => getNearestAirportForPlace(place), [place]);

  const [guests, setGuests] = useState(2);
  const [days, setDays] = useState(2);
  const [hasOvernight, setHasOvernight] = useState(place?.hasOvernight ?? false);

  // Категории расходов с редактируемыми значениями
  const defaultRoadCost = useMemo(() => {
    if (!airport) return 3000;
    const transfer = airport.transferCostBase + (airport.distanceKm * airport.taxiRatePerKm);
    return Math.round(transfer);
  }, [airport]);

  const defaultServiceCost = useMemo(() => {
    return (place?.price || 3000) * guests;
  }, [place, guests]);

  const defaultFoodCost = useMemo(() => {
    const daily = place?.foodCostPerDay || 2500;
    return daily * days * guests;
  }, [place, days, guests]);

  const defaultStayCost = useMemo(() => {
    if (!hasOvernight) return 0;
    const nights = Math.max(1, days - 1);
    // если в цене места уже включена ночь (загородный клуб/отель)
    return (place?.price || 6000) * nights;
  }, [hasOvernight, days, place]);

  const defaultExtraCost = useMemo(() => {
    return 1500 * guests;
  }, [guests]);

  // Пользовательские редактируемые значения
  const [roadCost, setRoadCost] = useState(defaultRoadCost);
  const [serviceCost, setServiceCost] = useState(defaultServiceCost);
  const [foodCost, setFoodCost] = useState(defaultFoodCost);
  const [stayCost, setStayCost] = useState(defaultStayCost);
  const [extraCost, setExtraCost] = useState(defaultExtraCost);

  // Бюджет пользователя
  const [userBudget, setUserBudget] = useState(
    initialBudget ? Number(initialBudget) : (place?.recommendedBudget || 25000)
  );

  // Итоговая сумма
  const totalCost = useMemo(() => {
    return (Number(roadCost) || 0) +
      (Number(serviceCost) || 0) +
      (Number(foodCost) || 0) +
      (hasOvernight ? (Number(stayCost) || 0) : 0) +
      (Number(extraCost) || 0);
  }, [roadCost, serviceCost, foodCost, stayCost, extraCost, hasOvernight]);

  // Процент от бюджета
  const budgetPercent = useMemo(() => {
    if (!userBudget || userBudget <= 0) return 100;
    return Math.min(200, Math.round((totalCost / userBudget) * 100));
  }, [totalCost, userBudget]);

  // Статус и вердикт
  const budgetVerdict = useMemo(() => {
    const diff = userBudget - totalCost;

    if (totalCost <= userBudget * 0.89) {
      return {
        status: 'under', // зелёный
        color: 'text-emerald-700',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        barColor: 'bg-emerald-500',
        badge: 'Бюджета хватает',
        difference: diff,
        message: `Отлично! Бюджета хватает с запасом, свободный остаток составит ~${diff.toLocaleString('ru-RU')} ₽.`
      };
    } else if (totalCost <= userBudget) {
      return {
        status: 'warning', // жёлтый (90-100%)
        color: 'text-amber-800',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        barColor: 'bg-amber-500',
        badge: 'Бюджет впритык',
        difference: diff,
        message: `Внимание: бюджет почти на пределе (${budgetPercent}%). Свободный резерв: ~${diff.toLocaleString('ru-RU')} ₽.`
      };
    } else {
      const deficit = Math.abs(diff);
      return {
        status: 'over', // красный (>100%)
        color: 'text-rose-700',
        bgColor: 'bg-rose-50',
        borderColor: 'border-rose-200',
        barColor: 'bg-rose-500',
        badge: 'Превышение бюджета',
        difference: diff,
        deficit,
        message: `Бюджета не хватает, нужно ещё ~${deficit.toLocaleString('ru-RU')} ₽.`,
        tip: 'Попробуйте место подешевле в этой категории или уменьшите расходы на допуслуги/проживание.'
      };
    }
  }, [totalCost, userBudget, budgetPercent]);

  // Сохранить поездку в профиль
  const saveTripToHistory = () => {
    if (!place) return null;

    const tripData = {
      placeId: place.id,
      placeTitle: place.title,
      placeCity: place.city,
      placeImage: place.images[0],
      guests,
      days,
      hasOvernight,
      budgetLimit: userBudget,
      totalCost,
      budgetStatus: budgetVerdict.status,
      difference: budgetVerdict.difference,
      breakdown: {
        road: Number(roadCost),
        service: Number(serviceCost),
        food: Number(foodCost),
        stay: hasOvernight ? Number(stayCost) : 0,
        extra: Number(extraCost)
      },
      nearestAirport: `${airport.airportName} (${airport.iata})`,
      airportDistanceKm: airport.distanceKm,
      driveTime: airport.driveTime
    };

    return storage.saveTrip(tripData);
  };

  return {
    airport,
    guests,
    setGuests,
    days,
    setDays,
    hasOvernight,
    setHasOvernight,
    userBudget,
    setUserBudget,
    costs: {
      road: roadCost,
      setRoad: setRoadCost,
      service: serviceCost,
      setService: setServiceCost,
      food: foodCost,
      setFood: setFoodCost,
      stay: stayCost,
      setStay: setStayCost,
      extra: extraCost,
      setExtra: setExtraCost,
    },
    totalCost,
    budgetPercent,
    budgetVerdict,
    saveTripToHistory
  };
}
