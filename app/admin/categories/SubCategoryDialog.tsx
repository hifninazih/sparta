"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/core/dialog";
import { Button } from "@/components/core/button";
import { Input } from "@/components/core/input";
import { ActionButtons } from "@/components/admin/ActionButtons";
import { AdminCategory, AdminSubCategory, useAdminCategoryStore } from "@/store/useAdminCategoryStore";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

export function SubCategoryDialog({ 
  category, 
  isOpen, 
  onClose 
}: { 
  category: AdminCategory | null; 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  const { addSubCategory, updateSubCategory, removeSubCategory } = useAdminCategoryStore();
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", is_active: true });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({ name: "", is_active: true });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;
    
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateSubCategory(editingId, formData, category.id);
        toast.success("Sub kategori diperbarui");
      } else {
        await addSubCategory(category.id, formData);
        toast.success("Sub kategori ditambahkan");
      }
      resetForm();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (sub: AdminSubCategory) => {
    setEditingId(sub.id);
    setFormData({ name: sub.name, is_active: sub.is_active });
  };

  const handleDelete = async (sub: AdminSubCategory) => {
    if (!category) return;
    try {
      await removeSubCategory(sub.id, category.id);
      toast.success("Sub kategori dihapus");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (!category) return null;

  let isSubmitDisabled = isSubmitting;
  if (editingId && category) {
    const originalSub = category.sub_categories?.find(s => s.id === editingId);
    if (originalSub) {
      if (formData.name.trim() === "") {
        isSubmitDisabled = true;
      } else if (formData.name === originalSub.name && formData.is_active === originalSub.is_active) {
        isSubmitDisabled = true;
      }
    }
  } else {
    if (formData.name.trim() === "") {
      isSubmitDisabled = true;
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetForm();
        onClose();
      }
    }}>
      <DialogContent className="max-w-2xl border-2 border-black">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">Sub Kategori: {category.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Form Tambah/Edit */}
          <form onSubmit={handleSubmit} className="flex gap-4 items-end bg-slate-50 p-4 border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-bold">Nama Sub Kategori</label>
              <Input 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Contoh: Pegunungan"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold block">Status</label>
              <button
                type="button"
                onClick={() => setFormData({...formData, is_active: !formData.is_active})}
                className={`relative inline-flex h-10 w-16 items-center rounded-md border-2 border-black transition-colors ${formData.is_active ? 'bg-primary' : 'bg-gray-300'}`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-sm border-2 border-black bg-white transition-transform ${formData.is_active ? 'translate-x-8' : 'translate-x-1'}`}
                />
              </button>
            </div>
            <Button type="submit" disabled={isSubmitDisabled} className="h-10">
              {editingId ? "Simpan Edit" : "Tambah"}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm} className="h-10">
                Batal
              </Button>
            )}
          </form>

          {/* Tabel Sub Kategori */}
          <div className="border-2 border-black rounded-lg overflow-hidden shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 border-b-2 border-black font-bold uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 border-r-2 border-black">Nama</th>
                  <th className="px-4 py-3 border-r-2 border-black text-center w-24">Status</th>
                  <th className="px-4 py-3 text-right w-24">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {!category.sub_categories?.length ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-slate-500 font-bold">
                      Belum ada sub kategori.
                    </td>
                  </tr>
                ) : (
                  category.sub_categories.map((sub, idx) => (
                    <tr key={sub.id} className={idx !== category.sub_categories!.length - 1 ? "border-b border-slate-200" : ""}>
                      <td className="px-4 py-3 border-r border-slate-200 font-bold">{sub.name}</td>
                      <td className="px-4 py-3 border-r border-slate-200 text-center">
                        {sub.is_active ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-400 mx-auto" />
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <ActionButtons 
                          onEdit={() => handleEditClick(sub)}
                          onDelete={() => handleDelete(sub)}
                          deleteTitle="Hapus Sub Kategori?" 
                          deleteDescription={`Apakah Anda yakin ingin menghapus sub kategori "${sub.name}"? Tindakan ini tidak bisa dibatalkan.`}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
