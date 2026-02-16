import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { mockListings, categories, cities } from '../mockData';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { ChevronDown, ChevronUp, Grid, List, SlidersHorizontal } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ListingsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { categorySlug } = useParams();
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(true);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(categorySlug || 'all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [onlyFeatured, setOnlyFeatured] = useState(false);

  const searchQuery = searchParams.get('q') || '';

  // Get category name from slug
  const getCategoryName = () => {
    if (!categorySlug) return null;
    const category = categories.find(c => c.slug === categorySlug);
    return category ? category.name : null;
  };

  // Filter listings
  const getFilteredListings = () => {
    let filtered = [...mockListings];

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    const categoryName = getCategoryName();
    if (categoryName) {
      filtered = filtered.filter(listing => listing.category === categoryName);
    } else if (selectedCategory !== 'all') {
      const category = categories.find(c => c.slug === selectedCategory);
      if (category) {
        filtered = filtered.filter(listing => listing.category === category.name);
      }
    }

    // City filter
    if (selectedCity !== 'all') {
      filtered = filtered.filter(listing => listing.location.includes(selectedCity));
    }

    // Price range filter
    filtered = filtered.filter(listing =>
      listing.price >= priceRange[0] && listing.price <= priceRange[1]
    );

    // Featured filter
    if (onlyFeatured) {
      filtered = filtered.filter(listing => listing.featured);
    }

    // Sort
    switch (sortBy) {
      case 'date':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'views':
        filtered.sort((a, b) => b.views - a.views);
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredListings = getFilteredListings();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            {getCategoryName() || (searchQuery ? `"${searchQuery}" results` : 'All Ads')}
          </h1>
          <p className="text-gray-600">{filteredListings.length} listing found</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 flex-shrink-0 ${showFilters ? '' : 'hidden lg:block'}`}>
            <Card className="sticky top-24">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filter
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedCity('all');
                      setPriceRange([0, 10000000]);
                      setOnlyFeatured(false);
                    }}
                  >
                    Clear
                  </Button>
                </div>

                {/* Category Filter */}
                {!categorySlug && (
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categoryler" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categoryler</SelectItem>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.slug}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* City Filter */}
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">City</label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Cityler" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cityler</SelectItem>
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Filter */}
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">Price Range</label>
                  <div className="space-y-3">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={10000000}
                      step={10000}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{priceRange[0].toLocaleString('tr-TR')} TL</span>
                      <span>{priceRange[1].toLocaleString('tr-TR')} TL</span>
                    </div>
                  </div>
                </div>

                {/* Featured Filter */}
                <div className="mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyFeatured}
                      onChange={(e) => setOnlyFeatured(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-[#FFD100] focus:ring-[#FFD100]"
                    />
                    <span className="text-sm">Only Featured Adsı</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Listings */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg p-4 mb-4 flex flex-wrap items-center justify-between gap-4">
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filterr
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Newest</SelectItem>
                    <SelectItem value="price-asc">Price (Ascending)</SelectItem>
                    <SelectItem value="price-desc">Price (Descending)</SelectItem>
                    <SelectItem value="views">En Çok Viewnen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-[#FFD100] text-black hover:bg-[#FFD100]/90' : ''}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-[#FFD100] text-black hover:bg-[#FFD100]/90' : ''}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Listings Grid/List */}
            {filteredListings.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <p className="text-gray-500 text-lg">Ad not found</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
                {filteredListings.map((listing) => (
                  <Card
                    key={listing.id}
                    className={`cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden group ${
                      viewMode === 'list' ? 'flex flex-row' : ''
                    }`}
                    onClick={() => navigate(`/listing/${listing.id}`)}
                  >
                    <div className={`relative overflow-hidden ${
                      viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-[4/3]'
                    }`}>
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {listing.featured && (
                        <Badge className="absolute top-2 left-2 bg-[#FFD100] text-black hover:bg-[#FFD100]/90">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="text-xs text-gray-500 mb-1">{listing.category}</div>
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                        {listing.title}
                      </h3>
                      <p className="text-lg font-bold text-[#FFD100] mb-2">
                        {listing.price.toLocaleString('tr-TR')} {listing.currency}
                      </p>
                      <p className="text-sm text-gray-500">{listing.location}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-400">{listing.date}</p>
                        <p className="text-xs text-gray-400">{listing.views} views</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ListingsPage;
