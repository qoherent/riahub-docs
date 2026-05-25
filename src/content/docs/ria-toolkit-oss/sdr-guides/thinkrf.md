---
title: ThinkRF
description: Setup and usage guide for ThinkRF spectrum analyzers with RIA Toolkit OSS.
sidebar:
  order: 5
---

The ThinkRF series of spectrum analyzers and software-defined radio platforms are designed for advanced RF signal monitoring, analysis, and wireless research. These devices combine high-performance RF front ends with flexible software interfaces for a wide range of applications, including spectrum monitoring, signal intelligence, and wireless testing.

ThinkRF devices offer wide frequency coverage, deep dynamic range, and real-time analysis capabilities. They are built for professional and research-grade environments, offering Ethernet-based connectivity and software APIs for remote control and integration into automated systems.

## Supported Models

- **ThinkRF R5550:** A real-time spectrum analyzer with frequency coverage from 9 kHz to 27 GHz, 160 MHz real-time bandwidth, and 100 MHz instantaneous FFT bandwidth.

## Key Features

- **Frequency Range:** 9 kHz to 27 GHz (depending on model).
- **Bandwidth:** Up to 160 MHz real-time bandwidth.
- **Connectivity:** Gigabit Ethernet interface for high-throughput streaming and remote control.
- **Software Support:** Compatible with ThinkRF APIs, GNU Radio, MATLAB, and third-party spectrum analysis software.
- **Real-Time Analysis:** Enables full-band, real-time spectral visibility for dynamic signal environments. Supports trigger-based capture and event-driven recording.
- **Remote Operation:** Designed for distributed deployments and networked operation through Ethernet. Can be integrated into automated RF monitoring systems or deployed for field data collection.

## Limitations

- Requires external host for processing (no onboard CPU for user applications).
- Dependent on ThinkRF software drivers and API for device control.
- High data rate operation may require optimized network settings or storage systems.

## Set Up Instructions (Linux)

ThinkRF devices require the `pyrf` package, which is written in Python 2 syntax and must be patched after installation to work with Python 3.

:::caution
`lib2to3` was fully removed in Python 3.13. ThinkRF support is currently limited to **Python 3.12 and below**.
:::

1. Install `lib2to3`:

   On some distributions (including Ubuntu 24.04+), `lib2to3` is not included by default:

   ```bash
   sudo apt install python3-lib2to3
   ```

2. Install `pyrf`:

   ```bash
   pip install pyrf
   ```

3. Patch `pyrf` for Python 3:

   The `pyrf` package contains Python 2 syntax throughout (e.g., `dict.iteritems()`, `print` statements). Run the following to automatically convert the entire package to Python 3:

   ```bash
   python -c "
   from lib2to3.refactor import RefactoringTool, get_fixers_from_package
   import pyrf, os
   pyrf_path = os.path.dirname(pyrf.__file__)
   fixers = get_fixers_from_package('lib2to3.fixes')
   tool = RefactoringTool(fixers)
   tool.refactor_dir(pyrf_path, write=True)
   print('Done')
   "
   ```

   :::note
   This patches the entire `pyrf` package in place, which is required for the driver to fully load.
   :::

## Further Information

- [ThinkRF Documentation](https://thinkrf.com/resources/)
- [ThinkRF Product Page](https://thinkrf.com/products/)
- [Pyrf GitHub Page](https://github.com/pyrf/pyrf)
