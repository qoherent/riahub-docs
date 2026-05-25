---
title: PlutoSDR
description: Setup and usage guide for the ADALM-PLUTO SDR with RIA Toolkit OSS.
sidebar:
  order: 3
---

The ADALM-PLUTO (PlutoSDR) is a portable and affordable software-defined radio developed by Analog Devices. It is designed for learning, experimenting, and prototyping in wireless communication. The PlutoSDR is based on the AD9363 transceiver chip, which supports both transmission and reception of signals across a wide frequency range.

## Supported Models

| Model | Frequency Range | Bandwidth |
|-------|----------------|-----------|
| ADALM-PLUTO (standard) | 325 MHz to 3.8 GHz | Up to 20 MHz |
| Modified ADALM-PLUTO | ~70 MHz to 6 GHz (firmware patched) | Up to 56 MHz (modified) |

## Key Features

- **Frequency Range:** 325 MHz to 3.8 GHz (standard), expandable with modifications
- **Bandwidth:** Up to 20 MHz, up to 56 MHz with firmware modifications
- **Interface:** USB 2.0 with support for power, data, and firmware updates
- **Software Support:** Compatible with GNU Radio, MATLAB, Simulink, and other SDR frameworks
- **Onboard Processing:** Integrated ARM Cortex-A9 processor for custom applications

## Hackability

- **Frequency & Bandwidth:** The default range can be expanded to ~70 MHz to 6 GHz and bandwidth increased to 56 MHz via firmware modification (may affect stability)
- **2×2 MIMO:** On Rev C models, 2×2 MIMO can be unlocked by wiring UFL to SMA connectors to the PCB

## Limitations

- Bandwidth limited to 20 MHz by default (56 MHz with modification, may affect stability)
- USB 2.0 connectivity may limit data transfer rates compared to USB 3.0 or Ethernet-based SDRs

## Linux Setup Instructions

The PlutoSDR is supported out of the box after installing RIA Toolkit OSS. The required Python package (`pyadi-iio`) is included in the toolkit's dependencies.

### 1. Install libiio

On most Ubuntu installations this is already present. If not:

```bash
sudo apt install libiio-dev libiio-utils libiio0
```

:::note
PlutoSDR devices are discoverable over both USB and network (mDNS). Network discovery uses Avahi — if `avahi-daemon` is not running, network discovery will be skipped but USB discovery still works.
:::

### 2. Install udev Rules

For most users:

```bash
sudo udevadm control --reload
sudo udevadm trigger
```

For **Radioconda** users, create a symlink from your conda environment:

```bash
sudo ln -s $CONDA_PREFIX/lib/udev/rules.d/90-libiio.rules /etc/udev/rules.d/90-radioconda-libiio.rules
sudo udevadm control --reload
sudo udevadm trigger
```

### 3. (Optional) Build libiio or libad9361-iio from Source

Only required if you need a version not available via `apt`. First install build dependencies:

```bash
sudo apt-get install -y build-essential git libxml2-dev bison flex libcdk5-dev cmake \
  libusb-1.0-0-dev libavahi-client-dev libavahi-common-dev libaio-dev
```

Build libiio from source:

```bash
cd ~
git clone --branch v0.23 https://github.com/analogdevicesinc/libiio.git
cd libiio
mkdir -p build && cd build
cmake -DPYTHON_BINDINGS=ON ..
make -j"$(nproc)"
sudo make install
sudo ldconfig
```

Build libad9361-iio from source:

```bash
cd ~
git clone https://github.com/analogdevicesinc/libad9361-iio.git
cd libad9361-iio
mkdir -p build && cd build
cmake ..
make -j"$(nproc)"
sudo make install
```

## Further Information

- [PlutoSDR Documentation](https://wiki.analog.com/university/tools/pluto)
- [PlutoSDR Setup with Radioconda](https://github.com/radioconda/radioconda-installer?tab=readme-ov-file#iio-pluto-sdr)
