import{LEVELS,QUESTS}from'./data.mjs';
import{createAdventureModel}from'../pixel-adventure/model.mjs?v=1';
export const{SAVE_KEY,STATIONS,MENTOR,PORTAL,START,makeWorld,objectsFor,walkable,route,freshAdventure,restoreAdventure,levelComplete,totals,nextVariant,progressFor}=createAdventureModel(LEVELS,QUESTS,'learning-lab-runehaven-v1');
