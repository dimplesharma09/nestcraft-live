"use client";

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Link, useParams } from '@/lib/router';
import { 
  Star, 
  Search,
  ShoppingCart,
  Plus,
  ChevronRight,
  Filter
} from 'lucide-react';
import { products, categories } from '../../data/products';
import { useAppDispatch } from '../../lib/store/hooks';
import { addToCart } from '../../lib/store/features/cartSlice';

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useAppDispatch();

  const currentCategory = useMemo(() => {
    if (!id) return null;
    return categories.find(c => c.id === id);
  }, [id]);

  const filteredProducts = useMemo(() => {
    let result = products;
    
    if (id) {
      const categoryName = currentCategory?.name || '';
      result = result.filter(p => p.category.toLowerCase() === categoryName.toLowerCase());
    }

    if (searchQuery) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [id, searchQuery, currentCategory]);

  return (
    <div className="container mx-auto px-[5%] pb-20">
      {/* Breadcrumbs */}
      <div className="crumbs flex items-center gap-2">
        <Link href="/">Home</Link> <ChevronRight size={12} className="opacity-50" />
        <Link href="/shop">Shop</Link> <ChevronRight size={12} className="opacity-50" />
        <strong className="text-foreground">{currentCategory ? currentCategory.name : 'All Products'}</strong>
      </div>

      {/* Header */}
      <section className="pagehead">
        <div className="pagehead-inner">
          <div className="pagehead-content">
            <small className="text-secondary tracking-[3px] uppercase text-[10px] font-black mb-2 block">
              {currentCategory ? 'Category' : 'Collection'}
            </small>
            <h1 className="text-[46px] font-black leading-[1.05] tracking-tight">
              {currentCategory ? currentCategory.name : 'The Full Collection'}
            </h1>
            <p className="text-muted font-bold mt-2.5 max-w-[70ch] leading-relaxed">
              {currentCategory 
                ? currentCategory.description 
                : 'Explore our entire range of design-led furniture and home essentials. Crafted with purpose, built for life.'}
            </p>

            <div className="flex flex-wrap gap-2.5 mt-4">
              {['Seating', 'Tables', 'Lighting', 'Decor', 'Storage'].map(sub => (
                <button key={sub} className="h-10 px-4 rounded-full border border-border bg-white/65 dark:bg-surface/62 backdrop-blur-md text-[10px] font-black uppercase tracking-[2px] hover:border-secondary hover:bg-secondary/10 transition-all">
                  {sub}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2.5 flex-wrap justify-start lg:justify-end ml-auto">
            <div className="pill"><b>120+</b> items</div>
            <div className="pill"><b>Fast</b> shipping</div>
            <div className="pill"><b>Top</b> rated</div>
          </div>
        </div>
      </section>

      {/* Content Layout */}
      <section className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-start">
          {/* LEFT FILTERS */}
          <aside className="lg:sticky lg:top-[128px] space-y-6">
            <div className="border border-border bg-surface rounded-[20px] overflow-hidden shadow-sm">
              <div className="p-4 border-b border-border flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-secondary" />
                  <h3 className="text-[26px] font-black leading-none">Filters</h3>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[2px] text-muted border border-border rounded-full px-2.5 py-1.5 bg-background">
                  {currentCategory ? currentCategory.name.split(' ')[0] : 'All'}
                </span>
              </div>

              <div className="p-4 border-b border-border/70">
                <div className="text-[11px] font-black uppercase tracking-[2px] text-foreground/80 mb-3">Price</div>
                <div className="grid grid-cols-2 gap-2.5">
                  <input type="text" placeholder="Min" className="h-10 px-3 rounded-xl border border-border bg-background/80 text-xs font-bold outline-none focus:border-secondary" />
                  <input type="text" placeholder="Max" className="h-10 px-3 rounded-xl border border-border bg-background/80 text-xs font-bold outline-none focus:border-secondary" />
                </div>
              </div>

              <div className="p-4 border-b border-border/70">
                <div className="text-[11px] font-black uppercase tracking-[2px] text-foreground/80 mb-3">Category</div>
                <div className="space-y-2.5">
                  <Link 
                    href="/shop" 
                    className={`flex justify-between items-center text-sm font-bold hover:text-secondary transition-colors ${!id ? 'text-secondary' : 'text-muted'}`}
                  >
                    All Products <small className="text-[10px] font-black opacity-50">120</small>
                  </Link>
                  {categories.map(cat => (
                    <Link 
                      key={cat.id} 
                      href={`/category/${cat.id}`}
                      className={`flex justify-between items-center text-sm font-bold hover:text-secondary transition-colors ${id === cat.id ? 'text-secondary' : 'text-muted'}`}
                    >
                      {cat.name} <small className="text-[10px] font-black opacity-50">{Math.floor(Math.random() * 30) + 10}</small>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="p-4 border-b border-border/70">
                <div className="text-[11px] font-black uppercase tracking-[2px] text-foreground/80 mb-3">Material</div>
                <div className="space-y-2.5">
                  {['Solid Oak', 'Velvet', 'Linen', 'Ceramic'].map(mat => (
                    <label key={mat} className="flex items-center gap-2.5 text-sm font-bold text-foreground/80 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 accent-secondary" />
                      {mat}
                      <small className="ml-auto text-[10px] font-black text-muted opacity-50">12</small>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-4">
                <div className="text-[11px] font-black uppercase tracking-[2px] text-foreground/80 mb-3">Rating</div>
                <div className="space-y-2.5">
                  {[4.8, 4.5, 4.0].map(rate => (
                    <label key={rate} className="flex items-center gap-2.5 text-sm font-bold text-foreground/80 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 accent-secondary" />
                      {rate}+ <small className="ml-auto text-[10px] font-black text-muted opacity-50">26</small>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT GRID */}
          <div>
            {/* Search and Sort Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input 
                  type="text" 
                  placeholder="Search in this category..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-6 rounded-2xl border border-border bg-surface font-bold focus:border-secondary outline-none transition-all text-sm"
                />
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-[11px] font-black uppercase tracking-[1px] text-muted whitespace-nowrap">Sort by:</span>
                <select className="h-12 px-4 rounded-2xl border border-border bg-surface font-bold text-sm outline-none focus:border-secondary cursor-pointer w-full sm:w-48">
                  <option>Newest First</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Most Popular</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card group">
                  <div className="badge">{product.badge}</div>
                  <Link href={`/product/${product.id}`} className="img-wrap block">
                    <img src={product.img} alt={product.title} />
                  </Link>
                  <div className="card-body">
                    <div className="flex justify-between items-start mb-2.5">
                      <Link href={`/product/${product.id}`} className="font-heading text-[26px] font-black leading-[1.05] text-foreground/92 hover:text-secondary transition-colors">
                        {product.title}
                      </Link>
                      <button 
                        onClick={() => dispatch(addToCart(product))}
                        className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg shrink-0"
                        title="Add to Cart"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center gap-2.5 flex-wrap font-black tracking-[1px] text-foreground/75">
                      <span className="text-muted/92 text-[13px] uppercase tracking-[2px]">{product.price}</span>
                      <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[2px] text-muted/92 whitespace-nowrap">
                        <Star size={12} className="text-secondary fill-secondary" /> {product.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-20 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/10 mb-6">
                  <Search size={32} className="text-muted" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No products found</h3>
                <p className="text-muted font-semibold mb-8">We couldn't find any products matching your search.</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-secondary font-black text-xs uppercase tracking-[2px] border-b border-secondary pb-1"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
