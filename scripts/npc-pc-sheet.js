// Register the existing PC Character sheet to work with NPCs
Hooks.once('setup', () => {
  console.log("NPC as PC Sheet | Initializing...");
  
  try {
    // Access the Actor sheet configuration
    if (!CONFIG.Actor?.sheetClasses?.character) {
      console.error("NPC as PC Sheet | CONFIG.Actor.sheetClasses.character is not available");
      return;
    }
    
    const characterSheets = CONFIG.Actor.sheetClasses.character;
    console.log("NPC as PC Sheet | Available character sheets:", Object.keys(characterSheets));
    
    // Find the PF2e character sheet
    let CharacterSheet = null;
    let sheetKey = null;
    
    // Try to find any character sheet
    for (const [key, sheetData] of Object.entries(characterSheets)) {
      if (key.includes("Character") || key.includes("character")) {
        CharacterSheet = sheetData.cls;
        sheetKey = key;
        break;
      }
    }
    
    if (!CharacterSheet) {
      console.error("NPC as PC Sheet | Could not find any Character Sheet class");
      return;
    }
    
    console.log(`NPC as PC Sheet | Found character sheet: ${sheetKey}`);
    
    // Register it for NPCs
    Actors.registerSheet("pf2e", CharacterSheet, {
      types: ["npc"],
      makeDefault: true,
      label: "Character Sheet (for NPCs)"
    });
    
    console.log("NPC as PC Sheet | Successfully registered PC sheet for NPCs");
    
  } catch (error) {
    console.error("NPC as PC Sheet | Error during initialization:", error);
  }
});
