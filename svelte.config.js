import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-vercel';

const production = process.env['NODE_ENV'] === 'production';

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: [
		preprocess({
			postcss: true,
		}),
	],
	compilerOptions: {
		dev: !production,
	},
	kit: {
		adapter: adapter(),
		files: {
			appTemplate: 'src/app.html',
		},
	},
	vitePlugin: {},
};
