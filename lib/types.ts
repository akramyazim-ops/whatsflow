export interface Lead {
    id: string
    user_id: string
    phone_number: string
    name: string | null
    first_message: string
    status: 'New Lead' | 'Contacted' | 'Closed'
    is_group: boolean
    created_at: string
    updated_at: string
}

export interface Message {
    id: string
    lead_id: string
    sender_type: 'lead' | 'agent'
    content: string
    created_at: string
}

export interface Profile {
    id: string
    email: string | null
    whatsapp_number: string | null
    created_at: string
}

export interface Subscription {
    id: string
    user_id: string
    tier: 'starter' | 'growth' | 'scale'
    created_at: string
}

export type LeadStatus = 'New Lead' | 'Contacted' | 'Closed'

export const LEAD_STATUSES: LeadStatus[] = ['New Lead', 'Contacted', 'Closed']

export const STATUS_COLORS: Record<LeadStatus, string> = {
    'New Lead': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'Contacted': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'Closed': 'bg-green-500/20 text-green-300 border-green-500/30',
}
