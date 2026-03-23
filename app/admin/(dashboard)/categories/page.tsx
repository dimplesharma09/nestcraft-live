"use client";

import { useEffect, useMemo, useState } from "react";
import { Tag, Plus, FolderTree, Pencil, Trash2, Rows4, List } from "lucide-react";

type CategoryType = "product" | "portfolio" | "blog";

type CategoryRecord = {
  _id: string;
  name: string;
  slug: string;
  type: CategoryType;
  parentId?: string | null;
  description?: string;
  entityCount?: number;
};

type CategoryDraft = {
  name: string;
  slug: string;
  type: CategoryType;
  parentId: string | null;
  description: string;
};

function createDraft(type: CategoryType = "product"): CategoryDraft {
  return {
    name: "",
    slug: "",
    type,
    parentId: null,
    description: "",
  };
}

function toDraft(record: CategoryRecord): CategoryDraft {
  return {
    name: record.name || "",
    slug: record.slug || "",
    type: record.type || "product",
    parentId: record.parentId || null,
    description: record.description || "",
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [typeFilter, setTypeFilter] = useState<CategoryType | "">("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [toast, setToast] = useState("");
  const [form, setForm] = useState<CategoryDraft>(createDraft());

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter) params.set("type", typeFilter);
      const res = await fetch(`/api/ecommerce/categories?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, [typeFilter]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  };

  const resetForm = () => {
    setForm(createDraft(typeFilter || "product"));
    setEditingId(null);
    setShowForm(false);
  };

  const totals = useMemo(() => ({
    all: categories.length,
    product: categories.filter((item) => item.type === "product").length,
    portfolio: categories.filter((item) => item.type === "portfolio").length,
    blog: categories.filter((item) => item.type === "blog").length,
  }), [categories]);

  const openCreate = () => {
    setForm(createDraft(typeFilter || "product"));
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (record: CategoryRecord) => {
    setForm(toDraft(record));
    setEditingId(record._id);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.name) {
      showToast("Category name is required.");
      return;
    }

    setSaving(true);
    const endpoint = editingId ? `/api/ecommerce/categories/${editingId}` : "/api/ecommerce/categories";
    const method = editingId ? "PUT" : "POST";
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      type: form.type,
      parentId: form.parentId || null,
      description: form.description.trim(),
    };

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showToast(editingId ? "Category updated." : "Category created.");
        resetForm();
        fetchCategories();
      } else {
        const data = await res.json();
        showToast(data?.error || "Failed to save category.");
      }
    } catch (e) {
      showToast("Network error saving category.");
    }
    setSaving(false);
  };

  const handleDelete = async (record: CategoryRecord) => {
    if (!confirm(`Delete category "${record.name}"?`)) return;
    try {
      const res = await fetch(`/api/ecommerce/categories/${record._id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Category deleted.");
        fetchCategories();
      } else {
        const data = await res.json();
        showToast(data?.error || "Failed to delete category.");
      }
    } catch (e) {
      showToast("Network error deleting category.");
    }
  };

  const typeColors: Record<string, string> = {
    product: "bg-primary/20 text-primary border-primary/30",
    portfolio: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    blog: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-8">
      {toast && (
        <div className="fixed right-4 top-4 z-50 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xl">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <FolderTree size={24} />
          </div>
          <div>
            <h2 className="font-sans tracking-tight text-3xl font-bold text-foreground">Category Management</h2>
            <p className="text-xs font-mono text-muted-foreground">Manage categories dynamically across your site.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`rounded-lg border px-3 py-2 text-xs ${viewMode === "grid" ? "border-primary/30 bg-primary/15 text-primary" : "border-border bg-card text-muted-foreground"}`}
          >
            <Rows4 size={13} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`rounded-lg border px-3 py-2 text-xs ${viewMode === "list" ? "border-primary/30 bg-primary/15 text-primary" : "border-border bg-card text-muted-foreground"}`}
          >
            <List size={13} />
          </button>
          <button onClick={openCreate} className="inline-flex text-sm font-medium items-center gap-2 rounded-lg  bg-primary text-primary-foreground hover:bg-primary/90 transition-colors hover:bg-primary/90 py-1.5 px-2">
            <Plus size={16} /> Add Category
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">All</p>
          <p className="mt-1 text-xl font-bold text-foreground">{totals.all}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Product</p>
          <p className="mt-1 text-xl font-bold text-primary">{totals.product}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Portfolio</p>
          <p className="mt-1 text-xl font-bold text-purple-300">{totals.portfolio}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Blog</p>
          <p className="mt-1 text-xl font-bold text-amber-300">{totals.blog}</p>
        </div>
      </div>

      {showForm && (
        <section className="rounded-xl border border-border bg-card shadow-sm p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-foreground">
              {editingId ? "Edit Category" : "Create Category"}
            </h3>
            <button onClick={resetForm} className="rounded-md p-1 text-muted-foreground hover:bg-muted/50 ">✕</button>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Category Name"
              className="rounded-lg border border-border bg-background shadow-xs px-3 py-2 text-sm text-foreground md:col-span-2"
            />
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="slug"
              className="rounded-lg border border-border bg-background shadow-xs px-3 py-2 text-sm text-foreground"
            />
            <select
              value={form.type}
              onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value as CategoryType }))}
              className="rounded-lg border border-border bg-background shadow-xs px-3 py-2 text-sm text-foreground"
            >
              <option value="product">Product</option>
              <option value="portfolio">Portfolio</option>
              <option value="blog">Blog</option>
            </select>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <select
              value={form.parentId || ""}
              onChange={(e) => setForm(prev => ({ ...prev, parentId: e.target.value || null }))}
              className="rounded-lg border border-border bg-background shadow-xs px-3 py-2 text-sm text-foreground"
            >
              <option value="">None (Top Level)</option>
              {categories.filter(c => c.type === form.type && c._id !== editingId).map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            <textarea
              rows={1}
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Category Description"
              className="w-full rounded-lg border border-border bg-background shadow-xs px-3 py-2 text-sm text-foreground"
            />
          </div>

          <div className="mt-4">
            <button onClick={handleSubmit} disabled={saving} className="rounded-lg bg-secondary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-secondary/90 disabled:opacity-60">
              {saving ? "Saving..." : editingId ? "Update Category" : "Create Category"}
            </button>
          </div>
        </section>
      )}

      <div className="flex gap-2">
        {(["", "product", "portfolio", "blog"] as const).map((type) => (
          <button
            key={type || "all"}
            onClick={() => setTypeFilter(type)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${typeFilter === type ? "border-primary/30 bg-primary/20 text-primary" : "border-border bg-muted/50 text-muted-foreground hover:border-slate-600"}`}
          >
            {type || "All"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-cyan-500" />
        </div>
      ) : categories.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">No categories found.</div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <article key={category._id} className="group rounded-xl border border-border bg-card shadow-sm p-4 hover:shadow-md transition-all hover:border-slate-600">
              <div className="mb-3 flex items-start justify-between">
                <Tag size={18} className="text-muted-foreground group-hover:text-primary" />
                <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${typeColors[category.type] || typeColors.product}`}>
                  {category.type}
                </span>
              </div>
              <h3 className="font-sans text-sm font-semibold text-foreground">
                {category.name}
                {category.parentId && (
                  <span className="ml-2 inline-flex items-center gap-1 font-normal text-[10px] text-muted-foreground">
                    <FolderTree size={10} /> {categories.find(c => c._id === category.parentId)?.name || "Parent"}
                  </span>
                )}
              </h3>
              <p className="font-mono text-xs text-muted-foreground">/{category.slug}</p>
              <p className="mt-2 text-[11px] text-muted-foreground line-clamp-2">{category.description || "No description yet."}</p>
              <div className="mt-3 flex items-center gap-2">
                <button onClick={() => openEdit(category)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-primary">
                  <Pencil size={13} />
                </button>
                <button onClick={() => handleDelete(category)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-rose-300">
                  <Trash2 size={13} />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm text-left">
            <thead className="bg-card uppercase text-[10px] text-muted-foreground border-b border-border">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {categories.map(c => (
                <tr key={c._id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{c.slug}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.type}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => openEdit(c)} className="text-primary hover:text-primary"><Pencil size={14}/></button>
                    <button onClick={() => handleDelete(c)} className="text-rose-400 hover:text-rose-300"><Trash2 size={14}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
