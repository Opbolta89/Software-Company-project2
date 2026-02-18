import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Truck, Shield, ArrowLeft, Share2, Ruler, CheckCircle, Sparkles, Loader } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const KisnaProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.store === 'kisna') {
          setProduct(data);
          // Fetch related products
          const allRes = await fetch(`${API_URL}/products`);
          const allProducts = await allRes.json();
          const related = allProducts
            .filter(p => p.category === data.category && p.id !== data.id && p.store === 'kisna')
            .slice(0, 4);
          setRelatedProducts(related);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <Loader className="w-10 h-10 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!product || product.store !== 'kisna') {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <button onClick={() => navigate('/kisna')} className="px-6 py-3 bg-purple-500 text-white rounded hover:bg-purple-600">
            Back to Kisna Store
          </button>
        </div>
      </div>
    );
  }

  const images = product.images || [product.image || product.img];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-purple-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button onClick={() => navigate('/kisna')} className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors mb-2">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Kisna</span>
          </button>
          <div className="flex items-center gap-2 text-sm text-purple-600">
            <span onClick={() => navigate('/')} className="cursor-pointer hover:text-purple-800">Home</span>
            <span>/</span>
            <span onClick={() => navigate('/kisna')} className="cursor-pointer hover:text-purple-800">Kisna</span>
            <span>/</span>
            <span className="text-purple-800 font-medium">{product.name || product.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 group">
              <img
                src={images[selectedImage]}
                alt={product.name || product.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {product.tag && (
                <div className="absolute top-4 left-4 px-4 py-2 bg-purple-500 text-white text-sm font-bold tracking-wider rounded shadow-lg">
                  {product.tag}
                </div>
              )}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-purple-500 hover:text-white transition-all duration-300 shadow-lg"
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                      selectedImage === index ? 'border-purple-500 shadow-lg scale-105' : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-purple-600 text-sm mb-2">
                <span>Kisna Jewelers</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">
                {product.name || product.title}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating || 4) ? 'fill-purple-400 text-purple-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-gray-600">{product.rating || 4.0} ({(product.reviews || 0)} reviews)</span>
              </div>
            </div>

            <div className="border-y border-gray-200 py-6">
              <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                {formatPrice(product.price)}
              </p>
              <p className="text-sm text-gray-500 mt-2">Inclusive of all taxes</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {product.material && (
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {product.material && <div><p className="text-sm text-gray-500">Material</p><p className="font-semibold text-gray-900">{product.material}</p></div>}
                  {product.weight && <div><p className="text-sm text-gray-500">Weight</p><p className="font-semibold text-gray-900">{product.weight}</p></div>}
                  {product.purity && <div><p className="text-sm text-gray-500">Purity</p><p className="font-semibold text-gray-900">{product.purity}</p></div>}
                  {product.dimensions && <div><p className="text-sm text-gray-500">Dimensions</p><p className="font-semibold text-gray-900">{product.dimensions}</p></div>}
                </div>
              </div>
            )}

            {product.category === 'rings' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-900">Select Size</label>
                  <button className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700">
                    <Ruler className="w-4 h-4" />Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {['6', '7', '8', '9', '10', '11'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 border-2 rounded-lg font-medium transition-all duration-300 ${
                        selectedSize === size ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-gray-900 block mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-purple-500 flex items-center justify-center font-bold text-gray-700 hover:text-purple-600 transition-colors">-</button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-purple-500 flex items-center justify-center font-bold text-gray-700 hover:text-purple-600 transition-colors">+</button>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-3 hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <ShoppingCart className="w-5 h-5" />Add to Cart
              </button>
              <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Buy Now
              </button>
              <button className="w-full border-2 border-gray-300 py-4 rounded-lg font-semibold flex items-center justify-center gap-3 hover:border-purple-500 hover:text-purple-600 transition-all duration-300">
                <Share2 className="w-5 h-5" />Share Product
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center"><Shield className="w-8 h-8 text-purple-500 mx-auto mb-2" /><p className="text-xs text-gray-600 font-medium">Certified Authentic</p></div>
              <div className="text-center"><Truck className="w-8 h-8 text-purple-500 mx-auto mb-2" /><p className="text-xs text-gray-600 font-medium">Free Shipping</p></div>
              <div className="text-center"><Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-2" /><p className="text-xs text-gray-600 font-medium">Lifetime Warranty</p></div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">In Stock</span>
              </div>
              <p className="text-sm text-gray-600"><Truck className="w-4 h-4 inline mr-2" />Delivery: 2-3 business days</p>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h3 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">More From Kisna</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <div key={item.id} onClick={() => navigate(`/kisna/product/${item.id}`)} className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="relative overflow-hidden aspect-square">
                    <img src={item.image || item.img} alt={item.name || item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">{item.name || item.title}</h4>
                    <p className="text-lg font-bold text-purple-600">{formatPrice(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KisnaProductDetail;
