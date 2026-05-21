export type MetricSeries = {
	label: string;
	values: number[];
	color?: string;
};

export const classBalanceExample = {
	title: 'Class balance preview',
	description: 'Example modulation classes before and after curation checks.',
	type: 'bar',
	labels: ['BPSK', 'QPSK', '8PSK', '16QAM'],
	unit: 'slices',
	series: [
		{ label: 'Before', values: [32, 18, 12, 9], color: '#60A5FA' },
		{ label: 'After', values: [28, 27, 25, 24], color: '#2DD4BF' },
	],
} as const;

export const snrDistributionExample = {
	title: 'SNR sample distribution',
	description: 'A compact meter for expected signal quality in generated examples.',
	type: 'meter',
	labels: ['Preview'],
	unit: 'dB',
	series: [{ label: 'Median SNR', values: [18], color: '#FACC15' }],
} as const;

export const trainingCurveExample = {
	title: 'Training curve placeholder',
	description: 'Example loss and accuracy trend for a short model run.',
	type: 'line',
	labels: ['0', '1', '2', '3', '4', '5'],
	unit: '',
	series: [
		{ label: 'Loss', values: [1.2, 0.94, 0.72, 0.58, 0.47, 0.41], color: '#F472B6' },
		{ label: 'Accuracy', values: [0.42, 0.55, 0.68, 0.74, 0.8, 0.84], color: '#2DD4BF' },
	],
} as const;

export const modelComparisonExample = {
	title: 'Model comparison placeholder',
	description: 'Compare candidate metrics before choosing an export artifact.',
	type: 'bar',
	labels: ['Tiny', 'Base', 'Tuned'],
	unit: 'score',
	series: [{ label: 'Validation score', values: [0.71, 0.79, 0.86], color: '#60A5FA' }],
} as const;
