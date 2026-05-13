---
title: Working with Git LFS
description: Understand how RIA Hub uses Git LFS to store large binary files, which file types to track, and how to upload files through the web interface or git.
sidebar:
  order: 2
---

## Overview

RIA Hub uses **Git Large File Storage (LFS)** to store all large binary assets — recordings, datasets, and model files. LFS keeps your git repository fast and lightweight by storing the actual file content in a separate object store, while committing only a small pointer file (a few hundred bytes) in the git history.

**Why this matters for you:**
- Cloning a RIA Hub repository is fast even when it contains gigabytes of recordings, because LFS content is fetched on demand rather than all at once
- Every version of every file is content-addressed by its SHA-256 hash, so you can always trace exactly which dataset or recording was used at any point in a project's history
- Files uploaded through RIA Hub's web interface are stored in LFS automatically — you don't need to configure anything for uploads through the UI

## What you'll need

- For **web uploads**: nothing extra — RIA Hub handles LFS storage automatically
- For **git-based workflows** (cloning, pushing from your local machine): Git LFS must be installed on your machine

Install Git LFS:

```bash
# macOS (Homebrew)
brew install git-lfs

# Ubuntu / Debian
sudo apt install git-lfs

# Windows
# Download from https://git-lfs.com

# After installation, enable it for your user account
git lfs install
```

---

## Which files should be tracked with LFS

Any large binary file that doesn't diff meaningfully as text should be tracked with LFS. In RIA Hub projects that includes:

| File type | Extension(s) | Typical size |
|-----------|-------------|-------------|
| SigMF signal data | `.sigmf-data` | MBs to GBs |
| SigMF metadata | `.sigmf-meta` | Small (JSON), but keep paired with `.sigmf-data` |
| NumPy arrays | `.npy` | MBs to GBs |
| HDF5 datasets | `.h5`, `.hdf5` | MBs to GBs |
| WAV recordings | `.wav` | MBs to GBs |
| Raw IQ / binary | `.iq`, `.bin`, `.dat` | MBs to GBs |
| ONNX models | `.onnx` | MBs to hundreds of MBs |
| PyTorch weights | `.pt`, `.pth`, `.ckpt` | MBs to hundreds of MBs |
| CSV data | `.csv` | Varies — use LFS for anything over a few MB |

:::note
`.sigmf-meta` files are small JSON text files that could technically live in regular git. However, keeping them LFS-tracked alongside their `.sigmf-data` partners simplifies tooling and ensures the pair is always treated consistently.
:::

To configure LFS tracking for a new repository, add the relevant patterns to `.gitattributes`:

```bash
git lfs track "*.sigmf-data"
git lfs track "*.sigmf-meta"
git lfs track "*.npy"
git lfs track "*.h5"
git lfs track "*.hdf5"
git lfs track "*.wav"
git lfs track "*.iq"
git lfs track "*.bin"
git lfs track "*.dat"
git lfs track "*.onnx"
git lfs track "*.pt"
git lfs track "*.pth"
git lfs track "*.ckpt"

# Commit the updated .gitattributes
git add .gitattributes
git commit -m "Track binary assets with LFS"
```

---

## Uploading files through the web interface

RIA Hub's upload interface handles LFS storage automatically. Files uploaded this way are committed as LFS pointers and indexed in the [Library](/guides/platform/library/) without any additional configuration.

### Supported file types

The upload interface accepts:

`.sigmf-data` · `.sigmf-meta` · `.wav` · `.iq` · `.bin` · `.dat` · `.npy` · `.h5` · `.hdf5` · `.csv`

### Size limits

| Method | Limit |
|--------|-------|
| Single-file upload | 500 MB |
| Chunked upload | Up to 500 MB total, sent in 100 MB chunks |

Files larger than 500 MB should be pushed using git on your local machine.

### Where to upload

Files can be uploaded through:

- **Conductor → Campaign Control** — recordings captured during a campaign are committed automatically at the end of each run
- **Repository file browser** — navigate to the target folder in your repository and use the upload button to add files manually

After upload, files are indexed in the Library within a few seconds. For SigMF pairs, both `.sigmf-data` and `.sigmf-meta` must be present for full metadata parsing — upload both files to the same repository path.

---

## Cloning a repository with LFS files

When you clone a repository that contains LFS-tracked files, git checks out the pointer files by default and then fetches the actual content for files in your working tree:

```bash
git clone https://riahub.ai/owner/repo-name
```

If Git LFS is installed, this happens transparently. To fetch all LFS content at once (instead of on demand):

```bash
git lfs fetch --all
git lfs checkout
```

To clone without downloading LFS content (useful when you only need the repo structure):

```bash
GIT_LFS_SKIP_SMUDGE=1 git clone https://riahub.ai/owner/repo-name
```

---

## Pushing large files from your local machine

To push new files from your local machine to a RIA Hub repository, ensure the file patterns are tracked in `.gitattributes` (see above), then push normally:

```bash
git add recordings/capture-001.sigmf-data
git add recordings/capture-001.sigmf-meta
git commit -m "Add capture session 001"
git push
```

Git LFS intercepts the push, uploads the binary content to RIA Hub's LFS store, and commits only the pointer files to the git history. After the push completes, the files are automatically indexed in the Library.
