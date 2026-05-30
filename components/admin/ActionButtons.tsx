"use client";

import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/core/alert-dialog";

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  deleteTitle?: string;
  deleteDescription?: string;
  isProtected?: boolean;
  protectedLabel?: string;
}

export function ActionButtons({
  onEdit,
  onDelete,
  deleteTitle = "Hapus Data?",
  deleteDescription = "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.",
  isProtected = false,
  protectedLabel = "Protected",
}: ActionButtonsProps) {
  if (isProtected) {
    return (
      <span className="px-2 text-xs font-bold text-slate-400 italic">
        {protectedLabel}
      </span>
    );
  }

  return (
    <div className="flex items-center justify-end space-x-2">
      <button
        type="button"
        className="rounded-md p-2 text-blue-600 transition-colors hover:cursor-pointer hover:bg-blue-50"
        onClick={onEdit}
        title="Edit"
      >
        <Pencil className="h-4 w-4" />
      </button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            type="button"
            className="rounded-md p-2 text-red-600 transition-colors hover:cursor-pointer hover:bg-red-50"
            title="Hapus"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>{deleteDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
