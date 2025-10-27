import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

// Utility: browser-friendly base64
function toBase64(arrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(arrayBuffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

async function deriveKey(passphrase, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 120_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encryptTextAesGcm(plaintext, passphrase) {
  const enc = new TextEncoder();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(passphrase, salt);
  const cipherBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(plaintext)
  );
  return {
    iv: toBase64(iv),
    salt: toBase64(salt),
    cipher: toBase64(cipherBuffer),
  };
}

const JournalCard = () => {
  const [text, setText] = useState('Today I slowed down, breathed deeply, and noticed how my shoulders softened.');
  const [pass, setPass] = useState('passphrase');
  const [encOut, setEncOut] = useState(null);
  const [busy, setBusy] = useState(false);

  const sizeBytes = useMemo(() => (text ? new Blob([text]).size : 0), [text]);

  const onEncrypt = async () => {
    setBusy(true);
    try {
      const res = await encryptTextAesGcm(text, pass);
      setEncOut(res);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-white text-lg font-semibold">Daily Reflection</h3>
        <span className="text-xs text-white/60">Local AES-GCM • {sizeBytes} bytes</span>
      </div>

      <textarea
        className="mt-3 w-full rounded-xl bg-[#0D1B2A]/60 border border-white/10 text-white p-3 focus:outline-none focus:ring-2 focus:ring-[#A8CABA]/40"
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a few calm lines (kept private, encrypted before upload)"
      />

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          type="password"
          className="rounded-xl bg-[#0D1B2A]/60 border border-white/10 text-white p-3 focus:outline-none focus:ring-2 focus:ring-[#A8CABA]/40"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="Passphrase"
        />
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onEncrypt}
          disabled={busy || !text || !pass}
          className="rounded-xl px-4 py-3 bg-[#A8CABA] text-[#0D1B2A] font-semibold shadow disabled:opacity-60"
        >
          {busy ? 'Encrypting…' : 'Encrypt preview'}
        </motion.button>
        <button
          className="rounded-xl px-4 py-3 border border-white/10 text-white/80 hover:bg-white/[0.06]"
          onClick={() => {
            setText('');
            setEncOut(null);
          }}
        >
          Clear
        </button>
      </div>

      {encOut && (
        <div className="mt-4 rounded-xl bg-black/30 p-3 border border-white/10 text-white/80 break-all">
          <p className="text-sm mb-2">Encrypted payload (base64 JSON):</p>
          <pre className="whitespace-pre-wrap text-xs">
{JSON.stringify(encOut, null, 2)}
          </pre>
          <p className="mt-3 text-xs text-white/60">
            Next step: upload this JSON to IPFS from the client, then send the CID to the backend to write the proof on HCS and award XP.
          </p>
        </div>
      )}
    </div>
  );
};

export default JournalCard;
