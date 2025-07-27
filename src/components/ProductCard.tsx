import { Star, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  size?: 'small' | 'medium' | 'large';
}

export const ProductCard = ({ product, size = 'medium' }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'h-auto',
          image: 'aspect-[4/3]',
          title: 'text-sm font-medium',
          description: 'text-xs',
          price: 'text-lg',
          padding: 'p-3',
          spacing: 'space-y-2',
        };
      case 'large':
        return {
          container: 'h-auto',
          image: 'aspect-[4/3]',
          title: 'text-xl font-semibold',
          description: 'text-base',
          price: 'text-2xl',
          padding: 'p-6',
          spacing: 'space-y-4',
        };
      default: // medium
        return {
          container: 'h-auto',
          image: 'aspect-[4/3]',
          title: 'text-lg font-semibold',
          description: 'text-sm',
          price: 'text-xl',
          padding: 'p-4',
          spacing: 'space-y-3',
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="product-card group h-full">
        {/* Image Container */}
        <div className={`relative ${sizeClasses.image} overflow-hidden`}>
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.originalPrice && (
            <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
              Sale
            </Badge>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary">Out of Stock</Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className={`${sizeClasses.padding} ${sizeClasses.spacing}`}>
          {/* Category */}
          {size !== 'small' && (
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
          )}

          {/* Title */}
          <h3 className={`${sizeClasses.title} leading-tight group-hover:text-primary transition-colors`}>
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex">{renderStars(product.rating)}</div>
            {size !== 'small' && (
              <span className="text-sm text-muted-foreground">
                ({product.reviews})
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className={`${sizeClasses.price} font-bold text-primary`}>
              ${product.price}
            </span>
            {product.originalPrice && size !== 'small' && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {/* Description */}
          {size !== 'small' && (
            <p className={`${sizeClasses.description} text-muted-foreground line-clamp-2`}>
              {product.description}
            </p>
          )}

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full btn-primary"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
};