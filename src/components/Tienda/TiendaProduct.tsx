import { ChevronDown, Search, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";

interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  category: string;
  organization: string;
  des: string;
  img: string;
}

const products: Product[] = [
  {
    id: 1,
    title: "Nike Air Max 270 React",
    price: 89.99,
    rating: 4.8,
    category: "Sneakers",
    organization: "Nike",
    des: "Lightweight running shoes with React foam cushioning.",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
  },
  {
    id: 2,
    title: "Adidas Ultraboost 22",
    price: 120.0,
    rating: 4.9,
    category: "Sneakers",
    organization: "Adidas",
    des: "High-performance running shoes with Boost cushioning.",
    img: "https://images.unsplash.com/photo-1600180758895-44a59fcbd7c7?w=800",
  },
  {
    id: 3,
    title: "Puma RS-X",
    price: 79.99,
    rating: 4.6,
    category: "Sneakers",
    organization: "Puma",
    des: "Chunky retro-style sneaker for everyday comfort.",
    img: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800",
  },
  {
    id: 4,
    title: "Champion Powerblend Hoodie",
    price: 49.99,
    rating: 4.7,
    category: "Hoodie",
    organization: "Champion",
    des: "Cozy fleece hoodie with classic Champion branding.",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
  },
  {
    id: 5,
    title: "Levi's 511 Slim Fit Jeans",
    price: 39.99,
    rating: 4.4,
    category: "Jeans",
    organization: "Levi's",
    des: "Slim-fit stretch denim designed for comfort.",
    img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800",
  },
  {
    id: 6,
    title: "Vans Old Skool Classic",
    price: 95.0,
    rating: 4.7,
    category: "Casual Shoes",
    organization: "Vans",
    des: "Iconic skate shoe with suede and canvas upper.",
    img: "https://images.unsplash.com/photo-1524010349062-860def6649c3?w=800",
  },
  {
    id: 7,
    title: "North Face Waterproof Jacket",
    price: 55.0,
    rating: 4.2,
    category: "Jacket",
    organization: "The North Face",
    des: "Durable waterproof jacket for outdoor activities.",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
  },
  {
    id: 8,
    title: "Timberland 6-Inch Premium Boots",
    price: 129.99,
    rating: 4.5,
    category: "Boots",
    organization: "Timberland",
    des: "Classic waterproof leather boots for rugged use.",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
  },
  {
    id: 9,
    title: "Balenciaga Triple S",
    price: 220.0,
    rating: 5.0,
    category: "Luxury Sneakers",
    organization: "Balenciaga",
    des: "Chunky luxury dad sneakers with triple-stacked sole.",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
  },
  {
    id: 10,
    title: "Gucci Oversized T-Shirt",
    price: 150.0,
    rating: 4.9,
    category: "T-Shirt",
    organization: "Gucci",
    des: "Premium cotton t-shirt with soft oversized fit.",
    img: "https://images.unsplash.com/photo-1559563458-2ce31f7dc3a0?w=800",
  },
];

export default function TiendaProduct() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState(500);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedOrganization, setSelectedOrganization] = useState<
    string | null
  >(null);

  // mobile dropdowns open state (they will render in-flow so they scroll with the page)
  const [ratingOpen, setRatingOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);

  const categories = [
    "Sneakers",
    "Boots",
    "T-Shirt",
    "Hoodie",
    "Jeans",
    "Jacket",
  ];
  const organizations = [
    "Nike",
    "Adidas",
    "Puma",
    "Champion",
    "Levi's",
    "Vans",
    "Timberland",
  ];

  const resetFilters = () => {
    setSearch("");
    setSortBy("rating");
    setSelectedRating(null);
    setPriceRange(500);
    setSelectedCategory(null);
    setSelectedOrganization(null);
    setRatingOpen(false);
    setCategoryOpen(false);
    setOrgOpen(false);
  };

  const filteredAndSorted = products
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    .filter(
      (p) => selectedRating === null || Math.round(p.rating) === selectedRating
    )
    .filter((p) => p.price <= priceRange)
    .filter((p) => !selectedCategory || p.category === selectedCategory)
    .filter(
      (p) => !selectedOrganization || p.organization === selectedOrganization
    )
    .sort((a, b) =>
      sortBy === "rating" ? b.rating - a.rating : a.price - b.price
    );

  const renderStars = (rating: number, size = "w-4 h-4") =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${size} ${
          i < Math.floor(rating)
            ? "fill-orange-400 text-orange-400"
            : i < rating
            ? "fill-orange-200 text-orange-400"
            : "text-gray-300"
        }`}
      />
    ));

  return (
    <>
      <div className="min-h-screen bg-emerald-50">
        {/* ---------- MOBILE (DESIGN MATCHED TO PROVIDED IMAGE) ---------- */}
        <div className="md:hidden px-4 pt-4 pb-28">
          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Buscar producto"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-3 pl-12 pr-4 rounded-full border-2 border-orange-300 placeholder-orange-300 focus:outline-none bg-white shadow-sm"
            />
            <div className="absolute left-4 top-3.5">
              <Search className="w-5 h-5 text-orange-400" />
            </div>
          </div>

          {/* Chips row */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-3">
            <button
              onClick={() => {
                setRatingOpen((v) => !v);
                setCategoryOpen(false);
                setOrgOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-full border-2 border-emerald-600 text-emerald-800 text-sm bg-white"
            >
              <span className="text-xs">
                {selectedRating ? `${selectedRating}+` : "Rating"}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setCategoryOpen((v) => !v);
                setRatingOpen(false);
                setOrgOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-full border-2 border-emerald-600 text-emerald-800 text-sm bg-white"
            >
              <span className="text-xs">{selectedCategory ?? "Category"}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setOrgOpen((v) => !v);
                setRatingOpen(false);
                setCategoryOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-full border-2 border-emerald-600 text-emerald-800 text-sm bg-white"
            >
              <span className="text-xs">
                {selectedOrganization ?? "Organization"}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* DROPDOWNS (in-flow) */}
          {ratingOpen && (
            <div className="mb-3">
              <div className="bg-white rounded-xl shadow-lg border-2 border-orange-100 p-3 max-h-[320px] overflow-auto">
                {[5, 4, 3, 2, 1].map((r) => (
                  <label
                    key={r}
                    className="flex items-center gap-3 py-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="mobile-rating"
                      checked={selectedRating === r}
                      onChange={() =>
                        setSelectedRating(selectedRating === r ? null : r)
                      }
                      className="w-4 h-4 text-orange-500"
                    />
                    <div className="flex items-center gap-2">
                      {renderStars(r, "w-4 h-4")}
                      <span className="text-sm text-gray-600">& up</span>
                    </div>
                  </label>
                ))}
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => setRatingOpen(false)}
                    className="flex-1 text-sm text-orange-600"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setSelectedRating(null)}
                    className="flex-1 text-sm text-gray-600"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}

          {categoryOpen && (
            <div className="mb-3">
              <div className="bg-white rounded-xl shadow-lg border-2 border-orange-100 p-3 max-h-[320px] overflow-auto">
                {categories.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-3 py-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="mobile-category"
                      checked={selectedCategory === cat}
                      onChange={() =>
                        setSelectedCategory(
                          selectedCategory === cat ? null : cat
                        )
                      }
                      className="w-4 h-4 text-orange-500"
                    />
                    <span className="text-sm text-gray-700">{cat}</span>
                  </label>
                ))}
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => setCategoryOpen(false)}
                    className="flex-1 text-sm text-orange-600"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="flex-1 text-sm text-gray-600"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}

          {orgOpen && (
            <div className="mb-3">
              <div className="bg-white rounded-xl shadow-lg border-2 border-orange-100 p-3 max-h-[320px] overflow-auto">
                {organizations.map((org) => (
                  <label
                    key={org}
                    className="flex items-center gap-3 py-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="mobile-org"
                      checked={selectedOrganization === org}
                      onChange={() =>
                        setSelectedOrganization(
                          selectedOrganization === org ? null : org
                        )
                      }
                      className="w-4 h-4 text-orange-500"
                    />
                    <span className="text-sm text-gray-700">{org}</span>
                  </label>
                ))}
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => setOrgOpen(false)}
                    className="flex-1 text-sm text-orange-600"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setSelectedOrganization(null)}
                    className="flex-1 text-sm text-gray-600"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Price slider */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>Price range</span>
              <span className="text-orange-600 font-semibold">
                ${priceRange}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none"
              style={{
                background: `linear-gradient(90deg,#FB923C ${
                  (priceRange / 500) * 100
                }%, #E5E7EB ${(priceRange / 500) * 100}%)`,
              }}
            />
          </div>

          {/* Mobile product grid - styled to match image */}
          <div className="grid grid-cols-2 gap-3">
            {/* Top: two products like image */}
            {filteredAndSorted.slice(0, 2).map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border-2 border-orange-300 p-3 relative overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={product.img}
                    alt={product.title}
                    className="w-full h-24 object-contain rounded-md bg-white"
                  />
                  <button className="absolute top-2 right-2 bg-white p-1 rounded-full border border-emerald-200 shadow">
                    <ShoppingCart className="w-4 h-4 text-emerald-600" />
                  </button>
                </div>
                <div className="mt-2 text-xs text-emerald-700 font-semibold">
                  {product.title}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="text-sm text-orange-600 font-bold">
                    ${product.price.toFixed(2)}
                  </div>
                  <div className="flex items-center gap-0.5">
                    {renderStars(product.rating, "w-3 h-3")}
                  </div>
                </div>
              </div>
            ))}

            {/* Special offer card that spans two columns (use full width) */}
            <div className="col-span-2">
              <div className="bg-white rounded-2xl border-2 border-emerald-700 p-4 flex items-center gap-4 shadow">
                <div className="flex-1">
                  <div className="text-sm text-emerald-700 font-medium">
                    Oferta especial
                  </div>
                  <div className="text-orange-600 text-2xl font-extrabold">
                    $5.33{" "}
                    <span className="text-gray-400 line-through text-sm ml-2">
                      $11.33
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Nombre producto
                  </div>
                </div>
                <div className="w-28 h-20 bg-white rounded-lg flex items-center justify-center">
                  {/* using uploaded image local path here as requested */}
                  <img
                    src="/mnt/data/Screenshot 2025-11-24 130846.png"
                    alt="promo"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <button className="absolute top-3 right-3 bg-amber-100 text-amber-700 rounded-full p-2 border border-amber-200">
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* rest of products */}
            {filteredAndSorted.slice(2).map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border-2 border-orange-300 p-3 relative overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={product.img}
                    alt={product.title}
                    className="w-full h-24 object-contain rounded-md bg-white"
                  />
                  <button className="absolute top-2 right-2 bg-white p-1 rounded-full border border-emerald-200 shadow">
                    <ShoppingCart className="w-4 h-4 text-emerald-600" />
                  </button>
                </div>
                <div className="mt-2 text-xs text-emerald-700 font-semibold">
                  {product.title}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="text-sm text-orange-600 font-bold">
                    ${product.price.toFixed(2)}
                  </div>
                  <div className="flex items-center gap-0.5">
                    {renderStars(product.rating, "w-3 h-3")}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* promo large block (espacio para promo) */}
          <div className="mt-4">
            <div className="bg-white rounded-3xl border-2 border-emerald-700 h-48 flex items-center justify-center overflow-hidden">
              {/* If you prefer the uploaded screenshot as background, it's already available at the local path above */}
              <div className="text-3xl font-semibold text-emerald-700 text-center leading-tight">
                espacio
                <br /> para
                <br /> promo
              </div>
            </div>
          </div>

          {/* floating cart button */}
          <button className="fixed right-4 bottom-6 w-14 h-14 rounded-full bg-orange-500 shadow-lg flex items-center justify-center text-white z-40">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>

        {/* ---------- DESKTOP (unchanged) ---------- */}
        <div className="max-w-7xl mx-auto flex gap-8 px-6 py-8 hidden md:flex">
          {/* SIDEBAR */}
          <aside className="w-80 space-y-8">
            {/* Rating Filter */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-green-700">Rating</h3>

                {/* RESET BUTTON */}
                <button
                  onClick={resetFilters}
                  className="text-sm text-orange-500 hover:text-orange-600"
                >
                  Reset
                </button>
              </div>

              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((r) => (
                  <label
                    key={r}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={selectedRating === r}
                      onChange={() =>
                        setSelectedRating(selectedRating === r ? null : r)
                      }
                      className="w-5 h-5 text-orange-500 focus:ring-orange-400"
                    />
                    <div className="flex items-center gap-1">
                      {renderStars(r)}
                      <span className="text-sm text-gray-600 ml-1">& up</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-green-700 mb-4">
                Price range
              </h3>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-2 bg-orange-100 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #FB923C 0%, #FB923C ${
                      (priceRange / 500) * 100
                    }%, #E5E7EB ${(priceRange / 500) * 100}%, #E5E7EB 100%)`,
                  }}
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>$0</span>
                  <span className="font-semibold text-orange-600">
                    ${priceRange}
                  </span>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-green-700 mb-4">
                Category
              </h3>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat}
                      onChange={() =>
                        setSelectedCategory(
                          selectedCategory === cat ? null : cat
                        )
                      }
                      className="w-5 h-5 text-orange-500 focus:ring-orange-400"
                    />
                    <span className="text-gray-700">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Organization */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-green-700 mb-4">
                Organization
              </h3>
              <div className="space-y-3">
                {organizations.map((org) => (
                  <label
                    key={org}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="org"
                      checked={selectedOrganization === org}
                      onChange={() =>
                        setSelectedOrganization(
                          selectedOrganization === org ? null : org
                        )
                      }
                      className="w-5 h-5 text-orange-500 focus:ring-orange-400"
                    />
                    <span className="text-gray-700">{org}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* PRODUCTS */}
          <main className="flex-1">
            <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex-1 max-w-2xl">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar producto"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-full border border-orange-200 focus:outline-none focus:border-orange-400 text-gray-700"
                    />
                    <Search className="absolute left-4 top-3.5 w-6 h-6 text-orange-400" />
                  </div>
                </div>

                <div className="flex items-center gap-6 ml-8">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-6 py-3 rounded-full bg-orange-50 text-orange-700 font-medium border border-orange-200 focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="rating">Organizar por</option>
                    <option value="rating">Mejor valoración</option>
                    <option value="price">Precio: menor a mayor</option>
                  </select>
                  <ChevronDown className="w-5 h-5 text-orange-700 -ml-12 pointer-events-none" />
                </div>
              </div>
            </header>

            <div className="grid grid-cols-3 gap-6 mt-5">
              {filteredAndSorted.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
                >
                  <div className="relative">
                    <img
                      src={product.img}
                      alt={product.title}
                      className="w-full h-64 object-cover"
                    />
                    <button className="absolute top-4 right-4 bg-white/90 p-3 rounded-full shadow-md hover:bg-white transition">
                      <ShoppingCart className="w-6 h-6 text-green-600" />
                    </button>
                  </div>

                  <div className="p-6">
                    <h4 className="text-lg font-medium text-gray-800 mb-2">
                      {product.title}
                    </h4>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl font-bold text-orange-600">
                        ${product.price.toFixed(2)}
                      </span>
                      <div className="flex ml-auto">
                        {renderStars(product.rating)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
        {/* ---------- END DESKTOP ---------- */}
      </div>
    </>
  );
}
