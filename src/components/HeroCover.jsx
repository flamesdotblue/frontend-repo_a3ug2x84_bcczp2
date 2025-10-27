import React from 'react';
import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

const HeroCover = () => {
  return (
    <section className="relative w-full min-h-[80vh] overflow-hidden rounded-2xl shadow-xl">
      {/* Spline 3D Scene */}
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/qMOKV671Z1CM9yS7/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Soft gradient overlays for legibility (don't block pointer events) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#0D1B2A]/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-end p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-3xl text-sand/90"
        >
          <h1 className="text-3xl sm:text-5xl font-semibold leading-tight text-white drop-shadow-md">
            ZenGarden — Mindfulness, onchain calm
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#E6E6E6]">
            Rest, reflect, and grow your serene garden. Sessions earn XP, proofs live on Hedera, and your reflections stay private and encrypted.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-2xl bg-[#A8CABA]/20 text-[#A8CABA] px-4 py-2 text-sm backdrop-blur-sm shadow">
              Calm • Focus • Gratitude
            </span>
            <span className="inline-flex items-center rounded-2xl bg-[#F4EDE4]/20 text-[#F4EDE4] px-4 py-2 text-sm backdrop-blur-sm shadow">
              Privacy-first • IPFS • HCS
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroCover;
