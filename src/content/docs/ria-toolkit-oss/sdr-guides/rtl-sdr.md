---
title: RTL-SDR
description: Setup and usage guide for RTL-SDR devices with RIA Toolkit OSS.
sidebar:
  order: 4
---

RTL-SDR (RTL2832U Software Defined Radio) is a low-cost USB dongle originally designed for digital TV reception that has been repurposed as a wideband software-defined radio. RTL-SDR devices are popular for hobbyist use due to their affordability and wide range of applications.

The RTL-SDR is based on the Realtek RTL2832U chipset, which features direct sampling and demodulation of RF signals. These devices are commonly used for tasks such as listening to FM radio, monitoring aircraft traffic (ADS-B), receiving weather satellite images, and more.

## Supported Models

- **Generic RTL-SDR Dongle:** The most common variant, usually featuring an R820T or R820T2 tuner.
- **RTL-SDR Blog V3:** An enhanced version with additional features like direct sampling mode and a bias tee for powering external devices.

## Key Features

- **Frequency Range:** Typically from 24 MHz to 1.7 GHz, depending on the tuner chip.
- **Bandwidth:** Limited to about 2.4 MHz, making it suitable for narrowband applications.
- **Connectivity:** USB 2.0 interface, plug-and-play on most platforms.
- **Software Support:** Compatible with SDR software like SDR#, GQRX, and GNU Radio.

## Limitations

- Narrow bandwidth compared to more expensive SDRs, which may limit some applications.
- Sensitivity and performance can vary depending on the specific model and components.
- Requires external software for signal processing and analysis.

## Set Up Instructions (Linux)

1. If you previously had RTL-SDR drivers installed, purge them first:

   ```bash
   sudo apt purge ^librtlsdr
   sudo rm -rvf /usr/lib/librtlsdr*
   sudo rm -rvf /usr/include/rtl-sdr*
   sudo rm -rvf /usr/local/lib/librtlsdr*
   sudo rm -rvf /usr/local/include/rtl-sdr*
   sudo rm -rvf /usr/local/include/rtl_*
   sudo rm -rvf /usr/local/bin/rtl_*
   ```

2. Install build dependencies:

   ```bash
   sudo apt install libusb-1.0-0-dev git cmake pkg-config build-essential
   ```

3. Build `librtlsdr` from source:

   The standard `librtlsdr` package available via `apt` is missing symbols required by the Python bindings. Build from the **rtl-sdr-blog fork**:

   ```bash
   git clone https://github.com/rtlsdrblog/rtl-sdr-blog.git
   cd rtl-sdr-blog
   mkdir build && cd build
   cmake .. -DINSTALL_UDEV_RULES=ON
   make
   sudo make install
   sudo cp ../rtl-sdr.rules /etc/udev/rules.d/
   sudo ldconfig
   ```

   :::caution
   Do not use the osmocom `rtl-sdr` repository or the Ubuntu `librtlsdr-dev` apt package. Neither provides the `rtlsdr_set_dithering` symbol that the Python bindings require.
   :::

4. Blacklist the kernel DVB driver:

   The kernel DVB-T driver (`dvb_usb_rtl28xxu`) claims the RTL-SDR device and prevents `librtlsdr` from accessing it.

   For most users:

   ```bash
   echo 'blacklist dvb_usb_rtl28xxu' | sudo tee /etc/modprobe.d/blacklist-rtlsdr.conf
   sudo modprobe -r dvb_usb_rtl28xxu
   ```

   For **Radioconda** users, a blacklist configuration is already provided in your conda environment:

   ```bash
   sudo ln -s $CONDA_PREFIX/etc/modprobe.d/rtl-sdr-blacklist.conf /etc/modprobe.d/radioconda-rtl-sdr-blacklist.conf
   sudo modprobe -r $(cat $CONDA_PREFIX/etc/modprobe.d/rtl-sdr-blacklist.conf | sed -n -e 's/^blacklist //p')
   ```

   If `modprobe -r` fails with "Module is in use", unplug the RTL-SDR dongle, run the command again, then plug it back in. Alternatively, reboot — the blacklist takes effect on next boot.

   :::note
   Some systems also require blacklisting additional DVB-T modules. Add these entries to your blacklist configuration if needed: `rtl2832`, `rtl2830`.
   :::

5. Reload udev rules:

   For most users (rules are installed by the build step above):

   ```bash
   sudo udevadm control --reload
   sudo udevadm trigger
   ```

   For **Radioconda** users, create a symlink from your conda environment instead:

   ```bash
   sudo ln -s $CONDA_PREFIX/lib/udev/rules.d/rtl-sdr.rules /etc/udev/rules.d/radioconda-rtl-sdr.rules
   sudo udevadm control --reload
   sudo udevadm trigger
   ```

6. Install Python packages:

   ```bash
   pip install pyrtlsdr==0.3.0
   pip install setuptools==69.5.1
   ```

   :::note
   `pyrtlsdr` 0.4.0 references a `rtlsdr_set_dithering` symbol not present in standard `librtlsdr` builds. Version 0.3.0 works correctly.

   `pyrtlsdr` 0.3.0 depends on `pkg_resources`, which was removed in `setuptools` >= 82. Pinning to 69.5.1 ensures `pkg_resources` is available.
   :::

## Further Information

- [RTL-SDR Official Website](https://www.rtl-sdr.com/)
- [RTL-SDR Documentation](https://www.rtl-sdr.com/rtl-sdr-quick-start-guide/)
