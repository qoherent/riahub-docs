---
title: Model Builder
description: Overview of the RIA Hub Model Builder — tools for configuring, launching, and monitoring model training workflows.
sidebar:
  order: 0
---

The **Model Builder** is RIA Hub's training interface. It generates GitHub Actions workflow files from a UI form, commits them to your repository, and lets you monitor the run from the browser. The runner executes the workflow and uploads training artifacts back to the repository.

| Module | What it does |
|--------|-------------|
| [Training a Model](/guides/model-builder/train-a-model/) | Configure a model template and training parameters, select a runner, and submit a training workflow |

## Supported model templates

| Template | Architecture | Input | Best for |
|----------|-------------|-------|---------|
| MobileNetV3 | MobileNet (timm) | IQ slices or spectrograms | Lightweight classifiers, CPU runners |
| MobileNetV4 | MobileNet (timm) | IQ slices or spectrograms | More accurate than V3 with similar footprint |
| ResNet18 | ResNet (torchvision) | IQ slices or spectrograms | Standard baseline |
| ResNet50 | ResNet (torchvision) | IQ slices or spectrograms | Higher capacity baseline |
| GPT-2 | Transformer (HuggingFace) | Token sequences | Sequence classification tasks |
| DistilBERT | Transformer (HuggingFace) | Token sequences | Faster GPT-2 alternative |
| WavesFM Linear Probe | WavesFM (ViT-Small) | IQ or spectrogram | Fast adaptation — freezes encoder, trains head only |
| WavesFM LoRA | WavesFM (ViT-Small) | IQ or spectrogram | Deeper fine-tuning with low-rank weight updates |

## Prerequisites

- A curated `radio_dataset` asset in your repository Library — see [Curating a Dataset](/guides/dataset-manager/curation/)
- At least one runner registered and online — check **Workflows → Management → Runners** in your repository
- `RIAHUB_BASE_URL` set as a repository variable or secret (value: `https://riahub.ai` or your instance URL)

## How it works

1. You fill in the Model Builder form: dataset, model template, hyperparameters, and runner
2. RIA Hub generates `.riahub/workflows/train.yaml` and `.riahub/train_configs/train.yaml` and commits them to a branch in your repository
3. The push triggers the Gitea Actions workflow on the selected runner
4. The runner downloads the dataset, runs `qmb train`, and uploads training artifacts to the Actions run
5. You download artifacts from the Actions UI and push the model back to your repository to register it in the Library
