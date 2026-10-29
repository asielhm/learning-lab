export const G=6.67430e-11,R=8.314462618,EARTH=5.9722e24,RE=6371000;
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function catchup(a=10,b=0,va=2,vb=5,delay=4){const candidates=[];if(va!==0){const early=(b-a)/va;if(early>=0&&early<=delay)candidates.push(early);}else if(a===b)candidates.push(0);const gap=a+va*delay-b,rel=vb-va;if(Math.abs(gap)<1e-10)candidates.push(delay);else if(Math.abs(rel)>1e-12){const late=(a-b+vb*delay)/rel;if(late>=delay)candidates.push(late);}if(!candidates.length)return null;const time=Math.min(...candidates);return {time,position:a+va*time};}
export function positions(v,t){return {a:v.a+v.va*t,b:v.b+v.vb*Math.max(0,t-v.delay)};}
export function forces(force=10,mass=2,mu=.2){const friction=mu*mass*10;return {friction,net:force-friction,acceleration:(force-friction)/mass};}
export function collision(m1=1,m2=1,u1=4,u2=0,e=1){const momentum=m1*u1+m2*u2,total=m1+m2,v1=(momentum-m2*e*(u1-u2))/total,v2=(momentum+m1*e*(u1-u2))/total,initial=.5*m1*u1*u1+.5*m2*u2*u2,final=.5*m1*v1*v1+.5*m2*v2*v2;return {v1,v2,momentum,initial,final,dissipated:initial-final};}
// Disk inertia = 1 kg m², two point masses = 1 kg each; start r = 1 m, omega = 2 rad/s.
export function rotation(radius=1){const inertia=1+2*radius*radius,L=6,omega=L/inertia;return {inertia,L,omega,energy:.5*inertia*omega*omega};}
export function orbit(radiusEarth=2){const radius=radiusEarth*RE,g=G*EARTH/radius**2,speed=Math.sqrt(G*EARTH/radius),period=2*Math.PI*radius/speed;return {radius,g,speed,period};}
export function buoyancy(density=600,liquid=1000,fraction=.6){const volume=.001,mass=density*volume,weight=mass*10,up=liquid*10*volume*fraction;return {weight,up,support:weight-up,floatFraction:density/liquid};}
export function mixing(m1=.1,m2=.3,t1=20,t2=60){const final=(m1*t1+m2*t2)/(m1+m2),q1=m1*4180*(final-t1),q2=m2*4180*(final-t2);return {final,q1,q2};}
export function gasWork(volume=2){const n=.1,T=300,pressure=n*R*T/volume,work=n*R*T*Math.log(volume/2);return {pressure,work,heat:work,deltaU:0};}
export function engine(hot=500,cold=300,heat=1000){const efficiency=1-cold/hot,work=heat*efficiency,rejected=heat-work;return {efficiency,work,rejected};}
export function circuit(voltage=6,resistance=20){const current=voltage/resistance;return {current,power:voltage*current,voltage};}
export function coulomb(q1=1,q2=1,distance=.3){const k=8.9875517923e9,field=k*q1*1e-6/distance**2,force=field*q2*1e-6;return {field,force,attracts:q1*q2<0};}
// Flux per turn is a smooth illustrative spatial profile, not an exact bar-magnet field.
export function induction(x=.4,speed=.2,turns=50){const a=.4,phi0=.002,flux=phi0*Math.exp(-((x/a)**2)),emf=2*turns*x/(a*a)*flux*speed;return {flux,emf};}
export function wave(frequency=2,speed=4,amplitude=.3){return {wavelength:speed/frequency,period:1/frequency,amplitude};}
export function lens(focal=10,object=30){const denominator=object-focal;if(Math.abs(denominator)<1e-10)return {image:Infinity,magnification:-Infinity,real:false,infinity:true};const image=focal*object/denominator;return {image,magnification:-image/object,real:image>0,infinity:false};}
export function photoelectric(frequency=1,workFunction=2,intensity=2){const photon=4.135667696*frequency,emits=photon>=workFunction;return {photon,kinetic:Math.max(0,photon-workFunction),threshold:workFunction/4.135667696,signal:emits?intensity:0,emits};}
export function decay(initial=1000,halfLife=5,time=10){const count=initial*2**(-time/halfLife),activity=Math.LN2/halfLife*count;return {count,activity,fraction:count/initial};}
export function measured(length=8.4,reading=5,resolution=.2){return {reading,uncertainty:resolution/2,valid:Math.abs(length-reading)<=resolution/2+1e-9,error:reading-length};}
