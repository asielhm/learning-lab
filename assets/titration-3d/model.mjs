import{titrationPH}from'../y10-chemistry/science.mjs';
export const samples={A:.08,B:.12,C:.16};
export const steps=['Fill the burette with standard NaOH','Transfer 25.0 mL diluted vinegar with the pipette','Add phenolphthalein to the flask','Place the flask below the burette tip','Titrate, swirl and approach a persistent faint pink'];
export function reading(sample,delivered){const pH=titrationPH(samples[sample],25,.1,delivered);return{pH,colour:pH<8.2?'colourless':pH<=10?'faint pink':'deep pink',concentration:.1*delivered/25,endpoint:pH>=8.2&&pH<=10};}
