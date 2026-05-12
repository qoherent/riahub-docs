---
title: Training Dashboard
description: Trigger and monitor zone fingerprinting model training workflows from the RIA Testbed Conductor Training Dashboard.
sidebar:
  order: 2
---

## Overview

The **Training Dashboard** lets you kick off and monitor model training runs directly from RIA Hub, without leaving the browser. Training is executed as a **GitHub Actions workflow** in a repository you control — the dashboard handles triggering the run, streaming back live job status, and surfacing model performance metrics once training completes.

The dashboard is designed around the zone fingerprinting workflow: you specify which device IDs to include as classes, trigger the workflow, and watch the run progress step by step. After a successful run, a model comparison table shows accuracy, F1 score, and inference time for each model variant produced.

**Use the Training Dashboard when you want to:**
- Train or retrain a fingerprinting model after collecting new recordings
- Monitor a long-running training job without switching to GitHub Actions
- Compare multiple model variants (e.g. one-vs-all SVM vs multi-class) from a single training run
- Keep a run history tied to your RIA Hub project

## What you'll need

- **ria-toolkit-oss** — Install the Conductor backend: `pip install ria-toolkit-oss`
- **Training repository** — A GitHub repository containing at least one workflow file. The dashboard **only discovers workflows placed in `.riahub/workflows/`** — standard `.github/workflows/` files are not shown. Each workflow must accept a `devices` input (list of device IDs as class labels).
- **GitHub access** — Your RIA Hub account must be linked to a GitHub account with access to the training repository.

---

## Step 1 — Open the Training Dashboard

Click **Conductor** in the top navigation, then select **Training Dashboard**.

---

## Step 2 — Select a training repository

Use the **Repository** combobox to find the GitHub repository containing your training workflow. You can type to search or select from the dropdown.

Once a repository is selected, the dashboard automatically fetches the list of workflow files found in `.riahub/workflows/`.

---

## Step 3 — Select a workflow

Choose the workflow file to run from the **Workflow** dropdown. If your repository only has one workflow, it is selected automatically.

:::caution
The dashboard only lists workflow files found in the `.riahub/workflows/` directory of your repository. Files in `.github/workflows/` or anywhere else are **not** visible here. If the dropdown is empty, check that your workflow file is committed to `.riahub/workflows/<name>.yml`.
:::

---

## Step 4 — Enter device IDs

In the **Devices** field, enter a comma-separated list of device IDs to include in training. For example:

```
iphone13_wifi_001, pixel7_wifi_002, galaxy_s22_wifi_003
```

These IDs become the class labels in the trained model. They must match the device IDs used in the recordings your training workflow pulls from.

---

## Step 5 — Trigger the run

Click **Trigger Training Run**. The dashboard commits a parameters file to the repository's default branch, which fires the GitHub Actions path filter and queues a new workflow run.

---

## Step 6 — Monitor progress

The dashboard splits into two columns once runs are available:

**Left — Recent Runs**

The 15 most recent workflow runs are listed with:
- Run name and status badge (Running, Success, Failure, Waiting)
- Who triggered it and when
- Duration or elapsed time

The most recent run is selected automatically. Click any row to view its job details.

**Right — Job Steps**

For the selected run, each job in the workflow is shown with:
- Status indicator (pulsing while running)
- Job name, status, and duration
- A **View in Actions ↗** link to open the full GitHub Actions log for that job

**Summary cards** at the top show at a glance: last trained date, runs in progress, total successes, and total failures.

The dashboard refreshes automatically every few seconds while a run is active.

---

## Step 7 — Review model metrics (after successful run)

Once a run completes successfully, a **Model Comparison** table appears showing metrics for each model variant produced by the workflow (accuracy, F1 score, inference time, and whether the model supports incremental updates).

Use these metrics to decide which model to load into the [Zone Fingerprinting Demo](/guides/conductor/zone-fingerprinting/).
