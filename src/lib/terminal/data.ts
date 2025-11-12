import type { BootStep, ContactChannel, IconName, Profile } from './types';

export const profile: Profile = {
    name: 'Bret Hagen',
    title: 'Principal Software Engineer',
    location: 'Remote · CA, USA',
    summary:
        'Principal engineer and Fortune 100 tech lead delivering resilient products across web, mobile, and the occasional embedded stack. I pair pragmatic architecture with a love for developer experience to ship impact at scale.',
    highlights: [
        'Full-stack engineer shipping across web, mobile, and embedded surfaces—Flutter specialist who adapts to whatever the challenge demands.',
        'Rust advocate in active practice—blending strong typing, performance, and safety into production systems.',
        'Habitual experimenter and mentor; forever learning, forever shipping, always open to the next bold problem.'
    ]
};

export const contactChannels: ContactChannel[] = [
    {
        label: 'Email',
        value: 'bretm.hagen@gmail.com',
        href: 'mailto:bretm.hagen@gmail.com',
        icon: 'mail',
        accent: 'emerald'
    },
    {
        label: 'LinkedIn',
        value: 'linkedin.com/in/bret-hagen',
        href: 'https://linkedin.com/in/bret-hagen',
        icon: 'linkedin',
        accent: 'sky'
    },
    {
        label: 'GitHub',
        value: 'github.com/JustBetr',
        href: 'https://github.com/JustBetr',
        icon: 'github',
        accent: 'violet'
    }
];

export const iconMarkup: Record<IconName, string> = {
    mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M4 7l7.4 5.3a2 2 0 002.2 0L21 7"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M4.98 3.5a2.5 2.5 0 11.02 5 2.5 2.5 0 01-.02-5zm.02 5.75H2.25v11.25h2.75V9.25zM9 9.25H6.25v11.25H9v-6.05c0-1.62.83-2.47 2.15-2.47 1.04 0 1.68.73 1.68 2.47v6.05h2.75v-6.52c0-3.14-1.7-4.61-3.97-4.61-1.83 0-2.64 1-3.09 1.7H9V9.25z"/></svg>`,
    github: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2a10 10 0 00-3.16 19.49c.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.45-1.14-1.1-1.44-1.1-1.44-.9-.62.07-.6.07-.6 1 .07 1.53 1.04 1.53 1.04.89 1.52 2.34 1.08 2.9.83.09-.64.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 015 0c1.9-1.29 2.74-1.02 2.74-1.02.55 1.38.2 2.4.1 2.65.64.7 1.02 1.59 1.02 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.91.68 1.84 0 1.32-.01 2.39-.01 2.72 0 .27.18.59.69.49A10 10 0 0012 2z"/></svg>`
};

export const accentStyles: Record<Required<ContactChannel>['accent'], { card: string; icon: string; arrow: string }> = {
    emerald: {
        card:
            'border-emerald-500/30 hover:border-emerald-400/60 focus-visible:border-emerald-300/70 focus-visible:outline focus-visible:outline-emerald-400/40',
        icon: 'bg-emerald-500/15 text-emerald-300 group-hover:bg-emerald-500/25',
        arrow: 'text-emerald-200'
    },
    sky: {
        card:
            'border-sky-500/30 hover:border-sky-400/60 focus-visible:border-sky-300/70 focus-visible:outline focus-visible:outline-sky-400/40',
        icon: 'bg-sky-500/15 text-sky-300 group-hover:bg-sky-500/25',
        arrow: 'text-sky-200'
    },
    violet: {
        card:
            'border-violet-500/30 hover:border-violet-400/60 focus-visible:border-violet-300/70 focus-visible:outline focus-visible:outline-violet-400/40',
        icon: 'bg-violet-500/15 text-violet-300 group-hover:bg-violet-500/25',
        arrow: 'text-violet-200'
    }
};

export const prompt = {
    user: 'guest',
    host: 'brethagen.dev',
    path: '~'
};

export const bootSequence: BootStep[] = [
    {
        message: 'brethagen.dev · establishing session…',
        delay: 450,
        hint: 'Establishing session'
    },
    {
        message: 'Loading profile context…',
        delay: 620,
        hint: 'Loading profile context'
    },
    {
        message: 'Session ready. Type `help` to list available commands.',
        delay: 580,
        hint: 'Finalizing startup'
    }
];
