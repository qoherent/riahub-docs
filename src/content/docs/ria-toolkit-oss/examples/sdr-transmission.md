---
title: SDR Transmission
description: Example demonstrating how to generate and transmit a chirp signal using RIA Toolkit OSS.
sidebar:
  order: 2
---

## Introduction

This example illustrates how to generate a custom chirp signal and transmit it using the `Blade` SDR. The waveform is created using the `numpy` library and encapsulated in a `Recording` object.

:::note
Most SDR devices require additional setup after installing RIA Toolkit OSS. See the [SDR Guides](/ria-toolkit-oss/sdr-guides/bladerf/) for device-specific configuration instructions.
:::

## Code

```python
import time

import numpy as np

from ria_toolkit_oss.data.recording import Recording
from ria_toolkit_oss.sdr.blade import Blade

# Parameters
num_samples = 1_000_000  # Total number of samples
num_chirps = 10  # Number of upchirps
sample_rate = 1e6  # Sample rate in Hz (arbitrary choice for normalization)
chirp_duration = num_samples // num_chirps / sample_rate  # Duration of each chirp in seconds
f_start = 0  # Start frequency of the chirp (normalized)
f_end = 0.5 * sample_rate  # End frequency of the chirp (normalized to Nyquist)

# Generate IQ data as a series of chirps
t = np.linspace(
    0, chirp_duration, num_samples // num_chirps, endpoint=False
)
chirp = np.exp(
    2j
    * np.pi
    * (t * f_start + (f_end - f_start) / (2 * chirp_duration) * t**2)
)
iq_data = np.tile(chirp, num_chirps)[:num_samples].astype("complex64")

# Wrap in Recording object
iq_data = Recording(data=iq_data)

# Initialize and configure the radio
my_radio = Blade()
my_radio.init_tx(
    sample_rate=sample_rate,
    center_frequency=2.44e9,
    gain=50,
    channel=0,
)

# Transmit the recording
start = time.time()
my_radio.transmit_recording(recording=iq_data, tx_time=10)
end = time.time()

print(f"Transmission complete. Total time: {end - start:.4f} seconds")
```

## Conclusion

This example demonstrates how to use the `Blade` class to transmit a custom waveform. By customizing the parameters, we can adapt this example to various signal processing and SDR tasks.
