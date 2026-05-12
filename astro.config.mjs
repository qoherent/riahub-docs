// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.riahub.ai',
	integrations: [
		starlight({
			title: 'RIA Hub Docs',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/qoherent/riahub-docs' }],
			customCss: ['./src/styles/custom.css'],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'guides/introduction' },
					],
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
					label: 'RIA Testbed Conductor',
					items: [{ autogenerate: { directory: 'guides/conductor' } }],
				},
				{
					label: 'Reference',
					items: [{ autogenerate: { directory: 'reference' } }],
				},
			],
		}),
	],
});
