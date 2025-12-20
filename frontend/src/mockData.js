// Mock data for sahibinden.com clone

export const categories = [
  {
    id: 1,
    name: "Emlak",
    slug: "emlak",
    icon: "Home",
    subCategories: [
      { id: 11, name: "Konut", slug: "konut" },
      { id: 12, name: "İş Yeri", slug: "is-yeri" },
      { id: 13, name: "Arsa", slug: "arsa" },
      { id: 14, name: "Bina", slug: "bina" },
      { id: 15, name: "Turistik Tesis", slug: "turistik-tesis" }
    ]
  },
  {
    id: 2,
    name: "Vasıta",
    slug: "vasita",
    icon: "Car",
    subCategories: [
      { id: 21, name: "Otomobil", slug: "otomobil" },
      { id: 22, name: "Arazi, SUV & Pickup", slug: "arazi-suv-pickup" },
      { id: 23, name: "Motosiklet", slug: "motosiklet" },
      { id: 24, name: "Minivan & Panelvan", slug: "minivan-panelvan" },
      { id: 25, name: "Ticari Araçlar", slug: "ticari-araclar" }
    ]
  },
  {
    id: 3,
    name: "Yedek Parça, Aksesuar",
    slug: "yedek-parca",
    icon: "Wrench",
    subCategories: [
      { id: 31, name: "Otomotiv Ekipmanları", slug: "otomotiv" },
      { id: 32, name: "Motosiklet Ekipmanları", slug: "motosiklet" },
      { id: 33, name: "Deniz Araçları", slug: "deniz" }
    ]
  },
  {
    id: 4,
    name: "İkinci El ve Sıfır Alışveriş",
    slug: "ikinci-el",
    icon: "ShoppingBag",
    subCategories: [
      { id: 41, name: "Bilgisayar", slug: "bilgisayar" },
      { id: 42, name: "Cep Telefonu", slug: "telefon" },
      { id: 43, name: "Fotoğraf", slug: "fotograf" },
      { id: 44, name: "Ev ve Bahçe", slug: "ev-bahce" },
      { id: 45, name: "Giyim & Aksesuar", slug: "giyim" },
      { id: 46, name: "Kitap, Dergi & Film", slug: "kitap" },
      { id: 47, name: "Spor", slug: "spor" }
    ]
  },
  {
    id: 5,
    name: "İş Makineleri & Sanayi",
    slug: "is-makineleri",
    icon: "Factory",
    subCategories: [
      { id: 51, name: "İş Makineleri", slug: "is-makineleri" },
      { id: 52, name: "Tarım Makineleri", slug: "tarim" },
      { id: 53, name: "Sanayi", slug: "sanayi" }
    ]
  },
  {
    id: 6,
    name: "Ustalar ve Hizmetler",
    slug: "ustalar",
    icon: "Briefcase",
    subCategories: [
      { id: 61, name: "Ev Tadilat & Dekorasyon", slug: "tadilat" },
      { id: 62, name: "Nakliyat", slug: "nakliyat" },
      { id: 63, name: "Özel Ders", slug: "ozel-ders" },
      { id: 64, name: "Sağlık", slug: "saglik" }
    ]
  },
  {
    id: 7,
    name: "Özel Ders Verenler",
    slug: "ozel-ders",
    icon: "GraduationCap",
    subCategories: [
      { id: 71, name: "Lise Dersleri", slug: "lise" },
      { id: 72, name: "Üniversite Dersleri", slug: "universite" },
      { id: 73, name: "Yabancı Dil", slug: "yabanci-dil" }
    ]
  },
  {
    id: 8,
    name: "Hayvanlar Alemi",
    slug: "hayvanlar",
    icon: "Dog",
    subCategories: [
      { id: 81, name: "Kedi", slug: "kedi" },
      { id: 82, name: "Köpek", slug: "kopek" },
      { id: 83, name: "Kuş", slug: "kus" },
      { id: 84, name: "Akvaryum", slug: "akvaryum" }
    ]
  },
  {
    id: 9,
    name: "İş İlanları",
    slug: "is-ilanlari",
    icon: "Newspaper",
    subCategories: [
      { id: 91, name: "Tam Zamanlı", slug: "tam-zamanli" },
      { id: 92, name: "Yarı Zamanlı", slug: "yari-zamanli" },
      { id: 93, name: "Staj", slug: "staj" }
    ]
  }
];

export const cities = [
  "İstanbul", "Ankara", "İzmir", "Antalya", "Bursa", "Adana", "Gaziantep",
  "Konya", "Kayseri", "Mersin", "Diyarbakır", "Eskişehir", "Samsun",
  "Denizli", "Şanlıurfa", "Adapazarı", "Malatya", "Kahramanmaraş",
  "Erzurum", "Van", "Elazığ", "Batman", "Gebze", "Manisa", "Balıkesir"
];

export const mockListings = [
  {
    id: 1,
    title: "Bahçelievler'de Satılık 3+1 Daire",
    price: 3500000,
    currency: "TL",
    category: "Emlak",
    subCategory: "Konut",
    location: "İstanbul / Bahçelievler",
    date: "2024-12-15",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"
    ],
    description: "Bahçelievler'de merkezi konumda, 3+1, 120 m², 5. kat, asansörlü, otoparklı satılık daire.",
    views: 245,
    featured: true,
    seller: {
      name: "Ahmet Yılmaz",
      phone: "0532 xxx xx xx",
      verified: true
    },
    details: {
      "Oda Sayısı": "3+1",
      "Metrekare": "120 m²",
      "Bina Yaşı": "10-15",
      "Kat": "5",
      "Isıtma": "Kombi",
      "Balkon": "Var",
      "Asansör": "Var",
      "Otopark": "Var"
    }
  },
  {
    id: 2,
    title: "2020 Model Volkswagen Golf 1.5 TSI Highline",
    price: 1250000,
    currency: "TL",
    category: "Vasıta",
    subCategory: "Otomobil",
    location: "Ankara / Çankaya",
    date: "2024-12-18",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400",
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800"
    ],
    description: "2020 model Volkswagen Golf, 45.000 km'de, hatasız, boyasız, tek elden.",
    views: 428,
    featured: true,
    seller: {
      name: "Mehmet Demir",
      phone: "0533 xxx xx xx",
      verified: true
    },
    details: {
      "Model Yılı": "2020",
      "Kilometre": "45.000 km",
      "Vites": "Otomatik",
      "Motor Gücü": "1.5 TSI",
      "Yakıt Tipi": "Benzin",
      "Renk": "Gri",
      "Durum": "İkinci El"
    }
  },
  {
    id: 3,
    title: "iPhone 15 Pro Max 256GB Titanyum",
    price: 68000,
    currency: "TL",
    category: "İkinci El ve Sıfır Alışveriş",
    subCategory: "Cep Telefonu",
    location: "İzmir / Bornova",
    date: "2024-12-19",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800"
    ],
    description: "Sıfır ayarında iPhone 15 Pro Max, kutulu, garantili, hiç kullanılmadı.",
    views: 567,
    featured: false,
    seller: {
      name: "Ayşe Kara",
      phone: "0535 xxx xx xx",
      verified: false
    },
    details: {
      "Marka": "Apple",
      "Model": "iPhone 15 Pro Max",
      "Hafıza": "256 GB",
      "Renk": "Titanyum",
      "Garanti": "Var",
      "Durum": "Sıfır Ayarında"
    }
  },
  {
    id: 4,
    title: "Kadıköy'de Kiralık 2+1 Daire",
    price: 25000,
    currency: "TL",
    category: "Emlak",
    subCategory: "Konut",
    location: "İstanbul / Kadıköy",
    date: "2024-12-17",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
    ],
    description: "Kadıköy merkezde, deniz manzaralı, eşyalı kiralık 2+1 daire.",
    views: 189,
    featured: false,
    seller: {
      name: "Fatma Öztürk",
      phone: "0536 xxx xx xx",
      verified: true
    },
    details: {
      "Oda Sayısı": "2+1",
      "Metrekare": "90 m²",
      "Bina Yaşı": "5-10",
      "Kat": "8",
      "Eşya": "Eşyalı",
      "Aidat": "1.500 TL"
    }
  },
  {
    id: 5,
    title: "2019 Honda Civic 1.6 Eco Executive",
    price: 890000,
    currency: "TL",
    category: "Vasıta",
    subCategory: "Otomobil",
    location: "İstanbul / Beşiktaş",
    date: "2024-12-16",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400",
    images: [
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800"
    ],
    description: "2019 Honda Civic, full + full, 65.000 km, garaj aracı.",
    views: 312,
    featured: true,
    seller: {
      name: "Hasan Çelik",
      phone: "0542 xxx xx xx",
      verified: true
    },
    details: {
      "Model Yılı": "2019",
      "Kilometre": "65.000 km",
      "Vites": "Otomatik",
      "Motor Gücü": "1.6",
      "Yakıt Tipi": "Dizel"
    }
  },
  {
    id: 6,
    title: "MacBook Pro 14 M3 Pro 18GB 512GB",
    price: 85000,
    currency: "TL",
    category: "İkinci El ve Sıfır Alışveriş",
    subCategory: "Bilgisayar",
    location: "Ankara / Kızılay",
    date: "2024-12-18",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800"\n    ],
    description: "2024 MacBook Pro 14, M3 Pro chip, 18GB RAM, 512GB SSD, garantili.",
    views: 423,
    featured: false,
    seller: {
      name: "Ali Yıldız",
      phone: "0544 xxx xx xx",
      verified: true
    },
    details: {
      "Marka": "Apple",
      "İşlemci": "M3 Pro",
      "RAM": "18 GB",
      "Depolama": "512 GB SSD",
      "Ekran": "14 inç",
      "Garanti": "Var"
    }
  },
  {
    id: 7,
    title: "British Shorthair Safkan Kedi",
    price: 15000,
    currency: "TL",
    category: "Hayvanlar Alemi",
    subCategory: "Kedi",
    location: "İstanbul / Sarıyer",
    date: "2024-12-19",
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400",
    images: [
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800"
    ],
    description: "3 aylık British Shorthair, aşılı, pasaportlu, pedigree'li.",
    views: 156,
    featured: false,
    seller: {
      name: "Zeynep Aydın",
      phone: "0538 xxx xx xx",
      verified: false
    },
    details: {
      "Irk": "British Shorthair",
      "Yaş": "3 aylık",
      "Cinsiyet": "Erkek",
      "Aşı": "Tam",
      "Pedigree": "Var"
    }
  },
  {
    id: 8,
    title: "Çankaya'da Satılık Dükkan",
    price: 5500000,
    currency: "TL",
    category: "Emlak",
    subCategory: "İş Yeri",
    location: "Ankara / Çankaya",
    date: "2024-12-15",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
    ],
    description: "İşlek caddede, 80 m², kiracılı satılık dükkan.",
    views: 278,
    featured: true,
    seller: {
      name: "Mustafa Şahin",
      phone: "0545 xxx xx xx",
      verified: true
    },
    details: {
      "Metrekare": "80 m²",
      "Kat": "Giriş Kat",
      "Durum": "Kiracılı",
      "Isıtma": "Klima"
    }
  }
];

// Generate more listings for pagination
for (let i = 9; i <= 50; i++) {
  const categoryIndex = i % categories.length;
  const category = categories[categoryIndex];
  const subCategory = category.subCategories[0];
  const cityIndex = i % cities.length;
  
  mockListings.push({
    id: i,
    title: `${category.name} İlanı #${i}`,
    price: Math.floor(Math.random() * 5000000) + 10000,
    currency: "TL",
    category: category.name,
    subCategory: subCategory.name,
    location: `${cities[cityIndex]} / Merkez`,
    date: `2024-12-${String(Math.floor(Math.random() * 20) + 1).padStart(2, '0')}`,
    image: `https://images.unsplash.com/photo-${1500000000000 + i}?w=400`,
    images: [`https://images.unsplash.com/photo-${1500000000000 + i}?w=800`],
    description: `${category.name} kategorisinde ${subCategory.name} ilanı.`,
    views: Math.floor(Math.random() * 1000),
    featured: i % 5 === 0,
    seller: {
      name: `Satıcı ${i}`,
      phone: "0532 xxx xx xx",
      verified: i % 3 === 0
    },
    details: {
      "Kategori": category.name,
      "Alt Kategori": subCategory.name,
      "Durum": i % 2 === 0 ? "Çok İyi" : "İyi"
    }
  });
}

export const userListings = [
  mockListings[0],
  mockListings[3],
  mockListings[7]
];

export const favoriteListings = [
  mockListings[1],
  mockListings[2],
  mockListings[5]
];
