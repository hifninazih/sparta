"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  MapPin,
  CheckCircle2,
  XCircle,
  Tag,
  Mountain,
  Trees,
  Waves,
  Coffee,
  Utensils,
  ShoppingBag,
  Tent,
  Camera,
  Landmark,
  Car
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { PageHeader } from "@/components/admin/PageHeader";
import { SearchSection } from "@/components/admin/SearchSection";
import { ActionButtons } from "@/components/admin/ActionButtons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/core/table";
import { Loader2 } from "lucide-react";
import { FormField } from "@/components/core/form-field";
import { AdminCategory, useAdminCategoryStore } from "@/store/useAdminCategoryStore";
import { Button } from "@/components/core/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/core/dialog";

import { SubCategoryDialog } from "./SubCategoryDialog";

const AVAILABLE_ICONS = [
  { name: "MapPin", component: MapPin },
  { name: "Mountain", component: Mountain },
  { name: "Trees", component: Trees },
  { name: "Waves", component: Waves },
  { name: "Tent", component: Tent },
  { name: "Coffee", component: Coffee },
  { name: "Utensils", component: Utensils },
  { name: "ShoppingBag", component: ShoppingBag },
  { name: "Camera", component: Camera },
  { name: "Landmark", component: Landmark },
  { name: "Car", component: Car },
];

export default function CategoryManagementPage() {
  const { 
    categories, 
    fetchCategories,
    isLoading,
    addCategory, 
    updateCategory, 
    removeCategory 
  } = useAdminCategoryStore();

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AdminCategory | null>(null);
  
  const [isSubDialogOpen, setIsSubDialogOpen] = useState(false);
  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState<AdminCategory | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    color: string;
    icon: string;
    is_active: boolean;
  }>({
    name: "",
    color: "#FF8038",
    icon: "MapPin",
    is_active: true,
  });

  useEffect(() => {
    fetchCategories(searchQuery);
  }, [searchQuery, fetchCategories]);

  const handleOpenDialog = (item?: AdminCategory) => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        name: item.name,
        color: item.color || "#000000",
        icon: item.icon || "MapPin",
        is_active: item.is_active,
      });
    } else {
      setSelectedItem(null);
      setFormData({
        name: "",
        color: "#FF8038",
        icon: "MapPin",
        is_active: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    try {
      if (selectedItem) {
        await updateCategory(selectedItem.id, formData);
        toast.success("Kategori berhasil diperbarui");
      } else {
        await addCategory(formData);
        toast.success("Kategori berhasil ditambahkan");
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await removeCategory(id);
      toast.success("Kategori berhasil dihapus");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-10 space-y-6">
      <PageHeader 
        title="Manajemen Kategori" 
        description="Kelola kategori wisata, warna penanda peta, dan status."
        icon={<Tag className="h-8 w-8 text-black" />}
      >
        <Button 
          variant="primary" 
          size="lg" 
          onClick={() => handleOpenDialog()} 
          className="font-bold"
          startIcon={<Plus />}
        >
          Tambah Kategori
        </Button>
      </PageHeader>

      <SearchSection 
        placeholder="Cari kategori..."
        value={searchQuery}
        onChange={setSearchQuery}
        onRefresh={() => fetchCategories(searchQuery)}
        isLoading={isLoading}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kategori</TableHead>
            <TableHead>Preview Marker</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-600" />
              </TableCell>
            </TableRow>
          ) : filteredCategories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-slate-500 font-bold">
                Tidak ada data kategori.
              </TableCell>
            </TableRow>
          ) : (
            filteredCategories.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="font-bold text-slate-800">{item.name}</div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">ID: {item.id}</div>
                </TableCell>
                <TableCell>
                  {(() => {
                    const iconName = item.icon || "MapPin";
                    const Icon = (LucideIcons as any)[iconName] || LucideIcons.MapPin;
                    return (
                      <div className="flex items-center gap-3">
                        {/* Preview Marker Bulat */}
                        <div 
                          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                          style={{ backgroundColor: item.color }}
                        >
                          <Icon className="h-4 w-4 text-black" />
                        </div>
                        {/* Nama Icon (Opsional, buat penjelas) */}
                        <span className="text-xs font-bold text-slate-500">{iconName}</span>
                      </div>
                    );
                  })()}
                </TableCell>
                <TableCell className="text-center">
                  {item.is_active ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-green-300 px-2.5 py-1 text-[10px] font-black uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Aktif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-gray-200 px-2.5 py-1 text-[10px] font-black uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                      <XCircle className="h-3.5 w-3.5" />
                      Nonaktif
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="rect" 
                      onClick={() => {
                        setSelectedCategoryForSub(item);
                        setIsSubDialogOpen(true);
                      }}
                      className="h-8 px-2 text-xs font-bold"
                    >
                      Sub Kategori ({item.sub_categories?.length || 0})
                    </Button>
                    <ActionButtons 
                      onEdit={() => handleOpenDialog(item)}
                      onDelete={() => handleDelete(item.id)}
                      deleteTitle="Hapus Kategori?"
                      deleteDescription={`Apakah Anda yakin ingin menghapus kategori ${item.name}? Ini tidak dapat dibatalkan.`}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Modal Dialog for Create/Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-2 border-black sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">
              {selectedItem ? "Edit Kategori" : "Tambah Kategori"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4 space-y-6">
            <FormField id="name" label="Nama Kategori">
              <input
                id="name"
                required
                placeholder="Misal: Wisata Kuliner"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="flex h-10 w-full rounded-md border-2 border-black bg-white px-3 py-2 text-sm font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] outline-none transition-all focus-visible:translate-x-[1px] focus-visible:translate-y-[1px] focus-visible:shadow-[1px_1px_0px_rgba(0,0,0,1)]"
              />
            </FormField>

            <FormField id="color" label="Warna Map Marker (HEX)">
              <div className="flex gap-2">
                <input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={e => setFormData({...formData, color: e.target.value})}
                  className="h-10 w-14 cursor-pointer rounded-md border-2 border-black bg-white p-1 shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all focus-visible:translate-x-[1px] focus-visible:translate-y-[1px] focus-visible:shadow-[1px_1px_0px_rgba(0,0,0,1)]"
                />
                <input
                  type="text"
                  required
                  pattern="^#[0-9A-Fa-f]{6}$"
                  placeholder="#000000"
                  value={formData.color}
                  onChange={e => setFormData({...formData, color: e.target.value})}
                  className="flex h-10 flex-1 rounded-md border-2 border-black bg-white px-3 py-2 font-mono text-sm font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] outline-none transition-all focus-visible:translate-x-[1px] focus-visible:translate-y-[1px] focus-visible:shadow-[1px_1px_0px_rgba(0,0,0,1)]"
                />
              </div>
            </FormField>

            <FormField id="icon" label="Pilih Ikon Penanda">
              <div className="grid grid-cols-6 gap-2">
                {AVAILABLE_ICONS.map((icon) => {
                  const IconComp = icon.component;
                  const isSelected = formData.icon === icon.name;
                  return (
                    <button
                      key={icon.name}
                      type="button"
                      onClick={() => setFormData({...formData, icon: icon.name})}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-md border-2 border-black transition-all",
                        isSelected 
                          ? "bg-black text-white shadow-none translate-y-[2px] translate-x-[2px]" 
                          : "bg-white text-slate-600 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_rgba(0,0,0,1)]"
                      )}
                      title={icon.name}
                    >
                      <IconComp className="h-5 w-5" />
                    </button>
                  );
                })}
              </div>
            </FormField>

            <FormField id="is_active" label="Status Kategori">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, is_active: !formData.is_active})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full border-2 border-black transition-colors ${formData.is_active ? 'bg-primary' : 'bg-gray-300'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full border-2 border-black bg-white transition-transform ${formData.is_active ? 'translate-x-5' : 'translate-x-1'}`}
                  />
                </button>
                <span className="text-sm font-bold">
                  {formData.is_active ? 'Aktif (Akan tampil)' : 'Nonaktif (Disembunyikan)'}
                </span>
              </div>
            </FormField>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitLoading}>
                {isSubmitLoading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <SubCategoryDialog 
        category={selectedCategoryForSub ? categories.find(c => c.id === selectedCategoryForSub.id) || null : null}
        isOpen={isSubDialogOpen}
        onClose={() => setIsSubDialogOpen(false)}
      />
    </div>
  );
}
