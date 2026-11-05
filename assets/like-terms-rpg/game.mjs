import{LEVELS,GAME,questById}from'./data.mjs?v=1';
import*as model from'./model.mjs?v=1';
import*as ui from'./ui.mjs?v=1';
import*as math from'./math.mjs?v=1';
import{createWorld}from'./world.mjs?v=1';
import{startAdventure}from'../pixel-adventure/engine.mjs?v=1';
startAdventure({LEVELS,GAME,questById,model,ui,math,createWorld});
