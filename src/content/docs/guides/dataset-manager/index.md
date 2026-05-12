---
title: Dataset Manager
description: Overview of the RIA Hub Dataset Manager — tools for synthesizing, curating, and inspecting RF signal datasets.
sidebar:
  order: 0
---

The **Dataset Manager** is RIA Hub's suite of tools for creating and validating RF machine learning datasets. It covers the full dataset lifecycle: generating synthetic labelled data from scratch, curating raw recordings into structured training sets, and inspecting the results for quality and balance.

| Module | What it does |
|--------|-------------|
| [Synthesizing a Dataset](/guides/dataset-manager/synthesis/) | Generate labelled synthetic IQ datasets by configuring modulations, channel conditions, and SNR ranges — no hardware required |
| [Curating a Dataset](/guides/dataset-manager/curation/) | Transform raw RF recordings into production-ready HDF5 datasets through a guided pipeline of slicing, quality filtering, and optional augmentation |
| [Inspecting a Dataset](/guides/dataset-manager/inspector/) | Analyse an existing dataset for class balance, per-class signal statistics, anomalies, and differences between versions |

## Choosing the right tool

**Start with the Generator** if you don't have recordings yet and want to prototype a modulation-recognition model quickly. Synthetic datasets are fast to produce and fully reproducible.

**Use the Curator** when you have real-world recordings (e.g. from a Campaign Control run) and want to turn them into a training-ready dataset with quality filtering and metadata preserved.

**Use the Inspector** after generating or curating to verify the dataset looks as expected before committing it for training — catching class imbalance or signal anomalies at this stage is much cheaper than discovering them after a training run.
