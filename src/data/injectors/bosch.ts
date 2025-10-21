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
  
  export const boschInjectors: Injector[] = [
    {
      id: 'bosch-1',
      name: 'Bosch Common Rail Injector 0445110',
      partNumber: '0445110376',
      image: '/images/injectors/bosch-1.jpg',
      vehicles: [
        'Mercedes-Benz Sprinter 2.2 CDI',
        'Mercedes-Benz C-Class W204',
        'Mercedes-Benz E-Class W211'
      ],
      description: 'Форсунка Common Rail для дизельних двигунів Mercedes-Benz',
      specifications: {
        pressure: '1600 bar',
        flowRate: '1000 cc/min',
        voltage: '12V'
      }
    },
    {
      id: 'bosch-2',
      name: 'Bosch Common Rail Injector 0445120',
      partNumber: '0445120212',
      image: '/images/injectors/bosch-2.jpg',
      vehicles: [
        'BMW 320d E90',
        'BMW 520d F10',
        'BMW X5 E70 3.0d'
      ],
      description: 'Форсунка Common Rail для дизельних двигунів BMW',
      specifications: {
        pressure: '1800 bar',
        flowRate: '1200 cc/min',
        voltage: '12V'
      }
    },
    {
      id: 'bosch-3',
      name: 'Bosch Common Rail Injector 0445110',
      partNumber: '0445110183',
      image: '/images/injectors/bosch-3.jpg',
      vehicles: [
        'Volkswagen Passat 2.0 TDI',
        'Audi A4 2.0 TDI',
        'Skoda Superb 2.0 TDI'
      ],
      description: 'Форсунка Common Rail для двигунів VAG Group',
      specifications: {
        pressure: '1600 bar',
        flowRate: '950 cc/min',
        voltage: '12V'
      }
    },
    {
      id: 'bosch-4',
      name: 'Bosch Common Rail Injector 0445110',
      partNumber: '0445110629',
      image: '/images/injectors/bosch-4.jpg',
      vehicles: [
        'Ford Transit 2.2 TDCI',
        'Ford Mondeo 2.0 TDCI',
        'Ford Focus 2.0 TDCI'
      ],
      description: 'Форсунка Common Rail для дизельних двигунів Ford',
      specifications: {
        pressure: '1600 bar',
        flowRate: '1050 cc/min',
        voltage: '12V'
      }
    },
    {
      id: 'bosch-5',
      name: 'Bosch Common Rail Injector 0445120',
      partNumber: '0445120304',
      image: '/images/injectors/bosch-5.jpg',
      vehicles: [
        'Volvo XC90 D5',
        'Volvo S80 D5',
        'Volvo V70 D5'
      ],
      description: 'Форсунка Common Rail для дизельних двигунів Volvo',
      specifications: {
        pressure: '2000 bar',
        flowRate: '1300 cc/min',
        voltage: '12V'
      }
    },
    {
      id: 'bosch-6',
      name: 'Bosch Common Rail Injector 0445110',
      partNumber: '0445110811',
      image: '/images/injectors/bosch-6.jpg',
      vehicles: [
        'Renault Master 2.3 dCi',
        'Opel Movano 2.3 CDTI',
        'Nissan NV400 2.3 dCi'
      ],
      description: 'Форсунка Common Rail для легких комерційних автомобілів',
      specifications: {
        pressure: '1600 bar',
        flowRate: '980 cc/min',
        voltage: '12V'
      }
    }
  ];