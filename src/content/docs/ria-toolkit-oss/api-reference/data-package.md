---
title: Data Package
description: API reference for ria_toolkit_oss.data — Recording, Annotation, and RadioDataset classes.
sidebar:
  order: 1
---

The `ria_toolkit_oss.data` package provides abstract data types and interfaces for radio machine learning, including signal recording management and dataset frameworks for RF signal processing.

## Annotation

Represents a labeled segment in signal data with time and frequency boundaries.

```python
class Annotation(
    sample_start: int,
    sample_count: int,
    freq_lower_edge: float,
    freq_upper_edge: float,
    label: str = None,
    comment: str = None,
    detail: dict = None,
)
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `sample_start` | `int` | Starting sample index |
| `sample_count` | `int` | Number of samples in annotation |
| `freq_lower_edge` | `float` | Lower frequency boundary |
| `freq_upper_edge` | `float` | Upper frequency boundary |
| `label` | `str` | Display label |
| `comment` | `str` | Human-readable description |
| `detail` | `dict` | Custom metadata |

**Methods:**

| Method | Description |
|--------|-------------|
| `is_valid()` | Validates sample count and frequency bounds |
| `overlap(other)` | Quantifies overlap area with another annotation |
| `area()` | Returns bounding box area (samples × frequency) |
| `to_sigmf_format()` | Exports to SigMF JSON format |

---

## Recording

Encapsulates complex IQ samples with metadata and annotations in a `C × N` structure (C channels, N samples).

```python
class Recording(
    data,
    metadata: dict = None,
    annotations: list = None,
    dtype = None,
    timestamp = None,
)
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `data` | array-like | Complex array of IQ samples |
| `metadata` | `dict` | Key-value recording information |
| `annotations` | `list` | List of `Annotation` objects |
| `dtype` | complex type | NumPy data type |
| `timestamp` | `float` or `int` | Epoch time |

**Properties:**

| Property | Description |
|----------|-------------|
| `data` | Read-only complex array (read-only for >1024 samples) |
| `metadata` | Dictionary of recording attributes |
| `annotations` | List of `Annotation` objects |
| `shape` | Data array dimensions |
| `n_chan` | Number of channels |
| `rec_id` | Unique 64-character recording identifier |
| `dtype` | Element data type |
| `timestamp` | Recording epoch timestamp |
| `sample_rate` | Sample rate from metadata |

**Metadata methods:**

| Method | Description |
|--------|-------------|
| `add_to_metadata(key, value)` | Append new key-value pair |
| `update_metadata(key, value)` | Modify existing metadata |
| `remove_from_metadata(key)` | Delete metadata entry |

**Data manipulation:**

| Method | Description |
|--------|-------------|
| `astype(dtype)` | Create copy with specified dtype |
| `trim(num_samples, start_sample)` | Extract signal segment |
| `normalize()` | Scale maximum amplitude to 1.0 |

**Export methods:**

| Method | Description |
|--------|-------------|
| `to_sigmf(filename, path, overwrite)` | Save as SigMF format |
| `to_npy(filename, path, overwrite)` | Binary NumPy format |
| `to_wav(filename, path, target_sample_rate, bits_per_sample, overwrite)` | WAV with embedded YAML metadata |
| `to_blue(filename, path, data_format, overwrite)` | MIDAS Blue legacy format |

**Visualization:**

| Method | Description |
|--------|-------------|
| `view(output_path, **kwargs)` | PNG plot of signal |
| `simple_view(**kwargs)` | Simplified PNG/SVG visualization |

---

## RadioDataset

Abstract base class providing an interface for iterable machine learning datasets containing radio signal examples.

**Properties:**

| Property | Description |
|----------|-------------|
| `source` | Path to dataset source file |
| `shape` | Tuple of dataset dimensions |
| `data` | NumPy array of all examples |
| `metadata` | Pandas DataFrame of example metadata |
| `labels` | List of metadata column headers |

**Dataset manipulation:**

| Method | Description |
|--------|-------------|
| `augment(class_key, augmentations, level, target_size, classes_to_augment, inplace)` | Supplement data through transformations |
| `subsample(class_key, percentage, inplace)` | Randomly reduce examples by percentage |
| `resample(quantity_target, class_key, inplace)` | Adjust examples per class to target count |
| `homogenize(class_key, example_limit, inplace)` | Equalize class sizes |
| `drop_class(class_key, class_value, inplace)` | Remove entire class |
| `get_class_sizes(class_key)` | Return class size dictionary |
| `delete_example(idx, inplace)` | Remove single example |

**Abstract methods:**

| Method | Description |
|--------|-------------|
| `inspect()` | Generate dataset visualization |
| `default_augmentations()` | List default transformations |

---

## IQDataset

Abstract subclass of `RadioDataset` specialized for IQ sample processing (`M × C × N` shape: examples × channels × samples).

| Method | Description |
|--------|-------------|
| `trim_examples(trim_length, keep, inplace)` | Reduce example length; `keep` options: `"start"`, `"end"`, `"middle"`, `"random"` |
| `split_examples(split_factor, example_length, inplace)` | Fragment examples into shorter chunks |

---

## SpectDataset

Abstract subclass of `RadioDataset` optimized for spectrogram processing (`M × C × H × W`: examples × channels × height × width).

---

## DatasetBuilder

Abstract base class providing a factory interface for creating radio datasets from common sources.

**Properties:**

| Property | Description |
|----------|-------------|
| `name` | Dataset identifier |
| `author` | Creator information |
| `url` | Source URL |
| `sha256` / `md5` | Integrity checksums |
| `version` | Current version identifier |
| `latest_version` | Available update version |
| `license` | Usage rights information |

**Methods:**

| Method | Description |
|--------|-------------|
| `download_and_prepare()` | Fetch data and create HDF5 source |
| `as_dataset(backend)` | Create `RadioDataset` instance; `backend`: `"pytorch"` or `"tensorflow"` |

---

## Dataset Utilities

### `split(dataset, lengths)`

Deterministically partitions a dataset by recording ID to prevent leakage, using a greedy algorithm for recordings with the most slices first.

### `random_split(dataset, lengths, generator)`

Stochastically partitions a dataset while respecting recording ID boundaries.

Both functions accept length lists as absolute counts or fractions summing to 1.0, with remainders distributed via round-robin.

---

## Dataset Source Files

Datasets are stored as HDF5 files containing:

- Example data arrays
- Pandas DataFrame metadata
- Recording ID associations for preventing train/test leakage
