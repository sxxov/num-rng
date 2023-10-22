<script lang="ts">
	import { Composition, Tween } from '@sxxov/ut/animation';
	import { Bezier } from '@sxxov/ut/bezier';
	import { bezierQuintInOut, bezierQuintOut } from '@sxxov/ut/bezier/beziers';
	import { lerp, map } from '@sxxov/ut/math';
	import type { Size } from '@sxxov/ut/viewport';
	import { T, useFrame } from '@threlte/core';
	import { onDestroy, onMount } from 'svelte';
	import * as THREE from 'three';
	import { FontLoader, TextGeometry } from 'three-stdlib';
	import bigelow_rules from '../../assets/common/font/BigelowRules_Regular.json';
	import { useEphemeralCamera } from '../../lib/3d/camera/useEphemeralCamera';
	import { useAmbientRendererSize } from '../../lib/3d/canvas/useAmbientRendererSize';
	import { getScreenSpaceSizeAtWorldZ } from '../../lib/3d/lmth/getScreenSpaceSizeAtWorldZ';
	import Meta from '../../lib/meta/Meta.svelte';
	import { goto } from '$app/navigation';

	const camera = useEphemeralCamera(new THREE.PerspectiveCamera(75));
	const rendererSize = useAmbientRendererSize()!;
	const z = -10;

	const number = localStorage.getItem('number');
	if (!number) {
		void goto('/');
	}
	const text = String(number ?? '');
	const textSize = 100;
	const textScale = 0.007;
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	const font = new FontLoader().parse(bigelow_rules as any);
	$: geometry = new TextGeometry(text, {
		font,

		size: textSize,
		height: 5,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 10,
		bevelSize: 1,
		bevelOffset: 0,
		letterSpacing: -10,
	});
	$: geometry.center();

	let size: Size = {
		width: 0,
		height: 0,
	};
	let scheduleSizeUpdate = false;
	$: {
		$rendererSize;

		scheduleSizeUpdate = true;
	}
	useFrame(() => {
		if (scheduleSizeUpdate) {
			size = getScreenSpaceSizeAtWorldZ(camera, z);
			scheduleSizeUpdate = false;
		}
	});

	const spinX = new Tween(
		0,
		2 * Math.PI,
		2000,
		new Bezier(1, -0.42, 0.35, 1),
	);
	const spinY = new Tween(
		0,
		2 * Math.PI,
		2000,
		new Bezier(1, -0.42, 0.35, 1),
	);
	const spinComposition = new Composition()
		.add(spinX, {
			time: 20000,
		})
		.add(spinY, {
			time: 40000,
		});
	const pulseIn = new Tween(0, 1, 500, bezierQuintInOut);
	const pulseOut = new Tween(0, -1, 500, bezierQuintOut);
	const pulseComposition = new Composition()
		.add(pulseIn, {
			offset: 0,
		})
		.add(pulseOut, {
			offset: 0,
		});
	const wiggle0 = new Tween(0, 0.5, 300, bezierQuintInOut);
	const wiggle1 = new Tween(0, -1, 300, bezierQuintInOut);
	const wiggle2 = new Tween(0, 0.5, 300, bezierQuintInOut);
	const wiggleComposition = new Composition()
		.add(wiggle0, {
			time: 6000,
		})
		.add(wiggle1, {
			offset: 0,
		})
		.add(wiggle2, {
			offset: 0,
		});
	const introZ = new Tween(10, 0, 1000, bezierQuintInOut);
	const introComposition = new Composition().add(introZ, {
		offset: 0,
	});
	onMount(() => {
		void spinComposition.play(1, Infinity);
		void pulseComposition.play(1, Infinity);
		void wiggleComposition.play(1, Infinity);
		void introComposition.play(1, 1);
	});
	onDestroy(() => {
		spinComposition.stop();
		pulseComposition.stop();
		wiggleComposition.stop();
		introComposition.stop();
	});
</script>

<svelte:window
	on:visibilitychange={async () => {
		if (document.visibilityState === 'visible')
			try {
				await navigator.wakeLock.request('screen');
			} catch {}
	}}
/>
<Meta
	title="{text} — NUM"
	description="The game of teamworking guessing"
	src=""
	keywords={['num', 'number', 'game', 'random', 'rng']}
/>
<T is={camera} />
<T.PointLight
	position={[0, 1, 0]}
	intensity={100}
	color={new THREE.Color(0xffffff)}
	distance={3}
/>
<T.Mesh
	position.z={z + $introZ}
	rotation={[
		$spinX,
		$spinY,
		map($wiggle0 + $wiggle1 + $wiggle2, -0.5, 0.5, -0.05, 0.05),
	]}
	scale={size.height * textScale + lerp($pulseIn + $pulseOut, 0, 0.002)}
>
	<T.MeshPhysicalMaterial
		color={new THREE.Color(0xffffff)}
		roughness={0.5}
		metalness={0.5}
	/>
	<T is={geometry} />
</T.Mesh>

<style lang="postcss">
	.home {
		& > .countdown {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;

			pointer-events: none;

			& > .item {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;

				display: flex;
				justify-content: center;
				align-items: center;

				font-size: 8rem;
				margin: 0;

				animation: fly-in 1.1s var(----ease-fast-slow) both;

				@keyframes fly-in {
					0% {
						transform: scale(1);
						opacity: 0;
					}

					10% {
						opacity: 1;
					}

					90% {
						opacity: 1;
					}

					100% {
						transform: scale(0.8);
						opacity: 0;
					}
				}
			}
		}

		& > .prompt {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;

			display: flex;
			justify-content: center;
			align-items: center;

			z-index: 1;

			padding: 56px;
			box-sizing: border-box;
		}
	}
</style>
