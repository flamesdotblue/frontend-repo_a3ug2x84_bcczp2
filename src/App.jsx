import React, { useState } from 'react';
import { motion } from 'framer-motion';
import HeroCover from './components/HeroCover';
import StarfieldCanvas from './components/StarfieldCanvas';
import ModeSelector from './components/ModeSelector';
import JournalCard from './components/JournalCard';

// Color tokens
const colors = {
  night: '#0D1B2A',
  sand: '#F4EDE4',
  sage: '#A8CABA',
  gray: '#E6E6E6',
};

function App() {
  const [mode, setMode] = useState('calm');

  return (
    <div className="min-h-screen w-full bg-[#0D1B2A] text-white">
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-8">
        <HeroCover />

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl p-5 border border-white/10 bg-white/[0.03] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Choose your Zen Session</h2>
                <span className="text-sm text-white/60">Mode: {mode}</span>
              </div>
              <ModeSelector onSelect={setMode} />
              <p className="mt-4 text-white/70 text-sm">
                Breathe for 5–10 minutes. On completion your wallet will sign a proof. Reflections are encrypted locally and saved to IPFS.
              </p>
            </div>

            <JournalCard />
          </div>

          <div className="lg:col-span-1">
            <StarfieldCanvas className="h-80" />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-white/80"
            >
              <h3 className="text-white font-semibold">How it works</h3>
              <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
                <li>Complete a calm session and sign with HashPack.</li>
                <li>Reflection is AES-encrypted locally, uploaded to IPFS.</li>
                <li>Backend writes proof to Hedera HCS and updates XP.</li>
                <li>Complete a 3×3 streak to mint your Serenity Badge NFT.</li>
              </ul>
            </motion.div>
          </div>
        </section>

        <footer className="pt-4 pb-8 text-center text-white/50 text-sm">
          Built for peaceful progress • Palette: sage, sand, soft gray, deep night
        </footer>
      </div>
    </div>
  );
}

export default App;
