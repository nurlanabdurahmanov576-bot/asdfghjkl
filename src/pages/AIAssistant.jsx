import React from 'react';
import AIChat from '../components/AIChat';
import { Sparkles, Bot, Shield, Lightbulb } from 'lucide-react';
import { useTrips } from '../context/TripContext';

export default function AIAssistant() {
  const { currentTrip } = useTrips();

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 36px' }}>
          <div className="hero-tag" style={{ background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid #c7d2fe', textShadow: 'none' }}>
            <Sparkles size={16} />
            <span>Triply AI Concierge</span>
          </div>
          <h1 className="section-title" style={{ marginTop: 8 }}>
            AI Trip Assistant
          </h1>
          <p className="section-description" style={{ margin: '8px auto 0' }}>
            Get personalized advice for {currentTrip?.destination || 'your next destination'}, optimized day plans, packing advice, and local food spots.
          </p>
        </div>

        {/* AI Chat Component */}
        <AIChat />
      </div>
    </div>
  );
}
