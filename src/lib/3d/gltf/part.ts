import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import {
	GLTFLoader,
	type GLTF,
} from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface Part extends GLTF {
	object: THREE.Object3D | undefined;
}

const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(
	'https://www.gstatic.com/draco/versioned/decoders/1.5.6/',
);
gltfLoader.setDRACOLoader(dracoLoader);

const partCache = new Map<Record<any, any>, Part>();
export const createPart = async <T extends Record<any, any>>(
	gltf: T,
): Promise<Part> => {
	let part = partCache.get(gltf);

	if (!part) {
		const result = // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			await gltfLoader.parseAsync(gltf as any, '');
		const [object] = result.scene.children;

		part = {
			...result,
			object,
		};

		partCache.set(gltf, part);
	}

	return part;
};
