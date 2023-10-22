export const colourInt = (rgb: number): [r: number, g: number, b: number] => [
	((rgb & 0xff0000) >> 16) / 255,
	((rgb & 0x00ff00) >> 8) / 255,
	((rgb & 0x0000ff) >> 0) / 255,
];
