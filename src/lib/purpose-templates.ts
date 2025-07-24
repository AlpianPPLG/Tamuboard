import { PurposeTemplate, RequirementType } from "@/types/guest";

export const PURPORSE_TEMPLATES: PurposeTemplate[] = [
    {
        id: '1',    
        name: 'Meeting',
        category: 'Meeting',
        requirements: [
            {
                type: 'food',
                description: 'Food and drink',  
            },
            {
                type: 'accommodation',
                description: 'Accommodation',
            },
            {
                type: 'other',
                description: 'Other',
            },
        ],
    },
    {
        id: '2',
        name: 'Event',
        category: 'Event',
        requirements: [
            {
                type: 'food',
                description: 'Food and drink',
            },
            {
                type: 'accommodation',
                description: 'Accommodation',
            },
            {
                type: 'other',
                description: 'Other',
            },
        ],
    },
    {
        id: '3',
        name: 'Other',
        category: 'Other',
        requirements: [
            {
                type: 'food',
                description: 'Food and drink',
            },
            {
                type: 'accommodation',
                description: 'Accommodation',
            },
            {
                type: 'other',
                description: 'Other',
            },
        ],
    },
    {
        id: '4',
        name: 'Tourism',
        category: 'Tourism',
        requirements: [
            {
                type: 'food',
                description: 'Food and drink',
            },
            {
                type: 'accommodation',
                description: 'Accommodation',
            },
            {
                type: 'other',
                description: 'Other',
            },
        ],
    },
    {
        id: '5',
        name: 'Other',
        category: 'Other',
        requirements: [
            {
                type: 'food',
                description: 'Food and drink',
            },
            {
                type: 'accommodation',
                description: 'Accommodation',
            },
            {
                type: 'other',
                description: 'Other',
            },
        ],
    },
]

export const REQUIREMENT_LABELS:Record<RequirementType['type'], string> = {
    food: 'Food and drink',
    accommodation: 'Accommodation',
    other: 'Other',
}

export function getPurporseTemplate(purporseId: string  ): PurposeTemplate | undefined {
    return PURPORSE_TEMPLATES.find((template) => template.id === purporseId)
}

export function getPurporseTemplateByCategory(category: string): PurposeTemplate[] {
    return PURPORSE_TEMPLATES.filter((template) => template.category === category)
}