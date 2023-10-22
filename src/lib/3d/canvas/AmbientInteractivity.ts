import type { interactivity } from '@threlte/extras';

export interface AmbientInteractivity {
	interactivity: ReturnType<typeof interactivity>;
}
