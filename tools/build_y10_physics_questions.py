"""Rebuild six 60-question Physics banks. All calculations use stated SI assumptions."""
import json,math
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
banks={}
def begin(slug,title,categories):
 global bank
 bank=dict(topicId='y10-physics-'+slug,title=title,categories=categories,questions=[]);banks[slug]=bank
def q(cat,prompt,correct,wrong,why,level='Application'):
 options=[str(correct)]+[str(s) for s in wrong];assert len(options)==4 and len(set(s.casefold() for s in options))==4,(prompt,options)
 pos=len(bank['questions'])%4;options.insert(pos,options.pop(0))
 bank['questions'].append(dict(id=bank['topicId']+'-'+f'{len(bank["questions"])+1:03}',category=bank['categories'][cat],difficulty=level,prompt=prompt,options=options,answer=pos,explanation=why))
def rows(cat,data):
 for row in data.strip().splitlines():
  a=[x.strip() for x in row.split('|')];assert len(a)==7,a
  level,prompt,answer,w1,w2,w3,why=a;q(cat,prompt,answer,[w1,w2,w3],why,{'F':'Foundation','A':'Application','C':'Challenge'}[level])
def n(cat,prompt,value,unit,why,level='Application',wrong=()):
 fmt=lambda x:f'{x:.3g}'+(' '+unit if unit else '')
 answer=fmt(value);candidates=list(wrong)+[value*2,value/2,value*10,value/10,value+1,value-1,value+2,value+3];options=[]
 for x in candidates:
  option=fmt(x)
  if option!=answer and option not in options:options.append(option)
 q(cat,prompt+' Give the closest value.',answer,options[:3],why+' Result: '+answer+'.',level)

begin('electricity','Electricity and electrostatics',['Current and charge','Voltage and resistance','Circuits and power','Coulomb’s law','Electrical safety','Energy consumption'])
rows(0,'''
F | What is electric current? | Charge passing a point per unit time | Energy per coulomb | Resistance per metre | Force per unit mass | I = Q/t; one ampere is one coulomb per second.
F | Which unit measures electric charge? | Coulomb | Ampere | Volt | Watt | Charge Q is measured in coulombs, C.
F | In a metal wire, which particles drift to carry charge? | Electrons | Protons moving between atoms | Neutrons | Whole neutral molecules only | Mobile electrons carry charge through a metal.
A | Compared with conventional current, electron drift in a metal is… | In the opposite direction | Always in the same direction | Always perpendicular | Absent in all closed circuits | Conventional current is defined in the direction of positive charge motion.
C | A lamp has a steady current entering and leaving it. What is used up? | Electrical energy is transferred; charge is conserved. | All the entering charge | All the electrons’ mass | Current disappears inside the lamp. | Charge is not consumed; the lamp transfers electrical energy to other stores and pathways.
''')
for i,(current,time) in enumerate([(0.2,30),(.5,60),(1.5,20),(2,45),(3,120)]):n(0,f'A steady current of {current} A flows for {time} s. How much charge passes?',current*time,'C',f'Q = It = {current} × {time}.','Foundation' if i<2 else 'Application')
rows(1,'''
F | Potential difference is energy transferred per… | Coulomb of charge | Second of time only | Metre of wire | Kilogram of mass | V = E/Q, with J/C equivalent to volts.
F | Which relationship applies to an ohmic resistor at constant temperature? | V = IR | V = I/R | R = VI | I = VR | Potential difference is proportional to current for an ohmic resistor at fixed temperature.
F | Which unit measures resistance? | Ohm | Watt | Coulomb | Joule | Resistance is measured in ohms, Ω.
A | The voltage across a fixed ohmic resistor doubles. Its current… | Doubles | Halves | Quadruples | Stays unchanged | I = V/R and R is unchanged.
C | Why specify constant temperature when investigating an ohmic metal resistor? | Temperature changes can change its resistance. | Temperature measures charge. | Voltage is always zero when hot. | Ohm’s law requires a vacuum. | Heating a metal usually increases its resistance, changing the current–voltage relationship.
''')
for voltage,resistance in [(6,12),(12,8),(9,3),(4,20),(10,25)]:n(1,f'An ohmic {resistance} Ω resistor is connected across {voltage} V. Find the current.',voltage/resistance,'A',f'I = V/R = {voltage}/{resistance}.')
rows(2,'''
F | Components connected in series have the same… | Current | Voltage in every case | Resistance in every case | Power in every case | There is one conducting path, so the same current passes through each series component.
F | Parallel branches share the same… | Potential difference | Branch current in every case | Resistance in every case | Charge used up | Each branch is connected between the same two circuit nodes.
A | Adding an identical resistor in parallel makes the total resistance… | Smaller | Larger | Infinite | Negative | Another branch adds a conducting path; two equal parallel resistors have half the resistance of one.
A | Which expression gives electrical power? | P = VI | P = V/I | P = I/V | P = V + I | Voltage is energy per charge and current is charge per time, so VI is energy per time.
C | Two unequal resistors are in parallel across an ideal battery. The smaller resistor carries… | More current | Less current | Equal current in every case | No current | Both see the same V, so I = V/R is larger for the smaller resistance.
''')
for voltage,current in [(6,.4),(12,2),(9,.5),(230,8),(5,.2)]:n(2,f'A device operates at {voltage} V and {current} A. What is its power?',voltage*current,'W',f'P = VI = {voltage} × {current}.')
rows(3,'''
F | Two positive point charges exert forces that are… | Repulsive | Attractive | Always zero | Gravitational only | Like-sign charges repel; unlike-sign charges attract.
F | Coulomb’s law uses which separation? | Centre-to-centre distance in metres | Surface gap in centimetres only | Distance in seconds | Object diameter regardless of position | The point-charge formula uses the separation of the charge locations in SI units.
A | Doubling the separation of unchanged point charges makes the force… | One quarter as large | Twice as large | Four times as large | Unchanged | F is proportional to 1/r².
A | Reversing the sign of one charge, keeping magnitudes and separation fixed, changes… | Force direction but not magnitude | Magnitude only | Both magnitudes to zero | Neither direction nor magnitude | The product of signs determines attraction or repulsion; absolute magnitudes determine force size.
C | Electric field arrows around a positive point charge point… | Away from the charge | Towards the charge | In circles about it | Nowhere because positive charges have no field | Field direction is the force direction on a small positive test charge; this is an extension idea.
''')
for q1,q2,d in [(1,2,.5),(2,3,.3),(4,1,.2),(3,5,.6),(2,2,1)]:n(3,f'Two point charges have magnitudes {q1} μC and {q2} μC, separated by {d} m in vacuum. Use k = 8.99 × 10⁹. Find the force magnitude.',8.99e9*q1*1e-6*q2*1e-6/d**2,'N','Convert μC to C, then F = k|q₁q₂|/r².','Challenge')
rows(4,'''
F | A fuse or overcurrent breaker primarily protects wiring against… | Excessive current | Any low voltage | Every possible electric shock | Any use of energy | Excessive current can overheat wiring; overcurrent protection disconnects it.
F | An RCD compares… | Outgoing live and returning neutral currents | Appliance mass and voltage | Wire length and temperature only | Current and elapsed time in every case | A sufficient imbalance indicates current returning by another path.
A | What is the role of protective earthing on a suitable metal-cased appliance? | Provide a protective path if the case becomes live | Increase the appliance power | Replace all insulation | Carry the normal operating current in every circuit | Earthing works with suitable protection to reduce danger after a fault.
A | A balanced overload can fail to trip a plain RCD because… | Live and neutral currents can still be equal | Overloads have zero current | RCDs detect only heat in every wire | RCDs always replace breakers | A plain RCD detects imbalance; separate overcurrent protection is needed.
C | Before a real mains socket is changed, the appropriate approach is… | Qualified work with supply isolated and verified safe | Hold only the neutral wire | Rely on a wall switch alone | Use the virtual model as authorisation to work live | The simulation teaches principles, not live-mains working procedures.
''')
for live,neutral in [(8.08,8),(5.02,5),(3.05,3),(2.01,2),(10.04,10)]:
 imbalance=abs(live-neutral)*1000;q(4,f'A simplified 30 mA RCD test has live current {live} A and neutral current {neutral} A. What is predicted?', 'Trip: imbalance exceeds 30 mA.' if imbalance>30 else 'No trip from this imbalance alone.', ['No trip from this imbalance alone.' if imbalance>30 else 'Trip: imbalance exceeds 30 mA.','The currents must add before comparison.','The RCD must also detect every balanced overload.'],f'Compare |I_live − I_neutral| = {imbalance:.0f} mA with 30 mA. Real devices also have trip-time specifications.')
rows(5,'''
F | Which is a unit of electrical energy used on bills? | kWh | kW | Ampere | Volt per second | kWh is power multiplied by time; it measures energy.
F | A tariff of 0.30 currency units/kWh gives the cost by multiplying the tariff by… | Energy in kWh | Power in W only | Resistance in Ω | Current in A only | Cost = energy × tariff, before any extra charges.
A | Halving use time at fixed power makes energy consumption… | Half as large | Twice as large | Unchanged | Four times as large | E = Pt, so energy is directly proportional to time at fixed power.
A | Raising the electricity tariff while using the same appliance for the same time changes… | Cost but not electrical energy use | Energy but not cost | Both power and voltage automatically | Neither energy nor cost | Tariff is a price per energy unit, not a physical operating condition.
C | Why is a 2 kW appliance not necessarily more costly per day than a 1 kW appliance? | Total use time also matters | kW measures resistance | All devices use equal energy daily | Tariffs depend only on device colour | Compare Pt for the full daily use, not power alone.
''')
for power,hours in [(2000,3),(100,5),(1500,2),(750,4),(3000,.5)]:n(5,f'A {power} W appliance runs at constant power for {hours} h. Find its energy consumption.',power/1000*hours,'kWh',f'Convert watts to kilowatts, then E = {power/1000} × {hours}.')

begin('waves','Waves and sound',['Wave properties','Longitudinal and transverse','Sound and echoes','Doppler effect','Electromagnetic spectrum','Wave behaviour'])
rows(0,'''
F | Frequency is the number of oscillations per… | Second | Metre | Kilogram | Coulomb | Frequency is measured in hertz: oscillations per second.
F | Wavelength is the distance between… | Adjacent points in phase, such as consecutive crests | A crest and the next trough only | Any two particles | The source and the end of the medium | Wavelength is one complete spatial cycle.
F | Which equation links wave speed, frequency and wavelength? | v = fλ | v = f/λ | f = vλ | λ = vf | A wave travels one wavelength per oscillation period.
A | At fixed wave speed, increasing frequency makes wavelength… | Smaller | Larger | Unchanged in all cases | Negative | λ = v/f, so f and λ are inversely related at fixed speed.
C | Doubling the amplitude of an ideal linear wave necessarily doubles its… | Maximum particle displacement | Frequency | Wavelength | Speed | Amplitude is the maximum displacement from equilibrium; linear-wave speed is not set by amplitude.
''')
for f,w in [(2,3),(5,2),(4,.5),(10,.4),(1.5,4)]:n(0,f'A wave has frequency {f} Hz and wavelength {w} m. Find its speed.',f*w,'m/s',f'v = fλ = {f} × {w}.')
rows(1,'''
F | In a transverse wave, particles oscillate… | Perpendicular to wave travel | Parallel to wave travel | Only forwards with the crest | Without any displacement | Transverse means at right angles to the propagation direction.
F | In a longitudinal wave, particles oscillate… | Parallel to wave travel | Always vertically | Only perpendicular to travel | Without any interaction | Compressions and rarefactions travel through the medium.
F | Sound in air is normally… | Longitudinal | Transverse only | An electromagnetic wave | A wave that needs no medium | Air pressure and particle motion vary along the propagation direction.
A | A marked particle in a travelling wave typically… | Oscillates around its equilibrium position | Travels permanently to the far end | Is used up | Carries the whole medium forwards | Energy propagates while particles execute local oscillations in this model.
C | Which distance is one wavelength in a longitudinal wave? | From one compression centre to the next compression centre | Compression centre to nearest rarefaction centre | Any adjacent molecules’ spacing | The total spring length in every case | Consecutive matching compressions are in phase and one wavelength apart.
''')
for f in [2,4,5,8,10]:n(1,f'A marked spring particle oscillates at {f} Hz. What is its period?',1/f,'s',f'T = 1/f = 1/{f}.')
rows(2,'''
F | Higher sound frequency generally means higher… | Pitch | Loudness in every case | Sound speed in the same air automatically | Air density in every case | Pitch relates primarily to frequency.
F | Larger pressure amplitude at fixed frequency generally produces… | Louder sound | Higher pitch only | Lower sound speed | A vacuum | Loudness also depends on perception and frequency, but increasing amplitude at fixed conditions increases sound intensity.
F | Why can sound not travel through an ideal vacuum? | There is no material medium to transmit pressure disturbances | It travels too slowly | It becomes radio | Gravity is absent | Mechanical sound waves need particles to transmit the disturbance.
A | In echo ranging, why divide the sound travel distance by two? | The pulse travels out and back | The sound halves its frequency | The wall halves the wave speed | Two sources always emit | The measured delay is the round-trip time.
C | Increasing the source amplitude but keeping frequency and air conditions fixed changes which microphone-trace feature? | Vertical size of oscillations | Time between successive peaks | Propagation speed | Echo distance in every case | Amplitude changes vertical signal size, while period stays fixed.
''')
for delay in [.2,.4,.5,.8,1]:n(2,f'An echo returns after {delay} s. Sound speed is 340 m/s. How far away is the reflector?',340*delay/2,'m',f'd = vt/2 = 340 × {delay}/2.')
rows(3,'''
F | A siren approaching a stationary listener is heard at a frequency that is… | Higher than the emitted frequency | Lower in all cases | Exactly zero | Unchanged for every source speed | Wavefronts are crowded ahead of a moving source.
F | Behind a receding sound source, wavelength is… | Longer than for a stationary source | Always shorter | Zero | Unrelated to spacing of wavefronts | Successive emitted fronts are farther apart behind the source.
A | For the same air conditions, a moving source changes the sound speed relative to stationary air by… | No change in this ideal model | Adding its speed in every direction | Subtracting its speed everywhere | Making speed infinite | Source motion changes wavefront spacing; sound speed is set by the medium in this model.
A | In the approaching-source formula f′ = fv/(v − vₛ), vₛ must be… | Below sound speed for this subsonic model | Equal to v for all examples | Negative by definition | An acceleration | This simple periodic arrival formula is used for a subsonic source and stationary listener.
C | When the source speed becomes zero, Doppler formulas predict… | Observed frequency equals emitted frequency | Twice the emitted frequency | No sound | Infinite wavelength | Substituting vₛ = 0 gives f′ = f.
''')
for f,speed in [(600,20),(500,30),(800,40),(400,10),(1000,50)]:n(3,f'A source emits {f} Hz while approaching a stationary listener at {speed} m/s. Sound speed is 340 m/s. Find the heard frequency.',f*340/(340-speed),'Hz','For a moving source and stationary observer, f′ = fv/(v − vₛ).','Challenge')
rows(4,'''
F | All electromagnetic waves in vacuum share the same… | Speed | Frequency | Wavelength | Effect on tissue | In vacuum they travel at c ≈ 3.00 × 10⁸ m/s.
F | Which band has a longer wavelength than visible light? | Radio | X-ray | Gamma | Ultraviolet | Radio frequencies are lower and wavelengths longer than visible light.
F | Electromagnetic waves are… | Transverse and able to travel through vacuum | Longitudinal sound waves only | Unable to reflect | Always visible | Electromagnetic fields oscillate transversely and need no material medium.
A | Which is a common infrared application? | Thermal imaging | Hearing an echo | Measuring mass directly | Removing all radiation risk | Warm objects emit infrared, useful in thermal imaging.
C | Moving from radio to gamma along the spectrum generally means… | Higher frequency and shorter wavelength | Lower frequency and shorter wavelength | Higher frequency and longer wavelength | Identical photon energy | c = fλ fixes the inverse relationship in vacuum; photon energy increases with frequency.
''')
for f in [1e6,1e9,1e10,5e14,1e18]:n(4,f'An EM wave has vacuum frequency {f:.3g} Hz. Use c = 3.00 × 10⁸ m/s. Find its wavelength.',3e8/f,'m','λ = c/f. Convert powers of ten carefully.','Challenge')
rows(5,'''
F | Reflection means a wave… | Returns into its original medium at a boundary | Must change frequency | Stops transferring energy forever | Always changes into sound | A reflected wave travels back into the initial medium.
F | Diffraction is… | Spreading at a gap or around an obstacle | Only a change of colour | The same as charge attraction | Heating a conductor | Wave spreading is most obvious when gap size is comparable to wavelength.
A | Water waves entering a slower region keep the same… | Frequency | Speed | Wavelength | Direction at every angle | The source frequency remains unchanged at a stationary boundary.
A | Stronger spreading is expected when a gap is… | Comparable in width to wavelength | A million wavelengths wide | Closed with no transmission | Unrelated to wave size | Compare gap width with the wavelength.
C | A ray entering a slower medium bends towards the normal for oblique incidence because… | Its speed changes while frequency stays fixed | Its frequency becomes zero | The normal is a material barrier | Reflection is impossible | Refraction changes speed and direction; wavelength adjusts to preserve frequency.
''')
for wavelength,ratio in [(2,.5),(4,.75),(3,.6),(5,.4),(1.5,.8)]:n(5,f'A water wave has wavelength {wavelength} cm. At unchanged frequency its speed becomes {ratio} times the original. Find the new wavelength.',wavelength*ratio,'cm','At unchanged f, wavelength changes by the same factor as wave speed.')

begin('optics','Optics and cameras',['Reflection and mirrors','Refraction and Snell’s law','Total internal reflection','Converging lenses','Diverging lenses','Cameras and applications'])
rows(0,'''
F | Reflection angles are measured from the… | Normal | Mirror surface | Horizontal in every diagram | Object’s height | The normal is perpendicular to the surface at incidence.
F | A plane mirror image is… | Virtual and upright | Always real and inverted | Always magnified | Formed on the mirror surface itself | Reflected rays appear to come from behind the mirror.
F | The angle of reflection equals the angle of… | Incidence | Refraction in every case | The mirror surface | Any angle chosen by the observer | The law of reflection is i = r.
A | An object is partly hidden by a card near a mirror. It can remain visible when… | An object–mirror–eye path passes around the card | The mirror remembers it | Light crosses any opaque card | The card creates its own image source | Trace the full path; a card blocks only the rays it intersects.
C | A plane mirror is often said to reverse left and right. A more precise description is… | It reverses the direction perpendicular to its surface | It rotates every object through 180° vertically | It swaps up and down in all cases | It changes the object’s actual handedness physically | Reflection reverses the front–back coordinate; apparent left–right swapping depends on how we compare views.
''')
for angle in [15,25,35,50,70]:n(0,f'A ray strikes a plane mirror at {angle}° to the normal. What is its reflection angle to the normal?',angle,'°','Use i = r; both angles are measured from the normal.','Foundation')
rows(1,'''
F | A ray entering a higher refractive index at an oblique angle usually bends… | Towards the normal | Away from the normal always | Along the surface in every case | Through 180° | Its speed decreases and the ray bends towards the normal.
F | During refraction at a stationary boundary, which remains unchanged? | Frequency | Speed | Wavelength | Direction in every case | The source determines frequency; speed and wavelength change together.
F | Which equation is Snell’s law? | n₁ sin i = n₂ sin r | n₁ cos i = n₂ sin r in all cases | i + r = 90° always | n₁i = n₂r exactly for all angles | Snell’s law relates sines of angles measured from the normal.
A | At normal incidence into glass, a light ray… | Changes speed without changing direction | Cannot enter | Has zero frequency | Must undergo TIR | Incidence zero gives refraction zero, but the speed changes.
C | A ray moves from glass into air below the critical angle. Its transmitted wavelength… | Increases | Decreases | Stays identical while frequency doubles | Becomes zero | Speed increases while frequency stays constant, so λ increases.
''')
for angle in [10,20,30,45,60]:n(1,f'Light enters glass of index 1.50 from air of index 1.00 at {angle}° to the normal. Find the refracted angle.',math.degrees(math.asin(math.sin(math.radians(angle))/1.5)),'°','r = asin(n₁ sin i/n₂). Use degree mode.','Challenge')
rows(2,'''
F | TIR requires light to go from… | Higher to lower refractive index | Lower to higher refractive index | Air to glass only | Any medium into any other at 0° | The refracted angle can reach 90° only for the higher-to-lower direction.
F | Above the critical angle in an ideal TIR case, there is… | No propagating transmitted ray | No reflected ray | A transmitted ray at every angle | Zero incident light | The ideal geometric-optics model gives total reflection.
A | At the critical angle the transmitted ray is… | Along the boundary | Along the normal | Back along the incident ray | At 45° in every material | Refraction angle r = 90° at the critical angle.
A | Which is an application of TIR? | Guiding light in an optical fibre | Making every lens diverge | Increasing sound frequency | Stopping all light reflection | A suitable higher-index core and lower-index surroundings can guide light.
C | Why cannot light entering glass from air undergo TIR at that first boundary? | It is travelling from lower to higher index | Glass never reflects | Air has infinite index | The angle can never change | TIR requires the opposite index direction as well as sufficiently large incidence.
''')
for index in [1.3,1.4,1.5,1.6,1.8]:n(2,f'A material of refractive index {index} meets air of index 1.00. Find the critical angle for light inside the material.',math.degrees(math.asin(1/index)),'°','sin c = n₂/n₁ = 1/n; c = asin(1/n).','Challenge')
rows(3,'''
F | A converging thin lens has focal length that is… | Positive in the stated sign convention | Negative for every object | Always zero | Equal to object distance in every case | Here real-object distance is positive and converging focal length is positive.
F | A real image can be… | Formed on a screen | Located only by dashed back extensions | Formed by all diverging lenses with real objects | Always upright | Real rays converge at a real image, allowing a screen to intercept it.
A | A real object inside a converging lens’s focal length forms a… | Virtual upright image | Real inverted image in every case | Real image at the focal plane | Zero-size image | Rays diverge after the lens; their backward extensions meet on the object side.
A | A real object at twice the focal length of a converging thin lens forms an image… | At 2f, inverted and the same size | At f, upright | At infinity | Virtual and smaller | The thin-lens equation gives v = 2f and m = −1.
C | For an object exactly at the focal point of an ideal converging thin lens, emerging rays are… | Parallel; no finite image distance | Focused at the lens centre | Always virtual at −f | Absorbed completely | 1/v = 1/f − 1/u = 0, so the image is at infinity in this ideal model.
''')
for f,u in [(10,30),(12,36),(8,24),(15,45),(5,20)]:n(3,f'A converging thin lens has f = +{f} cm and real-object distance u = {u} cm. Find v using 1/f = 1/u + 1/v.',1/(1/f-1/u),'cm','1/v = 1/f − 1/u. Positive v means a real image.','Challenge')
rows(4,'''
F | A diverging thin lens has focal length that is… | Negative in this convention | Positive for every real object | Equal to object distance | Undefined for every object | A diverging focal point is virtual, giving f < 0 in this convention.
F | With a real object, a diverging lens forms an image that is… | Virtual, upright and smaller | Always real and inverted | Always enlarged and real | Always at infinity | For f < 0 and u > 0, v < 0 and 0 < magnification < 1.
A | A negative image distance here means the image is… | Virtual, on the object side | Necessarily below the axis | A negative-sized object | Impossible in optics | The sign indicates which side of the lens contains the image.
A | Dashed extensions on a lens diagram represent… | Backward extensions used to locate a virtual image | Additional emitted light beams | A path through an opaque block | Light travelling backwards in time | Real light follows solid outgoing rays; the extensions show apparent origin.
C | For a diverging lens with a real object, magnification m = −v/u is… | Positive and less than 1 | Negative and less than −1 always | Always 1 | Always undefined | Negative v and positive u give positive m, with a reduced upright image.
''')
for f,u in [(-10,30),(-12,24),(-8,16),(-15,45),(-5,20)]:n(4,f'A diverging thin lens has f = {f} cm and u = {u} cm. Find its signed image distance.',1/(1/f-1/u),'cm','1/v = 1/f − 1/u. Keep f negative; negative v locates a virtual image.','Challenge',wrong=[abs(1/(1/f-1/u)),u,abs(f)])
rows(5,'''
F | A camera sensor normally receives an image that is… | Real and inverted | Virtual and upright | Always the same size as the object | Formed behind a diverging lens alone | A converging camera lens forms a real image on its sensor.
F | Focusing a simple camera involves… | Matching sensor position to the image plane | Changing the speed of light in vacuum | Making the image virtual | Removing the lens | The sensor must intercept the converging rays at the required image distance.
A | An object moves farther away from a converging camera lens. Required image distance approaches… | The focal length | Zero | Minus the focal length for every photograph | Infinity in all cases | As 1/u approaches zero, v approaches f.
A | Opening the aperture at fixed shutter time generally admits… | More light | Less light | No light | Only sound | A larger opening passes more of the available light; other photographic effects also matter.
C | In the thin-lens camera model, changing aperture alone changes… | Admitted light, but not the focal length | Focal length but not admitted light | The sign of all real-image distances | The object’s actual distance | Aperture limits the ray bundle; the ideal lens focal length remains fixed.
''')
for f,u in [(50,1000),(50,2000),(35,700),(70,1400),(60,1200)]:n(5,f'A camera lens has focal length {f} mm and object distance {u} mm. Where should its sensor be, measured from the thin lens?',1/(1/f-1/u),'mm','Use the same units for f, u and v, and solve 1/v = 1/f − 1/u.','Challenge')

begin('thermal','Thermal physics',['Temperature and energy','Conduction convection radiation','Specific heat capacity','Latent heat and phases','Thermal equilibrium','Energy problems'])
rows(0,'''
F | Temperature and internal energy are… | Different quantities | Identical in every case | Both measured only in watts | Both forces | Temperature describes thermal state; internal energy includes microscopic kinetic and potential energy.
F | Heat is energy transferred because of… | A temperature difference | A mass difference alone | A colour difference alone | A change of name | Heating transfers energy from a hotter region to a cooler one.
F | The SI unit of energy is the… | Joule | Kelvin | Watt | Newton | Energy is in joules; watt is power, joules per second.
A | A warm bath may have more internal energy than a hotter small cup because… | Mass and material also matter | Higher temperature always means less internal energy | Water has no internal energy | Temperature measures total energy directly | Temperature alone does not determine total internal energy.
C | During melting at fixed pressure, energy supplied can increase internal energy without increasing… | Temperature | The liquid fraction | The potential part of internal energy | The transferred energy | Energy changes particle arrangement during the phase change.
''')
for celsius in [0,20,37,80,100]:n(0,f'Using T/K = temperature/°C + 273, convert {celsius}°C to kelvin.',celsius+273,'K',f'T = {celsius} + 273. This question uses the school approximation 273.','Foundation')
rows(1,'''
F | Energy transfer through a stationary metal bar is mainly… | Conduction | Convection of the whole bar | Sound Doppler shift | Refraction | Conduction involves microscopic interactions, including mobile electrons in metals.
F | Warm water rising and cool water sinking is… | Convection | Radiation only | Refraction | Electrolysis | Convection is energy transfer by bulk fluid motion.
F | Which transfer mechanism needs no medium? | Radiation | Convection | Conduction | Diffusion of liquid particles | Electromagnetic radiation can cross a vacuum.
A | Under the same radiation conditions, a matt black surface is generally a better absorber than… | A shiny silver surface | Every surface regardless of wavelength | Empty space with zero area | A surface defined to be identical | Surface properties affect absorption and emission; comparisons assume the same incident radiation.
C | Why is convection not a heat-transfer mechanism within a solid block? | Its particles cannot undergo bulk fluid circulation | Solids have no particles | Solids cannot transfer energy | Gravity is always zero in solids | Convection needs fluid movement; solids transfer through conduction and radiation at surfaces.
''')
for energy,time in [(600,30),(1200,60),(900,45),(2400,80),(500,25)]:n(1,f'A thermal radiation detector absorbs {energy} J in {time} s. What is the average absorbed power?',energy/time,'W',f'Average power = energy/time = {energy}/{time}.')
rows(2,'''
F | Specific heat capacity describes energy needed to raise… | 1 kg of material by 1°C | Any object by 100°C regardless of mass | 1 kg through a phase change | Any material by 1 m | Specific heat capacity is energy per unit mass per temperature rise.
F | The equation for warming without a phase change is… | E = mcΔT | E = mL only | E = c/m | E = m/ΔT | Use the temperature change, not the final temperature alone.
F | Which unit can express specific heat capacity? | J/(kg·°C) | J/kg only | W only | °C/kg only | J/(kg·K) is also valid because a temperature interval has the same numerical size.
A | For equal mass and energy input, a larger c gives… | A smaller temperature rise | A larger temperature rise | A necessarily higher final temperature in all cases | No energy transfer | ΔT = E/(mc).
C | Ignoring heat losses when calculating c from supplied electrical energy usually… | Overestimates c if measured temperature rise is reduced by losses | Makes c exactly zero | Always halves the true mass | Removes all experimental uncertainty | E_supplied exceeds energy gained by the sample; E_supplied/(mΔT) is too large if losses are ignored.
''')
for mass,delta in [(.2,5),(.5,10),(.3,20),(1,15),(.4,8)]:n(2,f'Water has c = 4200 J/(kg·°C). Find the energy to warm {mass} kg by {delta}°C, with no losses.',mass*4200*delta,'J',f'E = mcΔT = {mass} × 4200 × {delta}.')
rows(3,'''
F | Specific latent heat is energy per unit mass for… | A change of state at constant temperature under the stated conditions | Raising temperature by exactly 1°C | Increasing speed by 1 m/s | Changing voltage | E = mL during a phase change.
F | While pure ice melts at 0°C at atmospheric pressure, its temperature ideally… | Remains at 0°C until melting is complete | Rises steadily through the entire phase change | Falls below absolute zero | Must be 100°C | Supplied latent energy changes the solid to liquid.
A | To melt ice initially at −20°C, the total energy includes… | Warming the ice to 0°C, then melting it | Only warming liquid water | Only the final water temperature | No energy because ice is cold | Add the sensible warming energy and latent melting energy.
A | A temperature plateau on a heating curve can indicate… | A phase change | Zero energy input in every case | Zero mass | Negative specific heat capacity | During a phase change, internal energy can rise while temperature stays fixed.
C | Doubling the mass of ice already at 0°C doubles the ideal energy needed to melt it because… | E = mLf | Lf doubles automatically | Melting point doubles | Ice loses its mass as it melts | Latent heat per unit mass remains fixed under the stated conditions.
''')
for mass in [.1,.2,.3,.4,.5]:n(3,f'Ice is already at 0°C. With Lf = 334,000 J/kg, how much energy melts {mass} kg completely?',mass*334000,'J',f'E = mLf = {mass} × 334000.')
rows(4,'''
F | Two portions in thermal equilibrium have the same… | Temperature | Mass | Total internal energy in every case | Volume in every case | Thermal equilibrium means no net thermal transfer between them.
F | In an isolated mixing experiment, energy lost by the warm water equals… | Energy gained by the cool water | Zero in every case | The mass of the container | Twice the total initial energy | Energy conservation relates the two changes, neglecting the container and losses.
A | Equal masses of the same liquid at 80°C and 20°C mix without losses. The final temperature is… | 50°C | 100°C | 80°C | 20°C | Equal heat capacities and masses give the arithmetic mean.
A | If more cool water is used at the same initial temperatures, final temperature is generally… | Closer to the cool starting temperature | Always closer to the hot starting temperature | Below both starting temperatures | Above both starting temperatures | The larger heat capacity weighs the final temperature towards its initial temperature.
C | When may the simple weighted-temperature average fail? | When phase changes, heat loss or container heat capacity matter | Whenever the masses differ | Whenever the temperatures differ | Whenever the samples have equal c | The simple formula assumes the same c, no phase change and an isolated system with negligible container capacity.
''')
for hotMass,coldMass,hot,cold in [(.2,.3,80,20),(.3,.2,70,20),(.1,.4,90,15),(.4,.1,60,10),(.2,.2,75,25)]:n(4,f'Mix {hotMass} kg of water at {hot}°C and {coldMass} kg at {cold}°C. No losses, phase change or container heat capacity. Find Tf.',(hotMass*hot+coldMass*cold)/(hotMass+coldMass),'°C','For the same material, Tf = (m₁T₁ + m₂T₂)/(m₁ + m₂).','Challenge')
rows(5,'''
F | Power tells us the rate of… | Energy transfer | Temperature itself | Mass creation | Charge force | P = E/t; one watt is one joule per second.
A | A 500 W heater operated for 20 s supplies… | 10,000 J | 25 J | 500 J | 520 J | E = Pt = 500 × 20 = 10000 J.
A | If only 80% of heater energy enters the sample, useful sample energy is… | 0.80 times the supplied energy | Supplied energy divided by 0.80 | Exactly all supplied energy | Zero | Efficiency = useful output/input, so useful energy = efficiency × input.
C | In E = mcΔT, a rise of 10°C is equivalent to a rise of… | 10 K | 283 K | 273 K | −10 K | Intervals have equal numerical size on the Celsius and kelvin scales.
C | To estimate the ideal heating time to warm and then melt a sample at fixed power, use… | Total required energy divided by power | Power divided by mass only | Final temperature divided by mass | Latent energy minus warming energy | Add all required energy contributions, then use t = E/P.
''')
for mass,power in [(.1,200),(.2,500),(.3,600),(.4,800),(.5,1000)]:n(5,f'An ideal {power} W heater warms {mass} kg of ice from −20°C to 0°C and then melts it. Use c_ice = 2100 J/(kg·°C) and Lf = 334000 J/kg. Find the time.',mass*(2100*20+334000)/power,'s','Total E = mc_ice × 20 + mLf, then t = E/P. No losses.','Challenge')

begin('kinematics','Motion and projectiles',['Motion quantities','Motion graphs','Free fall','Projectiles','Stopping distance','Catch-up and delayed starts'])
rows(0,'''
F | Displacement differs from distance because it includes… | Direction and only the change in position | Every section of path length without direction | Mass | Elapsed time only | Displacement is a vector from initial to final position; distance is total path length.
F | Acceleration is the rate of change of… | Velocity | Position only | Mass | Force in every case | a = Δv/Δt.
A | A runner travels 10 m east then 4 m west. Displacement is… | 6 m east | 14 m east | 6 m west | 14 m west | Use signed position changes: +10 − 4 = +6 m.
A | Can an object have negative velocity and positive acceleration? | Yes; it can be moving left while slowing down | No, both signs must match | Only if it has negative mass | Only if position is zero | Velocity gives direction of motion; acceleration gives direction of velocity change.
C | A trolley returns to its starting position after moving. Which can be zero? | Displacement, while distance is positive | Distance, while displacement is positive | All elapsed time | Every instantaneous speed | Net position change may be zero even when a nonzero path was travelled.
''')
for initial,final,time in [(2,10,4),(10,4,3),(0,15,5),(8,0,4),(-2,4,3)]:n(0,f'Velocity changes from {initial} m/s to {final} m/s in {time} s. Find the constant acceleration.',(final-initial)/time,'m/s²',f'a = (v − u)/t = ({final} − {initial})/{time}.')
rows(1,'''
F | The gradient of a position–time graph is… | Velocity | Acceleration | Force | Mass | Gradient gives change in position per unit time.
F | The gradient of a velocity–time graph is… | Acceleration | Position | Distance only | Kinetic energy | Gradient gives velocity change per unit time.
F | Signed area under a velocity–time graph gives… | Displacement | Acceleration | Resultant force | Mass | The time integral of velocity is displacement.
A | A horizontal position–time line indicates… | Constant position | Constant nonzero acceleration | Increasing speed | Zero elapsed time | Position is not changing, so velocity is zero.
C | A velocity–time graph crossing from positive to negative velocity indicates… | Reversal of direction | Negative time | Zero acceleration in every case | An impossible motion | Velocity zero at the crossing separates motion in opposite directions.
''')
for u,a,time in [(2,1,4),(4,-2,4),(0,3,5),(6,-1,3),(-2,2,4)]:n(1,f'At constant acceleration {a} m/s², a trolley starts at u = {u} m/s. Find displacement after {time} s.',u*time+.5*a*time*time,'m',f's = ut + ½at² = {u}×{time} + 0.5×{a}×{time}². This is signed displacement.','Challenge')
rows(2,'''
F | In a vacuum, a feather and ball released together at the same height have… | The same gravitational acceleration | Equal mass | Zero weight | No gravitational force | Without air resistance, acceleration is independent of mass at a fixed location.
F | For a drop from rest, initial vertical velocity is… | Zero | Always 9.81 m/s | Equal to height | Infinite | Released from rest means u = 0.
A | In free fall near Earth without air resistance, downward speed… | Increases by about 9.81 m/s each second | Remains zero | Depends on mass alone | Decreases by 9.81 m/s each second during a drop | Gravity gives approximately constant downward acceleration.
A | The Moon’s smaller g makes a drop from the same height take… | Longer | Less time | Exactly the same time | Zero time | t = √(2h/g), which increases when g is smaller.
C | The feather falls slowly in air mainly because… | Air resistance is important relative to its weight | Gravity does not act on feathers | Its mass is negative | The atmosphere reverses gravity | Drag depends on shape, area, speed and fluid properties; the vacuum model removes it.
''')
for height in [5,10,20,30,50]:n(2,f'An object drops from rest through {height} m in vacuum near Earth. Use g = 9.81 m/s². Find the fall time.',math.sqrt(2*height/9.81),'s','h = ½gt², so t = √(2h/g).','Challenge')
rows(3,'''
F | Without air resistance, a projectile’s horizontal acceleration is… | Zero | 9.81 m/s² | Equal to vertical velocity | Set by its mass | Gravity acts vertically in this ideal flat-Earth model.
F | At a projectile’s highest point, the vertical velocity is… | Zero | Equal to the initial upward velocity | Always equal to horizontal velocity | Infinite | It changes from upwards to downwards through zero; acceleration remains downward.
A | At the highest point, a nonvertical projectile’s total speed is… | Its horizontal speed, not generally zero | Always zero | Always the launch speed | Infinite | The horizontal component remains while the vertical component is zero.
A | The vertical acceleration at the top of the flight is… | Still −g | Zero | Upwards +g | Equal to horizontal speed | Gravity does not stop acting at the turning point.
C | Complementary launch angles have equal ideal ranges only when… | Speed is equal, launch and landing heights match, and drag is absent | The speeds differ arbitrarily | The initial heights differ arbitrarily | Air resistance dominates | R = u² sin(2θ)/g applies to equal-height, no-drag flights.
''')
for speed,angle in [(10,30),(20,45),(25,60),(15,35),(30,50)]:n(3,f'A projectile launches at {speed} m/s at {angle}° above horizontal. Find its initial horizontal velocity.',speed*math.cos(math.radians(angle)),'m/s','Resolve the launch velocity: uₓ = u cosθ. Use degree mode.')
rows(4,'''
F | Total stopping distance is the sum of… | Thinking and braking distances | Speed and mass | Reaction time and force | Velocity and acceleration | The car travels during the driver’s reaction and then during braking.
F | Thinking distance equals… | Initial speed × reaction time | Speed squared × reaction time | Deceleration divided by time | Mass × speed | During the ideal reaction interval, speed is unchanged.
A | Doubling speed at fixed braking deceleration multiplies braking distance by… | Four | Two | One half | One | Braking distance v²/(2a) is quadratic in speed.
A | A longer reaction time at unchanged speed gives… | A longer thinking distance | A shorter thinking distance | Zero thinking distance | Unchanged thinking distance | d_thinking = vt_reaction.
C | The simple stopping model omits which real effect? | Changing tyre–road grip | The car’s initial speed | Reaction time | Braking deceleration as a chosen input | The model assumes a constant chosen deceleration rather than detailed tyre and road mechanics.
''')
for speed,reaction,a in [(10,.7,5),(20,.7,5),(15,1,4),(25,.8,6),(30,1,5)]:n(4,f'A car travels at {speed} m/s, the reaction time is {reaction} s and braking deceleration is {a} m/s². Find total stopping distance.',speed*reaction+speed*speed/(2*a),'m','d_total = vt_reaction + v²/(2a), with constant speed during reaction and constant deceleration during braking.','Challenge')
rows(5,'''
F | Two moving objects meet when they have… | Equal positions at the same clock time | Equal distances travelled in every case | Equal speeds only | Equal starting positions only | Use a shared origin and clock to compare positions.
F | B starts 3 s after A. At shared time t ≥ 3 s, B has moved for… | t − 3 seconds | t + 3 seconds | Always t seconds | Always 3t seconds | Subtract B’s delay from the common elapsed time.
A | On a position–time graph, B waiting at its start before release is shown by… | A horizontal segment | A vertical segment | A line with infinite speed | No possible position | B’s position is constant while it waits.
A | A is ahead and moving faster than B after B starts. With constant speeds, B… | Never catches A | Always catches A eventually | Catches A when their speeds are added | Catches A at t = 0 in every case | The positive gap grows when the object ahead is also faster.
C | When B begins behind A and is faster, the time from B’s release to catching A is… | Gap at B’s release divided by the speed difference | Initial gap divided by the speed sum in every case | Delay divided by either mass | Always equal to the delay | First include A’s travel during the delay; the gap then closes at relative speed vB − vA.
''')
for xA,vA,xB,vB,delay in [(20,3,0,5,2),(30,3,0,6,0),(0,3,0,5,4),(40,2,10,5,3),(10,4,0,8,5)]:n(5,f'A starts at {xA} m at {vA} m/s at t = 0. B waits at {xB} m until t = {delay} s, then moves at {vB} m/s in the same direction. At what time from A’s start does B catch A?',(xA-xB+vB*delay)/(vB-vA),'s',f'Equal positions: {xA} + {vA}t = {xB} + {vB}(t − {delay}). Solve for the shared time t, not just B’s moving time.','Challenge')

begin('dynamics','Forces and dynamics',['Newton’s laws','Resultant force and acceleration','Weight and normal force','Friction','Inclined planes','Connected bodies'])
rows(0,'''
F | With zero resultant force, an object’s velocity is… | Constant, possibly zero | Always increasing | Always zero | Necessarily vertical | Newton’s first law includes rest and uniform straight-line motion.
F | Newton’s second law for constant mass is… | F_resultant = ma | F = m/a | a = mF | m = Fa | Use the resultant force on the chosen body.
F | Newton’s third-law pair acts on… | Two different bodies | The same body only | No bodies | One body at two different times only | Equal and opposite interaction forces act on the two interacting bodies.
A | Why do third-law forces not cancel in one object’s free-body diagram? | The partner force acts on a different body | Their magnitudes always differ | Only one force exists | Opposite forces can never cancel | Include only forces acting on the selected object.
C | A trolley moving right can have zero resultant force when… | It moves right at constant velocity | It must be speeding up | It must have no mass | It must be slowing down | A nonzero velocity needs no resultant force to maintain it in the ideal model.
''')
for force,mass in [(6,2),(10,5),(3,1.5),(12,4),(8,2.5)]:n(0,f'A constant resultant force of {force} N acts on a {mass} kg trolley. Find acceleration.',force/mass,'m/s²',f'a = F_resultant/m = {force}/{mass}.')
rows(1,'''
F | Resultant force is the… | Vector sum of forces on one body | Sum of all force magnitudes without direction | Object’s weight in every case | Largest force only | Add forces with their directions.
F | Two opposite horizontal forces of equal magnitude give… | Zero resultant horizontal force | Twice either force in one direction | Infinite acceleration | Negative mass | Equal opposite forces on the same body balance.
A | With mass fixed, doubling nonzero resultant force doubles… | Acceleration | Mass | Initial position | Weight automatically | a = F/m, so acceleration is proportional to resultant force.
A | A body’s acceleration points in the direction of… | Its resultant force | Its velocity in every case | Its displacement in every case | Its largest distance | Newton’s second law is a vector relation.
C | Can a body slow down while accelerating right? | Yes, if it is moving left | No, rightward acceleration always raises speed | Only if mass is zero | Only if weight is zero | Speed decreases when acceleration opposes velocity.
''')
for right,left,mass in [(10,4,2),(12,3,3),(8,6,1),(20,5,5),(5,9,2)]:n(1,f'Right is positive. A {mass} kg body has a {right} N rightward force and a {left} N leftward force. Find acceleration.',(right-left)/mass,'m/s²',f'F_net = {right} − {left}; a = F_net/{mass}.')
rows(2,'''
F | Weight is measured in… | Newtons | Kilograms | Joules | Metres | Weight is gravitational force W = mg; mass is in kilograms.
F | The normal contact force is directed… | Perpendicular to the surface | Always vertically upwards on any slope | Along the surface | Always downwards | Normal means perpendicular to the contact surface.
A | On a horizontal surface with no vertical acceleration or other vertical forces, N equals… | mg | Zero in every case | ma horizontally | μmg in every case | Vertical force balance gives N − mg = 0.
A | On an incline with no other perpendicular forces, N is… | mg cosθ | Always mg | mg sinθ | Zero in every case | Resolve weight perpendicular to the plane.
C | The Moon has a smaller g than Earth. The same object has… | The same mass but less weight | Less mass and equal weight | Equal weight and equal g | No mass | Mass is intrinsic in this model; weight depends on local g.
''')
for mass in [1,2,3.5,5,8]:n(2,f'What is the weight of a {mass} kg mass near Earth? Use g = 9.81 m/s².',mass*9.81,'N',f'W = mg = {mass} × 9.81.','Foundation')
rows(3,'''
F | Static friction can act on a block that… | Is at rest relative to the surface | Must already be sliding | Has zero mass only | Has no contact surface | Static friction prevents relative sliding when within its limit.
F | The maximum static-friction magnitude is modelled by… | μsN | Always zero | mg/N | N/μs in every case | Actual static friction can be smaller than its limiting value.
A | A 4 N pull is below the static-friction limit. The block remains still. Friction magnitude is… | 4 N | Always the maximum limit | 0 N | 8 N | Static friction balances the applied force up to its limit.
A | Sliding friction generally acts… | Opposite relative sliding | Always to the right | Always with the pull | Vertically upwards only | Its direction resists relative sliding at the contact.
C | Why does the simulator state that one μ is used for static and kinetic friction? | Real surfaces may have different μs and μk | Static friction never exists | Friction is always independent of normal force | All materials have μ = 1 | Using one coefficient is a simplifying assumption, not a universal material property.
''')
for mass,mu,force in [(2,.3,4),(2,.2,10),(3,.1,12),(1,.4,2),(4,.25,15)]:
 friction=min(mu*mass*9.81,force);n(3,f'A {mass} kg block starts at rest on a horizontal track. Pull = {force} N, μs = μk = {mu}, g = 9.81. Find acceleration after applying the pull.',(force-friction)/mass,'m/s²','First compare the pull with μN. Static friction balances it below the limit; otherwise use F_net = pull − μmg, then a = F_net/m.','Challenge')
rows(4,'''
F | The component of weight down an incline at angle θ is… | mg sinθ | mg cosθ | Always mg | Always zero | Resolve the gravitational force parallel to the slope.
F | A block can stay at rest on a rough incline when… | Static friction can balance mg sinθ | Gravity disappears | Normal force acts downhill | Mass is zero | Compare mg sinθ with μs mg cosθ.
A | Increasing the angle of a frictionless incline makes down-slope acceleration… | Larger for angles between 0° and 90° | Smaller in every case | Independent of angle | Zero in every case | a = g sinθ rises over that angle interval.
A | In the ideal sliding model with fixed angle and μ, changing mass changes acceleration by… | No change | Doubling it for doubled mass | Halving it for doubled mass | Making it always zero | Mass cancels from g(sinθ − μ cosθ).
C | Why must the static limit be checked before applying a sliding-friction equation? | The block may remain at rest with adjusting friction | Static friction always equals μN exactly | The normal force is always zero | Gravity changes sign when still | A negative predicted downhill acceleration from the naive sliding formula need not imply uphill motion from rest.
''')
for angle in [10,20,30,40,50]:n(4,f'A block slides down a frictionless incline at {angle}°. Use g = 9.81 m/s². Find down-slope acceleration.',9.81*math.sin(math.radians(angle)),'m/s²','With no friction, a = g sinθ; use degree mode.')
rows(5,'''
F | For a light inextensible string over an ideal pulley, connected bodies have… | Equal acceleration magnitudes along the string | Equal masses in every case | Equal weights in every case | Zero acceleration always | The string constraint ties their motions together while taut.
F | An ideal massless, frictionless pulley gives string tension that is… | Equal on both sides of a light string | Always zero | Always equal to both weights | Different by definition | The ideal string and pulley transmit a common tension.
A | A hanging mass accelerating down has tension… | Less than its weight | Greater than its weight | Equal to its weight in every case | Negative in every case | mg − T = ma; for a > 0, T < mg.
A | When analysing the whole trolley-plus-hanging-mass system, tensions… | Cancel as internal forces | Must both be added as external driving forces | Become zero on each separate body | Replace all gravity | Internal interactions cancel from the combined-system force balance, but remain in individual diagrams.
C | If trolley static friction can balance the hanging weight, an initially resting system… | Can remain at rest | Must accelerate upwards forever | Must have negative tension | Must break the string | Compare the hanging driving force with the available static-friction limit.
''')
for trolley,hanging in [(3,1),(2,1),(4,2),(5,.5),(1,2)]:n(5,f'A {trolley} kg trolley on a frictionless table is connected to a {hanging} kg hanging mass by a light string and ideal pulley. Use g = 9.81. Find their acceleration magnitude.',hanging*9.81/(trolley+hanging),'m/s²','For the combined system, external driving force is m₂g and total mass is m₁ + m₂. Thus a = m₂g/(m₁ + m₂).','Challenge')

for slug,b in banks.items():
 assert len(b['questions'])==60,(slug,len(b['questions']))
 for category in b['categories']:assert sum(q['category']==category for q in b['questions'])==10
 (ROOT/'assets/revision/questions'/f'y10-physics-{slug}.json').write_text(json.dumps(b,ensure_ascii=False,indent=2)+'\n')
print('Built 360 Physics questions in six banks, including a dedicated catch-up and delayed-start question area.')
