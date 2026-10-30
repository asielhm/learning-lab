// Generated formative checks. No identity collection or recording.
export const CHECKS={
  "static": [
    {
      "id": "y9-electricity-static-204",
      "category": "Electron transfer and conservation",
      "difficulty": "Application",
      "prompt": "Two initially neutral patches exchange three electrons from cloth to balloon. What are their net charges?",
      "options": [
        "Balloon +3 e; cloth −3 e.",
        "Both −3 e.",
        "Balloon −3 e; cloth +3 e.",
        "Both zero."
      ],
      "answer": 2,
      "explanation": "Three negative elementary charges leave one patch and enter the other. The total is still zero."
    },
    {
      "id": "y9-electricity-static-304",
      "category": "Forces and polarisation",
      "difficulty": "Application",
      "prompt": "Why can a negative balloon attract a neutral wall?",
      "options": [
        "The wall’s charge distribution shifts, with positive charge effectively nearer.",
        "The wall must always have a negative net charge.",
        "Gravity reverses near balloons.",
        "The balloon sends new protons through the wall."
      ],
      "answer": 0,
      "explanation": "Polarisation puts opposite charge closer. That attraction can outweigh the more distant like-charge repulsion."
    },
    {
      "id": "y9-electricity-static-502",
      "category": "Earthing and discharge",
      "difficulty": "Foundation",
      "prompt": "A positive metal sphere is earthed with no nearby charging object. Which way can electrons move?",
      "options": [
        "Only from sphere to Earth.",
        "Only from the insulating stand to the air.",
        "From Earth to sphere.",
        "Electrons cannot respond to a positive object."
      ],
      "answer": 2,
      "explanation": "The electron deficit can be filled from Earth through the conducting connection."
    },
    {
      "id": "y9-electricity-static-608",
      "category": "Static electricity in everyday life",
      "difficulty": "Challenge",
      "prompt": "Why should an industrial particle filter not be described as removing all pollution?",
      "options": [
        "It cannot attract any charged matter.",
        "Only neutral gases have mass.",
        "It targets particles and does not necessarily capture gaseous pollutants.",
        "All pollution consists of electrons."
      ],
      "answer": 2,
      "explanation": "Particles and gaseous pollutants are different. A particular separation method addresses specific materials."
    }
  ],
  "pizza": [
    {
      "id": "y9-electricity-circuits-202",
      "category": "Potential difference and energy",
      "difficulty": "Foundation",
      "prompt": "In the pizza model, what does the shop represent?",
      "options": [
        "The cell supplying energy.",
        "A resistor using up charge.",
        "An ammeter measuring food.",
        "The Earth removing all couriers."
      ],
      "answer": 0,
      "explanation": "The shop supplies pizzas as the cell supplies energy per charge. Couriers represent charge packets."
    },
    {
      "id": "y9-electricity-circuits-203",
      "category": "Potential difference and energy",
      "difficulty": "Foundation",
      "prompt": "In the pizza model, what happens to couriers after the party?",
      "options": [
        "They are destroyed as the lamp uses charge.",
        "They return to the shop without the delivered energy badge.",
        "They become new cell nuclei.",
        "They remain permanently at the party."
      ],
      "answer": 1,
      "explanation": "Energy transfers at the component; charge continues around a complete loop."
    },
    {
      "id": "y9-electricity-circuits-207",
      "category": "Potential difference and energy",
      "difficulty": "Application",
      "prompt": "In a two-resistor series network, the supply is 6 V and one resistor has 2 V. What is the other potential difference?",
      "options": [
        "8 V.",
        "4 V.",
        "12 V.",
        "3 V."
      ],
      "answer": 1,
      "explanation": "Series potential differences add to the supply voltage, neglecting wire and internal resistance: 6 − 2 = 4 V."
    },
    {
      "id": "y9-electricity-circuits-209",
      "category": "Potential difference and energy",
      "difficulty": "Challenge",
      "prompt": "What is an important limit of the pizza model?",
      "options": [
        "A cell cannot supply energy.",
        "Real lamps must consume charge.",
        "There is no complete path in any real circuit.",
        "Real circuit energy transfer involves electromagnetic fields, not literal parcels carried on electrons."
      ],
      "answer": 3,
      "explanation": "The analogy separates charge circulation from energy transfer. It does not describe the full electromagnetic mechanism."
    }
  ],
  "resistance": [
    {
      "id": "y9-electricity-circuits-103",
      "category": "Current and charge flow",
      "difficulty": "Foundation",
      "prompt": "In a steady series circuit, how does current before a resistor compare with current after it?",
      "options": [
        "The current after is always zero.",
        "The current before is twice the current after.",
        "The resistor creates extra charge, so current after is greater.",
        "They are equal."
      ],
      "answer": 3,
      "explanation": "Charge does not accumulate indefinitely in a steady series loop. Energy transfers, while the same charge rate continues."
    },
    {
      "id": "y9-electricity-circuits-303",
      "category": "Resistance and Ohm’s law",
      "difficulty": "Foundation",
      "prompt": "At fixed voltage, what happens when resistance increases?",
      "options": [
        "Current always increases.",
        "Current stays identical in every circuit.",
        "Charge begins to be destroyed.",
        "Current decreases."
      ],
      "answer": 3,
      "explanation": "I = V/R. Increasing the denominator at fixed V reduces the steady current."
    },
    {
      "id": "y9-electricity-circuits-306",
      "category": "Resistance and Ohm’s law",
      "difficulty": "Application",
      "prompt": "At fixed resistance, what does doubling voltage do to current?",
      "options": [
        "Halves it.",
        "Leaves it unchanged.",
        "Doubles it.",
        "Makes it four times as large."
      ],
      "answer": 2,
      "explanation": "Direct proportion means the same multiplicative change in V and I when R is constant."
    },
    {
      "id": "y9-electricity-circuits-609",
      "category": "Wire factors, power and applications",
      "difficulty": "Challenge",
      "prompt": "At fixed supply voltage, what happens to resistor power if resistance doubles?",
      "options": [
        "Power doubles.",
        "Power increases fourfold.",
        "Power is unchanged.",
        "Power halves."
      ],
      "answer": 3,
      "explanation": "At fixed V, P = V²/R, so doubling R halves total power. The statement P = I²R must be used with the actual changed current, not a falsely fixed I."
    }
  ],
  "ohms-law": [
    {
      "id": "y9-electricity-circuits-400",
      "category": "Meters and current–voltage graphs",
      "difficulty": "Foundation",
      "prompt": "How should an ammeter be connected?",
      "options": [
        "Directly across the supply without a load.",
        "In place of both supply terminals at once.",
        "In series with the measured path.",
        "Outside the circuit with no connection."
      ],
      "answer": 2,
      "explanation": "An ammeter measures current through a path. Its very low resistance makes a direct supply connection inappropriate."
    },
    {
      "id": "y9-electricity-circuits-401",
      "category": "Meters and current–voltage graphs",
      "difficulty": "Foundation",
      "prompt": "How should a voltmeter be connected?",
      "options": [
        "Only in series as the sole path.",
        "Inside the battery’s chemical material.",
        "To one unconnected wire only.",
        "In parallel across the component or network."
      ],
      "answer": 3,
      "explanation": "A voltmeter compares two points across the measured component and has high resistance."
    },
    {
      "id": "y9-electricity-circuits-404",
      "category": "Meters and current–voltage graphs",
      "difficulty": "Application",
      "prompt": "For I vertically and V horizontally, what does the gradient equal?",
      "options": [
        "R.",
        "VI.",
        "1/R.",
        "The total number of electrons."
      ],
      "answer": 2,
      "explanation": "Gradient is ΔI/ΔV. Since I = V/R, it equals reciprocal resistance, in A/V."
    },
    {
      "id": "y9-electricity-circuits-506",
      "category": "Series and parallel circuits",
      "difficulty": "Application",
      "prompt": "At 6 V, 20 Ω and 40 Ω are in parallel. What is supply current?",
      "options": [
        "0.10 A.",
        "0.15 A.",
        "0.45 A.",
        "0.30 A."
      ],
      "answer": 2,
      "explanation": "Branch currents are 6/20 = 0.30 A and 6/40 = 0.15 A. Their sum is 0.45 A."
    }
  ],
  "wire-resistance": [
    {
      "id": "y9-electricity-circuits-600",
      "category": "Wire factors, power and applications",
      "difficulty": "Foundation",
      "prompt": "Which wire factor describes the material itself at a stated temperature?",
      "options": [
        "Length, L.",
        "Cross-sectional area, A.",
        "Resistivity, ρ.",
        "Circuit time, t."
      ],
      "answer": 2,
      "explanation": "Resistivity is a material property in Ω m. Resistance also depends on geometry: R = ρL/A."
    },
    {
      "id": "y9-electricity-circuits-601",
      "category": "Wire factors, power and applications",
      "difficulty": "Foundation",
      "prompt": "Keeping material, area and temperature fixed, what does doubling wire length do?",
      "options": [
        "Halves resistance.",
        "Divides resistance by four.",
        "Leaves resistance unchanged.",
        "Doubles resistance."
      ],
      "answer": 3,
      "explanation": "R is directly proportional to L for a uniform wire at fixed resistivity and area."
    },
    {
      "id": "y9-electricity-circuits-606",
      "category": "Wire factors, power and applications",
      "difficulty": "Application",
      "prompt": "For our ordinary metal models, what usually happens when temperature increases?",
      "options": [
        "Resistance increases because lattice vibrations increase scattering.",
        "Positive ion cores flow around the loop.",
        "Resistance must become exactly zero.",
        "Every material has an identical temperature response."
      ],
      "answer": 0,
      "explanation": "These approximate metal models have positive temperature coefficients. Other materials and temperature ranges can behave differently."
    },
    {
      "id": "y9-electricity-circuits-607",
      "category": "Wire factors, power and applications",
      "difficulty": "Application",
      "prompt": "Keeping material, length and temperature fixed, what does doubling a round wire’s diameter do to resistance?",
      "options": [
        "Doubles it.",
        "Divides it by four.",
        "Halves it.",
        "Multiplies it by four."
      ],
      "answer": 1,
      "explanation": "Area A = π(d/2)² grows by a factor of four, so R = ρL/A falls to one quarter."
    }
  ]
};
