import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { AddOnRepository } from '@/services/storage/menuStorage';
import { calcProfit } from '@/services/calculations/profit';
import { formatMoney } from '@/services/calculations/money';
import type { AddOnGroup, AddOnOption } from '@/types';
import { uid } from '@/services/storage/storageService';
import PageHeader from '@/components/admin/PageHeader';
import Button from '@/components/ui/Button';
import BottomSheet from '@/components/ui/BottomSheet';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Field, Input, Checkbox } from '@/components/ui/FormField';

interface OptionForm extends AddOnOption {}

export default function AddonsPage() {
  const [refresh, setRefresh] = useState(0);
  const groups = useMemo(() => AddOnRepository.getAll(), [refresh]);
  const [editing, setEditing] = useState<AddOnGroup | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [required, setRequired] = useState(false);
  const [options, setOptions] = useState<OptionForm[]>([]);
  const [toDelete, setToDelete] = useState<AddOnGroup | null>(null);

  const openCreate = () => {
    setEditing(null);
    setName('');
    setRequired(false);
    setOptions([]);
    setCreating(true);
  };

  const openEdit = (g: AddOnGroup) => {
    setEditing(g);
    setName(g.name);
    setRequired(g.required);
    setOptions(g.options);
    setCreating(true);
  };

  const addOption = () => {
    setOptions((prev) => [
      ...prev,
      { id: uid('opt'), name: '', nameFr: '', nameAr: '', price: 0, cost: 0, available: true },
    ]);
  };

  const updateOption = (id: string, patch: Partial<OptionForm>) => {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  };

  const removeOption = (id: string) => setOptions((prev) => prev.filter((o) => o.id !== id));

  const save = () => {
    const payload = { name, nameFr: name, nameAr: name, required, options: options.filter((o) => o.name.trim()) };
    if (editing) {
      AddOnRepository.update(editing.id, payload);
    } else {
      AddOnRepository.create(payload);
    }
    setCreating(false);
    setRefresh((n) => n + 1);
  };

  const remove = (id: string) => {
    AddOnRepository.remove(id);
    setToDelete(null);
    setRefresh((n) => n + 1);
  };

  return (
    <div>
      <PageHeader
        title="Add-ons"
        subtitle="Manage extras and customization groups"
        action={
          <Button icon={<Plus size={16} />} onClick={openCreate}>
            New Group
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {groups.map((g) => (
          <div key={g.id} className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-ink-100">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-ink-900">{g.name}{g.required && <span className="ml-1.5 text-xs font-semibold text-brand-600">Required</span>}</p>
              <div className="flex gap-1">
                <button onClick={() => openEdit(g)} className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100"><Pencil size={15} /></button>
                <button onClick={() => setToDelete(g)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"><Trash2 size={15} /></button>
              </div>
            </div>
            <div className="mt-2 divide-y divide-ink-100">
              {g.options.map((o) => (
                <div key={o.id} className="flex items-center justify-between py-1.5 text-xs">
                  <span className="text-ink-700">{o.name}</span>
                  <span className="text-ink-500">
                    {formatMoney(o.price)} · profit {formatMoney(calcProfit(o.price, o.cost))}
                  </span>
                </div>
              ))}
              {g.options.length === 0 && <p className="py-1.5 text-xs text-ink-400">No options yet.</p>}
            </div>
          </div>
        ))}
      </div>

      <BottomSheet open={creating} onClose={() => setCreating(false)} title={editing ? 'Edit add-on group' : 'New add-on group'}>
        <div className="space-y-4 px-5 py-4">
          <Field label="Group name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <Checkbox label="Required selection" checked={required} onChange={(e) => setRequired(e.target.checked)} />

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-bold text-ink-900">Options</p>
              <Button size="sm" variant="outline" icon={<Plus size={14} />} onClick={addOption}>
                Add option
              </Button>
            </div>
            <div className="space-y-2">
              {options.map((o) => (
                <div key={o.id} className="grid grid-cols-[1fr_70px_70px_auto] items-center gap-2 rounded-lg border border-ink-100 p-2">
                  <Input placeholder="Name" value={o.name} onChange={(e) => updateOption(o.id, { name: e.target.value })} />
                  <Input type="number" placeholder="Price" value={o.price} onChange={(e) => updateOption(o.id, { price: Number(e.target.value) })} />
                  <Input type="number" placeholder="Cost" value={o.cost} onChange={(e) => updateOption(o.id, { cost: Number(e.target.value) })} />
                  <button onClick={() => removeOption(o.id)} className="text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button full size="lg" onClick={save} disabled={!name}>
            {editing ? 'Save changes' : 'Create group'}
          </Button>
        </div>
      </BottomSheet>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete add-on group"
        message={toDelete ? `Delete "${toDelete.name}"?` : ''}
        confirmLabel="Delete"
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && remove(toDelete.id)}
      />
    </div>
  );
}
