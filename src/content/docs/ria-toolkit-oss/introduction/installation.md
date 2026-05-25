---
title: Installation
description: Install RIA Toolkit OSS via Conda, pip, or from source.
sidebar:
  order: 1
---

RIA Hub Toolkit OSS can be installed either as a Conda package or as a standard Python package.

Please note that SDR drivers must be installed separately. Refer to the [SDR Guides](/ria-toolkit-oss/sdr-guides/bladerf/) section for additional setup instructions.

Common driver packages by device (exact package names depend on your OS):

| Device | Driver Package |
|--------|----------------|
| USRP | UHD drivers |
| Pluto | libiio / IIO utilities |
| BladeRF | libbladeRF |
| HackRF | libhackrf |
| RTL-SDR | librtlsdr |

We want your experience with RIA Toolkit OSS to be as smooth and frictionless as possible. If you run into any issues during installation, please reach out to our support team: `support@qoherent.ai`.

## Installation with Conda (Recommended)

Conda packages for RIA Toolkit OSS are available on [RIA Hub](https://riahub.ai/qoherent/-/packages/conda/ria-toolkit-oss).

RIA Toolkit OSS can be installed into any Conda environment. However, it is recommended to install within the base environment of [Radioconda](https://github.com/radioconda/radioconda-installer), which includes [GNU Radio](https://www.gnuradio.org/) and several pre-configured libraries for common SDR devices. Detailed instructions for installing and setting up Radioconda are available in the project README.

Please follow the steps below to install RIA Toolkit OSS using Conda:

1. Before installing RIA Toolkit OSS into your Conda environment, update the Conda package manager:

   ```bash
   conda update --force conda
   ```

   This ensures that the Conda package manager is fully up-to-date, allowing new or updated packages to be installed into the base environment without conflicts.

2. Add RIA Hub to your Conda channel configuration:

   ```bash
   conda config --add channels https://riahub.ai/api/packages/qoherent/conda
   ```

3. Activate your Conda environment and install RIA Toolkit OSS. For example, with Radioconda:

   ```bash
   conda activate base
   conda install ria-toolkit-oss
   ```

4. After installing RIA Toolkit OSS, verify that the installation was successful by running:

   ```bash
   conda list
   ```

   If installation was successful, you should see a line item for `ria-toolkit-oss`:

   ```
   ria-toolkit-oss           <version>                  <build>    https://riahub.ai/api/packages/qoherent/conda
   ```

## Installation with pip

RIA Toolkit OSS is available as a standard Python package on both [RIA Hub](https://riahub.ai/qoherent/-/packages/pypi/ria-toolkit-oss) and [PyPI](https://pypi.org/project/ria-toolkit-oss/).

These packages can be installed into a standard Python virtual environment using pip. For help getting started with Python virtual environments, refer to the [Python Virtual Environments tutorial](https://www.w3schools.com/python/python_virtualenv.asp).

Please follow the steps below to install RIA Toolkit OSS using pip:

1. Create and activate a Python virtual environment:

   On Linux/macOS:

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

   On Windows (Command Prompt):

   ```
   python -m venv venv
   venv\Scripts\activate
   ```

2. Upgrade pip and install RIA Toolkit OSS:

   ```bash
   pip install --upgrade pip
   pip install ria-toolkit-oss
   ```

3. Verify the CLI is available:

   ```bash
   ria --help
   ```

   A successful install prints the top-level help text. `pyproject.toml` registers two entrypoints — `ria` and `ria-tools` — that both point to the same CLI module.

:::note
RIA Toolkit OSS can also be installed from RIA Hub. However, RIA Hub does not yet support a proxy or cache for public packages. In the meantime, please use the `--no-deps` option with pip to skip automatic dependency installation, and then manually install each dependency afterward.
:::

## Installation from Source

RIA Toolkit OSS can be installed directly from the source code. This approach is only recommended if you require an unpublished or development version of the project. Follow the steps below:

1. Clone the repository:

   ```bash
   git clone https://riahub.ai/qoherent/ria-toolkit-oss.git
   ```

2. Navigate into the project directory:

   ```bash
   cd ria-toolkit-oss
   ```

3. Install with pip:

   ```bash
   pip install .
   ```

   For local development, use `pip install -e .` instead to install in editable mode so local changes take effect immediately without reinstalling.
