---
title: Training a Model
description: Configure a model template, select a runner, and submit a training workflow from the RIA Hub Model Builder.
sidebar:
  order: 1
---

## Overview

The Model Builder generates a training workflow from a form and commits it to your repository. When the push lands, Gitea Actions triggers the workflow on your chosen runner and executes training. Artifacts are uploaded to the Actions run for you to download when training completes.

**Use the Model Builder when you want to:**
- Train a modulation recognition, signal classification, or other RF ML model on a curated dataset
- Fine-tune a pre-trained wireless foundation model (WavesFM) on your own data
- Run hyperparameter optimisation with Optuna across multiple training trials

**What the workflow produces:**
- `best.pt` — the best PyTorch checkpoint by validation metric
- `best.onnx` — ONNX export of the best model (if ONNX export is enabled)
- `log.txt` — JSONL training log with per-epoch metrics
- Optionally: `confusion_matrix.png`, parameter sweep plots

## What you'll need

- A curated `radio_dataset` in your repository Library — see [Curating a Dataset](/guides/dataset-manager/curation/)
- At least one runner registered under **Workflows → Management → Runners**
- `RIAHUB_BASE_URL` set as a repository variable or secret — set it to `https://riahub.ai` (or your instance URL) under **Settings → Variables → Actions**

---

## Step 1 — Open Model Builder

Navigate to your repository, then click **Model Builder** in the left sidebar. Select **Model Trainer** from the top navigation.

---

## Step 2 — Select your dataset

In the **Dataset** section, click **Browse Library** and select your curated dataset. The builder reads the HDF5 attributes to detect the number of classes and the input shape.

The OID (object identifier) of the selected dataset is written into the generated workflow's download step so the runner can fetch it from MinIO.

---

## Step 3 — Choose a model template

Select a template from the model picker. The right choice depends on your hardware and the complexity of the problem:

| Template | Typical use |
|----------|------------|
| **MobileNetV3** | Good starting point — runs on a `cpu` runner, trains in 10–30 minutes on a small dataset |
| **ResNet18** | Slightly higher capacity than MobileNetV3; use when accuracy matters more than speed |
| **WavesFM Linear Probe** | Fast WavesFM adaptation — train only the classification head; GPU runner recommended |
| **WavesFM LoRA** | Deeper WavesFM fine-tuning with low-rank weight matrices; GPU runner required |

For the modulation recognition tutorial, **MobileNetV3** on a `cpu` runner is the right choice.

---

## Step 4 — Configure training parameters

Sensible defaults are pre-filled. Adjust only what you need:

| Parameter | Default | Notes |
|-----------|---------|-------|
| **Epochs** | 20 | Increase to 30–50 for small datasets |
| **Batch size** | 256 | Reduce if the runner runs out of memory |
| **Learning rate** | `0.001` | Adam/AdamW default |
| **Optimiser** | AdamW | SGD, Adam, AdamW, RMSprop available |
| **LR scheduler** | CosineAnnealingLR | Smooth decay; suits short runs |
| **Train / val split** | 80 / 20 | |
| **Evaluation metrics** | `accuracy`, `f1` | Add `precision`, `recall`, `auroc` as needed |
| **Export ONNX** | On | Recommended — required for edge deployment |
| **Upload confusion matrix** | Off | Enable to get a confusion matrix PNG in the artifacts |

### WavesFM-specific parameters

When a WavesFM template is selected, two additional fields appear:

| Parameter | Default | Notes |
|-----------|---------|-------|
| **Task** | `rml` | Must match a WavesFM-supported task name |
| **LoRA rank** | 32 | Lower values train faster; higher values adapt more |
| **LoRA alpha** | 64 | Scaling factor (`alpha / sqrt(rank)`); leave at `2 × rank` |

---

## Step 5 — Select a runner

Click **View Available Runners** to see registered runners. Select a runner whose label matches the compute you need.

| Runner label | Hardware | Appropriate for |
|-------------|----------|----------------|
| `cpu` | CPU-only | Tutorial runs, small datasets (< 100 k slices) |
| `gpu-t4` | NVIDIA T4 | Medium datasets, WavesFM LP |
| `gpu-a100` | NVIDIA A100 | Large datasets, WavesFM LoRA, HPO sweeps |

If no runner is online, the workflow will queue and wait. Check runner status at **Workflows → Management → Runners**.

---

## Step 6 — Submit

Click **Train**. The Model Builder:

1. Posts to the backend to render the workflow and training config YAML
2. Commits `.riahub/workflows/train.yaml` and `.riahub/train_configs/train.yaml` to a new branch in your repository
3. Redirects you to the repository's **Actions** tab

The workflow triggers automatically on the branch push.

---

## Step 7 — Monitor the run

The Actions run shows one job with these steps:

| Step | What it does |
|------|-------------|
| Runner info | Prints OS, CPU, and GPU info |
| Download dataset | Fetches the HDF5 file from MinIO using the dataset OID |
| Checkout configs | Sparse-checks out `.riahub/train_configs/` |
| QMB Training | Runs `qmb train --config-path .riahub/train_configs/train.yaml` |
| Collect training artifacts | Gathers `best.pt`, `*.onnx`, and optional PNG outputs |
| Upload training artifacts | Uploads a `training-artifacts` zip to Actions artifact storage |

Training logs appear in the **QMB Training** step in real time. Expect output like:

```
Epoch  1/20 — train_loss: 0.9842  val_loss: 0.9511  val_accuracy: 0.6421
Epoch  2/20 — train_loss: 0.7213  val_loss: 0.6901  val_accuracy: 0.7834
…
Epoch 20/20 — train_loss: 0.1021  val_loss: 0.0988  val_accuracy: 0.9876
Best val accuracy: 0.9901  (epoch 19)
```

---

## Step 8 — Download and publish artifacts

Training artifacts are stored in **GitHub Actions artifact storage**, not pushed back to the Library automatically.

When the run finishes:

1. On the Actions run page, click **training-artifacts** under Artifacts
2. Extract the zip — you will find `best.pt`, `best.onnx`, and optionally `confusion_matrix.png`

To register the model in your repository's Library, push it via Git LFS:

```bash
git lfs track "*.pt" "*.onnx"
git add .gitattributes

mkdir -p models/
cp /path/to/best.onnx models/modrec-tutorial-v1.onnx
cp /path/to/best.pt   models/modrec-tutorial-v1.pt

git add models/
git commit -m "add trained modrec model v1"
git push
```

RIA Hub picks up the new files on push and registers them in the Library:

- `modrec-tutorial-v1.pt` → `pytorch_checkpoint` asset
- `modrec-tutorial-v1.onnx` → `onnx_graph` asset

---

## Troubleshooting

### The workflow does not trigger after submit

The workflow file has an `on.push.branches` trigger for the branch the Model Builder targeted. If you push to a different branch, the workflow will not fire. Check that the branch name in `.riahub/workflows/train.yaml` matches the branch you are on.

### Dataset not found (download step fails)

The `RIAHUB_BASE_URL` variable must be set so the runner can build the MinIO download URL. Set it under **Settings → Variables → Actions** in your repository, value `https://riahub.ai` (or your instance URL).

### Out of memory

Reduce batch size in the Model Builder form and re-submit, or switch to a larger runner.

### Model accuracy is poor (< 60 % on modulation recognition)

Check these in order:

1. **Class balance** — use the [Inspector](/guides/dataset-manager/inspector/) Balance view; unequal class counts hurt accuracy
2. **Label consistency** — use the Sample view to confirm slices visually match their labels
3. **Epochs** — try 30–50 epochs; 20 may not converge on small datasets
4. **SNR** — if synthetic recordings use very high noise power, signals become indistinguishable; re-generate with lower `--noise-power`

---

## Next steps

- **Hyperparameter optimisation** — open **Model Builder → HPO** to run an Optuna sweep across learning rate, batch size, and architecture variants
- **Edge deployment** — take the `best.onnx` to the [Application Packager](/guides/application-packager/) to build a Holoscan inference application and deploy it to a registered Screens agent
