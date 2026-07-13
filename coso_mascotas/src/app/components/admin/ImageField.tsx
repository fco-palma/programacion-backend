import { useId, useState } from "react";
import { ImagePlus, Link2, LoaderCircle, Upload } from "lucide-react";
import { api } from "../../../services/api";

interface ImageFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
  compact?: boolean;
  showUrlLabel?: boolean;
}

export function ImageField({ value, onChange, disabled = false, label = "Imagen", compact = false, showUrlLabel = true }: ImageFieldProps) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const uploadFile = async (file?: File) => {
    if (!file) return;
    setError("");
    if (!file.type.match(/^image\/(jpeg|png|webp|gif)$/)) {
      setError("Usa una imagen JPG, PNG, WebP o GIF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar los 5 MB.");
      return;
    }
    try {
      setUploading(true);
      const result = await api.uploads.image(file);
      onChange(result.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "No fue posible subir la imagen.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`rounded-2xl border border-slate-200 bg-slate-50 ${compact ? "p-3" : "p-4"}`}>
      <div className={`grid gap-4 ${compact ? "sm:grid-cols-[84px_minmax(0,1fr)]" : "sm:grid-cols-[120px_minmax(0,1fr)]"}`}>
        <div className={`overflow-hidden rounded-xl border border-slate-200 bg-white ${compact ? "h-20" : "h-28"}`}>
          {value ? (
            <img src={value} alt="Vista previa" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              <ImagePlus size={compact ? 22 : 28} />
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            {showUrlLabel && <span className="mb-2 flex items-center gap-2"><Link2 size={14} /> {label} mediante URL</span>}
            <input
              type="url"
              aria-label={`${label} mediante URL`}
              disabled={disabled || uploading}
              value={value}
              onChange={(event) => { setError(""); onChange(event.target.value); }}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </label>

          {!disabled && (
            <div className="flex flex-wrap items-center gap-3">
              <input
                id={inputId}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                disabled={uploading}
                onChange={(event) => {
                  void uploadFile(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
              <label
                htmlFor={inputId}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100 ${uploading ? "pointer-events-none opacity-60" : ""}`}
              >
                {uploading ? <LoaderCircle size={15} className="animate-spin" /> : <Upload size={15} />}
                {uploading ? "Subiendo..." : "Elegir desde el equipo"}
              </label>
              <span className="text-xs text-slate-500">Máximo 5 MB</span>
            </div>
          )}
          {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
