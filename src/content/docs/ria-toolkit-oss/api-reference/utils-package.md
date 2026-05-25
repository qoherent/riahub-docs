---
title: Utils Package
description: API reference for ria_toolkit_oss.utils — array conversion utilities for IQ data.
sidebar:
  order: 5
---

The `ria_toolkit_oss.utils` module provides helper functions, primarily array conversion utilities for working with IQ signal data.

## IQ Data Formats

The module supports two representations of single-channel IQ (in-phase/quadrature) signals:

| Format | Shape | Description |
|--------|-------|-------------|
| **Complex 1×N** | `(1, N)` complex | Real part = I component; imaginary part = Q component |
| **Real 2×N** | `(2, N)` float | Row 0 = I component; Row 1 = Q component |

## Functions

### `convert_to_2xn(arr)`

Converts IQ samples from complex 1×N format to real 2×N format.

| Parameter | Type | Description |
|-----------|------|-------------|
| `arr` | array_like | IQ samples in complex 1×N format |

Returns an `ndarray` in real 2×N format. Returns a copy if the input is already in 2×N format.

---

### `convert_to_1xn(arr)`

Converts IQ samples from real 2×N format to complex 1×N format.

| Parameter | Type | Description |
|-----------|------|-------------|
| `arr` | `ndarray` | IQ samples in real 2×N format |

Returns an `ndarray` in complex 1×N format. Returns a copy if the input is already in 1×N format.

---

### `is_1xn(arr)`

Returns `True` if the array is in complex 1×N format.

---

### `is_2xn(arr)`

Returns `True` if the array is in real 2×N format.
