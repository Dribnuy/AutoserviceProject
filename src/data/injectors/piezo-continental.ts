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
  
  export const piezoContinentalInjectors: Injector[] = [
    {
      id: 'piezo-1',
      name: 'Continental Piezo Injector A2C59513554',
      partNumber: 'A2C59513554',
      image: '/images/injectors/piezo-1.jpg',
      vehicles: [
        'Audi A6 3.0 TDI',
        'Audi Q7 3.0 TDI',
        'Volkswagen Touareg 3.0 TDI'
      ],
      description: 'П\'єзоелектрична форсунка для двигунів VAG Group',
      specifications: {
        pressure: '2000 bar',
        flowRate: '1400 cc/min',
        voltage: '12V'
      }
    },
    {
      id: 'piezo-2',
      name: 'Continental Piezo Injector A2C59513556',
      partNumber: 'A2C59513556',
      image: '/images/injectors/piezo-2.jpg',
      vehicles: [
        'BMW 535d F10',
        'BMW X5 35d E70',
        'BMW 730d F01'
      ],
      description: 'П\'єзоелектрична форсунка для дизельних двигунів BMW',
      specifications: {
        pressure: '2200 bar',
        flowRate: '1500 cc/min',
        voltage: '12V'
      }
    },
    {
      id: 'piezo-3',
      name: 'Continental Piezo Injector A2C59517051',
      partNumber: 'A2C59517051',
      image: '/images/injectors/piezo-3.jpg',
      vehicles: [
        'Mercedes-Benz E350 CDI W212',
        'Mercedes-Benz S350 CDI W221',
        'Mercedes-Benz ML350 CDI W164'
      ],
      description: 'П\'єзоелектрична форсунка для Mercedes-Benz',
      specifications: {
        pressure: '2000 bar',
        flowRate: '1450 cc/min',
        voltage: '12V'
      }
    },
    {
      id: 'piezo-4',
      name: 'Continental Piezo Injector A2C59513555',
      partNumber: 'A2C59513555',
      image: '/images/injectors/piezo-4.jpg',
      vehicles: [
        'Porsche Cayenne 3.0 TDI',
        'Volkswagen Phaeton 3.0 TDI',
        'Audi A8 3.0 TDI'
      ],
      description: 'П\'єзоелектрична форсунка преміум-класу',
      specifications: {
        pressure: '2200 bar',
        flowRate: '1550 cc/min',
        voltage: '12V'
      }
    },
    {
      id: 'piezo-5',
      name: 'Continental Piezo Injector A2C59511605',
      partNumber: 'A2C59511605',
      image: '/images/injectors/piezo-5.jpg',
      vehicles: [
        'Land Rover Discovery 3.0 TDV6',
        'Range Rover Sport 3.0 TDV6',
        'Jaguar XF 3.0 TDV6'
      ],
      description: 'П\'єзоелектрична форсунка для двигунів JLR',
      specifications: {
        pressure: '2000 bar',
        flowRate: '1350 cc/min',
        voltage: '12V'
      }
    },
    {
      id: 'piezo-6',
      name: 'Continental Piezo Injector A2C59513557',
      partNumber: 'A2C59513557',
      image: '/images/injectors/piezo-6.jpg',
      vehicles: [
        'Audi Q5 3.0 TDI',
        'Volkswagen Multivan 3.0 TDI',
        'Porsche Macan 3.0 TDI'
      ],
      description: 'П\'єзоелектрична форсунка нового покоління',
      specifications: {
        pressure: '2400 bar',
        flowRate: '1600 cc/min',
        voltage: '12V'
      }
    }
  ];