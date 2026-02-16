// Mock data for fromowner.ca

export const categories = [
  {
    id: 1,
    name: "Real Estate",
    slug: "real-estate",
    icon: "Home",
    subCategories: [
      { id: 11, name: "Houses", slug: "houses" },
      { id: 12, name: "Condos", slug: "condos" },
      { id: 13, name: "Land", slug: "land" },
      { id: 14, name: "Commercial", slug: "commercial" },
      { id: 15, name: "Vacation Properties", slug: "vacation" }
    ]
  },
  {
    id: 2,
    name: "Vehicles",
    slug: "vehicles",
    icon: "Car",
    subCategories: [
      { id: 21, name: "Cars", slug: "cars" },
      { id: 22, name: "Trucks & SUVs", slug: "trucks-suvs" },
      { id: 23, name: "Motorcycles", slug: "motorcycles" },
      { id: 24, name: "RVs & Campers", slug: "rvs-campers" },
      { id: 25, name: "Boats", slug: "boats" }
    ]
  },
  {
    id: 3,
    name: "Auto Parts",
    slug: "auto-parts",
    icon: "Wrench",
    subCategories: [
      { id: 31, name: "Car Parts", slug: "car-parts" },
      { id: 32, name: "Motorcycle Parts", slug: "motorcycle-parts" },
      { id: 33, name: "Marine Parts", slug: "marine-parts" }
    ]
  },
  {
    id: 4,
    name: "Buy & Sell",
    slug: "buy-sell",
    icon: "ShoppingBag",
    subCategories: [
      { id: 41, name: "Electronics", slug: "electronics" },
      { id: 42, name: "Cell Phones", slug: "phones" },
      { id: 43, name: "Cameras", slug: "cameras" },
      { id: 44, name: "Home & Garden", slug: "home-garden" },
      { id: 45, name: "Clothing", slug: "clothing" },
      { id: 46, name: "Books & Media", slug: "books" },
      { id: 47, name: "Sports", slug: "sports" }
    ]
  },
  {
    id: 5,
    name: "Business & Industrial",
    slug: "business-industrial",
    icon: "Factory",
    subCategories: [
      { id: 51, name: "Heavy Equipment", slug: "heavy-equipment" },
      { id: 52, name: "Farm Equipment", slug: "farm-equipment" },
      { id: 53, name: "Industrial", slug: "industrial" }
    ]
  },
  {
    id: 6,
    name: "Services",
    slug: "services",
    icon: "Briefcase",
    subCategories: [
      { id: 61, name: "Home Renovation", slug: "renovation" },
      { id: 62, name: "Moving", slug: "moving" },
      { id: 63, name: "Tutoring", slug: "tutoring" },
      { id: 64, name: "Healthcare", slug: "healthcare" }
    ]
  },
  {
    id: 7,
    name: "Pets",
    slug: "pets",
    icon: "Dog",
    subCategories: [
      { id: 71, name: "Dogs", slug: "dogs" },
      { id: 72, name: "Cats", slug: "cats" },
      { id: 73, name: "Birds", slug: "birds" },
      { id: 74, name: "Fish & Aquariums", slug: "fish" }
    ]
  },
  {
    id: 8,
    name: "Jobs",
    slug: "jobs",
    icon: "Newspaper",
    subCategories: [
      { id: 81, name: "Full-Time", slug: "full-time" },
      { id: 82, name: "Part-Time", slug: "part-time" },
      { id: 83, name: "Contract", slug: "contract" }
    ]
  }
];

export const cities = [
  "Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton",
  "Winnipeg", "Quebec City", "Hamilton", "Kitchener", "London", "Victoria",
  "Halifax", "Oshawa", "Windsor", "Saskatoon", "Regina", "St. John's",
  "Barrie", "Kelowna", "Abbotsford", "Kingston", "Guelph", "Sudbury"
];

export const mockListings = [
  {
    id: 1,
    title: "Beautiful 3BR House in Downtown Toronto",
    price: 850000,
    currency: "CAD",
    category: "Real Estate",
    subCategory: "Houses",
    location: "Toronto, ON",
    date: "2024-12-15",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"
    ],
    description: "Stunning 3-bedroom house in prime downtown location. 2,000 sq ft, renovated kitchen, hardwood floors throughout.",
    views: 245,
    featured: true,
    seller: {
      name: "John Smith",
      phone: "+1 416-555-0100",
      verified: true
    },
    details: {
      "Bedrooms": "3",
      "Bathrooms": "2",
      "Square Feet": "2,000 sq ft",
      "Year Built": "1995",
      "Heating": "Gas",
      "Parking": "2 spots",
      "Property Type": "Detached"
    }
  },
  {
    id: 2,
    title: "2020 Honda Civic EX - Low Mileage",
    price: 24500,
    currency: "CAD",
    category: "Vehicles",
    subCategory: "Cars",
    location: "Vancouver, BC",
    date: "2024-12-18",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400",
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800"
    ],
    description: "2020 Honda Civic, only 25,000 km, accident-free, one owner. Excellent condition.",
    views: 428,
    featured: true,
    seller: {
      name: "Mike Johnson",
      phone: "+1 604-555-0200",
      verified: true
    },
    details: {
      "Year": "2020",
      "Mileage": "25,000 km",
      "Transmission": "Automatic",
      "Engine": "2.0L",
      "Fuel Type": "Gasoline",
      "Color": "Silver",
      "Condition": "Excellent"
    }
  },
  {
    id: 3,
    title: "iPhone 15 Pro Max 256GB - Like New",
    price: 1400,
    currency: "CAD",
    category: "Buy & Sell",
    subCategory: "Cell Phones",
    location: "Montreal, QC",
    date: "2024-12-19",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800"
    ],
    description: "Like new iPhone 15 Pro Max, still under warranty, comes with original box and accessories.",
    views: 567,
    featured: false,
    seller: {
      name: "Sarah Williams",
      phone: "+1 514-555-0300",
      verified: false
    },
    details: {
      "Brand": "Apple",
      "Model": "iPhone 15 Pro Max",
      "Storage": "256 GB",
      "Color": "Titanium",
      "Warranty": "Yes",
      "Condition": "Like New"
    }
  },
  {
    id: 4,
    title: "Luxury 2BR Condo - Waterfront View",
    price: 3500,
    currency: "CAD",
    category: "Real Estate",
    subCategory: "Condos",
    location: "Toronto, ON",
    date: "2024-12-17",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
    ],
    description: "Stunning 2-bedroom condo with lake view, fully furnished, available immediately.",
    views: 189,
    featured: false,
    seller: {
      name: "Robert Brown",
      phone: "+1 416-555-0400",
      verified: true
    },
    details: {
      "Bedrooms": "2",
      "Bathrooms": "2",
      "Square Feet": "1,200 sq ft",
      "Floor": "18th",
      "Furnished": "Yes",
      "Parking": "1 spot",
      "Maintenance Fee": "$650/month"
    }
  },
  {
    id: 5,
    title: "2019 Toyota RAV4 AWD - Certified",
    price: 28900,
    currency: "CAD",
    category: "Vehicles",
    subCategory: "Trucks & SUVs",
    location: "Calgary, AB",
    date: "2024-12-16",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400",
    images: [
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800"
    ],
    description: "2019 Toyota RAV4 AWD, certified pre-owned, 45,000 km, excellent condition.",
    views: 312,
    featured: true,
    seller: {
      name: "David Lee",
      phone: "+1 403-555-0500",
      verified: true
    },
    details: {
      "Year": "2019",
      "Mileage": "45,000 km",
      "Transmission": "Automatic",
      "Engine": "2.5L",
      "Fuel Type": "Gasoline",
      "Drive": "AWD"
    }
  },
  {
    id: 6,
    title: "MacBook Pro 14 M3 Pro 18GB 512GB",
    price: 2800,
    currency: "CAD",
    category: "Buy & Sell",
    subCategory: "Electronics",
    location: "Ottawa, ON",
    date: "2024-12-18",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800"
    ],
    description: "2024 MacBook Pro 14, M3 Pro chip, 18GB RAM, 512GB SSD, under warranty.",
    views: 423,
    featured: false,
    seller: {
      name: "Emily Chen",
      phone: "+1 613-555-0600",
      verified: true
    },
    details: {
      "Brand": "Apple",
      "Processor": "M3 Pro",
      "RAM": "18 GB",
      "Storage": "512 GB SSD",
      "Screen": "14 inch",
      "Warranty": "Yes"
    }
  },
  {
    id: 7,
    title: "Purebred British Shorthair Kitten",
    price: 1200,
    currency: "CAD",
    category: "Pets",
    subCategory: "Cats",
    location: "Vancouver, BC",
    date: "2024-12-19",
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400",
    images: [
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800"
    ],
    description: "3-month-old British Shorthair, vaccinated, registered, comes with pedigree papers.",
    views: 156,
    featured: false,
    seller: {
      name: "Jessica Taylor",
      phone: "+1 604-555-0700",
      verified: false
    },
    details: {
      "Breed": "British Shorthair",
      "Age": "3 months",
      "Gender": "Male",
      "Vaccinated": "Yes",
      "Registered": "Yes"
    }
  },
  {
    id: 8,
    title: "Commercial Space for Lease - Prime Location",
    price: 4500,
    currency: "CAD",
    category: "Real Estate",
    subCategory: "Commercial",
    location: "Toronto, ON",
    date: "2024-12-15",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
    ],
    description: "Prime commercial space on busy street, 1,500 sq ft, perfect for retail or office.",
    views: 278,
    featured: true,
    seller: {
      name: "Michael Anderson",
      phone: "+1 416-555-0800",
      verified: true
    },
    details: {
      "Square Feet": "1,500 sq ft",
      "Floor": "Ground",
      "Zoning": "Commercial",
      "Available": "Immediately"
    }
  }
];

// Generate more listings
for (let i = 9; i <= 50; i++) {
  const categoryIndex = i % categories.length;
  const category = categories[categoryIndex];
  const subCategory = category.subCategories[0];
  const cityIndex = i % cities.length;
  
  mockListings.push({
    id: i,
    title: `${category.name} Listing #${i}`,
    price: Math.floor(Math.random() * 100000) + 500,
    currency: "CAD",
    category: category.name,
    subCategory: subCategory.name,
    location: `${cities[cityIndex]}, ON`,
    date: `2024-12-${String(Math.floor(Math.random() * 20) + 1).padStart(2, '0')}`,
    image: `https://images.unsplash.com/photo-${1500000000000 + i}?w=400`,
    images: [`https://images.unsplash.com/photo-${1500000000000 + i}?w=800`],
    description: `${category.name} listing in ${subCategory.name} category.`,
    views: Math.floor(Math.random() * 1000),
    featured: i % 5 === 0,
    seller: {
      name: `Seller ${i}`,
      phone: `+1 416-555-${String(i).padStart(4, '0')}`,
      verified: i % 3 === 0
    },
    details: {
      "Category": category.name,
      "Subcategory": subCategory.name,
      "Condition": i % 2 === 0 ? "Excellent" : "Good"
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
