// Register the existing PC Character sheet to work with NPCs
Hooks.once('ready', async () => {
  console.log("NPC as PC Sheet | Initializing...");
  
  try {
    // Log what's available
    console.log("NPC as PC Sheet | CONFIG.Actor.sheetClasses:", CONFIG.Actor.sheetClasses);
    
    // Try to get the character sheet directly from game.pf2e
    if (game.pf2e?.applications?.actor?.CharacterSheetPF2e) {
      const CharacterSheet = game.pf2e.applications.actor.CharacterSheetPF2e;
      console.log("NPC as PC Sheet | Found sheet via game.pf2e:", CharacterSheet);
      
      Actors.registerSheet("pf2e", CharacterSheet, {
        types: ["npc"],
        makeDefault: true,
        label: "Character Sheet (for NPCs)"
      });
      
      console.log("NPC as PC Sheet | Successfully registered!");
      return;
    }
    
    // Alternative: Try looking through all registered sheets
    const allSheets = Object.values(CONFIG.Actor.sheetClasses).flat();
    console.log("NPC as PC Sheet | All registered sheets:", allSheets);
    
    // Try the character type if it exists
    if (CONFIG.Actor.sheetClasses.character) {
      const charSheets = CONFIG.Actor.sheetClasses.character;
      console.log("NPC as PC Sheet | Character sheets:", Object.keys(charSheets));
      
      // Get the first character sheet
      const firstSheet = Object.values(charSheets)[0];
      if (firstSheet?.cls) {
        Actors.registerSheet("pf2e", firstSheet.cls, {
          types: ["npc"],
          makeDefault: true,
          label: "Character Sheet (for NPCs)"
        });
        console.log("NPC as PC Sheet | Registered character sheet for NPCs");
      }
    } else {
      console.log("NPC as PC Sheet | No character sheets found in CONFIG");
    }
    
  } catch (error) {
    console.error("NPC as PC Sheet | Error:", error);
  }
});
