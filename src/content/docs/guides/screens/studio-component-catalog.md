---
title: Studio component catalog
description: Reference list of every RIA Hub Screens component you can drop into a Studio tile, with its declared design-time props.
sidebar:
  order: 5
---

[Screens Studio](/guides/screens/studio/) reads its component palette from the catalog declared in `componentRegistry.js`. Components marked `studioComposable: false` (the App embeds at the bottom of this page) are full-app surfaces — they appear in the palette for visibility but cannot be dropped into a blank tile.

Every component below lists the props the inspector exposes at design time, drawn verbatim from each entry's `propSchema`. Required props must be filled before the runtime will render the tile.

---

## Pipeline

One tile per pipeline stage. Pipeline components bind to a named operator in the running pipeline and stream their state from that operator.

### RadioSourcePanel — Radio Source

SDR device panel that streams live IQ samples and source metrics from a named pipeline operator.

| Prop | Type | Required | Hint |
|---|---|---|---|
| `operatorName` | string | yes | Must match the operator key in the running pipeline manifest. |
| `operatorId` | string | no | — |
| `deviceType` | enum (`usrp`, `rtlsdr`, `hackrf`, `pluto`, `synth`) | no | — |
| `config` | json | no | RF device settings object (centerFreq, sampleRate, gain, …). Individual knobs are set in the pipeline operator; use this JSON field only for full overrides. |
| `description` | string | no | Read-only display field. |
| `showSpectrogram` | boolean | no | — |
| `sections` | json | no | `null` shows all. Pass an array subset of `["agent","description","config","ports","signal","metrics","spectrum"]` to limit visible sections. |
| `showMetrics` | json | no | Allowed values: `snr`, `noise_floor`, `rssi`, `obw`. |
| `agentPanelMode` | enum (`full`, `selector-only`, `status-only`) | no | — |

### PreprocessorPanel — Preprocessor

Displays the IQ preprocessing step — normalization, tensor shape, dtype — for a named pipeline operator.

| Prop | Type | Required | Hint |
|---|---|---|---|
| `operatorName` | string | yes | Must match the operator key in the running pipeline manifest. |
| `operatorId` | string | no | — |
| `inputShape` | json | no | Integer array, e.g. `[1, 2, 4096]`. |
| `outputShape` | json | no | Integer array. |
| `normalize` | boolean | no | — |
| `batchSize` | number | no | — |
| `sequenceLen` | number | no | — |
| `channels` | number | no | — |
| `outputDtype` | string | no | e.g. `"float32"`, `"float16"`. |
| `clipThreshold` | number | no | — |
| `windowType` | string | no | e.g. `"hann"`, `"hamming"`. Empty string means no windowing. |
| `description` | string | no | Read-only display field. |
| `showDenseMetrics` | boolean | no | — |
| `showTensorTransformation` | boolean | no | — |
| `showIoPorts` | boolean | no | — |

### SpectrogramPanel — Spectrogram

Waterfall spectrogram canvas that drip-drains FFT rows from a named pipeline operator.

| Prop | Type | Required | Hint |
|---|---|---|---|
| `operatorName` | string | yes | Must match the operator key in the running pipeline manifest. |
| `operatorId` | string | no | — |
| `operatorType` | enum (`spectrogram`, `dashboard`) | no | — |
| `fftSize` | number | no | — |
| `windowType` | string | no | e.g. `"hann"`, `"hamming"`, `"blackman"`, `"rectangular"`. |
| `minDb` | number | no | — |
| `maxDb` | number | no | — |
| `centerFreq` | number | no | Used to label the frequency axis; `null` derives it from the operator stream. |
| `sampleRate` | number | no | — |
| `colormap` | string | no | e.g. `"viridis"`, `"plasma"`, `"inferno"`, `"magma"`, `"turbo"`. |
| `waterfallRows` | number | no | Canvas height in rows; `null` uses the container height. |
| `description` | string | no | Read-only display field. |
| `sections` | json | no | `null` shows all. Pass an array subset of `["description","config","span","waterfall","ports","metrics"]`. |
| `showCanvasGrid` | boolean | no | — |
| `showFrequencyLabels` | boolean | no | — |
| `showDbScale` | boolean | no | — |
| `showFpsCounter` | boolean | no | — |
| `showLiveIndicator` | boolean | no | — |
| `denseMetrics` | json | no | Allowed values: `fft_res`, `row_rate`, `disp`, `window`, `colormap`. |

### OnnxInferenceMonitor — ONNX Inference Monitor

Pipeline tile that polls a named ONNX operator for session metadata, iteration timing, and output tensors.

| Prop | Type | Required | Hint |
|---|---|---|---|
| `operatorName` | string | yes | Operator key in the running pipeline; drives the SSE stream subscription for session metadata. |
| `operatorId` | string | no | — |
| `showSessionMetadata` | boolean | no | — |
| `showSessionDetails` | boolean | no | — |

### PostprocessorPanel — Postprocessor

Shows live classification predictions, label history, and postprocessor configuration for a named operator.

| Prop | Type | Required | Hint |
|---|---|---|---|
| `operatorName` | string | yes | Must match the operator key in the running pipeline manifest. |
| `operatorId` | string | no | — |
| `operatorType` | enum (`postprocessor`, `mapper`) | no | — |
| `labels` | json | no | Ordered list of class name strings matching the model output tensor. Supersedes `labelFile` when both are set. |
| `topK` | number | no | — |
| `threshold` | number | no | Predictions below this probability are dimmed (0.0–1.0). |
| `numClasses` | number | no | — |
| `labelFile` | string | no | Server-side path to a newline-separated label file. Prefer inline labels above. |
| `description` | string | no | Read-only display field. |
| `showHistory` | boolean | no | — |
| `sections` | json | no | `null` shows all. Pass an array subset of `["description","config","labels","predictions","history","ports"]`. |
| `denseMetrics` | json | no | Subset of `["label","confidence","entropy"]` to display in the inline metric row. Defaults to all three. |

### SinkPanel — Sink

Pipeline sink tile that shows TX / display / network output status and connection configuration.

| Prop | Type | Required | Hint |
|---|---|---|---|
| `operatorName` | string | yes | Must match the operator key in the running pipeline manifest. |
| `operatorId` | string | no | — |
| `sinkType` | enum (`display`, `network`, `transmit`) | no | — |
| `connectionConfig` | json | no | Sink-specific connection parameters (host, port, protocol, etc.). |
| `description` | string | no | Read-only display field. |
| `inputs` | json | no | Array of port descriptor objects; `null` shows all inferred ports. |
| `showDenseMetrics` | boolean | no | — |
| `showInputPorts` | boolean | no | — |
| `showConnectionConfig` | boolean | no | — |

---

## Monitoring

Status indicators, metric readouts, flow diagrams, and general-purpose panels that are not bound to a specific pipeline stage.

### StatusLight — Status Light

Colour-coded indicator dot that communicates a single system or pipeline state.

| Prop | Type | Required | Hint |
|---|---|---|---|
| `status` | enum (`success`, `error`, `idle`, `warning`) | yes | — |
| `label` | string | no | — |
| `size` | enum (`small`, `medium`, `large`) | no | — |

### ProgressBar — Progress Bar

Horizontal progress indicator with optional label, time estimate, and subtask breakdown.

| Prop | Type | Required | Hint |
|---|---|---|---|
| `label` | string | no | — |

### MetricDisplay — Metric Display

Grid, list, or inline metric card array that renders live key–value pairs with optional sparklines.

| Prop | Type | Required | Hint |
|---|---|---|---|
| `layout` | enum (`grid`, `list`, `inline`) | no | — |
| `showMetricHeader` | boolean | no | — |
| `showCharts` | boolean | no | — |

### KpiStrip — KPI Strip

Single-row strip of live KPI values: iteration, inference time, center frequency, and top prediction.

| Prop | Type | Required | Hint |
|---|---|---|---|
| `showIteration` | boolean | no | — |
| `showInference` | boolean | no | — |
| `showCenterFreq` | boolean | no | — |
| `showSampleRate` | boolean | no | — |
| `showSignal` | boolean | no | — |
| `showTopClass` | boolean | no | — |

### EventLog — Event Log

Scrollable log of timestamped pipeline events with configurable history depth and auto-scroll.

| Prop | Type | Required | Hint |
|---|---|---|---|
| `maxEvents` | number | no | Older entries are dropped when this limit is exceeded. |
| `autoScroll` | boolean | no | — |
| `showToolbar` | boolean | no | — |
| `showFilterToggles` | boolean | no | — |
| `showExportButtons` | boolean | no | — |
| `showTimestamp` | boolean | no | — |

### NetworkSinkMonitor — Network Sink Monitor

Monitors throughput, buffer fill, and error counters for a named network-output operator.

| Prop | Type | Required | Hint |
|---|---|---|---|
| `opId` | string | no | — |
| `operatorName` | string | yes | — |
| `blockName` | string | no | — |
| `className` | string | no | — |
| `details` | string | no | — |
| `showIterationCounter` | boolean | no | — |
| `showAdvisoryNote` | boolean | no | — |
| `showTensorTable` | boolean | no | — |

### PipelineFlowView — Pipeline Flow View

Read-only directed-graph diagram of pipeline operators and their connections.

| Prop | Type | Required | Hint |
|---|---|---|---|
| `showCountBadge` | boolean | no | — |
| `showFlowDiagram` | boolean | no | — |

### InferenceProgressPanel — Inference Progress Panel

WebSocket-based panel that streams live inference progress events from a ria-toolkit source block.

| Prop | Type | Required | Hint |
|---|---|---|---|
| `url` | string | no | `ws://` address of the ria-toolkit inference stream. Known architectural debt — this direct WS path will be replaced by agent routing in a future session. |
| `authToken` | string | no | Leave empty — token is injected at runtime by the Screens agent. |
| `autoConnect` | boolean | no | — |
| `streamConfig` | json | no | Optional source-block configuration object passed on WebSocket connect. |
| `sourceBlockName` | string | no | — |
| `showRiaHubBridge` | boolean | no | — |
| `showConnectionDetails` | boolean | no | — |
| `showActionButtons` | boolean | no | — |

### ComposerOpPanel — Composer Op Panel

Generic operator tile used in the Holoscan-composer view; shows type, class, and description for any pipeline block.

| Prop | Type | Required | Hint |
|---|---|---|---|
| `title` | string | no | — |
| `blockType` | string | no | Operator category label, e.g. `"source"`, `"processor"`, `"sink"`. |
| `className` | string | no | — |
| `description` | string | no | Read-only display field. |
| `details` | string | no | — |

---

## Inference

Components focused on surfacing inference outputs and model results.

### BackendInferenceOutput — Inference Output

Displays live class-probability bars, top-K labels, and rolling prediction history for a backend inference tensor.

| Prop | Type | Required | Hint |
|---|---|---|---|
| `labels` | json | no | Ordered list of class name strings matching the model output tensor. |
| `topK` | number | no | — |
| `tensorName` | string | no | Output tensor name to bind; empty string binds the first output. |
| `historyLen` | number | no | Number of past inference results kept for the sparkline. |
| `showDominantPrediction` | boolean | no | — |
| `showTopKBars` | boolean | no | — |
| `showHistoryStrip` | boolean | no | — |

---

## App embeds

Full-application embeds. These are browsable in the Studio palette for visibility but are not drag-droppable into a blank manifest tile (`studioComposable: false`).

### ZoneFingerprintingApp — Zone Fingerprinting App

Full-application embed of the zone-fingerprinting-demo RF positioning interface. **Not Studio-composable.**

| Prop | Type | Required | Hint |
|---|---|---|---|
| `appId` | string | no | Stable slug used to load app state; must match the installed app name. |
| `config` | json | no | App-level config object merged with defaults at mount. |

### ModelEnrollmentDashboard — Model Enrollment Dashboard

Full-application embed of the model-enrollment-dashboard RF model training and management interface. **Not Studio-composable.**

| Prop | Type | Required | Hint |
|---|---|---|---|
| `appId` | string | no | Stable slug used to load app state; must match the installed app name. |
| `config` | json | no | App-level config object merged with defaults at mount. |
