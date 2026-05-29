"use client";

import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/core/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/core/dialog";
import { Button } from "@/components/core/button"; 
import { Input } from "@/components/core/input";
import { Label } from "@/components/core/label";
import { Textarea } from "@/components/core/textarea";
import { 
  MapPin, 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2, 
  Search,
  RefreshCw,
  Star,
  Banknote,
  Navigation
} from "lucide-react";
import { toast } from "sonner";
import { MapPicker } from "@/components/map/MapPicker";

import { useAdminStore } from "@/store/useAdminStore";
import { PageHeader } from "@/components/admin/PageHeader";
import { SearchSection } from "@/components/admin/SearchSection";
import { ActionButtons } from "@/components/admin/ActionButtons";
import { FormField } from "@/components/core/form-field";

interface Wisata {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  all_facility: string;
  lng: number;
  lat: number;
}

export default function WisataManagementPage() {
  const { 
    wisata, 
    fetchWisata,
    isWisataLoaded, 
    isLoading,
    addWisata, 
    updateWisata, 
    removeWisata 
  } = useAdminStore();

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Wisata | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: 0,
    rating: 4.0,
    all_facility: "",
    lng: 110.3695,
    lat: -7.7956,
  });

  useEffect(() => {
    fetchWisata();
  }, [fetchWisata]);

  // ... rest of handlers
  const handleOpenAdd = () => {
    setSelectedItem(null);
    setFormData({
      name: "",
      category: "",
      price: 0,
      rating: 4.5,
      all_facility: "",
      lng: 110.3695,
      lat: -7.7956,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: Wisata) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      rating: item.rating,
      all_facility: item.all_facility,
      lng: item.lng,
      lat: item.lat,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    const url = selectedItem 
      ? `/api/admin/wisata/${selectedItem.id}` 
      : "/api/admin/wisata";
    const method = selectedItem ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(selectedItem ? "Data diperbarui" : "Wisata ditambahkan");
        setIsDialogOpen(false);
        if (selectedItem) {
          updateWisata(data); // Optimistic update
        } else {
          addWisata(data); // Optimistic update
        }
      } else {
        const err = await res.json();
        toast.error(err.message || "Gagal menyimpan data");
      }
    } catch (error) {
      toast.error("Kesalahan jaringan");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/wisata/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Data dihapus");
        removeWisata(id); // Optimistic update
      } else {
        toast.error("Gagal menghapus");
      }
    } catch (error) {
      toast.error("Kesalahan sistem");
    }
  };


  // Client-side filtering for blazing fast search
  const filteredData = wisata.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <div className="p-6 sm:p-10 space-y-6">
      <PageHeader 
        title="Data Wisata DIY" 
        description="Kelola titik lokasi dan kriteria SAW untuk setiap destinasi."
        icon={<MapPin className="h-8 w-8" />}
      >
        <Button 
          variant="primary" 
          size="lg" 
          onClick={handleOpenAdd} 
          className="font-bold"
          startIcon={<Plus />}
        >
          Tambah Wisata
        </Button>
      </PageHeader>

      <SearchSection 
        placeholder="Cari nama wisata atau kategori..."
        value={searchQuery}
        onChange={setSearchQuery}
        onRefresh={() => fetchWisata(true)}
        isLoading={isLoading}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Wisata</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead className="text-right">Harga</TableHead>
            <TableHead className="text-center">Rating</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-600" />
              </TableCell>
            </TableRow>
          ) : filteredData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-slate-500 font-bold">
                Tidak ada data wisata.
              </TableCell>
            </TableRow>
          ) : (
            filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="font-bold text-slate-800">{item.name}</div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">ID: {item.id}</div>
                </TableCell>
                <TableCell>
                  <div className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-300 text-[10px] font-black uppercase w-fit">
                    {item.category}
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-slate-700">
                  Rp {item.price.toLocaleString('id-ID')}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1 text-amber-500 font-black">
                    <Star className="h-3 w-3 fill-amber-500" /> {item.rating}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <ActionButtons 
                    onEdit={() => handleOpenEdit(item)}
                    onDelete={() => handleDelete(item.id)}
                    deleteTitle="Hapus Destinasi?"
                    deleteDescription={`Apakah Anda yakin ingin menghapus ${item.name}? Data ini akan hilang permanen dari sistem.`}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Form Dialog */}
      <Dialog 
        open={isDialogOpen} 
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setSelectedItem(null);
            setFormData({
              name: "",
              category: "",
              price: 0,
              rating: 4.5,
              all_facility: "",
              lng: 110.3695,
              lat: -7.7956,
            });
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-bold text-xl">{selectedItem ? "Edit Wisata" : "Tambah Wisata Baru"}</DialogTitle>
            <DialogDescription>
              Lengkapi detail wisata dan tentukan koordinat lokasi di peta.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Kiri: Atribut Data */}
            <div className="space-y-4">
              <FormField id="name" label="Nama Destinasi">
                <Input 
                  id="name" 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField id="category" label="Kategori">
                  <Input 
                    id="category" 
                    placeholder="Alam, Budaya, dll"
                    required 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  />
                </FormField>
                <FormField id="rating" label="Rating (1-5)">
                  <Input 
                    id="rating" 
                    type="number" 
                    step="0.1" 
                    min="1" 
                    max="5"
                    startIcon={<Star className="h-4 w-4 text-amber-500" />}
                    required 
                    value={formData.rating}
                    onChange={e => setFormData({...formData, rating: parseFloat(e.target.value)})}
                  />
                </FormField>
              </div>
              <FormField id="price" label="Harga Tiket (Rp)">
                <Input 
                  id="price" 
                  type="number" 
                  startIcon={<Banknote className="h-4 w-4 text-green-600" />}
                  required 
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: parseInt(e.target.value)})}
                />
              </FormField>
              <FormField id="facilities" label="Fasilitas (Pisahkan dengan koma)">
                <Textarea 
                  id="facilities" 
                  placeholder="Toilet, Parkir, Mushola, dll"
                  rows={3}
                  value={formData.all_facility}
                  onChange={e => setFormData({...formData, all_facility: e.target.value})}
                />
              </FormField>
            </div>

            {/* Kanan: Lokasi / Peta */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2 font-bold text-black border-none shadow-none">
                <Navigation className="h-4 w-4 text-blue-600" /> Lokasi Geografis
              </Label>

              <MapPicker 
                lng={formData.lng} 
                lat={formData.lat} 
                onChange={(lng, lat) => setFormData({...formData, lng, lat})}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField id="lng" label="Longitude">
                  <Input 
                    type="number" 
                    step="any" 
                    value={formData.lng} 
                    onChange={e => setFormData({...formData, lng: parseFloat(e.target.value)})}
                    className="h-8 text-xs font-mono"
                  />
                </FormField>
                <FormField id="lat" label="Latitude">
                  <Input 
                    type="number" 
                    step="any" 
                    value={formData.lat} 
                    onChange={e => setFormData({...formData, lat: parseFloat(e.target.value)})}
                    className="h-8 text-xs font-mono"
                  />
                </FormField>
              </div>
            </div>

            <DialogFooter className="col-span-full border-t-2 border-black pt-6">
              <Button variant="primary" className="w-full font-bold" disabled={isSubmitLoading}>
                {isSubmitLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (selectedItem ? "Simpan Perubahan" : "Tambahkan Destinasi")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
