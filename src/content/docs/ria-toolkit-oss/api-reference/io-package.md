---
title: IO Package
description: API reference for ria_toolkit_oss.io — loading and saving recordings in multiple formats.
sidebar:
  order: 3
---

The `ria_toolkit_oss.io` package provides utilities for loading and saving recordings to and from various file formats. All functions that operate on recordings return or work with the `Recording` class.

## File Management

| Function | Description |
|----------|-------------|
| `exists(fid)` | Checks whether a file or directory is present; returns `bool` |
| `copy(source_path, destination_path)` | Duplicates a file or directory; raises `RuntimeError` on failure |
| `move(source_path, destination_path, copy=False)` | Recursively relocates a file or directory; optionally copies instead |
| `validate(fid)` | Verifies file integrity and readability as RIA data; returns `bool` |

## NPY Format

| Function | Description |
|----------|-------------|
| `to_npy()` | Writes recordings to `.npy` binary files; returns save path |
| `from_npy(file, legacy=False)` | Loads recordings from `.npy` files with optional legacy format support |
| `from_npy_legacy(file)` | Loads pre-utils NPY format containing `iqdata` array, metadata array, and extended metadata dict |

## SigMF Format

| Function | Description |
|----------|-------------|
| `to_sigmf()` | Writes recordings as SigMF file pairs (`.sigmf-data` and `.sigmf-meta`) |
| `from_sigmf(file)` | Loads recordings from SigMF file pairs |

See the [SigMF Specification](https://github.com/sigmf/SigMF) for format details.

## WAV Format

| Function | Description |
|----------|-------------|
| `to_wav()` | Exports to WAV with I/Q in stereo channels and embedded YAML metadata; supports 16 or 32-bit samples and configurable sample rates |
| `from_wav()` | Imports from WAV files, extracting embedded RF metadata |

## MIDAS Blue Format

| Function | Description |
|----------|-------------|
| `to_blue()` | Writes to legacy Blue format (512-byte binary header); supports format codes: `CI` (complex int16), `CF` (complex float32), `CD` (complex float64) |
| `from_blue()` | Loads Blue format recordings |

## General Loading

### `load_recording(file)`

Auto-detects the file format and loads the recording accordingly. Requires a file extension to determine format.

## Utility Functions

| Function | Description |
|----------|-------------|
| `convert_to_serializable(obj)` | Recursively converts structures to JSON-serializable format |
| `generate_filename(recording, tag='rec')` | Creates filenames from recording metadata |
| `generate_fullpath()` | Constructs complete file paths with validation |
