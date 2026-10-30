'use client';

import { useState } from 'react';
import type { Car, Dealer } from '@/lib/types';

const TIMES = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

export default function TestDriveForm({ cars, dealers }: { cars: Car[]; dealers: Dealer[] }) {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    modelSlug: cars[0]?.slug || '',
    dealerId: '',
    preferredDate: '',
    preferredTime: '10:00',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<null | { ok: boolean; message: string }>(null);

  const set = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.fullName.trim().length < 2) e.fullName = 'Vui lòng nhập họ tên';
    if (form.phone.trim().replace(/\D/g, '').length < 8) e.phone = 'Số điện thoại không hợp lệ';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Email không hợp lệ';
    if (!form.modelSlug) e.modelSlug = 'Chọn dòng xe';
    if (!form.preferredDate) e.preferredDate = 'Chọn ngày lái thử';
    return e;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setSubmitting(true);
    setDone(null);
    try {
      const res = await fetch('/api/test-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          dealerId: form.dealerId ? Number(form.dealerId) : null,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || 'Đăng ký thất bại');
      setDone({ ok: true, message: body.message });
      setForm((f) => ({ ...f, fullName: '', phone: '', email: '', message: '' }));
    } catch (err) {
      setDone({ ok: false, message: err instanceof Error ? err.message : 'Đăng ký thất bại' });
    } finally {
      setSubmitting(false);
    }
  };

  if (done?.ok) {
    return (
      <div className="form-success">
        <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Đăng ký thành công</div>
        <p style={{ marginBottom: 20 }}>{done.message}</p>
        <button type="button" className="btn btn--secondary" onClick={() => setDone(null)}>
          Đăng ký thêm
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="fullName">Họ và tên *</label>
          <input
            id="fullName"
            value={form.fullName}
            onChange={(e) => set('fullName', e.target.value)}
            placeholder="Nguyễn Văn A"
          />
          {errors.fullName && <span className="form-error">{errors.fullName}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="phone">Số điện thoại *</label>
          <input
            id="phone"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="090 000 0000"
          />
          {errors.phone && <span className="form-error">{errors.phone}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="ban@email.com"
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="modelSlug">Dòng xe *</label>
          <select id="modelSlug" value={form.modelSlug} onChange={(e) => set('modelSlug', e.target.value)}>
            {cars.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name} {c.variant}
              </option>
            ))}
          </select>
          {errors.modelSlug && <span className="form-error">{errors.modelSlug}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="dealerId">Showroom BMW</label>
          <select id="dealerId" value={form.dealerId} onChange={(e) => set('dealerId', e.target.value)}>
            <option value="">— Chọn showroom gần nhất —</option>
            {dealers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} · {d.city}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="preferredDate">Ngày mong muốn *</label>
          <input
            id="preferredDate"
            type="date"
            value={form.preferredDate}
            onChange={(e) => set('preferredDate', e.target.value)}
          />
          {errors.preferredDate && <span className="form-error">{errors.preferredDate}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="preferredTime">Giờ mong muốn</label>
          <select id="preferredTime" value={form.preferredTime} onChange={(e) => set('preferredTime', e.target.value)}>
            {TIMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field form-field--full">
          <label htmlFor="message">Ghi chú</label>
          <textarea
            id="message"
            rows={4}
            value={form.message}
            onChange={(e) => set('message', e.target.value)}
            placeholder="Yêu cầu thêm của bạn (tùy chọn)"
          />
        </div>
        <div className="form-field form-field--full">
          <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
            {submitting ? 'Đang gửi…' : 'Đăng ký lái thử'}
          </button>
        </div>
      </div>
      {done && !done.ok && <p className="form-error" style={{ marginTop: 16 }}>{done.message}</p>}
    </form>
  );
}
