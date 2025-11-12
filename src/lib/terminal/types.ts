export type IconName = 'mail' | 'linkedin' | 'github';

export type ContactChannel = {
    label: string;
    value: string;
    href: string;
    icon: IconName;
    accent: 'emerald' | 'sky' | 'violet';
};

export type Profile = {
    name: string;
    title: string;
    location: string;
    summary: string;
    highlights: string[];
};

export type HelpPayload = {
    kind: 'help';
    items: { label: string; synopsis: string }[];
};

export type WhoPayload = {
    kind: 'who';
    profile: Profile;
};

export type ContactPayload = {
    kind: 'contact';
    channels: ContactChannel[];
};

export type UnknownPayload = {
    kind: 'unknown';
    command: string;
};

export type CommandPayload = HelpPayload | WhoPayload | ContactPayload | UnknownPayload;

export type Entry =
    | { id: number; type: 'system'; message: string }
    | { id: number; type: 'input'; command: string }
    | { id: number; type: 'output'; payload: CommandPayload };

export type CommandDefinition = {
    key: string;
    label: string;
    synopsis: string;
    aliases?: string[];
    handler: () => CommandPayload;
};

export type BootStep = {
    message: string;
    delay: number;
    hint: string;
};
