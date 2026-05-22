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
					label: 'Tutorials',
					items: [{ autogenerate: { directory: 'guides/tutorials' } }],
				},
				{
					label: 'Platform',
					items: [{ autogenerate: { directory: 'guides/platform' } }],
				},
				{
					label: 'Dataset Manager',
					items: [{ autogenerate: { directory: 'guides/dataset-manager' } }],
				},
				{
					label: 'Recordings',
					items: [{ autogenerate: { directory: 'guides/recordings' } }],
				},
				{
					label: 'Model Builder',
					items: [{ autogenerate: { directory: 'guides/model-builder' } }],
				},
				{
					label: 'RIA Testbed Conductor',
					items: [{ autogenerate: { directory: 'guides/conductor' } }],
				},
			],
		}),
	],
});
