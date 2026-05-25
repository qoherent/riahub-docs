---
title: SDR Package
description: API reference for ria_toolkit_oss.sdr — unified SDR interface and device implementations.
sidebar:
  order: 2
---

The `ria_toolkit_oss.sdr` package provides a unified API for interacting with various software-defined radios, streamlining signal reception, transmission, and device detection.

## SDR (Abstract Base Class)

The `SDR` abstract base class defines the standard interface that all device implementations must follow. To support a new radio device, subclass this interface and implement all abstract methods.

### Signal Capture

| Method | Description |
|--------|-------------|
| `record(num_samples=None, rx_time=None)` | Records IQ samples for a specified duration or sample count; returns a `Recording` |
| `rx(num_samples)` | Returns complex IQ samples as a 1-D complex64 array |

### Signal Transmission

| Method | Description |
|--------|-------------|
| `tx_recording(recording, num_samples=None, tx_time=None)` | Transmits IQ samples from a `Recording` |

### Streaming

| Method | Description |
|--------|-------------|
| `stream_to_zmq(zmq_address, n_samples, buffer_size=10000)` | Streams samples via ZMQ |
| `pickle_buffer_to_zmq(zmq_address, buffer_size, num_buffers)` | Streams pickled numpy buffers via ZMQ |

### Receiver Configuration

| Method | Description |
|--------|-------------|
| `init_rx(sample_rate, center_frequency, gain, channel, gain_mode)` | Initialize receiver |
| `get_rx_sample_rate()` / `set_rx_sample_rate()` | Get/set RX sample rate |
| `get_rx_center_frequency()` / `set_rx_center_frequency()` | Get/set RX center frequency |
| `get_rx_gain()` / `set_rx_gain()` | Get/set RX gain |

### Transmitter Configuration

| Method | Description |
|--------|-------------|
| `init_tx(sample_rate, center_frequency, gain, channel, gain_mode)` | Initialize transmitter |
| `get_tx_sample_rate()` / `set_tx_sample_rate()` | Get/set TX sample rate |
| `get_tx_center_frequency()` / `set_tx_center_frequency()` | Get/set TX center frequency |
| `get_tx_gain()` / `set_tx_gain()` | Get/set TX gain |

### Device Control

| Method | Description |
|--------|-------------|
| `set_clock_source(source)` | Sets internal or external clock |
| `supports_bias_tee()` / `set_bias_tee(enable)` | Manages bias-tee power |
| `pause_rx()` / `pause_tx()` / `stop()` | Stream control |
| `supports_dynamic_updates()` | Reports which parameters update during streaming |

---

## Exception Hierarchy

| Exception | Description |
|-----------|-------------|
| `SDRError` | Base exception for all SDR operations |
| `SDRParameterError` | Invalid sample rate, frequency, or gain values |
| `SdrDisconnectedError` | Device disconnection during operation |

---

## MockSDR

Simulates an SDR by generating additive white Gaussian noise (AWGN). Supports a configurable buffer size and optional seed for reproducibility — useful for testing without hardware.

---

## Device-Specific Implementations

### USRP

- Supports dynamic parameter updates during streaming
- Features absolute or relative gain modes
- Configurable receiver buffer size

### BladeRF

- 60 dB maximum gain
- 8192-byte default RX buffer; 32768-byte default TX buffer
- Sample rate and center frequency changes require stream restart

### Pluto (AD9361-based)

- 74 dB maximum RX gain
- Supports dynamic updates during streaming
- Maximum recording capacity: 16 million samples
- Transmitter supports both timed and continuous modes

---

## Utility Functions

### `get_sdr_device(device_type, ident=None, tx=False)`

Factory function that returns the appropriate `SDR` instance for the given device type.

### `detect_available()`

Returns a dictionary mapping available device names to driver classes, based on successful imports.
