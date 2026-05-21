export type ChecklistItem = {
	title: string;
	body: string;
	badge?: string;
	defaultOpen?: boolean;
};

export type CardItem = {
	id: string;
	title: string;
	eyebrow?: string;
	summary: string;
	details?: string;
	icon?: string;
	accent?: 'data' | 'train' | 'deploy' | 'runner';
};

export const prerequisites = [
	{
		title: 'Account and repository access',
		body: 'Confirm you can access the RIA Hub instance, the target repository, and the branches used for data and model work.',
		badge: 'access',
		defaultOpen: true,
	},
	{
		title: 'Git LFS is available',
		body: 'Recordings, datasets, and generated artifacts can be large. Install Git LFS before cloning or pushing repositories that carry RF data.',
		badge: 'storage',
	},
	{
		title: 'Runner capacity exists',
		body: 'Training and packaging actions need an available runner with the required compute profile and permissions.',
		badge: 'runner',
	},
	{
		title: 'A signal problem is defined',
		body: 'Start with a recording, a synthetic generator configuration, or a small modulation classification example.',
		badge: 'data',
	},
] as const satisfies ChecklistItem[];

export const buildOutcomeCards = [
	{
		id: 'dataset',
		eyebrow: 'data',
		title: 'Training-ready dataset',
		summary: 'A curated set of RF slices with labels, metadata, and inspection checks.',
		details: 'This is the handoff from Library, Curator, and Inspector into Model Builder.',
		accent: 'data',
	},
	{
		id: 'model',
		eyebrow: 'train',
		title: 'Model artifact',
		summary: 'A completed training run with metrics and an exportable model artifact.',
		details: 'The artifact path becomes part of the packaging and application composer workflow.',
		accent: 'train',
	},
	{
		id: 'screens',
		eyebrow: 'deploy',
		title: 'Screens app',
		summary: 'A packaged app manifest that can start, stop, stream logs, and show runtime panels.',
		details: 'Success means the app is visible in Screens with a running or ready status.',
		accent: 'deploy',
	},
] as const satisfies CardItem[];

export const setupPaths = [
	{
		id: 'hosted',
		eyebrow: 'start',
		title: 'Explore hosted docs',
		summary: 'Use the docs site to learn the RIA Hub vocabulary and workflow before touching local tools.',
		details: 'Best when you are reviewing concepts or preparing for a guided walkthrough.',
		accent: 'runner',
	},
	{
		id: 'local',
		eyebrow: 'develop',
		title: 'Run locally',
		summary: 'Clone the docs or product repo, install dependencies, and validate changes before opening a PR.',
		details: 'Best for docs authors, component work, and source-referenced guide updates.',
		accent: 'data',
	},
	{
		id: 'instance',
		eyebrow: 'operate',
		title: 'Use an existing instance',
		summary: 'Follow an admin-provided RIA Hub URL, repository, and runner profile.',
		details: 'Best when your team already has data, runners, and packaging targets configured.',
		accent: 'deploy',
	},
] as const satisfies CardItem[];

export const troubleshootingLinks = [
	{
		title: 'Missing LFS objects',
		body: 'Run Git LFS installation and pull commands before assuming the dataset is absent.',
		badge: 'lfs',
	},
	{
		title: 'No runner available',
		body: 'Check runner status before launching training, HPO, export, or packaging workflows.',
		badge: 'runner',
	},
	{
		title: 'Screens app does not start',
		body: 'Confirm the manifest references a valid model path and the runtime target profile matches the packaged app.',
		badge: 'screens',
	},
] as const satisfies ChecklistItem[];
