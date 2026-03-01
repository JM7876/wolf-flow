/*
  WOLF FLOW SOLUTIONS - Login
  Route: /login
  Employee authentication for portal access.
  Created and Authored by Johnathon Moulds (c) 2026
*/
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WF, FC, FONT, MONO, GLASS, glassPill, inputBase } from '../lib/tokens';
import { GlassCard, PortalBackground, Footer, useNightMode, SettingsDropdown } from '../lib/components';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const { nightMode, toggleNight } = useNightMode();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError(authError.message);
    } else {
      router.push('/?page=services');
    }
  };

  return (
    <div style={{ minHeight: '100vh', fontFamily: FONT, color: FC.textPrimary, position: 'relative', overflowX: 'hidden' }}>
      <PortalBackground nightMode={nightMode} />
      <SettingsDropdown nightMode={nightMode} onToggleNight={toggleNight} />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: 400, width: '100%', padding: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: FC.textDim, marginBottom: 6 }}>Wolf Flow Solutions</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: FC.textPrimary, marginBottom: 4 }}>Sign In</div>
              <div style={{ fontSize: 12, color: FC.textSecondary }}>Access the Communications Portal</div>
            </div>
            <GlassCard style={{ padding: '28px 24px' }}>
              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 10, fontWeight: 600, fontFamily: FONT, color: FC.textDim, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@nhbp.com" required style={{ ...inputBase, width: '100%', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 10, fontWeight: 600, fontFamily: FONT, color: FC.textDim, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required style={{ ...inputBase, width: '100%', boxSizing: 'border-box' }} />
                </div>
                {error && <div style={{ fontSize: 11, fontFamily: FONT, color: FC.redLight, marginBottom: 12, padding: '8px 12px', borderRadius: 8, background: `${FC.redLight}15`, border: `1px solid ${FC.redLight}30` }}>{error}</div>}
                <button type="submit" disabled={loading} style={{ ...glassPill, width: '100%', textAlign: 'center', padding: '14px 20px', background: `linear-gradient(135deg, ${WF.accent}55, ${WF.accent}38)`, border: `1px solid ${WF.accent}60`, color: '#fff', fontWeight: 600, fontSize: 13, fontFamily: FONT, cursor: loading ? 'wait' : 'pointer' }}>{loading ? 'Signing in...' : 'Sign In'}</button>
              </form>
            </GlassCard>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: FC.textDim, fontSize: 11, fontFamily: FONT, cursor: 'pointer' }}>Back to Portal</button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
// Created and Authored by Johnathon Moulds (c) 2026 - Wolf Flow Solutions | All Rights Reserved
