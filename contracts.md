# sahibinden.com Clone - Backend Integration Contracts

## 1. API Endpoints

### Authentication
- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/verify-sms` - SMS doğrulama
- `POST /api/auth/logout` - Çıkış
- `GET /api/auth/me` - Mevcut kullanıcı bilgileri

### Listings (İlanlar)
- `GET /api/listings` - Tüm ilanları listele (filtreleme, sıralama, pagination)
- `GET /api/listings/:id` - Tek ilan detayı
- `POST /api/listings` - Yeni ilan oluştur
- `PUT /api/listings/:id` - İlan güncelle
- `DELETE /api/listings/:id` - İlan sil
- `GET /api/listings/category/:slug` - Kategoriye göre ilanlar
- `GET /api/listings/search?q=query` - İlan arama
- `POST /api/listings/:id/view` - İlan görüntüleme sayısını artır

### Categories
- `GET /api/categories` - Tüm kategoriler

### Favorites
- `GET /api/favorites` - Kullanıcının favori ilanları
- `POST /api/favorites/:listingId` - Favorilere ekle
- `DELETE /api/favorites/:listingId` - Favorilerden çıkar

### User
- `GET /api/user/profile` - Kullanıcı profili
- `PUT /api/user/profile` - Profil güncelle
- `GET /api/user/listings` - Kullanıcının ilanları

### Image Upload
- `POST /api/upload` - Görsel yükleme (multipart/form-data)

## 2. Data Models

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String (unique),
  password: String (hashed),
  verified: Boolean,
  verificationCode: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Listing
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  price: Number,
  currency: String,
  category: String,
  subCategory: String,
  city: String,
  location: String,
  images: [String], // URLs
  featured: Boolean,
  views: Number,
  details: Object, // Key-value pairs
  userId: ObjectId (ref: User),
  status: String (active/pending/sold),
  createdAt: Date,
  updatedAt: Date
}
```

### Favorite
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  listingId: ObjectId (ref: Listing),
  createdAt: Date
}
```

## 3. Mock Data Replacement

### mockData.js içindeki veriler:
- `categories` - Statik kalacak (değişmeyecek)
- `cities` - Statik kalacak
- `mockListings` - Backend'den gelecek (GET /api/listings)
- `userListings` - Backend'den gelecek (GET /api/user/listings)
- `favoriteListings` - Backend'den gelecek (GET /api/favorites)

### Frontend'de değiştirilecek dosyalar:
1. **HomePage.jsx** - API'den featured listings çek
2. **ListingsPage.jsx** - API'den filtrelenmiş listings çek
3. **ListingDetailPage.jsx** - API'den tek listing detayı çek
4. **CreateListingPage.jsx** - POST isteği ile yeni listing oluştur
5. **ProfilePage.jsx** - User's listings API'den çek
6. **FavoritesPage.jsx** - Favorites API'den çek
7. **LoginPage.jsx** - POST /api/auth/login
8. **RegisterPage.jsx** - POST /api/auth/register ve SMS verification

## 4. Authentication Flow

### Kayıt (Register):
1. Kullanıcı form doldurur
2. POST /api/auth/register (email, phone, password, name)
3. Backend SMS kodu gönderir (mock)
4. Kullanıcı kodu girer
5. POST /api/auth/verify-sms (phone, code)
6. Backend JWT token döner
7. Token localStorage'a kaydedilir
8. Kullanıcı login sayfasına yönlendirilir

### Giriş (Login):
1. Kullanıcı email/password girer
2. POST /api/auth/login
3. Backend JWT token döner
4. Token localStorage'a kaydedilir
5. Kullanıcı hesabım sayfasına yönlendirilir

### Protected Routes:
- İlan Ver
- Hesabım
- İlan Düzenle
- Favoriler

## 5. Image Upload Strategy

### Chunked Upload:
- Büyük dosyaları chunk'lara böl (2MB)
- Her chunk'ı ayrı POST isteği ile gönder
- Backend chunk'ları birleştir
- Final URL döner
- Uploads dizinine kaydet: `/app/backend/uploads/`

## 6. Filter & Search Implementation

### Listing Query Parameters:
```
GET /api/listings?
  category=emlak
  &city=istanbul
  &minPrice=100000
  &maxPrice=5000000
  &sortBy=date
  &order=desc
  &page=1
  &limit=20
  &featured=true
  &q=daire
```

## 7. Environment Variables

### Backend .env:
```
MONGO_URL=existing
DB_NAME=sahibinden_clone
JWT_SECRET=generate_random_secret
PORT=8001
```

## 8. Integration Steps

### Phase 1: Authentication
1. Backend auth endpoints oluştur
2. JWT middleware ekle
3. Frontend'de AuthContext oluştur
4. Login/Register sayfalarını bağla

### Phase 2: Listings CRUD
1. Listing model ve endpoints
2. Image upload endpoint
3. CreateListingPage API entegrasyonu
4. ListingsPage API entegrasyonu
5. ListingDetailPage API entegrasyonu

### Phase 3: User Features
1. Profile endpoints
2. Favorites endpoints
3. User listings endpoints
4. ProfilePage entegrasyonu
5. FavoritesPage entegrasyonu

### Phase 4: Search & Filter
1. Advanced query builder
2. Pagination
3. Sorting
4. ListingsPage filter entegrasyonu

## 9. Testing Points

- Kullanıcı kaydı ve SMS doğrulama
- Giriş/Çıkış
- İlan oluşturma (görsel yükleme ile)
- İlan listeleme (filtreleme, sıralama)
- İlan detay görüntüleme
- İlan düzenleme/silme
- Favorilere ekleme/çıkarma
- Profil güncelleme

## 10. Performance Considerations

- Image compression/resize before upload
- Pagination (20 items per page)
- Index on frequently queried fields (category, city, price)
- Cache categories and cities
- Lazy load images on frontend
