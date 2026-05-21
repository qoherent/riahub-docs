---
title: Campaign Control
description: Use the RIA Testbed Conductor to orchestrate a controlled RF capture campaign, coordinating transmitter control and SDR recording in automated steps.
sidebar:
  order: 1
---

**Campaign Control** automates controlled RF capture experiments. It coordinates a receiver SDR (which records IQ data), one or more transmitters (which emit the signals you want to capture), per-step quality checks, and optional upload to a RIA Hub repository — all from a single campaign configuration.

A campaign is defined as a sequence of **steps**. At each step, the conductor activates a transmitter under specified conditions (channel, bandwidth, traffic type, power), records IQ data from the SDR for a set duration, then runs QA checks on the result before moving to the next step. You can define steps manually or use **sweep mode** to auto-generate a grid across power and bandwidth ranges.

**Use Campaign Control when you want to:**
- Build labelled RF recording datasets from controlled over-the-air transmissions
- Sweep a transmitter across power levels or channels to capture diverse signal conditions
- Automate multi-step capture sessions that would be tedious to run by hand
- Coordinate transmit hardware ranging from WiFi adapters and scripts, to remote SDRs over SSH, to synthetic modulation agents

**Transmitter control methods supported:**
- **External script** — a shell script controls a local device (e.g. a WiFi or Bluetooth adapter)
- **SDR agent** — a synthetic signal generator running on a nearby machine, producing modulated waveforms without physical RF hardware
- **Remote SDR (SSH + ZMQ)** — the transmit SDR is on a different machine, controlled over SSH

:::note
Campaign Control currently operates in an **SDR-to-SDR** configuration — both the transmitter and the receiver are SDR devices. Support for single-SDR setups (receive-only SDR paired with a wider range of non-SDR transmit devices) is planned for a future release.
:::

## What you'll need

- **ria-toolkit-oss** — Install the Conductor backend: `pip install ria-toolkit-oss`
- **Recorder SDR** — A supported receiver (PlutoSDR, USRP B210, HackRF, RTL-SDR, or ThinkRF) connected to the RIA Hub server
- **Transmitter** — One of the control methods above; see Step 4 for configuration details
- **Output repository** — A RIA Hub repository to receive the recordings (optional, but recommended)

## Step 1 — Open the Conductor

Click **Conductor** in the top navigation to open the Campaign Control interface.

## Step 2 — Enter campaign metadata

At the top of the form, give your campaign a **name** (e.g., `wifi-2g-sweep-2026-05`) and set the **loops** count — how many times the full capture schedule repeats. A value of `1` runs through the schedule once.

## Step 3 — Configure the recorder

The recorder is the SDR that captures IQ data.

| Parameter | Description |
|-----------|-------------|
| **Device** | SDR model: `pluto`, `usrp_b210`, `hackrf`, `rtlsdr`, or `thinkrf` |
| **Center frequency** | RF frequency to tune to (e.g., `2.45GHz` or `915MHz`) |
| **Sample rate** | ADC sampling speed (e.g., `40MHz`, `1MHz`) |
| **Gain** | Receiver gain in dB, or `auto` to let the driver choose |
| **Bandwidth** | (Optional) Analog front-end bandwidth — defaults to match the sample rate |

:::tip
If you're unsure about gain, start with `auto`. You can refine it after reviewing the first campaign's QA results.
:::

## Step 4 — Add a transmitter

Each transmitter entry defines one signal source in the campaign. You can add multiple transmitters — the conductor steps through each one in sequence.

Every transmitter needs a unique **ID** (e.g., `wifi_tx_1`) and a **control method**:

### External script

Use this when your transmitter is controlled by a shell script — for example, toggling a WiFi interface into a specific mode.

```yaml
control_method: external_script
script: /path/to/control.sh
device: /dev/wlan0
```

### SDR agent (synthetic signals)

An SDR agent is a process running on a nearby machine that generates synthetic modulated signals. This is useful when you don't have physical transmit hardware but want labeled synthetic signals captured over the air.

```yaml
control_method: sdr_agent
sdr_agent:
  modulation: QPSK       # QPSK, 16QAM, FSK, etc.
  symbol_rate: 1000000
  filter: rrc
  rolloff: 0.35
```

The agent must be running and registered with RIA Hub before you deploy the campaign.

### Remote SDR (SSH + ZMQ)

Use this when the transmit SDR is on a different machine, accessible via SSH.

```yaml
control_method: sdr_remote
sdr_remote:
  host: 192.168.1.10
  ssh_user: ubuntu
  ssh_key_path: ~/.ssh/id_rsa
  device_type: pluto
  zmq_port: 5556
```

## Step 5 — Define the capture schedule

The schedule determines what the transmitter does at each step and how long the recorder captures for each step.

**Fixed schedule** — define each step explicitly:

```yaml
schedule:
  - channel: 6
    bandwidth: 20MHz
    traffic: iperf_udp
    duration: 30s
    power: 15dBm
  - channel: 11
    bandwidth: 40MHz
    traffic: idle
    duration: 30s
```

**Sweep mode** — let the conductor auto-generate steps across a range of TX power levels:

```yaml
sweep:
  bandwidths_mhz: [20, 40, 80]
  gain_start_dbm: -20
  gain_stop_dbm: 0
  gain_step_dbm: 5
  duration_s: 10
```

Sweep mode is convenient for building datasets that cover a range of signal strengths.

## Step 6 — Configure quality assurance

The conductor runs QA checks on each recording after capture. Steps that fail QA are flagged rather than silently dropped, so you can decide whether to re-run them.

| Parameter | Description |
|-----------|-------------|
| **SNR threshold** | Flag recordings whose estimated SNR falls below this level (e.g., `10dB`) |
| **Min duration** | Flag recordings shorter than expected (e.g., `25s`) |
| **Flag for review** | When enabled, suspicious captures are marked for manual review rather than discarded |

## Step 7 — Set output options

| Parameter | Description |
|-----------|-------------|
| **Format** | Output file format — `sigmf` produces `.sigmf-data` + `.sigmf-meta` pairs |
| **Device ID** | A metadata tag embedded in each SigMF file identifying the capture hardware |
| **Repo** | (Optional) RIA Hub repository to upload recordings to on completion, in `owner/repo` format |
| **Folder** | (Optional) Subfolder within the repository |

:::note
If you leave the repo field blank, recordings are saved locally on the server but not committed. You can upload them manually later using the repository's upload interface.
:::

## Step 8 — Deploy the campaign

Click **Deploy Campaign**. The conductor queues the job and begins executing.

The status panel updates in real time as each step runs:

- Steps in progress show the current transmitter and channel
- Passed steps show their SNR and duration
- Flagged steps show the QA issue that triggered the flag
- Failed steps show the error

You can cancel a running campaign at any time.

## Step 9 — Review results

When the campaign finishes, the status panel shows a summary:

- Total steps run
- Steps passed, flagged, and failed
- Per-step: file path, SNR estimate, duration, QA status

Flagged recordings are still saved — review them to decide whether they are usable or should be re-captured.

## Step 10 — Access the recordings

If you configured an output repository in Step 7, the recordings are committed to that repo automatically and indexed in the RIA Hub library. You can then use the **Curator** to process them into a training dataset.

If you did not configure a repo, the recordings are on the server's local filesystem at the path you specified. Use the repository upload interface to commit them when you're ready.

---

## Next steps

Once your recordings are in a repository, you can:

- **Inspect** them with the [Dataset Inspector](/guides/dataset-manager/inspector/) to check signal quality
- **Curate** them with the [Curator](/guides/dataset-manager/curation/) to slice, qualify, and package them into a training dataset
