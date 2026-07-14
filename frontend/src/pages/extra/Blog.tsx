import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Clock, User, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { blogPosts } from "@/mock/data";
import { useThemeContext } from "@/context/ThemeContext";
import { cn, formatDate, truncate } from "@/lib/utils";

const allCategories = [...new Set(blogPosts.map((post) => post.category))];

export default function Blog() {
  const { isDark } = useThemeContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const featuredPost = blogPosts[0];
  const recentPosts = blogPosts.slice(1, 4);

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={cn("min-h-screen", isDark ? "bg-slate-950" : "bg-white")}>
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-primary-600/5" />
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              <span className={cn(isDark ? "text-white" : "text-slate-900")}>Our </span>
              <span className="text-gradient">Blog</span>
            </h1>
            <p
              className={cn(
                "mx-auto mt-6 max-w-2xl text-lg",
                isDark ? "text-slate-400" : "text-slate-500"
              )}
            >
              Tips, advice, and insights to help you maintain your home and make informed decisions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="overflow-hidden">
              <div className="grid gap-0 lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto">
                  {featuredPost.image && (
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                  <div className="absolute left-4 top-4">
                    <Badge variant="default">Featured</Badge>
                  </div>
                </div>
                <CardContent className="flex flex-col justify-center p-8">
                  <Badge variant="secondary" className="w-fit">
                    {featuredPost.category}
                  </Badge>
                  <h2
                    className={cn(
                      "mt-4 text-2xl font-bold",
                      isDark ? "text-white" : "text-slate-900"
                    )}
                  >
                    {featuredPost.title}
                  </h2>
                  <p className={cn("mt-3 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                    {featuredPost.excerpt}
                  </p>
                  <div className="mt-6 flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      <span className={isDark ? "text-slate-300" : "text-slate-600"}>
                        {featuredPost.author}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span className={isDark ? "text-slate-300" : "text-slate-600"}>
                        {formatDate(featuredPost.date)}
                      </span>
                    </span>
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>
                      {featuredPost.readTime} min read
                    </span>
                  </div>
                  <Button variant="link" className="mt-4 w-fit p-0">
                    Read More <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Main Content + Sidebar */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Posts Grid */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <Input
                  placeholder="Search articles..."
                  icon={<Search className="h-4 w-4" />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Card className="group h-full overflow-hidden">
                      <div className="relative h-48 overflow-hidden">
                        {post.image && (
                          <img
                            src={post.image}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        )}
                        <div className="absolute left-3 top-3">
                          <Badge variant="default">{post.category}</Badge>
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <h3
                          className={cn(
                            "font-bold leading-tight",
                            isDark ? "text-white" : "text-slate-900"
                          )}
                        >
                          {truncate(post.title, 60)}
                        </h3>
                        <p
                          className={cn(
                            "mt-2 text-sm line-clamp-2",
                            isDark ? "text-slate-400" : "text-slate-500"
                          )}
                        >
                          {post.excerpt}
                        </p>
                        <div className="mt-4 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <span className={isDark ? "text-slate-400" : "text-slate-500"}>
                              {post.author}
                            </span>
                            <span className={isDark ? "text-slate-500" : "text-slate-400"}>
                              {formatDate(post.date)}
                            </span>
                          </div>
                          <span className={isDark ? "text-slate-500" : "text-slate-400"}>
                            {post.readTime} min
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="py-12 text-center">
                  <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                    No articles found matching your search.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Categories */}
              <Card>
                <CardContent className="p-6">
                  <h3
                    className={cn(
                      "flex items-center gap-2 font-bold",
                      isDark ? "text-white" : "text-slate-900"
                    )}
                  >
                    <Tag className="h-4 w-4 text-primary-600" />
                    Categories
                  </h3>
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={cn(
                        "block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                        !selectedCategory
                          ? "bg-primary-50 text-primary-700 font-medium"
                          : isDark
                            ? "text-slate-400 hover:bg-slate-800"
                            : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      All Posts
                    </button>
                    {allCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={cn(
                          "block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                          selectedCategory === category
                            ? "bg-primary-50 text-primary-700 font-medium"
                            : isDark
                              ? "text-slate-400 hover:bg-slate-800"
                              : "text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Posts */}
              <Card>
                <CardContent className="p-6">
                  <h3
                    className={cn(
                      "font-bold",
                      isDark ? "text-white" : "text-slate-900"
                    )}
                  >
                    Recent Posts
                  </h3>
                  <div className="mt-4 space-y-4">
                    {recentPosts.map((post) => (
                      <div key={post.id} className="flex gap-3">
                        {post.image && (
                          <img
                            src={post.image}
                            alt={post.title}
                            className="h-16 w-16 shrink-0 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p
                            className={cn(
                              "text-sm font-medium leading-tight",
                              isDark ? "text-white" : "text-slate-900"
                            )}
                          >
                            {truncate(post.title, 45)}
                          </p>
                          <p className={cn("mt-1 text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                            {formatDate(post.date)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
