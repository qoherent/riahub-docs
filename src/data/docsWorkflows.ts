export type WorkflowStage = 'capture' | 'curate' | 'inspect' | 'train' | 'package' | 'screens';

export type WorkflowNode = {
	id: string;
	label: string;
	stage: WorkflowStage;
	summary: string;
	docsHref?: string;
	appearsIn?: string;
	needsNext?: string;
};

export type WorkflowEdge = {
	from: string;
	to: string;
	label?: string;
};

export type Workflow = {
	title: string;
	summary: string;
	nodes: WorkflowNode[];
	edges: WorkflowEdge[];
};

export const workflows = {
	'capture-to-screens': {
		title: 'Capture to Screens',
		summary: 'The tested RIA Hub path from upload or synthesis through curation, training, packaging, and a running Screens app.',
		nodes: [
			{
				id: 'capture',
				label: 'Capture or synthesize',
				stage: 'capture',
				summary: 'Start from a local recording, uploaded RF sample, or synthetic signal problem.',
				docsHref: '/guides/synthesis-and-local-capture/',
				appearsIn: 'Generator, Library, and local capture workflows.',
				needsNext: 'A recording or generated dataset tracked in the Library.',
			},
			{
				id: 'curate',
				label: 'Curate and label',
				stage: 'curate',
				summary: 'Select source files, slice useful intervals, and attach labels or qualifiers.',
				docsHref: '/guides/curation-and-labeling/',
				appearsIn: 'Dataset Manager Curator.',
				needsNext: 'Enough labeled slices for the target class or scenario.',
			},
			{
				id: 'inspect',
				label: 'Inspect readiness',
				stage: 'inspect',
				summary: 'Review balance, metadata, empty states, and recommendations before training.',
				docsHref: '/guides/inspect-a-dataset/',
				appearsIn: 'Dataset Manager Inspector.',
				needsNext: 'A dataset with valid labels, splits, and sample shape.',
			},
			{
				id: 'train',
				label: 'Train model',
				stage: 'train',
				summary: 'Choose a repository, runner, dataset, template, and mode to launch a workflow run.',
				docsHref: '/guides/train-a-model/',
				appearsIn: 'Model Builder and Training Dashboard.',
				needsNext: 'A successful run with metrics and exportable artifacts.',
			},
			{
				id: 'package',
				label: 'Package app',
				stage: 'package',
				summary: 'Connect model artifacts into an application pipeline and validate target runtime settings.',
				docsHref: '/guides/application-packager/',
				appearsIn: 'Engine Builder and Application Composer.',
				needsNext: 'A valid manifest with model path, inference block, and sink or device settings.',
			},
			{
				id: 'screens',
				label: 'Run in Screens',
				stage: 'screens',
				summary: 'Start, stop, inspect logs, and view manifest panels in the Screens runtime.',
				docsHref: '/guides/screens/',
				appearsIn: 'Screens list, app runtime, and Studio.',
				needsNext: 'Runtime access and a packaged app manifest.',
			},
		],
		edges: [
			{ from: 'capture', to: 'curate', label: 'source data' },
			{ from: 'curate', to: 'inspect', label: 'dataset draft' },
			{ from: 'inspect', to: 'train', label: 'trainable set' },
			{ from: 'train', to: 'package', label: 'artifact' },
			{ from: 'package', to: 'screens', label: 'manifest' },
		],
	},
	dataset: {
		title: 'Dataset Preparation',
		summary: 'Create or capture RF examples, track them in the Library, then curate and inspect the dataset.',
		nodes: [
			{
				id: 'capture',
				label: 'Synthesize or capture',
				stage: 'capture',
				summary: 'Generate examples or collect local RF captures for the problem.',
				docsHref: '/guides/synthesis-and-local-capture/',
				appearsIn: 'Generator and local capture setup.',
				needsNext: 'A concrete signal problem and source files.',
			},
			{
				id: 'library',
				label: 'Track in Library',
				stage: 'capture',
				summary: 'Store large recordings and datasets with Git LFS-backed Library metadata.',
				docsHref: '/guides/getting-started/',
				appearsIn: 'Library browser and repository storage.',
				needsNext: 'Repository, branch, directory, and file OIDs.',
			},
			{
				id: 'curate',
				label: 'Curator',
				stage: 'curate',
				summary: 'Filter, select, slice, and label the candidate examples.',
				docsHref: '/guides/curation-and-labeling/',
				appearsIn: 'Curator wizard.',
				needsNext: 'Labels, qualifiers, and task progress completion.',
			},
			{
				id: 'inspect',
				label: 'Inspector',
				stage: 'inspect',
				summary: 'Check balance, stats, recommendations, and per-class controls.',
				docsHref: '/guides/inspect-a-dataset/',
				appearsIn: 'Inspector tabs and overview cards.',
				needsNext: 'A clean dataset ready for Model Builder.',
			},
		],
		edges: [
			{ from: 'capture', to: 'library' },
			{ from: 'library', to: 'curate' },
			{ from: 'curate', to: 'inspect' },
		],
	},
	training: {
		title: 'Training Run',
		summary: 'Move from a validated dataset to a runner-backed training job, metrics, and exportable artifact.',
		nodes: [
			{
				id: 'dataset',
				label: 'Dataset',
				stage: 'inspect',
				summary: 'Use a labeled dataset with consistent sample shape and metadata.',
				docsHref: '/guides/basic-training-materials/',
				appearsIn: 'Dataset selector and adapters.',
				needsNext: 'A known label target and split assumptions.',
			},
			{
				id: 'template',
				label: 'Model template',
				stage: 'train',
				summary: 'Select a template such as WavesFM or another configured training path.',
				docsHref: '/guides/train-a-model/',
				appearsIn: 'Model Builder form.',
				needsNext: 'Template parameters and compatible data transforms.',
			},
			{
				id: 'runner',
				label: 'Runner',
				stage: 'train',
				summary: 'Choose a runner that can execute the generated workflow.',
				docsHref: '/guides/train-a-model/',
				appearsIn: 'Runner dropdown and Actions-backed execution.',
				needsNext: 'Queue capacity and permissions.',
			},
			{
				id: 'train',
				label: 'Training run',
				stage: 'train',
				summary: 'Monitor job steps, duration, status, and logs.',
				docsHref: '/guides/train-a-model/',
				appearsIn: 'Training Dashboard.',
				needsNext: 'Successful metrics and generated artifacts.',
			},
			{
				id: 'metrics',
				label: 'Metrics',
				stage: 'train',
				summary: 'Compare loss, accuracy, model candidates, and run history.',
				docsHref: '/guides/train-a-model/',
				appearsIn: 'Run history and model comparison UI.',
				needsNext: 'A selected artifact for packaging.',
			},
			{
				id: 'artifact',
				label: 'Artifact export',
				stage: 'package',
				summary: 'Export an ONNX or compatible model artifact for downstream application packaging.',
				docsHref: '/guides/application-packager/',
				appearsIn: 'Model export and Application Composer model path fields.',
				needsNext: 'A pipeline block that references the artifact path.',
			},
		],
		edges: [
			{ from: 'dataset', to: 'template' },
			{ from: 'template', to: 'runner' },
			{ from: 'runner', to: 'train' },
			{ from: 'train', to: 'metrics' },
			{ from: 'metrics', to: 'artifact' },
		],
	},
} as const satisfies Record<'capture-to-screens' | 'dataset' | 'training', Workflow>;

export type WorkflowId = keyof typeof workflows;
