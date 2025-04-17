#!/usr/bin/env bash
set -e

vendor=cpu
if command -v nvidia-smi >/dev/null 2>&1 && nvidia-smi -L >/dev/null 2>&1; then
    vendor=nvidia
elif command -v rocminfo >/dev/null 2>&1; then
    vendor=amd
elif ls /dev/dri/render* >/dev/null 2>&1; then
    vendor=intel
fi
echo "$vendor"
