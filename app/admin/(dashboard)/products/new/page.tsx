import { CreateProductForm } from "@/components/products/CreateProductForm";

export default function NewProductPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Create New Product</h1>
        <p className="text-muted-foreground">Add a new product to your inventory using the advanced wizard.</p>
      </div>
      <CreateProductForm />
    </div>
  );
}
