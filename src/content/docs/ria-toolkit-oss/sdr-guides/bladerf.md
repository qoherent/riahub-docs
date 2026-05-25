---
title: BladeRF
description: Setup and usage guide for the BladeRF SDR platform with RIA Toolkit OSS.
sidebar:
  order: 1
---

The BladeRF is a versatile software-defined radio (SDR) platform developed by Nuand. It is designed for a wide range of applications, from wireless communication research to field deployments. BladeRF devices are known for their high performance, flexibility, and extensive open-source support, making them suitable for both hobbyists and professionals. The BladeRF is based on the Analog Devices AD9361 RF transceiver, which provides wide frequency coverage and high bandwidth.

## Supported Models

- **BladeRF 2.0 Micro xA4:** A compact model with a 49 kLE FPGA, ideal for portable applications.
- **BladeRF 2.0 Micro xA9:** A higher-end version of the Micro with a 115 kLE FPGA, offering more processing power in a small form factor.

## Key Features

- **Frequency Range:** Typically from 47 MHz to 6 GHz, covering a wide range of wireless communication bands.
- **Bandwidth:** Up to 56 MHz, allowing for wideband signal processing.
- **FPGA:** Integrated FPGA (varies by model) for real-time processing and custom logic development.
- **Connectivity:** USB 3.0 interface for high-speed data transfer, with options for GPIO, SPI, and other I/O.

## Hackability

- **Expansion:** The BladeRF features GPIO, expansion headers, and add-on boards, allowing users to extend the functionality of the device for specific applications, such as additional RF front ends.
- **Frequency and Bandwidth Modification:** Advanced users can modify the BladeRF's settings and firmware to explore different frequency bands and optimize the bandwidth for their specific use cases.

## Limitations

- The complexity of FPGA development may present a steep learning curve for users unfamiliar with hardware description languages (HDL).
- Bandwidth is capped at 56 MHz, which might not be sufficient for ultra-wideband applications.
- USB 3.0 connectivity is required for optimal performance; using USB 2.0 will significantly limit data transfer rates.

## Set Up Instructions (Linux)

No additional Python packages are required for BladeRF beyond the base RIA Toolkit OSS installation.

1. Install the system library:

   ```bash
   sudo apt install libbladerf-dev
   ```

   For a more complete installation including CLI tools and FPGA images, use the Nuand PPA:

   ```bash
   sudo add-apt-repository ppa:nuandllc/bladerf
   sudo apt-get update
   sudo apt-get install bladerf libbladerf-dev
   sudo apt-get install bladerf-fpga-hostedxa4  # Necessary for BladeRF 2.0 Micro xA4
   ```

2. Install udev rules:

   For most users:

   ```bash
   sudo udevadm control --reload
   sudo udevadm trigger
   ```

   For **Radioconda** users, create symlinks from your conda environment instead:

   ```bash
   sudo ln -s $CONDA_PREFIX/lib/udev/rules.d/88-nuand-bladerf1.rules /etc/udev/rules.d/88-radioconda-nuand-bladerf1.rules
   sudo ln -s $CONDA_PREFIX/lib/udev/rules.d/88-nuand-bladerf2.rules /etc/udev/rules.d/88-radioconda-nuand-bladerf2.rules
   sudo ln -s $CONDA_PREFIX/lib/udev/rules.d/88-nuand-bootloader.rules /etc/udev/rules.d/88-radioconda-nuand-bootloader.rules
   sudo udevadm control --reload
   sudo udevadm trigger
   ```

## Further Information

- [Official BladeRF Website](https://www.nuand.com/)
- [BladeRF GitHub Repository](https://github.com/Nuand/bladeRF)
- [BladeRF Setup with Radioconda](https://github.com/radioconda/radioconda-installer?tab=readme-ov-file#bladerf)
