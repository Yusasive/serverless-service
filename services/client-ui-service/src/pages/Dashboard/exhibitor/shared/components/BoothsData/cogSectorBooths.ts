// components/BoothsData/cogSectorBooths.ts

import { BoothData } from '../../types/booth.types';

export const cogSectorBooths: { [key: string]: BoothData } = {
  // GROUP 1 - Single column (4 booths)
  // Upper section
  'COG101': {
    coords: [[1637, 1313], [1737, 1213], [1787, 1263], [1687, 1363]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG101'
  },
  'COG102': {
    coords: [[1687, 1363], [1787, 1263], [1837, 1313], [1737, 1413]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG102'
  },
  // Lower section
  'COG103': {
    coords: [[1637, 1463], [1737, 1363], [1787, 1413], [1687, 1513]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG103'
  },
  'COG104': {
    coords: [[1687, 1513], [1787, 1413], [1837, 1463], [1737, 1563]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG104'
  },

  // GROUP 2 - Double column (8 booths)
  // Upper section - Column 1 (odd numbers)
  'COG201': {
    coords: [[1937, 1113], [2037, 1013], [2087, 1063], [1987, 1163]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG201'
  },
  'COG203': {
    coords: [[1987, 1163], [2087, 1063], [2137, 1113], [2037, 1213]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG203'
  },
  // Upper section - Column 2 (even numbers)
  'COG202': {
    coords: [[2087, 1063], [2187, 963], [2237, 1013], [2137, 1113]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG202'
  },
  'COG204': {
    coords: [[2137, 1113], [2237, 1013], [2287, 1063], [2187, 1163]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG204'
  },
  // Lower section - Column 1 (odd numbers)
  'COG205': {
    coords: [[1937, 1263], [2037, 1163], [2087, 1213], [1987, 1313]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG205'
  },
  'COG207': {
    coords: [[1987, 1313], [2087, 1213], [2137, 1263], [2037, 1363]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG207'
  },
  // Lower section - Column 2 (even numbers)
  'COG206': {
    coords: [[2087, 1213], [2187, 1113], [2237, 1163], [2137, 1263]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG206'
  },
  'COG208': {
    coords: [[2137, 1263], [2237, 1163], [2287, 1213], [2187, 1313]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG208'
  },

  // GROUP 3 - Double column (8 booths)
  // Upper section - Column 1
  'COG301': {
    coords: [[2387, 813], [2487, 713], [2537, 763], [2437, 863]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG301'
  },
  'COG303': {
    coords: [[2437, 863], [2537, 763], [2587, 813], [2487, 913]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG303'
  },
  // Upper section - Column 2
  'COG302': {
    coords: [[2537, 763], [2637, 663], [2687, 713], [2587, 813]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG302'
  },
  'COG304': {
    coords: [[2587, 813], [2687, 713], [2737, 763], [2637, 863]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG304'
  },
  // Lower section - Column 1
  'COG305': {
    coords: [[2387, 963], [2487, 863], [2537, 913], [2437, 1013]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG305'
  },
  'COG307': {
    coords: [[2437, 1013], [2537, 913], [2587, 963], [2487, 1063]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG307'
  },
  // Lower section - Column 2
  'COG306': {
    coords: [[2537, 913], [2637, 813], [2687, 863], [2587, 963]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG306'
  },
  'COG308': {
    coords: [[2587, 963], [2687, 863], [2737, 913], [2637, 1013]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG308'
  },

  // GROUP 4 - Double column (8 booths)
  // Upper section - Column 1
  'COG401': {
    coords: [[2837, 513], [2937, 413], [2987, 463], [2887, 563]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG401'
  },
  'COG403': {
    coords: [[2887, 563], [2987, 463], [3037, 513], [2937, 613]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG403'
  },
  // Upper section - Column 2
  'COG402': {
    coords: [[2987, 463], [3087, 363], [3137, 413], [3037, 513]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG402'
  },
  'COG404': {
    coords: [[3037, 513], [3137, 413], [3187, 463], [3087, 563]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG404'
  },
  // Lower section - Column 1
  'COG405': {
    coords: [[2837, 663], [2937, 563], [2987, 613], [2887, 713]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG405'
  },
  'COG407': {
    coords: [[2887, 713], [2987, 613], [3037, 663], [2937, 763]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG407'
  },
  // Lower section - Column 2
  'COG406': {
    coords: [[2987, 613], [3087, 513], [3137, 563], [3037, 663]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG406'
  },
  'COG408': {
    coords: [[3037, 663], [3137, 563], [3187, 613], [3087, 713]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG408'
  },

  // GROUP 5 - Double column (8 booths)
  // Upper section - Column 1
  'COG501': {
    coords: [[3287, 213], [3387, 113], [3437, 163], [3337, 263]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG501'
  },
  'COG503': {
    coords: [[3337, 263], [3437, 163], [3487, 213], [3387, 313]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG503'
  },
  // Upper section - Column 2
  'COG502': {
    coords: [[3437, 163], [3537, 63], [3587, 113], [3487, 213]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG502'
  },
  'COG504': {
    coords: [[3487, 213], [3587, 113], [3637, 163], [3537, 263]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG504'
  },
  // Lower section - Column 1
  'COG505': {
    coords: [[3287, 363], [3387, 263], [3437, 313], [3337, 413]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG505'
  },
  'COG507': {
    coords: [[3337, 413], [3437, 313], [3487, 363], [3387, 463]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG507'
  },
  // Lower section - Column 2
  'COG506': {
    coords: [[3437, 313], [3537, 213], [3587, 263], [3487, 363]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG506'
  },
  'COG508': {
    coords: [[3487, 363], [3587, 263], [3637, 313], [3537, 413]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG508'
  },

  // GROUP 6 - Double column (8 booths)
  // Upper section - Column 1
  'COG601': {
    coords: [[3737, 0], [3837, 0], [3887, 50], [3787, 150]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG601'
  },
  'COG603': {
    coords: [[3787, 150], [3887, 50], [3937, 100], [3837, 200]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG603'
  },
  // Upper section - Column 2
  'COG602': {
    coords: [[3887, 50], [3987, 0], [4037, 50], [3937, 100]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG602'
  },
  'COG604': {
    coords: [[3937, 100], [4037, 50], [4087, 100], [3987, 200]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG604'
  },
  // Lower section - Column 1
  'COG605': {
    coords: [[3737, 250], [3837, 150], [3887, 200], [3787, 300]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG605'
  },
  'COG607': {
    coords: [[3787, 300], [3887, 200], [3937, 250], [3837, 350]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG607'
  },
  // Lower section - Column 2
  'COG606': {
    coords: [[3887, 200], [3987, 100], [4037, 150], [3937, 250]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG606'
  },
  'COG608': {
    coords: [[3937, 250], [4037, 150], [4087, 200], [3987, 300]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG608'
  },

  // GROUP 7 - Special layout (6 booths)
  // Upper section - Column 1
  'COG701': {
    coords: [[4187, 0], [4287, 0], [4337, 50], [4237, 100]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG701'
  },
  'COG703': {
    coords: [[4237, 100], [4337, 50], [4387, 100], [4287, 200]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG703'
  },
  // Upper section - Column 2
  'COG702': {
    coords: [[4337, 50], [4437, 0], [4487, 50], [4387, 100]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG702'
  },
  'COG704': {
    coords: [[4387, 100], [4487, 50], [4537, 100], [4437, 200]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG704'
  },
  // Lower section - Column 1 only
  'COG705': {
    coords: [[4187, 250], [4287, 150], [4337, 200], [4237, 300]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG705'
  },
  'COG706': {
    coords: [[4237, 300], [4337, 200], [4387, 250], [4287, 350]],
    status: 'available',
    size: '3m x 3m',
    category: 'Standard',
    price: 230000,
    sqm: 9,
    boothId: 'COG706'
  }
};