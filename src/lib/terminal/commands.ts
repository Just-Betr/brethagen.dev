import type {
    CommandDefinition,
    ContactChannel,
    HelpPayload,
    Profile
} from './types';
import { contactChannels as defaultChannels, profile as defaultProfile } from './data';

export type CommandContext = {
    profile?: Profile;
    contactChannels?: ContactChannel[];
};

export const createCommandDefinitions = (context?: CommandContext) => {
    const resolvedProfile = context?.profile ?? defaultProfile;
    const resolvedChannels = context?.contactChannels ?? defaultChannels;

    const definitions: CommandDefinition[] = [];

    const buildHelpPayload = (): HelpPayload => ({
        kind: 'help',
        items: definitions.map((cmd) => ({
            label: `/${cmd.label}`,
            synopsis: cmd.synopsis
        }))
    });

    definitions.push(
        {
            key: 'help',
            label: 'help',
            synopsis: 'List commands you can run',
            aliases: ['?', '/help'],
            handler: () => buildHelpPayload()
        },
        {
            key: 'who',
            label: 'who',
            synopsis: 'Learn more about me',
            aliases: ['/who', 'whoami'],
            handler: () => ({ kind: 'who', profile: resolvedProfile })
        },
        {
            key: 'contact',
            label: 'contact',
            synopsis: 'Ways to reach me',
            aliases: ['/contact'],
            handler: () => ({ kind: 'contact', channels: resolvedChannels })
        },
        {
            key: 'clear',
            label: 'clear',
            synopsis: 'Clear the terminal window',
            aliases: ['cls'],
            handler: () => buildHelpPayload()
        }
    );

    return definitions;
};
