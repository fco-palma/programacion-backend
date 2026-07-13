import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import type { StoreSettings } from "../../data/storeSettings";
import logo from "../../../assets/lily-pets-logo-transparent.png";
import facebookIcon from "../../../assets/social/facebook.png";
import instagramIcon from "../../../assets/social/instagram.png";
import tiktokIcon from "../../../assets/social/tiktok.png";

const MAPS_URL = "https://maps.app.goo.gl/zNsq3c94itT7n5HE8";
const DEFAULT_ADDRESS = "27 Oriente 22 y media Norte 3431, Talca, Maule.";

export function Footer({ settings }: { settings: StoreSettings }) {
  const mapsUrl = settings.address === DEFAULT_ADDRESS
    ? MAPS_URL
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`;
  const socialNetworks = [
    { label: "Instagram", icon: instagramIcon, href: settings.instagramUrl },
    { label: "Facebook", icon: facebookIcon, href: settings.facebookUrl },
    { label: "TikTok", icon: tiktokIcon, href: settings.tiktokUrl },
  ];

  return (
    <footer className="bg-[#2C1A0E] text-white/70">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[0.8fr_1.5fr_1fr] md:items-start md:gap-10 md:py-12">
        <section className="flex flex-col items-center text-center md:items-start md:text-left">
          <a href="#" aria-label="Lily Pets - Inicio" className="inline-flex rounded-2xl p-1 transition hover:-translate-y-0.5 hover:drop-shadow-xl">
          <img src={logo} alt="Lily Pets Store" className="h-28 w-28 object-contain drop-shadow-lg sm:h-36 sm:w-36" />
          </a>
          <p className="mt-3 max-w-48 text-sm leading-6 text-white/60">Tu tienda de confianza en Talca.</p>
        </section>

        <section>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-white/45">Ubicación</p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Abrir ubicación en Google Maps: ${settings.address}`}
            className="group flex items-start gap-4 transition hover:-translate-y-0.5"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-400/15 text-sky-200">
              <MapPin size={20} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold leading-6 text-white">Lily Pets Store — Talca</span>
              <span className="mt-1 block text-sm leading-6 text-white/60">{settings.address}</span>
              <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-sky-200 transition group-hover:text-sky-100">
                Abrir en Google Maps <ExternalLink size={13} />
              </span>
            </span>
          </a>
          <div className="mt-4 space-y-1 text-sm text-white/60">
            <a href={`tel:${settings.supportPhone.replace(/\s/g, "")}`} className="flex min-h-11 items-center gap-2 transition hover:text-white"><Phone size={15} /> {settings.supportPhone}</a>
            <a href={`mailto:${settings.storeEmail}`} className="flex min-h-11 items-center gap-2 transition hover:text-white"><Mail size={15} /> {settings.storeEmail}</a>
          </div>
        </section>

        <section>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-white/45">Redes sociales</p>
          <div className="flex flex-col items-start gap-4">
            {socialNetworks.map(({ label, icon, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white">
                <img src={icon} alt="" aria-hidden="true" className="h-[18px] w-[18px] object-contain brightness-0 invert opacity-90" />
                {label}
              </a>
            ))}
          </div>
        </section>
      </div>

      <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-white/30">
        © {new Date().getFullYear()} Lily Pets Store · Talca, Chile
      </div>
    </footer>
  );
}
