# PixelHex
A tool to convert jpg, png or bmp to hex byte array for 32x16 PixelDisplay.

## Installation
```bash
$ sudo npm i -g pixelhex
```

## Usage
```bash
$ pixelhex <image path> [gamma correction] [row size]
```

| Parameter | Description |         |
|-----------|-------------|---------|
| `image path` | path to image to convert to hex bytes | Required |
| `gamma correction` | whether to perform gamma correction | Optional (default: `true`) |
| `row size` | number of bytes to output in a row | Optional (default: `8`) |

## Example
```bash
$ pixelhex image.bmp
0x70,	0x00,	0x10,	0x00,	0x20,	0x20,	0x20,	0x20,
0x00,	0x40,	0x00,	0x40,	0x40,	0x00,	0x00,	0x00,
...
0x00,	0x40,	0x00,	0x40,	0x40,	0x00,	0x00,	0x00,
0x00,	0x00,	0x40,	0x00,	0x00,	0x00,	0x20,	0x00
$
```

The output is meant to be copied to clipboard, and the recommended way is to pipe the command with `xclip`.

```bash
$ pixelhex image.bmp | xclip
```

