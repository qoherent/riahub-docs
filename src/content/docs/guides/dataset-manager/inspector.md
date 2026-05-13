---
title: Inspecting a Dataset
description: Use the RIA Hub Inspector to analyze class balance, per-class signal statistics, and data quality in your datasets.
---

## Overview

The **Dataset Inspector** analyses an HDF5 dataset stored in RIA Hub and surfaces statistics and quality indicators across several dimensions. Analyses run as background jobs and results are returned as tables and summary metrics directly in the browser.

**Use the Inspector when you want to:**
- Verify class balance before training — unequal sample counts per class can bias a model toward over-represented modulations
- Compute per-class signal metrics (RMS, power, PAPR, SNR, EVM) to spot normalisation issues or outlier classes
- Flag anomalous samples using statistical methods (Z-score, IQR, or MAD) before they corrupt training
- Compare two datasets side by side to check consistency between versions or independently generated splits
- Diff two dataset versions to understand what changed between curation runs

**Analysis modes available:**
| Mode | What it computes |
|------|-----------------|
| **Overview** | File metadata, LFS ID, and creation attributes — no computation required |
| **Class Balance** | Sample counts per class, balance ratio, imbalance severity |
| **Per-Class Statistics** | RMS, power, PAPR, SNR, EVM, crest factor, bandwidth per modulation class |
| **Anomaly Detection** | Outlier samples flagged by Z-score, IQR, or MAD with configurable threshold |
| **Comparison** | Side-by-side metrics across two or more datasets |
| **Diff** | What changed between two versions of the same dataset |

## What you'll need

- An HDF5 dataset stored in a RIA Hub repository with **Git LFS** enabled — the inspector looks up files by their LFS object ID
- Larger datasets take longer per analysis; expect a few seconds to a minute depending on dataset size

## Step 1 — Open the Inspector

Navigate to your repository, click the **Dataset Manager** tab, then select **Inspector** from the sidebar.

## Step 2 — Select a repository and dataset

Use the **repository** dropdown to find your repo (you can type to search). Then pick the HDF5 file from the **dataset** list below it.

## Step 3 — Review the overview

The **Overview** section shows metadata pulled directly from the file without running any computation:

- Repository location, branch, and commit hash
- LFS object ID
- File-level attributes written when the dataset was created (e.g., sample rate, number of classes)

This is a quick sanity check — confirm the right file and version are selected before running any analyses.

## Step 4 — Check class balance

Open the **Class Balance** section and click **Run Analysis**.

The inspector counts the samples belonging to each modulation class and reports:

- Total sample count
- Number of classes
- Per-class sample counts
- Balance ratio and imbalance severity

A perfectly balanced dataset has equal samples per class. When some classes have far more samples than others, models trained on this data may learn to favor the over-represented classes.

:::tip
Aim for a balance ratio close to 1.0. If your dataset is severely imbalanced, consider re-curating with the **Balanced** slicer strategy, or generating a new synthetic dataset using the **Balanced** sampling strategy in the Generator.
:::

## Step 5 — View per-class statistics

The **Per-Class** section computes signal metrics for each modulation class. Click **Run Analysis** to start.

| Metric | What it measures |
|--------|-----------------|
| **RMS** | Root-mean-square amplitude — a measure of average signal power |
| **Power** | Mean squared amplitude |
| **PAPR** | Peak-to-Average Power Ratio — how "peaky" the waveform is |
| **SNR** | Estimated signal-to-noise ratio |
| **EVM** | Error Vector Magnitude — how closely symbols match ideal constellation points |
| **Crest factor** | Ratio of peak amplitude to RMS |
| **Bandwidth** | Estimated occupied bandwidth |

Results appear as a table with one row per class. Look for outliers — a class with a much higher RMS than the others, for example, may indicate a normalization issue in your data.

:::note
SNR and EVM estimates are most meaningful when your dataset was generated synthetically with known noise levels. For real-world recordings they are approximations.
:::

## Step 6 — Detect anomalies (optional)

The **Anomaly Detection** section flags individual samples that look unusual compared to the rest of the dataset.

Choose a detection method:

| Method | How it works |
|--------|-------------|
| **Z-score** | Flags samples more than N standard deviations from the mean |
| **IQR** | Uses the interquartile range to define "normal" — more robust for non-Gaussian distributions |
| **MAD** | Median Absolute Deviation — the most robust option when the data contains extreme outliers |

Set a **threshold** (higher values flag fewer samples) and click **Run Analysis**. Flagged samples may be corrupted, mislabeled, or otherwise unusual — worth investigating before training.

## Step 7 — Compare datasets (optional)

The **Comparison** section lets you compare two or more datasets side by side. This is useful when:

- Comparing a freshly curated dataset to its source recordings
- Verifying that two independently generated datasets share similar statistical properties
- Checking that a new dataset version is consistent with an older one

Select the datasets to compare, choose which metrics to include, and run the comparison.

## Step 8 — Diff two dataset versions (optional)

The **Diff** section shows what changed between two versions of a dataset. Use this when you've re-curated or re-generated a dataset and want a systematic account of what's different.
