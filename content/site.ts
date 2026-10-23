export type SectionId = 'about' | 'cabins' | 'activities' | 'contacts';

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
};
