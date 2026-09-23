import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { PromoRepository } from '@/services/storage/promoStorage';
import type { PromoCode, DiscountType } from '@/types';
import PageHeader from '@/components/admin/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import BottomSheet from '@/components/ui/BottomSheet';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Field, Input, Select, Checkbox } from '@/components/ui/FormField';

function toDateInput(iso: string) {
  return iso.slice(0, 10);
}

const emptyForm = () => ({
  code: '',
  description: '',
  discountType: 'percentage' as DiscountType,
  discountValue: 10,
  minimumOrder: 0,
  maximumDiscount: '' as number | '',
  startDate: toDateInput(new Date().toISOString()),
  endDate: toDateInput(new Date(Date.now() + 30 * 86400000).toISOString()),
  usageLimit: 100,
  active: true,
});

export default function PromotionsPage() {
  const [refresh, setRefresh] = useState(0);
  const promos = useMemo(() => PromoRepository.getAll(), [refresh]);
  const [editing, setEditing] = useState<PromoCode | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [toDelete, setToDelete] = useState<PromoCode | null>(null);

  const openCreate = () => {
    setForm(emptyForm());
    setEditing(null);
    setCreating(true);
  };

  const openEdit = (p: PromoCode) => {
    setForm({
      code: p.code,
      description: p.description,
      discountType: p.discountType,
      discountValue: p.discountValue,
      minimumOrder: p.minimumOrder,
      maximumDiscount: p.maximumDiscount ?? '',
      startDate: toDateInput(p.startDate),
      endDate: toDateInput(p.endDate),
      usageLimit: p.usageLimit,
      active: p.active,
    });
    setEditing(p);
    setCreating(true);
  };

  const save = () => {
    const payload = {
      code: form.code.toUpperCase(),
      description: form.description,
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minimumOrder: Number(form.minimumOrder),
      maximumDiscount: form.maximumDiscount === '' ? undefined : Number(form.maximumDiscount),
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
      usageLimit: Number(form.usageLimit),
      active: form.active,
    };
    if (editing) {
      PromoRepository.update(editing.id, payload);
    } else {
      PromoRepository.create(payload);
    }
    setCreating(false);
    setRefresh((n) => n + 1);
  };

  const remove = (id: string) => {
    PromoRepository.remove(id);
    setToDelete(null);
    setRefresh((n) => n + 1);
  };

  return (
    <div>
      <PageHeader
        title="Promotions"
        subtitle="Create and manage discount codes"
        action={
          <Button icon={<Plus size={16} />} onClick={openCreate}>
            New Promo
          </Button>
        }
      />

      <div className="overflow-x-auto rounded-2xl bg-white shadow-card ring-1 ring-ink-100">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-xs font-semibold uppercase text-ink-400">
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Discount</th>
              <th className="px-4 py-3">Min. order</th>
              <th className="px-4 py-3">Usage</th>
              <th className="px-4 py-3">Valid until</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promos.map((p) => (
              <tr key={p.id} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/50">
                <td className="px-4 py-3 font-mono font-bold text-ink-900">{p.code}</td>
                <td className="px-4 py-3 text-ink-600">
                  {p.discountType === 'percentage' ? `${p.discountValue}%` : `${p.discountValue} DT`}
                </td>
                <td className="px-4 py-3 text-ink-600">{p.minimumOrder} DT</td>
                <td className="px-4 py-3 text-ink-600">{p.usageCount}/{p.usageLimit}</td>
                <td className="px-4 py-3 text-xs text-ink-400">{new Date(p.endDate).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <Badge tone={p.active ? 'success' : 'neutral'}>{p.active ? 'Active' : 'Inactive'}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1.5">
                    <button onClick={() => openEdit(p)} className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100"><Pencil size={16} /></button>
                    <button onClick={() => setToDelete(p)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <BottomSheet open={creating} onClose={() => setCreating(false)} title={editing ? 'Edit promo code' : 'New promo code'}>
        <div className="space-y-4 px-5 py-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Code"><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></Field>
            <Field label="Description"><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Discount type">
              <Select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value as DiscountType })}>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed amount</option>
              </Select>
            </Field>
            <Field label="Discount value"><Input type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Minimum order (DT)"><Input type="number" value={form.minimumOrder} onChange={(e) => setForm({ ...form, minimumOrder: Number(e.target.value) })} /></Field>
            <Field label="Max discount (optional)"><Input type="number" value={form.maximumDiscount} onChange={(e) => setForm({ ...form, maximumDiscount: e.target.value === '' ? '' : Number(e.target.value) })} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start date"><Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></Field>
            <Field label="End date"><Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></Field>
          </div>
          <Field label="Usage limit"><Input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })} /></Field>
          <Checkbox label="Active" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
          <Button full size="lg" onClick={save} disabled={!form.code}>
            {editing ? 'Save changes' : 'Create promo'}
          </Button>
        </div>
      </BottomSheet>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete promo code"
        message={toDelete ? `Delete "${toDelete.code}"?` : ''}
        confirmLabel="Delete"
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && remove(toDelete.id)}
      />
    </div>
  );
}
