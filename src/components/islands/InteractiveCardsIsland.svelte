<script lang="ts">
	export type InteractiveCard = {
		id: string;
		title: string;
		eyebrow?: string;
		summary: string;
		details?: string;
		icon?: string;
		accent?: 'data' | 'train' | 'deploy' | 'runner';
	};

	export let title: string | undefined = undefined;
	export let cards: InteractiveCard[] = [];
	export let defaultSelected: string | undefined = undefined;
	export let layout: 'grid' | 'rail' = 'grid';

	let selectedId = defaultSelected ?? cards[0]?.id;
	$: selected = cards.find((card) => card.id === selectedId) ?? cards[0];
</script>

<section class="interactive-cards" data-layout={layout}>
	{#if title}<h3>{title}</h3>{/if}
	<div class="card-grid" role="list">
		{#each cards as card}
			<button
				type="button"
				class:selected={card.id === selected?.id}
				data-accent={card.accent ?? 'runner'}
				aria-pressed={card.id === selected?.id}
				onclick={() => (selectedId = card.id)}
			>
				{#if card.eyebrow}<span class="eyebrow">{card.eyebrow}</span>{/if}
				<strong>{card.title}</strong>
				<span>{card.summary}</span>
			</button>
		{/each}
	</div>
	{#if selected}
		<aside class="details" aria-live="polite" tabindex="0" data-accent={selected.accent ?? 'runner'}>
			<span>{selected.eyebrow ?? 'selected'}</span>
			<h4>{selected.title}</h4>
			<p>{selected.details ?? selected.summary}</p>
		</aside>
	{/if}
</section>

<style>
	.interactive-cards {
		display: grid;
		gap: 1rem;
		margin: 1.5rem 0;
	}

	.interactive-cards h3,
	.details h4,
	.details p {
		margin: 0;
	}

	.card-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
		gap: 0.9rem;
	}

	.interactive-cards[data-layout='rail'] .card-grid {
		grid-template-columns: 1fr;
	}

	button,
	.details {
		--card-accent: var(--ria-primary-high);
		position: relative;
		border: 1px solid var(--ria-border-subtle);
		border-radius: 16px;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 38%),
			var(--ria-neutral-surface);
		color: var(--ria-text-primary);
	}

	button[data-accent='data'],
	.details[data-accent='data'] {
		--card-accent: var(--ria-secondary);
	}

	button[data-accent='train'],
	.details[data-accent='train'] {
		--card-accent: var(--ria-tertiary);
	}

	button[data-accent='deploy'],
	.details[data-accent='deploy'] {
		--card-accent: var(--ria-warning);
	}

	button {
		display: grid;
		gap: 0.55rem;
		min-height: 9.5rem;
		padding: 1rem;
		text-align: left;
		cursor: pointer;
	}

	button::before,
	.details::before {
		content: '';
		position: absolute;
		inset: 0 auto 0 0;
		width: 3px;
		border-radius: 16px 0 0 16px;
		background: var(--card-accent);
	}

	button:hover,
	button.selected {
		border-color: var(--card-accent);
		box-shadow: 0 0 0 1px color-mix(in srgb, var(--card-accent) 28%, transparent), var(--ria-shadow-panel);
	}

	button strong {
		font-size: 1.05rem;
	}

	button span:last-child,
	.details p {
		color: var(--ria-text-secondary);
		line-height: 1.5;
	}

	.eyebrow,
	.details > span {
		color: var(--card-accent);
		font: 700 0.72rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.details {
		padding: 1rem 1rem 1rem 1.2rem;
	}

	.details h4 {
		margin: 0.45rem 0;
		color: var(--ria-text-primary);
	}
</style>
