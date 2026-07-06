import Link from "next/link";
import { APP_NAME } from "@/constants";

export const metadata = {
  title: "Pravila poslovanja",
};

export default function PravilaPoslovanjaPage() {
  return (
    <main className="page-container py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="section-title mb-3">Pravila poslovanja</h1>
        <p className="text-sm text-slate-500">Poslednje ažuriranje: {new Date().toLocaleDateString("sr-RS")}</p>

        <div className="prose prose-slate mt-8 max-w-none">
          <p>
            Ova pravila objašnjavaju kako se platforma {APP_NAME} koristi u praksi i koja su očekivanja od klijenata i
            majstora/izvođača. Cilj je bezbedna i fer saradnja, uz jasno razgraničenje odgovornosti.
          </p>

          <h2>1. Osnovni principi</h2>
          <ul>
            <li>
              <strong>Transparentnost</strong>: tačan opis posla, jasna cena, realni rokovi.
            </li>
            <li>
              <strong>Kultura komunikacije</strong>: bez uvreda, pritiska ili obmanjivanja.
            </li>
            <li>
              <strong>Bezbednost</strong>: dogovori i radovi se realizuju uz razumnu pažnju i oprez.
            </li>
            <li>
              <strong>Odgovornost korisnika</strong>: korisnici sami biraju sa kim sarađuju i snose posledice te odluke.
            </li>
          </ul>

          <h2>2. Pravila za klijente</h2>
          <h3>2.1 Objavljivanje posla</h3>
          <ul>
            <li>Opišite posao što preciznije (lokacija, kvadratura, materijal, hitnost, željeni termin).</li>
            <li>Ne objavljujte tuđe kontakt podatke bez dozvole.</li>
            <li>Ne tražite i ne nudite nezakonite usluge.</li>
          </ul>

          <h3>2.2 Komunikacija i dogovor</h3>
          <ul>
            <li>Pre dogovora tražite okvirnu cenu, rok i šta je uključeno (materijal, prevoz, demontaža, odvoz šuta).</li>
            <li>Preporuka je pisani trag (poruke) i, za veće poslove, pisani predračun/ugovor.</li>
            <li>Avans i isplata su stvar dogovora strana; platforma ne garantuje naplatu niti posreduje u isplati.</li>
          </ul>

          <h3>2.3 Bezbednost</h3>
          <ul>
            <li>Ne uplaćujte novac unapred nepoznatim licima bez provere i jasnog dogovora.</li>
            <li>Za radove većeg obima proverite da li je potrebna prijava radova, dozvole ili angažovanje ovlašćenih lica.</li>
          </ul>

          <h2>3. Pravila za majstore/izvođače</h2>
          <h3>3.1 Profil i istinitost informacija</h3>
          <ul>
            <li>Podaci u profilu moraju biti istiniti (ime/preduzeće, usluge, gradovi, iskustvo).</li>
            <li>Zabranjeno je lažno predstavljanje, lažne reference i obmanjujuće tvrdnje.</li>
          </ul>

          <h3>3.2 Ponuda i izvršenje posla</h3>
          <ul>
            <li>U ponudi navedite šta je uključeno u cenu i šta nije.</li>
            <li>Poštujte dogovorene rokove ili odmah obavestite klijenta o promenama.</li>
            <li>Garancije, računi i uslovi reklamacije su stvar dogovora između strana.</li>
          </ul>

          <h3>3.3 Komunikacija i ponašanje</h3>
          <ul>
            <li>Bez pritiska, pretnji, uvreda, ucena ili neprikladnog ponašanja.</li>
            <li>Zabranjeno je slanje spam poruka i masovno kontaktiranje bez realnog interesa za posao.</li>
          </ul>

          <h2>4. Tokeni / krediti (ako su primenljivi)</h2>
          <ul>
            <li>Tokeni služe za pristup određenim funkcionalnostima (npr. uvid u detalje posla).</li>
            <li>
              <strong>Nema povraćaja novca</strong> za kupljene tokene/kredite, osim ako je obavezno drugačije po zakonu.
            </li>
            <li>Zabranjena je zloupotreba (npr. preprodaja, pokušaj zaobilaženja sistema, lažni nalozi).</li>
          </ul>

          <h2>5. Moderacija i mere</h2>
          <p>
            U slučaju kršenja pravila, platforma može preduzeti mere bez obaveze prethodnog upozorenja, uključujući:
          </p>
          <ul>
            <li>uklanjanje sadržaja (oglasa, poruka, slika);</li>
            <li>privremeno ograničenje funkcija;</li>
            <li>suspendovanje ili trajno gašenje naloga;</li>
            <li>odbijanje ili poništavanje zahteva u slučaju sumnje na prevaru ili zloupotrebu.</li>
          </ul>

          <h2>6. Odricanje od odgovornosti</h2>
          <p>
            Platforma {APP_NAME} nije strana u dogovoru između klijenata i majstora/izvođača. Sve aktivnosti, radovi,
            plaćanja, reklamacije i sporovi su isključivo na odgovornost korisnika.
          </p>

          <h2>7. Prijava zloupotrebe</h2>
          <p>
            Ako primetite sumnjivo ponašanje ili zloupotrebu, prijavite putem{" "}
            <Link href="/contact" className="font-medium text-primary-800 hover:underline">
              Kontakt
            </Link>
            .
          </p>
        </div>

        <div className="mt-10">
          <Link href="/" className="text-sm font-medium text-primary-800 hover:underline">
            Nazad na početnu
          </Link>
        </div>
      </div>
    </main>
  );
}
