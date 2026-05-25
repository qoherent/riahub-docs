---
title: Getting Started
description: A practical reference for the ria CLI — installation, end-to-end workflow, full command reference, and Python scripting preview.
sidebar:
  order: 2
---

This is a practical reference for the `ria` CLI from `ria-toolkit-oss`.

**Scope of this guide:**

- **Installation and SDR driver prerequisites** — how to install RIA Toolkit OSS and configure the system drivers your hardware requires
- **End-to-end CLI workflow** — a step-by-step walkthrough from hardware discovery through capture, annotation, and processing
- **Full command reference** — options, flags, and examples for every `ria` command
- **Python scripting preview** — using the toolkit API directly without the CLI

**Official resources:**

- [Project README](https://riahub.ai/qoherent/ria-toolkit-oss)
- [PyPI package](https://pypi.org/project/ria-toolkit-oss/)
- [RIA Hub Conda package](https://riahub.ai/qoherent/-/packages/conda/ria-toolkit-oss)

---

## 1. Installation and Setup

Before using the `ria` CLI, follow the [Installation](/ria-toolkit-oss/introduction/installation/) guide to install RIA Toolkit OSS and any SDR drivers required for your hardware.

### 1.1 SDR Driver Prerequisites

Toolkit package install does not install all system SDR drivers. Install vendor/runtime dependencies for the hardware you use.

| Device | Driver Package |
|--------|----------------|
| USRP | UHD drivers |
| Pluto | libiio / IIO utilities |
| BladeRF | libbladeRF |
| HackRF | libhackrf |
| RTL-SDR | librtlsdr |

See the [SDR Guides](/ria-toolkit-oss/sdr-guides/bladerf/) and your OS package instructions.

---

## 2. CLI Structure

Top-level CLI follows this model:

```bash
ria [GLOBAL_OPTS] <command> [ARGS] [OPTIONS]
```

**Global:**

- `-v, --verbose` (defined on root click group)

**Top-level commands:**

| Command | Purpose |
|---------|---------|
| `discover` | Probe SDR drivers and enumerate attached hardware |
| `init` | Create and manage user metadata defaults |
| `capture` | Record IQ samples from a connected SDR |
| `view` | Generate visualizations from IQ files |
| `annotate` | Label signal regions manually or with auto-detection (group) |
| `convert` | Convert between IQ file formats |
| `split` | Split, trim, or extract recordings |
| `combine` | Merge multiple recordings by concatenation or addition |
| `generate` / `synth` | Generate synthetic IQ signals (group; `synth` is an alias) |
| `transform` | Apply augmentations or impairments to recordings (group) |
| `transmit` | Transmit IQ through a TX-capable SDR |

---

## 3. Quick End-to-End Workflow

### 3.1 Discover Radios

Run this first to verify drivers and detect connected hardware.

```bash
ria discover -v
```

### 3.2 Initialize Local Metadata Defaults

Set reusable metadata once so captured files include consistent provenance fields.

```bash
ria init
```

### 3.3 Capture IQ

Record baseband IQ from a connected SDR.

```bash
ria capture -d pluto -f 2.44G -s 2e6 -n 500000 -o capture.sigmf-data
```

### 3.4 Visualize and Inspect

Render a quick diagnostic plot to validate signal presence and quality.

```bash
ria view capture.sigmf-data --type simple
```

### 3.5 Auto-Annotate and Inspect Annotations

Detect signal regions automatically, then verify the results.

```bash
ria annotate energy capture.sigmf-data --label signal
ria annotate list capture.sigmf-data
```

### 3.6 Convert and Split

Convert to a different format and split into fixed-size chunks.

```bash
ria convert capture.sigmf-data capture.npy
ria split capture.sigmf-data --split-every 100000 --output-dir chunks
```

### 3.7 Apply Transforms

Augment or impair a recording to produce controlled variants.

```bash
ria transform impair add_awgn_to_signal capture.npy --params snr=10
```

### 3.8 Transmit (TX-capable radios only)

Replay a recording through a transmit-capable SDR.

```bash
ria transmit -d hackrf -f 2.44G -s 2e6 --input capture.sigmf-data
```

---

## 4. Command Reference

### 4.1 `discover`

**Purpose:** Probe available SDR drivers and enumerate attached hardware. Confirm whether runtime libraries/drivers are installed and discoverable before capture/transmit.

```bash
ria discover [--verbose] [--json-output]
```

**Options:**

- `-v, --verbose`: include per-driver probe details and import/init failures.
- `--json-output`: emit JSON (useful for automation and inventory scripts).

**Behavior notes:**

- `discover` checks multiple backends (USB and network paths, depending on driver support).
- A device not appearing here usually means one of: missing system driver, permission issue, USB/network connectivity issue.
- Use `--verbose` first when troubleshooting; it surfaces driver-level failures hidden in default output.

**Example output:**

```
$ ria discover -v

✅ Loaded drivers (3):
   hackrf
   pluto
   bladerf

❌ Failed drivers (3):
   usrp: ModuleNotFoundError: uhd
   rtlsdr: ImportError: pyrtlsdr is required to use the RTLSDR class
   thinkrf: ImportError: pyrf is required to use the ThinkRF integration.
            Install with: pip install ria-toolkit-oss[thinkrf]

========================================
Attached Devices
========================================

📡 USRP/UHD devices (1):
   ✅ MyB200 (B200) - Serial: 30C51D5

📱 PlutoSDR devices: None found
🔧 HackRF devices: None found

========================================
Discovery Summary
========================================
Loaded drivers: 3
Failed drivers: 3
Detected devices: 1
```

With `--json-output`:

```json
{
  "loaded_drivers": ["hackrf"],
  "failed_drivers": ["pluto", "bladerf", "usrp", "rtlsdr", "thinkrf"],
  "devices": [
    {
      "type": "BladeRF",
      "Description": "Nuand bladeRF 2.0",
      "Backend": "libusb",
      "Serial": "8518b488d3e3443da979680f472bbb87",
      "USB Bus": "4",
      "USB Address": "2"
    }
  ],
  "total_devices": 1
}
```

:::note
Driver load failures are normal on systems where only a subset of SDR backends are installed. A failed driver means that backend's Python library isn't present — it does not prevent other drivers from working. Install only the packages for the hardware you use.
:::

---

### 4.2 `init`

**Purpose:** Create/manage user config file (defaults to `~/.ria/config.yaml`, or `$XDG_CONFIG_HOME/ria/config.yaml`).

```bash
ria init [options]
```

**Options:**

- `--author`, `--organization`, `--project`, `--location`, `--testbed`, `--license`, `--hw`, `--dataset`: stored once and reused for later recordings so files have consistent provenance.
- `--show`: read-only inspect of the current resolved config.
- `--reset`: remove config and start clean.
- `--config-path`: use a non-default config location (useful for isolated environments or CI).
- `--interactive` / `--no-interactive`: force prompts on or off regardless of terminal auto-detection.
- `--yes`: suppress confirmation prompts for scripted runs.

**Example output:**

Set metadata fields non-interactively:

```
$ ria init --author "Jane Doe" --project "rf-campaign-1" --location "Lab-A" --no-interactive

✓ Configuration saved to: /home/user/.ria/config.yaml
```

Verify with `--show`:

```
$ ria init --show

Current Configuration (/home/user/.ria/config.yaml):
============================================================

Author: Jane Doe
Project: rf-campaign-1
Location: Lab-A

To update: ria init
To reset: ria init --reset
```

:::note
Config integration is still being finalized. Config values are already consumed by multiple commands (capture, convert, generate metadata, and YAML config loading paths).
:::

---

### 4.3 `capture`

**Purpose:** Record IQ samples from a supported SDR and save to `sigmf`, `npy`, `wav`, or `blue`.

```bash
ria capture [options]
```

Device selection (`--device`) is optional if only one device is detected. Exactly one of `--num-samples` or `--duration` is required.

**Options:**

- `-d, --device {pluto,hackrf,bladerf,usrp,rtlsdr,thinkrf}`
- `-i, --ident`: serial or IP selector when multiple devices of the same type are present.
- `-c, --config <yaml>`: load options from a YAML file; CLI flags override loaded values.
- `-s, --sample-rate`
- `-f, --center-frequency` (supports values like `915e6`, `2.4G`)
- `-g, --gain`, `-b, --bandwidth`
- `-n, --num-samples` or `-t, --duration`: use sample count for deterministic datasets, or duration for quick time-based acquisition.
- `-o, --output`, `--output-dir`: output path or directory. A timestamped filename is generated if `--output` is omitted; defaults to `recordings/` if `--output-dir` is omitted.
- `--format {npy,sigmf,wav,blue}`: inferred from file extension if not set. `sigmf` is best for annotation workflows.
- `--save-image`: writes a quick visual summary alongside the capture file.
- `-m, --metadata KEY=VALUE` (repeatable): injects run-specific metadata.
- `-v, --verbose`, `-q, --quiet`

**Examples:**

```bash
ria capture -d hackrf -s 2e6 -f 2.44G -n 1000000 -o rf.sigmf-data
ria capture -d pluto -f 915e6 -t 2 --format npy --output-dir recordings
ria capture -c capture_config.yaml
```

**Example output:**

:::note
`capture` requires a connected SDR. The following shows representative output for a HackRF capture.
:::

```
$ ria capture -d hackrf -s 2e6 -f 2.44G -n 1000000 -o rf.sigmf-data

Initializing HackRF...
  Device: HackRF One
  Serial: a74ad5e4e2a14b7d
  Center frequency: 2.44 GHz
  Sample rate: 2.00 MS/s
  Gain: 20 dB

Capturing 1,000,000 samples...

Saved: rf.sigmf-data
       rf.sigmf-meta
```

---

### 4.4 `view`

**Purpose:** Generate visualizations from IQ files. Quickly validate signal quality, occupancy, and annotation coverage without writing custom plotting code.

```bash
ria view <input> [options]
```

`<input>` accepts SigMF, NPY, WAV, and Blue files.

**Mode (`--type`):**

- `simple`: fast-look plots for sanity checks and quick iteration.
- `full`: multi-panel diagnostic figure (IQ, time, frequency, metadata views).
- `annotations` / `annotation`: render annotation overlays.
- `channels`: channelized/segmented visualization.
- `annotate`: convenience path used in some annotation workflows.

**Output/display options:**

- `--output`, `--format {png,pdf,svg,jpg}`
- `--show`: open an interactive window (requires a GUI display environment).
- `--no-save`: suppress file output; only meaningful with `--show`.
- `--overwrite`

**Style options:**

- `--dpi`, `--figsize WxH`, `--title`
- `--light`: switch to a light theme (useful for reports/slides).

**Loading options:**

- `--legacy`: force legacy NPY loading path for older datasets.
- `--config`

**Mode-specific options:**

- `simple`: `--fast`, `--compact`, `--horizontal`, `--constellation`, `--labels`, `--slice start:end[:step]`
- `full`: `--plot-length`, `--no-spectrogram`, `--no-iq`, `--no-frequency`, `--no-constellation`, `--no-metadata`, `--no-logo`, `--spines`
- `annotations` / `channels`: `--channel`

**Examples:**

```bash
ria view capture.sigmf-data --type simple
ria view capture.npy --type full --title "Test Capture" --format pdf
ria view capture.npy --show --no-save
ria view old.npy --legacy --type simple
```

**Example output:**

```
$ ria view qam64_35.npy --type simple

Loading recording: qam64_35.npy

Recording Metadata:
----------------------------------------
  modulation: qam64
  constellation: qam
  bits_per_symbol: 6
  sps: 6
  beta: 0.35
  source: signal.block_generator
----------------------------------------

Generating simple visualization...
Saved: qam64_35.png
```

---

### 4.5 `annotate` group

**Purpose:** Manual annotation management and auto-detection/separation. Build or refine label metadata directly in recordings for downstream training, QA, and filtering.

```bash
ria annotate <subcommand> ...
```

**Subcommands:**

| Subcommand | Purpose |
|------------|---------|
| `list` | Inspect all annotations on a recording |
| `add` | Add one annotation with explicit sample-domain bounds |
| `remove` | Remove one annotation by index |
| `clear` | Remove all annotations from a recording |
| `energy` | Auto-detect regions above the estimated noise floor |
| `cusum` | Auto-detect regime changes using change-point detection |
| `threshold` | Auto-detect regions using normalized magnitude thresholding |
| `separate` | Decompose annotations into narrower spectral components |

SigMF is the preferred format for durable annotation metadata. For non-SigMF input, most operations write a new output artifact unless `--overwrite` is set. `--type {standalone,parallel,intersection}` controls annotation relation semantics.

#### `ria annotate list`

```bash
ria annotate list <input> [--verbose]
```

Prints all annotations for a recording in index order. `--verbose` includes additional detail per record.

**Example output:**

```
$ ria annotate list sample_recording3_annotated.npy --verbose

Annotations in sample_recording3_annotated.npy:
  [0] Samples 170,599-171,116: signal
      Type: standalone
      Frequency: 3.41 GHz - 3.41 GHz
      Detail: {'generator': 'energy_detector', 'freq_method': 'nbw'}
  [1] Samples 182,310-182,841: signal
      Type: standalone
      Frequency: 3.41 GHz - 3.41 GHz
      Detail: {'generator': 'energy_detector', 'freq_method': 'nbw'}
  [2] Samples 1,133,165-1,133,706: signal
      ...
  [7] Samples 2,113,268-2,861,395: signal
      Type: standalone
      Frequency: 3.41 GHz - 3.41 GHz
      Detail: {'generator': 'energy_detector', 'freq_method': 'nbw'}

Total: 8 annotation(s)
```

#### `ria annotate add`

```bash
ria annotate add <input> --start <int> --count <int> --label <text> [options]
```

Adds one explicit annotation with sample-domain boundaries.

- `--start`: first sample index of the annotated region.
- `--count`: number of samples in the region.
- `--freq-lower`, `--freq-upper`: optional spectral bounds in Hz.
- `--comment`, `--type`, `-o` / `--output`, `--overwrite`, `--quiet`

**Example output:**

```
$ ria annotate add sample_recording3_annotated.npy --start 50000 --count 10000 --label burst -o out.npy

Loaded: sample_recording3_annotated.npy

Adding annotation:
  Start: 50,000
  Count: 10,000 samples
  Frequency: full bandwidth
  Label: burst
  Type: standalone
Saving to: out.npy
  ✓ Saved
```

#### `ria annotate remove`

```bash
ria annotate remove <input> <index> [--output ...] [--overwrite] [--quiet]
```

Removes exactly one annotation by list index. Run `annotate list` first to confirm the index.

**Example output:**

```
$ ria annotate remove sample_recording3_annotated.npy 0 -o out.npy

Loaded: sample_recording3_annotated.npy

Removing annotation [0]:
  Removed: samples 170,599-171,116 (signal)
Saving to: out.npy
  ✓ Saved
```

#### `ria annotate clear`

```bash
ria annotate clear <input> [--force] [--overwrite] [--quiet]
```

Removes all annotations from the recording. `--force` bypasses the confirmation prompt.

**Example output:**

```
$ ria annotate clear sample_recording3_annotated.npy --force --overwrite

Loaded: sample_recording3_annotated.npy

Cleared 8 annotation(s)
Saving to: sample_recording3_annotated.npy
  ✓ Saved
```

#### `ria annotate energy`

```bash
ria annotate energy <input> [options]
```

Detects energetic regions above the estimated noise floor and writes them as annotations.

- `--label`
- `--threshold`: noise-floor multiplier; higher values reduce false positives but can miss weak signals.
- `--segments`: number of segments used to estimate baseline noise.
- `--window-size`: smoothing size; larger windows stabilize detections at the cost of sharp transition precision.
- `--min-distance`: minimum sample spacing between detections, preventing dense duplicate regions.
- `--freq-method {nbw,obw,full-detected,full-bandwidth}`: how frequency bounds are assigned to annotations.
- `--nfft`, `--obw-power`
- `--type`, `-o` / `--output`, `--overwrite`, `--quiet`

**Example output:**

```
$ ria annotate energy sample_recording3.npy --label signal -o sample_recording3_annotated.npy

Loaded: sample_recording3.npy

Detecting signals using energy-based method...
  Time detection:
    Segments: 10
    Threshold: 1.2x noise floor
    Window size: 200 samples
    Min distance: 5000 samples
  Frequency bounds: nbw
  ✓ Added 8 annotation(s)
Saving to: sample_recording3_annotated.npy
  ✓ Saved
```

#### `ria annotate threshold`

```bash
ria annotate threshold <input> --threshold <0.0..1.0> [options]
```

Uses normalized magnitude thresholding to derive annotation spans. Use where a fixed amplitude threshold is sufficient.

- `--label`, `--window-size`, `--type`, `-o` / `--output`, `--overwrite`, `--quiet`

**Example output:**

```
$ ria annotate threshold sample_recording3.npy --threshold 0.7 --label strong -o out.npy

Loaded: sample_recording3.npy

Detecting signals using threshold qualifier...
  Threshold: 70.0% of max magnitude
  Window size: auto (1ms)
  Channel: 0
  ✓ Added 2 annotation(s)
Saving to: out.npy
  ✓ Saved
```

#### `ria annotate cusum`

```bash
ria annotate cusum <input> [options]
```

Uses change-point detection (CUSUM-style logic) to find regime changes and annotate contiguous segments.

- `--label`
- `--min-duration` (ms): prevents tiny over-segmented labels.
- `--window-size`
- `--tolerance`: merges nearby boundaries when set above default.
- `--type`, `-o` / `--output`, `--overwrite`, `--quiet`

**Example output:**

```
$ ria annotate cusum sample_recording3.npy --label regime -o out.npy

Loaded: sample_recording3.npy

Detecting segments using CUSUM...
  Min duration: 5.0 ms
  ✓ Added 37 annotation(s)
Saving to: out.npy
  ✓ Saved
```

#### `ria annotate separate`

```bash
ria annotate separate <input> [options]
```

Decomposes existing annotations into narrower sub-band annotations by detecting distinct frequency components within each annotated time window. It does not detect signal regions from scratch — run `energy`, `threshold`, or `cusum` first to produce the input annotations, then use `separate` to refine them spectrally.

Use this when a single broad annotation covers multiple signals at different frequencies and you want separate annotations per component.

- `--indices "0,1,2"`: limit operation to specific annotations; omit to process all.
- `--nfft`: larger FFT improves frequency resolution but increases compute time.
- `--noise-threshold-db`: sets the noise floor in dB; auto-estimated if omitted.
- `--min-component-bw`: rejects narrow fragments likely to be noise artifacts.
- `-o` / `--output`, `--overwrite`, `--quiet`, `--verbose`

**Example — two-step workflow:**

Step 1 — create broad annotations with `threshold`:

```
$ ria annotate threshold sample_recording5.npy --threshold 0.5 --label signal -o annotated.npy

Loaded: sample_recording5.npy

Detecting signals using threshold qualifier...
  Threshold: 50.0% of max magnitude
  Window size: auto (1ms)
  Channel: 0
  ✓ Added 3 annotation(s)
Saving to: annotated.npy
  ✓ Saved
```

Step 2 — run `separate` to split by frequency component:

```
$ ria annotate separate annotated.npy -o separated.npy

Loaded: annotated.npy

Splitting annotations by frequency components...
  Input annotations: 3
  FFT size: 65536
  Noise threshold: auto-estimated
  Min component BW: 50.00 kHz
  ✓ Output annotations: 6 (+3 change)
Saving to: separated.npy
  ✓ Saved
```

**All annotate examples:**

```bash
ria annotate list capture.sigmf-data --verbose
ria annotate add capture.sigmf-data --start 10000 --count 5000 --label burst
ria annotate energy capture.sigmf-data --label signal --threshold 1.3
ria annotate threshold capture.sigmf-data --threshold 0.5 --label signal
ria annotate cusum capture.sigmf-data --min-duration 5
ria annotate separate capture.sigmf-data --indices 0,1 --verbose
```

---

### 4.6 `convert`

**Purpose:** Convert between `sigmf`, `npy`, `wav`, and `blue`. Normalize datasets into the format required by downstream tooling or collaboration targets.

```bash
ria convert <input> [output] [options]
```

If `output` is omitted, `--format` must be provided. If both are given, format is inferred from the output file extension.

**Options:**

- `--format {npy,sigmf,wav,blue}`
- `--output-dir`
- `--legacy`: use older NPY loader behavior for historical recordings.
- `--wav-sample-rate`: target sample rate for WAV export.
- `--wav-bits {16,32}`: output PCM depth; higher preserves more dynamic range.
- `--blue-format {CI,CF,CD}`: Bluefile complex sample representation.
- `--metadata KEY=VALUE` (repeatable): add or override metadata during conversion; especially useful when exporting to SigMF.
- `--overwrite`, `-v` / `--verbose`, `-q` / `--quiet`

**Examples:**

```bash
ria convert recording.sigmf-data output.npy
ria convert recording.npy --format sigmf
ria convert highrate.npy audio.wav --wav-sample-rate 48000
ria convert old.npy --format sigmf --legacy --overwrite
```

**Example output:**

```
$ ria convert sample_recording3.npy sample_recording3.sigmf-data

Converting: sample_recording3.npy → sample_recording3.sigmf-data
Input format: NPY
Output format: SIGMF
Samples: 3,000,000
Conversion complete: sample_recording3.sigmf-data, sample_recording3.sigmf-meta
```

---

### 4.7 `split`

**Purpose:** Split, trim, or extract recordings. Create manageable dataset shards or extract windows of interest without custom scripts.

```bash
ria split <input> [operation] [options]
```

Choose exactly one operation per invocation:

- `--split-at <sample>`: binary split at a specific sample index.
- `--split-every <N>`: fixed-size chunking for ML pipelines.
- `--split-duration <seconds>`: time-based chunking.
- `--trim` (with `--start` + `--length` or `--end`): extract one sub-window.
- `--extract-annotations`: write each annotated region as a standalone file.

**Trim controls:** `--start`, `--length`, `--end`

**Annotation extraction filters:** `--annotation-label`, `--annotation-index`

**Output controls:** `--output-dir`, `--output-prefix`, `--output-format {npy,sigmf,wav,blue}`, `--overwrite`, `--legacy`, `-v` / `--verbose`, `-q` / `--quiet`

**Examples:**

```bash
ria split recording.sigmf-data --split-at 500000 --output-dir out
ria split recording.sigmf-data --split-every 100000 --output-dir chunks
ria split recording.sigmf-data --split-duration 1.0 --output-dir chunks
ria split recording.npy --trim --start 1000 --length 5000 --output-dir trimmed
ria split annotated.sigmf-data --extract-annotations --annotation-label payload
```

**Example output:**

```
$ ria split sample_recording3.npy --split-every 500000 --output-dir chunks

Loading: sample_recording3.npy
Total samples: 3,000,000

Splitting into chunks of 500,000 samples...
Creating 6 chunks...
  Chunk 1/6: samples 0-499,999...
  Chunk 2/6: samples 500,000-999,999...
  Chunk 3/6: samples 1,000,000-1,499,999...
  Chunk 4/6: samples 1,500,000-1,999,999...
  Chunk 5/6: samples 2,000,000-2,499,999...
  Chunk 6/6: samples 2,500,000-2,999,999...

Created 6 chunks in chunks/
```

---

### 4.8 `combine`

**Purpose:** Merge multiple recordings by concatenation or sample-wise addition. Assemble multi-part captures or synthesize mixtures for testing and model training.

```bash
ria combine <input1> <input2> [input3 ...] <output> [options]
```

**Options:**

- `--mode {concat,add}`
- `--align-mode {error,truncate,pad,pad-start,pad-center,pad-end,repeat,repeat-spaced}`
- `--pad-start-sample`, `--repeat-spacing`
- `--normalize`: rescale combined output to avoid clipping/saturation after addition.
- `--output-format {sigmf,npy,wav,blue}`
- `--overwrite`, `--metadata KEY=VALUE` (repeatable)
- `--legacy`, `--verbose`, `--quiet`

`--mode concat` appends inputs sequentially in time. `--mode add` performs sample-wise summation and requires all inputs to be the same length, or an `--align-mode` to reconcile length differences:

| Align Mode | Behavior |
|------------|----------|
| `error` | Fail if lengths differ |
| `truncate` | Cut all to shortest length |
| `pad`, `pad-start`, `pad-center`, `pad-end` | Zero-pad shorter streams |
| `repeat` | Tile shorter streams to match longest |
| `repeat-spaced` | Repeated placement with spacing via `--repeat-spacing` |

**Examples:**

```bash
ria combine a.npy b.npy c.npy merged.npy
ria combine signal.npy noise.npy noisy.npy --mode add
ria combine long.npy short.npy out.npy --mode add --align-mode pad-center
ria combine signal.npy pattern.npy out.npy --mode add --align-mode repeat-spaced --repeat-spacing 10000
```

**Example output:**

```
$ ria combine sample_recording3.npy qam64_35.npy combined.npy

Combining 2 recordings (concat mode)...
Saved to: combined.npy
```

---

### 4.9 `generate` group (and `synth` alias)

**Purpose:** Generate synthetic IQ signals and save in `npy`, `sigmf`, `wav`, or `blue`. Create known-reference waveforms and synthetic datasets for validation, demos, and ML data generation.

`ria synth ...` is an alias for `ria generate ...`.

```bash
ria generate <subcommand> [subcommand options] [common options]
```

**Available subcommands:**

| Subcommand(s) | Description |
|---------------|-------------|
| `tone` | Clean sinusoidal calibration/reference source |
| `noise` | Baseline noise floor data or controlled additive-noise synthesis |
| `chirp` | Sweep-based radar/sonar-style signals and bandwidth occupancy tests |
| `square`, `sawtooth` | Periodic waveform primitives |
| `qam`, `apsk`, `pam`, `psk` | Digital modulation families with pulse-shaping filter support |
| `fsk` | Frequency-shift keying with configurable tone spacing |
| `ook`, `oqpsk`, `gmsk` | On-off keying and continuous-phase modulation schemes |

**Common options** (all subcommands):

- `-s, --sample-rate` (required), `-n, --num-samples` or `-t, --duration`
- `-o, --output` (required), `-F / --format {npy,sigmf,wav,blue}`
- `--frequency-shift`, `--center-frequency`: separate baseband shape from RF metadata.
- `--add-noise`, `--noise-power`, `--path-gain`: apply noise post-generation.
- `--multipath-paths`, `--multipath-max-delay`, `--iq-amp-imbalance`, `--iq-phase-imbalance`, `--iq-dc-offset`: channel and IQ impairments.
- `--config <yaml>`, `-w / --overwrite`, `-m / --metadata KEY=VALUE`, `-v / --verbose`, `-q / --quiet`

**Subcommand-specific options:**

| Subcommand | Unique options |
|------------|---------------|
| `tone` | `--frequency`, `--amplitude`, `--phase` |
| `noise` | `--noise-type {gaussian,uniform}`, `--power` |
| `chirp` | `--bandwidth` (required), `--period` (required), `--type {up,down,up_down}` |
| `square` | `--frequency`, `--amplitude`, `--duty-cycle`, `--phase` |
| `sawtooth` | `--frequency`, `--amplitude`, `--phase` |
| `qam`, `apsk`, `pam`, `psk` | `--order`, `--symbol-rate`, `--filter {rrc,rc,gaussian,none}`, `--filter-span`, `--filter-beta`, `--message-source {random,file,string}`, `--message-content` |
| `fsk` | `--order`, `--symbol-rate`, `--freq-spacing`, `--modulation-index`, `--message-source`, `--message-content` |
| `ook`, `oqpsk`, `gmsk` | `--symbol-rate` (required), `--message-source`, `--message-content`; `gmsk` also accepts `--bt` (Gaussian filter bandwidth-time product) |

**Examples:**

```bash
ria generate tone -s 2e6 -n 500000 --frequency 50e3 -o tone.sigmf-data
ria generate noise -s 2e6 -n 500000 --noise-type gaussian --power 0.05 -o noise.npy
ria generate chirp -s 5e6 -t 0.5 --bandwidth 2e6 --period 0.01 --type up -o chirp.sigmf-data
ria generate qam -s 2e6 -r 100e3 -M 16 -N 5000 --message-source random -o qam16.npy
ria synth psk -s 2e6 -r 100e3 -M 8 -N 8000 -o psk8.npy
```

**Example output:**

```
$ ria generate tone -s 2e6 -n 100000 --frequency 50e3 -o tone.npy

Generating tone: 50.00 kHz at 2.00 MS/s
```

```
$ ria generate qam -s 2e6 -n 50000 --order 16 --symbol-rate 100e3 --message-source random -o qam16.npy

Generating QAM-16 (2500 symbols)...
```

---

### 4.10 `transform` group

**Purpose:** Apply algorithmic transforms to existing recordings. Run reusable augmentations/impairments for dataset diversity and robustness testing.

```bash
ria transform <augment|impair|custom> ...
```

#### `augment`

```bash
ria transform augment [augmentation] [input] [output] [options]
```

Applies transforms from `iq_augmentations` (dataset-expansion style modifications).

Options: `--list`, `--help-transform`, `--params KEY=VALUE` (repeatable), `--view`, `--overwrite`, `-v` / `--verbose`, `-q` / `--quiet`

#### `impair`

```bash
ria transform impair [impairment] [input] [output] [options]
```

Applies transforms from `iq_impairments` (noise, distortion, and channel degradation effects). Same options as `augment`.

#### `custom`

```bash
ria transform custom [transform_name] [input] [output] --transform-dir <dir> [options]
```

Dynamically loads public functions from Python files in `--transform-dir` and exposes them as callable transforms.

- `--transform-dir` (required), `--list`, `--help-transform`, `--params KEY=VALUE` (repeatable), `--view`, `--overwrite`, `-v` / `--verbose`, `-q` / `--quiet`

`--params` values must be `KEY=VALUE`; types are inferred as int, float, or string. Use `--list` to enumerate available transform names, and `--help-transform <name>` to inspect parameter hints. `--view` writes a PNG preview alongside transform output.

**Examples:**

```bash
ria transform augment --list
ria transform augment channel_swap in.npy out.npy
ria transform augment drop_samples in.npy --params max_section_size=5 --view

ria transform impair --list
ria transform impair add_awgn_to_signal in.npy out.npy --params snr=10

ria transform custom --transform-dir ./my_transforms --list
ria transform custom my_filter in.npy out.npy --transform-dir ./my_transforms --params cutoff=0.2
```

**Example output:**

List available augmentations:

```
$ ria transform augment --list

Available augmentations:
  amplitude_reversal    Negates the amplitudes of both the I and Q data samples
  channel_swap          Switches the I (In-phase) with the Q (Quadrature) data samples
  cut_out               Cuts out random sections of IQ data and replaces them with zeros
  drop_samples          Randomly drops IQ data samples
  generate_awgn         Generates additive white gaussian noise relative to the SNR
  magnitude_rescale     Selects a random starting point and multiplies IQ data by a scalar
  patch_shuffle         Selects random patches and shuffles the data samples within them
  quantize_parts        Quantizes random parts of the IQ data by a few bits
  quantize_tape         Quantizes the IQ data by a few bits
  spectral_inversion    Negates the imaginary components (Q) of the data samples
  time_reversal         Reverses the order of I and Q data samples along the time axis
```

Apply an impairment (AWGN at SNR=10 dB):

```
$ ria transform impair add_awgn_to_signal sample_recording3.npy sample_recording3_awgn.npy --params snr=10

Impairing: sample_recording3.npy → sample_recording3_awgn.npy
Saved to: sample_recording3_awgn.npy
```

---

### 4.11 `transmit`

**Purpose:** Transmit IQ via a TX-capable SDR (`pluto`, `hackrf`, `bladerf`, `usrp`). Support playback of captured/generated waveforms for over-the-air or wired-loop test scenarios.

```bash
ria transmit [options]
```

If neither `--input` nor `--generate` is specified, the command defaults to a generated LFM waveform.

**Options:**

- `-d` / `--device {pluto,hackrf,bladerf,usrp}`, `-i` / `--ident`, `-c` / `--config`
- `-s` / `--sample-rate`, `-f` / `--center-frequency`, `-g` / `--gain`, `-b` / `--bandwidth`
- `--input <file>`: transmit an existing recording.
- `--generate {lfm,chirp,sine,pulse}`: synthesize a signal on the fly.
- `--legacy`: use older NPY loader for historical recordings.
- `-r, --repeat`: transmit the input a fixed number of times.
- `--continuous`: transmit until interrupted (`Ctrl+C`).
- `--tx-delay`: pause between repeats when `--repeat` is used.
- `-y, --yes`: skip confirmation prompts; use carefully in scripted environments.
- `-v` / `--verbose`, `-q` / `--quiet`

:::caution
`--continuous` transmits until manually interrupted. Validate gain settings, antenna configuration, and regulatory compliance before use.
:::

**Examples:**

```bash
ria transmit -d pluto -f 915e6 -s 2e6 --input capture.sigmf-data
ria transmit -d hackrf --generate lfm -f 2.44G --continuous
ria transmit -d usrp --input msg.npy -r 3 --tx-delay 0.5
```

**Example output:**

:::note
`transmit` requires a TX-capable SDR. The following shows representative output for a PlutoSDR playback.
:::

```
$ ria transmit -d pluto -f 915e6 -s 2e6 --input capture.sigmf-data

Initializing PlutoSDR...
  URI: ip:192.168.2.1
  Center frequency: 915.00 MHz
  Sample rate: 2.00 MS/s
  Gain: 0 dB

Transmitting capture.sigmf-data (500,000 samples)...
Transmit complete.
```

---

## 5. YAML Config Patterns

Several commands accept `--config <file.yaml>` for parameter loading. CLI flags generally override values loaded from `--config`.

Keep one stable baseline YAML per workflow (capture, generate, transmit), then override only experiment-specific fields on the CLI.

**Capture config example:**

```yaml
device: pluto
ident: 192.168.2.1
sample_rate: 2000000
center_frequency: 2.44G
gain: 20
bandwidth: 2000000
num_samples: 500000
format: sigmf
output: run1.sigmf-data
metadata:
  campaign: lab_eval
  antenna: dipole
```

```bash
ria capture -c capture.yaml
```

**Generate config example:**

```yaml
sample_rate: 2000000
num_samples: 200000
format: npy
output: synth.npy
noise_power: 0.02
```

```bash
ria generate noise --config generate.yaml
```

---

## 6. Brief Scripting (Python) Preview

For quick non-CLI use:

```python
from ria_toolkit_oss.data import Recording
from ria_toolkit_oss.io import load_recording, to_sigmf
from ria_toolkit_oss.transforms import iq_augmentations, iq_impairments

rec = load_recording("capture.sigmf-data")
aug = iq_augmentations.channel_swap(rec)
imp = iq_impairments.add_awgn_to_signal(aug, snr=10)
to_sigmf(imp, filename="capture_awgn", path=".")
```

You can also call annotation algorithms and block-generator primitives from Python directly.
