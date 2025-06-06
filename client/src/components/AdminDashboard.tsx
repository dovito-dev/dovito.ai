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

  const handleLogout = async () => {
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
      onLogout();
    } catch (error) {
      console.error("Logout error:", error);
      onLogout();
    }
  };

  const handleProductSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;

    const formData = new FormData(e.currentTarget);
    const updates = {
      name: formData.get("name") as string,
      abbreviation: formData.get("abbreviation") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      status: formData.get("status") as string,
      url: formData.get("url") as string || null,
    };

    updateProductMutation.mutate({ id: editingProduct.id, updates });
  };

  const handleContentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingContent) return;

    const formData = new FormData(e.currentTarget);
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.username}</p>
          </motion.div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="content">
              <FileText className="h-4 w-4 mr-2" />
              Content
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Product Management</h2>
            </div>

            {productsLoading ? (
              <div>Loading products...</div>
            ) : (
              <div className="grid gap-6">
                {products?.map((product: Product) => (
                  <Card key={product.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {product.name}
                            <Badge variant={product.status === "live" ? "default" : "secondary"}>
                              {product.status}
                            </Badge>
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {product.abbreviation} • {product.category}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingProduct(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteProductMutation.mutate(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-2">{product.description}</p>
                      {product.url && (
                        <p className="text-sm text-blue-600">URL: {product.url}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Position: ({product.positionX}, {product.positionY})
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Content Management</h2>
            </div>

            {contentLoading ? (
              <div>Loading content...</div>
            ) : (
              <div className="grid gap-6">
                {contentSections?.map((section: ContentSection) => (
                  <Card key={section.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {section.title || section.sectionKey}
                            <Badge variant={section.isActive ? "default" : "secondary"}>
                              {section.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            Key: {section.sectionKey}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingContent(section)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{section.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

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
                    <select name="status" defaultValue={editingProduct.status} className="w-full p-2 border rounded">
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