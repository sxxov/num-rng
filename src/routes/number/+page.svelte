<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button, ButtonVariants } from '@sxxov/sv/button';
	import { Svg } from '@sxxov/sv/svg';
	import { Composition, Tween } from '@sxxov/ut/animation';
	import { Bezier } from '@sxxov/ut/bezier';
	import { bezierQuintInOut, bezierQuintOut } from '@sxxov/ut/bezier/beziers';
	import { lerp, map } from '@sxxov/ut/math';
	import type { Size } from '@sxxov/ut/viewport';
	import { T, useFrame } from '@threlte/core';
	import {} from '@threlte/extras';
	import { ic_arrow_back } from 'maic/two_tone';
	import { onDestroy, onMount } from 'svelte';
	import * as THREE from 'three';
	import { FontLoader, TextGeometry } from 'three-stdlib';
	import bigelow_rules from '../../assets/common/font/BigelowRules_Regular.json';
	import { useEphemeralCamera } from '../../lib/3d/camera/useEphemeralCamera';
	import { useAmbientInteractivity } from '../../lib/3d/canvas/useAmbientInteractivity';
	import { useAmbientRendererSize } from '../../lib/3d/canvas/useAmbientRendererSize';
	import { getScreenSpaceSizeAtWorldZ } from '../../lib/3d/lmth/getScreenSpaceSizeAtWorldZ';
	import Meta from '../../lib/meta/Meta.svelte';

	useAmbientInteractivity();

	const camera = useEphemeralCamera(new THREE.PerspectiveCamera(75));
	const rendererSize = useAmbientRendererSize()!;
	const z = -10;

	const gotoMainMenu = async () => {
		if (document.referrer.startsWith(location.origin)) history.back();
		else await goto('/');
	};

	const number = localStorage.getItem('number');
	if (!number) {
		void gotoMainMenu();
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

	let spinTapY = new Tween(0, 2 * Math.PI, 1000, bezierQuintOut);
	const spinTap = () => {
		spinTapY.pause();
		const v = spinTapY.get() % (2 * Math.PI);
		spinTapY = new Tween(
			v,
			v > Math.PI ? 4 * Math.PI : 2 * Math.PI,
			1000,
			bezierQuintOut,
		);
		void spinTapY.play(1, 1);
	};

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

<Meta
	title="{text} — NUM"
	description="The game of teamworking guessing"
	src=""
	keywords={['num', 'number', 'game', 'random', 'rng']}
/>
<div class="number">
	<div class="back">
		<Button
			{...ButtonVariants.Transparent}
			{...ButtonVariants.Shadow.None}
			on:click={async () => {
				try {
					await document.exitFullscreen();
				} catch {}

				void gotoMainMenu();
			}}
		>
			<Svg svg={ic_arrow_back} />
			Main Menu
		</Button>
	</div>
</div>
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
		$spinY + $spinTapY,
		map($wiggle0 + $wiggle1 + $wiggle2, -0.5, 0.5, -0.05, 0.05),
	]}
	scale={size.height * textScale + lerp($pulseIn + $pulseOut, 0, 0.002)}
	on:pointerdown={spinTap}
>
	<T.MeshPhysicalMaterial
		color={new THREE.Color(0xffffff)}
		roughness={0.5}
		metalness={0.5}
	/>
	<T is={geometry} />
</T.Mesh>

<style lang="postcss">
	.number {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		z-index: 1;

		pointer-events: none;

		& > .back {
			position: absolute;
			top: 14px;
			left: 14px;

			pointer-events: auto;
		}
	}
</style>
