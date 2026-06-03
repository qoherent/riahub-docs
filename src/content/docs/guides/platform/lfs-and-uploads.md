---
title: Working with Git LFS
description: Understand how RIA Hub uses Git LFS to store large binary files, which file types to track, and how to upload files through the web interface or git.
sidebar:
  order: 2
---

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

### If you cloned without Git LFS installed

If Git LFS was not installed when you cloned, git will have checked out the raw pointer files instead of the actual content. You'll see small text files where recordings or model weights should be, typically starting with:

```
version https://git-lfs.github.com/spec/v1
oid sha256:...
```

To fix this without re-cloning:

```bash
# Install Git LFS (see above), then:
git lfs install
git lfs fetch --all
git lfs checkout
```

This fetches all LFS objects for the current branch and replaces the pointer files with the real content.

---

## RIA Hub Project type

When creating a new repository you will see a **RIA Hub Project** checkbox. Enabling it does two things:

1. Seeds the repository with a `.gitattributes` file pre-configured for common RIA file types (`.sigmf-data`, `.npy`, `.h5`, model weights, etc.) so LFS tracking is active from the very first push.
2. Enables LFS-aware features across the platform — the Library, the recording viewer, and the mismatch warning described below.

If you create a repository without this option and later decide you need it, you can enable it under **Settings → Danger Zone → Mark as RIA Hub Project**, or simply add a `.gitattributes` file manually (see above).

---

## Setting up a local repo with `ria setup-repo`

The `ria` CLI (part of the [ria-toolkit](https://github.com/qoherent/ria-toolkit-oss) package) provides a one-shot command to configure a local directory as a RIA Hub Project repo:

```bash
pip install ria-toolkit-oss   # if not already installed

# In an existing git repo directory:
ria setup-repo

# Or point at a specific path and set the remote in one step:
ria setup-repo --path /path/to/repo --remote https://riahub.ai/owner/repo-name
```

This command:
- Verifies Git LFS is installed (`git lfs install` is run if needed)
- Writes the standard RIA LFS tracking rules into `.gitattributes` (skipping any patterns already present)
- Optionally adds the RIA Hub remote URL as `origin`

Run `ria setup-repo --help` for the full list of options.

---

## LFS mismatch warning

If you push binary files without LFS tracking enabled, RIA Hub detects them and shows a warning banner the next time you open the repository in the browser:

> **These files were pushed without LFS tracking**

The banner lists the affected files and offers three actions:

| Action | What it does |
|--------|-------------|
| **Move existing files to LFS** | Creates a new commit on the current branch converting the listed files to LFS pointers. Nothing to run locally — RIA Hub handles it server-side. |
| **Add to .gitattributes** | Adds the file extensions to `.gitattributes` so future pushes are tracked. Existing history is unchanged. |
| **Dismiss / Don't ask again** | Clears the warning. "Don't ask again" also suppresses it for this repository in your browser. |

:::note
"Move existing files to LFS" only promotes the specific files listed — files already in older commits are not rewritten. To rewrite full history, use `git lfs migrate import` locally and force-push.
:::

You will also see a warning in your terminal during `git push` if files were pushed without LFS tracking:

```
remote: Warning: the following files were pushed without LFS tracking:
remote:   recordings/capture-001.sigmf-data
remote: These files will not be visible as RIA Hub assets.
remote: Open the repository and select "Move existing files to LFS" to promote them.
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

---

## Next steps

- **Browse your files** — Open the [Library](/guides/platform/library/) to confirm files are indexed and inspect recordings with the built-in spectrogram and constellation viewers.
- **Review and label** — [Reviewing and Labelling Recordings](/guides/recordings/review-and-label/) explains how to inspect quality and add SigMF annotations before curating.
- **Build a dataset** — When recordings are labelled, use the [Curator](/guides/dataset-manager/curation/) to slice and qualify them into an HDF5 training dataset.
