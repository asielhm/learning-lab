// Two ideal, isothermal gas samples separated by a sealed flexible membrane.
// Initially: total chamber 20 mL = balloon 5 mL + surrounding air 15 mL,
// both at 101.3 kPa absolute and 293.15 K. Negligible membrane tension means
// equal pressures at equilibrium; neither sample exchanges gas with the other.
export function syringeBalloon(chamberVolume) {
  if (!Number.isFinite(chamberVolume) || chamberVolume <= 0) throw new RangeError('Chamber volume must be positive and finite.');
  const P=101.3*20/chamberVolume, balloon=101.3*5/P;
  return {V:chamberVolume,P,T:293.15,balloon,outside:chamberVolume-balloon};
}
