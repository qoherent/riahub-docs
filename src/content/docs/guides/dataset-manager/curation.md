---
title: Curating a Dataset
description: Turn raw RF recordings into a labeled, production-ready HDF5 dataset using the RIA Hub Curator.
---

The **Curator** transforms raw RF recordings stored in RIA Hub into structured HDF5 datasets ready for model training. It takes you through a multi-step wizard that controls every stage of the signal processing pipeline: how recordings are sliced into fixed-length examples, how low-quality slices are filtered out, and whether augmentation is applied to expand the dataset.

**Use the Curator when you want to:**
- Turn a collection of SigMF recordings (e.g. from a Campaign Control run) into a labelled training dataset
- Filter out silent, clipped, or low-SNR segments before they enter your dataset
- Apply data augmentation to increase dataset size and improve model robustness
- Produce a dataset in PyTorch or TensorFlow format, with metadata embedded in the HDF5 file

**What the Curator produces:**
- An HDF5 dataset file containing fixed-length IQ (or spectrogram) sample arrays with class labels derived from SigMF annotations
- Embedded dataset metadata (name, author, version, license, description) committed to your repository
- Optional augmented copies of each qualifying slice

**Pipeline stages (in order):**
1. Recording selection — choose which recordings to include, from one or more repositories
2. Process definition — data type (IQ or spectrogram), skip fraction, optional binning
3. Slicing — divide recordings into fixed-length examples (simple, random, or overlapping)
4. Qualification — filter slices by quality (RMS, SNR, energy, bandwidth, quantization, or a learned model)
5. Augmentation — optionally generate synthetic variations of qualifying slices
6. Metadata selection — choose which fields to carry through to the output file
7. Output backend — PyTorch or TensorFlow

## What you'll need

- At least one RF recording in a RIA Hub repository — SigMF file pairs (`.sigmf-data` + `.sigmf-meta`) or NumPy (`.npy`) files
- A repository to store the output dataset — create one before you start if needed

---

## Step 1 — Open the Curator

Navigate to your repository, click the **Dataset Manager** tab, then select **Curator** from the sidebar.

---

## Step 2 — Select recordings

Use the recording browser to choose which recordings to include. You can filter by repository, branch, directory, project ID, source, author, or license.

The table shows a thumbnail, filename, source project, sample rate, and other metadata for each recording. Check the boxes next to the recordings you want, or use **Select visible** to batch-select the current view.

**At least one recording must be selected before you can proceed.**

:::note
You can mix recordings from multiple repositories in a single curation job.
:::

---

## Step 3 — Overview (dataset metadata)

Give your output dataset its identity. This metadata is embedded into the HDF5 file and committed to your repository alongside it.

| Field | Required | Notes |
|-------|----------|-------|
| **Dataset name** | Yes | Alphanumeric, hyphens, and underscores only — e.g. `field-capture-psk-v1` |
| **Author** | Yes | Your name or organization |
| **License** | Yes | Defaults to *Private (No License)* — change if distributing |
| **Version** | Yes | Semantic version string, e.g. `1.0.0` |
| **Radio task** | Yes | Select from the predefined task list (e.g. modulation recognition) |
| **Citation** | No | Bibliographic reference if the data has an associated paper |
| **Description** | No | Human-readable description of the dataset |
| **Notes** | No | Internal notes — not published with the dataset |

---

## Step 4 — Process definition

This step controls the fundamental signal processing applied to every recording.

### Data type

| Option | Description |
|--------|-------------|
| **IQ** *(default)* | Raw complex samples. Use this for most training workflows. |
| **Spectrogram** | Converts IQ to a time-frequency representation before slicing. |

If you select **Spectrogram**, two additional fields appear:
- **Window function** — required (e.g. Hann, Blackman)
- **FFT mode** — required

### Skip fraction *(optional, default 0.0)*

Skips a fraction of the start of each recording before slicing begins. For example, `0.1` skips the first 10%. Use this to discard transmitter warm-up transients or initial noise bursts. Leave at `0.0` to use the full recording.

### Binning *(optional, default off)*

Enables amplitude quantization binning on the output samples. If enabled, you must also set the **number of bins** (must be greater than 0). Leave off unless you have a specific reason to quantize the amplitude range.

---

## Step 5 — Slicing

Slicing divides each recording into fixed-length examples — one example becomes one row in your dataset.

### Slicer type *(required)*

| Type | What it does | Extra required field |
|------|-------------|---------------------|
| **Simple** | Consecutive non-overlapping windows, start to finish | — |
| **Random** | N randomly positioned windows per recording | **Num slices** |
| **Overlap** | N overlapping windows per recording | **Num slices**, **Overlap %** |

### Slice length *(required)*

Number of samples per output example. Minimum 2. A value of `1024` is a common starting point and matches many pre-trained model input sizes.

### Num slices *(required for Random and Overlap only)*

How many windows to extract from each recording. Not shown for Simple slicing.

### Overlap percentage *(Overlap slicer only, default 0.0)*

How much consecutive windows overlap, as a percentage (0–99). At 50%, each window shares half its samples with the next.

:::tip
Use **Simple** when you want maximum coverage. Use **Random** when recordings are long and you only need a representative subset per recording.
:::

---

## Step 6 — Qualification

Qualification filters out slices that don't meet your quality criteria. Only slices that pass go into the output dataset. You must choose one qualifier type.

### RMS qualifier

Rejects slices whose root-mean-square amplitude falls below a threshold — the fastest way to discard silence and dead-air frames.

| Field | Required | Default | Notes |
|-------|----------|---------|-------|
| **Set threshold automatically** | — | On | When on, the threshold is estimated from the data. Turn off to set it manually. |
| **Threshold** | Only if auto is off | — | Manual RMS threshold value |

### SNR qualifier

Estimates signal-to-noise ratio per slice and rejects below a threshold.

| Field | Required | Default | Notes |
|-------|----------|---------|-------|
| **SNR threshold (dB)** | Yes | — | Slices below this SNR are rejected |
| **Method** | No | `m2m4` | `m2m4` or `split` — the algorithm used to estimate SNR |

### Energy qualifier

Rejects slices with total energy below a threshold.

| Field | Required | Default | Notes |
|-------|----------|---------|-------|
| **Energy threshold** | Yes | — | Must be ≥ 0 |
| **Method** | No | `fixed` | Detection method |

### Bandwidth qualifier

Automatically estimates the occupied bandwidth of each slice and rejects based on that. No threshold parameter required — the detector runs automatically.

### Quantization qualifier

Checks for quantization artifacts (bit-depth issues).

| Field | Required | Default | Notes |
|-------|----------|---------|-------|
| **Bins** | No | `64` | Number of quantization bins (2–65536) |
| **Rounding** | No | `floor` | `floor` or `ceiling` |
| **Auto threshold** | — | On | When on, threshold is estimated automatically. Turn off to set manually. |
| **Threshold** | Only if auto is off | — | Manual quantization threshold |

### Learned qualifier

Uses a trained model to classify each slice as usable or not. Requires a model already stored in a RIA Hub repository.

| Field | Required | Notes |
|-------|----------|-------|
| **Model path** | Yes | Format: `owner/repo/path/to/model.pth` |
| **Backend** | No (default: PyTorch) | `pytorch` or `tensorflow` |

:::tip
**RMS** is the simplest starting point and requires no tuning when auto-threshold is enabled. Start here unless you have a specific quality problem to address.
:::

---

## Step 7 — Augmentation *(optional, off by default)*

Augmentation creates additional synthetic variations of each qualifying slice, expanding your dataset and improving model robustness. This entire step can be skipped — leave augmentation disabled to produce an unaugmented dataset.

### Policy

| Policy | What it applies |
|--------|----------------|
| **Basic** | Light augmentation (minor magnitude rescaling) |
| **Noise** | Adds synthetic noise variations |
| **Full** | All transforms at balanced probabilities |
| **Custom** | You configure each transform and its probability individually |

### Custom transform parameters *(Custom policy only)*

| Transform | Parameter | Default |
|-----------|-----------|---------|
| `add_noise` | Noise power | `0.01` |
| `magnitude_rescale` | Rescale factor | `1.1` |
| `drop_samples` | Drop rate | `0.1` |
| `cut_out` | Cut-out size (samples) | `128` |
| `quantize` | Bit depth | `8` |

Each transform also has an **application probability** (0.0–1.0, default `0.5`) controlling how often it is applied per slice.

### Augmented copies per slice *(default 1)*

How many augmented versions to generate per original slice. The total dataset size is approximately `(1 + copies) × unaugmented size`.

:::note
Augmentation multiplies dataset size proportionally. Three copies per slice means roughly four times the storage and training time.
:::

---

## Step 8 — Metadata selection *(optional)*

Choose which metadata fields from the source recordings to carry through into the output HDF5 file. The available keys are discovered automatically from the recordings you selected.

If you leave this step at its defaults, all available metadata is included.

**Key aliases** let you rename metadata fields during curation — for example, mapping a source field named `signal_type` to `label` if that is what your training pipeline expects. Add as many alias mappings as needed; leave the table empty to use original field names.

---

## Step 9 — Output backend *(default: PyTorch)*

| Option | Compatible with |
|--------|----------------|
| **PyTorch** *(default)* | PyTorch `Dataset` and `DataLoader` |
| **TensorFlow** | `tf.data` pipelines |

---

## Step 10 — Submit

Click **Curate**. For jobs with more than 50 recordings, the job runs as a background task. A progress panel shows:

- The current recording being processed
- Elapsed time and estimated time remaining
- A timestamp for the last activity

You can cancel a running job at any time.

---

## Step 11 — Download or commit

When curation finishes, you can download the HDF5 file or commit it directly to a repository. Committing is recommended — it puts the dataset under version control and keeps it alongside the metadata you entered in Step 3.

---

## Minimum viable configuration

If you want to run the simplest possible curation job, you only need to fill in:

1. At least one recording selected
2. Dataset name, author, license, version, and radio task
3. Data type (default IQ is fine)
4. Slicer type and slice length
5. Qualifier type (RMS with auto-threshold requires no extra input)

Everything else — skip fraction, binning, augmentation, metadata selection, and backend — has a sensible default and can be left as-is.

---

## Next steps

- **Inspect the result** — [Inspecting a Dataset](/guides/dataset-manager/inspector/) checks class balance, per-class statistics, and anomalies in the curated dataset before you train.
- **Train a model** — Once inspection passes, take the dataset to [Model Builder](/guides/model-builder/train-a-model/) to configure and launch a training run.
- **Example files** — The [RIA_Example repository](https://riahub.ai/qoherent/RIA_Example) includes synthetic SigMF recordings and a reference `curator-configs/example_curator_config.json` you can use to follow this guide without real hardware.
