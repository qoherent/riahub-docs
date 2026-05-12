---
title: Zone Fingerprinting Demo
description: Load a trained RF fingerprinting model and run live device identification against a local or remote SDR using the RIA Testbed Conductor.
sidebar:
  order: 3
---

## Overview

The **Zone Fingerprinting Demo** uses a trained ONNX model to identify which enrolled device is currently transmitting, in real time, by analysing the unique RF characteristics of each device's signal.

Every radio transmitter has subtle hardware imperfections — slight frequency offsets, non-linearities, and noise floor signatures — that act like a fingerprint. A model trained on enough labelled captures of a device can learn to recognise it even when the modulation scheme or channel conditions change. The demo puts that capability in front of a live SDR feed and shows you detections as they happen.

**Use the Zone Fingerprinting Demo when you want to:**
- Verify that a trained fingerprinting model correctly identifies known devices in a live RF environment
- Demo authorised/unauthorised device detection in a controlled space
- Tune detection sensitivity and test the optional protocol detector before deploying a production system
- Monitor which enrolled devices are active and when

**The demo runs in three phases:**
1. **Enrol devices** — define the set of known transmitters and their IDs
2. **Load and configure** — select the ONNX model, configure the SDR, and optionally add a protocol detector
3. **Live inference** — watch detections stream in with confidence scores, SNR, and authorisation status

## What you'll need

- **ria-toolkit-oss** — Install the Conductor backend: `pip install ria-toolkit-oss`
- **Trained ONNX model** — A `.onnx` fingerprinting model stored in a RIA Hub repository (typically produced by the [Training Dashboard](/guides/conductor/training-dashboard/))
- **SDR hardware** — A supported device (PlutoSDR, USRP B210, or HackRF) connected to the RIA Hub server or a registered remote agent. Use `mock` mode to test without hardware.

---

## Phase 1 — Manage enrolled devices

Enrolled devices are the set of known transmitters your model has been trained to recognise.

### Open the demo

Click **Conductor** in the top navigation, then select **Zone Fingerprinting Demo**.

### View and edit the device list

The **Enrolled Devices** table on the right shows the devices currently on file for your selected repository. Each entry has:
- **Device ID** — must match the IDs used during training
- **Display name** — human-readable label shown in the detection log
- **Protocol** — WiFi, Bluetooth, or Other

Click **Manage** to open the device editor. From here you can add rows, remove devices, and save the updated list back to the repository. Changes are committed to `.ria/enrolled_devices.json` in your repo.

:::note
The device IDs here must match the IDs passed to the Training Dashboard when the model was trained. Mismatches will cause predictions to fail to resolve to a display name.
:::

---

## Phase 2 — Load the model and configure the SDR

### Select a target node *(optional)*

By default, inference runs on the RIA Hub server itself. To run on a remote agent, select it from the **Target Node** dropdown. All subsequent inference requests are routed to that node.

### Load the fingerprinting model

Under **Model Configuration**, choose how to provide the model:

**Repo picker** *(recommended)*

1. Search for the repository containing your `.onnx` file
2. Select the file — the dashboard automatically peeks the model's embedded metadata
3. If the model contains an embedded label map (a mapping of device ID → class index), it is detected and applied automatically

**Local path**

Enter the absolute file path to an `.onnx` file on the controller machine. Use this when the model is pre-downloaded or stored outside of a repository.

### Label map

The label map tells the inference engine which output class corresponds to which device ID. Format:

```json
{"iphone13_wifi_001": 0, "pixel7_wifi_002": 1, "noise": 2}
```

If the model's metadata contained an embedded label map, this field is pre-filled. Otherwise, enter it manually — it must match the class indices your model was trained with.

### Protocol detector *(optional)*

Enable the **Protocol Detector** toggle to add a second ONNX model that gates fingerprinting on whether a signal of the expected protocol is actually present. This reduces false positives when the band is quiet.

Configure it the same way as the fingerprinting model, then set the **sensitivity threshold** (0.5–0.95). A lower threshold makes the detector more aggressive — it triggers on weaker signals.

### SDR configuration

| Parameter | Description |
|-----------|-------------|
| **Device** | SDR model: `plutosdr`, `usrp_b210`, `hackrf`, or `mock` (software simulation) |
| **Center frequency (Hz)** | RF frequency to monitor (e.g., `2450000000` for 2.45 GHz) |
| **Sample rate (Hz)** | Samples per second (e.g., `10000000` for 10 MSPS) |
| **Gain (dB)** | Receiver gain, 0–76 dB |

:::tip
Use `mock` as the device during initial setup to verify the model and label map load correctly before connecting real hardware.
:::

### Start inference

Click **Load & Start**. The dashboard loads the model(s) onto the target node, then starts the SDR feed and inference loop. A pulsing **Inference Running** indicator confirms the pipeline is active.

---

## Phase 3 — Monitor live results

### Detection LED

The large status indicator shows the current detection state:

| Colour | Meaning |
|--------|---------|
| Green (pulsing) | An enrolled, authorised device was detected |
| Red | An unrecognised transmitter detected — not in the enrolled list |
| Grey | No signal activity above threshold |

The label below shows the detected device name and confidence percentage.

### Signal meter

Displays the estimated SNR of the most recent detection in dB. Use this to check that the SDR is receiving a usable signal — very low SNR (below ~5 dB) suggests a gain or antenna issue.

### Adjusting settings during a run

The **SDR Settings** panel lets you change centre frequency, sample rate, and gain without stopping inference. Changes take effect immediately.

The **Detection Sensitivity** slider controls the confidence threshold above which a detection is logged to the event table. Raise it to reduce noise in the log; lower it to catch weaker detections.

**Scan mode:**
- **Continuous** — inference runs on every incoming chunk
- **On-demand** — inference is triggered manually (useful for debugging or low-power scenarios)

### Detection events log

Every detection above the confidence threshold is appended to the events table with:
- Timestamp
- Device ID and display name
- Protocol
- Confidence percentage
- Authorised / Unauthorised flag

The log holds the last 50 events. Click **Clear** to reset it.

The **Enrolled Devices** table updates in real time — a device row turns green when that device has been detected within the last few seconds.

### Stop inference

Click **Stop Inference** to end the session. The SDR connection is released and the inference process stops. Model configuration is preserved so you can restart quickly.
