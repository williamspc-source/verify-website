import {
  Activity,
  Award,
  BookOpen,
  Brain,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileText,
  GraduationCap,
  HeartPulse,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Scale,
  Search,
  Send,
  Shield,
  Stethoscope,
  UserCheck,
  Users,
  Video,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/utilities/ui'
import React from 'react'

// Curated icon set, surfaced as a CMS select (see `iconField`). Add to this map
// to make a new icon pickable everywhere.
export const iconMap = {
  activity: Activity,
  award: Award,
  'book-open': BookOpen,
  brain: Brain,
  briefcase: Briefcase,
  building: Building2,
  calendar: CalendarDays,
  check: CheckCircle2,
  'clipboard-check': ClipboardCheck,
  clock: Clock,
  'file-text': FileText,
  'graduation-cap': GraduationCap,
  'heart-pulse': HeartPulse,
  mail: Mail,
  'map-pin': MapPin,
  message: MessageSquare,
  phone: Phone,
  scale: Scale,
  search: Search,
  send: Send,
  shield: Shield,
  stethoscope: Stethoscope,
  'user-check': UserCheck,
  users: Users,
  video: Video,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof iconMap

// Options for a Payload `select` field (kept in sync with the map above).
export const iconOptions = Object.keys(iconMap).map((value) => ({
  label: value
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' '),
  value,
}))

export const Icon: React.FC<{ name?: IconName | string | null; className?: string }> = ({
  name,
  className,
}) => {
  if (!name) return null
  const Cmp = iconMap[name as IconName]
  if (!Cmp) return null
  return <Cmp className={cn('size-6', className)} aria-hidden />
}
