import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit3,
  Trash2,
  Wrench,
  Zap,
  Sparkles,
  PaintBucket,
  Thermometer,
  Hammer,
  TreePine,
  Bug,
  Search,
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useThemeContext } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { useAdminCategories } from "@/hooks/useApi";
import type { Category } from "@/types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench,
  Zap,
  Sparkles,
  PaintBucket,
  Thermometer,
  Hammer,
  TreePine,
  Bug,
};

const ICON_OPTIONS = [
  "Wrench", "Zap", "Sparkles", "PaintBucket", "Thermometer",
  "Hammer", "TreePine", "Bug",
];

export default function AdminCategories() {
  const { isDark } = useThemeContext();
  const { data: categoriesResp, isLoading } = useAdminCategories();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formIcon, setFormIcon] = useState("Wrench");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categories = useMemo(() => categoriesResp?.data ?? [], [categoriesResp]);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormName("");
    setFormDescription("");
    setFormIcon("Wrench");
    setDialogOpen(true);
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormDescription(cat.description || "");
    setFormIcon(cat.icon || "Wrench");
    setDialogOpen(true);
  };

  const handleSaveCategory = () => {
    if (!formName.trim()) return;
    setDialogOpen(false);
  };

  const handleDeleteCategory = () => {
    setDeleteDialogOpen(false);
    setDeletingCategory(null);
  };

  if (isLoading) {
    return (
      <DashboardLayout role="ADMIN">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={cn("h-48 rounded-xl animate-pulse", isDark ? "bg-slate-700" : "bg-slate-200")} />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADMIN">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className={cn(
              "text-2xl font-bold tracking-tight sm:text-3xl",
              isDark ? "text-white" : "text-slate-900"
            )}
          >
            Manage Categories
          </h1>
          <p className={cn("mt-1 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
            Add, edit, or remove service categories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("flex rounded-lg border", isDark ? "border-slate-700" : "border-slate-200")}>
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "rounded-l-lg p-2 transition-colors",
                viewMode === "grid"
                  ? "bg-primary-600 text-white"
                  : isDark
                    ? "text-slate-400 hover:bg-slate-700"
                    : "text-slate-400 hover:bg-slate-100"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "rounded-r-lg p-2 transition-colors",
                viewMode === "list"
                  ? "bg-primary-600 text-white"
                  : isDark
                    ? "text-slate-400 hover:bg-slate-700"
                    : "text-slate-400 hover:bg-slate-100"
              )}
            >
              <LayoutList className="h-4 w-4" />
            </button>
          </div>
          <Button onClick={handleAddCategory} className="bg-primary-600 hover:bg-primary-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {categories.map((cat: any, idx: number) => {
              const IconComponent = ICON_MAP[cat.icon || "Wrench"] || Wrench;
              return (
                <motion.div
                  key={cat.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card
                    className={cn(
                      "border transition-shadow hover:shadow-lg group",
                      isDark ? "border-slate-700/50 bg-slate-800/80" : "border-slate-200 bg-white"
                    )}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div
                          className={cn(
                            "flex h-14 w-14 items-center justify-center rounded-2xl",
                            isDark
                              ? "bg-primary-900/30 text-primary-400"
                              : "bg-primary-100 text-primary-600"
                          )}
                        >
                          <IconComponent className="h-7 w-7" />
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditCategory(cat)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => {
                              setDeletingCategory(cat);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <h3 className={cn("mt-4 text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>
                        {cat.name}
                      </h3>
                      <p className={cn("mt-1 text-sm line-clamp-2", isDark ? "text-slate-400" : "text-slate-500")}>
                        {cat.description || "No description"}
                      </p>
                      <div className="mt-4">
                        <Badge variant="secondary" className="text-xs">
                          {cat.serviceCount} services
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <Card
          className={cn(
            "border",
            isDark ? "border-slate-700/50 bg-slate-800/80" : "border-slate-200 bg-white"
          )}
        >
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className={cn("border-b", isDark ? "border-slate-700" : "border-slate-200")}>
                    <th className={cn("px-6 py-4 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Icon</th>
                    <th className={cn("px-6 py-4 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Name</th>
                    <th className={cn("px-6 py-4 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Description</th>
                    <th className={cn("px-6 py-4 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Services</th>
                    <th className={cn("px-6 py-4 font-medium text-right", isDark ? "text-slate-400" : "text-slate-500")}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat: any) => {
                    const IconComponent = ICON_MAP[cat.icon || "Wrench"] || Wrench;
                    return (
                      <tr
                        key={cat.id}
                        className={cn(
                          "border-b transition-colors last:border-0",
                          isDark ? "border-slate-700/50 hover:bg-slate-700/30" : "border-slate-100 hover:bg-slate-50"
                        )}
                      >
                        <td className="px-6 py-4">
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-xl",
                              isDark ? "bg-primary-900/30 text-primary-400" : "bg-primary-100 text-primary-600"
                            )}
                          >
                            <IconComponent className="h-5 w-5" />
                          </div>
                        </td>
                        <td className={cn("px-6 py-4 font-semibold", isDark ? "text-white" : "text-slate-900")}>
                          {cat.name}
                        </td>
                        <td className={cn("px-6 py-4 max-w-[300px] truncate", isDark ? "text-slate-400" : "text-slate-500")}>
                          {cat.description || "No description"}
                        </td>
                        <td className={cn("px-6 py-4", isDark ? "text-slate-300" : "text-slate-600")}>
                          {cat.serviceCount}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleEditCategory(cat)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() => {
                                setDeletingCategory(cat);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Category Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className={cn("sm:max-w-md", isDark && "bg-slate-800 border-slate-700")}>
          <DialogHeader>
            <DialogTitle className={cn(isDark && "text-white")}>
              {editingCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory ? "Update the category details" : "Create a new service category"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-slate-700")}>
                Name
              </label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Category name"
                className={cn("mt-1", isDark && "bg-slate-700 border-slate-600 text-white")}
              />
            </div>
            <div>
              <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-slate-700")}>
                Description
              </label>
              <Textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Category description"
                rows={3}
                className={cn("mt-1", isDark && "bg-slate-700 border-slate-600 text-white")}
              />
            </div>
            <div>
              <label className={cn("text-sm font-medium mb-2 block", isDark ? "text-slate-300" : "text-slate-700")}>
                Icon
              </label>
              <div className="grid grid-cols-4 gap-2">
                {ICON_OPTIONS.map((iconName) => {
                  const IconComp = ICON_MAP[iconName] || Wrench;
                  return (
                    <button
                      key={iconName}
                      onClick={() => setFormIcon(iconName)}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition-all",
                        formIcon === iconName
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                          : isDark
                            ? "border-slate-700 hover:border-slate-600"
                            : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <IconComp
                        className={cn(
                          "h-5 w-5",
                          formIcon === iconName
                            ? "text-primary-600 dark:text-primary-400"
                            : isDark
                              ? "text-slate-400"
                              : "text-slate-500"
                        )}
                      />
                      <span className={cn("text-[9px]", isDark ? "text-slate-500" : "text-slate-400")}>
                        {iconName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className={cn(isDark && "border-slate-700 text-slate-300")}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveCategory} className="bg-primary-600 hover:bg-primary-700 text-white">
              {editingCategory ? "Save Changes" : "Create Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className={cn("sm:max-w-sm", isDark && "bg-slate-800 border-slate-700")}>
          <DialogHeader>
            <DialogTitle className={cn(isDark && "text-white")}>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingCategory?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className={cn(isDark && "border-slate-700 text-slate-300")}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
