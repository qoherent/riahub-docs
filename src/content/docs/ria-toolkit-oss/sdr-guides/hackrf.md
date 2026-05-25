---
title: HackRF
description: Setup and usage guide for the HackRF One SDR with RIA Toolkit OSS.
sidebar:
  order: 2
---

The HackRF One is a portable and affordable software-defined radio developed by Great Scott Gadgets. It is an open source hardware platform that is designed to enable test and development of modern and next generation radio technologies.

The HackRF is based on the Analog Devices MAX2839 transceiver chip, which supports both transmission and reception of signals across a wide frequency range, combined with a MAX5864 RF front-end chip and a RFFC5072 wideband synthesizer/VCO.

## Supported Models

- **HackRF One:** The standard model with a frequency range of 1 MHz to 6 GHz and a bandwidth of up to 20 MHz.
- **Opera Cake for HackRF:** An antenna switching add-on board for HackRF One that is configured with command-line software.

## Key Features

- **Frequency Range:** 1 MHz to 6 GHz.
- **Bandwidth:** 2 MHz to 20 MHz.
- **Connectivity:** USB 2.0 interface with support for power, data, and firmware updates.
- **Software Support:** Compatible with GNU Radio, SDR#, and other SDR frameworks.
- **Onboard Processing:** ARM-based LPC4320 processor for digital signal processing and interfacing over USB.

## Limitations

- Bandwidth is limited to 20 MHz.
- USB 2.0 connectivity might limit data transfer rates compared to USB 3.0 or Ethernet-based SDRs.

## Set Up Instructions (Linux)

HackRF is supported out of the box after installing RIA Toolkit OSS.

1. Ensure `libhackrf` is installed at the system level. On most Ubuntu installations this is already present. If not:

   ```bash
   sudo apt install libhackrf-dev
   ```

2. Install udev rules to allow non-root device access:

   For most users:

   ```bash
   sudo udevadm control --reload
   sudo udevadm trigger
   ```

   For **Radioconda** users, create a symlink from your conda environment instead:

   ```bash
   sudo ln -s $CONDA_PREFIX/lib/udev/rules.d/53-hackrf.rules /etc/udev/rules.d/53-radioconda-hackrf.rules
   sudo udevadm control --reload
   sudo udevadm trigger
   ```

   Make sure your user account belongs to the `plugdev` group in order to access your device:

   ```bash
   sudo usermod -a -G plugdev <user>
   ```

:::note
You may have to restart your system for group membership changes to take effect.
:::

## Further Information

- [Official HackRF Website](https://greatscottgadgets.com/hackrf/)
- [HackRF Project Documentation](https://hackrf.readthedocs.io/en/latest/)
- [HackRF Software Installation Guide](https://hackrf.readthedocs.io/en/latest/installing_hackrf_software.html)
- [HackRF GitHub Repository](https://github.com/greatscottgadgets/hackrf)
- [HackRF Setup with Radioconda](https://github.com/radioconda/radioconda-installer?tab=readme-ov-file#hackrf)
