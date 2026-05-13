---
title: The Library
description: Browse, search, and manage all RF assets indexed in RIA Hub — recordings, datasets, models, and more.
sidebar:
  order: 1
---

## Overview

The **Library** is RIA Hub's central catalogue of all assets stored across your repositories. Any file committed to a repository that RIA Hub recognises — a recording, a dataset, a trained model — is automatically indexed and made searchable here, with metadata extracted and thumbnails generated without any extra steps from you.

**The Library is where you:**
- Find recordings captured by a Campaign Control run
- Browse datasets generated or curated in the Dataset Manager
- Locate trained model files (.onnx, .pt, .pth) ready to load into the Zone Fingerprinting Demo
- Quickly inspect a recording's spectrogram, constellation, or PSD before deciding whether to use it
- Move assets between repositories using the commit-to-repo workflow

## What you'll need

- At least one repository containing indexed files — files are indexed automatically when committed via RIA Hub's upload interface or the Conductor
- For locally-managed repos: Git LFS must be set up so that large binary files are stored correctly (see [Working with Git LFS](/guides/platform/lfs-and-uploads/))

---

## Navigating the Library

Click **Library** in the top navigation. The Library is organised into tabs by asset type:

| Tab | What it contains |
|-----|-----------------|
| **Recordings** | SigMF recordings (`.sigmf-data`/`.sigmf-meta` pairs), NumPy files, WAV files |
| **Radio Datasets** | HDF5 datasets, CSV files, Parquet files |
| **PyTorch State Dicts** | Trained model weights (`.pt`, `.pth`) |
| **ONNX Graphs** | Exported inference models (`.onnx`) |
| **PyTorch Modules** | Module definitions |
| **Model Builder Tasks** | ML pipeline definitions |
| **Holoscan Inference Apps** | Inference application specs |
| **Actions** | Workflow and action definitions |

Select the tab for the asset type you're looking for.

---

## Filtering and searching

Each tab shares the same set of filters:

- **Repository** — limit results to one or more specific repositories
- **Directory** — filter by folder path within a repository
- **Branch** — filter by git branch

Use the filter dropdowns to add criteria. Active filters appear as tags above the table and can be removed individually or all at once with **Clear All Filters**. The text search box matches across all visible columns including metadata fields.

**Metadata columns** are dynamic — each asset type exposes different fields (e.g. `sample_rate`, `center_frequency`, `num_classes`). Use the column visibility popover to show or hide the fields that matter for your current task.

---

## Inspecting a recording

For **Recordings**, every row shows a spectrogram thumbnail. Click the thumbnail (or anywhere on the row) to open the **Quick View** panel with seven visualisation tabs:

| Tab | What it shows |
|-----|--------------|
| **Spectrogram** | Time vs. frequency power — the fastest way to assess signal presence and quality |
| **Constellation** | IQ scatter plot — reveals modulation shape and phase errors |
| **PSD** | Power Spectral Density — frequency distribution of energy |
| **Time Series** | Raw I and Q amplitude over time |
| **FFT** | Single-frame frequency view |
| **Frequency Spectrum** | Frequency spectrum plot |
| **3D Spectrogram** | Depth-enhanced time-frequency view |

The panel also shows the recording's sample count, data type, and sample rate.

---

## Downloading assets

Click the **Download** button on any row to download the file directly. For LFS-tracked files the download is served through RIA Hub's LFS backend — the raw content is downloaded, not the pointer file.

To download multiple files, check the boxes next to the rows you want and click **Download All Selected**.

---

## Moving assets between repositories

Any LFS-tracked asset can be copied into another repository without re-uploading the file content — RIA Hub links the existing LFS object to the new repository path.

1. Select one or more rows using the checkboxes
2. Click **Commit Selected to Repo**
3. Choose the target repository (search by name or `owner/repo`)
4. Select the target branch, or leave it to commit to the default branch
5. Enter a commit message
6. Click **Commit**

The LFS pointer is created in the target repository, pointing at the same underlying content. The file appears in the target repo immediately and is re-indexed in the Library under its new location.

:::tip
This is useful for promoting curated datasets from a working repository into a shared or published repository, or for copying a trained model into the repository used by the Zone Fingerprinting Demo.
:::
