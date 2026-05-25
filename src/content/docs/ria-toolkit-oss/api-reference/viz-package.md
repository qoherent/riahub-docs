---
title: Viz Package
description: API reference for ria_toolkit_oss.viz — visualization utilities for recordings and datasets.
sidebar:
  order: 6
---

The `ria_toolkit_oss.viz` package provides visualization and reporting utilities for RIA components, particularly for recordings and radio datasets. All functions return Plotly `Figure` objects.

## Recording Visualization

All functions accept a `Recording` object as input and return a `plotly.graph_objects.Figure`.

### `spectrogram(rec, thumbnail=False)`

Generates a spectrogram visualization for a recording.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `rec` | `Recording` | — | The signal to visualize |
| `thumbnail` | `bool` | `False` | If `True`, returns a smaller thumbnail version |

---

### `iq_time_series(rec)`

Creates a time-domain plot displaying real and imaginary signal components.

---

### `frequency_spectrum(rec)`

Generates a frequency-domain visualization.

---

### `constellation(rec)`

Produces a constellation diagram from signal samples.

---

### `power_spectral_density(rec)`

Creates a PSD plot analyzing signal power distribution across frequencies.

---

### `fft_plot(rec)`

Displays the FFT magnitude response.

---

### `spectrogram_3d(rec)`

Generates a three-dimensional spectrogram representation.
