"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FileSpreadsheet, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SpotlightCard } from "@/components/spotlight-card"
import { useTheme } from "next-themes"
import { GridBackground } from "@/components/ui/grid-background"

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = resolvedTheme === "dark"

  return (
    <div className={`relative min-h-screen w-full antialiased overflow-hidden isolate ${isDark ? 'bg-black/[0.96]' : 'bg-white'}`}>
      <GridBackground />
      
      <SpotlightCard className="h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            type: "spring",
            bounce: 0.4
          }}
          className="text-center px-4 max-w-3xl mx-auto relative z-10"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 0.8,
              type: "spring",
              bounce: 0.5
            }}
            className="mb-8"
          >
            <FileSpreadsheet className={`w-20 h-20 mx-auto ${isDark ? 'text-white' : 'text-black'}`} />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className={`text-4xl md:text-6xl font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}
          >
            Générateur d'Organigramme
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className={`text-xl mb-12 max-w-2xl mx-auto ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}
          >
            Transformez vos données CSV en organigrammes interactifs en quelques secondes.
            Importez vos données, personnalisez la visualisation et exportez en PDF.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/generator">
              <Button 
                size="lg"
                className="group relative overflow-hidden rounded-full px-8 h-12 bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
              >
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: "-100%" }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear",
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                <span className="relative flex items-center text-lg font-medium">
                  Commencer
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button 
                size="lg" 
                variant="outline" 
                className={`rounded-full px-8 h-12 ${
                  isDark 
                    ? 'border-white/20 text-white hover:bg-white/10' 
                    : 'border-black/20 text-black hover:bg-black/10'
                }`}
              >
                <span className="text-lg font-medium">Tableau de bord</span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </SpotlightCard>
    </div>
  )
}