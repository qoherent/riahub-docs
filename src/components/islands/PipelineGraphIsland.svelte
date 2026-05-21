<script lang="ts">
	import { onMount } from 'svelte';
	import type { Workflow, WorkflowNode } from '@data/docsWorkflows';

	export let workflow: Workflow;
	export let activeNode: string | undefined = undefined;
	export let showDetails = true;

	let selectedId = activeNode ?? workflow.nodes[0]?.id;
	$: selected = workflow.nodes.find((node) => node.id === selectedId) ?? workflow.nodes[0];

	const stageColor: Record<WorkflowNode['stage'], string> = {
		capture: 'var(--ria-secondary)',
		curate: 'var(--ria-primary-high)',
		inspect: 'var(--ria-warning)',
		train: 'var(--ria-tertiary)',
		package: 'var(--ria-primary)',
		screens: 'var(--ria-success)',
	};

	function selectNode(id: string) {
		selectedId = id;
		if (typeof history !== 'undefined') {
			history.replaceState(null, '', `#${id}`);
		}
	}

	function onNodeKey(event: KeyboardEvent, id: string) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			selectNode(id);
		}
	}

	function xFor(index: number) {
		if (workflow.nodes.length <= 1) return 500;
		return 80 + index * (840 / (workflow.nodes.length - 1));
	}

	onMount(() => {
		const hashId = location.hash.replace('#', '');
		if (workflow.nodes.some((node) => node.id === hashId)) selectedId = hashId;
	});
</script>

<section class="pipeline-graph ria-graph">
	<header>
		<span>workflow</span>
		<h3>{workflow.title}</h3>
		<p>{workflow.summary}</p>
	</header>
	<svg viewBox="0 0 1000 230" role="img" aria-label={`${workflow.title} workflow graph`}>
		{#each workflow.edges as edge}
			{@const fromIndex = workflow.nodes.findIndex((node) => node.id === edge.from)}
			{@const toIndex = workflow.nodes.findIndex((node) => node.id === edge.to)}
			{#if fromIndex >= 0 && toIndex >= 0}
				<line x1={xFor(fromIndex) + 52} y1="92" x2={xFor(toIndex) - 52} y2="92" />
				{#if edge.label}
					<text x={(xFor(fromIndex) + xFor(toIndex)) / 2} y="64">{edge.label}</text>
				{/if}
			{/if}
		{/each}
		{#each workflow.nodes as node, index}
			<g
				role="button"
				tabindex="0"
				aria-label={`${node.label}: ${node.summary}`}
				aria-pressed={node.id === selected?.id}
				class:selected={node.id === selected?.id}
				onclick={() => selectNode(node.id)}
				onkeydown={(event) => onNodeKey(event, node.id)}
			>
				<rect x={xFor(index) - 54} y="70" width="108" height="46" rx="10" style={`--node-color: ${stageColor[node.stage]}`} />
				<text class="node-label" x={xFor(index)} y="97">{node.label}</text>
				<circle cx={xFor(index)} cy="145" r="8" style={`--node-color: ${stageColor[node.stage]}`} />
			</g>
		{/each}
	</svg>
	<ol class="mobile-steps">
		{#each workflow.nodes as node}
			<li>
				<button type="button" class:selected={node.id === selected?.id} onclick={() => selectNode(node.id)}>
					<strong>{node.label}</strong>
					<span>{node.summary}</span>
				</button>
			</li>
		{/each}
	</ol>
	{#if showDetails && selected}
		<aside class="details" aria-live="polite">
			<span>{selected.stage}</span>
			<h4>{selected.label}</h4>
			<p>{selected.summary}</p>
			<dl>
				<div>
					<dt>Where this appears in RIA Hub</dt>
					<dd>{selected.appearsIn ?? 'RIA Hub workflow pages.'}</dd>
				</div>
				<div>
					<dt>What you need next</dt>
					<dd>{selected.needsNext ?? 'The output from this workflow step.'}</dd>
				</div>
			</dl>
			{#if selected.docsHref}<a href={selected.docsHref}>Open guide</a>{/if}
		</aside>
	{/if}
</section>

<style>
	.pipeline-graph {
		margin: 1.5rem 0;
		padding: 1rem;
	}

	header span,
	.details > span {
		color: var(--ria-secondary);
		font: 700 0.72rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	header h3,
	header p,
	.details h4,
	.details p {
		margin: 0;
	}

	header h3 {
		margin-top: 0.45rem;
		color: var(--ria-text-primary);
	}

	header p {
		margin-top: 0.45rem;
		color: var(--ria-text-secondary);
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		margin-top: 1rem;
	}

	line {
		stroke: var(--ria-border-strong);
		stroke-width: 3;
		stroke-linecap: round;
	}

	svg text {
		fill: var(--ria-text-muted);
		font: 700 16px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		text-anchor: middle;
	}

	.node-label {
		fill: var(--ria-text-primary);
		font: 750 13px system-ui, sans-serif;
	}

	rect {
		fill: var(--ria-neutral-surface);
		stroke: var(--node-color);
		stroke-width: 2;
	}

	circle {
		fill: var(--node-color);
		filter: drop-shadow(0 0 8px var(--node-color));
	}

	g {
		cursor: pointer;
	}

	g.selected rect,
	g:focus-visible rect {
		fill: color-mix(in srgb, var(--node-color) 22%, var(--ria-neutral-surface));
	}

	.mobile-steps {
		display: none;
		margin: 1rem 0 0;
		padding: 0;
		list-style: none;
	}

	.mobile-steps li + li {
		margin-top: 0.6rem;
	}

	.mobile-steps button {
		display: grid;
		width: 100%;
		gap: 0.35rem;
		border: 1px solid var(--ria-border-subtle);
		border-radius: 12px;
		background: var(--ria-neutral-surface);
		padding: 0.8rem;
		color: var(--ria-text-primary);
		text-align: left;
	}

	.mobile-steps button span {
		color: var(--ria-text-secondary);
	}

	.mobile-steps button.selected {
		border-color: var(--ria-secondary);
	}

	.details {
		margin-top: 1rem;
		border: 1px solid var(--ria-border-subtle);
		border-radius: 16px;
		background: rgba(255, 255, 255, 0.035);
		padding: 1rem;
	}

	.details h4 {
		margin-top: 0.4rem;
	}

	.details p,
	dd {
		color: var(--ria-text-secondary);
	}

	dl {
		display: grid;
		gap: 0.75rem;
		margin: 1rem 0;
	}

	dt {
		color: var(--ria-text-primary);
		font-weight: 750;
	}

	dd {
		margin: 0.25rem 0 0;
	}

	.details a {
		color: var(--ria-primary-high);
		font-weight: 750;
	}

	@media (max-width: 42rem) {
		svg {
			display: none;
		}

		.mobile-steps {
			display: block;
		}
	}
</style>
