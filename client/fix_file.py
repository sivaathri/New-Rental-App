
import os

filepath = r"d:\New App\client\src\pages\AdminPanel.jsx"
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# We want to remove lines 386 to 397 (1-based)
# In 0-based indexing, that's lines[385:397]
# Actually, let's verify line content first to be safe
print(f"Line 385: {lines[384].strip()}") # )}
print(f"Line 387: {lines[386].strip()}") # {approvedVehicles.length === 0 && (

# If content matches, delete
if ")} " in lines[384] or ")}" in lines[384] and "{approvedVehicles.length ===" in lines[386]:
    new_lines = lines[:385] + lines[397:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print("Success")
else:
    print("Content mismatch, check indices")
    print(f"384: {repr(lines[384])}")
    print(f"385: {repr(lines[385])}")
    print(f"386: {repr(lines[386])}")
    print(f"396: {repr(lines[396])}")
