#!/usr/bin/env sh

#
# entrypoint.sh: Combine GPU detection + existing DeepSeek logic
#

###############################################################################
# 1. GPU DETECTION LOGIC
###############################################################################

detect_nvidia() {
    if command -v nvidia-smi >/dev/null 2>&1; then
        if nvidia-smi -L >/dev/null 2>&1; then
            echo "NVIDIA GPU detected."
            export NVIDIA_VISIBLE_DEVICES=all
            export NVIDIA_DRIVER_CAPABILITIES=compute,utility
            return 0
        fi
    fi
    return 1
}

detect_amd() {
    # Example: if rocm-smi is installed, or if /dev/dri shows AMD.
    if command -v rocm-smi >/dev/null 2>&1; then
        echo "AMD GPU (ROCm) detected."
        export ROC_ENABLE_PRE_VEGA=1
        return 0
    fi
    return 1
}

detect_intel() {
    # Simple approach: if /dev/dri is present & lspci shows Intel.
    if [ -d "/dev/dri" ] && lspci | grep -i 'VGA' | grep -i 'Intel' >/dev/null 2>&1; then
        echo "Intel GPU detected."
        export INTEL_GPU_DEVICE=/dev/dri
        return 0
    fi
    return 1
}

detect_apple() {
    # Docker on macOS typically runs inside a VM, so real GPU pass-through is limited.
    # But if your environment can detect Darwin (rare in Docker), set OLLAMA_USE_METAL=1
    if uname -a | grep -i 'Darwin' >/dev/null 2>&1; then
        echo "Apple environment (Darwin) detected. Attempting to enable Metal."
        export OLLAMA_USE_METAL=1
        return 0
    fi
    return 1
}

if detect_nvidia; then
    :
elif detect_amd; then
    :
elif detect_intel; then
    :
elif detect_apple; then
    :
else
    echo "No GPU detected or unrecognized GPU. Falling back to CPU-only."
    export USE_CPU_ONLY=1
fi

###############################################################################
# 2. OLLAMA + DEEPSEEK LOGIC
###############################################################################

# Start Ollama in the background
ollama serve &
echo "Starting Ollama..."

# Wait for Ollama to be available
echo "Waiting for Ollama to be ready..."
until ollama list > /dev/null 2>&1; do
    sleep 2
done
echo "Ollama is running."

# Check if the model is already installed
if ! ollama list | grep -q "deepseek-r1:14b"; then
    echo "Pulling DeepSeek model..."
    ollama pull deepseek-r1:14b
else
    echo "DeepSeek model already installed. Skipping pull."
fi

# Bring Ollama (the backgrounded process) to the foreground
wait %1
