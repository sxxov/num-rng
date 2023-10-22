<script lang="ts">
	import { T, forwardEventHandlers, type Props } from '@threlte/core';
	import { useSuspense } from '@threlte/extras';
	import type { Object3D } from 'three';
	import { createPart } from '../gltf/part';
	import { raise } from '@sxxov/ut/functional';
	import { UnreachableError } from '@sxxov/ut/errors';

	type $$Props = Props<Object3D> & {
		gltf: typeof gltf;
		clone?: typeof clone;
		ref?: typeof ref;
	};

	export let gltf: Record<any, any>;
	export let clone = true;
	const setRef = (r: Object3D) => (ref = r);
	export let ref: Object3D | undefined = undefined;

	const suspend = useSuspense();
	const component = forwardEventHandlers();
</script>

{#await suspend(createPart(gltf)) then { object }}
	{#if object}
		{@const ref = clone ? object.clone(true) : object}
		{(setRef(ref), '')}
		<T
			is={ref}
			bind:this={$component}
			receiveShadow
			castShadow
			{...$$restProps}
		>
			<slot ref={ref ?? raise(new UnreachableError())} />
		</T>
	{/if}
{/await}
