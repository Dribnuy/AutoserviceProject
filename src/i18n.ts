import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'uk'] as const;
export const defaultLocale = 'uk' as const;

export type Locale = (typeof locales)[number];

const messages = {
  en: {
    "common": {
      "nav": {
        "home": "Home",
        "services": "Services", 
        "about": "About Us",
        "contact": "Contact",
        "works": "Our Works",
        "blog": "Blog"
      },
      "language": "Language",
      "hero": {
        "title": "Professional Auto Service",
        "subtitle": "Quality repair and maintenance for your vehicle",
        "cta": "Order Service"
      },
      "services": {
        "title": "Our Services",
        "diagnostics": "Diagnostics",
        "repair": "Repair",
        "maintenance": "Maintenance",
        "tire": "Tire Service",
        "diagnostics_desc": "Comprehensive diagnostics using modern equipment",
        "repair_desc": "High-quality repair with warranty on work",
        "maintenance_desc": "Preventive maintenance, cleaning and adjustments",
        "tire_desc": "Full tire and fuel system service"
      },
      "about": {
        "title": "About Us",
        "description": "We have been working in the auto service market for over 10 years. Our team of qualified craftsmen provides quality repair and maintenance of vehicles."
      },
      "contact": {
        "title": "Contact",
        "address": "Address",
        "phone": "Phone",
        "email": "Email", 
        "hours": "Working Hours",
        "map": "Find us on map"
      },
      "footer": {
        "rights": "All rights reserved",
        "address": "Kyiv, Avtoservisna St, 123",
        "phone": "+380 (44) 123-45-67",
        "email": "info@autoservice.ua"
      },
      "blog": {
        "title": "Blog",
        "subtitle": "Useful articles about repair and maintenance of fuel injection pumps",
        "categories": {
          "all": "All",
          "diagnostics": "Diagnostics",
          "repair": "Repair",
          "equipment": "Equipment",
          "maintenance": "Maintenance",
          "analysis": "Analysis",
          "economy": "Economy"
        },
        "tags": {
          "tnvd": "TNVD",
          "diagnostics": "diagnostics",
          "repair": "repair",
          "mistakes": "mistakes",
          "tips": "tips",
          "equipment": "equipment",
          "tools": "tools",
          "maintenance": "maintenance",
          "comparison": "comparison",
          "manufacturers": "manufacturers",
          "economy": "economy",
          "fuel": "fuel"
        },
        "buttons": {
          "readArticle": "Read article"
        },
        "articles": {
          "1": {
            "title": "How to properly diagnose a fuel injection pump: step-by-step",
            "excerpt": "A detailed guide to diagnosing a high-pressure fuel pump. Learn the main symptoms of malfunctions and methods for detecting them.",
            "category": "Diagnostics",
            "readTime": "8 min"
          },
          "2": {
            "title": "Top 5 mistakes in pump repair to avoid",
            "excerpt": "We explain the most common mistakes made when repairing a fuel pump and how to avoid them.",
            "category": "Repair",
            "readTime": "6 min"
          },
          "3": {
            "title": "Modern equipment for pump repair: what to use",
            "excerpt": "An overview of the latest equipment and tools needed for quality pump repair.",
            "category": "Equipment",
            "readTime": "10 min"
          },
          "4": {
            "title": "Preventive maintenance of fuel pumps: when and how",
            "excerpt": "Learn about the importance of prevention and how to properly maintain a fuel pump to extend its life.",
            "category": "Maintenance",
            "readTime": "7 min"
          },
          "5": {
            "title": "Differences between pumps from different manufacturers: a comparison",
            "excerpt": "A detailed comparative analysis of pumps from different manufacturers, their features and advantages.",
            "category": "Analysis",
            "readTime": "12 min"
          },
          "6": {
            "title": "Fuel economy: how the pump affects consumption",
            "excerpt": "We analyze how the condition of the fuel pump affects fuel economy and what to do to optimize it.",
            "category": "Economy",
            "readTime": "9 min"
          }
        }
      }
    }
  },
  uk: {
    "common": {
      "nav": {
        "home": "Головна",
        "services": "Послуги",
        "about": "Про нас", 
        "contact": "Контакти",
        "works": "Наші роботи",
        "blog": "Блог"
      },
      "language": "Мова",
      "hero": {
        "title": "Професійний автосервіс",
        "subtitle": "Якісний ремонт та обслуговування вашого автомобіля",
        "cta": "Замовити послугу"
      },
      "services": {
        "title": "Наші послуги",
        "diagnostics": "Діагностика",
        "repair": "Ремонт",
        "maintenance": "ТО",
        "tire": "Шиномонтаж",
        "diagnostics_desc": "Комплексна діагностика із сучасним обладнанням",
        "repair_desc": "Якісний ремонт з гарантією на роботи",
        "maintenance_desc": "Профілактичне обслуговування, чистка та налаштування",
        "tire_desc": "Повний сервіс шиномонтажу та паливної системи"
      },
      "about": {
        "title": "Про нас",
        "description": "Ми працюємо на ринку автосервісу понад 10 років. Наша команда кваліфікованих майстрів забезпечує якісний ремонт та обслуговування автомобілів."
      },
      "contact": {
        "title": "Контакти",
        "address": "Адреса",
        "phone": "Телефон",
        "email": "Email",
        "hours": "Графік роботи", 
        "map": "Ми на карті"
      },
      "footer": {
        "rights": "Всі права захищені",
        "address": "c. Михайлівка, вул. Першотравнева, 124",
        "phone": "+380 (44) 123-45-67",
        "email": "info@autoservice.ua"
      },
      "blog": {
        "title": "Блог",
        "subtitle": "Корисні статті про ремонт та обслуговування ТНВД",
        "categories": {
          "all": "Всі",
          "diagnostics": "Діагностика",
          "repair": "Ремонт",
          "equipment": "Обладнання",
          "maintenance": "Обслуговування",
          "analysis": "Аналіз",
          "economy": "Економія"
        },
        "tags": {
          "tnvd": "ТНВД",
          "diagnostics": "діагностика",
          "repair": "ремонт",
          "mistakes": "помилки",
          "tips": "поради",
          "equipment": "обладнання",
          "tools": "інструменти",
          "maintenance": "профілактика",
          "comparison": "порівняння",
          "manufacturers": "виробники",
          "economy": "економія",
          "fuel": "паливо"
        },
        "buttons": {
          "readArticle": "Читати статтю"
        },
        "articles": {
          "1": {
            "title": "Як правильно діагностувати ТНВД: покрокова інструкція",
            "excerpt": "Детальний гід по діагностиці топливного насоса високого тиску. Дізнайтеся про основні симптоми несправностей та методи їх виявлення.",
            "category": "Діагностика",
            "readTime": "8 хв"
          },
          "2": {
            "title": "Топ-5 помилок при ремонті ТНВД, яких варто уникати",
            "excerpt": "Розповідаємо про найпоширеніші помилки, які роблять при ремонті топливного насоса, та як їх уникнути.",
            "category": "Ремонт",
            "readTime": "6 хв"
          },
          "3": {
            "title": "Сучасне обладнання для ремонту ТНВД: що використовувати",
            "excerpt": "Огляд найновішого обладнання та інструментів, необхідних для якісного ремонту топливних насосів.",
            "category": "Обладнання",
            "readTime": "10 хв"
          },
          "4": {
            "title": "Профілактичне обслуговування ТНВД: коли і як робити",
            "excerpt": "Дізнайтеся про важливість профілактики та як правильно обслуговувати топливний насос для продовження його роботи.",
            "category": "Обслуговування",
            "readTime": "7 хв"
          },
          "5": {
            "title": "Різниця між ТНВД різних виробників: порівняльний аналіз",
            "excerpt": "Детальний порівняльний аналіз ТНВД від різних виробників, їх особливості та переваги.",
            "category": "Аналіз",
            "readTime": "12 хв"
          },
          "6": {
            "title": "Економія палива: як ТНВД впливає на споживання",
            "excerpt": "Розбираємо, як стан топливного насоса впливає на економію палива та що робити для оптимізації.",
            "category": "Економія",
            "readTime": "9 хв"
          }
        }
      }
    }
  }
} as const;

export default getRequestConfig(async ({ locale }) => {
  const selectedLocale = (locale && locales.includes(locale as any)) ? locale : defaultLocale;
  
  return {
    locale: selectedLocale,
    messages: messages[selectedLocale as keyof typeof messages]
  };
});