import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, RefreshCw, Compass } from 'lucide-react';
import { useTrips } from '../context/TripContext';

export default function AIChat() {
  const { currentTrip } = useTrips();
  const currentCity = currentTrip?.destination || 'Tokyo';

  const defaultMessages = [
    {
      id: 'msg-1',
      sender: 'assistant',
      time: '12:00',
      text: `Hello! I'm your **Triply AI Assistant**. 🌟 I can build custom itineraries, suggest hidden culinary gems, optimize your travel budget, and advise on packing lists for **${currentCity}** or any city worldwide. How can I help you today?`
    }
  ];

  const [messages, setMessages] = useState(defaultMessages);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const suggestedPrompts = [
    `Что посетить в ${currentCity} за 3 дня?`,
    `Где поесть лучший рамен и суши?`,
    `Какой бюджет мне нужен на поездку?`,
    `Что взять с собой в путешествие?`,
    `Что посмотреть рядом с центром?`,
    `How to get around using public transport?`
  ];

  // Demo AI Knowledge Generator
  const generateResponse = (prompt) => {
    const p = prompt.toLowerCase();
    const city = currentCity;

    if (p.includes('3 дня') || p.includes('посетить') || p.includes('what to see') || p.includes('3-day')) {
      return `### Идеальный 3-дневный маршрут по ${city}:

**День 1 — Историческое сердце и классика:**
• Утро: Посещение древнего храма **Senso-ji** и прогулка по торговой улочке Nakamise.
• Обед: Знаменитая гречневая лапша соба или свежий рамен в Asakusa.
• День: Подъем на смотровую площадку **Tokyo Skytree** (панорама 450 метров).
• Вечер: Прогулка по набережной Сумида и круиз на речном трамвае.

**День 2 — Современная культура и шопинг:**
• Утро: Умиротворяющий парк и синтоистское святилище **Meiji Jingu**.
• День: Трендовые улочки Harajuku и модный бульвар Omotesando.
• Закат: Легендарный перекресток **Shibuya Crossing** и смотровая Shibuya Sky.
• Ужин: Аутентичный ужин в традиционном идзакая.

**День 3 — Цифровое искусство и гастрономия:**
• Утро: Интерактивный музей цифровых инсталляций **teamLab Planets**.
• Обед: Рыбный рынок Toyosu / Tsukiji — свежайшие сашими и морепродукты.
• Вечер: Огни района Ginza и роскошный прощальный ужин.

Хотите, чтобы я сразу добавил эти локации в ваш Itinerary?`;
    }

    if (p.includes('поесть') || p.includes('еда') || p.includes('food') || p.includes('eat') || p.includes('рамен') || p.includes('суши')) {
      return `### Топ гастрономических рекомендаций в ${city}:

1. **Ichiran Shibuya** — эталонный наваристый свиной бульон Tonkotsu Ramen в индивидуальных кабинках.
2. **Sukiyabashi Jiro** (Ginza) — всемирно известный храм элитных суши Edomae.
3. **Afuri Ramen** (Ebisu / Harajuku) — легкий фирменный рамен на бульоне Юдзу с курицей.
4. **Tsukiji Outer Market** — свежие устрицы, морские ежи уни, вагю на шпажках и японский омлет тамагояки.
5. **Ristorante Aso** (Daikanyama) — непревзойденная итальянская паста с трюфелями и изысканный сад.

💡 *Совет:* Для популярных заведений бронируйте столики за 2-3 недели или приходите к 11:30 до основного наплыва!`;
    }

    if (p.includes('бюджет') || p.includes('деньги') || p.includes('budget') || p.includes('cost') || p.includes('сколько')) {
      return `### Расчет рекомендуемого бюджета для ${city} (на 1 человека):

• **Проживание:**
  - Отели 3-4★: $100 — $180 / ночь
  - Люкс 5★: $300 — $600 / ночь
• **Питание:**
  - Стритфуд и раменные: $15 — $30 в день
  - Рестораны средней категории: $50 — $80 в день
  - Высокая кухня (fine dining): от $150
• **Транспорт:** $10 — $20 в день (пополняемая карта Suica/Pasmo или проездной на метро).
• **Достопримечательности и билеты:** $80 — $150 на всю поездку.

💰 **Итог на 7 дней:**
Комфортный бюджет составит примерно **$1,500 — $2,400** без учета международных перелетов. В вашем текущем плане заложено **$${currentTrip?.budget || 2500}**, что отлично покрывает все основные расходы!`;
    }

    if (p.includes('взять с собой') || p.includes('pack') || p.includes('вещи') || p.includes('багаж') || p.includes('одежд')) {
      return `### Чек-лист вещей для поездки в ${city}:

🎒 **Самое важное:**
• Загранпаспорт (срок действия от 6 месяцев) и копии страховок.
• Наличные деньги (йены / валюта назначения — в небольших лавках часто не берут карты!).
• Универсальный адаптер для розеток (в Японии вилки типа A/B на 100V).
• Powerbank (портативный аккумулятор) — карты разряжают телефон быстро.

👟 **Одежда и комфорт:**
• **Удобная обувь для ходьбы:** вы будете проходить от 15,000 до 25,000 шагов каждый день!
• Легко снимаемая обувь (в храмах, традиционных ресторанах и онсэнах обувь снимают).
• Многослойная одежда по сезону (ветровка или легкий свитер для вечеров).

📱 **Приложения:** Google Maps, переводчик с функцией камеры, Suica / Citymapper.`;
    }

    if (p.includes('рядом') || p.includes('shibuya') || p.includes('nearby') || p.includes('окрестн')) {
      return `### Что посмотреть рядом с Shibuya / центром:

1. **Harajuku & Takeshita Street** (10 минут пешком) — эпицентр молодежной моды и сумасшедших десертов.
2. **Yoyogi Park & Meiji Shrine** (12 минут пешком) — гигантский зеленый оазис и величественные тории.
3. **Daikanyama & Nakameguro** (15 минут пешком) — богемные кварталы с дизайнерскими бутиками, винтажными книжными и живописным каналом.
4. **Shibuya Sky** — смотровая площадка на 47 этаже с видом на весь Токио и Фудзи в ясный день.

Все эти места находятся в пешей доступности друг от друга!`;
    }

    return `Отличный вопрос о поездке в **${city}**! 

Для идеального путешествия я рекомендую:
1. Запланировать не более 2-3 ключевых активностей в первой половине дня, чтобы оставить время для спонтанных открытий.
2. Учитывать часы работы: многие музеи закрыты по понедельникам.
3. Добавить выбранные места в разделы **Places** и **Hotels** вашего Trip Planner, чтобы они отображались на интерактивной карте маршрута.

Могу ли я помочь вам найти отели, составить детальный план на конкретный день или оптимизировать бюджет?`;
  };

  const handleSend = (textToSend) => {
    const q = textToSend || inputVal;
    if (!q.trim()) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: q
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulate smart thinking AI delay
    setTimeout(() => {
      const reply = generateResponse(q);
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: reply
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 750);
  };

  return (
    <div className="ai-chat-container">
      {/* Header */}
      <div className="ai-chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="ai-bot-avatar">
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
              Triply AI Travel Assistant
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.85)' }}>
              Context: {currentCity} ({currentTrip?.datesDisplay || 'Planned Trip'}) • Online
            </span>
          </div>
        </div>

        <button
          type="button"
          className="navbar-icon-btn"
          style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#fff', border: 'none' }}
          onClick={() => setMessages(defaultMessages)}
          title="Reset conversation"
        >
          <RefreshCw size={17} />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="ai-chat-messages">
        {messages.map((m) => (
          <div key={m.id} className={`chat-bubble ${m.sender}`}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: m.sender === 'user' ? 'var(--primary)' : '#ede9fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: m.sender === 'user' ? '#fff' : 'var(--primary)',
                flexShrink: 0
              }}
            >
              {m.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>

            <div>
              <div className="bubble-content" style={{ whiteSpace: 'pre-line' }}>
                {m.text}
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  marginTop: '4px',
                  display: 'block',
                  textAlign: m.sender === 'user' ? 'right' : 'left'
                }}
              >
                {m.time}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="chat-bubble assistant">
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#ede9fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)'
              }}
            >
              <Bot size={16} />
            </div>
            <div className="bubble-content" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Triply AI is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Quick Bar */}
      <div className="suggested-prompts-bar">
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            className="prompt-pill"
            onClick={() => handleSend(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        className="chat-input-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          type="text"
          className="chat-input"
          placeholder={`Ask anything about ${currentCity}, budget, places, food...`}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-primary btn-icon-only"
          disabled={!inputVal.trim()}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
