import { Button, ZoomButton } from "@/components/button";
import { LogIn, MapPinSearch, Layers, LocateFixed } from "lucide-react";

export default function Components() {
  return (
    <div className="flex gap-1 p-4">
      <Button variant={"primary"} size={"lg"} startIcon={<LogIn />}>
        Login
      </Button>

      <Button variant={"gradient"} size={"lg"} startIcon={<MapPinSearch />}>
        Rekomendasi Wisata
      </Button>

      <Button variant={"primary"} size={"lg"} startIcon={<Layers />}>
        Peta Dasar
      </Button>

      <Button
        variant={"outline"}
        size={"lg"}
        startIcon={<MapPinSearch />}
      ></Button>

      <Button
        variant={"primary"}
        size={"rect"}
        startIcon={<LocateFixed />}
      ></Button>

      <ZoomButton />
    </div>
  );
}
