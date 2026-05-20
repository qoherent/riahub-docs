---
title: Inspecting Recordings
description: Use the RIA Hub recording inspector to visually assess signal quality and confirm recordings are suitable for curation.
sidebar:
  order: 2
---

Clicking any row in the Library's Recordings tab opens the **recording inspector** — a Quick View panel with six signal visualisation tabs. Use it to confirm signal presence, assess quality, and spot problems before committing recordings to a curation run.

## Opening the inspector

1. Click **Library** in the top navigation and select the **Recordings** tab.
2. Use the **Repository**, **Directory**, or **Branch** filters to narrow the list.
3. Click any row. The inspector panel opens on the right (or below on narrow screens).

## Visualisation tabs

### Spectrogram

A time-vs-frequency power map rendered from the IQ samples. This is the fastest single view for a quality assessment.

**What to look for:**
- Signal clearly visible as a distinct band above the noise floor
- Consistent power level across the capture duration — no unexpected dropouts or gaps
- Signal occupies the expected frequency range with no heavy spurs alongside it

**Signs of a problem:**
- Flat or near-flat image — signal may have been absent, receiver was off-frequency, or gain was set too low
- Bright saturation bands — gain was too high, ADC is clipping
- Unexpected narrowband lines that don't belong to the signal of interest

### Constellation

An IQ scatter plot — plots real vs imaginary parts of each sample. Useful for identifying modulation type and spotting phase or amplitude errors.

**What to look for by modulation:**

| Modulation | Expected shape |
|------------|---------------|
| BPSK | Two tight lobes on the real axis |
| QPSK / DQPSK | Four clusters near the corners |
| 8PSK | Eight clusters on a circle |
| QAM-16 | 4 × 4 grid of clusters |
| FSK | Ring or arc pattern depending on deviation |
| OOK | One cluster at origin, one on the real axis |

**Signs of a problem:**
- Blurred or widely spread clusters — low SNR or phase noise
- Rotated or offset clusters — carrier offset not corrected, or DC offset present
- Unexpected cluster count — wrong modulation label, or signal is a mix of types

### PSD (Power Spectral Density)

A single-frame frequency view showing power as a function of frequency. Useful for confirming occupied bandwidth and spotting out-of-band interference.

**What to look for:**
- Signal occupies the expected bandwidth with a clear spectral shape
- Noise floor is flat outside the signal band
- No unexpected spurs or secondary signals within the capture bandwidth

### Time Series

Raw I and Q amplitude plotted over time. Use this to check for clipping and to confirm the signal envelope behaves as expected.

**What to look for:**
- Amplitude stays within a consistent range — no flat tops (clipping) or sudden level changes
- Both I and Q traces are present and roughly equal in peak amplitude
- No long stretches of zero amplitude mid-capture (unless you expect silence)

**Signs of a problem:**
- Flat tops on peaks — gain was too high, samples are clipped and the waveform is distorted
- Near-zero amplitude throughout — gain was too low, signal not captured

### FFT / Frequency Spectrum

A single-frame discrete FFT view — similar to the PSD but showing raw magnitude rather than estimated power density. Useful for a quick frequency-domain check on a specific moment in the recording.

### 3D Spectrogram

A depth-enhanced version of the spectrogram that adds a third axis for power magnitude. Useful for visualising signal dynamics and comparing power levels across time and frequency together.

---

## Quick quality checklist

Before including a recording in a curation run:

| Check | Pass | Fail |
|-------|------|------|
| Spectrogram | Signal band clearly visible | Flat, near-zero throughout |
| Constellation | Clusters match expected modulation shape | Blurred to a blob, or missing entirely |
| PSD | Signal in expected band, flat noise floor elsewhere | Spurs, unexpected signals, or flat line |
| Time Series | No clipping, consistent envelope | Flat-topped peaks (clipping) |

---

## Next steps

- **Label recordings** — Once quality is confirmed, add or verify signal labels in [Reviewing and Labelling Recordings](/guides/recordings/review-and-label/).
- **Curate a dataset** — Take reviewed recordings to the [Curator](/guides/dataset-manager/curation/) to slice and package them.
