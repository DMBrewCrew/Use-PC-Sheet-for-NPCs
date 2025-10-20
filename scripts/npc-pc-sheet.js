// Register the existing PC Character sheet to work with NPCs
Hooks.once('init', () => {
  console.log("PF2e NPC as PC Sheet | Initializing...");
  
  // Get the existing PC character sheet class
  const CharacterSheet = CONFIG.Actor.sheetClasses.character["pf2e.CharacterSheetPF2e"].cls;
  
  // Register it for NPCs
  Actors.registerSheet("pf2e", CharacterSheet, {
    types: ["npc"],
    makeDefault: true,
    label: "Character Sheet (for NPCs)"
  });
  
  console.log("PF2e NPC as PC Sheet | NPCs can now use the PC character sheet");
});
