export interface Injector {
    id: string;
    name: string;
    partNumber: string;
    image: string;
    vehicles: string[];
    description: string;
    specifications: {
      pressure: string;
      flowRate: string;
      voltage: string;
    };
  }

export const densoInjectors: Injector[] = [
    {
      id: 'denso-1',
      name: 'Denso Common Rail Injector D-4D',
      partNumber: '095000-5600',
      image: '/images/injectors/denso-1.jpg',
      vehicles: [
        'Toyota Land Cruiser 100 4.2 TD',
        'Toyota Hilux 3.0 D-4D'
      ],
      description: 'Форсунка Common Rail Denso для двигунів Toyota D-4D',
      specifications: {
        pressure: '1800 bar',
        flowRate: '1350 cc/min',
        voltage: '12V'
      }
    },
    {
      id: 'denso-2',
      name: 'Denso Common Rail Injector DI-D',
      partNumber: '095000-5471',
      image: '/images/injectors/denso-2.jpg',
      vehicles: [
        'Mitsubishi L200 2.5 DI-D',
        'Mitsubishi Pajero 3.2 DI-D'
      ],
      description: 'Форсунка Common Rail Denso для двигунів Mitsubishi DI-D',
      specifications: {
        pressure: '1800 bar',
        flowRate: '1300 cc/min',
        voltage: '12V'
      }
    },
    {
      id: 'denso-3',
      name: 'Denso Common Rail Injector 2.5 dCi',
      partNumber: '095000-6250',
      image: '/images/injectors/denso-3.jpg',
      vehicles: [
        'Nissan Navara D40 2.5 dCi',
        'Nissan Pathfinder 2.5 dCi'
      ],
      description: 'Форсунка Common Rail Denso для двигунів Nissan YD25',
      specifications: {
        pressure: '2000 bar',
        flowRate: '1400 cc/min',
        voltage: '12V'
      }
    },
    {
      id: 'denso-4',
      name: 'Denso Common Rail Injector 2.0 CD',
      partNumber: 'RF5C13H50A',
      image: '/images/injectors/denso-4.jpg',
      vehicles: [
        'Mazda 6 2.0 CD',
        'Mazda MPV 2.0 CD',
        'Mazda 5 2.0 CD'
      ],
      description: 'Форсунка Common Rail Denso для дизельних двигунів Mazda',
      specifications: {
        pressure: '1600 bar',
        flowRate: '1000 cc/min',
        voltage: '12V'
      }
    }
  ];