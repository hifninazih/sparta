import { Button } from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog";
import { ArrowRight, ArrowLeft, MapPinPlus, LocateFixed } from "lucide-react";
import { BobotSlider } from "./bobot-slider";

export function PreferensiDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="p-4">
          <DialogTitle className="py-2 text-center text-base font-semibold">
            Dari mana Anda akan memulai perjalanan?
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col">
          {/* Tombol lokasi */}
          <div className="flex w-full justify-center gap-2">
            <Button variant="primary" size={"rect"} endIcon={<MapPinPlus />}>
              Pilih Lokasi
            </Button>
            <Button variant="primary" size={"rect"} endIcon={<LocateFixed />}>
              Lokasi Saya
            </Button>
          </div>
          {/* Slider */}
          <BobotSlider />
        </div>
        <DialogFooter className="rounded-b-xl border-t bg-black/10 p-4">
          <div className="flex w-full justify-between">
            <Button variant="primary" size={"rect"} startIcon={<ArrowLeft />}>
              Sebelumnya
            </Button>
            <Button variant="gradient" size={"rect"} endIcon={<ArrowRight />}>
              Selanjutnya
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
