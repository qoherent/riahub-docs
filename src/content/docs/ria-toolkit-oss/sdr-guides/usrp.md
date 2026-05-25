---
title: USRP
description: Setup and usage guide for Ettus Research USRP devices with RIA Toolkit OSS.
sidebar:
  order: 6
---

The USRP (Universal Software Radio Peripheral) product line is a series of software-defined radios (SDRs) developed by Ettus Research. These devices are widely used in academia, industry, and research for various wireless communication applications, ranging from simple experimentation to complex signal processing tasks.

USRP devices offer a flexible platform that can be used with various software frameworks, including GNU Radio and the USRP Hardware Driver (UHD). The product line includes both entry-level models for hobbyists and advanced models for professional and research use.

## Supported Models

- **USRP B200/B210:** Compact, single-board, full-duplex, with a wide frequency range.
- **USRP N200/N210:** High-performance models with increased bandwidth and connectivity options.
- **USRP X300/X310:** High-end models featuring large bandwidth, multiple MIMO channels, and support for GPSDO.
- **USRP E310/E320:** Embedded devices with onboard processing capabilities.
- **USRP B200mini:** Ultra-compact model for portable and embedded applications.

## Key Features

- **Frequency Range:** Typically covers from DC to 6 GHz, depending on the model and daughter boards used.
- **Bandwidth:** Varies by model, up to 160 MHz in some high-end versions.
- **Connectivity:** Includes USB 3.0, Ethernet, and PCIe interfaces depending on the model.
- **Software Support:** Compatible with UHD, GNU Radio, and other SDR frameworks.

## Hackability

- The UHD library is fully open source and can be modified to meet user intention.
- Certain USRP models have "RFNoC" which streamlines the inclusion of custom FPGA processing in a USRP.

## Limitations

- Some models may have limited bandwidth or processing capabilities.
- Compatibility with certain software tools may vary depending on the version of the UHD.
- Price range can be a consideration, especially for high-end models.

## Set Up Instructions (Linux)

USRP devices require the UHD (USRP Hardware Driver) library with Python bindings. There is no pip-installable UHD package — it must either be installed via conda or built from source.

### Option A: Install via Conda (Recommended for Conda Environments)

```bash
conda install conda-forge::uhd
```

### Option B: Build from Source (Required for pip/venv Environments)

The Python bindings must target the same Python version used in your virtual environment.

1. Install build dependencies:

   ```bash
   sudo apt install cmake build-essential libboost-all-dev libusb-1.0-0-dev \
     python3-dev python3-numpy libncurses-dev
   ```

2. Install the Mako template library into your virtual environment (used by UHD's build system):

   ```bash
   pip install mako
   ```

3. Clone and build UHD with your virtual environment activated:

   ```bash
   git clone https://github.com/EttusResearch/uhd.git
   cd uhd
   git checkout v4.7.0.0
   cd host
   mkdir build && cd build
   cmake -DENABLE_PYTHON_API=ON -DPYTHON_EXECUTABLE=$(which python3) ..
   make -j$(nproc)
   sudo make install
   sudo ldconfig
   ```

   :::caution
   Run the `cmake` command with your virtual environment activated so `$(which python3)` points to the correct interpreter. Before running `make`, verify the cmake output includes:

   ```
   --   * LibUHD - Python API          → must say "Enabling"
   -- Python interpreter: .../your-venv/bin/python3
   ```

   If "LibUHD - Python API" is not listed under enabled components, the Python bindings will not be built. The build typically takes 10–30 minutes.
   :::

4. Copy the Python bindings into your virtual environment if `import uhd` fails after installation:

   ```bash
   cp -r ~/uhd/host/build/python/uhd ~/.venv/lib/python3.XX/site-packages/
   ```

   Replace `python3.XX` with your Python version (e.g., `python3.12`).

   :::note
   If you have a pre-existing UHD installation built against a different Python version, you will see a circular import error. The bindings must match the Python version in your virtual environment exactly.
   :::

### After Either Installation Method

1. Download UHD FPGA/firmware images:

   ```bash
   uhd_images_downloader
   ```

2. Verify device access:

   ```bash
   uhd_find_devices
   ```

   For USB devices (e.g. B-series), install a `udev` rule.

   For most users:

   ```bash
   sudo udevadm control --reload
   sudo udevadm trigger
   ```

   For **Radioconda** users, create a symlink from your conda environment instead:

   ```bash
   sudo ln -s $CONDA_PREFIX/lib/uhd/utils/uhd-usrp.rules /etc/udev/rules.d/radioconda-uhd-usrp.rules
   sudo udevadm control --reload
   sudo udevadm trigger
   ```

3. (Optional) Update firmware/FPGA images:

   ```bash
   uhd_usrp_probe
   ```

   This will ensure your device is running the latest firmware and FPGA versions.

## Further Information

- [Official USRP Website](https://www.ettus.com/)
- [USRP Documentation](https://kb.ettus.com/USRP_Hardware_Driver_and_Interfaces)
- [USRP Setup with Radioconda](https://github.com/radioconda/radioconda-installer?tab=readme-ov-file#uhd-ettus-usrp)
