import { getContext } from 'svelte';
import { ambientInteractivityContextKey } from './AmbientCanvas.svelte';
import type { AmbientInteractivity } from './AmbientInteractivity';

export const useAmbientInteractivity = () => {
	const { interactivity } = getContext<AmbientInteractivity>(
		ambientInteractivityContextKey,
	);
	interactivity.enabled.set(true);
};
