import { createContext, useContext, useState, createElement, type ReactNode } from "react";

export type Lang = "en" | "id";

export const HIJRI_MONTH_NAMES_ID = [
  "Muharram", "Safar", "Rabi'ul Awal", "Rabi'ul Akhir",
  "Jumadil Awal", "Jumadil Akhir", "Rajab", "Sya'ban",
  "Ramadhan", "Syawal", "Dzulkaidah", "Dzulhijjah",
];

const translations = {
  en: {
    // Header
    appName: "Hilal Explorer",
    appSubtitle: "Educational Moon Sighting Tool",
    switchToLight: "Switch to light mode",
    switchToDark: "Switch to dark mode",

    // Disclaimer
    disclaimer: "This app is for educational purposes only and does not replace official announcements from religious authorities regarding the start of Islamic months.",

    // Controls
    location: "Location",
    settings: "Settings",
    visibilityStandard: "Visibility Standard",
    timeline: "Timeline",

    // Tabs
    tabResult: "Result",
    tabCompare: "Compare",
    tabLearn: "Learn",

    // Empty state
    selectLocation: "Select a location to see hilal visibility data.",

    // LocationPicker
    detectMyLocation: "Detect My Location",
    updateMyLocation: "Update My Location",
    detecting: "Detecting...",
    orSelectCity: "Or select a city:",
    enterManually: "Enter coordinates manually",
    locationName: "Location name (optional)",
    latitude: "Latitude",
    longitude: "Longitude",
    useCoordinates: "Use These Coordinates",
    geoNotSupported: "Geolocation is not supported by your browser.",
    locationDenied: "Location access denied. Please select a city or enter coordinates.",
    invalidCoords: "Please enter valid coordinates (lat: -90 to 90, lng: -180 to 180).",

    // ResultCard
    sunset: "Sunset",
    moonAlt: "Moon Alt.",
    elongation: "Elongation",
    moonAge: "Moon Age",
    illumination: "Illumination",
    arcOfVision: "Arc of Vision",
    possible: "Possible",
    notPossible: "Not Possible",
    hijriTooltip: "Hijri date is a tabular estimate and may differ from official announcements by 1–2 days. See the Learn tab for details.",

    // ComparisonMode
    compareTitle: "Compare Locations",
    compareSubtitle: "Select up to 6 locations to compare hilal visibility",
    location_col: "Location",
    sunsetCol: "Sunset",
    moonAltCol: "Moon Alt.",
    elongationCol: "Elongation",
    visibilityCol: "Visibility",
    yes: "Yes",
    no: "No",
    selectLocationsPrompt: "Select locations above to compare.",

    // TimelineSlider
    moonAltTimeline: "Moon altitude over time",
    dayLabel: "Day",

    // EducationalSection
    learnTitle: "Learn About Hilal Observation",
    whatIsHilal: "What is Hilal?",
    whatIsHilalP1: "Hilal (هلال) is the Arabic word for the thin crescent moon that appears shortly after a new moon (conjunction). It marks the beginning of each month in the Islamic (Hijri) calendar.",
    whatIsHilalP2: "In Islamic tradition, the sighting of the hilal after sunset determines when a new lunar month begins. This is why months like Ramadan and Dhul Hijjah can start on different days in different countries — it depends on whether the hilal was observable from that location.",
    whatIsHilalP3: "The hilal is different from the astronomical new moon. The new moon (conjunction) is when the moon is closest to the sun in the sky and completely invisible. The hilal appears several hours to a day later, when the moon has moved far enough from the sun to reflect a thin sliver of light visible to the naked eye.",

    whatIsAltitude: "What is Moon Altitude?",
    whatIsAltitudeP1: "Altitude (also called elevation) is the angle between the moon and the horizon, measured in degrees. An altitude of 0° means the moon is at the horizon, and 90° would be directly overhead.",
    whatIsAltitudeP2: "For hilal sighting, the moon's altitude at sunset is crucial. If the moon is below the horizon (negative altitude), it has already set and cannot be seen. If it's above the horizon but too low (say, 1-2°), atmospheric haze and brightness from the recently-set sun make it extremely difficult to see.",
    whatIsAltitudeP3: "Most criteria require a minimum altitude of 2-5° above the horizon at sunset for a realistic chance of sighting.",

    whatIsElongation: "What is Elongation?",
    whatIsElongationP1: "Elongation is the angular distance (separation) between the sun and the moon as viewed from Earth, measured in degrees.",
    whatIsElongationP2: "At new moon (conjunction), the elongation is 0° — the moon is right next to the sun in the sky. As hours and days pass after conjunction, the moon moves away from the sun, increasing the elongation.",
    whatIsElongationP3: "A minimum elongation of about 6-8° is typically needed for the crescent to be bright enough to see with the naked eye. The wider the elongation, the brighter and thicker the crescent appears, making it easier to spot.",

    whyCountriesDiffer: "Why Do Countries Differ?",
    whyCountriesDifferIntro: "Islamic countries and communities use different methods to determine the start of lunar months, which is why dates can differ:",
    rukyahLabel: "Physical sighting (Rukyah):",
    rukyahDesc: "Requires actual visual confirmation of the crescent by reliable witnesses. Used traditionally and still practiced in Saudi Arabia and others.",
    hisabLabel: "Astronomical calculation (Hisab):",
    hisabDesc: "Uses mathematical models to predict when the moon will be theoretically visible. Countries like Malaysia, Indonesia, and Brunei use the Imkanur Rukyah criteria.",
    combinedLabel: "Combined approach:",
    combinedDesc: "Some countries use astronomical calculations as a baseline but still require physical sighting attempts to confirm.",
    geographyNote: "Additionally, local geography matters: different latitudes and longitudes mean the moon's position relative to the horizon varies. A city near the equator may see the hilal while a city at a higher latitude cannot, even on the same evening.",

    standardsTitle: "Visibility Standards Explained",
    malaysiaStandard: "Malaysia (Imkanur Rukyah):",
    malaysiaStandardDesc: "The official Malaysian/MABIMS criteria requires: moon altitude ≥ 3° and elongation ≥ 6.4° at sunset. This is based on decades of research by Malaysian, Indonesian, Bruneian, and Singaporean astronomers.",
    conservativeStandard: "Conservative (Strict Rukyah):",
    conservativeStandardDesc: "A stricter criteria requiring altitude ≥ 5° and elongation ≥ 8°. This represents conditions where the crescent is more reliably visible to trained naked-eye observers, typical of traditional rukyah requirements.",
    istanbulStandard: "Istanbul Criteria 2016:",
    istanbulStandardDesc: "Adopted at the OIC (Organisation of Islamic Cooperation) Hijri Calendar Unification conference in Istanbul. Requires: moon age ≥ 9 hours after new moon, elongation ≥ 8°, and moon altitude ≥ 5° at sunset. Designed as a global unification standard.",
    globalStandard: "Global (Moon Above Horizon):",
    globalStandardDesc: "The simplest check — is the moon above the horizon at sunset? While the moon being above the horizon is necessary for any sighting, it is not sufficient alone. The moon may be above the horizon but too close to the sun (low elongation) to actually be seen.",

    dateDiscrepancyTitle: "Why Does This Differ from Official Announcements?",
    dateDiscrepancyP1: "The Hijri dates shown in this app are estimated using the Tabular Islamic Calendar — a mathematical 30-year cycle approximation. This algorithm can differ from official announced dates by 1–2 days.",
    dateDiscrepancyWhyTitle: "Why the difference?",
    dateDiscrepancyB1: "The app's hilal visibility data (altitude, elongation) is accurate astronomy computed for your exact location and time.",
    dateDiscrepancyB2: "But the Hijri date label (e.g., \"2nd Shawwal\") is from a tabular algorithm, not from an actual sighting or official ruling.",
    dateDiscrepancyB3: "Official Islamic month starts in Malaysia/Indonesia are determined by:",
    dateDiscrepancyB3a: "Actual moon sighting by authorized witnesses (or instrument-based confirmation)",
    dateDiscrepancyB3b: "Government/religious committee ruling — even if conditions are mathematically favorable, the official 1st of month is only declared after verification",
    dateDiscrepancyB3c: "Weather and horizon conditions — clouds or haze can prevent sighting even when calculations predict it",
    dateDiscrepancyExampleTitle: "Example — Malaysia Shawwal 1447H (March 2026):",
    dateDiscrepancyExample: "The hilal was astronomically visible from Putrajaya on March 20. This app's tabular algorithm labeled March 21 as \"2nd Shawwal.\" But the Malaysian government, based on actual observation reports and committee ruling, officially declared March 21 as 1st Shawwal — because the official month started only after the 1st was confirmed. Both the calculation AND the announcement are correct; they refer to different things.",
    dateDiscrepancyConclusion: "Trust official announcements for religious practice. Use this app to understand why the moon was or wasn't visible from your location on any given night.",

    // Footer
    footerCalc: "Astronomical calculations powered by",
    footerHijriNote: "Hijri dates are algorithmic estimates.",
    footerDisclaimer: "This app does not declare the start of Ramadan, Eid, or any religious dates as authoritative.",
  },

  id: {
    // Header
    appName: "Hilal Explorer",
    appSubtitle: "Alat Edukasi Rukyatul Hilal",
    switchToLight: "Ganti ke mode terang",
    switchToDark: "Ganti ke mode gelap",

    // Disclaimer
    disclaimer: "Aplikasi ini hanya untuk tujuan edukasi dan tidak menggantikan pengumuman resmi dari otoritas keagamaan mengenai awal bulan Islam.",

    // Controls
    location: "Lokasi",
    settings: "Pengaturan",
    visibilityStandard: "Kriteria Visibilitas",
    timeline: "Linimasa",

    // Tabs
    tabResult: "Hasil",
    tabCompare: "Bandingkan",
    tabLearn: "Pelajari",

    // Empty state
    selectLocation: "Pilih lokasi untuk melihat data visibilitas hilal.",

    // LocationPicker
    detectMyLocation: "Deteksi Lokasi Saya",
    updateMyLocation: "Perbarui Lokasi Saya",
    detecting: "Mendeteksi...",
    orSelectCity: "Atau pilih kota:",
    enterManually: "Masukkan koordinat secara manual",
    locationName: "Nama lokasi (opsional)",
    latitude: "Lintang",
    longitude: "Bujur",
    useCoordinates: "Gunakan Koordinat Ini",
    geoNotSupported: "Geolokasi tidak didukung oleh browser Anda.",
    locationDenied: "Akses lokasi ditolak. Silakan pilih kota atau masukkan koordinat.",
    invalidCoords: "Masukkan koordinat yang valid (lat: -90 hingga 90, lng: -180 hingga 180).",

    // ResultCard
    sunset: "Maghrib",
    moonAlt: "Tinggi Bulan",
    elongation: "Elongasi",
    moonAge: "Umur Bulan",
    illumination: "Iluminasi",
    arcOfVision: "Busur Penglihatan",
    possible: "Mungkin Terlihat",
    notPossible: "Tidak Terlihat",
    hijriTooltip: "Tanggal Hijriyah adalah perkiraan tabulasi dan dapat berbeda dari pengumuman resmi sebesar 1–2 hari. Lihat tab Pelajari untuk detailnya.",

    // ComparisonMode
    compareTitle: "Bandingkan Lokasi",
    compareSubtitle: "Pilih hingga 6 lokasi untuk membandingkan visibilitas hilal",
    location_col: "Lokasi",
    sunsetCol: "Maghrib",
    moonAltCol: "Tinggi Bulan",
    elongationCol: "Elongasi",
    visibilityCol: "Visibilitas",
    yes: "Ya",
    no: "Tidak",
    selectLocationsPrompt: "Pilih lokasi di atas untuk dibandingkan.",

    // TimelineSlider
    moonAltTimeline: "Ketinggian bulan dari waktu ke waktu",
    dayLabel: "Hari",

    // EducationalSection
    learnTitle: "Pelajari Rukyatul Hilal",
    whatIsHilal: "Apa itu Hilal?",
    whatIsHilalP1: "Hilal (هلال) adalah kata Arab untuk bulan sabit tipis yang muncul tak lama setelah bulan baru (konjungsi). Hilal menandai awal setiap bulan dalam kalender Islam (Hijriyah).",
    whatIsHilalP2: "Dalam tradisi Islam, penampakan hilal setelah matahari terbenam menentukan kapan bulan lunar baru dimulai. Inilah mengapa bulan seperti Ramadhan dan Dzulhijjah dapat dimulai pada hari yang berbeda di berbagai negara — tergantung apakah hilal dapat diamati dari lokasi tersebut.",
    whatIsHilalP3: "Hilal berbeda dari bulan baru astronomis. Bulan baru (konjungsi) adalah ketika bulan berada paling dekat dengan matahari di langit dan sama sekali tidak terlihat. Hilal muncul beberapa jam hingga sehari kemudian, ketika bulan telah bergerak cukup jauh dari matahari untuk memantulkan cahaya tipis yang terlihat dengan mata telanjang.",

    whatIsAltitude: "Apa itu Ketinggian Bulan?",
    whatIsAltitudeP1: "Ketinggian (atau elevasi) adalah sudut antara bulan dan cakrawala, diukur dalam derajat. Ketinggian 0° berarti bulan berada di cakrawala, dan 90° berarti tepat di atas kepala.",
    whatIsAltitudeP2: "Untuk rukyatul hilal, ketinggian bulan saat matahari terbenam sangat penting. Jika bulan berada di bawah cakrawala (ketinggian negatif), berarti bulan sudah terbenam dan tidak dapat dilihat. Jika berada di atas cakrawala tetapi terlalu rendah (misalnya 1-2°), kabut atmosfer dan kecerahan dari matahari yang baru saja terbenam membuatnya sangat sulit dilihat.",
    whatIsAltitudeP3: "Sebagian besar kriteria mensyaratkan ketinggian minimum 2-5° di atas cakrawala saat matahari terbenam untuk peluang rukyah yang realistis.",

    whatIsElongation: "Apa itu Elongasi?",
    whatIsElongationP1: "Elongasi adalah jarak sudut (pemisahan) antara matahari dan bulan sebagaimana dilihat dari Bumi, diukur dalam derajat.",
    whatIsElongationP2: "Pada bulan baru (konjungsi), elongasi adalah 0° — bulan tepat berada di samping matahari di langit. Seiring berjalannya jam dan hari setelah konjungsi, bulan bergerak menjauh dari matahari, meningkatkan elongasi.",
    whatIsElongationP3: "Elongasi minimum sekitar 6-8° biasanya diperlukan agar sabit cukup terang untuk terlihat dengan mata telanjang. Semakin lebar elongasi, semakin terang dan tebal sabit yang terlihat, sehingga lebih mudah ditemukan.",

    whyCountriesDiffer: "Mengapa Negara-Negara Berbeda?",
    whyCountriesDifferIntro: "Negara-negara dan komunitas Islam menggunakan metode yang berbeda untuk menentukan awal bulan lunar, itulah mengapa tanggal bisa berbeda:",
    rukyahLabel: "Rukyah fisik (Rukyatul Hilal):",
    rukyahDesc: "Mengharuskan konfirmasi visual langsung dari sabit oleh saksi yang terpercaya. Digunakan secara tradisional dan masih dipraktikkan di Arab Saudi dan lainnya.",
    hisabLabel: "Perhitungan astronomis (Hisab):",
    hisabDesc: "Menggunakan model matematika untuk memprediksi kapan bulan akan terlihat secara teoritis. Negara-negara seperti Malaysia, Indonesia, dan Brunei menggunakan kriteria Imkanur Rukyat.",
    combinedLabel: "Pendekatan gabungan:",
    combinedDesc: "Beberapa negara menggunakan perhitungan astronomis sebagai dasar tetapi masih mensyaratkan upaya rukyah fisik untuk konfirmasi.",
    geographyNote: "Selain itu, geografi lokal berpengaruh: lintang dan bujur yang berbeda berarti posisi bulan relatif terhadap cakrawala bervariasi. Kota di dekat ekuator mungkin dapat melihat hilal sementara kota di lintang lebih tinggi tidak bisa, meski pada malam yang sama.",

    standardsTitle: "Penjelasan Kriteria Visibilitas",
    malaysiaStandard: "Malaysia (Imkanur Rukyat):",
    malaysiaStandardDesc: "Kriteria resmi Malaysia/MABIMS mensyaratkan: ketinggian bulan ≥ 3° dan elongasi ≥ 6.4° saat matahari terbenam. Ini didasarkan pada penelitian puluhan tahun oleh para astronom Malaysia, Indonesia, Brunei, dan Singapura.",
    conservativeStandard: "Konservatif (Rukyah Ketat):",
    conservativeStandardDesc: "Kriteria yang lebih ketat mensyaratkan ketinggian ≥ 5° dan elongasi ≥ 8°. Ini mewakili kondisi di mana sabit lebih dapat diandalkan untuk dilihat oleh pengamat mata telanjang terlatih, khas dari persyaratan rukyah tradisional.",
    istanbulStandard: "Kriteria Istanbul 2016:",
    istanbulStandardDesc: "Diadopsi pada konferensi Penyatuan Kalender Hijriyah OKI (Organisasi Kerjasama Islam) di Istanbul. Mensyaratkan: umur bulan ≥ 9 jam setelah bulan baru, elongasi ≥ 8°, dan ketinggian bulan ≥ 5° saat matahari terbenam. Dirancang sebagai standar penyatuan global.",
    globalStandard: "Global (Bulan di Atas Cakrawala):",
    globalStandardDesc: "Pemeriksaan paling sederhana — apakah bulan berada di atas cakrawala saat matahari terbenam? Meskipun bulan berada di atas cakrawala diperlukan untuk setiap rukyah, hal itu saja tidak cukup. Bulan mungkin berada di atas cakrawala tetapi terlalu dekat dengan matahari (elongasi rendah) sehingga sebenarnya tidak dapat dilihat.",

    dateDiscrepancyTitle: "Mengapa Berbeda dari Pengumuman Resmi?",
    dateDiscrepancyP1: "Tanggal Hijriyah yang ditampilkan dalam aplikasi ini diperkirakan menggunakan Kalender Islam Tabulasi — perkiraan siklus matematis 30 tahun. Algoritma ini dapat berbeda dari tanggal yang diumumkan secara resmi sebesar 1–2 hari.",
    dateDiscrepancyWhyTitle: "Mengapa berbeda?",
    dateDiscrepancyB1: "Data visibilitas hilal aplikasi ini (ketinggian, elongasi) adalah astronomi akurat yang dihitung untuk lokasi dan waktu Anda yang tepat.",
    dateDiscrepancyB2: "Namun label tanggal Hijriyah (mis., \"2 Syawal\") berasal dari algoritma tabulasi, bukan dari rukyah aktual atau keputusan resmi.",
    dateDiscrepancyB3: "Awal bulan Islam resmi di Malaysia/Indonesia ditentukan oleh:",
    dateDiscrepancyB3a: "Rukyah bulan aktual oleh saksi yang berwenang (atau konfirmasi berbasis instrumen)",
    dateDiscrepancyB3b: "Keputusan komite pemerintah/keagamaan — meskipun kondisi secara matematis menguntungkan, 1 Syawal resmi hanya dinyatakan setelah verifikasi",
    dateDiscrepancyB3c: "Kondisi cuaca dan cakrawala — awan atau kabut dapat mencegah rukyah meskipun perhitungan memprediksinya",
    dateDiscrepancyExampleTitle: "Contoh — Syawal 1447H Malaysia (Maret 2026):",
    dateDiscrepancyExample: "Hilal secara astronomis terlihat dari Putrajaya pada 20 Maret. Algoritma tabulasi aplikasi ini memberi label 21 Maret sebagai \"2 Syawal.\" Namun pemerintah Malaysia, berdasarkan laporan rukyah aktual dan keputusan komite, secara resmi menyatakan 21 Maret sebagai 1 Syawal — karena bulan resmi baru dimulai setelah 1 Syawal dikonfirmasi. Baik perhitungan MAUPUN pengumuman adalah benar; keduanya merujuk pada hal yang berbeda.",
    dateDiscrepancyConclusion: "Percayakan pengumuman resmi untuk praktik keagamaan. Gunakan aplikasi ini untuk memahami mengapa bulan terlihat atau tidak terlihat dari lokasi Anda pada malam tertentu.",

    // Footer
    footerCalc: "Perhitungan astronomis didukung oleh",
    footerHijriNote: "Tanggal Hijriyah adalah perkiraan algoritmik.",
    footerDisclaimer: "Aplikasi ini tidak menyatakan awal Ramadhan, Lebaran, atau tanggal keagamaan apa pun sebagai otoritatif.",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => translations.en[key],
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const stored = localStorage.getItem("hilal-lang");
      if (stored === "en" || stored === "id") return stored;
    } catch {}
    return "en";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("hilal-lang", l); } catch {}
  };

  const t = (key: TranslationKey): string => translations[lang][key] as string;

  return createElement(LanguageContext.Provider, { value: { lang, setLang, t } }, children);
}

export function useLanguage() {
  return useContext(LanguageContext);
}
