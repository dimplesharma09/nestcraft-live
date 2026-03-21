"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchProducts, selectAdminProducts, selectAdminProductsLoading } from "@/lib/store/features/adminProductsSlice";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, Eye, ChevronDown, ChevronUp, Upload } from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectAdminProducts);
  const loading = useAppSelector(selectAdminProductsLoading);
  
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const jsonContent = JSON.parse(event.target?.result as string);
          
          const res = await fetch('/api/ecommerce/products/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonContent)
          });
          
          const data = await res.json();
          if (!res.ok) {
            console.error("Import Error Details:", data.details || data);
            alert(`Import failed: ${data.message || data.error}`);
          } else {
            alert(`Success! Imported ${data.productsImported} products and ${data.variantsImported} variants.`);
            dispatch(fetchProducts());
          }
        } catch (err: any) {
          alert("Failed to parse JSON file.");
        } finally {
          setImporting(false);
          e.target.value = '';
        }
      };
      reader.readAsText(file);
    } catch (err) {
      setImporting(false);
    }
  };

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  console.log(products);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">Manage your e-commerce product listings and variants.</p>
        </div>
        <div className="flex items-center gap-2">
          <input type="file" id="import-json" className="hidden" accept=".json" onChange={handleImport} />
          <Button variant="outline" className="gap-2" onClick={() => document.getElementById("import-json")?.click()} disabled={importing}>
            <Upload className="h-4 w-4" /> {importing ? "Importing..." : "Import JSON"}
          </Button>
          <Link href="/admin/products/new">
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Product</Button>
          </Link>
        </div>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Variants</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((prod) => (
                <React.Fragment key={prod._id}>
                  <TableRow className={expandedRow === prod._id ? "bg-muted/50" : ""}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{prod.name}</span>
                        <span className="text-xs text-muted-foreground">${prod.price}</span>
                      </div>
                    </TableCell>
                    <TableCell>{prod.sku}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${prod.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {prod.status}
                      </span>
                    </TableCell>
                    <TableCell className="capitalize">{prod.type}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 gap-1"
                        onClick={() => setExpandedRow(expandedRow === prod._id ? null : prod._id)}
                      >
                        {prod.variantCount} in {prod.totalStock} stock
                        {expandedRow === prod._id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive"><Trash className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                  {expandedRow === prod._id && prod.variants && prod.variants.length > 0 && (
                    <TableRow className="bg-muted/20">
                      <TableCell colSpan={6} className="p-0 border-b">
                        <div className="p-4 bg-muted/40">
                          <h4 className="text-sm font-semibold mb-3 tracking-tight">Product Variants</h4>
                          <div className="rounded-md border bg-white overflow-hidden shadow-sm">
                            <Table>
                              <TableHeader className="bg-muted/30">
                                <TableRow>
                                  <TableHead className="text-xs font-semibold">Variant Title</TableHead>
                                  <TableHead className="text-xs font-semibold">SKU</TableHead>
                                  <TableHead className="text-xs font-semibold">Price</TableHead>
                                  <TableHead className="text-xs font-semibold">Stock</TableHead>
                                  <TableHead className="text-xs font-semibold">Options</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {prod.variants.map((v: any) => (
                                  <TableRow key={v._id}>
                                    <TableCell className="text-sm font-medium">{v.title}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{v.sku}</TableCell>
                                    <TableCell className="text-sm">${v.price}</TableCell>
                                    <TableCell className="text-sm">
                                      <span className={v.stock === 0 ? "text-red-500 font-medium" : ""}>
                                        {v.stock}
                                      </span>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                      {v.optionValues && Object.entries(v.optionValues).map(([key, val]) => (
                                        <span key={key} className="inline-block bg-accent px-1.5 py-0.5 rounded-sm mr-1.5">
                                          {key}: {val as string}
                                        </span>
                                      ))}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
