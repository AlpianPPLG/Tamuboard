"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export interface TeamMemberProps {
  name: string
  role: string
  image?: string
  bio: string
  socials?: {
    twitter?: string
    linkedin?: string
    github?: string
    instagram?: string
    whatsapp?: string
    facebook?: string
    thread?: string
  }
  className?: string
}

export function TeamMemberCard({ name, role, image, bio, socials, className }: TeamMemberProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className={cn("bg-card rounded-lg p-6 shadow-sm border flex flex-col items-center text-center", className)}>
      <Avatar className="h-32 w-32 mb-4 border-4 border-primary/10">
        {image ? (
          <AvatarImage 
            src={image} 
            alt={name}
            className="object-cover"
          />
        ) : (
          <AvatarFallback className="text-2xl bg-muted">
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
      <h3 className="text-xl font-semibold">{name}</h3>
      <p className="text-muted-foreground mb-4">{role}</p>
      <p className="text-muted-foreground text-sm mb-4">{bio}</p>
      
      {socials && (
        <div className="flex gap-3 mt-auto pt-4">
          {socials.github && (
            <a 
              href={socials.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`${name}'s GitHub`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.1-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          )}
          {socials.linkedin && (
            <a 
              href={socials.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`${name}'s LinkedIn`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>
          )}
          {socials.instagram && (
            <a 
              href={socials.instagram} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`${name}'s Instagram`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
          )}
          {socials.whatsapp && (
            <a 
              href={socials.whatsapp} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`${name}'s WhatsApp`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.498 14.382a7.16 7.16 0 01-.988.362 3.9 3.9 0 01-1.807.088 9.76 9.76 0 01-4.09-1.584 11.1 11.1 0 01-3.48-3.482 8.152 8.152 0 01-1.227-3.15 3.9 3.9 0 01.087-1.808 7.16 7.16 0 01.361-.987.5.5 0 00-.5-.5H4.5a.5.5 0 00-.5.5 12.047 12.047 0 00.5 3.5 12.047 12.047 0 003.5 6.5 12.047 12.047 0 006.5 3.5 12.047 12.047 0 003.5.5.5.5 0 00.5-.5v-3.183a.5.5 0 00-.5-.5z"/>
                <path d="M17.5 0h-15A2.5 2.5 0 000 2.5v15A2.5 2.5 0 002.5 20h15a2.5 2.5 0 002.5-2.5v-15A2.5 2.5 0 0017.5 0zM20 17.5a2.5 2.5 0 01-2.5 2.5h-15A2.5 2.5 0 010 17.5v-15A2.5 2.5 0 012.5 0h15A2.5 2.5 0 0120 2.5v15z"/>
              </svg>
            </a>
          )}
          {socials.facebook && (
            <a 
              href={socials.facebook} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`${name}'s Facebook`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          )}
          {socials.thread && (
            <a 
              href={socials.thread} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`${name}'s Threads`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.5 12.5c0 4.136-3.364 7.5-7.5 7.5-4.136 0-7.5-3.364-7.5-7.5 0-4.136 3.364-7.5 7.5-7.5 4.136 0 7.5 3.364 7.5 7.5z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15.5a3 3 0 100-6 3 3 0 000 6z" fill="currentColor"/>
              </svg>
            </a>
          )}
        </div>
      )}
    </div>
  )
}
