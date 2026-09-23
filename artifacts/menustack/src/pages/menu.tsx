import { useState } from "react";
import { POSLayout } from "@/components/layout";
import {
  useListMenuCategories,
  useCreateMenuCategory,
  useUpdateMenuCategory,
  useDeleteMenuCategory,
  useListMenuItems,
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
  useToggleMenuItemAvailability,
  MenuCategory,
  MenuItem
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Tag, UtensilsCrossed, Power } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MenuManager() {
  const { data: categories, isLoading: categoriesLoading } = useListMenuCategories();
  const { data: items, isLoading: itemsLoading } = useListMenuItems();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createCategory = useCreateMenuCategory();
  const updateCategory = useUpdateMenuCategory();
  const deleteCategory = useDeleteMenuCategory();
  
  const createItem = useCreateMenuItem();
  const updateItem = useUpdateMenuItem();
  const deleteItem = useDeleteMenuItem();
  const toggleItem = useToggleMenuItemAvailability();

  const [activeTab, setActiveTab] = useState("items");
  
  // Category Form State
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catSort, setCatSort] = useState("0");

  // Item Form State
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemCatId, setItemCatId] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemImage, setItemImage] = useState("");
  const [itemAvailable, setItemAvailable] = useState(true);

  const openNewCategoryDialog = () => {
    setEditingCategory(null);
    setCatName("");
    setCatDesc("");
    setCatSort("0");
    setIsCategoryDialogOpen(true);
  };

  const openEditCategoryDialog = (category: MenuCategory) => {
    setEditingCategory(category);
    setCatName(category.name);
    setCatDesc(category.description || "");
    setCatSort(category.sortOrder.toString());
    setIsCategoryDialogOpen(true);
  };

  const openNewItemDialog = () => {
    setEditingItem(null);
    setItemCatId(categories?.[0]?.id.toString() || "");
    setItemName("");
    setItemDesc("");
    setItemPrice("");
    setItemImage("");
    setItemAvailable(true);
    setIsItemDialogOpen(true);
  };

  const openEditItemDialog = (item: MenuItem) => {
    setEditingItem(item);
    setItemCatId(item.categoryId.toString());
    setItemName(item.name);
    setItemDesc(item.description || "");
    setItemPrice(item.price.toString());
    setItemImage(item.imageUrl || "");
    setItemAvailable(item.isAvailable);
    setIsItemDialogOpen(true);
  };

  const handleSaveCategory = () => {
    const data = {
      name: catName,
      description: catDesc || undefined,
      sortOrder: parseInt(catSort) || 0
    };

    if (editingCategory) {
      updateCategory.mutate({ id: editingCategory.id, data }, {
        onSuccess: () => {
          toast({ title: "Category updated" });
          queryClient.invalidateQueries({ queryKey: ["/api/menu-categories"] });
          setIsCategoryDialogOpen(false);
        }
      });
    } else {
      createCategory.mutate({ data }, {
        onSuccess: () => {
          toast({ title: "Category created" });
          queryClient.invalidateQueries({ queryKey: ["/api/menu-categories"] });
          setIsCategoryDialogOpen(false);
        }
      });
    }
  };

  const handleDeleteCategory = (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategory.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Category deleted" });
          queryClient.invalidateQueries({ queryKey: ["/api/menu-categories"] });
        }
      });
    }
  };

  const handleSaveItem = () => {
    const data = {
      categoryId: parseInt(itemCatId),
      name: itemName,
      description: itemDesc || undefined,
      price: parseFloat(itemPrice),
      isAvailable: itemAvailable,
      imageUrl: itemImage || undefined
    };

    if (editingItem) {
      updateItem.mutate({ id: editingItem.id, data }, {
        onSuccess: () => {
          toast({ title: "Item updated" });
          queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
          setIsItemDialogOpen(false);
        }
      });
    } else {
      createItem.mutate({ data }, {
        onSuccess: () => {
          toast({ title: "Item created" });
          queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
          setIsItemDialogOpen(false);
        }
      });
    }
  };

  const handleDeleteItem = (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteItem.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Item deleted" });
          queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
        }
      });
    }
  };

  const handleToggleItem = (id: number) => {
    toggleItem.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      }
    });
  };

  return (
    <POSLayout>
      <div className="flex-1 flex flex-col h-full bg-muted/10 overflow-hidden">
        <div className="px-6 py-4 border-b bg-background shrink-0 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Menu Manager</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {items?.length ?? 0} items across {categories?.length ?? 0} categories
            </p>
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden p-6 pt-5">

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="mb-4 shrink-0 w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger 
              value="items" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              <UtensilsCrossed className="w-4 h-4 mr-2" />
              Menu Items
            </TabsTrigger>
            <TabsTrigger 
              value="categories"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              <Tag className="w-4 h-4 mr-2" />
              Categories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="flex-1 flex flex-col overflow-hidden m-0">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h2 className="text-xl font-semibold">All Items</h2>
              <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openNewItemDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingItem ? 'Edit Item' : 'New Item'}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input value={itemName} onChange={e => setItemName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={itemCatId} onValueChange={setItemCatId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map(c => (
                            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea value={itemDesc} onChange={e => setItemDesc(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Price ($)</Label>
                      <Input type="number" step="0.01" value={itemPrice} onChange={e => setItemPrice(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Image URL (Optional)</Label>
                      <Input value={itemImage} onChange={e => setItemImage(e.target.value)} />
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch id="available" checked={itemAvailable} onCheckedChange={setItemAvailable} />
                      <Label htmlFor="available">Available for ordering</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsItemDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveItem}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="flex-1 overflow-auto bg-card rounded-lg border shadow-sm">
              <Table>
                <TableHeader className="bg-muted/50 sticky top-0">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemsLoading ? (
                    <TableRow><TableCell colSpan={5} className="text-center h-24">Loading...</TableCell></TableRow>
                  ) : items?.map((item) => {
                    const cat = categories?.find(c => c.id === item.categoryId);
                    return (
                      <TableRow key={item.id} className={!item.isAvailable ? "opacity-60" : ""}>
                        <TableCell className="font-medium">
                          {item.name}
                          {item.description && <div className="text-xs text-muted-foreground font-normal truncate max-w-xs">{item.description}</div>}
                        </TableCell>
                        <TableCell>{cat?.name || "Unknown"}</TableCell>
                        <TableCell>${Number(item.price).toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch 
                              checked={item.isAvailable} 
                              onCheckedChange={() => handleToggleItem(item.id)} 
                            />
                            <span className="text-sm">{item.isAvailable ? "Available" : "Hidden"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditItemDialog(item)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteItem(item.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="flex-1 flex flex-col overflow-hidden m-0">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h2 className="text-xl font-semibold">Categories</h2>
              <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openNewCategoryDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingCategory ? 'Edit Category' : 'New Category'}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input value={catName} onChange={e => setCatName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input value={catDesc} onChange={e => setCatDesc(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Sort Order</Label>
                      <Input type="number" value={catSort} onChange={e => setCatSort(e.target.value)} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveCategory}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex-1 overflow-auto bg-card rounded-lg border shadow-sm">
              <Table>
                <TableHeader className="bg-muted/50 sticky top-0">
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoriesLoading ? (
                    <TableRow><TableCell colSpan={4} className="text-center h-24">Loading...</TableCell></TableRow>
                  ) : categories?.sort((a,b) => a.sortOrder - b.sortOrder).map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell className="text-muted-foreground w-16">{cat.sortOrder}</TableCell>
                      <TableCell className="font-medium">{cat.name}</TableCell>
                      <TableCell className="text-muted-foreground">{cat.description || "-"}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditCategoryDialog(cat)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteCategory(cat.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </POSLayout>
  );
}
