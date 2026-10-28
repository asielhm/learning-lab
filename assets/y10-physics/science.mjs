// SI throughout. Ideal teaching models; assumptions are stated beside each investigation.
export const G=9.81, K=8.99e9;
export const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export const radians=degrees=>degrees*Math.PI/180;
export function circuit(v,r1,r2,kind='series',closed=true){
 const resistance=kind==='single'?r1:kind==='parallel'?r1*r2/(r1+r2):r1+r2;
 const current=closed?v/resistance:0;
 return {resistance,current,power:v*current,v1:kind==='series'?current*r1:v,v2:kind==='series'?current*r2:v,i1:closed?(kind==='parallel'?v/r1:current):0,i2:closed?(kind==='parallel'?v/r2:current):0};
}
export function coulomb(q1,q2,d){const signed=K*q1*1e-6*q2*1e-6/(d*d);return {force:Math.abs(signed),signed,type:signed<0?'Attraction':signed>0?'Repulsion':'No electric force',field:K*q1*1e-6/(d*d)};}
export function electricalSafety(fault,protection){
 const earth=fault==='earth',overload=fault==='overload',imbalance=earth?.08:0,current=overload?24:earth?8.08:8;
 const trip=protection==='rcd'?imbalance>.03:protection==='breaker'?current>16:false;
 return {trip,current:trip?0:current,prospective:current,imbalance:trip?0:imbalance,earth,overload};
}
export function energyUse(power,hours,tariff){const energy=power/1000*hours;return {energy,cost:energy*tariff,current:power/230};}
export function wave(frequency,wavelength){return {speed:frequency*wavelength,period:1/frequency};}
export function sound(f,speed,distance,sourceSpeed){return {wavelength:speed/f,echo:2*distance/speed,approach:f*speed/(speed-sourceSpeed),recede:f*speed/(speed+sourceSpeed)};}
export function refraction(n1,n2,incidence){const sine=n1*Math.sin(radians(incidence))/n2;return {tir:sine>1,angle:sine>1?null:Math.asin(clamp(sine,-1,1))*180/Math.PI,critical:n1>n2?Math.asin(n2/n1)*180/Math.PI:null};}
export function lens(f,u){const denominator=1/f-1/u;if(Math.abs(denominator)<1e-10)return {v:null,m:null,kind:'Parallel emerging rays',real:false};const v=1/denominator,m=-v/u;return {v,m,kind:v>0?'Real, inverted image':'Virtual, upright image',real:v>0};}
export function heatCapacity(m,c,delta){return {energy:m*c*delta};}
export function heating(m,power,t){const cIce=2100,cWater=4200,latent=334000,total=power*t,ice=m*cIce*20,melt=m*latent;
 if(total<ice)return {temperature:-20+total/(m*cIce),phase:'Ice warming',fraction:0,energy:total};
 if(total<ice+melt)return {temperature:0,phase:'Melting at 0°C',fraction:(total-ice)/melt,energy:total};
 return {temperature:(total-ice-melt)/(m*cWater),phase:'Liquid water warming',fraction:1,energy:total};
}
export function equilibrium(m1,t1,m2,t2,c=4200){const temperature=(m1*t1+m2*t2)/(m1+m2);return {temperature,transfer:m1*c*(t1-temperature)};}
export function motion(u,a,t,x0=0){const displacement=u*t+.5*a*t*t,turn=a===0?-1:-u/a;const distance=turn>0&&turn<t?Math.abs(u*turn+.5*a*turn*turn)+Math.abs(displacement-(u*turn+.5*a*turn*turn)):Math.abs(displacement);return {x:x0+displacement,v:u+a*t,a,distance};}
export function fall(height,g=G,elapsed=0){const duration=Math.sqrt(2*height/g),t=clamp(elapsed,0,duration);return {duration,t,y:height-.5*g*t*t,v:g*t};}
export function projectile(speed,angle,height=0,g=G,elapsed=0){const vx=speed*Math.cos(radians(angle)),vy=speed*Math.sin(radians(angle)),duration=(vy+Math.sqrt(vy*vy+2*g*height))/g,t=clamp(elapsed,0,duration);return {vx,vy,vyNow:vy-g*t,duration,t,x:vx*t,y:Math.max(0,height+vy*t-.5*g*t*t),range:vx*duration,maxHeight:height+vy*vy/(2*g)};}
export function stopping(speed,reaction,deceleration){return {thinking:speed*reaction,braking:speed*speed/(2*deceleration),total:speed*reaction+speed*speed/(2*deceleration),time:reaction+speed/deceleration};}
export function horizontal(m,force,mu=0){const limit=mu*m*G,moving=Math.abs(force)>limit,friction=moving?-Math.sign(force)*limit:-force,net=force+friction;return {weight:m*G,normal:m*G,friction,net,a:net/m,moving};}
export function incline(m,angle,mu){const parallel=m*G*Math.sin(radians(angle)),normal=m*G*Math.cos(radians(angle)),limit=mu*normal,moving=parallel>limit,friction=moving?limit:parallel,net=parallel-friction;return {parallel,normal,friction,net,a:net/m,moving};}
export function connected(m1,m2,mu){const drive=m2*G,friction=Math.min(mu*m1*G,drive),a=(drive-friction)/(m1+m2),tension=m2*(G-a);return {friction,a,tension,moving:a>0};}
// Constant velocities. B waits at its starting position until delay, then moves.
// Meeting here means a meeting at or after B's release, not passing a parked B earlier.
export function catchUp(xA,vA,xB,vB,delay){
 const gapAtRelease=xA+vA*delay-xB,relative=vB-vA;
 if(Math.abs(relative)<1e-10)return {time:null,position:null,gapAtRelease,coincident:Math.abs(gapAtRelease)<1e-10};
 const after=gapAtRelease/relative;
 if(after<0)return {time:null,position:null,gapAtRelease,coincident:false};
 const time=delay+after;return {time,position:xA+vA*time,gapAtRelease,coincident:false};
}
