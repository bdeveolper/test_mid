import { useCallback, useEffect, useState } from 'react'
import { cancelPendingOrder, completeOrder, getOrders, returnOrder } from '../../services/orderService'

const TABS = [
  { key: 'pending', label: 'جديد', statuses: ['pending'] },
  { key: 'completed', label: 'تم', statuses: ['completed', 'returned'] },
  { key: 'closed', label: 'مرتجع/ملغي', statuses: ['returned', 'cancelled'] },
]
const money = (value) => `${new Intl.NumberFormat('en').format(Number(value))} ج.م`
const date = (value) => new Date(value).toLocaleString('en-GB')
const hasRemaining = (order) => order.order_items.some((item) => item.quantity - item.returnedQuantity > 0)
const fullyReturned = (order) => order.order_items.every((item) => item.quantity - item.returnedQuantity === 0)

function ClosedOrderCard({ order }) {
  const cancelled = order.status === 'cancelled'
  const returned = order.order_items.filter((item) => item.returnedQuantity > 0)
  const retained = order.order_items.filter((item) => item.quantity - item.returnedQuantity > 0)
  return <article className="rounded-2xl border border-neutral-100 bg-white p-4 sm:p-6">
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="font-bold text-neutral-900">الفاتورة #{order.orderNumber ?? '—'}</h2><p className="text-neutral-600">{order.customer_name}</p></div>
      <div><p className={`font-bold ${cancelled ? 'text-neutral-600' : 'text-brand-600'}`}>{cancelled ? 'ملغي' : 'مرتجع كامل'}</p><time className="text-sm text-neutral-600">{date(order.created_at)}</time></div>
    </header>
    {cancelled ? <ul className="mt-4 divide-y divide-neutral-100 border-t border-neutral-100">{order.order_items.map((item) => <li key={item.id} className="py-3 text-neutral-600">{item.product_name} — {item.size}، {item.color} — أُعيد للمخزون: {item.quantity}</li>)}</ul> : <>
      <ul className="mt-4 divide-y divide-neutral-100 border-y border-neutral-100">{returned.map((item) => <li key={item.id} className="py-3">{item.product_name} — {item.size}، {item.color} — رجع: {item.returnedQuantity} من {item.quantity}</li>)}</ul>
      {retained.length > 0 && <details className="mt-3 rounded-xl bg-neutral-100 px-4"><summary className="min-h-11 cursor-pointer py-2 font-semibold">محتفظ بها (لم تُرجع)</summary><ul>{retained.map((item) => <li key={item.id} className="py-3 text-neutral-600">{item.product_name} — {item.size}، {item.color} — الكمية المباعة غير المرتجعة: {item.quantity - item.returnedQuantity}</li>)}</ul></details>}
    </>}
  </article>
}

function ReturnOrderModal({ order, onClose, onSubmit, submitting }) {
  const [quantities, setQuantities] = useState(() =>
    Object.fromEntries(order.order_items.map((item) => [item.id, item.quantity])),
  )
  const values = order.order_items.map((item) => Number(quantities[item.id]))
  const hasSelection = values.some((value) => value > 0)
  const validQuantities = order.order_items.every((item) => {
    const rawValue = quantities[item.id]
    const value = Number(rawValue)
    return String(rawValue).trim() !== '' && Number.isInteger(value) && value >= 0 && value <= item.quantity
  })

  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-neutral-900/50 p-3 sm:items-center">
    <form role="dialog" aria-modal="true" aria-labelledby="return-order-title" onSubmit={(event) => {
      event.preventDefault()
      onSubmit(order.order_items.map((item) => ({ itemId: item.id, returnedQuantity: Number(quantities[item.id]) })))
    }} className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
      <h2 id="return-order-title" className="text-xl font-bold text-neutral-900">تسجيل مرتجعات الطلب</h2>
      <div className="my-5 flex max-h-[55vh] flex-col gap-3 overflow-y-auto">{order.order_items.map((item) => <label key={item.id} className="flex items-center justify-between gap-4">
        <span className="font-semibold text-neutral-900">{item.product_name} — {item.size}، {item.color}</span>
        <span className="flex shrink-0 items-center gap-2 text-sm text-neutral-600">المرتجع
          <input type="number" min="0" max={item.quantity} step="1" required value={quantities[item.id]} onChange={(event) => setQuantities((current) => ({ ...current, [item.id]: event.target.value }))} aria-label={`المرتجع من ${item.product_name}`} className="min-h-11 w-20 rounded-xl border border-neutral-100 px-2 text-center text-neutral-900" />
          <span>من {item.quantity}</span>
        </span>
      </label>)}</div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onClose} disabled={submitting} className="min-h-11 rounded-xl border border-neutral-100 px-4 font-semibold text-neutral-600">إغلاق</button>
        <button type="submit" disabled={submitting || !hasSelection || !validQuantities} className="min-h-11 rounded-xl bg-brand-600 px-4 font-bold text-white disabled:opacity-60">{submitting ? 'جارٍ الحفظ...' : 'تأكيد المرتجعات'}</button>
      </div>
    </form>
  </div>
}

function formatPhone(order) {
  const dial = `+${order.dial_code}`
  return `${dial} ${order.phone_e164.startsWith(dial) ? order.phone_e164.slice(dial.length) : order.phone_e164}`
}

function AdminOrders() {
  const [tab, setTab] = useState(TABS[0])
  const [orders, setOrders] = useState([])
  const [loadedTab, setLoadedTab] = useState('')
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [returningOrder, setReturningOrder] = useState(null)
  const loadOrders = useCallback(async () => { setError(''); setOrders(await getOrders(tab.statuses)) }, [tab])

  useEffect(() => {
    let active = true
    getOrders(tab.statuses).then((rows) => {
      if (!active) return
      setOrders(rows)
      setLoadedTab(tab.key)
    }).catch((loadError) => {
      if (active) { setError(loadError.message); setLoadedTab(tab.key) }
    })
    return () => { active = false }
  }, [tab])

  const visibleOrders = orders.filter((order) => tab.key === 'completed'
    ? order.status === 'completed' || (order.status === 'returned' && hasRemaining(order))
    : tab.key === 'closed'
      ? order.status === 'cancelled' || (order.status === 'returned' && fullyReturned(order))
      : order.status === 'pending')
  const runAction = async (order, action, success) => {
    setBusy(order.id); setError(''); setMessage('')
    try { await action(order.id); await loadOrders(); setMessage(success); setReturningOrder(null) }
    catch (actionError) { setError(actionError.message) }
    finally { setBusy('') }
  }
  const confirmAction = (order, action, prompt, success) => { if (window.confirm(prompt)) void runAction(order, action, success) }
  const loading = loadedTab !== tab.key

  return <section className="flex flex-col gap-5">
    <h1 className="text-2xl font-bold text-neutral-900">إدارة الطلبات</h1>
    <div role="tablist" aria-label="حالة الطلبات" className="flex flex-wrap gap-2">{TABS.map((item) => <button key={item.key} type="button" role="tab" aria-selected={tab.key === item.key} onClick={() => { setTab(item); setMessage(''); setError('') }} className={`min-h-11 rounded-full px-4 font-semibold ${tab.key === item.key ? 'bg-brand-600 text-white' : 'bg-white text-neutral-600'}`}>{item.label}</button>)}</div>
    {message && <p role="status" className="font-semibold text-success-600">{message}</p>}
    {error && <p role="alert" className="font-semibold text-danger-600">{error}</p>}
    {loading ? <p className="py-10 text-center text-neutral-600">جارٍ تحميل الطلبات...</p> : visibleOrders.length ? <div className="flex flex-col gap-4">{visibleOrders.map((order) => tab.key === 'closed' ? <ClosedOrderCard key={order.id} order={order} /> : <article key={order.id} className="rounded-2xl border border-neutral-100 bg-white p-4 sm:p-6">
      <header className="flex flex-wrap justify-between gap-3"><div>{order.orderNumber && <p className="font-semibold text-neutral-600">الفاتورة #{order.orderNumber}</p>}<h2 className="text-lg font-bold text-neutral-900">{order.customer_name}</h2><p dir="ltr" className="text-start text-neutral-600">{formatPhone(order)}</p><p className="text-neutral-600">{order.address}</p></div><div><p className="font-bold text-accent-500">{money(order.total)}</p><time className="text-sm text-neutral-600">{date(order.created_at)}</time>{order.status === 'returned' && <p className="font-semibold text-brand-600">مرتجع جزئياً</p>}</div></header>
      <ul className="my-4 divide-y divide-neutral-100 border-y border-neutral-100">{order.order_items.map((item) => <li key={item.id} className="flex flex-wrap justify-between gap-2 py-3"><span className="font-semibold">{item.product_name} — {item.size}، {item.color}{item.returnedQuantity > 0 && <span className="text-neutral-600"> — رجع: {item.returnedQuantity} من {item.quantity}</span>}</span><span className="text-neutral-600">الكمية: {item.quantity}</span></li>)}</ul>
      {tab.key === 'pending' ? <div className="flex flex-wrap gap-2"><button type="button" disabled={Boolean(busy)} onClick={() => confirmAction(order, completeOrder, 'تأكيد إتمام الطلب؟', 'تم إتمام الطلب بنجاح.')} className="min-h-11 rounded-xl bg-brand-600 px-4 font-bold text-white disabled:opacity-60">تم</button><button type="button" disabled={Boolean(busy)} onClick={() => confirmAction(order, cancelPendingOrder, 'تأكيد إلغاء الطلب؟', 'تم إلغاء الطلب بنجاح.')} className="min-h-11 rounded-xl border border-danger-600 px-4 font-bold text-danger-600 disabled:opacity-60">إلغاء</button></div> : hasRemaining(order) && ['returned', 'completed'].includes(order.status) && <button type="button" disabled={Boolean(busy)} onClick={() => setReturningOrder(order)} className="min-h-11 rounded-xl border border-neutral-100 px-4 font-bold text-brand-600 disabled:opacity-60">رجع</button>}
    </article>)}</div> : <p className="rounded-2xl border border-neutral-100 bg-white p-6 text-center text-neutral-600">لا توجد طلبات في هذا القسم.</p>}
    {returningOrder && <ReturnOrderModal order={returningOrder} submitting={busy === returningOrder.id} onClose={() => setReturningOrder(null)} onSubmit={(items) => void runAction(returningOrder, (id) => returnOrder(id, items), 'تم تسجيل المرتجعات بنجاح.')} />}
  </section>
}

export default AdminOrders
