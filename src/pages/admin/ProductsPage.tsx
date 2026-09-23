import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Search, Sparkles, Loader2 } from 'lucide-react';
import { ProductRepository, CategoryRepository } from '@/services/storage/menuStorage';
import { calcProfit, calcProfitMargin } from '@/services/calculations/profit';
import { formatMoney } from '@/services/calculations/money';
import { translateText } from '@/services/translate';
import type { Product } from '@/types';
import PageHeader from '@/components/admin/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import BottomSheet from '@/components/ui/BottomSheet';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ImagePicker from '@/components/admin/ImagePicker';
import { Field, Input, Select, Textarea, Checkbox } from '@/components/ui/FormField';
import { useToast } from '@/context/ToastContext';

const emptyForm = () => ({
  name: '',
  nameFr: '',
  nameAr: '',
  description: '',
  descriptionFr: '',
  descriptionAr: '',
  categoryId: '',
  price: 0,
  cost: 0,
  discountPrice: undefined as number | undefined,
  image: '',
  preparationTime: 15,
  available: true,
  featured: false,
  popular: false,
  spicy: false,
  vegetarian: false,
  ingredients: '',
  allergens: '',
  tags: '',
});

export default function ProductsPage() {
  const [refresh, setRefresh] = useState(0);
  const products = useMemo(() => ProductRepository.getAll(), [refresh]);
  const categories = useMemo(() => CategoryRepository.getAll(), []);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [translating, setTranslating] = useState(false);
  const { showToast } = useToast();

  const handleAiTranslate = async () => {
    if (!form.name.trim()) {
      showToast('Enter an English name first', 'error');
      return;
    }
    setTranslating(true);
    try {
      const [nameFr, nameAr, descriptionFr, descriptionAr] = await Promise.all([
        translateText(form.name, 'fr'),
        translateText(form.name, 'ar'),
        form.description ? translateText(form.description, 'fr') : Promise.resolve(''),
        form.description ? translateText(form.description, 'ar') : Promise.resolve(''),
      ]);
      setForm((f) => ({
        ...f,
        nameFr: nameFr || f.nameFr,
        nameAr: nameAr || f.nameAr,
        descriptionFr: descriptionFr || f.descriptionFr,
        descriptionAr: descriptionAr || f.descriptionAr,
      }));
      showToast('French & Arabic filled in — review before saving');
    } catch {
      showToast('Auto-translate is unavailable right now, try again later', 'error');
    } finally {
      setTranslating(false);
    }
  };

  const filtered = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  const openCreate = () => {
    setForm(emptyForm());
    setEditing(null);
    setCreating(true);
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name,
      nameFr: p.nameFr,
      nameAr: p.nameAr,
      description: p.description,
      descriptionFr: p.descriptionFr,
      descriptionAr: p.descriptionAr,
      categoryId: p.categoryId,
      price: p.price,
      cost: p.cost,
      discountPrice: p.discountPrice,
      image: p.image,
      preparationTime: p.preparationTime,
      available: p.available,
      featured: p.featured,
      popular: p.popular,
      spicy: !!p.spicy,
      vegetarian: !!p.vegetarian,
      ingredients: p.ingredients.join(', '),
      allergens: p.allergens.join(', '),
      tags: p.tags.join(', '),
    });
    setEditing(p);
    setCreating(true);
  };

  const save = () => {
    const payload = {
      name: form.name,
      nameFr: form.nameFr || form.name,
      nameAr: form.nameAr || form.name,
      description: form.description,
      descriptionFr: form.descriptionFr || form.description,
      descriptionAr: form.descriptionAr || form.description,
      categoryId: form.categoryId,
      price: Number(form.price),
      cost: Number(form.cost),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      image: form.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      available: form.available,
      featured: form.featured,
      popular: form.popular,
      spicy: form.spicy,
      vegetarian: form.vegetarian,
      preparationTime: Number(form.preparationTime),
      ingredients: form.ingredients.split(',').map((s) => s.trim()).filter(Boolean),
      allergens: form.allergens.split(',').map((s) => s.trim()).filter(Boolean),
      tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
      addOnGroups: editing?.addOnGroups ?? [],
      rating: editing?.rating ?? 4.5,
      reviewCount: editing?.reviewCount ?? 0,
      isNew: editing?.isNew ?? false,
    };
    if (editing) {
      ProductRepository.update(editing.id, payload);
    } else {
      ProductRepository.create(payload);
    }
    setCreating(false);
    setRefresh((n) => n + 1);
  };

  const remove = (id: string) => {
    ProductRepository.remove(id);
    setToDelete(null);
    setRefresh((n) => n + 1);
  };

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Manage your menu items, pricing, and profit"
        action={
          <Button icon={<Plus size={16} />} onClick={openCreate}>
            New Product
          </Button>
        }
      />

      <div className="relative mb-4 max-w-sm">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-xl border border-ink-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-400"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-card ring-1 ring-ink-100">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-xs font-semibold uppercase text-ink-400">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Cost</th>
              <th className="px-4 py-3">Profit</th>
              <th className="px-4 py-3">Margin</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const category = categories.find((c) => c.id === p.categoryId);
              const profit = calcProfit(p.price, p.cost);
              const margin = calcProfitMargin(p.price, p.cost);
              return (
                <tr key={p.id} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <img src={p.image} className="h-9 w-9 rounded-lg object-cover" />
                      <span className="font-semibold text-ink-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-600">{category?.name ?? '—'}</td>
                  <td className="px-4 py-3 font-semibold text-ink-900">{formatMoney(p.price)}</td>
                  <td className="px-4 py-3 text-ink-500">{formatMoney(p.cost)}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-600">{formatMoney(profit)}</td>
                  <td className="px-4 py-3 text-ink-600">{margin.toFixed(1)}%</td>
                  <td className="px-4 py-3">
                    <Badge tone={p.available ? 'success' : 'danger'}>{p.available ? 'Available' : 'Sold out'}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => openEdit(p)} className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setToDelete(p)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <BottomSheet open={creating} onClose={() => setCreating(false)} title={editing ? 'Edit product' : 'New product'}>
        <div className="space-y-4 px-5 py-4">
          <ImagePicker value={form.image} onChange={(image) => setForm({ ...form, image })} />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field label="Name (EN)"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Name (FR)"><Input value={form.nameFr} onChange={(e) => setForm({ ...form, nameFr: e.target.value })} /></Field>
            <Field label="Name (AR)"><Input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} /></Field>
          </div>
          <Field label="Description (EN)"><Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>

          <button
            type="button"
            onClick={handleAiTranslate}
            disabled={translating}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {translating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {translating ? 'Translating…' : 'AI Translate → fill French & Arabic'}
          </button>

          <Field label="Category">
            <Select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Selling Price (DT)"><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></Field>
            <Field label="Cost (DT)"><Input type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })} /></Field>
            <Field label="Prep Time (min)"><Input type="number" value={form.preparationTime} onChange={(e) => setForm({ ...form, preparationTime: Number(e.target.value) })} /></Field>
          </div>

          <div className="rounded-xl bg-brand-50 p-3 text-sm">
            <div className="flex justify-between"><span className="text-ink-600">Profit</span><span className="font-bold text-emerald-600">{formatMoney(calcProfit(Number(form.price), Number(form.cost)))}</span></div>
            <div className="flex justify-between"><span className="text-ink-600">Margin</span><span className="font-bold text-ink-900">{calcProfitMargin(Number(form.price), Number(form.cost)).toFixed(1)}%</span></div>
          </div>

          <Field label="Ingredients (comma separated)"><Input value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} /></Field>
          <Field label="Allergens (comma separated)"><Input value={form.allergens} onChange={(e) => setForm({ ...form, allergens: e.target.value })} /></Field>
          <Field label="Tags (comma separated)"><Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></Field>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <Checkbox label="Available" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} />
            <Checkbox label="Featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            <Checkbox label="Popular" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} />
            <Checkbox label="Spicy" checked={form.spicy} onChange={(e) => setForm({ ...form, spicy: e.target.checked })} />
            <Checkbox label="Vegetarian" checked={form.vegetarian} onChange={(e) => setForm({ ...form, vegetarian: e.target.checked })} />
          </div>

          <Button full size="lg" onClick={save} disabled={!form.name || !form.categoryId}>
            {editing ? 'Save changes' : 'Create product'}
          </Button>
        </div>
      </BottomSheet>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete product"
        message={toDelete ? `Delete "${toDelete.name}"? This cannot be undone.` : ''}
        confirmLabel="Delete"
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && remove(toDelete.id)}
      />
    </div>
  );
}
