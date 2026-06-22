"use client";

import { useState, useEffect, useRef } from "react";
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
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  X
} from "lucide-react";
import { toast } from "sonner";
import { MapPicker } from "@/components/map/MapPicker";
import * as LucideIcons from "lucide-react";

import { useAdminStore } from "@/store/useAdminStore";
import { PageHeader } from "@/components/admin/PageHeader";
import { SearchSection } from "@/components/admin/SearchSection";
import { ActionButtons } from "@/components/admin/ActionButtons";
import { FormField } from "@/components/core/form-field";
import { useCategoryStore } from "@/store/useCategoryStore";


interface Wisata {
  gid: number;
  name: string;
  category: string;
  sub_kategori?: string;
  kategori_id: number;
  sub_kategori_id?: number | null;
  price: number;
  rating: number;
  reviews: number;
  address: string;
  link: string;
  maps_link: string;
  username_instagram?: string;
  daya_tarik_utama?: string;
  daya_tarik_pendukung?: string;
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

  const { categories, fetchCategories, getCategoryColor, getCategoryIcon } = useCategoryStore();

  useEffect(() => {
    if (categories.length === 0) fetchCategories();
  }, [categories.length, fetchCategories]);

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Wisata | null>(null);

  // --- Sort & Filter State ---
  type SortKey = "name" | "rating" | "price" | "reviews";
  type SortDir = "asc" | "desc";
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [filterCategory, setFilterCategory] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortKey, sortDir, filterCategory]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40 inline" />;
    return sortDir === "asc"
      ? <ArrowUp className="h-3 w-3 ml-1 text-blue-600 inline" />
      : <ArrowDown className="h-3 w-3 ml-1 text-blue-600 inline" />;
  };

  const [formData, setFormData] = useState<{
    name: string;
    kategori_id: number | "";
    sub_kategori_id: number | "";
    price: number | string;
    rating: number | string;
    reviews: number | string;
    address: string;
    link: string;
    maps_link: string;
    username_instagram: string;
    daya_tarik_utama: string;
    daya_tarik_pendukung: string;
    lng: number;
    lat: number;
  }>({
    name: "",
    kategori_id: "",
    sub_kategori_id: "",
    price: 0,
    rating: 4.0,
    reviews: 0,
    address: "",
    link: "",
    maps_link: "",
    username_instagram: "",
    daya_tarik_utama: "",
    daya_tarik_pendukung: "",
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
      kategori_id: "",
      sub_kategori_id: "",
      price: 0,
      rating: 4.5,
      reviews: 0,
      address: "",
      link: "",
      maps_link: "",
      username_instagram: "",
      daya_tarik_utama: "",
      daya_tarik_pendukung: "",
      lng: 110.3695,
      lat: -7.7956,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: Wisata) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      kategori_id: item.kategori_id,
      sub_kategori_id: item.sub_kategori_id || "",
      price: item.price,
      rating: Math.round(item.rating * 10) / 10,
      reviews: item.reviews,
      address: item.address || "",
      link: item.link || "",
      maps_link: item.maps_link || "",
      username_instagram: item.username_instagram || "",
      daya_tarik_utama: item.daya_tarik_utama || "",
      daya_tarik_pendukung: item.daya_tarik_pendukung || "",
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

  const filteredData = wisata
    .filter(item =>
      (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       item.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterCategory.length === 0 || filterCategory.includes(item.category))
    )
    .sort((a, b) => {
      let aVal: any = a[sortKey === "price" ? "price" : sortKey === "rating" ? "rating" : sortKey === "reviews" ? "reviews" : "name"];
      let bVal: any = b[sortKey === "price" ? "price" : sortKey === "rating" ? "rating" : sortKey === "reviews" ? "reviews" : "name"];
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  // Unique categories for filter dropdown
  const uniqueCategories = Array.from(new Set(wisata.map(w => w.category))).sort();

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
            <TableHead>
              <button onClick={() => handleSort("name")} className="flex items-center font-black hover:text-blue-600 transition-colors">
                Nama Wisata <SortIcon col="name" />
              </button>
            </TableHead>
            <TableHead>
              {/* Kategori header with inline multi-select filter dropdown */}
              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => setIsFilterOpen(o => !o)}
                  className={`flex items-center gap-1 font-black transition-colors ${
                    filterCategory.length > 0 ? "text-blue-600" : "hover:text-blue-600"
                  }`}
                >
                  Kategori
                  <Filter className={`h-3.5 w-3.5 ml-0.5 ${
                    filterCategory.length > 0 ? "text-blue-600" : "opacity-40"
                  }`} />
                  {filterCategory.length > 0 && (
                    <span className="ml-1 rounded-full bg-blue-600 px-1.5 py-0.5 text-[9px] text-white font-black">
                      {filterCategory.length}
                    </span>
                  )}
                </button>

                {isFilterOpen && (
                  <div className="absolute top-full left-0 z-50 mt-1 min-w-[200px] rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] overflow-hidden">
                    <div className="flex items-center justify-between border-b-2 border-black px-3 py-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filter Kategori</p>
                      {filterCategory.length > 0 && (
                        <button
                          onClick={() => setFilterCategory([])}
                          className="text-[10px] font-black text-red-500 hover:underline flex items-center gap-0.5"
                        >
                          <X className="h-3 w-3" /> Reset
                        </button>
                      )}
                    </div>
                    <ul className="flex flex-col max-h-60 overflow-y-auto">
                      {uniqueCategories.map(cat => {
                        const color = getCategoryColor(cat);
                        const iconName = getCategoryIcon(cat);
                        const Icon = (LucideIcons as any)[iconName] || LucideIcons.MapPin;
                        const isChecked = filterCategory.includes(cat);
                        const textColor = (() => {
                          const c = color.replace('#','');
                          const r = parseInt(c.substring(0,2),16);
                          const g = parseInt(c.substring(2,4),16);
                          const b = parseInt(c.substring(4,6),16);
                          return (r*299+g*587+b*114)/1000 < 128 ? '#fff' : '#111';
                        })();
                        return (
                          <li key={cat}>
                            <button
                              onClick={() =>
                                setFilterCategory(prev =>
                                  prev.includes(cat)
                                    ? prev.filter(c => c !== cat)
                                    : [...prev, cat]
                                )
                              }
                              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold transition-colors hover:bg-slate-50 ${
                                isChecked ? "bg-blue-50" : ""
                              }`}
                            >
                              {/* Checkbox */}
                              <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 border-black transition-colors ${
                                isChecked ? "bg-blue-600" : "bg-white"
                              }`}>
                                {isChecked && <span className="text-white text-[10px] font-black leading-none">✓</span>}
                              </span>
                              {/* Category icon */}
                              <span
                                className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-black"
                                style={{ backgroundColor: color }}
                              >
                                <Icon className="h-3 w-3" strokeWidth={2.5} style={{ color: textColor }} />
                              </span>
                              {cat}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </TableHead>
            <TableHead className="text-right">
              <button onClick={() => handleSort("price")} className="flex items-center ml-auto font-black hover:text-blue-600 transition-colors">
                Harga <SortIcon col="price" />
              </button>
            </TableHead>
            <TableHead className="text-center">
              <button onClick={() => handleSort("rating")} className="flex items-center justify-center w-full font-black hover:text-blue-600 transition-colors">
                Rating <SortIcon col="rating" />
              </button>
            </TableHead>
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
                  {(() => {
                    const color = getCategoryColor(item.category);
                    const iconName = getCategoryIcon(item.category);
                    const Icon = (LucideIcons as any)[iconName] || LucideIcons.MapPin;
                    // Determine text color (dark or light) based on bg
                    const isDark = (hex: string) => {
                      const c = hex.replace('#','');
                      const r = parseInt(c.substring(0,2),16);
                      const g = parseInt(c.substring(2,4),16);
                      const b = parseInt(c.substring(4,6),16);
                      return (r*299 + g*587 + b*114) / 1000 < 128;
                    };
                    const textColor = isDark(color) ? '#fff' : '#111';
                    return (
                      <div
                        className="flex items-center gap-1.5 px-2 py-1 rounded-lg border-2 border-black text-[11px] font-black uppercase w-fit shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                        style={{ backgroundColor: color, color: textColor }}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
                        {item.category}
                      </div>
                    );
                  })()}
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
                <div className="grid grid-cols-2 gap-4">
                  <FormField id="kategori_id" label="Kategori">
                    <select
                      id="kategori_id"
                      required
                      value={formData.kategori_id}
                      onChange={e => setFormData({...formData, kategori_id: Number(e.target.value), sub_kategori_id: ""})}
                      className="flex h-10 w-full min-w-0 rounded-md border-2 border-black bg-white px-3 py-2 text-sm font-bold ring-offset-background transition-all outline-none shadow-[2px_2px_0px_rgba(0,0,0,1)] focus-visible:shadow-[1px_1px_0px_rgba(0,0,0,1)] focus-visible:translate-x-[1px] focus-visible:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="" disabled>Pilih kategori...</option>
                      {categories.map((k) => (
                        <option key={k.id} value={k.id}>{k.name}</option>
                      ))}
                    </select>
                  </FormField>
                  <FormField id="sub_kategori_id" label="Sub Kategori">
                    <select
                      id="sub_kategori_id"
                      value={formData.sub_kategori_id}
                      onChange={e => setFormData({...formData, sub_kategori_id: Number(e.target.value)})}
                      className="flex h-10 w-full min-w-0 rounded-md border-2 border-black bg-white px-3 py-2 text-sm font-bold ring-offset-background transition-all outline-none shadow-[2px_2px_0px_rgba(0,0,0,1)] focus-visible:shadow-[1px_1px_0px_rgba(0,0,0,1)] focus-visible:translate-x-[1px] focus-visible:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">(Tidak Ada)</option>
                      {categories.find(c => c.id === formData.kategori_id)?.sub_categories?.map(sk => (
                        <option key={sk.id} value={sk.id}>{sk.name}</option>
                      ))}
                    </select>
                  </FormField>
                </div>
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
                  <FormField id="username_instagram" label="Username Instagram">
                    <Input 
                      id="username_instagram" 
                      value={formData.username_instagram}
                      onChange={e => setFormData({...formData, username_instagram: e.target.value})}
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
                <div className="grid grid-cols-2 gap-4">
                  <FormField id="daya_tarik_utama" label="Daya Tarik Utama">
                    <Input 
                      id="daya_tarik_utama" 
                      value={formData.daya_tarik_utama}
                      onChange={e => setFormData({...formData, daya_tarik_utama: e.target.value})}
                    />
                  </FormField>
                  <FormField id="daya_tarik_pendukung" label="Daya Tarik Pendukung">
                    <Input 
                      id="daya_tarik_pendukung" 
                      value={formData.daya_tarik_pendukung}
                      onChange={e => setFormData({...formData, daya_tarik_pendukung: e.target.value})}
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
