// One safe parser shared by the browser and Apps Script, without evaluation.
import {parseRpgExpression} from '../assets/like-terms-rpg/math.mjs';
process.stdout.write('var parseRpgTerms_ = '+parseRpgExpression.toString()+';\n');
