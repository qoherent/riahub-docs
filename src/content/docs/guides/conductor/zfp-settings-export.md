---
title: Using Exported ZFP Settings with ria-toolkit-oss
description: How to take the JSON settings exported from the RIA Hub zone fingerprinting screens and use them directly with the ria-toolkit-oss command-line tools.
sidebar:
  order: 5
---

Each of the three Zone Fingerprinting screens in RIA Hub — **Capture Setup**, **Campaign Control (Enrollment)**, and **Zone Fingerprinting Demo (Inference)** — has an **Export Settings JSON** button. The downloaded file captures all the configuration choices you made in the UI. This guide shows you how to take those files and reproduce or automate the same workflow from the command line using `ria-toolkit-oss`.

## Why export settings?

- **Reproducibility** — share your exact SDR and capture configuration with teammates.
- **Automation** — feed the exported JSON directly into CI/CD pipelines or scheduled jobs.
- **OSS portability** — run the same fingerprinting pipeline on a server without a RIA Hub installation.

## The three export files

| Screen | Filename | `screen` field |
|--------|----------|----------------|
| Screen 1 — Capture Setup | `zfp-capture-settings.json` | `capture_setup` |
| Screen 2 — Enrollment (Campaign) | `zfp-enrollment-settings.json` | `enrollment_campaign` |
| Screen 3 — Inference | `zfp-inference-settings.json` | `zone_fingerprinting_inference` |

All files follow the same envelope:

```json
{
  "screen": "<screen_id>",
  "version": "1.0",
  "settings": { ... },
  "docs": "https://docs.ria.qoherent.ai/guides/conductor/zfp-settings-export"
}
```

---

## Screen 1 — Capture Setup

The `settings` block mirrors the SDR capture session configuration:

```json
{
  "protocol": "wifi",
  "device": "plutosdr",
  "centerFreq": 2437000000,
  "sampleRate": 10000000,
  "gain": 40,
  "durationSec": 30,
  "recordingsPerDevice": 5
}
```

### Using the capture YAML workflow

Screen 1 also exports a **YAML workflow file** (`capture_workflow.yml`). Commit it to your campaign repo under `.ria/capture_workflow.yml` and run:

```bash
qdm capture run --workflow .ria/capture_workflow.yml
```

To drive the capture directly from the JSON settings file:

```python
import json
from ria_toolkit_oss.capture import CaptureSession

with open("zfp-capture-settings.json") as f:
    cfg = json.load(f)["settings"]

session = CaptureSession(
    device=cfg["device"],
    center_freq=cfg["centerFreq"],
    sample_rate=cfg["sampleRate"],
    gain=cfg["gain"],
    duration_sec=cfg["durationSec"],
)
session.run()
```

---

## Screen 2 — Enrollment (Campaign Control)

The `settings` block contains the full campaign configuration object — the same JSON you would type into the "Edit as JSON" view in the UI. Pass it directly to the `qdm campaign run` command:

```bash
qdm campaign run --config zfp-enrollment-settings.json
```

Or use it with the Python API:

```python
import json
from ria_toolkit_oss.conductor import Campaign

with open("zfp-enrollment-settings.json") as f:
    payload = json.load(f)

# payload["settings"] is the campaign configuration dict
campaign = Campaign.from_dict(payload["settings"])
campaign.run()
```

### Protocol-specific notes

| Protocol | What you need to do |
|----------|---------------------|
| **WiFi** | Connect the device to a network and run a ping test or video stream to generate traffic. |
| **Bluetooth** | Put the device into pairing mode so it broadcasts advertisement packets continuously. It does not need to complete pairing. |
| **Zigbee** | Use a coordinator to put the device into join/permit-join mode, or trigger a sensor event. |

---

## Screen 3 — Inference (Zone Fingerprinting Demo)

The `settings` block captures the inference configuration:

```json
{
  "sdr": { "center_freq": 2437000000, "sample_rate": 10000000, "gain": 40 },
  "inference": {
    "model_repo": "owner/repo",
    "model_file": "models/zfp_v1.onnx",
    "sdr_device": "plutosdr",
    "center_freq": 2437000000,
    "sample_rate": 10000000,
    "gain": 40,
    "detector_threshold": 0.7
  },
  "enrolled_repo": "owner/campaign-repo",
  "scan_mode": "continuous",
  "confidence_threshold": 0.8
}
```

Run inference from the command line:

```bash
qdm infer run \
  --model models/zfp_v1.onnx \
  --device plutosdr \
  --center-freq 2437000000 \
  --sample-rate 10000000 \
  --gain 40 \
  --confidence-threshold 0.8
```

Or from Python:

```python
import json
from ria_toolkit_oss.inference import FingerprintInference

with open("zfp-inference-settings.json") as f:
    cfg = json.load(f)["settings"]

inf = FingerprintInference(
    model_path=cfg["inference"]["model_file"],
    device=cfg["inference"]["sdr_device"],
    center_freq=cfg["inference"]["center_freq"],
    sample_rate=cfg["inference"]["sample_rate"],
    gain=cfg["inference"]["gain"],
    confidence_threshold=cfg["confidence_threshold"],
)

for result in inf.stream():
    if result.authorized:
        print(f"✓ {result.device_id} ({result.confidence:.0%})")
    else:
        print(f"✗ Unknown — {result.device_id}")
```

---

## Enrolled devices file

Screen 3 stores enrolled devices in your campaign repo at `.ria/enrolled_devices.json`. You can load and use it independently:

```python
import json

with open(".ria/enrolled_devices.json") as f:
    devices = json.load(f)

enrolled_ids = {d["id"] for d in devices}
```

---

## Combining all three exports

A common automation pattern is to chain all three settings files into a single pipeline script:

```bash
# 1. Capture training data
qdm capture run --workflow .ria/capture_workflow.yml

# 2. Run enrollment campaign
qdm campaign run --config zfp-enrollment-settings.json

# 3. Start live inference
qdm infer run --settings zfp-inference-settings.json
```

For questions, see the [Zone Fingerprinting Demo guide](./zone-fingerprinting.md) or the [Campaign Control guide](./campaign-control.md).
