<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button, ButtonVariants } from '@sxxov/sv/button';
	import { Svg } from '@sxxov/sv/svg';
	import { Composition, Tween } from '@sxxov/ut/animation';
	import { bezierQuintInOut } from '@sxxov/ut/bezier/beziers';
	import { ic_play_arrow } from 'maic/two_tone';
	import Meta from '../lib/meta/Meta.svelte';
	import { onMount } from 'svelte';
	import { preloadCode } from '$app/navigation';

	void preloadCode('/number');

	const countdown5 = new Tween(0, 1, 1000, bezierQuintInOut);
	const countdown4 = new Tween(0, 1, 1000, bezierQuintInOut);
	const countdown3 = new Tween(0, 1, 1000, bezierQuintInOut);
	const countdown2 = new Tween(0, 1, 1000, bezierQuintInOut);
	const countdown1 = new Tween(0, 1, 1000, bezierQuintInOut);
	const countdownComposition = new Composition()
		.add(countdown5, {
			offset: 0,
		})
		.add(countdown4, {
			offset: 0,
		})
		.add(countdown3, {
			offset: 0,
		})
		.add(countdown2, {
			offset: 0,
		})
		.add(countdown1, {
			offset: 0,
		});
	let starting = false;
	const numberClear = () => {
		localStorage.removeItem('number');
	};
	const numberSet = (number: number) => {
		localStorage.setItem('number', String(number));
	};
	const start = async () => {
		starting = true;

		try {
			await document.documentElement.requestFullscreen();
		} catch {}

		numberClear();
		countdownComposition.stop();
		await countdownComposition.play(1, 1);
		numberSet(Math.floor(Math.random() * 10) + 1);
		await goto('/number');
		starting = false;
	};
</script>

<Meta
	title="NUM"
	description="The game of teamworking guessing"
	src=""
	keywords={['num', 'number', 'game', 'random', 'rng']}
/>
<div class="home">
	{#if starting}
		<div class="countdown">
			{#if $countdown5 > 0}
				<h3 class="item">0:05</h3>
			{/if}
			{#if $countdown4 > 0}
				<h3 class="item">0:04</h3>
			{/if}
			{#if $countdown3 > 0}
				<h3 class="item">0:03</h3>
			{/if}
			{#if $countdown2 > 0}
				<h3 class="item">0:02</h3>
			{/if}
			{#if $countdown1 > 0}
				<h3 class="item">0:01</h3>
			{/if}
		</div>
	{:else}
		<div class="prompt">
			<Button
				{...ButtonVariants.Primary}
				roundness={28}
				on:click={start}
			>
				<Svg
					slot="left"
					svg={ic_play_arrow}
				/>
				NUM
				<!-- <Svg
					slot="right"
					svg={ic_schedule}
				/> -->
			</Button>
		</div>
	{/if}
</div>

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
