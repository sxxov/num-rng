<script
	lang="ts"
	context="module"
>
	export const ambientRendererSizeContextKey = Symbol('ambientRendererSize');
	export const ambientInteractivityContextKey = Symbol('ambientInteractive');
</script>

<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { whenResize } from '@sxxov/sv/ut/action/actions';
	import { Store } from '@sxxov/ut/store';
	import type { Size } from '@sxxov/ut/viewport';
	import { client, inner } from '@sxxov/ut/viewport';
	import { Canvas, forwardEventHandlers, useFrame } from '@threlte/core';
	import { interactivity, useInteractivity } from '@threlte/extras';
	import {
		setContext,
		type ComponentEvents,
		type ComponentProps,
	} from 'svelte';
	import type { AmbientInteractivity } from './AmbientInteractivity';
	import type { AmbientRendererSizeContext } from './AmbientRendererSizeContext';

	type $$Props = ComponentProps<Canvas>;
	type $$Events = ComponentEvents<Canvas>;

	const component = forwardEventHandlers();
	let active = false;

	let width = 0;
	let height = 0;

	let portalDiv: HTMLDivElement;
	const portal = (content: HTMLElement, portal: HTMLElement) => {
		portal.appendChild(content);

		return {
			destroy() {
				portal.removeChild(content);
			},
		};
	};

	$: vw = Math.max($inner.width, $client.width);
	$: vh = Math.max($inner.height, $client.height);

	const rendererSize = new Store<Size>({
		width: vw || 1,
		height: vh || 1,
	});
	$: $rendererSize.width = width || vw || 1;
	$: $rendererSize.height = height || vh || 1;
	setContext<AmbientRendererSizeContext>(
		ambientRendererSizeContextKey,
		rendererSize,
	);

	const setInteractivity = (v: ReturnType<typeof interactivity>) => {
		interactivityCtx.interactivity = v;
	};
	let interactivityCtx: AmbientInteractivity = {
		interactivity: undefined as any,
	};
	$: interactive = interactivityCtx.interactivity?.enabled;

	beforeNavigate(() => {
		interactive?.set(false);
	});

	setContext<AmbientInteractivity>(
		ambientInteractivityContextKey,
		interactivityCtx,
	);
</script>

<div class="ambient-canvas">
	<div
		class="canvas"
		class:active
		class:interactive={$interactive}
		use:whenResize={({ width: w, height: h }) => {
			[width, height] = [w, h];
		}}
	>
		<Canvas
			{...$$restProps}
			size={$rendererSize}
			bind:this={$component}
		>
			<div use:portal={portalDiv}>
				<slot />
			</div>
			{(useFrame(() => {
				active = true;
			}),
			setInteractivity(interactivity()),
			useInteractivity(),
			'')}
		</Canvas>
	</div>
	<div
		class="portal"
		bind:this={portalDiv}
	></div>
</div>

<style lang="postcss">
	.ambient-canvas {
		display: contents;

		& > .canvas {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100vh;
			height: 100lvh;

			opacity: 0;
			transition: opacity 1s var(----ease-slow-slow);

			z-index: 1;

			& > :global(canvas) {
				user-select: none;
				-webkit-tap-highlight-color: transparent;
			}

			&:not(.interactive) {
				pointer-events: none;
			}

			&.active {
				opacity: 1;
			}
		}

		& > .portal {
			display: contents;
		}
	}
</style>
