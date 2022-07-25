#!/usr/bin/env bash

if [[ "$OSTYPE" == "darwin"* ]]; then
    # dotnet not currently available for aarch64 M1 chips on nix
    nix-shell --option system x86_64-darwin
else
    nix-shell
fi
