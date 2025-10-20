// NPC as PC Sheet - Wrapper class that makes NPCs compatible with the PC Character sheet
Hooks.once('setup', () => {
  console.log("NPC as PC Sheet | Initializing...");
  
  try {
    // Wait for PF2e to be ready
    if (!game.pf2e?.applications?.actor?.CharacterSheetPF2e) {
      console.error("NPC as PC Sheet | CharacterSheetPF2e not found");
      return;
    }
    
    const CharacterSheetPF2e = game.pf2e.applications.actor.CharacterSheetPF2e;
    console.log("NPC as PC Sheet | Found CharacterSheetPF2e");
    
    // Create wrapper class that converts NPC data to Character sheet format
    class NPCasCharacterSheet extends CharacterSheetPF2e {
      
      static get defaultOptions() {
        const options = super.defaultOptions;
        options.classes.push('npc-as-character');
        return options;
      }
      
      async getData(options = {}) {
        const context = await super.getData(options);
        
        // Ensure NPC data is compatible with character sheet expectations
        // Initialize missing properties that the character sheet expects
        if (!context.actor.system.details) {
          context.actor.system.details = {};
        }
        
        // Ensure character-specific properties exist
        const details = context.actor.system.details;
        if (!details.biography) details.biography = { value: "" };
        if (!details.class) details.class = { name: "NPC" };
        if (!details.background) details.background = { name: "" };
        if (!details.keyability) details.keyability = { value: "" };
        if (!details.heritage) details.heritage = { name: "" };
        if (!details.ancestry) details.ancestry = { name: details.ancestry || "" };
        if (!details.deity) details.deity = { name: "" };
        
        // Ensure resources exist
        if (!context.actor.system.resources) {
          context.actor.system.resources = {};
        }
        
        // Ensure traits exist
        if (!context.actor.system.traits) {
          context.actor.system.traits = { value: [] };
        }
        
        return context;
      }
      
      // Override _prepareItems to handle NPC items
      _prepareItems(context) {
        try {
          return super._prepareItems(context);
        } catch (error) {
          console.warn("NPC as PC Sheet | Error in _prepareItems, using fallback", error);
          // Provide minimal item structure if parent fails
          context.inventory = [];
          context.spellcastingEntries = [];
          context.actions = [];
          return context;
        }
      }
      
      // Override to prevent errors on character-specific operations
      async _onDropItemCreate(itemData) {
        try {
          return await super._onDropItemCreate(itemData);
        } catch (error) {
          console.warn("NPC as PC Sheet | Error in _onDropItemCreate", error);
          return [];
        }
      }
    }
    
    // Register the wrapper sheet for NPCs
    Actors.registerSheet("pf2e", NPCasCharacterSheet, {
      types: ["npc"],
      makeDefault: true,
      label: "Character Sheet (for NPCs)"
    });
    
    console.log("NPC as PC Sheet | Successfully registered wrapper sheet");
    
  } catch (error) {
    console.error("NPC as PC Sheet | Error during initialization:", error);
  }
});

// Fallback: Try again at 'ready' if setup didn't work
Hooks.once('ready', () => {
  // Check if already registered
  if (CONFIG.Actor.sheetClasses.npc?.['pf2e.NPCasCharacterSheet']) {
    console.log("NPC as PC Sheet | Already registered");
    return;
  }
  
  console.log("NPC as PC Sheet | Attempting registration at ready hook...");
  
  try {
    if (!game.pf2e?.applications?.actor?.CharacterSheetPF2e) {
      console.error("NPC as PC Sheet | CharacterSheetPF2e still not found");
      return;
    }
    
    const CharacterSheetPF2e = game.pf2e.applications.actor.CharacterSheetPF2e;
    
    class NPCasCharacterSheet extends CharacterSheetPF2e {
      static get defaultOptions() {
        const options = super.defaultOptions;
        options.classes.push('npc-as-character');
        return options;
      }
      
      async getData(options = {}) {
        const context = await super.getData(options);
        
        // Initialize missing character-specific properties
        const system = context.actor.system;
        if (!system.details) system.details = {};
        
        const details = system.details;
        details.biography = details.biography || { value: "" };
        details.class = details.class || { name: "NPC" };
        details.background = details.background || { name: "" };
        details.keyability = details.keyability || { value: "" };
        details.heritage = details.heritage || { name: "" };
        details.ancestry = { name: details.ancestry || "" };
        details.deity = details.deity || { name: "" };
        
        system.resources = system.resources || {};
        system.traits = system.traits || { value: [] };
        
        return context;
      }
      
      _prepareItems(context) {
        try {
          return super._prepareItems(context);
        } catch (error) {
          console.warn("NPC as PC Sheet | Error in _prepareItems", error);
          context.inventory = [];
          context.spellcastingEntries = [];
          context.actions = [];
          return context;
        }
      }
    }
    
    Actors.registerSheet("pf2e", NPCasCharacterSheet, {
      types: ["npc"],
      makeDefault: true,
      label: "Character Sheet (for NPCs)"
    });
    
    console.log("NPC as PC Sheet | Successfully registered at ready hook");
    
  } catch (error) {
    console.error("NPC as PC Sheet | Error at ready hook:", error);
  }
});
