// Wolf Flow Communications - Welcome Page v1
// Created and Authored by Johnathon Moulds 2026 @Wolf Flow Solutions

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WolfWelcomeV1() {
  const router = useRouter();
  const [mode, setMode] = useState('night');

  const toggleMode = () => {
    setMode(mode === 'night' ? 'day' : 'night');
  };

  return (
    <>
      {/* Portal Background */}
      <PortalBackground mode={mode} />

      {/* Turtle Toggle */}
      <TurtleToggle mode={mode} onToggle={toggleMode} />

      {/* Welcome Page */}
      <div className="wolf-welcome-page">
        <div className="wolf-welcome-content">
          {/* Turtle Icon */}
          <div className="wolf-turtle-icon">
            <span className="wolf-turtle-emoji">🐢</span>
          </div>

          {/* Hero Title */}
          <h1 className="wolf-hero-title">Wolf Flow Communications</h1>

          {/* Subtitle */}
          <p className="wolf-subtitle">REQUEST PORTAL</p>

          {/* Divider */}
          <div className="wolf-divider" />

          {/* Tagline */}
          <p className="wolf-tagline">Where departments come to create.</p>

          {/* CTA Button */}
          <button 
            className="wolf-cta-button"
            onClick={() => router.push('/command')}
          >
            Start a Request
          </button>
        </div>
      </div>

      <style jsx global>{`
        /* Wolf Flow Welcome Page Styles */
        .wolf-welcome-page {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          font-family: 'Josefin Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .wolf-welcome-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 60px 24px;
          max-width: 600px;
        }

        /* Turtle Icon Container */
        .wolf-turtle-icon {
          width: 100px;
          height: 100px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px) saturate(1.3) brightness(1.08);
          -webkit-backdrop-filter: blur(20px) saturate(1.3) brightness(1.08);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 
            0 0 40px rgba(20, 169, 162, 0.15),
            0 8px 32px rgba(0, 0, 0, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
          opacity: 0;
          animation: fadeSlide 0.7s ease forwards;
        }

        .wolf-turtle-emoji {
          font-size: 48px;
          filter: drop-shadow(0 0 10px rgba(20, 169, 162, 0.5));
        }

        /* Hero Title */
        .wolf-hero-title {
          font-size: 48px;
          font-weight: 200;
          letter-spacing: 0.04em;
          line-height: 1.2;
          color: rgba(255, 255, 255, 0.92);
          margin: 36px 0 0;
          opacity: 0;
          animation: fadeSlide 0.7s ease forwards;
          animation-delay: 0.15s;
        }

        /* Subtitle */
        .wolf-subtitle {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.5em;
          text-transform: uppercase;
          color: rgba(20, 169, 162, 0.6);
          margin: 24px 0 0;
          opacity: 0;
          animation: fadeSlide 0.7s ease forwards;
          animation-delay: 0.3s;
        }

        /* Divider */
        .wolf-divider {
          width: 100px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(20, 169, 162, 0.6), transparent);
          margin: 28px 0;
          opacity: 0;
          animation: fadeSlide 0.7s ease forwards;
          animation-delay: 0.45s;
        }

        /* Tagline */
        .wolf-tagline {
          font-size: 18px;
          font-weight: 400;
          letter-spacing: 0.01em;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.55);
          margin: 0;
          opacity: 0;
          animation: fadeSlide 0.7s ease forwards;
          animation-delay: 0.6s;
        }

        /* CTA Button */
        .wolf-cta-button {
          padding: 20px 60px;
          border-radius: 28px;
          margin-top: 40px;
          min-width: 300px;
          backdrop-filter: blur(20px) saturate(1.4) brightness(1.1);
          -webkit-backdrop-filter: blur(20px) saturate(1.4) brightness(1.1);
          border: 1px solid rgba(20, 169, 162, 0.2);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.06em;
          color: rgba(20, 169, 162, 0.8);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          font-family: 'Josefin Sans', sans-serif;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          animation: fadeSlide 0.7s ease forwards;
          animation-delay: 0.75s;
        }

        .wolf-cta-button:hover {
          border-color: rgba(200, 80, 130, 0.4);
          box-shadow: 
            0 12px 40px rgba(20, 169, 162, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          transform: translateY(-2px);
        }

        .wolf-cta-button:active {
          background: linear-gradient(135deg, rgba(20, 169, 162, 0.12), rgba(200, 80, 130, 0.08));
          border-color: rgba(200, 80, 130, 0.45);
          box-shadow: 
            0 0 30px rgba(200, 80, 130, 0.25),
            inset 0 0 20px rgba(200, 80, 130, 0.08);
          transform: translateY(0);
        }

        /* Fade Slide Animation */
        @keyframes fadeSlide {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .wolf-hero-title {
            font-size: 36px;
          }
          .wolf-tagline {
            font-size: 16px;
          }
          .wolf-cta-button {
            min-width: 250px;
            padding: 18px 48px;
          }
        }
      `}</style>
    </>
  );
}

// Turtle Toggle Component
function TurtleToggle({ mode, onToggle }) {
  return (
    <>
      <button
        className="wolf-turtle-toggle"
        onClick={onToggle}
        aria-label={`Switch to ${mode === 'night' ? 'day' : 'night'} mode`}
        title={`Switch to ${mode === 'night' ? 'day' : 'night'} mode`}
      >
        🐢
      </button>

      <style jsx>{`
        .wolf-turtle-toggle {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 100;
          width: 56px;
          height: 56px;
          border-radius: 14px;
          backdrop-filter: blur(16px) saturate(1.3);
          -webkit-backdrop-filter: blur(16px) saturate(1.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          user-select: none;
        }

        .wolf-turtle-toggle:hover {
          border-color: rgba(20, 169, 162, 0.2);
          box-shadow: 0 12px 40px rgba(20, 169, 162, 0.15);
          transform: scale(1.05);
        }

        .wolf-turtle-toggle:active {
          transform: scale(0.98);
          background: linear-gradient(135deg, rgba(20, 169, 162, 0.12), rgba(200, 80, 130, 0.08));
          border-color: rgba(200, 80, 130, 0.3);
          box-shadow: 
            0 0 20px rgba(20, 169, 162, 0.2),
            0 0 40px rgba(200, 80, 130, 0.15);
        }

        @media (max-width: 768px) {
          .wolf-turtle-toggle {
            top: 16px;
            right: 16px;
            width: 48px;
            height: 48px;
            font-size: 24px;
          }
        }
      `}</style>
    </>
  );
}

// Portal Background Component
function PortalBackground({ mode }) {
  const gradientPrefix = mode === 'night' ? 'ng' : 'dg';
  const pinkGradient = mode === 'night' ? 'nk' : 'dk';
  const turquoiseOpacity = mode === 'night' ? '0.5' : '0.55';
  const pinkOpacity = mode === 'night' ? '0.35' : '0.4';
  const crossStroke = mode === 'night' ? 'rgba(20,169,162,0.055)' : 'rgba(20,169,162,0.07)';

  return (
    <>
      <div className={`wolf-portal-background ${mode}`}>
        <svg 
          viewBox="0 0 800 800" 
          className="wolf-mshike-pattern"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id={gradientPrefix} cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#14A9A2" stopOpacity={turquoiseOpacity} />
              <stop offset="1" stopColor="#14A9A2" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={pinkGradient} cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#C85082" stopOpacity={pinkOpacity} />
              <stop offset="1" stopColor="#C85082" stopOpacity="0" />
            </radialGradient>
          </defs>
          
          {/* Medicine Wheel Cross */}
          <line x1="400" y1="110" x2="400" y2="690" stroke={crossStroke} strokeWidth="0.6" />
          <line x1="110" y1="400" x2="690" y2="400" stroke={crossStroke} strokeWidth="0.6" />
          
          {/* Seven Grandfather Teaching Circles */}
          <circle cx="400" cy="400" r="8" fill={`url(#${gradientPrefix})`} />
          <circle cx="400" cy="255" r="7" fill={`url(#${gradientPrefix})`} />
          <circle cx="525" cy="328" r="7" fill={`url(#${gradientPrefix})`} />
          <circle cx="525" cy="472" r="7" fill={`url(#${pinkGradient})`} />
          <circle cx="400" cy="545" r="7" fill={`url(#${gradientPrefix})`} />
          <circle cx="275" cy="472" r="7" fill={`url(#${pinkGradient})`} />
          <circle cx="275" cy="328" r="7" fill={`url(#${gradientPrefix})`} />
          
          {/* Halo Rings */}
          <circle cx="400" cy="400" r="14" fill="none" 
            stroke={mode === 'night' ? 'rgba(20,169,162,0.06)' : 'rgba(20,169,162,0.08)'} 
            strokeWidth="0.5" />
          <circle cx="400" cy="255" r="12" fill="none" 
            stroke={mode === 'night' ? 'rgba(20,169,162,0.05)' : 'rgba(20,169,162,0.065)'} 
            strokeWidth="0.4" />
          <circle cx="525" cy="328" r="12" fill="none" 
            stroke={mode === 'night' ? 'rgba(20,169,162,0.05)' : 'rgba(20,169,162,0.065)'} 
            strokeWidth="0.4" />
          <circle cx="525" cy="472" r="12" fill="none" 
            stroke={mode === 'night' ? 'rgba(200,80,130,0.045)' : 'rgba(200,80,130,0.055)'} 
            strokeWidth="0.4" />
          <circle cx="400" cy="545" r="12" fill="none" 
            stroke={mode === 'night' ? 'rgba(20,169,162,0.05)' : 'rgba(20,169,162,0.065)'} 
            strokeWidth="0.4" />
          <circle cx="275" cy="472" r="12" fill="none" 
            stroke={mode === 'night' ? 'rgba(200,80,130,0.045)' : 'rgba(200,80,130,0.055)'} 
            strokeWidth="0.4" />
          <circle cx="275" cy="328" r="12" fill="none" 
            stroke={mode === 'night' ? 'rgba(20,169,162,0.05)' : 'rgba(20,169,162,0.065)'} 
            strokeWidth="0.4" />
          
          {/* Appliqué Triangles - Cardinal */}
          <path d="M400,150 L414,182 L386,182 Z" 
            fill={mode === 'night' ? 'rgba(20,169,162,0.07)' : 'rgba(20,169,162,0.09)'} 
            stroke={mode === 'night' ? 'rgba(20,169,162,0.1)' : 'rgba(20,169,162,0.13)'} 
            strokeWidth="0.6" />
          <path d="M400,650 L414,618 L386,618 Z" 
            fill={mode === 'night' ? 'rgba(200,80,130,0.06)' : 'rgba(200,80,130,0.07)'} 
            stroke={mode === 'night' ? 'rgba(200,80,130,0.09)' : 'rgba(200,80,130,0.11)'} 
            strokeWidth="0.6" />
          <path d="M150,400 L182,386 L182,414 Z" 
            fill={mode === 'night' ? 'rgba(20,169,162,0.06)' : 'rgba(20,169,162,0.08)'} 
            stroke={mode === 'night' ? 'rgba(20,169,162,0.09)' : 'rgba(20,169,162,0.12)'} 
            strokeWidth="0.6" />
          <path d="M650,400 L618,386 L618,414 Z" 
            fill={mode === 'night' ? 'rgba(200,80,130,0.055)' : 'rgba(200,80,130,0.07)'} 
            stroke={mode === 'night' ? 'rgba(200,80,130,0.085)' : 'rgba(200,80,130,0.1)'} 
            strokeWidth="0.6" />
          
          {/* Diagonal Triangles */}
          <path d="M258,215 L276,238 L240,238 Z" 
            fill={mode === 'night' ? 'rgba(20,169,162,0.05)' : 'rgba(20,169,162,0.06)'} 
            stroke={mode === 'night' ? 'rgba(20,169,162,0.075)' : 'rgba(20,169,162,0.09)'} 
            strokeWidth="0.5" />
          <path d="M542,585 L560,562 L524,562 Z" 
            fill={mode === 'night' ? 'rgba(200,80,130,0.04)' : 'rgba(200,80,130,0.05)'} 
            stroke={mode === 'night' ? 'rgba(200,80,130,0.065)' : 'rgba(200,80,130,0.08)'} 
            strokeWidth="0.5" />
          <path d="M542,215 L560,238 L524,238 Z" 
            fill={mode === 'night' ? 'rgba(20,169,162,0.04)' : 'rgba(20,169,162,0.05)'} 
            stroke={mode === 'night' ? 'rgba(20,169,162,0.065)' : 'rgba(20,169,162,0.08)'} 
            strokeWidth="0.5" />
          <path d="M258,585 L276,562 L240,562 Z" 
            fill={mode === 'night' ? 'rgba(200,80,130,0.04)' : 'rgba(200,80,130,0.05)'} 
            stroke={mode === 'night' ? 'rgba(200,80,130,0.06)' : 'rgba(200,80,130,0.075)'} 
            strokeWidth="0.5" />
          
          {/* Sun Rays */}
          <line x1="400" y1="368" x2="400" y2="330" 
            stroke={mode === 'night' ? 'rgba(20,169,162,0.07)' : 'rgba(20,169,162,0.085)'} 
            strokeWidth="0.5" />
          <line x1="424" y1="376" x2="442" y2="350" 
            stroke={mode === 'night' ? 'rgba(20,169,162,0.06)' : 'rgba(20,169,162,0.075)'} 
            strokeWidth="0.5" />
          <line x1="432" y1="400" x2="470" y2="400" 
            stroke={mode === 'night' ? 'rgba(20,169,162,0.055)' : 'rgba(20,169,162,0.07)'} 
            strokeWidth="0.5" />
          <line x1="424" y1="424" x2="442" y2="450" 
            stroke={mode === 'night' ? 'rgba(20,169,162,0.06)' : 'rgba(20,169,162,0.075)'} 
            strokeWidth="0.5" />
          <line x1="400" y1="432" x2="400" y2="470" 
            stroke={mode === 'night' ? 'rgba(20,169,162,0.07)' : 'rgba(20,169,162,0.085)'} 
            strokeWidth="0.5" />
          <line x1="376" y1="424" x2="358" y2="450" 
            stroke={mode === 'night' ? 'rgba(20,169,162,0.06)' : 'rgba(20,169,162,0.075)'} 
            strokeWidth="0.5" />
          <line x1="368" y1="400" x2="330" y2="400" 
            stroke={mode === 'night' ? 'rgba(20,169,162,0.055)' : 'rgba(20,169,162,0.07)'} 
            strokeWidth="0.5" />
          <line x1="376" y1="376" x2="358" y2="350" 
            stroke={mode === 'night' ? 'rgba(20,169,162,0.06)' : 'rgba(20,169,162,0.075)'} 
            strokeWidth="0.5" />
        </svg>
      </div>

      <style jsx>{`
        .wolf-portal-background {
          position: fixed;
          inset: 0;
          z-index: -1;
          transition: background 0.8s ease;
        }

        .wolf-portal-background.night {
          background: #070a10;
        }

        .wolf-portal-background.night::before {
          content: '';
          position: absolute;
          inset: 0;
          transition: opacity 0.8s ease;
          background:
            radial-gradient(circle 380px at 50% 48%, rgba(20,169,162,0.0) 44.5%, rgba(20,169,162,0.065) 45.5%, rgba(20,169,162,0.0) 47%),
            radial-gradient(circle 280px at 50% 48%, rgba(20,169,162,0.0) 44.5%, rgba(20,169,162,0.075) 45.5%, rgba(20,169,162,0.0) 47%),
            radial-gradient(circle 180px at 50% 48%, rgba(20,169,162,0.0) 43.5%, rgba(20,169,162,0.085) 45.5%, rgba(20,169,162,0.0) 47%),
            radial-gradient(circle 70px at 50% 48%, rgba(20,169,162,0.12) 0%, transparent 100%),
            radial-gradient(ellipse 200px 500px at 50% 0%, rgba(255,255,255,0.035) 0%, transparent 70%),
            radial-gradient(ellipse 500px 200px at 100% 48%, rgba(200,80,130,0.055) 0%, transparent 70%),
            radial-gradient(ellipse 200px 500px at 50% 100%, rgba(200,80,130,0.04) 0%, transparent 70%),
            radial-gradient(ellipse 500px 200px at 0% 48%, rgba(20,169,162,0.07) 0%, transparent 70%);
        }

        .wolf-portal-background.day {
          background: linear-gradient(160deg, #111a1a 0%, #0f181c 50%, #121b1a 100%);
        }

        .wolf-portal-background.day::before {
          content: '';
          position: absolute;
          inset: 0;
          transition: opacity 0.8s ease;
          background:
            radial-gradient(circle 380px at 50% 48%, rgba(20,169,162,0.0) 44.5%, rgba(20,169,162,0.08) 45.5%, rgba(20,169,162,0.0) 47%),
            radial-gradient(circle 280px at 50% 48%, rgba(20,169,162,0.0) 44.5%, rgba(20,169,162,0.09) 45.5%, rgba(20,169,162,0.0) 47%),
            radial-gradient(circle 180px at 50% 48%, rgba(20,169,162,0.0) 43.5%, rgba(20,169,162,0.1) 45.5%, rgba(20,169,162,0.0) 47%),
            radial-gradient(circle 70px at 50% 48%, rgba(20,169,162,0.14) 0%, transparent 100%),
            radial-gradient(ellipse 200px 500px at 50% 0%, rgba(20,169,162,0.04) 0%, transparent 70%),
            radial-gradient(ellipse 500px 200px at 100% 48%, rgba(200,80,130,0.05) 0%, transparent 70%),
            radial-gradient(ellipse 200px 500px at 50% 100%, rgba(20,169,162,0.035) 0%, transparent 70%),
            radial-gradient(ellipse 500px 200px at 0% 48%, rgba(20,169,162,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 100% 100% at 50% 50%, rgba(20,169,162,0.03) 0%, transparent 65%);
        }

        .wolf-mshike-pattern {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
      `}</style>
    </>
  );
}

// Created and Authored by Johnathon Moulds 2026 @Wolf Flow Solutions
