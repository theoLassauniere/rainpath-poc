import type { NodeType, NodeData } from '../../types/workflow'

export interface PaletteItem {
  type: NodeType
  label: string
  description: string
  colorClass: string   // Tailwind bg color for header
  textClass: string    // Tailwind text color for badge
  borderClass: string  // Tailwind border color for selected state
}

export const PALETTE_GROUPS: { label: string; items: PaletteItem[] }[] = [
  {
    label: 'Déclencheur',
    items: [
      { type: 'start', label: 'Départ', description: 'Examen effectué', colorClass: 'bg-emerald-500', textClass: 'text-emerald-600', borderClass: 'border-emerald-400' },
    ],
  },
  {
    label: 'Envoi',
    items: [
      { type: 'send_email',    label: 'Email',     description: 'Envoyer un email',    colorClass: 'bg-blue-500',   textClass: 'text-blue-600',   borderClass: 'border-blue-400'   },
      { type: 'send_sms',     label: 'SMS',       description: 'Envoyer un SMS',      colorClass: 'bg-violet-500', textClass: 'text-violet-600', borderClass: 'border-violet-400' },
      { type: 'send_whatsapp',label: 'WhatsApp',  description: 'Message WhatsApp',    colorClass: 'bg-green-500',  textClass: 'text-green-600',  borderClass: 'border-green-400'  },
      { type: 'send_postal',  label: 'Courrier',  description: 'Courrier postal',     colorClass: 'bg-orange-500', textClass: 'text-orange-600', borderClass: 'border-orange-400' },
    ],
  },
  {
    label: 'Logique',
    items: [
      { type: 'delay',     label: 'Délai',     description: 'Attendre X jours',         colorClass: 'bg-amber-500', textClass: 'text-amber-600', borderClass: 'border-amber-400' },
      { type: 'condition', label: 'Condition', description: 'Branchement conditionnel', colorClass: 'bg-sky-500',   textClass: 'text-sky-600',   borderClass: 'border-sky-400'   },
    ],
  },
  {
    label: 'Fin',
    items: [
      { type: 'end', label: 'Fin', description: 'Fin du workflow', colorClass: 'bg-slate-600', textClass: 'text-slate-600', borderClass: 'border-slate-400' },
    ],
  },
]

export const PALETTE_CONFIG: Record<NodeType, PaletteItem> = Object.fromEntries(
  PALETTE_GROUPS.flatMap((g) => g.items).map((item) => [item.type, item])
) as Record<NodeType, PaletteItem>

export function getDefaultData(type: NodeType): NodeData {
  switch (type) {
    case 'start':         return { label: 'Examen effectué' }
    case 'send_email':    return { label: 'Envoi Email',    messageTemplate: '' }
    case 'send_sms':      return { label: 'Envoi SMS',      messageTemplate: '' }
    case 'send_whatsapp': return { label: 'Envoi WhatsApp', messageTemplate: '' }
    case 'send_postal':   return { label: 'Envoi Courrier', messageTemplate: '' }
    case 'delay':         return { label: 'Délai', days: 7 }
    case 'condition':     return { label: 'Condition', conditionType: 'data_availability', conditionField: 'email', conditionOperator: 'is_known' }
    case 'end':           return { label: 'Fin' }
  }
}
