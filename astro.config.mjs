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
			customCss: ['./src/styles/ria-docs.css'],
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/qoherent/riahub-docs' }],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'guides/introduction' },
					],
				},
				{
					label: 'Guides',
					items: [{ autogenerate: { directory: 'guides' } }],
				},
				{
					label: 'Reference',
					items: [{ autogenerate: { directory: 'reference' } }],
				},
			],
		}),
	],
});
