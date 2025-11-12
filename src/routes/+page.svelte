<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { accentStyles, bootSequence, createCommandDefinitions, iconMarkup, prompt } from '$lib';
	import type { CommandDefinition, CommandPayload, Entry } from '$lib';

	const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

	let entryId = 0;
	const nextId = () => ++entryId;

	const commandDefinitions: CommandDefinition[] = createCommandDefinitions();

	let entries: Entry[] = [];
	let command = '';
	let history: string[] = [];
	let historyIndex = -1;
	let logContainer: HTMLDivElement | undefined;
	let inputEl: HTMLInputElement | undefined;
	let isBooting = true;
	let bootProgress = 0;
	let bootHint = bootSequence[0]?.hint ?? 'Starting';

	const isClearCommand = (value: string) =>
		value === 'clear' || value === '/clear' || value === 'cls';

	const resolveCommand = (value: string) => {
		const normalized = value.replace(/^\//, '').toLowerCase();
		return commandDefinitions.find(
			(cmd) =>
				cmd.key === normalized ||
				cmd.aliases?.map((alias) => alias.replace(/^\//, '').toLowerCase()).includes(normalized)
		);
	};

	const resetTerminal = () => {
		entries = [
			{
				id: nextId(),
				type: 'system',
				message: 'Screen cleared. Type `help` if you need the command list.'
			}
		];
	};

	const focusPrompt = () => {
		inputEl?.focus();
	};

	const scrollLogToBottom = async () => {
		await tick();
		logContainer?.scrollTo({ top: logContainer.scrollHeight, behavior: 'smooth' });
	};

	const handleSubmit = async () => {
		if (isBooting) {
			return;
		}

		const raw = command.trim();
		if (!raw) {
			return;
		}

		history = [...history, raw];
		historyIndex = -1;

		if (isClearCommand(raw.toLowerCase())) {
			command = '';
			resetTerminal();
			await tick();
			return;
		}

		const inputEntry: Entry = { id: nextId(), type: 'input', command: raw };
		const definition = resolveCommand(raw);

		const payload: CommandPayload = definition
			? definition.handler()
			: { kind: 'unknown', command: raw };

		const outputEntry: Entry = { id: nextId(), type: 'output', payload };

		entries = [...entries, inputEntry, outputEntry];
		command = '';

		await scrollLogToBottom();
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (isBooting) {
			event.preventDefault();
			return;
		}

		if (event.key === 'ArrowUp') {
			if (history.length === 0) {
				return;
			}

			event.preventDefault();
			historyIndex = historyIndex <= 0 ? history.length - 1 : historyIndex - 1;
			command = history[historyIndex] ?? command;
		} else if (event.key === 'ArrowDown') {
			if (history.length === 0) {
				return;
			}

			event.preventDefault();
			if (historyIndex === -1 || historyIndex === history.length - 1) {
				historyIndex = -1;
				command = '';
			} else {
				historyIndex += 1;
				command = history[historyIndex] ?? '';
			}
		} else if (event.key === 'Tab') {
			event.preventDefault();
			const normalized = command.trim().replace(/^\//, '').toLowerCase();
			if (!normalized) {
				return;
			}

			const match = commandDefinitions.find((cmd) => cmd.key.startsWith(normalized));
			if (match) {
				command = `/${match.label}`;
			}
		}
	};

	const runBootSequence = async () => {
		entries = [];
		bootProgress = 0;
		bootHint = bootSequence[0]?.hint ?? 'Starting';

		for (let i = 0; i < bootSequence.length; i += 1) {
			const step = bootSequence[i];
			bootHint = step.hint;
			bootProgress = Math.min(95, Math.round((i / bootSequence.length) * 100));
			await tick();
			await sleep(step.delay);
			entries = [...entries, { id: nextId(), type: 'system', message: step.message }];
			bootProgress = Math.round(((i + 1) / bootSequence.length) * 100);
			bootHint = bootSequence[i + 1]?.hint ?? 'Ready';
			await tick();
			logContainer?.scrollTo({ top: logContainer.scrollHeight });
		}

		isBooting = false;
		bootProgress = 100;
		bootHint = 'Ready';
		await tick();
		focusPrompt();
	};

	onMount(() => {
		runBootSequence();
	});
</script>

<svelte:head>
	<title>brethagen.dev</title>
	<meta name="description" content="Browse my website with a terminal interface." />
</svelte:head>

<div class="relative min-h-screen overflow-hidden bg-neutral-950 text-zinc-100">
	<div aria-hidden="true" class="pointer-events-none">
		<div class="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl"></div>
		<div
			class="absolute right-0 bottom-0 h-[28rem] w-[28rem] rounded-full bg-sky-500/15 blur-3xl"
		></div>
	</div>

	<div
		class="relative mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8"
	>
		<div
			class="w-full rounded-2xl border border-white/10 bg-neutral-900/70 shadow-[0_40px_120px_-45px_rgba(16,185,129,0.45)] backdrop-blur-xl sm:rounded-3xl"
		>
			<div class="flex flex-wrap items-center gap-3 border-b border-white/10 px-6 py-4">
				<div class="flex items-center gap-2">
					<span class="inline-flex h-3 w-3 rounded-full bg-rose-400"></span>
					<span class="inline-flex h-3 w-3 rounded-full bg-amber-400"></span>
					<span class="inline-flex h-3 w-3 rounded-full bg-emerald-400"></span>
				</div>
				<span class="text-[0.65rem] tracking-[0.3em] text-white/50 uppercase sm:text-xs">
					{prompt.user}@{prompt.host}
				</span>
			</div>

			<div class="flex flex-col px-4 py-6 sm:px-8 sm:py-8">
				<div class="mb-6 space-y-2 text-sm text-white/50 sm:text-base">
					<p class="font-medium text-white/70">
						{isBooting ? 'Initializing session…' : 'Terminal ready.'}
					</p>
					<p>
						{#if isBooting}
							{bootHint}
						{:else}
							Type <span class="text-emerald-300">help</span> to list commands, or press
							<span class="text-sky-300">Tab</span> for autocomplete.
						{/if}
					</p>
					{#if isBooting}
						<div class="mt-4 space-y-3">
							<div
								class="flex items-center gap-3 text-xs tracking-[0.35em] text-white/45 uppercase"
							>
								<span
									class="inline-flex h-3 w-3 shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-transparent"
								></span>
								<span>Boot sequence</span>
							</div>
							<div class="h-1 w-full overflow-hidden rounded-full bg-white/10">
								<div
									class="h-full origin-left rounded-full bg-emerald-400/80 transition-[width] duration-500 ease-out"
									style={`width: ${bootProgress}%`}
								></div>
							</div>
						</div>
					{/if}
				</div>

				<div class="relative">
					<div
						bind:this={logContainer}
						class="max-h-[65vh] space-y-5 overflow-y-auto pr-1 text-sm leading-relaxed sm:max-h-[28rem] sm:text-base"
					>
						{#if isBooting && entries.length === 0}
							<div class="space-y-4">
								<div class="h-3 w-1/2 animate-pulse rounded-full bg-white/10"></div>
								<div class="h-3 w-2/3 animate-pulse rounded-full bg-white/10"></div>
								<div class="h-3 w-1/3 animate-pulse rounded-full bg-white/10"></div>
							</div>
						{/if}
						{#each entries as entry (entry.id)}
							{#if entry.type === 'system'}
								<p class="text-xs tracking-[0.4em] text-emerald-300/70 uppercase">
									{entry.message}
								</p>
							{:else if entry.type === 'input'}
								<div class="flex flex-wrap items-center gap-x-2 text-sm sm:text-base">
									<span class="text-sky-300">{prompt.user}@{prompt.host}</span>
									<span class="text-white/30">{prompt.path}</span>
									<span class="text-emerald-300">$</span>
									<span class="text-white">{entry.command}</span>
								</div>
							{:else if entry.type === 'output'}
								{#if entry.payload.kind === 'help'}
									<div class="space-y-3">
										<p class="text-white/70">Available commands:</p>
										<div class="grid gap-3 sm:grid-cols-2">
											{#each entry.payload.items as item}
												<div
													class="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 shadow-inner shadow-white/5 transition hover:border-emerald-400/40"
												>
													<p class="font-semibold text-emerald-300">{item.label}</p>
													<p class="text-sm text-white/60">{item.synopsis}</p>
												</div>
											{/each}
										</div>
									</div>
								{:else if entry.payload.kind === 'who'}
									<div class="space-y-4">
										<div>
											<p class="text-2xl font-semibold text-emerald-300">
												{entry.payload.profile.name}
											</p>
											<p class="text-sm tracking-[0.35em] text-white/40 uppercase">
												{entry.payload.profile.title}
											</p>
										</div>
										<p class="max-w-2xl text-white/70">{entry.payload.profile.summary}</p>
										<p class="text-sm text-white/50">{entry.payload.profile.location}</p>
										<ul class="grid gap-3 text-white/65">
											{#each entry.payload.profile.highlights as highlight}
												<li class="flex items-start gap-3">
													<span
														class="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-emerald-400"
													></span>
													<span class="text-white/70">{highlight}</span>
												</li>
											{/each}
										</ul>
									</div>
								{:else if entry.payload.kind === 'contact'}
									<div class="space-y-3">
										<p class="text-white/70">Reach out via any channel below:</p>
										<div class="grid gap-3 sm:grid-cols-2">
											{#each entry.payload.channels as channel}
												<a
													class={`group relative flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 transition ${accentStyles[channel.accent].card}`}
													href={channel.href}
													target="_blank"
													rel="noreferrer"
												>
													<span
														class={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl backdrop-blur ${accentStyles[channel.accent].icon}`}
													>
														{@html iconMarkup[channel.icon]}
													</span>
													<div class="flex-1">
														<p class="text-xs tracking-[0.25em] text-white/40 uppercase">
															{channel.label}
														</p>
														<p class="font-medium text-white/80">{channel.value}</p>
													</div>
													<svg
														aria-hidden="true"
														class={`size-4 shrink-0 transition-transform duration-200 ${accentStyles[channel.accent].arrow} group-hover:translate-x-1.5`}
														fill="none"
														stroke="currentColor"
														stroke-width="1.6"
														viewBox="0 0 24 24"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path d="M5 12h14" stroke-linecap="round" />
														<path
															d="M13 6l6 6-6 6"
															stroke-linecap="round"
															stroke-linejoin="round"
														/>
													</svg>
												</a>
											{/each}
										</div>
									</div>
								{:else if entry.payload.kind === 'unknown'}
									<p class="text-white/60">
										Command not found:
										<span class="text-rose-300">{entry.payload.command}</span>. Try
										<span class="text-emerald-300">help</span> for a list of commands.
									</p>
								{/if}
							{/if}
						{/each}
					</div>
				</div>

				<form
					class="mt-6 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:gap-4 sm:text-base"
					on:submit|preventDefault={handleSubmit}
				>
					<div class="flex flex-wrap items-center gap-2 text-sm sm:text-base">
						<span class="text-sky-300">{prompt.user}@{prompt.host}</span>
						<span class="text-white/30">{prompt.path}</span>
						<span class="text-emerald-300">$</span>
					</div>
					<input
						bind:this={inputEl}
						bind:value={command}
						autocomplete="off"
						autocorrect="off"
						autocapitalize="none"
						spellcheck={false}
						class="w-full min-w-0 flex-1 bg-transparent text-white placeholder:text-white/30 focus:outline-none"
						on:keydown={handleKeydown}
						placeholder={isBooting ? 'Preparing prompt…' : 'Type a command and press Enter'}
						disabled={isBooting}
					/>
				</form>
			</div>
		</div>
	</div>
</div>
