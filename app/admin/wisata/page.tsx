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
} from "@/components/core/dialog";
import { Button } from "@/components/core/button"; 
import { Input } from "@/components/core/input";
import { Label } from "@/components/core/label";
import { Textarea } from "@/components/core/textarea";
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Loader2, 
  Star,
  Banknote,
  Navigation,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { MapPicker } from "@/components/map/MapPicker";

import { useAdminStore } from "@/store/useAdminStore";
import { PageHeader } from "@/components/admin/PageHeader";
import { SearchSection } from "@/components/admin/SearchSection";
import { ActionButtons } from "@/components/admin/ActionButtons";
import { FormField } from "@/components/core/form-field";
import { WISATA_CATEGORIES } from "@/lib/wisata-categories";

// Opsi kategori untuk dropdown
const KATEGORI_OPTIONS = WISATA_CATEGORIES;


interface Wisata {
  gid: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  address: string;
  phone: string;
  link: string;
  maps_link: string;
  lng: number;
  lat: number;
}

export default function WisataManagementPage() {
  const { 
    wisata, 
    fetchWisata,
    isLoading,
    addWisata, 
    updateWisata, 
    removeWisata 
  } = useAdminStore();

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Wisata | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const [formData, setFormData] = useState<{
    name: string;
    category: string;
    price: number | string;
    rating: number | string;
    reviews: number | string;
    address: string;
    phone: string;
    link: string;
    maps_link: string;
    lng: number;
    lat: number;
  }>({
    name: "",
    category: "",
    price: 0,
    rating: 4.0,
    reviews: 0,
    address: "",
    phone: "",
    link: "",
    maps_link: "",
    lng: 110.3695,
    lat: -7.7956,
  });

  useEffect(() => {
    fetchWisata();
  }, [fetchWisata]);

  const handleOpenAdd = () => {
    setSelectedItem(null);
    setFormData({
      name: "",
      category: "",
      price: 0,
      rating: 4.5,
      reviews: 0,
      address: "",
      phone: "",
      link: "",
      maps_link: "",
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
      rating: Math.round(item.rating * 10) / 10,
      reviews: item.reviews,
      address: item.address || "",
      phone: item.phone || "",
      link: item.link || "",
      maps_link: item.maps_link || "",
      lng: item.lng,
      lat: item.lat,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    const url = selectedItem 
      ? `/api/admin/wisata/${selectedItem.gid}` 
      : "/api/admin/wisata";
    const method = selectedItem ? "PATCH" : "POST";

    const payload = {
      ...formData,
      price: Number(formData.price) || 0,
      rating: Number(formData.rating) || 0,
      reviews: Number(formData.reviews) || 0,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(selectedItem ? "Data diperbarui" : "Wisata ditambahkan");
        setIsDialogOpen(false);
        if (selectedItem) {
          updateWisata(data);
        } else {
          addWisata(data);
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

  const handleDelete = async (gid: number) => {
    try {
      const res = await fetch(`/api/admin/wisata/${gid}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Data dihapus");
        removeWisata(gid.toString());
      } else {
        toast.error("Gagal menghapus");
      }
    } catch (error) {
      toast.error("Kesalahan sistem");
    }
  };

  const filteredData = wisata.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
          ) : paginatedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-slate-500 font-bold">
                Tidak ada data wisata.
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((item) => (
              <TableRow key={item.gid}>
                <TableCell>
                  <div className="font-bold text-slate-800">{item.name}</div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">GID: {item.gid}</div>
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
                    <Star className="h-3 w-3 fill-amber-500" /> {parseFloat(item.rating as any).toFixed(2)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <ActionButtons 
                    onEdit={() => handleOpenEdit(item)}
                    onDelete={() => handleDelete(item.gid)}
                    deleteTitle="Hapus Destinasi?"
                    deleteDescription={`Apakah Anda yakin ingin menghapus ${item.name}? Data ini akan hilang permanen dari sistem.`}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm font-bold text-slate-500">
            Halaman {currentPage} dari {totalPages} <span className="font-normal">({filteredData.length} total data)</span>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="rect" 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Prev
            </Button>
            <Button 
              variant="outline" 
              size="rect" 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      <Dialog 
        open={isDialogOpen} 
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setSelectedItem(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b-2 border-black">
            <DialogTitle className="font-bold text-xl">{selectedItem ? "Edit Wisata" : "Tambah Wisata Baru"}</DialogTitle>
            <DialogDescription>
              Lengkapi detail wisata dan tentukan koordinat lokasi di peta.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6">
            <form id="wisata-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField id="name" label="Nama Destinasi">
                  <Input 
                    id="name" 
                    required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </FormField>
                <FormField id="category" label="Kategori">
                  <select
                    id="category"
                    required
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="flex h-10 w-full min-w-0 rounded-md border-2 border-black bg-white px-3 py-2 text-sm font-bold ring-offset-background transition-all outline-none shadow-[2px_2px_0px_rgba(0,0,0,1)] focus-visible:shadow-[1px_1px_0px_rgba(0,0,0,1)] focus-visible:translate-x-[1px] focus-visible:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="" disabled>Pilih kategori...</option>
                    {KATEGORI_OPTIONS.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </FormField>
                <div className="grid grid-cols-2 gap-4">
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
                      onChange={e => setFormData({...formData, rating: e.target.value})}
                    />
                  </FormField>
                  <FormField id="reviews" label="Jumlah Ulasan">
                    <Input 
                      id="reviews" 
                      type="number" 
                      required 
                      value={formData.reviews}
                      onChange={e => setFormData({...formData, reviews: e.target.value})}
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
                    onChange={e => setFormData({...formData, price: e.target.value})}
                  />
                </FormField>
                <FormField id="address" label="Alamat">
                  <Textarea 
                    id="address" 
                    rows={2}
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                  <FormField id="phone" label="No. Telepon">
                    <Input 
                      id="phone" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </FormField>
                  <FormField id="link" label="Website/Link">
                    <Input 
                      id="link" 
                      value={formData.link}
                      onChange={e => setFormData({...formData, link: e.target.value})}
                    />
                  </FormField>
                </div>
                <FormField id="maps_link" label="Link Google Maps">
                  <Input 
                    id="maps_link" 
                    value={formData.maps_link}
                    onChange={e => setFormData({...formData, maps_link: e.target.value})}
                  />
                </FormField>
              </div>

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
            </form>
          </div>

          <DialogFooter className="p-6 pt-4 border-t-2 border-black bg-slate-50">
            <Button form="wisata-form" type="submit" variant="primary" className="w-full font-bold" disabled={isSubmitLoading}>
              {isSubmitLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (selectedItem ? "Simpan Perubahan" : "Tambahkan Destinasi")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
