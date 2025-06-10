import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { LogOut, Package, FileText, Plus, Pencil, Trash2 } from "lucide-react";
import type { Product, ContentSection } from "@shared/schema";

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingContent, setEditingContent] = useState<ContentSection | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  const { data: contentSections, isLoading: contentLoading } = useQuery({
    queryKey: ["/api/content"],
  });

  const updateProductMutation = useMutation({
    mutationFn: async (data: { id: number; updates: Partial<Product> }) => {
      const response = await apiRequest(`/api/admin/products/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.updates),
      });
      if (!response.ok) throw new Error("Failed to update product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setEditingProduct(null);
      toast({ title: "Product updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update product", variant: "destructive" });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete product", variant: "destructive" });
    },
  });

  const updateContentMutation = useMutation({
    mutationFn: async (data: { id: number; updates: Partial<ContentSection> }) => {
      const response = await apiRequest(`/api/admin/content/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.updates),
      });
      if (!response.ok) throw new Error("Failed to update content");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      setEditingContent(null);
      toast({ title: "Content updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update content", variant: "destructive" });
    },
  });

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const updates = Object.fromEntries(formData.entries());

    updateProductMutation.mutate({ id: editingProduct.id, updates });
  };

  const handleContentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContent) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const updates = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      isActive: formData.get("isActive") === "on",
    };

    updateContentMutation.mutate({ id: editingContent.id, updates });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your content and products</p>
          </div>
          <Button onClick={onLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Products Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <div>Loading products...</div>
              ) : (
                <div className="space-y-4">
                  {products?.map((product: Product) => (
                    <div key={product.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.abbreviation}</p>
                          <Badge variant={product.status === "live" ? "default" : "secondary"}>
                            {product.status}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content Management Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Content Sections
              </CardTitle>
            </CardHeader>
            <CardContent>
              {contentLoading ? (
                <div>Loading content...</div>
              ) : (
                <div className="space-y-4">
                  {contentSections?.map((section: ContentSection) => (
                    <div key={section.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{section.title || section.sectionKey}</h3>
                          <p className="text-sm text-muted-foreground truncate">{section.content}</p>
                          <Badge variant={section.isActive ? "default" : "secondary"}>
                            {section.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingContent(section)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Edit Product</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input name="name" defaultValue={editingProduct.name} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Abbreviation</label>
                    <Input name="abbreviation" defaultValue={editingProduct.abbreviation} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea name="description" defaultValue={editingProduct.description} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Input name="category" defaultValue={editingProduct.category} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <select name="status" defaultValue={editingProduct.status} className="w-full p-2 border rounded bg-background text-foreground">
                      <option value="live">Live</option>
                      <option value="coming_soon">Coming Soon</option>
                      <option value="development">Development</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">URL (optional)</label>
                    <Input name="url" defaultValue={editingProduct.url || ""} />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={updateProductMutation.isPending}>
                      {updateProductMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit Content Modal */}
        {editingContent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Edit Content Section</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContentSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Section Key</label>
                    <Input value={editingContent.sectionKey} disabled className="bg-muted" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input name="title" defaultValue={editingContent.title || ""} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Content</label>
                    <Textarea 
                      name="content" 
                      defaultValue={editingContent.content || ""} 
                      rows={6}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      name="isActive" 
                      defaultChecked={editingContent.isActive}
                      className="h-4 w-4"
                    />
                    <label className="text-sm font-medium">Active</label>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={updateContentMutation.isPending}>
                      {updateContentMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setEditingContent(null)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}