import re

filepath = 'index.html'
with open(filepath, 'r') as f:
    content = f.read()

lines = content.split('\n')

# ============================================================
# PART 1: Add auto-save useEffect after the existing config 
# persistence useEffect (after the }, [config]); line)
# ============================================================

# Find the config persistence useEffect closing: }, [config]);
config_effect_end = None
for i, line in enumerate(lines):
    if '[config]' in line and '};' not in line:
        # This might be the dependency array line
        config_effect_end = i
    elif '[config]);' in line:
        config_effect_end = i

print(f"Found config useEffect end at line {config_effect_end + 1}: {lines[config_effect_end].strip()}")

# The auto-save code to insert
autosave_code = '''
    // ============================================================
    // AUTO-SAVE: Save all studio state to localStorage every 5 seconds
    // ============================================================
    const AUTO_SAVE_KEY = 'ow_studio_autosave';
    
    React.useEffect(() => {
      const intervalId = setInterval(() => {
        try {
          // Only save if there are blocks to save (user has started working)
          if (blocks.length === 0) return;
          
          const studioState = {
            blocks: blocks,
            blockSizes: blockSizes,
            buttonPositions: buttonPositions,
            buttonsLocked: buttonsLocked,
            overlayElements: overlayElements,
            savedAt: new Date().toISOString()
          };
          
          localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(studioState));
          console.log('[AutoSave] State saved at', new Date().toLocaleTimeString());
        } catch (e) {
          console.warn('[AutoSave] Failed to save state:', e);
        }
      }, 5000); // Save every 5 seconds
      
      return () => clearInterval(intervalId);
    }, [blocks, blockSizes, buttonPositions, buttonsLocked, overlayElements]);

    // RESTORE: Load saved studio state from localStorage on mount
    React.useEffect(() => {
      try {
        const saved = localStorage.getItem(AUTO_SAVE_KEY);
        if (saved) {
          const state = JSON.parse(saved);
          if (state && state.blocks && state.blocks.length > 0) {
            setBlocks(state.blocks);
            if (state.blockSizes) setBlockSizes(state.blockSizes);
            if (state.buttonPositions) setButtonPositions(state.buttonPositions);
            if (state.buttonsLocked !== undefined) setButtonsLocked(state.buttonsLocked);
            if (state.overlayElements) setOverlayElements(state.overlayElements);
            console.log('[AutoSave] Restored state from', state.savedAt);
            setMessage({ text: 'Previous session restored from auto-save!', type: 'success' });
          }
        }
      } catch (e) {
        console.warn('[AutoSave] Failed to restore state:', e);
      }
    }, []);'''

# Insert after the config useEffect end line
lines.insert(config_effect_end + 1, autosave_code)

print("PART 1 OK: Auto-save useEffect and restore useEffect added")

# ============================================================
# PART 2: Write the modified file
# ============================================================
new_content = '\n'.join(lines)
with open(filepath, 'w') as f:
    f.write(new_content)

# Verify
with open(filepath, 'r') as f:
    verify = f.read()

if 'AUTO_SAVE_KEY' in verify and 'ow_studio_autosave' in verify:
    print("PART 2 OK: File written and verified")
    print(f"File size: {len(content)} -> {len(verify)} bytes")
else:
    print("PART 2 FAILED: Auto-save code not found in file")

# Count occurrences
print(f"AUTO_SAVE_KEY occurrences: {verify.count('AUTO_SAVE_KEY')}")
print(f"setInterval occurrences: {verify.count('setInterval')}")
print(f"ow_studio_autosave occurrences: {verify.count('ow_studio_autosave')}")

print("\nAll patches applied successfully!")
