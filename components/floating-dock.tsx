"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FileSpreadsheet, BarChart3, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function FloatingDock() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const links = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/generator", label: "Générateur", icon: FileSpreadsheet },
    { href: "/dashboard", label: "Tableau de bord", icon: BarChart3 },
  ]

  return (
    <motion.div 
      className="fixed bottom-8 left-1/2 z-50"
      initial={{ x: "-50%", y: 100 }}
      animate={{ x: "-50%", y: 0 }}
      transition={{ type: "spring", bounce: 0.25 }}
    >
      <motion.div
        className="relative flex items-center gap-2 p-2 rounded-full bg-background/80 shadow-lg backdrop-blur-md border"
        animate={{ y: [0, -10, 0] }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <motion.div
              className="relative p-3 rounded-full transition-colors hover:bg-accent"
              onHoverStart={() => setHoveredIcon(href)}
              onHoverEnd={() => setHoveredIcon(null)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-colors",
                  pathname === href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                )}
              />
              <AnimatePresence>
                {hoveredIcon === href && (
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded-md bg-popover text-popover-foreground shadow-lg whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
              {pathname === href && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-primary/10 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.div>
          </Link>
        ))}

        <div className="w-px h-6 bg-border mx-1" />

        <motion.button
          className="relative p-3 rounded-full hover:bg-accent transition-colors"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
        >
          {mounted && (
            <>
              <Sun 
                className={cn(
                  "w-5 h-5 absolute inset-0 m-auto transition-transform",
                  theme === "dark" ? "scale-0 rotate-[-180deg] opacity-0" : "scale-100 rotate-0 opacity-100"
                )}
              />
              <Moon 
                className={cn(
                  "w-5 h-5 absolute inset-0 m-auto transition-transform",
                  theme === "dark" ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-180 opacity-0"
                )}
              />
            </>
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  )
}