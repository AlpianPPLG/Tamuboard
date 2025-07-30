"use client"

import { cn } from "@/lib/utils"
import { Users, Building, Clock, Zap } from "lucide-react"
import { motion } from "framer-motion"

type StatItem = {
  value: string
  label: string
  icon?: React.ReactNode
}

type StatsSectionProps = {
  stats: StatItem[]
  className?: string
}

const iconMap = {
  users: <Users className="h-6 w-6 text-primary" />,
  companies: <Building className="h-6 w-6 text-primary" />,
  support: <Clock className="h-6 w-6 text-primary" />,
  uptime: <Zap className="h-6 w-6 text-primary" />,
}

export function StatsSection({ stats, className }: StatsSectionProps) {
  // Map default icons if not provided
  const statsWithIcons = stats.map((stat, index) => ({
    ...stat,
    icon: stat.icon || Object.values(iconMap)[index % Object.values(iconMap).length],
  }))

  return (
    <div className={cn("py-16 bg-background", className)}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsWithIcons.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group p-6 rounded-xl border bg-card shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
