#!/usr/bin/env node

const Jimp = require('jimp');
const gamma = require('./gamma');

const filepath = process.argv[2] || '';
const performGammaCorrection = !/false|off|no|0/i.test(process.argv[3]);
const bytesInRow = parseInt(process.argv[4]) || 8;

if (filepath === "") {
	console.error(`A tool to convert jpg, png or bmp to hex byte array for 16x32 PixelDisplay.
Usage: pixelhex <image path> [gamma correction] [row size]

image path:       path to image to convert to hex bytes
gamma correction: whether to perform gamma correction (default: true)
row size:         number of bytes to output in a row (default: 8)`);
	process.exit(1);
}

makeBytes(filepath, performGammaCorrection)
	.then(bytes => formatBytes(bytes, bytesInRow))
	.then(console.log)
	.catch((err) => {
		console.error(err.message);
		process.exit(1);
	});

async function makeBytes(imagePath, gammaCorrection) {
	const input = await Jimp.read(imagePath);
	const data = [];
	const bitResolution = 1 << 8;

	for (let y = 0; y < input.getHeight(); y++) {
		for (let x = 0; x < input.getWidth(); x++) {
			const color = input.getPixelColor(x, y);
			const rgba = Jimp.intToRGBA(color);

			if (gammaCorrection) {
				rgba.r = gamma[rgba.r];
				rgba.g = gamma[rgba.g];
				rgba.b = gamma[rgba.b];
			}

			let effectiveY = y < 8 ? y : y - 8;
			let dataIndex = (effectiveY * input.getWidth() * 8 + x);

			if (y < 8) {
				for (let bit = 1; bit < bitResolution; bit <<= 1) {
					if (data[dataIndex] === undefined) data[dataIndex] = 0;

					if (rgba.r & bit) data[dataIndex] |= 0b01000000;
					if (rgba.g & bit) data[dataIndex] |= 0b00100000;
					if (rgba.b & bit) data[dataIndex] |= 0b00010000;
					dataIndex += input.getWidth();
				}
			} else {
				for (let bit = 1; bit < bitResolution; bit <<= 1) {
					if (data[dataIndex] === undefined) data[dataIndex] = 0; // shouldn't happen

					if (rgba.r & bit) data[dataIndex] |= 0b00000100;
					if (rgba.g & bit) data[dataIndex] |= 0b00000010;
					if (rgba.b & bit) data[dataIndex] |= 0b00000001;
					dataIndex += input.getWidth();
				}
			}
		}
	}

	return data;
}

function formatBytes(bytes, bytesInRow) {
	if (!bytesInRow) bytesInRow = 8;

	let str = '';
	for (let i = 0; i < bytes.length; i++) {
		if (i % bytesInRow === 0) {
			if (i > 0) str += '\n';
		}

		let hex = parseInt(bytes[i]).toString(16);
		if (hex.length === 1) hex = "0" + hex;
		str += `0x${hex}`;

		if (i !== bytes.length - 1) {
			str += ",";

			if (i % bytesInRow !== bytesInRow - 1) {
				str += "\t";
			}
		}
	}

	return str;
}
