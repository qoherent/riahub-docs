---
title: Recordings
description: Browse, filter, and prepare RF recordings in RIA Hub before feeding them into the Dataset Manager.
sidebar:
  order: 0
---

The **Recordings** section is where raw RF signal files live before they become training data. Every SigMF recording pushed to a RIA Hub repository is automatically indexed, made searchable, and given a visual preview — so you can assess quality and confirm labels without writing any code.

| Page | What it covers |
|------|---------------|
| [Inspecting Recordings](/guides/recordings/inspect-recordings/) | Use the recording inspector's visualisation tabs (Spectrogram, Constellation, PSD, Time Series) to assess signal quality before curation |
| [Reviewing and Labelling Recordings](/guides/recordings/review-and-label/) | Understand automatic labels from Campaign Control, and manually annotate SigMF metadata for uncontrolled captures |

## How recordings fit into the Dataset Manager workflow

```
Capture / Synthesize  →  Repository (LFS)  →  Library index
                                                     ↓
                                             Review & label
                                                     ↓
                                             Curator (select recordings)
                                                     ↓
                                             HDF5 dataset → Model Builder
```

Recordings are the raw material the [Curator](/guides/dataset-manager/curation/) consumes. Before curating you need to confirm two things for each recording: that it contains usable signal, and that it carries the right labels. This section covers both.

## What a recording looks like in RIA Hub

RIA Hub expects recordings in **SigMF format** — a pair of files committed together:

| File | Contains |
|------|---------|
| `.sigmf-data` | Raw IQ samples as a binary stream |
| `.sigmf-meta` | JSON metadata: sample rate, center frequency, hardware, annotations, and any custom fields |

Both files are tracked with Git LFS. When you push them to a repository, RIA Hub detects the pair, parses the metadata, generates a spectrogram thumbnail, and registers the recording in the Library within about a minute.

:::note
NumPy (`.npy`) files are also accepted by the Curator, but they carry no metadata and cannot be visually inspected in the Library. SigMF is strongly preferred for any workflow that involves labelling or quality review.
:::

## Navigating recordings in the Library

Click **Library** in the top navigation, then select the **Recordings** tab. Each row shows:

- A spectrogram thumbnail — a quick visual indicator of signal presence and quality
- Filename, repository, branch, and directory path
- Core SigMF metadata fields: sample rate, center frequency, data type
- Any custom metadata written at capture time (e.g. `label`, `campaign`, `device_id`)

### Filtering

Use the **Repository**, **Directory**, and **Branch** dropdowns to narrow the view. The text search box matches across all visible columns including metadata fields. Active filters appear as removable tags above the table.

For large recording sets, adding a **Directory** filter is the fastest way to isolate a campaign batch — especially if you organised captures into folders by date, device, or modulation type at collection time.

### Column visibility

Each metadata field in the `.sigmf-meta` file can be toggled as a column via the column visibility popover. Show the fields that matter for your current review task (e.g. `label` and `ria:device_id` when preparing a fingerprinting dataset) and hide the rest.

## Checking a recording before curation

Click any row to open the **Quick View** panel. Use the visualisation tabs to assess signal quality before committing the recording to a curation run:

| Tab | What to look for |
|-----|-----------------|
| **Spectrogram** | Signal clearly visible above noise floor; no obvious flat regions or saturation |
| **Constellation** | Recognisable symbol cluster shape (two lobes for BPSK, four quadrants for QPSK, etc.) |
| **PSD** | Occupied bandwidth matches expectations; no unexpected spurs |
| **Time Series** | No clipping (flat tops in amplitude); consistent envelope |

**Signs a recording should be excluded from curation:**

- Flat or near-flat spectrogram — signal may have been absent or the receiver was off-frequency
- Heavy clipping visible in the time series — gain was too high
- Unexpected interference overlapping the signal of interest
- Duration much shorter than the rest of the batch — truncated file

Mark low-quality recordings by adding `ria:quality: rejected` to the `.sigmf-meta` (see [Reviewing and Labelling Recordings](/guides/recordings/review-and-label/)) so the Curator's recording browser and your own filters can exclude them.

## Checking labels before curation

The Curator derives class labels from the `core:label` field in SigMF annotations, or from a recording-level metadata key you specify. Before running curation, confirm:

1. **Controlled captures** (from Campaign Control) — labels are written automatically at collection time. Spot-check a few rows in the Library to confirm `core:label` or your campaign's label field is populated.

2. **Uncontrolled captures** (field recordings, third-party data) — labels must be added manually. Open the `.sigmf-meta` file and add the required annotation fields, or use the RIA Hub web editor. See [Reviewing and Labelling Recordings](/guides/recordings/review-and-label/) for the exact JSON format.

:::tip
Agree on a label vocabulary before reviewing a large batch — for example `QPSK`, `OOK`, `noise`. The Curator uses these values as class names in the output dataset, so inconsistent capitalisation or spelling will produce separate classes for what should be one.
:::

## Selecting recordings for the Curator

When you open the Curator and reach **Step 2 — Select recordings**, the recording browser uses the same filters as the Library. A few tips for efficient selection:

- **Filter by directory first** — if captures from the same campaign are in one folder, applying a directory filter and clicking **Select visible** is faster than checking rows individually.
- **Filter by label** — if you stored the label as a metadata column, filtering to a specific value lets you build a balanced per-class selection.
- **Mix repositories** — you can combine recordings from multiple repositories in one curation job. Use the **Repository** filter to switch between sources and add recordings from each.
- **Check the thumbnail** — any recording whose thumbnail shows a flat or noisy spectrogram should be deselected before proceeding.

## Next steps

- **Inspect recordings** — [Inspecting Recordings](/guides/recordings/inspect-recordings/) covers the visualisation tabs and what to look for in each.
- **Review and label recordings** — [Reviewing and Labelling Recordings](/guides/recordings/review-and-label/) covers automatic labels from Campaign Control and manual SigMF annotation.
- **Curate a dataset** — When recordings are reviewed and labelled, take them to the [Curator](/guides/dataset-manager/curation/) to slice, qualify, and package them into a training-ready HDF5 file.
- **Upload recordings** — If your recordings aren't in RIA Hub yet, see [Working with Git LFS](/guides/platform/lfs-and-uploads/) for upload options and size limits.
- **Example files** — The [RIA_Example repository](https://riahub.ai/qoherent/RIA_Example) contains synthetic SigMF recordings (BPSK, QPSK, QAM16) you can push to your own repository to try the Library and Curator without collecting real data.
