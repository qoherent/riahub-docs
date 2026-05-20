---
title: Creating Recordings
description: Generate synthetic RF recordings with the RIA Toolkit CLI, or capture live signals from a connected SDR, and push them to your RIA Hub repository.
sidebar:
  order: 2
---

Before you can curate a dataset or train a model, you need recordings in the RIA Hub Library. This guide covers the two ways to produce SigMF recordings using the **RIA Toolkit** command-line interface:

- **Synthetic generation** — produce mathematically clean IQ signals with known labels and controlled SNR, using `ria synth`
- **Live capture** — record real RF signals from a connected SDR device, using `ria capture`

In both cases the output is a SigMF file pair (`.sigmf-data` + `.sigmf-meta`) that you push to a RIA Hub repository with Git LFS.

:::note
If you want a fully in-browser, no-CLI workflow, the **Dataset Manager → Generator** produces a labelled synthetic dataset directly — no toolkit installation or recording step required. See [Synthesizing a Dataset](/guides/dataset-manager/synthesis/).
:::

## What you'll need

- RIA Toolkit installed locally:
  ```bash
  pip install ria-toolkit-oss
  ```
- A RIA Hub repository with Git LFS initialised — see [Working with Git LFS](/guides/platform/lfs-and-uploads/)
- For live capture: one supported SDR device connected (PlutoSDR, HackRF One, BladeRF, USRP, RTL-SDR, or ThinkRF)

## Part 1 — Synthetic generation with `ria synth`

`ria synth` (also callable as `ria generate`) generates modulated IQ signals and writes them to SigMF files. The signal parameters are exact and reproducible, making synthetic recordings ideal for building a first labelled dataset.

### Available signal types

| Command | Signal |
|---------|--------|
| `ria synth psk` | Phase-shift keying (BPSK, QPSK, 8-PSK, …) |
| `ria synth qam` | Quadrature amplitude modulation (16-QAM, 64-QAM, …) |
| `ria synth fsk` | Frequency-shift keying |
| `ria synth ook` | On-off keying |
| `ria synth oqpsk` | Offset QPSK |
| `ria synth gmsk` | Gaussian minimum-shift keying |
| `ria synth pam` | Pulse amplitude modulation |
| `ria synth chirp` | Linear frequency-modulated chirp |
| `ria synth noise` | AWGN (noise-only baseline) |
| `ria synth tone` | Single-frequency tone |

### Common options

All `ria synth` commands accept these flags:

| Flag | Short | Description |
|------|-------|-------------|
| `--sample-rate` | `-s` | Sample rate in Hz (required) |
| `--duration` | `-t` | Duration in seconds |
| `--num-samples` | `-n` | Total number of samples (alternative to duration) |
| `--center-frequency` | `-fc` | Records the center frequency in the SigMF metadata |
| `--add-noise` | — | Adds AWGN to the signal |
| `--noise-power` | — | AWGN variance (default `0.1`) |
| `--output` | `-o` | Output filename (required) |
| `--metadata` | `-m` | Write a `KEY=VALUE` pair into the SigMF global metadata; can be repeated |
| `--overwrite` | `-w` | Overwrite an existing output file |

Modulation-specific commands also accept:

| Command | Additional flags |
|---------|-----------------|
| `psk`, `qam`, `pam` | `--order -M` (modulation order), `--symbol-rate -r`, `--filter`, `--filter-beta`, `--filter-span` |
| `fsk` | `--order -M`, `--symbol-rate -r`, `--deviation` |
| `ook` | `--symbol-rate -r` |
| `chirp` | `--bandwidth -b` (required), `--period -p` (required), `--type` (`up`/`down`/`up_down`) |

### Example — modulation recognition dataset

The following commands produce three signal classes (QPSK, OOK, noise) that you can use as a starting point for a modulation recognition classifier. Run each block from your repository root.

**QPSK** (order 4, 500 ksymb/s, RRC pulse shaping, light AWGN):

```bash
for i in 1 2 3; do
  ria synth psk \
    --order 4 \
    --symbol-rate 500e3 \
    --sample-rate 1e6 \
    --duration 5 \
    --center-frequency 915e6 \
    --add-noise --noise-power 0.005 \
    --output "recordings/qpsk_${i}.sigmf" \
    --overwrite \
    -m label=QPSK \
    -m campaign=modrec-tutorial
done
```

**OOK** (200 ksymb/s):

```bash
for i in 1 2 3; do
  ria synth ook \
    --symbol-rate 200e3 \
    --sample-rate 1e6 \
    --duration 5 \
    --center-frequency 915e6 \
    --add-noise --noise-power 0.005 \
    --output "recordings/ook_${i}.sigmf" \
    --overwrite \
    -m label=OOK \
    -m campaign=modrec-tutorial
done
```

**Noise** (AWGN baseline class):

```bash
for i in 1 2 3; do
  ria synth noise \
    --sample-rate 1e6 \
    --duration 5 \
    --power 0.01 \
    --output "recordings/noise_${i}.sigmf" \
    --overwrite \
    -m label=noise \
    -m campaign=modrec-tutorial
done
```

You should now have 9 `.sigmf` file pairs (18 files) under `recordings/`.

The `-m label=<value>` flag writes `label` into the SigMF `global` block. This is the field the Curator reads to assign class labels when slicing — keep the value consistent across all recordings of the same class.

:::tip
Add `--iq-amp-imbalance` and `--iq-phase-imbalance` to simulate receiver hardware imperfections, or `--multipath-paths` and `--multipath-max-delay` for fading channels. These make the dataset harder but produce more robust models.
:::

## Part 2 — Live SDR capture with `ria capture`

`ria capture` streams IQ samples from a connected SDR device and writes a SigMF file. The toolkit handles device initialisation, sample streaming, and metadata creation automatically.

### Discover connected devices

```bash
ria discover
```

Sample output:

```
Found 1 device(s):
  pluto  —  PlutoSDR (ip:192.168.2.1)
```

If no devices are found, check USB or network connectivity. Drivers for USRP (UHD), HackRF, BladeRF, RTL-SDR, and ThinkRF must be installed separately.

### Capture command

```bash
ria capture \
  --device pluto \
  --frequency 915e6 \
  --sample-rate 1e6 \
  --duration 5 \
  --gain 50 \
  --output-dir recordings/ \
  -m label=QPSK \
  -m campaign=modrec-tutorial
```

| Flag | Description |
|------|-------------|
| `--device` | Device type: `pluto`, `hackrf`, `bladerf`, `usrp`, `rtlsdr`, `thinkrf` |
| `--ident` `-i` | Device identifier — IP address for PlutoSDR, serial for HackRF/BladeRF. Omit if only one device is connected. |
| `--frequency` | Center frequency in Hz |
| `--sample-rate` `-s` | Sample rate in Hz |
| `--duration` `-t` | Capture duration in seconds |
| `--num-samples` `-n` | Capture length in samples (alternative to duration) |
| `--gain` `-g` | RX gain in dB |
| `--bandwidth` `-b` | RX bandwidth in Hz (if the device supports it) |
| `--output` `-o` | Output filename. If omitted, a timestamped filename is generated automatically. |
| `--output-dir` | Output directory (default: `recordings/`) |
| `--metadata` `-m` | Write a `KEY=VALUE` pair into the SigMF metadata; can be repeated |

To capture from a PlutoSDR at a non-default IP address:

```bash
ria capture --device pluto --ident 192.168.2.2 --frequency 915e6 --sample-rate 1e6 --duration 5
```

For a multi-step campaign (changing transmitter state between captures), see [Campaign Control](/guides/conductor/campaign-control/).

## Part 3 — Pushing recordings to RIA Hub

### 1. Initialise Git LFS for SigMF files

If the repository is new, run this once:

```bash
git lfs track "*.sigmf-data"
git lfs track "*.sigmf-meta"
git add .gitattributes
git commit -m "track sigmf files with lfs"
```

### 2. Commit and push

```bash
git add recordings/
git commit -m "add modrec-tutorial recordings"
git push
```

**Large uploads (> 100 MB total):** use the dedicated upload endpoint to bypass the Cloudflare limit on the main domain:

```bash
git remote set-url origin https://upload.riahub.ai/<owner>/<repo>.git
git push
git remote set-url origin https://riahub.ai/<owner>/<repo>.git
```

Or configure `lfs.url` in `.git/config` permanently:

```ini
[lfs]
    url = https://upload.riahub.ai/<owner>/<repo>.git/info/lfs
```

### 3. Verify in the Library

Open the repository and click the **Library** tab. RIA Hub detects `.sigmf-data` + `.sigmf-meta` pairs on push, queues a background task to parse them, and registers them as `recording` assets within about a minute.

If a recording does not appear, check the **Project** metadata field — it must be a valid repository slug. Recordings without a parseable `.sigmf-meta` will not be indexed.

sidebar:
  order: 2
---

## Next steps

With recordings in the Library you are ready to build a dataset:

- [Curating a Dataset](/guides/dataset-manager/curation/) — slice, qualify, and label recordings into an HDF5 training set
- [Reviewing and Labelling Recordings](/guides/recordings/review-and-label/) — inspect recordings visually and correct labels before curation
