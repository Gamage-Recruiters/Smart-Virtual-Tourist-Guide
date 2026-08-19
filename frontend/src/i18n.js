import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// English translations
const enTranslation = {
  header: {
    home: "Home",
    menu: "Menu",
    offers: "Offers",
    reservation: "Reservation",
    revenue: "Revenue",
    profile: "Profile",
    signIn: "Sign in"
  },
  mainLayout: {
    title: "Booking Marketplace",
    subtitle: "Find and book the best verified travel services in Sri Lanka.",
    searchPlaceholder: "Search services...",
    postRequest: "Post Custom Request"
  },
  marketplaceNavbar: {
    drivers: "Drivers",
    vehicles: "Vehicles",
    guides: "Guides",
    hotels: "Hotels",
    restaurants: "Restaurants",
    activities: "Activities"
  },
  sidebar: {
    budgetGuardian: "Budget Guardian",
    availableFunds: "AVAILABLE FUNDS",
    tripProgress: "Trip Progress",
    used: "Used",
    manageBudget: "Manage Budget",
    filters: "Filters",
    reset: "Reset",
    rating: "Rating"
  }
};

// Sinhala translations
const siTranslation = {
  header: {
    home: "මුල් පිටුව",
    menu: "මෙනුව",
    offers: "දීමනා",
    reservation: "වෙන්කිරීම්",
    revenue: "ආදායම",
    profile: "පැතිකඩ",
    signIn: "ඇතුල් වන්න"
  },
  mainLayout: {
    title: "වෙන්කිරීමේ වෙළඳපොල",
    subtitle: "ශ්‍රී ලංකාවේ හොඳම තහවුරු කළ සංචාරක සේවා සොයා වෙන්කරගන්න.",
    searchPlaceholder: "සේවා සොයන්න...",
    postRequest: "විශේෂිත ඉල්ලීමක් යොමු කරන්න"
  },
  marketplaceNavbar: {
    drivers: "රියදුරන්",
    vehicles: "වාහන",
    guides: "මඟ පෙන්වන්නන්",
    hotels: "හෝටල්",
    restaurants: "ආපනශාලා",
    activities: "ක්‍රියාකාරකම්"
  },
  sidebar: {
    budgetGuardian: "අයවැය ආරක්ෂකයා",
    availableFunds: "ලබාගත හැකි මුදල්",
    tripProgress: "ගමනේ ප්‍රගතිය",
    used: "භාවිතා කර ඇත",
    manageBudget: "අයවැය කළමනාකරණය",
    filters: "පෙරහන්",
    reset: "යථා තත්වයට පත් කරන්න",
    rating: "ශ්‍රේණිගත කිරීම"
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      EN: {
        translation: enTranslation,
      },
      SI: {
        translation: siTranslation,
      },
    },
    lng: "EN", // Default language
    fallbackLng: "EN",
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
