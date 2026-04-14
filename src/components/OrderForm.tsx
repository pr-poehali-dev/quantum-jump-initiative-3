import { useState } from "react";
import Icon from "@/components/ui/icon";

const SEND_ORDER_URL = "https://functions.poehali.dev/e9a3351f-b960-4a52-9c3a-e1b103733e3d";

export default function OrderForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    from_place: "",
    to_place: "",
    date: "",
    passengers: "",
    comment: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(SEND_ORDER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", phone: "", from_place: "", to_place: "", date: "", passengers: "", comment: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full bg-transparent border-b border-neutral-600 text-white placeholder-neutral-400 py-3 text-sm focus:outline-none focus:border-white transition-colors duration-300";

  return (
    <section id="contact" className="bg-neutral-950 py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-white text-3xl md:text-5xl font-bold tracking-tight mb-3">
          ЗАКАЗАТЬ ТРАНСФЕР
        </h2>
        <p className="text-neutral-400 mb-12 text-sm uppercase tracking-wide">
          Заполните форму — свяжемся в течение 15 минут
        </p>

        {status === "success" ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              <Icon name="Check" size={32} className="text-white" />
            </div>
            <h3 className="text-white text-2xl font-bold">Заявка отправлена!</h3>
            <p className="text-neutral-400">Мы свяжемся с вами в ближайшее время</p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 text-white border-b border-white text-sm uppercase tracking-wide hover:text-neutral-400 hover:border-neutral-400 transition-colors duration-300"
            >
              Отправить ещё одну
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-neutral-400 text-xs uppercase tracking-wide mb-1 block">Ваше имя *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Иван Иванов"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-neutral-400 text-xs uppercase tracking-wide mb-1 block">Телефон *</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+7 900 000 00 00"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-neutral-400 text-xs uppercase tracking-wide mb-1 block">Откуда</label>
                <input
                  name="from_place"
                  value={form.from_place}
                  onChange={handleChange}
                  placeholder="Горно-Алтайск, аэропорт"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-neutral-400 text-xs uppercase tracking-wide mb-1 block">Куда</label>
                <input
                  name="to_place"
                  value={form.to_place}
                  onChange={handleChange}
                  placeholder="Телецкое озеро"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-neutral-400 text-xs uppercase tracking-wide mb-1 block">Дата поездки</label>
                <input
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  className={inputClass + " [color-scheme:dark]"}
                />
              </div>
              <div>
                <label className="text-neutral-400 text-xs uppercase tracking-wide mb-1 block">Количество пассажиров</label>
                <select
                  name="passengers"
                  value={form.passengers}
                  onChange={handleChange}
                  className={inputClass + " [color-scheme:dark] cursor-pointer"}
                >
                  <option value="" className="bg-neutral-900">Выберите...</option>
                  <option value="1" className="bg-neutral-900">1 человек</option>
                  <option value="2" className="bg-neutral-900">2 человека</option>
                  <option value="3" className="bg-neutral-900">3 человека</option>
                  <option value="4" className="bg-neutral-900">4 человека</option>
                  <option value="5-7" className="bg-neutral-900">5–7 человек</option>
                  <option value="8+" className="bg-neutral-900">8 и более</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-neutral-400 text-xs uppercase tracking-wide mb-1 block">Комментарий</label>
              <textarea
                name="comment"
                value={form.comment}
                onChange={handleChange}
                placeholder="Пожелания по маршруту, остановки, багаж..."
                rows={3}
                className={inputClass + " resize-none"}
              />
            </div>

            {status === "error" && (
              <p className="text-red-400 text-sm">Ошибка отправки. Попробуйте ещё раз или позвоните нам напрямую.</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-white text-black px-8 py-4 uppercase tracking-wide text-sm font-semibold hover:bg-neutral-200 transition-colors duration-300 cursor-pointer disabled:opacity-50 w-full md:w-fit flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  Отправляем...
                </>
              ) : (
                <>
                  <Icon name="Send" size={16} />
                  Отправить заявку
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
