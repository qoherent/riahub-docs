---
title: RIA Testbed Conductor
description: Overview of the RIA Testbed Conductor and its three modules — Campaign Control, Training Dashboard, and Zone Fingerprinting Demo.
sidebar:
  order: 0
---

The **RIA Testbed Conductor** is a set of tools for running controlled RF experiments from within RIA Hub. It covers the full loop from capturing raw RF recordings, to training a fingerprinting model, to running live inference against a software-defined radio.

The Conductor has three modules, accessible from the **Conductor** menu in the top navigation:

| Module | What it does |
|--------|-------------|
| [Campaign Control](/guides/conductor/campaign-control/) | Deploy automated RF capture campaigns — coordinates transmitter control and SDR recording across one or more steps |
| [Training Dashboard](/guides/conductor/training-dashboard/) | Trigger and monitor model training workflows via GitHub Actions |
| [Zone Fingerprinting Demo](/guides/conductor/zone-fingerprinting/) | Load a trained ONNX fingerprinting model and run live device identification against a local or remote SDR |

## Prerequisites

The Conductor backend is provided by the **ria-toolkit-oss** package. Install it with:

```bash
pip install ria-toolkit-oss
```

The RIA Hub controller must have access to a running ria-toolkit-oss server for Conductor features to work. Contact your RIA Hub administrator if Conductor pages are not responding.
