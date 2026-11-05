// One safe parser shared by the browser and Apps Script, without evaluation.
import {parseRpgExpression} from '../assets/like-terms-rpg/math.mjs';
import {gradeElectricityAnswer} from '../assets/electricity-quest/physics.mjs';
process.stdout.write('var parseRpgTerms_ = '+parseRpgExpression.toString()+';\n');
process.stdout.write('var gradeElectricityAnswer_ = '+gradeElectricityAnswer.toString()+';\n');
