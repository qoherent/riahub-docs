// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.riahub.ai',
	integrations: [
		svelte(),
		starlight({
			title: 'RIA Hub Docs',
			logo: {
				src: './public/ria/brand/combination-mark.svg',
				alt: 'RIA Hub Docs',
				replacesTitle: true,
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/qoherent/riahub-docs' }],
			customCss: ['./src/styles/custom.css', './src/styles/ria-docs.css'],
			expressiveCode: {
				themes: ['github-dark', 'github-light'],
				styleOverrides: {
					frames: {
						terminalTitlebarDotsOpacity: '0',
					},
				},
			},
			head: [
				{
					tag: 'script',
					attrs: { src: '/collapsible-headings.js', defer: true },
				},
			],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'guides/introduction' },
						{ label: 'Who Is RIA Hub For?', slug: 'guides/target-users' },
						{ label: 'Getting Started', slug: 'guides/getting-started' },
					],
				},
				{
					label: 'Reference',
					items: [
						{
							label: 'Platform',
							items: [{ autogenerate: { directory: 'guides/platform' } }],
						},
						{
							label: 'RIA Testbed Conductor',
							items: [{ autogenerate: { directory: 'guides/conductor' } }],
						},
					],
				},
				{
					label: 'Tutorials',
					items: [
						{ label: 'End-to-End Onboarding', slug: 'guides/tutorials/e2e-onboarding' },
						{
							label: 'Recording',
							items: [{ autogenerate: { directory: 'guides/recordings' } }],
						},
						{
							label: 'Dataset Manager',
							items: [{ autogenerate: { directory: 'guides/dataset-manager' } }],
						},
						{
							label: 'Model Builder',
							items: [{ autogenerate: { directory: 'guides/model-builder' } }],
						},
						{
							label: 'Application Packager',
							items: [{ autogenerate: { directory: 'guides/application-packager' } }],
						},
					],
				},
				{
					label: 'RIA Toolkit OSS',
					items: [
						{ label: 'Overview', slug: 'ria-toolkit-oss' },
						{
							label: 'Introduction',
							items: [{ autogenerate: { directory: 'ria-toolkit-oss/introduction' } }],
						},
						{
							label: 'SDR Guides',
							items: [{ autogenerate: { directory: 'ria-toolkit-oss/sdr-guides' } }],
						},
						{
							label: 'Examples',
							items: [{ autogenerate: { directory: 'ria-toolkit-oss/examples' } }],
						},
						{
							label: 'API Reference',
							items: [{ autogenerate: { directory: 'ria-toolkit-oss/api-reference' } }],
						},
					],
				},
				/*
				{
					label: 'Slop Reference',
					items: [
						{ label: 'Basic Training Materials', slug: 'guides/tutorials/basic-training-materials' },
						{ label: 'Creating Recordings', slug: 'guides/tutorials/create-recordings' },
						{ label: 'Curation and Labeling', slug: 'guides/tutorials/curation-and-labeling' },
						{ label: 'Inspect a Dataset', slug: 'guides/tutorials/inspect-a-dataset' },
						{ label: 'Package an Application', slug: 'guides/tutorials/package-an-application' },
						{ label: 'Screens App', slug: 'guides/tutorials/screens-app' },
						{ label: 'Synthesis and Local Capture', slug: 'guides/tutorials/synthesis-and-local-capture' },
						{ label: 'Train a Model', slug: 'guides/tutorials/train-a-model' },
					],
				},
				*/
			],
		}),
	],
});
