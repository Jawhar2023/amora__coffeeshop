import { useRef, useState } from 'react';
import { ImagePlus, Loader2, Link2, X } from 'lucide-react';
import { resizeImageFile } from '@/utils/image';
import { useToast } from '@/context/ToastContext';

export default function ImagePicker({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [showUrlField, setShowUrlField] = useState(false);
  const { showToast } = useToast();

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please choose an image file', 'error');
      return;
    }
    setLoading(true);
    try {
      const dataUrl = await resizeImageFile(file);
      onChange(dataUrl);
    } catch {
      showToast('Could not load that image', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-600">Photo</span>

      <div className="flex items-center gap-3">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-ink-100 ring-1 ring-ink-200">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-ink-300">
              <ImagePlus size={22} />
            </div>
          )}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <Loader2 size={18} className="animate-spin text-brand-600" />
            </div>
          )}
          {value && !loading && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink-900/70 text-white"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-brand-300 bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100"
          >
            <ImagePlus size={15} /> Upload from device
          </button>
          <button
            type="button"
            onClick={() => setShowUrlField((s) => !s)}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-ink-200 px-3 py-2 text-xs font-semibold text-ink-500 hover:bg-ink-50"
          >
            <Link2 size={13} /> {showUrlField ? 'Hide URL field' : 'Or paste an image URL'}
          </button>
        </div>
      </div>

      {showUrlField && (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="mt-2 w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-500"
        />
      )}
    </div>
  );
}
