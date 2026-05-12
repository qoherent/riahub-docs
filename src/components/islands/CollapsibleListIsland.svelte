<script lang="ts">
	export type CollapsibleItem = {
		title: string;
		body: string;
		badge?: string;
		defaultOpen?: boolean;
	};

	export let title: string | undefined = undefined;
	export let intro: string | undefined = undefined;
	export let items: CollapsibleItem[] = [];
	export let variant: 'plain' | 'panel' | 'checklist' = 'plain';

	let openItems = items.map((item) => Boolean(item.defaultOpen));
	let checkedItems = items.map(() => false);

	function setAll(open: boolean) {
		openItems = items.map(() => open);
	}

	function setOpen(index: number, open: boolean) {
		openItems[index] = open;
		openItems = openItems;
	}

	function toggleChecked(index: number) {
		checkedItems[index] = !checkedItems[index];
		checkedItems = checkedItems;
	}
</script>

<section class="ria-collapsible-island" data-variant={variant}>
	{#if title || intro}
		<header>
			{#if title}<h3>{title}</h3>{/if}
			{#if intro}<p>{intro}</p>{/if}
		</header>
	{/if}
	<div class="controls" aria-label="Accordion controls">
		<button type="button" onclick={() => setAll(true)}>Open all</button>
		<button type="button" onclick={() => setAll(false)}>Collapse all</button>
	</div>
	<div class="items">
		{#each items as item, index}
			<details open={openItems[index]} ontoggle={(event) => setOpen(index, event.currentTarget.open)}>
				<summary>
					{#if variant === 'checklist'}
						<input
							type="checkbox"
							checked={checkedItems[index]}
							aria-label={`Mark complete: ${item.title}`}
							onclick={(event) => event.stopPropagation()}
							onchange={() => toggleChecked(index)}
						/>
					{/if}
					<span>{item.title}</span>
					{#if item.badge}<em>{item.badge}</em>{/if}
				</summary>
				<p>{item.body}</p>
			</details>
		{/each}
	</div>
</section>

<style>
	.ria-collapsible-island {
		margin: 1.5rem 0;
	}

	.ria-collapsible-island[data-variant='panel'],
	.ria-collapsible-island[data-variant='checklist'] {
		border: 1px solid var(--ria-border-subtle);
		border-radius: 16px;
		background: var(--ria-neutral-panel);
		padding: 1rem;
	}

	header h3,
	header p {
		margin: 0;
	}

	header h3 {
		color: var(--ria-text-primary);
	}

	header p {
		margin-top: 0.45rem;
		color: var(--ria-text-secondary);
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 1rem 0;
	}

	button {
		border: 1px solid var(--ria-border-subtle);
		border-radius: 9999px;
		background: var(--ria-neutral-surface-raised);
		padding: 0.45rem 0.75rem;
		color: var(--ria-text-primary);
		font-weight: 700;
		cursor: pointer;
	}

	.items {
		display: grid;
		gap: 0.75rem;
	}

	details {
		border: 1px solid var(--ria-border-subtle);
		border-radius: 12px;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.035), transparent),
			var(--ria-neutral-surface);
	}

	summary {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 0.7rem;
		padding: 0.85rem 1rem;
		color: var(--ria-text-primary);
		font-weight: 750;
		cursor: pointer;
	}

	input {
		width: 1rem;
		height: 1rem;
		accent-color: var(--ria-secondary);
	}

	em {
		border-radius: 9999px;
		background: var(--ria-neutral-surface-raised);
		padding: 0.25rem 0.55rem;
		color: var(--ria-secondary);
		font: 700 0.7rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-style: normal;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	details p {
		margin: 0;
		border-top: 1px solid var(--ria-border-subtle);
		padding: 1rem;
		color: var(--ria-text-secondary);
	}
</style>
