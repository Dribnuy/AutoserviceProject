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


export const delphiInjectors: Injector[] = [
    {
      id: 'delphi-1',
      name: 'Delphi Common Rail Injector EJBR',
      partNumber: 'EJBR04501D',
      image: '/images/injectors/delphi-1.jpg',
      vehicles: [
        'Ford Mondeo 2.0 TDCi',
        'Ford Focus 1.8 TDCi',
        'Jaguar X-Type 2.0D'
      ],
      description: 'Форсунка Common Rail Delphi для двигунів Ford TDCi',
      specifications: {
        pressure: '1600 bar',
        flowRate: '1100 cc/min',
        voltage: '12V'
      }
    },
    {
      id: 'delphi-2',
      name: 'Delphi Common Rail Injector 1.5 dCi',
      partNumber: '28231014',
      image: '/images/injectors/delphi-2.jpg',
      vehicles: [
        'Renault Clio 1.5 dCi',
        'Nissan Almera 1.5 dCi',
        'Dacia Logan 1.5 dCi'
      ],
      description: 'Форсунка Common Rail Delphi для двигунів Renault/Nissan 1.5 dCi',
      specifications: {
        pressure: '1400 bar',
        flowRate: '850 cc/min',
        voltage: '12V'
      }
    },
    {
      id: 'delphi-3',
      name: 'Delphi Common Rail Injector CRDi',
      partNumber: '33800-4X800',
      image: '/images/injectors/delphi-3.jpg',
      vehicles: [
        'Kia Carnival 2.9 CRDi',
        'Hyundai Terracan 2.9 CRDi'
      ],
      description: 'Форсунка Common Rail Delphi для корейських позашляховиків',
      specifications: {
        pressure: '1600 bar',
        flowRate: '1250 cc/min',
        voltage: '12V'
      }
    },
      {
      id: 'delphi-4',
      name: 'Delphi Common Rail Injector 2.2 HDi',
      partNumber: 'EMBR00301D',
      image: '/images/injectors/delphi-4.jpg',
      vehicles: [
        'Peugeot Boxer 2.2 HDi',
        'Citroen Jumper 2.2 HDi',
        'Ford Transit 2.2 TDCi'
      ],
      description: 'Форсунка Common Rail Delphi для комерційних авто PSA/Ford',
      specifications: {
        pressure: '1800 bar',
        flowRate: '1150 cc/min',
        voltage: '12V'
      }
    }
  ];