import os

target_dir = r'd:\New App\client\src'
old_str = 'localhost:5000'
new_str = '192.168.0.157:5000'

for root, dirs, files in os.walk(target_dir):
    for file in files:
        if file.endswith(('.js', '.jsx', '.html', '.css')):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if old_str in content:
                print(f"Updating {file_path}")
                new_content = content.replace(old_str, new_str)
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)

print("Done replacement.")
