export type SectionId = 'about' | 'cabins' | 'activities' | 'contacts';

export interface AboutRow {
  image: string;
  alt: string;
  text: string;
}

export interface CabinCard {
  name: string;
  image: string;
  alt: string;
  guests: string;
  text: string;
  features: string[];
  price: string;
}

export interface Activity {
  title: string;
  text: string;
  image: string;
  alt: string;
}

export const site = {
  name: 'Дом лесника',
  tagline: 'база отдыха · наедине с природой',
  phone: '+7 (999) 999-99-99',
  phoneHref: 'tel:+79999999999',
  nav: [
    { id: 'about', label: 'О нас' },
    { id: 'cabins', label: 'Домики' },
    { id: 'activities', label: 'Активный отдых' },
    { id: 'contacts', label: 'Контакты' },
  ] satisfies { id: SectionId; label: string }[],

  about: [
    {
      image: '/images/about-cabin.jpg',
      alt: 'Деревянный домик среди сосен',
      text: '«Дом лесника» стоит в сосновом лесу, вдали от трасс и городского шума. Здесь пахнет хвоей, по утрам поют птицы, а ночью над поляной видно настоящее звёздное небо.',
    },
    {
      image: '/images/about-lake.jpg',
      alt: 'Деревянный причал на лесном озере',
      text: 'В домиках есть всё для спокойного отдыха: удобные кровати, кухня, душ и свежее бельё. Деревянные стены и большие окна — чтобы лес был рядом даже в дождь. До воды — пара минут пешком.',
    },
    {
      image: '/images/about-campfire.jpg',
      alt: 'Друзья у костра в вечернем лесу',
      text: 'Вечером можно растопить баню, пожарить шашлык или просто посидеть у костра. Днём — лодка, рыбалка и прогулки по лесным тропам. А можно ничего не делать: тишина здесь тоже входит в отдых.',
    },
  ] satisfies AboutRow[],

  cabins: [
    {
      name: 'А-фрейм',
      image: '/images/cabin-aframe.jpg',
      alt: 'Треугольный домик А-фрейм в лесу',
      guests: 'до 4 гостей',
      text: 'Треугольный домик с панорамным окном и спальней под самой крышей.',
      features: ['Панорамное окно', 'Кухня', 'Терраса'],
      price: 'от 5 500 ₽ / сутки',
    },
    {
      name: 'Семейный дом',
      image: '/images/cabin-family.jpg',
      alt: 'Бревенчатый дом среди высоких деревьев',
      guests: 'до 6 гостей',
      text: 'Просторный бревенчатый дом для семьи или небольшой компании.',
      features: ['Две спальни', 'Гостиная с печью', 'Кухня'],
      price: 'от 7 000 ₽ / сутки',
    },
    {
      name: 'Домик для двоих',
      image: '/images/cabin-couple.jpg',
      alt: 'Небольшой домик на закате',
      guests: 'до 2 гостей',
      text: 'Уютный домик на краю поляны — для тех, кто приехал вдвоём.',
      features: ['Двуспальная кровать', 'Вид на лес', 'Веранда'],
      price: 'от 4 000 ₽ / сутки',
    },
    {
      name: 'Большой корпус',
      image: '/images/cabin-lodge.jpg',
      alt: 'Большой деревянный дом у воды',
      guests: 'до 25 гостей',
      text: 'Целый дом для праздника, корпоратива или встречи большой семьи.',
      features: ['Зал для застолья', 'Кухня', 'Свой мангал'],
      price: 'от 15 000 ₽ / сутки',
    },
  ] satisfies CabinCard[],

  activities: [
    { title: 'Баня на дровах', text: 'Жаркая парная, веники и чай на травах', image: '/images/act-sauna.jpg', alt: 'Деревянная парная' },
    { title: 'Лодка и катамаран', text: 'Неспешные прогулки по воде', image: '/images/act-boat.jpg', alt: 'Нос деревянной лодки на озере' },
    { title: 'Мангальная зона', text: 'Мангал, решётки и шампуры — всё на месте', image: '/images/act-bbq.jpg', alt: 'Шашлык и овощи на гриле' },
    { title: 'Рыбалка', text: 'Тихие места у воды для ранних подъёмов', image: '/images/act-fishing.jpg', alt: 'Рыбак с удочкой в лесной реке' },
    { title: 'Лесные тропы', text: 'Маршруты для прогулок от часа до целого дня', image: '/images/act-trails.jpg', alt: 'Тропа с деревянными перилами в лесу' },
    { title: 'Зимние забавы', text: 'Лыжи, ватрушки и снежная горка', image: '/images/act-winter.jpg', alt: 'Заснеженная ель на рассвете' },
  ] satisfies Activity[],

  contacts: {
    address: 'Лесная ул., 1, д. Сосновка',
    hours: 'На связи каждый день с 9:00 до 21:00',
    email: 'hello@example.com',
    socials: [
      { id: 'telegram', label: 'Telegram' },
      { id: 'vk', label: 'ВКонтакте' },
      { id: 'whatsapp', label: 'WhatsApp' },
    ],
  },
};
