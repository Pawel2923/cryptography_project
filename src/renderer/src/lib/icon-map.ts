import React from 'react'
import { Lock, TextWrap } from 'lucide-react'

export const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  'text-wrap': TextWrap,
  lock: Lock
}
