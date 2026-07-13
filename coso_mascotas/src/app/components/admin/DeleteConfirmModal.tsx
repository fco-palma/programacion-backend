import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";

interface DeleteConfirmModalProps {
  open: boolean;
  productName: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteConfirmModal({ open, productName, onConfirm, onClose }: DeleteConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Eliminar producto?</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. El producto quedará eliminado del catálogo.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 rounded-3xl bg-slate-50 p-5 text-slate-700">
          <p className="text-sm">Nombre:</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{productName}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
