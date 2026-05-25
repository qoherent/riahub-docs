---
title: Transforms Package
description: API reference for ria_toolkit_oss.transforms — IQ impairments and augmentations.
sidebar:
  order: 4
---

The `ria_toolkit_oss.transforms` module provides functions for manipulating radio frequency data. All operations expect input in complex `1 × N` format. The module contains two submodules: **IQ Impairments** and **IQ Augmentations**.

---

## IQ Impairments

Signal degradation functions that simulate real-world transmission effects.

### `add_awgn_to_signal(signal, snr=1)`

Adds additive white Gaussian noise relative to the signal-to-noise ratio.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `signal` | complex C×N array or `Recording` | — | Input signal |
| `snr` | `float` | `1` | SNR in dB |

Returns a NumPy array or `Recording` with noise added. Raises `ValueError` if signal format is invalid.

---

### `time_shift(signal, shift=1)`

Applies temporal displacement, filling empty regions with zeros.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `signal` | complex C×N array or `Recording` | — | Input signal |
| `shift` | `int` | `1` | Index displacement |

Raises `UserWarning` if shift exceeds signal length.

---

### `frequency_shift(signal, shift=0.5)`

Applies frequency displacement relative to sample rate, constrained to `[-0.5, 0.5]`.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `signal` | complex C×N array or `Recording` | — | Input signal |
| `shift` | `float` | `0.5` | Frequency offset as fraction of sample rate |

---

### `phase_shift(signal, phase=π)`

Rotates IQ samples by a specified phase angle in radians, bounded to `[-π, π]`.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `signal` | complex C×N array or `Recording` | — | Input signal |
| `phase` | `float` | `π` | Rotation angle in radians |

---

### `iq_imbalance(signal, amplitude_imbalance=1.5, phase_imbalance=π, dc_offset=1.5)`

Simulates in-phase/quadrature imbalances found in real receivers.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `signal` | complex C×N array or `Recording` | — | Input signal |
| `amplitude_imbalance` | `float` | `1.5` | Imbalance in dB |
| `phase_imbalance` | `float` | `π` | Phase offset in radians, bounded to `[-π, π]` |
| `dc_offset` | `float` | `1.5` | DC offset in dB |

---

### `resample(signal, up=4, down=2)`

Resamples signal via polyphase filtering with upsampling and downsampling stages.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `signal` | complex C×N array or `Recording` | — | Input signal |
| `up` | `int` | `4` | Upsampling factor |
| `down` | `int` | `2` | Downsampling factor |

---

## IQ Augmentations

Synthetic training variant functions that create modified versions of signals for dataset augmentation.

### `generate_awgn(signal, snr=1)`

Produces pure noise matching a specified SNR (does not add to the signal).

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `signal` | complex C×N array or `Recording` | — | Reference signal |
| `snr` | `float` | `1` | SNR in dB |

---

### `time_reversal(signal)`

Reverses temporal sample order along the time axis.

---

### `spectral_inversion(signal)`

Negates the imaginary (quadrature) components of samples.

---

### `channel_swap(signal)`

Exchanges in-phase and quadrature components for each sample.

---

### `amplitude_reversal(signal)`

Negates amplitudes of both in-phase and quadrature components.

---

### `drop_samples(signal, max_section_size=2, fill_type='zeros')`

Randomly removes sample sections, replacing them with alternative values.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `signal` | complex C×N array or `Recording` | — | Input signal |
| `max_section_size` | `int` | `2` | Maximum drop size |
| `fill_type` | `str` | `"zeros"` | Replacement strategy: `"back-fill"`, `"front-fill"`, `"mean"`, or `"zeros"` |

---

### `quantize_tape(signal, bin_number=4, rounding_type='floor')`

Emulates analog-to-digital converter quantization across the entire signal.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `signal` | complex C×N array or `Recording` | — | Input signal |
| `bin_number` | `int` | `4` | Discretization bins |
| `rounding_type` | `str` | `"floor"` | `"floor"` or `"ceiling"` |

---

### `quantize_parts(signal, max_section_size=2, bin_number=4, rounding_type='floor')`

Applies ADC quantization to random signal sections only.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `signal` | complex C×N array or `Recording` | — | Input signal |
| `max_section_size` | `int` | `2` | Maximum quantized section size |
| `bin_number` | `int` | `4` | Discretization bins |
| `rounding_type` | `str` | `"floor"` | `"floor"` or `"ceiling"` |

---

### `magnitude_rescale(signal, starting_bounds=None, max_magnitude=1)`

Multiplies signal magnitude by a random constant from a random starting point.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `signal` | complex C×N array or `Recording` | — | Input signal |
| `starting_bounds` | `tuple` | random to end | Index range tuple for rescale initiation |
| `max_magnitude` | `float` | `1` | Maximum scaling factor |

---

### `cut_out(signal, max_section_size=3, fill_type='ones')`

Excises random sections, replacing them with zeros, ones, or noise at varying SNR levels.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `signal` | complex C×N array or `Recording` | — | Input signal |
| `max_section_size` | `int` | `3` | Maximum cutout size |
| `fill_type` | `str` | `"ones"` | `"zeros"`, `"ones"`, `"low-snr"`, `"avg-snr"`, or `"high-snr"` |

---

### `patch_shuffle(signal, max_patch_size=3)`

Randomly reorders samples within selected contiguous signal regions.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `signal` | complex C×N array or `Recording` | — | Input signal |
| `max_patch_size` | `int` | `3` | Maximum shuffled region size |
