---
title: Synthesizing a Dataset
description: Generate labeled synthetic RF signal datasets using the RIA Hub Dataset Generator.
---

## Overview

The **Dataset Generator** creates labelled collections of simulated RF signals, ready for training modulation-recognition models. Instead of collecting real recordings, you configure the modulations, channel conditions, and sampling strategy you want — and RIA Hub generates the samples entirely in software.

Each example is a fixed-length IQ sample array paired with a class label (the modulation type). You control the signal pipeline end-to-end: modulation family and scheme, pulse-shaping filter, channel model (AWGN, Rayleigh fading, or clean), SNR range, and whether samples are drawn on a grid, randomly, or balanced across classes.

**Use the Dataset Generator when you want to:**
- Create a labelled training dataset without needing RF hardware or recordings
- Sweep a wide range of SNR conditions and modulation types systematically
- Quickly prototype a modulation-recognition model before collecting real-world data
- Reproduce a dataset exactly using a fixed random seed

**What the generator produces:**
- An HDF5 file containing IQ sample arrays and corresponding class labels
- A configurable number of samples per (modulation, SNR) combination, or a total sample budget drawn randomly or balanced across classes
- Optional pulse shaping (RRC/RC filters) and channel impairments (AWGN, Rayleigh fading)

## What you'll need

- A RIA Hub repository to store the output — create one before you start if you don't have one
- Generation runs as a background job; large datasets (hundreds of thousands of samples) can take several minutes

## Step 1 — Open the Dataset Generator

Navigate to your repository, click the **Dataset Manager** tab, then select **Generator** from the sidebar.

## Step 2 — Enter dataset metadata

Give your dataset a **name** and an optional **description**. The name appears in the repository and is embedded in the file's attributes, so use something descriptive — for example, `psk-qam-awgn-v1`.

## Step 3 — Choose modulation schemes

Check the modulation types you want to include. Each selected modulation becomes one class in the output dataset.

Modulations are grouped by family:

| Family | Options |
|--------|---------|
| **PSK** (Phase-Shift Keying) | BPSK, QPSK, 8PSK, 16PSK, 32PSK |
| **QAM** (Quadrature Amplitude Modulation) | QAM16, QAM64, QAM256 |
| **PAM** (Pulse Amplitude Modulation) | PAM2, PAM4, PAM8 |

:::tip
Start small — for example, BPSK, QPSK, and QAM16 — while you're learning. More classes means a larger, more complex dataset and a harder classification problem.
:::

## Step 4 — Configure signal parameters

| Parameter | What it controls |
|-----------|-----------------|
| **Signal length** | Number of IQ samples per example (1024 is a common starting point) |
| **Sample rate** | Simulated sample rate in Hz (e.g., 1 000 000 for 1 MHz) |

A longer signal gives the model more context per example but increases file size.

## Step 5 — Configure pulse shaping

Pulse shaping filters the baseband signal, affecting its spectral shape and inter-symbol interference characteristics.

| Parameter | Description |
|-----------|-------------|
| **Filter type** | `RRC` (Root-Raised Cosine), `RC` (Raised Cosine), or `none` |
| **Samples per symbol (SPS)** | How many samples represent each symbol |
| **Rolloff (β)** | Controls filter bandwidth — 0 is narrow, 1 is wide |
| **Span** | Filter length in symbols |

:::note
If you're not sure what to use, start with RRC, SPS = 8, rolloff = 0.35, span = 8. These are typical real-world values.
:::

## Step 6 — Configure the channel model

The channel model adds realistic impairments to the signals.

| Option | What it adds |
|--------|-------------|
| **AWGN only** | Additive white Gaussian noise at the SNR you specify |
| **Rayleigh fading + AWGN** | Multipath fading on top of noise — better for training robust models |
| **None** | Clean signals with no impairment — useful for debugging |

**AWGN only** is the right starting point for most training datasets.

## Step 7 — Set the SNR range

Signal-to-Noise Ratio (SNR) measures how much signal there is relative to background noise. A higher SNR means a cleaner signal.

Set a **minimum** and **maximum** SNR in dB. For example, −10 dB to 20 dB covers a wide range of channel conditions. Set a **step** to control how many SNR levels are sampled within that range (e.g., a step of 2 dB over a 30 dB range gives 16 SNR levels).

## Step 8 — Choose a sampling strategy

The sampling strategy determines how (modulation, SNR) pairs are selected.

| Strategy | What it does |
|----------|-------------|
| **Grid** | Generates examples at every (modulation, SNR) combination. The most systematic approach. |
| **Random** | Draws N random examples by sampling modulation and SNR uniformly. |
| **Balanced** | Generates an equal number of examples per modulation class, with SNR drawn randomly. |

The **summary panel** shows the estimated total sample count based on your configuration. Check this before submitting — it's easy to accidentally configure a dataset with millions of samples.

## Step 9 — Set a random seed (optional)

If you want the dataset to be reproducible, enter a fixed **random seed**. Using the same seed with the same configuration always produces the same output. Leave it blank for a non-deterministic run.

## Step 10 — Submit

Click **Generate**. The job is queued and runs in the background. A progress indicator shows status while the generation runs.

Small datasets (a few thousand samples) typically complete in under a minute. Larger grid sweeps take longer.

## Step 11 — Download or commit

When generation finishes, you can:

- **Download** — Save the HDF5 file to your local machine.
- **Commit to repository** — Store the dataset in your RIA Hub repository under version control. This is the recommended workflow: the file is versioned, associated with its generation parameters, and accessible to your team.
