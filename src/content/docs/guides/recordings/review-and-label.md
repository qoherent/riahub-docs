---
title: Reviewing and Labelling Recordings
description: Visually inspect recordings in the Library, understand how labels are set at capture time, and manually add or correct labels in SigMF metadata files.
sidebar:
  order: 1
---

Before recordings can be curated into a training dataset, they need to be reviewed for quality and — if they weren't captured in a controlled campaign — labelled with the signal content they contain.

RIA Hub stores recordings in [SigMF format](https://github.com/sigmf/SigMF): a `.sigmf-data` file (raw IQ samples) paired with a `.sigmf-meta` file (JSON metadata and annotations). Labels live entirely in the `.sigmf-meta` file, which is committed to your repository like any other file.

**Use this guide when you want to:**
- Visually inspect recordings using the Library's spectrograms, constellations, and PSD plots
- Understand which labels are written automatically during a Campaign Control run
- Add or correct recording-level labels (quality flags, descriptions) for uncontrolled captures
- Add time-frequency annotations that specify which modulation type occupies which part of the recording — required for the Curator to assign class labels when slicing

**How labelling works:**
- **Controlled captures** (from Campaign Control) are labelled at collection time — the conductor writes transmitter ID, modulation, channel, and other metadata into the `.sigmf-meta` automatically. You only need to review quality.
- **Uncontrolled captures** (field recordings, third-party data) require manual annotation. You edit the `.sigmf-meta` file directly, either through the RIA Hub web interface or via git.

## What you'll need

- Recordings indexed in the RIA Hub Library (uploaded to a repository and automatically parsed on commit)
- For manual labelling: access to edit files in the recording repository (web UI or git)

---

This guide covers three workflows:

1. **Reviewing** recordings visually in the Library
2. **Labels set automatically** during a Campaign Control run
3. **Manual labelling** — adding or correcting labels by editing the `.sigmf-meta` file directly

---

## Part 1 — Reviewing recordings in the Library

After recordings are uploaded to a repository (either by the Conductor or manually), they are indexed and appear in the **Library**.

### Open the Library

Click **Library** in the top navigation. Select the **Recordings** tab to see all indexed recordings across your repositories.

Use the **Repository**, **Directory**, and **Branch** filters to narrow down to the recordings you want to review.

### Inspect a recording

Click any row in the table to open the **Quick View** panel. This shows:

| Tab | What it shows |
|-----|--------------|
| **Spectrogram** | Time vs. frequency power map — the fastest way to spot interference, missing signals, or unexpected activity |
| **Constellation** | IQ scatter plot — useful for recognising modulation shape and checking for phase errors |
| **PSD** | Power Spectral Density — shows the frequency distribution of energy |
| **Time Series** | Raw I and Q amplitude over time |
| **FFT / Frequency Spectrum** | Single-frame frequency view |
| **3D Spectrogram** | Depth-enhanced time-frequency view |

### What to look for

**Good recording:**
- Signal clearly visible above the noise floor in the spectrogram
- Constellation points cluster into recognisable shapes (BPSK has two lobes, QPSK has four, etc.)
- No obvious clipping (flat tops in the time series) or saturation artefacts

**Bad recording (consider rejecting):**
- Flat or near-flat spectrogram with no discernible signal — receiver may have been off-frequency or signal absent
- Heavy clipping — gain was too high
- Interference from another source overlapping the signal of interest
- Very short duration relative to the expected capture length (truncated file)

---

## Part 2 — Labels set at capture time (Conductor)

When a capture campaign runs via [Campaign Control](/guides/conductor/campaign-control/), several metadata fields are written into the `.sigmf-meta` file automatically:

| SigMF field | Where it comes from |
|-------------|-------------------|
| `core:sample_rate` | Recorder configuration |
| `core:hw` | Recorder device type (e.g. `pluto`) |
| `core:author` | Campaign metadata |
| `core:description` | Set from the campaign description or transmitter ID |
| `ria:device_id` | The `device_id` tag you set in the output configuration |
| `ria:campaign_id` | The campaign ID assigned at deploy time |
| Annotation `core:label` | Set per-step from the transmitter schedule (channel, modulation, traffic type) |

This means **controlled captures are labelled at collection time** — you know exactly what signal was being transmitted at each step because the conductor wrote that into the SigMF annotations. You still need to review recordings for quality, but you generally do not need to add labels manually.

---

## Part 3 — Manual labelling and rejection

For recordings captured outside a conductor campaign — field captures, third-party datasets, or any scenario where the signal content was not known in advance — you need to add labels by hand.

Labels live in the `.sigmf-meta` file in your repository. You can edit this file through the RIA Hub web interface or via git on your local machine.

### Recording-level label fields

Open the `.sigmf-meta` file and look for the `"global"` section. The most useful fields for labelling are:

```json
{
  "global": {
    "core:description": "QPSK signal at 915 MHz, clean capture, usable",
    "core:author": "your-name",
    "core:comment": "Captured with Pluto at 0 dBm TX power"
  }
}
```

To mark a recording as **rejected** or low quality, add a `ria:quality` field with a value your team agrees on, for example:

```json
{
  "global": {
    "ria:quality": "rejected",
    "core:comment": "Gain too high — heavy clipping throughout"
  }
}
```

Because the Library filters and the Curator recording browser both expose metadata as searchable columns, adding a consistent `ria:quality` field lets you filter out rejected recordings when building datasets.

:::tip
Agree on a small vocabulary before you start labelling a batch — for example `accepted`, `rejected`, and `review`. Consistent values make filtering much easier later.
:::

### Adding time-frequency annotations

For uncontrolled captures where multiple signal types appear within a single recording, you can annotate specific regions using the SigMF `annotations` array. Each annotation marks a time window (and optionally a frequency range) with a label.

```json
{
  "annotations": [
    {
      "core:sample_start": 0,
      "core:sample_count": 65536,
      "core:freq_lower_edge": 914500000,
      "core:freq_upper_edge": 915500000,
      "core:label": "QPSK",
      "core:comment": "Clean QPSK burst, usable"
    },
    {
      "core:sample_start": 65536,
      "core:sample_count": 32768,
      "core:freq_lower_edge": 914000000,
      "core:freq_upper_edge": 916000000,
      "core:label": "interference",
      "core:comment": "Unknown narrowband interferer — do not use for training"
    }
  ]
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `core:sample_start` | Yes | Index of the first sample in this annotation |
| `core:sample_count` | Yes | Number of samples covered |
| `core:freq_lower_edge` | No | Lower frequency boundary in Hz |
| `core:freq_upper_edge` | No | Upper frequency boundary in Hz |
| `core:label` | No | Short label string (used by the Curator as the class name) |
| `core:comment` | No | Free-text note |

:::note
The `core:label` value in an annotation becomes the **class label** when the Curator slices the recording into a dataset. If you omit it or leave it blank, the Curator cannot assign a class to those samples.
:::

### How to edit the `.sigmf-meta` file

**In the RIA Hub web interface:**

1. Navigate to your repository
2. Browse to the `.sigmf-meta` file
3. Click the edit (pencil) icon
4. Make your changes to the JSON
5. Write a commit message and commit directly to the branch

**Via git:**

```bash
git clone <your-repo-url>
# Edit the .sigmf-meta file in your editor
git add path/to/recording.sigmf-meta
git commit -m "Add labels for recording batch 2026-05"
git push
```

After committing, RIA Hub re-indexes the file automatically and the updated metadata appears in the Library within a few seconds.

---

## Next steps

Once your recordings are labelled and any bad captures are flagged:

- Use the **Curator** to build a dataset — [Curating a Dataset](/guides/dataset-manager/curation/) explains how to filter by metadata and configure slicing
- Use the **Inspector** to verify class balance and signal quality in the output — [Inspecting a Dataset](/guides/dataset-manager/inspector/)
