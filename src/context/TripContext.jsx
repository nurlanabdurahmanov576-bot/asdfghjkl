import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialTripsData } from '../data/trips';
import { destinationsData } from '../data/destinations';
import { placesData } from '../data/places';
import { hotelsData } from '../data/hotels';
import { restaurantsData } from '../data/restaurants';

const TripContext = createContext(null);

const STORAGE_KEY_TRIPS = 'triply_trips_v1';
const STORAGE_KEY_ACTIVE_ID = 'triply_active_trip_id_v1';
const STORAGE_KEY_USER = 'triply_user_v1';
const STORAGE_KEY_FAVORITES = 'triply_favorites_v1';
const STORAGE_KEY_NOTIFICATIONS = 'triply_notifications_v1';

const defaultUser = {
  name: 'Alexandre Mercer',
  email: 'alex.mercer@triply.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  tripsCompleted: 14,
  countriesVisited: 19,
  favoriteDestination: 'Tokyo, Japan',
  bio: 'Passionate globetrotter, design enthusiast & culture hunter. Seeking hidden alleys and the best espresso in every continent.'
};

const defaultNotifications = [
  {
    id: 'notif-1',
    title: 'Tokyo Adventure Itinerary Ready',
    message: 'Your day 1 arrival and hotel check-in has been synchronized.',
    time: '10m ago',
    read: false,
    type: 'trip'
  },
  {
    id: 'notif-2',
    title: 'Flight Price Drop Alert',
    message: 'Paris direct tickets dropped by $140 for November dates!',
    time: '2h ago',
    read: false,
    type: 'deal'
  },
  {
    id: 'notif-3',
    title: 'Welcome to Triply!',
    message: 'Create trips, explore curated attractions, and budget smartly with AI assistance.',
    time: '1d ago',
    read: true,
    type: 'system'
  }
];

export function TripProvider({ children }) {
  // Trips state
  const [trips, setTrips] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRIPS);
      return saved ? JSON.parse(saved) : initialTripsData;
    } catch {
      return initialTripsData;
    }
  });

  // Active Trip ID
  const [activeTripId, setActiveTripId] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
      return saved || (initialTripsData[0]?.id || 'trip-tokyo-adventure');
    } catch {
      return initialTripsData[0]?.id || 'trip-tokyo-adventure';
    }
  });

  // User Profile
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : defaultUser;
    } catch {
      return defaultUser;
    }
  });

  // Authenticated state
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Favorites
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAVORITES);
      return saved ? JSON.parse(saved) : ['tokyo', 'paris', 'place-tokyo-1', 'hotel-tokyo-1'];
    } catch {
      return ['tokyo', 'paris', 'place-tokyo-1', 'hotel-tokyo-1'];
    }
  });

  // Notifications
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
      return saved ? JSON.parse(saved) : defaultNotifications;
    } catch {
      return defaultNotifications;
    }
  });

  // Toast message
  const [toast, setToast] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activeTripId);
  }, [activeTripId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Show Toast
  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  // Active Trip Helper
  const currentTrip = trips.find(t => t.id === activeTripId) || trips[0] || null;

  // Toggle favorite
  const toggleFavorite = (id, label) => {
    setFavorites(prev => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter(item => item !== id) : [...prev, id];
      showToast(exists ? `Removed ${label || 'item'} from favorites` : `Saved ${label || 'item'} to favorites!`, 'info');
      return updated;
    });
  };

  // Create new trip
  const createTrip = ({ title, destination, startDate, endDate, travelers, budget, coverImage }) => {
    const destMatch = destinationsData.find(d => d.name.toLowerCase() === (destination || '').toLowerCase());
    const startD = startDate || new Date().toISOString().split('T')[0];
    const endD = endDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

    // Format dates display
    const formatDateShort = (dStr) => {
      try {
        const d = new Date(dStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } catch {
        return dStr;
      }
    };

    const datesDisplay = `${formatDateShort(startD)} — ${formatDateShort(endD)}`;
    const newTripId = `trip-${Date.now()}`;
    const newTrip = {
      id: newTripId,
      title: title || `${destination} Getaway`,
      destination: destination || 'Tokyo',
      country: destMatch ? destMatch.country : 'World',
      destinationId: destMatch ? destMatch.id : 'tokyo',
      startDate: startD,
      endDate: endD,
      datesDisplay,
      travelers: Number(travelers) || 1,
      travelersDisplay: `${travelers || 1} ${Number(travelers) === 1 ? 'Traveler' : 'Travelers'}`,
      budget: Number(budget) || 2000,
      coverImage: coverImage || destMatch?.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      status: 'Upcoming',
      itinerary: [
        {
          dayNumber: 1,
          title: `Arrival in ${destination}`,
          date: startD,
          activities: [
            {
              id: `act-${Date.now()}-1`,
              time: '11:00',
              title: `Arrival and Check-in`,
              category: 'Hotel',
              location: destination,
              notes: 'Arrive at accommodation, unpack and settle in',
              cost: 150,
              coordinates: destMatch ? destMatch.coordinates : { lat: 35.6762, lng: 139.6503 }
            },
            {
              id: `act-${Date.now()}-2`,
              time: '13:30',
              title: 'Welcome Lunch & City Walk',
              category: 'Food',
              location: destination,
              notes: 'Stroll around the central district and discover local flavors',
              cost: 35,
              coordinates: destMatch ? destMatch.coordinates : { lat: 35.6762, lng: 139.6503 }
            }
          ]
        },
        {
          dayNumber: 2,
          title: 'City Exploration & Highlights',
          date: endD,
          activities: []
        }
      ],
      expenses: [
        {
          id: `exp-${Date.now()}-1`,
          category: 'Hotels',
          title: 'Initial accommodation deposit',
          amount: 150,
          date: startD
        }
      ]
    };

    setTrips(prev => [newTrip, ...prev]);
    setActiveTripId(newTripId);
    showToast(`Trip to ${destination} created successfully!`);

    // Add notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `Trip Created: ${newTrip.title}`,
        message: `Plan your itinerary, hotel stays, and budget for ${destination}.`,
        time: 'Just now',
        read: false,
        type: 'trip'
      },
      ...prev
    ]);

    return newTripId;
  };

  // Update Trip info (e.g. title, budget, travelers, dates)
  const updateTrip = (tripId, updatedFields) => {
    setTrips(prev => prev.map(trip => {
      if (trip.id === tripId) {
        return { ...trip, ...updatedFields };
      }
      return trip;
    }));
    showToast('Trip updated successfully!');
  };

  // Delete Trip
  const deleteTrip = (tripId) => {
    setTrips(prev => {
      const remaining = prev.filter(t => t.id !== tripId);
      if (activeTripId === tripId && remaining.length > 0) {
        setActiveTripId(remaining[0].id);
      }
      return remaining;
    });
    showToast('Trip deleted.', 'info');
  };

  // Add Activity to Day
  const addActivity = (tripId, dayNumber, activityData) => {
    setTrips(prev => prev.map(trip => {
      if (trip.id !== tripId) return trip;

      let itinerary = [...trip.itinerary];
      // ensure day exists
      let dayIndex = itinerary.findIndex(d => d.dayNumber === Number(dayNumber));
      if (dayIndex === -1) {
        itinerary.push({
          dayNumber: Number(dayNumber),
          title: `Day ${dayNumber}`,
          date: trip.startDate,
          activities: []
        });
        itinerary.sort((a, b) => a.dayNumber - b.dayNumber);
        dayIndex = itinerary.findIndex(d => d.dayNumber === Number(dayNumber));
      }

      const newAct = {
        id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        time: activityData.time || '10:00',
        title: activityData.title || 'New Activity',
        category: activityData.category || 'Activities',
        location: activityData.location || trip.destination,
        notes: activityData.notes || '',
        cost: Number(activityData.cost) || 0,
        coordinates: activityData.coordinates || null
      };

      const updatedDay = {
        ...itinerary[dayIndex],
        activities: [...itinerary[dayIndex].activities, newAct].sort((a, b) => (a.time || '').localeCompare(b.time || ''))
      };

      itinerary[dayIndex] = updatedDay;

      // also if activity has a cost > 0, log it in expenses if wanted
      let updatedExpenses = trip.expenses || [];
      if (newAct.cost > 0) {
        updatedExpenses = [
          ...updatedExpenses,
          {
            id: `exp-${Date.now()}`,
            category: newAct.category === 'Hotel' ? 'Hotels' : (newAct.category === 'Food' ? 'Food' : 'Activities'),
            title: newAct.title,
            amount: newAct.cost,
            date: itinerary[dayIndex].date || trip.startDate
          }
        ];
      }

      return { ...trip, itinerary, expenses: updatedExpenses };
    }));

    showToast(`Added "${activityData.title}" to Day ${dayNumber}!`);
  };

  // Edit Activity
  const updateActivity = (tripId, dayNumber, activityId, updatedData) => {
    setTrips(prev => prev.map(trip => {
      if (trip.id !== tripId) return trip;

      const itinerary = trip.itinerary.map(day => {
        if (day.dayNumber === Number(dayNumber)) {
          return {
            ...day,
            activities: day.activities.map(act => {
              if (act.id === activityId) {
                return { ...act, ...updatedData };
              }
              return act;
            }).sort((a, b) => (a.time || '').localeCompare(b.time || ''))
          };
        }
        return day;
      });

      return { ...trip, itinerary };
    }));

    showToast('Activity updated successfully!');
  };

  // Delete Activity
  const deleteActivity = (tripId, dayNumber, activityId) => {
    setTrips(prev => prev.map(trip => {
      if (trip.id !== tripId) return trip;

      const itinerary = trip.itinerary.map(day => {
        if (day.dayNumber === Number(dayNumber)) {
          return {
            ...day,
            activities: day.activities.filter(act => act.id !== activityId)
          };
        }
        return day;
      });

      return { ...trip, itinerary };
    }));

    showToast('Activity removed.', 'info');
  };

  // Add Day to Itinerary
  const addDay = (tripId) => {
    setTrips(prev => prev.map(trip => {
      if (trip.id !== tripId) return trip;
      const nextDayNum = (trip.itinerary?.length || 0) + 1;
      const newDay = {
        dayNumber: nextDayNum,
        title: `Day ${nextDayNum} - Explore More`,
        date: trip.startDate,
        activities: []
      };
      return {
        ...trip,
        itinerary: [...(trip.itinerary || []), newDay]
      };
    }));
    showToast('New day added to itinerary!');
  };

  // Add Expense
  const addExpense = (tripId, expense) => {
    setTrips(prev => prev.map(trip => {
      if (trip.id !== tripId) return trip;
      const newExp = {
        id: `exp-${Date.now()}`,
        category: expense.category || 'Other',
        title: expense.title || 'Expense',
        amount: Number(expense.amount) || 0,
        date: expense.date || new Date().toISOString().split('T')[0]
      };
      return {
        ...trip,
        expenses: [newExp, ...(trip.expenses || [])]
      };
    }));
    showToast(`Added expense: $${expense.amount} (${expense.category})`);
  };

  // Delete Expense
  const deleteExpense = (tripId, expenseId) => {
    setTrips(prev => prev.map(trip => {
      if (trip.id !== tripId) return trip;
      return {
        ...trip,
        expenses: (trip.expenses || []).filter(e => e.id !== expenseId)
      };
    }));
    showToast('Expense removed.');
  };

  // Quick Add Place to Itinerary
  const addPlaceToTrip = (place, dayNumber = 1) => {
    if (!currentTrip) {
      showToast('Please create or select a trip first!', 'error');
      return;
    }
    addActivity(currentTrip.id, dayNumber, {
      title: place.name,
      time: '14:00',
      category: 'Activities',
      location: place.city || currentTrip.destination,
      notes: `${place.description} (${place.hours})`,
      cost: place.numericPrice || 0,
      coordinates: place.coordinates
    });
  };

  // Quick Add Hotel to Itinerary & Budget
  const addHotelToTrip = (hotel, dayNumber = 1) => {
    if (!currentTrip) {
      showToast('Please create or select a trip first!', 'error');
      return;
    }
    addActivity(currentTrip.id, dayNumber, {
      title: `Hotel Check-in: ${hotel.name}`,
      time: '14:00',
      category: 'Hotel',
      location: `${hotel.location}, ${hotel.city}`,
      notes: `${hotel.stars}★ ${hotel.type} - $${hotel.pricePerNight}/night. Amenities: ${hotel.amenities.join(', ')}`,
      cost: hotel.pricePerNight,
      coordinates: hotel.coordinates
    });
  };

  // Quick Add Restaurant to Itinerary & Budget
  const addRestaurantToTrip = (restaurant, dayNumber = 1) => {
    if (!currentTrip) {
      showToast('Please create or select a trip first!', 'error');
      return;
    }
    addActivity(currentTrip.id, dayNumber, {
      title: `Dining at ${restaurant.name}`,
      time: '19:30',
      category: 'Food',
      location: `${restaurant.location}, ${restaurant.city}`,
      notes: `${restaurant.cuisine} cuisine • ${restaurant.specialty} • ${restaurant.priceDisplay}`,
      cost: restaurant.avgPrice || 30,
      coordinates: restaurant.coordinates
    });
  };

  // Mark all notifications read
  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Update user profile
  const updateUserProfile = (newFields) => {
    setUser(prev => ({ ...prev, ...newFields }));
    showToast('Profile saved successfully!');
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        activeTripId,
        setActiveTripId,
        currentTrip,
        createTrip,
        updateTrip,
        deleteTrip,
        addActivity,
        updateActivity,
        deleteActivity,
        addDay,
        addExpense,
        deleteExpense,
        addPlaceToTrip,
        addHotelToTrip,
        addRestaurantToTrip,
        destinations: destinationsData,
        places: placesData,
        hotels: hotelsData,
        restaurants: restaurantsData,
        user,
        updateUserProfile,
        isAuthenticated,
        setIsAuthenticated,
        favorites,
        toggleFavorite,
        notifications,
        markNotificationsRead,
        toast,
        showToast
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTrips must be used within TripProvider');
  return ctx;
}
