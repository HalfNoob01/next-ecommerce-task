'use client'

import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { motion } from "motion/react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black flex items-center justify-center overflow-hidden relative text-white px-4">

      {/* Floating shapes */}
      <motion.div 
        className="absolute top-10 left-10 w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary opacity-20"
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
      />
      <motion.div 
        className="absolute bottom-20 right-20 w-20 h-20 md:w-24 md:h-24 rounded-full bg-secondary opacity-10"
        animate={{ x: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
      />

      <motion.div
        className="text-center max-w-xl sm:max-w-2xl z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 text-transparent bg-clip-text tracking-wide drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]"
          variants={itemVariants}
        >
          E-COMMERCE
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-base sm:text-lg md:text-xl text-white/80 font-light leading-relaxed mx-auto mb-8 max-w-lg"
          variants={itemVariants}
        >
          Step into the future of online shopping – fast, intelligent, and seamless. Experience AI-powered smart carts and smooth checkouts like never before.
        </motion.p>

        {/* Image */}
        <motion.img
          src="/home.png"
          alt="Shopping"
          className="mx-auto w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mb-6 rounded-xl shadow-2xl cursor-pointer"
          whileHover={{ scale: 1.05, rotate: 1 }}
          whileTap={{ scale: 0.95 }}
          variants={itemVariants}
        />

        {/* Auth buttons */}
        <SignedOut>
          <motion.div variants={itemVariants}>
            <SignInButton mode="modal">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 sm:px-8 sm:py-3 text-sm sm:text-lg rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
              >
                Sign In to Start
              </motion.button>
            </SignInButton>
          </motion.div>
        </SignedOut>

        <SignedIn>
          <motion.p
            className="text-green-400 font-semibold"
            variants={itemVariants}
          >
            You're already signed in!
          </motion.p>
        </SignedIn>
      </motion.div>
    </div>
  );
}
