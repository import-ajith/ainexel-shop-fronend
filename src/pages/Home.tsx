import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { ProductFilters } from '@/components/ProductFilters';
import { products } from '@/data/products';
import { FilterOptions } from '@/types';

export default function Home() {
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All',
    priceRange: [0, 3000],
    inStock: false,
    sortBy: 'name',
    searchQuery: '',
  });

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const categoryMatch = filters.category === 'All' || product.category === filters.category;
      const priceMatch = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      const stockMatch = !filters.inStock || product.inStock;
      const searchMatch = !filters.searchQuery || 
        product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.searchQuery.toLowerCase());

      return categoryMatch && priceMatch && stockMatch && searchMatch;
    });

    // Sort products
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.reverse();
        break;
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [filters]);

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white py-20">
        <div className="container-width section-padding">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Shop the Future
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Discover premium electronics and cutting-edge technology at unbeatable prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Shop Now
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View Categories
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-secondary/50">
        <div className="container-width section-padding">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">1000+</h3>
              <p className="text-muted-foreground">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">4.8</h3>
              <p className="text-muted-foreground">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">99%</h3>
              <p className="text-muted-foreground">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container-width section-padding">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Discover our best-selling items</p>
            </div>
            <Link to="/products">
              <Button variant="outline">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-8">
            <ProductFilters
              filters={filters}
              onFiltersChange={setFilters}
              className="lg:w-80"
            />

            {/* Products Grid */}
            <div className="flex-1">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-muted-foreground">
                  Showing {filteredAndSortedProducts.length} products
                </p>
              </div>
              
              {filteredAndSortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">No products found matching your filters.</p>
                  <Button
                    onClick={() => setFilters({
                      category: 'All',
                      priceRange: [0, 3000],
                      inStock: false,
                      sortBy: 'name',
                      searchQuery: '',
                    })}
                    variant="outline"
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}