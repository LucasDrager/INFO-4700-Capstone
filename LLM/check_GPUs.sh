#!/usr/bin/env bash
#
# check_gpus.sh: Checks the presence of various GPU drivers/devices
# and sets environment variables accordingly. If no GPU is found,
# falls back to CPU usage.

# Function to detect NVIDIA GPU
detect_nvidia() {
    if command -v nvidia-smi &> /dev/null; then
        if nvidia-smi -L &> /dev/null; then
            echo "NVIDIA GPU detected."
            # Example environment variables for NVIDIA
            export NVIDIA_VISIBLE_DEVICES=all
            export NVIDIA_DRIVER_CAPABILITIES=compute,utility
            return 0
        fi
    fi
    return 1
}

# Function to detect AMD GPU (ROCm or older AMD)
detect_amd() {
    # Quick check: is rocm-smi installed? 
    # Or, you might check for presence of '/dev/dri/card0' etc.
    if command -v rocm-smi &> /dev/null; then
        echo "AMD GPU (ROCm) detected."
        export ROC_ENABLE_PRE_VEGA=1
        return 0
    fi
    # You can implement additional checks for older AMD GPUs or other AMD detection steps here
    return 1
}

# Function to detect Intel GPU
detect_intel() {
    # A simple approach is to see if /dev/dri exists
    # and if lspci or vainfo returns Intel GPU info
    if [ -d "/dev/dri" ]; then
        if lspci | grep -i 'VGA' | grep -i 'Intel' &> /dev/null; then
            echo "Intel GPU detected."
            # Example environment variable for an Intel-based setup
            # (In many Intel GPU compute scenarios, you might rely on OpenCL or Level Zero.)
            export INTEL_GPU_DEVICE=/dev/dri
            return 0
        fi
    fi
    return 1
}

# Function to detect Apple environment
detect_apple() {
    # This is a naive check for macOS, or if the container is running on Apple Silicon.
    # In reality, Docker typically uses a Linux VM on macOS so GPU pass-through is tricky.
    # However, if your stack is specifically set to run via Apple Metal in your Mac environment:
    if uname -a | grep -i 'Darwin' &> /dev/null; then
        echo "Running on an Apple-based environment. Enabling Metal if possible."
        export OLLAMA_USE_METAL=1
        return 0
    fi
    return 1
}

# Try detection in some priority order. 
# If multiple GPU types appear, adapt accordingly or pick your “preferred” GPU type.
if detect_nvidia; then
    :
elif detect_amd; then
    :
elif detect_intel; then
    :
elif detect_apple; then
    :
else
    echo "No known GPU type detected. Falling back to CPU."
    # You might choose to unset or override GPU-related env vars here
    export USE_CPU_ONLY=1
fi

# Finally, exec the actual command passed to the script
exec "$@"
