import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Sparkles, Loader2 } from 'lucide-react';
import { CategoryRepository, ProductRepository } from '@/services/storage/menuStorage';
import { translateText } from '@/services/translate';
import type { Category } from '@/types';
import PageHeader from '@/components/admin/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import BottomSheet from '@/components/ui/BottomSheet';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ImagePicker from '@/components/admin/ImagePicker';
import { Field, Input, Checkbox } from '@/components/ui/FormField';
import { useToast } from '@/context/ToastContext';

const emptyForm = () => ({ name: '', nameFr: '', nameAr: '', icon: '🍽️', image: '', isActive: true });

export default function CategoriesPage() {
  const [refresh, setRefresh] = useState(0);
  const categories = useMemo(() => CategoryRepository.getAll(), [refresh]);
  const products = useMemo(() => ProductRepository.getAll(), [refresh]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [toDelete, setToDelete] = useState<Category | null>(null);
  const [translating, setTranslating] = useState(false);
  const { showToast } = useToast();

  const handleAiTranslate = async () => {
    if (!form.name.trim()) {
      showToast('Enter an English name first', 'error');
      return;
    }
    setTranslating(true);
    try {
      const [nameFr, nameAr] = await Promise.all([translateText(form.name, 'fr'), translateText(form.name, 'ar')]);
      setForm((f) => ({ ...f, nameFr: nameFr || f.nameFr, nameAr: nameAr || f.nameAr }));
      showToast('French & Arabic filled in — review before saving');
    } catch {
      showToast('Auto-translate is unavailable right now, try again later', 'error');
    } finally {
      setTranslating(false);
    }
  };

  const openCreate = () => {
    setForm(emptyForm());
    setEditing(null);
    setCreating(true);
  };

  const openEdit = (c: Category) => {
    setForm({ name: c.name, nameFr: c.nameFr, nameAr: c.nameAr, icon: c.icon, image: c.image, isActive: c.isActive });
    setEditing(c);
    setCreating(true);
  };

  const save = () => {
    const payload = {
      name: form.name,
      nameFr: form.nameFr || form.name,
      nameAr: form.nameAr || form.name,
      description: '',
      icon: form.icon,
      image: form.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      isActive: form.isActive,
    };
    if (editing) {
      CategoryRepository.update(editing.id, payload);
    } else {
      CategoryRepository.create({ ...payload, order: categories.length });
    }
    setCreating(false);
    setRefresh((n) => n + 1);
  };

  const remove = (id: string) => {
    CategoryRepository.remove(id);
    setToDelete(null);
    setRefresh((n) => n + 1);
  };

  const move = (id: string, dir: -1 | 1) => {
    const ids = categories.map((c) => c.id);
    const idx = ids.indexOf(id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= ids.length) return;
    [ids[idx], ids[swapIdx]] = [ids[swapIdx], ids[idx]];
    CategoryRepository.reorder(ids);
    setRefresh((n) => n + 1);
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        subtitle="Organize your menu into categories"
        action={
          <Button icon={<Plus size={16} />} onClick={openCreate}>
            New Category
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => (
          <div key={c.id} className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-card ring-1 ring-ink-100">
            <span className="text-2xl">{c.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-ink-900">{c.name}</p>
              <p className="text-xs text-ink-400">{products.filter((p) => p.categoryId === c.id).length} products</p>
            </div>
            <Badge tone={c.isActive ? 'success' : 'neutral'}>{c.isActive ? 'Active' : 'Hidden'}</Badge>
            <div className="flex flex-col">
              <button disabled={i === 0} onClick={() => move(c.id, -1)} className="rounded p-0.5 text-ink-400 hover:text-ink-800 disabled:opacity-30">
                <ArrowUp size={14} />
              </button>
              <button disabled={i === categories.length - 1} onClick={() => move(c.id, 1)} className="rounded p-0.5 text-ink-400 hover:text-ink-800 disabled:opacity-30">
                <ArrowDown size={14} />
              </button>
            </div>
            <button onClick={() => openEdit(c)} className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100">
              <Pencil size={15} />
            </button>
            <button onClick={() => setToDelete(c)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      <BottomSheet open={creating} onClose={() => setCreating(false)} title={editing ? 'Edit category' : 'New category'}>
        <div className="space-y-4 px-5 py-4">
          <ImagePicker value={form.image} onChange={(image) => setForm({ ...form, image })} />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field label="Name (EN)"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Name (FR)"><Input value={form.nameFr} onChange={(e) => setForm({ ...form, nameFr: e.target.value })} /></Field>
            <Field label="Name (AR)"><Input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} /></Field>
          </div>

          <button
            type="button"
            onClick={handleAiTranslate}
            disabled={translating}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {translating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {translating ? 'Translating…' : 'AI Translate → fill French & Arabic'}
          </button>

          <Field label="Icon (emoji)"><Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} /></Field>
          <Checkbox label="Active" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
          <Button full size="lg" onClick={save} disabled={!form.name}>
            {editing ? 'Save changes' : 'Create category'}
          </Button>
        </div>
      </BottomSheet>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete category"
        message={toDelete ? `Delete "${toDelete.name}"? Products in this category will remain but be uncategorized.` : ''}
        confirmLabel="Delete"
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && remove(toDelete.id)}
      />
    </div>
  );
}
