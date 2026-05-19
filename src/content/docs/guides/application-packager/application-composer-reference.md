---
title: Application Composer reference
description: Block types, target profiles, validation rules, and generated artifacts for the RIA Hub Application Composer.
sidebar:
  order: 2
---

## Overview

This reference catalogs the pieces the [Application Composer](/guides/application-packager/application-composer/) puts together: the block categories it recognizes, the runtime targets it can package for, the validation rules a graph must pass, and the artifacts a successful build commits to your repository.

---

## Block types

Composer recognizes five block types. Every block in the **Available Blocks** sidebar belongs to one of these categories, and the validator uses the type to decide which checks apply.

### `source`

A pipeline must start with at least one source block. Sources have no input ports and produce data on one or more output ports. Examples include radio sources (Pluto, USRP, generic SDR/UHD/IIO) and file-replay sources.

For the Screens target, source blocks whose class name matches `Pluto|SDR|Radio|IIO|UHD|USRP` resolve to a remote-agent `dataSource` in the generated manifest; everything else resolves to a synthetic `dataSource`.

### `preprocessing`

Optional. Sits between sources and inference. Preprocessing blocks transform raw samples into the shape and feature representation the model expects. For Screens, the first preprocessing block's class name selects a registered feature extractor (for example `magnitude_phase_window_stats` or `iq_zmuv_channel_first`).

### `inference`

Runs an ONNX model. An inference block **must** have a non-empty `model_path_map` spec — either a plain path string like `models/best.onnx` or a JSON-encoded object mapping logical model names to paths. The validator rejects the build if this spec is missing, empty, or non-string.

For Screens packaging, every model path referenced by an inference block is resolved to its tarball-relative path (`models/<basename>`) and downloaded into the package automatically.

### `postprocessing`

Optional. Sits between inference and sinks. Postprocessing blocks transform model output into the form a sink expects — for example, mapping argmax indices back to class labels. Class labels collected here populate the Screens manifest's `config.inference.knownDevices` list.

### `sink`

A pipeline should end with at least one sink block. Sinks have no output ports and consume data on one or more input ports. Sinks whose class name matches `BasicNetworkOpTx|NetworkOpTx|Network.*Tx` route through a remote agent for live transmission.

---

## Target profiles

| Profile | Label in toolbar | Runtime |
|---|---|---|
| `ria-screens` | RIA Hub Screens (Web App) | The Screens runtime served from `/screens/<appid>` |
| `nvidia-x86` | NVIDIA Linux x86_64 (TensorRT) | Holoscan binary with TensorRT acceleration |
| `cpu-x86` | Generic Linux x86_64 (CPU only) | Holoscan binary, CPU-only build (toggles `cpuOnlyMode`) |
| `arm64` | ARM64 Linux (Jetson) | Holoscan binary for NVIDIA Jetson |
| `arm32` | Raspberry Pi 4 (ARM32) | Holoscan binary for Raspberry Pi 4 |

Selecting `cpu-x86` flips a `cpuOnlyMode` flag that is forwarded to the build pipeline and causes the generated artifact to skip GPU-only operators. The other four profiles all build for GPU runtimes.

The four Holoscan profiles (`nvidia-x86`, `cpu-x86`, `arm64`, `arm32`) produce native binaries, not Screens packages. They share Composer's canvas and validation but bypass the Screens manifest path described below. A dedicated Engine Builder guide will cover the Holoscan-specific build steps.

---

## Validation rules

`validatePipelineConfiguration` runs three layers of checks: per-node, pipeline-flow, and edge integrity. Errors block the build; warnings surface in the validation toast but do not stop it.

### Per-node checks

- **Structural integrity** — every node must be an object with a `data` property, a non-empty `name`, and a non-empty `type`. A malformed node skips the remaining per-node checks.
- **Inference model path** — inference blocks must declare a `model_path_map` spec with a non-empty string value. Missing spec, empty default, or non-string default each produce an error.
- **Spec completeness** — every spec on every node must have a non-empty `default` value, unless the spec is in the global optional set (`description`, `notes`, `headline`), in the type-specific optional set for inference blocks (`in_tensor_names`, `out_tensor_names`, `allocator`, and their trailing-underscore aliases), or explicitly declares `required: false`. `false` and `0` are valid values; only `null`, `undefined`, empty string, and empty array trigger the error.
- **Dependency syntax** — dependency lines that do not start with `#include`, `#define`, or `//` produce a warning, since the generator expects raw C++ preprocessor directives.
- **Spec/private-member collisions** — a spec parameter that is also declared in `private_members` produces an error, because the generated C++ would declare the same member twice.
- **Spec field shape** — non-built-in blocks must declare both a `parameter` and a `type` field on every spec; either missing produces an error so the generator does not emit `None`.

### Pipeline-flow checks

- **Empty pipeline** — a graph with zero nodes returns an error.
- **Missing source** — a graph with no `source` block produces a warning.
- **Missing sink** — a graph with no `sink` block produces a warning.

### Flow-integrity checks

For every edge:

- **Source node exists** — an edge whose `source` does not match a node ID produces an error.
- **Target node exists** — an edge whose `target` does not match a node ID produces an error.
- **Source handle exists** — an edge whose `sourceHandle` is not among the source node's output port names produces an error and lists the available ports.
- **Target handle exists** — an edge whose `targetHandle` is not among the target node's input port names produces an error and lists the available ports.

---

## The Screens build path

When the target profile is `ria-screens`, Composer runs a client-side packaging pass after validation succeeds and before commit. The pass produces a Screens manifest, downloads referenced models, builds a tarball, and uploads everything.

### Manifest generation

`generateScreensManifest` builds the manifest object from the canvas JSON. Key behaviors:

- App name is sanitized into a slug (lowercase alphanumerics and hyphens).
- One `ComposerOpPanel` is created per operator.
- The first inference block adds an `OnnxInferenceMonitor`.
- Each preprocessing block adds a `ProgressBar`.
- Each sink or postprocessor adds an `EventLog`.
- `dataSource` is derived from the first source operator — synthetic for non-radio sources, `agent` for any radio/SDR class.
- `preprocess` is derived from the first preprocessing operator's specs or class name.
- `config.inference.knownDevices` collects class labels declared by postprocessors.

### Model resolution

`resolveModelFiles` walks every inference operator, extracts each `model_path_map` value (plain string or JSON-encoded object of paths), and builds:

- A **manifest path** of `models/<basename>`
- A **raw download URL** of `/<owner>/<repo>/raw/branch/<branch>/<original-path>`

Composer downloads each model at build time and includes it under the `models/` prefix of the generated tarball.

### Packaging

`createTarGz` assembles a POSIX tar archive in memory (manifest, models, application JSON) and compresses it with `CompressionStream('gzip')` when available, falling back to `pako.gzip` or an uncompressed blob.

### Version handling

`bumpPatchVersion` increments the patch segment of the manifest version on every build — `1.0.0` becomes `1.0.1`. Invalid input falls back to `1.0.1`.

### Manifest location

The generated manifest is committed to `screens/<app-name>/manifest.json` in the source repository, matching the canonical path returned by the server-side `screensManifestFilePath` helper. The Screens runtime and Studio both read from this location.

The manifest schema lives at `schemas/screens/app_manifest.schema.json` in the product repository.

---

## Generated artifacts

A successful Screens build writes the following to the target build repository:

| Artifact | Path | Source |
|---|---|---|
| Application JSON | `<app-name>.json` | Serialized canvas (ops + flows) |
| Screens manifest | `screens/<app-name>/manifest.json` | `generateScreensManifest` output |
| Model files | `models/<basename>` (inside the tarball) | `resolveModelFiles` |
| Tarball | uploaded via `AppUpload` | `createTarGz` |

For Holoscan target profiles, only the application JSON is committed; no manifest, model bundle, or tarball is generated.

---

## Limitations and known issues

The Application Composer page carries an under-development banner: the surface is stable for the Screens target but is still evolving for the Holoscan profiles. Expect occasional changes to block specs, edge serialization, and the build form layout.
