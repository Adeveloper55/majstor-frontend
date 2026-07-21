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

        <div className="mt-8 space-y-8 text-base leading-relaxed text-slate-700">
          <p>
            Ova Pravila poslovanja uređuju način korišćenja platforme {APP_NAME} u praksi. Cilj je jasno da
            razgraniči odgovornost: platforma povezuje, a korisnici sami snose odgovornost za svoje odluke, dogovore
            i radove.
          </p>
          <p>
            Korišćenjem platforme prihvatate i{" "}
            <Link href="/uslovi-koriscenja" className="font-medium text-primary-800 hover:underline">
              Uslove korišćenja
            </Link>
            .
          </p>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">1. Osnovno pravilo</h2>
            <p>
              <strong>Svaki korisnik odgovara za sebe.</strong> {APP_NAME} ne bira majstora umesto klijenta, ne
              potpisuje ugovore, ne naplaćuje radove, ne garantuje rezultat i ne snosi štetu nastalu iz saradnje
              između korisnika.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">2. Pravila za klijente</h2>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">2.1 Objavljivanje oglasa</h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>Oglas mora biti istinit i jasan (šta treba uraditi, gde, kada, kakvo je stanje).</li>
              <li>Zabranjeno je tražiti ili nuditi nezakonite usluge.</li>
              <li>Ne objavljujte tuđe lične podatke bez dozvole.</li>
              <li>
                Oglas postaje vidljiv majstorima/izvođačima tek nakon admin pregleda. Admin može odbiti ili
                ukloniti oglas bez obaveze obrazloženja.
              </li>
            </ul>

            <h3 className="mb-2 mt-5 text-lg font-semibold text-slate-900">2.2 Dogovor i plaćanje</h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Cena rada, avans, način plaćanja, rok i garancija su isključivo stvar dogovora između vas i
                majstora/izvođača.
              </li>
              <li>
                Platforma ne posreduje u isplati i ne odgovara ako neko ne ispoštuje dogovor ili ne vrati avans.
              </li>
              <li>
                Preporuka: ne plaćajte velike iznose unapred nepoznatim licima bez provere i jasnog pisanog
                dogovora.
              </li>
            </ul>

            <h3 className="mb-2 mt-5 text-lg font-semibold text-slate-900">2.3 Vaša odgovornost</h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>Sami proveravate koga angažujete.</li>
              <li>Sami snosite rizik ako izaberete nepouzdanog izvođača.</li>
              <li>
                Reklamacije, sporovi i potraživanja rešavate direktno sa majstorom/izvođačem — ne sa platformom.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">3. Pravila za majstore i izvođače</h2>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">3.1 Profil</h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>Podaci u profilu moraju biti tačni (usluge, gradovi, kontakt, naziv firme ako postoji).</li>
              <li>Zabranjeno je lažno predstavljanje, lažne reference i obmanjujuće tvrdnje.</li>
              <li>
                Ako ste pravno lice, odgovorni ste da poslujete u skladu sa propisima (PIB, računi, dozvole gde su
                potrebne).
              </li>
            </ul>

            <h3 className="mb-2 mt-5 text-lg font-semibold text-slate-900">3.2 Rad sa oglasima i kontaktom</h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Pregled detalja/kontakta može zahtevati potrošnju tokena. Potrošeni tokeni se ne vraćaju, čak i ako
                ne dobijete posao.
              </li>
              <li>Kontakt klijenta smete koristiti samo u vezi sa konkretnim oglasom — ne za spam ni zloupotrebu.</li>
              <li>Jasno navedite šta je u ceni, a šta nije, pre početka radova.</li>
            </ul>

            <h3 className="mb-2 mt-5 text-lg font-semibold text-slate-900">3.3 Izvršenje i odgovornost</h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Vi ste isključivo odgovorni za kvalitet rada, bezbednost, materijal, rokove i eventualnu štetu
                koju nanesete.
              </li>
              <li>Platforma nije vaš poslodavac ni nalogodavac i ne garantuje vam poslove ni prihode.</li>
              <li>Sporove sa klijentom rešavate direktno sa klijentom.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">4. Tokeni</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Tokeni služe isključivo za funkcije unutar platforme.</li>
              <li>
                <strong>Nema povraćaja novca</strong> za kupljene ili potrošene tokene, osim ako je to obavezno po
                zakonu.
              </li>
              <li>
                Zloupotreba (lažni nalozi, preprodaja, pokušaj zaobilaženja naplate) dovodi do gašenja naloga bez
                prava na naknadu.
              </li>
              <li>Cene paketa i potrošnja tokena po oglasu mogu se menjati.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">5. Mere platforme</h2>
            <p>
              Bez obaveze prethodnog upozorenja, platforma može:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>ukloniti oglas, poruku, fotografiju ili ocenu;</li>
              <li>ograničiti pristup delu funkcija;</li>
              <li>privremeno ili trajno ugasiti nalog;</li>
              <li>odbijati zahteve za tokene ili registraciju kada postoji sumnja na zloupotrebu.</li>
            </ul>
            <p className="mt-3">
              Takve mere ne stvaraju pravo na odštetu niti na povraćaj novca/tokena.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">6. Odricanje od odgovornosti</h2>
            <p>
              {APP_NAME} ne garantuje da ćete pronaći majstora, dobiti posao, ostvariti dogovor ili biti zadovoljni
              ishodom. Sve odluke, uplate i radovi van platforme su na vašu odgovornost. Platforma neće snositi
              štetu niti biti strana u sudskim ili vansudskim sporovima između korisnika.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">7. Prijava zloupotrebe</h2>
            <p>
              Ako primetite prevaru ili kršenje pravila, prijavite putem{" "}
              <Link href="/contact" className="font-medium text-primary-800 hover:underline">
                Kontakta
              </Link>
              . Prijava ne obavezuje platformu da posreduje u sporu, ali nam pomaže da zaštitimo integritet usluge.
            </p>
          </section>
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
