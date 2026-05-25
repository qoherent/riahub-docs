---
title: SDR Reception
description: Example demonstrating how to receive and record IQ signals using RIA Toolkit OSS.
sidebar:
  order: 1
---

## Introduction

The following examples demonstrate how to initialize an SDR, record a signal, and transmit a custom waveform. These examples assume familiarity with Python and SDR concepts.

In this example, we use the [bladeRF](https://www.nuand.com/bladerf-1/). However, because this package presents a common interface for all SDR devices, the same code can be used to interface with additional supported radios.

:::note
Most SDR devices require additional setup after installing RIA Toolkit OSS. See the [SDR Guides](/ria-toolkit-oss/sdr-guides/bladerf/) for device-specific configuration instructions.
:::

## Code

In this example, we initialize the `Blade` SDR and configure it to record a signal for a specified duration.

```python
import time

from ria_toolkit_oss.data.recording import Recording
from ria_toolkit_oss.sdr.blade import Blade

my_radio = Blade()
print(my_radio)
print(type(my_radio))

my_radio.init_rx(
    sample_rate=1e6,
    center_frequency=2.44e9,
    gain=50,
    channel=0,
)

rx_time = 0.01
start = time.time()
my_rec = my_radio.record(rx_time=rx_time)
end = time.time()

print(f"Total time: {end - start} seconds")
print(f"Length of the recording: {len(my_rec)} samples")
```

## Conclusion

This example demonstrates how to use the `Blade` class to receive samples into a `Recording` object. By customizing the parameters, we can adapt this example to various signal processing and SDR tasks.
