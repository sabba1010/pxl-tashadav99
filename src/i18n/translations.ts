// export type Lang = "es" | "en";

// export const translations = {
//   es: {
//     servicios: "Servicios",
//     envio_nacionales: "Envíos Nacionales",
//     envio_internacional: "Envíos Internacionales",
//     carga_pesada: "Carga Pesada",
//     express: "Express 24h",
//     tienda: "Tienda",
//     quienes_somos: "Quiénes Somos",
//     faq: "FAQ",
//     recogida: "Recogida",
//     rastrear: "RASTREAR PAQUETE",
//     inicio: "Inicio",
//     siguuenos: "Síguenos",
//     languageShort: "ES",
//     switchTo: "English",
//   },
//   en: {
//     servicios: "Services",
//     envio_nacionales: "National Shipping",
//     envio_internacional: "International",
//     carga_pesada: "Heavy Cargo",
//     express: "Express 24h",
//     tienda: "Store",
//     quienes_somos: "About Us",
//     faq: "FAQ",
//     recogida: "Pickup",
//     rastrear: "TRACK PACKAGE",
//     inicio: "Home",
//     siguuenos: "Follow us",
//     languageShort: "EN",
//     switchTo: "Español",
//   },
// } as const;

// export type Translations = typeof translations;
// export type TKey = keyof Translations["es"];



// src/i18n/translations.ts (recommended normalized)
export type Lang = "es" | "en";

export const translations = {
  es: {
    servicios: "Servicios",
    envio_nacionales: "Envíos Nacionales",
    envio_internacional: "Envíos Internacionales",
    carga_pesada: "Carga Pesada",
    express: "Express 24h",
    tienda: "Tienda",
    quienes_somos: "Quiénes Somos",
    faq: "FAQ",
    recogida: "Recogida",
    contacto: "Contacto",
    nuestros: "nuestros",
    CasilleroEscritorio: "CasilleroEscritorio",
    rastrear: "RASTREAR PAQUETE",
    inicio: "Inicio",
    siguenos: "Síguenos",        // <-- normalized key
    languageShort: "ES",
    switchTo: "English",
  },
  en: {
    servicios: "Services",
    envio_nacionales: "National Shipping",
    envio_internacional: "International",
    carga_pesada: "Heavy Cargo",
    express: "Express 24h",
    tienda: "Store",
    quienes_somos: "About Us",
    faq: "FAQ",
    recogida: "Pickup",
    contacto: "Contact",
    nuestros: "Our Services",
    CasilleroEscritorio: "Desk Locker",
    rastrear: "TRACK PACKAGE",
    inicio: "Home",
    siguenos: "Follow us",      // <-- normalized key
    languageShort: "EN",
    switchTo: "Español",
  },
} as const;

export type Translations = typeof translations;
export type TKey = keyof Translations["es"];
