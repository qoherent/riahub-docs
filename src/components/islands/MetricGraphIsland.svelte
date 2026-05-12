<script lang="ts">
	export type MetricSeries = {
		label: string;
		values: number[];
		color?: string;
	};

	export let title: string;
	export let description: string | undefined = undefined;
	export let type: 'bar' | 'line' | 'meter';
	export let series: MetricSeries[] = [];
	export let labels: string[] = [];
	export let unit: string | undefined = undefined;

	const palette = ['#60A5FA', '#2DD4BF', '#F472B6', '#FACC15'];
	$: flatValues = series.flatMap((item) => item.values);
	$: maxValue = Math.max(type === 'meter' ? 40 : 1, ...flatValues);
	$: minValue = Math.min(0, ...flatValues);
	$: span = Math.max(1, maxValue - minValue);

	function colorFor(index: number, item: MetricSeries) {
		return item.color ?? palette[index % palette.length];
	}

	function yFor(value: number) {
		return 230 - ((value - minValue) / span) * 170;
	}

	function linePath(item: MetricSeries) {
		if (!item.values.length) return '';
		return item.values
			.map((value, index) => {
				const x = item.values.length === 1 ? 320 : 50 + index * (540 / (item.values.length - 1));
				const y = yFor(value);
				return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
			})
			.join(' ');
	}
</script>

<section class="metric-graph ria-graph" data-type={type}>
	<header>
		<h3>{title}</h3>
		{#if description}<p>{description}</p>{/if}
	</header>
	<svg viewBox="0 0 640 280" role="img" aria-label={title}>
		<line class="axis" x1="50" y1="230" x2="600" y2="230" />
		<line class="axis" x1="50" y1="40" x2="50" y2="230" />
		{#if type === 'line'}
			{#each series as item, seriesIndex}
				<path d={linePath(item)} stroke={colorFor(seriesIndex, item)} />
				{#each item.values as value, valueIndex}
					{@const x = item.values.length === 1 ? 320 : 50 + valueIndex * (540 / (item.values.length - 1))}
					<circle cx={x} cy={yFor(value)} r="4" fill={colorFor(seriesIndex, item)} />
				{/each}
			{/each}
		{:else if type === 'bar'}
			{@const groupCount = Math.max(labels.length, series[0]?.values.length ?? 0)}
			{@const groupWidth = 520 / Math.max(1, groupCount)}
			{#each Array(groupCount) as _, groupIndex}
				{#each series as item, seriesIndex}
					{@const barWidth = Math.max(10, groupWidth / Math.max(1, series.length) - 8)}
					{@const value = item.values[groupIndex] ?? 0}
					{@const height = ((value - minValue) / span) * 170}
					<rect
						x={60 + groupIndex * groupWidth + seriesIndex * (barWidth + 4)}
						y={230 - height}
						width={barWidth}
						height={height}
						rx="4"
						fill={colorFor(seriesIndex, item)}
					/>
				{/each}
			{/each}
		{:else}
			{@const value = series[0]?.values[0] ?? 0}
			{@const percent = Math.min(100, Math.max(0, (value / maxValue) * 100))}
			<rect class="meter-track" x="70" y="104" width="500" height="46" rx="23" />
			<rect x="70" y="104" width={(500 * percent) / 100} height="46" rx="23" fill={colorFor(0, series[0])} />
			<text class="meter-label" x="320" y="134">{value}{unit ? ` ${unit}` : ''}</text>
		{/if}
		{#if type !== 'meter'}
			{#each labels as label, index}
				{@const x = labels.length === 1 ? 320 : 50 + index * (540 / Math.max(1, labels.length - 1))}
				<text class="tick" x={x} y="258">{label}</text>
			{/each}
		{/if}
	</svg>
	<ul class="legend" aria-label="Series legend">
		{#each series as item, index}
			<li style={`--series-color: ${colorFor(index, item)}`}>{item.label}</li>
		{/each}
	</ul>
	<details class="table-fallback">
		<summary>Data table</summary>
		<table>
			<thead>
				<tr>
					<th>Series</th>
					{#each labels.length ? labels : series[0]?.values ?? [] as label, index}
						<th>{labels.length ? label : `Value ${index + 1}`}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each series as item}
					<tr>
						<th>{item.label}</th>
						{#each item.values as value}
							<td>{value}{unit ? ` ${unit}` : ''}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</details>
</section>

<style>
	.metric-graph {
		margin: 1.5rem 0;
		padding: 1rem;
	}

	header h3,
	header p {
		margin: 0;
	}

	header p {
		margin-top: 0.45rem;
		color: var(--ria-text-secondary);
	}

	svg {
		display: block;
		width: 100%;
		min-width: 0;
		height: auto;
		margin-top: 1rem;
	}

	.axis {
		stroke: var(--ria-border-strong);
		stroke-width: 2;
	}

	path {
		fill: none;
		stroke-width: 4;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.tick,
	.meter-label {
		fill: var(--ria-text-secondary);
		font: 700 13px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		text-anchor: middle;
	}

	.meter-label {
		fill: var(--ria-text-primary);
		font-size: 18px;
	}

	.meter-track {
		fill: var(--ria-code-bg);
		stroke: var(--ria-border-subtle);
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
		margin: 0.75rem 0 0;
		padding: 0;
		list-style: none;
	}

	.legend li {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		color: var(--ria-text-secondary);
		font-size: 0.9rem;
	}

	.legend li::before {
		content: '';
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 9999px;
		background: var(--series-color);
	}

	.table-fallback {
		margin-top: 1rem;
		color: var(--ria-text-secondary);
	}

	table {
		width: 100%;
		margin-top: 0.75rem;
		border-collapse: collapse;
		font-size: 0.9rem;
	}

	th,
	td {
		border: 1px solid var(--ria-border-subtle);
		padding: 0.45rem;
		text-align: left;
	}
</style>
