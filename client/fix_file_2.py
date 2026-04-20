
import os

filepath = r"d:\New App\client\src\pages\AdminPanel.jsx"
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# We want to remove lines 920 and 921 (1-based)
# Indices 919 and 920
print(f"919: {repr(lines[919])}")
print(f"920: {repr(lines[920])}")

if "</main>" in lines[920] and "</div>" in lines[919]:
    new_lines = lines[:919] + lines[921:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print("Success")
else:
    print("Mismatch")
