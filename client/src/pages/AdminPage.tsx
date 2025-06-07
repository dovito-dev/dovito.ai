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
import { LogOut, Package, FileText, Pencil, Trash2, User, Lock, ArrowLeft } from "lucide-react";
import type { Product } from "@shared/schema";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
    enabled: isLoggedIn,
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: isLoggedIn,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        setIsLoggedIn(true);
        toast({ title: "Login successful" });
      } else {
        toast({ title: "Login failed", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Login error", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsLoggedIn(false);
      toast({ title: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateProductMutation = useMutation({
    mutationFn: async (data: { id: number; updates: any }) => {
      const response = await fetch(`/api/admin/products/${data.id}`, {
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

  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      if (!response.ok) throw new Error("Failed to create product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsAddingProduct(false);
      toast({ title: "Product created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create product", variant: "destructive" });
    },
  });

  const generateShortcode = (name: string): string => {
    return name
      .split(" ")
      .map(word => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 3);
  };

  const handleProductSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData = {
      name: formData.get("name") as string,
      abbreviation: formData.get("abbreviation") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      status: formData.get("status") as string,
      url: formData.get("url") as string || null,
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, updates: productData });
    } else if (isAddingProduct) {
      createProductMutation.mutate(productData);
    }
  };

  const handleAddNewProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData = {
      name: formData.get("name") as string,
      abbreviation: formData.get("abbreviation") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      status: formData.get("status") as string,
      url: formData.get("url") as string || null,
    };

    createProductMutation.mutate(productData);
  };

  // Login form
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
              <p className="text-muted-foreground">Sign in to manage content</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Username"
                      value={loginData.username}
                      onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Admin dashboard
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
            <p className="text-muted-foreground">Manage your content and products</p>
          </motion.div>
          <div className="flex gap-2">
            <Button 
              onClick={() => window.location.href = "/"} 
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Site
            </Button>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="users">
              <User className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Product Management</h2>
              <Button onClick={() => setIsAddingProduct(true)}>
                Add New Product
              </Button>
            </div>

            {productsLoading ? (
              <div>Loading products...</div>
            ) : (
              <div className="grid gap-6">
                {products && Array.isArray(products) && products.map((product: Product) => (
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

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">User Management</h2>
              <div className="flex gap-2">
                <Button onClick={() => setIsChangingPassword(true)} variant="outline">
                  Change Password
                </Button>
                <Button onClick={() => setIsAddingUser(true)}>
                  Add User
                </Button>
              </div>
            </div>

            {usersLoading ? (
              <div>Loading users...</div>
            ) : (
              <div className="grid gap-4">
                {users && Array.isArray(users) && users.map((user: any) => (
                  <Card key={user.id}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>{user.username}</CardTitle>
                          <p className="text-sm text-muted-foreground">Role: {user.role}</p>
                        </div>
                      </div>
                    </CardHeader>
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
                    <Input 
                      name="abbreviation" 
                      defaultValue={editingProduct.abbreviation} 
                      placeholder="Auto-generated from name"
                      required 
                    />
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

        {/* Add New Product Modal */}
        {isAddingProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddNewProduct} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input 
                      name="name" 
                      placeholder="Product name" 
                      onChange={(e) => {
                        const abbField = e.target.form?.querySelector('[name="abbreviation"]') as HTMLInputElement;
                        if (abbField && !abbField.dataset.userModified) {
                          abbField.value = generateShortcode(e.target.value);
                        }
                      }}
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Abbreviation</label>
                    <Input 
                      name="abbreviation" 
                      placeholder="Auto-generated from name (can override)" 
                      onChange={(e) => {
                        e.target.dataset.userModified = "true";
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea name="description" placeholder="Product description" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Input name="category" placeholder="Category" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <select name="status" defaultValue="development" className="w-full p-2 border rounded bg-background text-foreground">
                      <option value="live">Live</option>
                      <option value="coming_soon">Coming Soon</option>
                      <option value="development">Development</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">URL (optional)</label>
                    <Input name="url" placeholder="https://..." />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={createProductMutation.isPending}>
                      {createProductMutation.isPending ? "Creating..." : "Create Product"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsAddingProduct(false)}>
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