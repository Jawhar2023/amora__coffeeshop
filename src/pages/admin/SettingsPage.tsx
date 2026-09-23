import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { SettingsRepository } from '@/services/storage/settingsStorage';
import { resetDemoData } from '@/data/seed';
import type { Language } from '@/types';
import PageHeader from '@/components/admin/PageHeader';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Field, Input, Select, Checkbox } from '@/components/ui/FormField';
import { useToast } from '@/context/ToastContext';

export default function SettingsPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState(SettingsRepository.get());
  const [confirmReset, setConfirmReset] = useState(false);

  const save = () => {
    SettingsRepository.update(settings);
    showToast('Settings saved');
  };

  const doReset = () => {
    resetDemoData();
    setConfirmReset(false);
    showToast('Demo data has been reset');
    window.setTimeout(() => window.location.reload(), 600);
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Restaurant configuration and feature toggles" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl bg-white p-5 shadow-card ring-1 ring-ink-100">
          <p className="text-sm font-bold text-ink-900">Restaurant Info</p>
          <Field label="Restaurant name">
            <Input value={settings.restaurantName} onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone"><Input value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} /></Field>
            <Field label="Email"><Input value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} /></Field>
          </div>
          <Field label="Address"><Input value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} /></Field>
          <Field label="Opening hours"><Input value={settings.openingHours} onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Facebook URL"><Input value={settings.facebookUrl} onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })} /></Field>
            <Field label="Instagram URL"><Input value={settings.instagramUrl} onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })} /></Field>
            <Field label="TikTok URL"><Input value={settings.tiktokUrl} onChange={(e) => setSettings({ ...settings, tiktokUrl: e.target.value })} /></Field>
          </div>
          <Field label="WhatsApp number" hint="International format, digits only (e.g. 21650577392). New orders are sent here automatically.">
            <Input value={settings.whatsappNumber} onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })} />
          </Field>
        </div>

        <div className="space-y-4 rounded-2xl bg-white p-5 shadow-card ring-1 ring-ink-100">
          <p className="text-sm font-bold text-ink-900">Pricing</p>
          <Field label="Currency"><Input value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })} /></Field>
          <Field label="Default language">
            <Select value={settings.defaultLanguage} onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value as Language })}>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </Select>
          </Field>
          <Field label="Google Review URL">
            <Input value={settings.googleReviewUrl} onChange={(e) => setSettings({ ...settings, googleReviewUrl: e.target.value })} />
          </Field>
        </div>

        <div className="space-y-3 rounded-2xl bg-white p-5 shadow-card ring-1 ring-ink-100 lg:col-span-2">
          <p className="text-sm font-bold text-ink-900">Feature toggles</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            <Checkbox label="Games" checked={settings.enableGames} onChange={(e) => setSettings({ ...settings, enableGames: e.target.checked })} />
            <Checkbox label="Ordering" checked={settings.enableOrdering} onChange={(e) => setSettings({ ...settings, enableOrdering: e.target.checked })} />
            <Checkbox label="Promo codes" checked={settings.enablePromoCodes} onChange={(e) => setSettings({ ...settings, enablePromoCodes: e.target.checked })} />
            <Checkbox label="Favorites" checked={settings.enableFavorites} onChange={(e) => setSettings({ ...settings, enableFavorites: e.target.checked })} />
            <Checkbox label="Customer notes" checked={settings.enableCustomerNotes} onChange={(e) => setSettings({ ...settings, enableCustomerNotes: e.target.checked })} />
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button size="lg" onClick={save}>
          Save settings
        </Button>
        <Button size="lg" variant="danger" icon={<RotateCcw size={16} />} onClick={() => setConfirmReset(true)}>
          Reset Demo Data
        </Button>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="Reset demo data"
        message="This will erase all current data and reload the original demo dataset (products, orders, customers, etc). This cannot be undone."
        confirmLabel="Reset everything"
        onCancel={() => setConfirmReset(false)}
        onConfirm={doReset}
      />
    </div>
  );
}
