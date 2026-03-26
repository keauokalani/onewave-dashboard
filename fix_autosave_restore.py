import re

filepath = 'index.html'
with open(filepath, 'r') as f:
    content = f.read()

# Find the exact line: "setBlocks(parsed);" in the connectGitHub function
# We need to replace just the block-setting logic to check auto-save first
# The pattern is:
#   if (parsed.length > 0) {
#     setBlocks(parsed);
#     setMessage(...loaded from repo...);

old_code = '''if (parsed.length > 0) {
            setBlocks(parsed);
            setMessage({ text: `Loaded ${parsed.length} blocks from repo`, type: 'success' });'''

new_code = '''if (parsed.length > 0) {
            // Check if auto-save data exists - use it instead of repo data
            const autoSaved = localStorage.getItem('ow_studio_autosave');
            let restoredFromAutoSave = false;
            if (autoSaved) {
              try {
                const savedState = JSON.parse(autoSaved);
                if (savedState && savedState.blocks && savedState.blocks.length > 0) {
                  setBlocks(savedState.blocks);
                  if (savedState.blockSizes) setBlockSizes(savedState.blockSizes);
                  if (savedState.buttonPositions) setButtonPositions(savedState.buttonPositions);
                  if (savedState.buttonsLocked !== undefined) setButtonsLocked(savedState.buttonsLocked);
                  if (savedState.overlayElements) setOverlayElements(savedState.overlayElements);
                  restoredFromAutoSave = true;
                  console.log('[AutoSave] Restored auto-saved state after connect');
                  setMessage({ text: 'Auto-saved session restored! Your local changes are preserved.', type: 'success' });
                }
              } catch (e) {
                console.warn('[AutoSave] Failed to parse auto-save on connect:', e);
              }
            }
            if (!restoredFromAutoSave) {
              setBlocks(parsed);
              setMessage({ text: `Loaded ${parsed.length} blocks from repo`, type: 'success' });
            }'''

if old_code in content:
    content = content.replace(old_code, new_code, 1)
    print("FIX OK: Auto-save restore integrated into connectGitHub")
else:
    # Try with slightly different whitespace
    print("WARN: Exact pattern not found, trying flexible match...")
    # Search line by line for the pattern
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if 'setBlocks(parsed);' in line and i > 260:  # In connectGitHub function
            print(f"  Found setBlocks(parsed) at line {i+1}: {line.strip()}")
            # Check if previous line has the if condition
            if 'parsed.length' in lines[i-1]:
                print(f"  Previous line {i}: {lines[i-1].strip()}")
            break

with open(filepath, 'w') as f:
    f.write(content)

# Verify
with open(filepath, 'r') as f:
    verify = f.read()

if 'restoredFromAutoSave' in verify:
    print("VERIFIED: Auto-save restore logic present in connectGitHub")
    print(f"  restoredFromAutoSave occurrences: {verify.count('restoredFromAutoSave')}")
else:
    print("WARNING: restoredFromAutoSave not found - fix may not have been applied")

print(f"File size: {len(verify)} bytes")
