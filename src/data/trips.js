export const initialTripsData = [
  {
    id: 'trip-tokyo-adventure',
    title: 'Tokyo Adventure',
    destination: 'Tokyo',
    country: 'Japan',
    destinationId: 'tokyo',
    startDate: '2026-10-12',
    endDate: '2026-10-20',
    datesDisplay: 'Oct 12 — Oct 20',
    travelers: 2,
    travelersDisplay: '2 Travelers',
    budget: 2500,
    coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    status: 'Upcoming',
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Tokyo',
        date: '2026-10-12',
        activities: [
          {
            id: 'act-1-1',
            time: '09:00',
            title: 'Arrival at Haneda Airport (HND)',
            category: 'Transport',
            location: 'Haneda International Terminal',
            notes: 'Pick up pocket WiFi and Suica IC card at the arrivals hall',
            cost: 30,
            coordinates: { lat: 35.5494, lng: 139.7798 }
          },
          {
            id: 'act-1-2',
            time: '11:00',
            title: 'Hotel check-in at Cerulean Tower',
            category: 'Hotel',
            location: 'Shibuya, Tokyo',
            notes: 'Leave luggage and freshen up before heading out',
            cost: 290,
            coordinates: { lat: 35.6560, lng: 139.6998 }
          },
          {
            id: 'act-1-3',
            time: '13:00',
            title: 'Authentic Lunch at Ichiran',
            category: 'Food',
            location: 'Shibuya Center-gai',
            notes: 'Famous rich Tonkotsu ramen with custom noodles',
            cost: 32,
            coordinates: { lat: 35.6612, lng: 139.6995 }
          },
          {
            id: 'act-1-4',
            time: '15:00',
            title: 'Visit Shibuya & Shibuya Sky',
            category: 'Activities',
            location: 'Shibuya Crossing',
            notes: 'Witness the scramble crossing and panoramic skyline rooftop',
            cost: 44,
            coordinates: { lat: 35.6595, lng: 139.7005 }
          },
          {
            id: 'act-1-5',
            time: '19:00',
            title: 'Dinner at Ristorante Aso',
            category: 'Food',
            location: 'Daikanyama',
            notes: 'Romantic garden dinner with artisanal pasta',
            cost: 150,
            coordinates: { lat: 35.6496, lng: 139.7029 }
          }
        ]
      },
      {
        dayNumber: 2,
        title: 'Tokyo Exploration',
        date: '2026-10-13',
        activities: [
          {
            id: 'act-2-1',
            time: '09:00',
            title: 'Senso-ji Temple & Nakamise Dori',
            category: 'Activities',
            location: 'Asakusa',
            notes: 'Tokyo oldest temple, try melon-pan and matcha soft serve',
            cost: 0,
            coordinates: { lat: 35.7148, lng: 139.7967 }
          },
          {
            id: 'act-2-2',
            time: '12:00',
            title: 'Lunch at Asakusa Soba Bar',
            category: 'Food',
            location: 'Asakusa',
            notes: 'Fresh handmade buckwheat noodles and tempura',
            cost: 38,
            coordinates: { lat: 35.7130, lng: 139.7950 }
          },
          {
            id: 'act-2-3',
            time: '14:00',
            title: 'Tokyo Skytree Observatory',
            category: 'Activities',
            location: 'Oshiage',
            notes: 'Highest deck with breathtaking panorama of Kanto plain',
            cost: 48,
            coordinates: { lat: 35.7100, lng: 139.8107 }
          },
          {
            id: 'act-2-4',
            time: '18:00',
            title: 'Shibuya Crossing at Dusk & Shopping',
            category: 'Shopping',
            location: 'Shibuya Scramble',
            notes: 'Explore Shibuya PARCO and mega stores',
            cost: 110,
            coordinates: { lat: 35.6595, lng: 139.7005 }
          }
        ]
      },
      {
        dayNumber: 3,
        title: 'Art, Shrines & Modern Tokyo',
        date: '2026-10-14',
        activities: [
          {
            id: 'act-3-1',
            time: '10:00',
            title: 'Meiji Jingu Shrine & Yoyogi Park',
            category: 'Activities',
            location: 'Harajuku',
            notes: 'Tranquil walk among towering sacred cedar trees',
            cost: 0,
            coordinates: { lat: 35.6764, lng: 139.6993 }
          },
          {
            id: 'act-3-2',
            time: '13:00',
            title: 'Lunch at Smokehouse Harajuku',
            category: 'Food',
            location: 'Omotesando',
            notes: 'Craft barbecue & artisanal iced tea',
            cost: 45,
            coordinates: { lat: 35.6669, lng: 139.7071 }
          },
          {
            id: 'act-3-3',
            time: '16:00',
            title: 'teamLab Planets Tokyo Digital Museum',
            category: 'Activities',
            location: 'Toyosu',
            notes: 'Mesmerizing walk through water and floating flower gardens',
            cost: 64,
            coordinates: { lat: 35.6491, lng: 139.7898 }
          },
          {
            id: 'act-3-4',
            time: '20:00',
            title: 'Sushi Dinner at Sukiyabashi Jiro Ginza',
            category: 'Food',
            location: 'Ginza',
            notes: 'Unforgettable Edomae sushi experience',
            cost: 360,
            coordinates: { lat: 35.6719, lng: 139.7645 }
          }
        ]
      }
    ],
    expenses: [
      { id: 'exp-1', category: 'Flights', title: 'Roundtrip Flights (2 tickets)', amount: 680, date: '2026-09-10' },
      { id: 'exp-2', category: 'Hotels', title: 'Cerulean Tower 3 Nights', amount: 580, date: '2026-09-12' },
      { id: 'exp-3', category: 'Food', title: 'Ramen, Dinners & Cafes', amount: 260, date: '2026-10-12' },
      { id: 'exp-4', category: 'Activities', title: 'Skytree & teamLab tickets', amount: 120, date: '2026-10-13' },
      { id: 'exp-5', category: 'Transport', title: 'JR Pass & Suica IC reload', amount: 110, date: '2026-10-12' },
      { id: 'exp-6', category: 'Shopping', title: 'Souvenirs in Shibuya', amount: 90, date: '2026-10-14' }
    ]
  },
  {
    id: 'trip-paris-lights',
    title: 'Parisian Getaway',
    destination: 'Paris',
    country: 'France',
    destinationId: 'paris',
    startDate: '2026-11-03',
    endDate: '2026-11-09',
    datesDisplay: 'Nov 03 — Nov 09',
    travelers: 2,
    travelersDisplay: '2 Travelers',
    budget: 3200,
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    status: 'Planning',
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Paris & Seine Walk',
        date: '2026-11-03',
        activities: [
          {
            id: 'act-p1',
            time: '11:00',
            title: 'Check-in at Hotel Plaza Athénée',
            category: 'Hotel',
            location: 'Champs-Élysées',
            notes: 'Unpack and enjoy terrace cafe',
            cost: 680,
            coordinates: { lat: 48.8661, lng: 2.3045 }
          },
          {
            id: 'act-p2',
            time: '15:00',
            title: 'Eiffel Tower Sunset Experience',
            category: 'Activities',
            location: 'Champ de Mars',
            notes: 'Elevator to summit & champagne toast',
            cost: 60,
            coordinates: { lat: 48.8584, lng: 2.2945 }
          }
        ]
      }
    ],
    expenses: [
      { id: 'exp-p1', category: 'Flights', title: 'Air France direct', amount: 840, date: '2026-10-01' },
      { id: 'exp-p2', category: 'Hotels', title: 'Hotel reservation deposit', amount: 680, date: '2026-10-05' },
      { id: 'exp-p3', category: 'Activities', title: 'Louvre & Eiffel museum passes', amount: 80, date: '2026-10-10' }
    ]
  },
  {
    id: 'trip-dubai-escape',
    title: 'Dubai Glamour & Dunes',
    destination: 'Dubai',
    country: 'United Arab Emirates',
    destinationId: 'dubai',
    startDate: '2026-12-15',
    endDate: '2026-12-22',
    datesDisplay: 'Dec 15 — Dec 22',
    travelers: 1,
    travelersDisplay: '1 Traveler',
    budget: 2800,
    coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    status: 'Booked',
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival & Downtown Wonder',
        date: '2026-12-15',
        activities: [
          {
            id: 'act-d1',
            time: '14:00',
            title: 'Check-in at Atlantis The Royal',
            category: 'Hotel',
            location: 'Palm Jumeirah',
            notes: 'Infinity pool relaxation',
            cost: 550,
            coordinates: { lat: 25.1384, lng: 55.1264 }
          },
          {
            id: 'act-d2',
            time: '18:30',
            title: 'Burj Khalifa Top Floor & Fountain Show',
            category: 'Activities',
            location: 'Downtown Dubai',
            notes: 'Evening fountain show choreography',
            cost: 75,
            coordinates: { lat: 25.1972, lng: 55.2744 }
          }
        ]
      }
    ],
    expenses: [
      { id: 'exp-d1', category: 'Flights', title: 'Emirates flight', amount: 720, date: '2026-11-01' },
      { id: 'exp-d2', category: 'Hotels', title: 'Palm Jumeirah stay', amount: 1100, date: '2026-11-05' },
      { id: 'exp-d3', category: 'Activities', title: 'Desert Safari VIP tour', amount: 150, date: '2026-11-10' }
    ]
  }
];
