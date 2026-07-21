import Link from "next/link";
import { APP_NAME } from "@/constants";

export const metadata = {
  title: "Uslovi korišćenja",
};

export default function UsloviKoriscenjaPage() {
  return (
    <main className="page-container py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="section-title mb-3">Uslovi korišćenja</h1>
        <p className="text-sm text-slate-500">Poslednje ažuriranje: {new Date().toLocaleDateString("sr-RS")}</p>

        <div className="mt-8 space-y-8 text-base leading-relaxed text-slate-700">
          <p>
            Korišćenjem platforme {APP_NAME} potvrđujete da ste pročitali i da u potpunosti prihvatate ove Uslove
            korišćenja. Ako se ne slažete — ne koristite platformu. Nastavkom korišćenja (uključujući registraciju,
            objavu oglasa, kupovinu tokena ili kontaktiranje drugih korisnika) smatra se da ste ih prihvatili.
          </p>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">1. Šta je {APP_NAME}</h2>
            <p>
              {APP_NAME} je digitalna platforma koja omogućava povezivanje klijenata sa majstorima i izvođačima.
              Platforma <strong>nije</strong> izvođač radova, <strong>nije</strong> posrednik u ugovoru o delu,
              <strong> nije</strong> garant kvaliteta i <strong>nije</strong> strana u bilo kom dogovoru između
              korisnika.
            </p>
            <p className="mt-3">
              Uloga platforme isključivo je tehničko i informativno povezivanje. Sve što sledi nakon kontakta —
              dogovor, cena, avans, radovi, materijal, garancija, reklamacija, spor — isključivo je odnos između
              korisnika.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">2. Odgovornost je isključivo na korisniku</h2>
            <p>
              Korisnik koristi platformu <strong>isključivo na sopstvenu odgovornost</strong>. Platforma ne vrši
              punu proveru identiteta, stručnosti, licenci, osiguranja ni boniteta majstora/izvođača, niti proverava
              tačnost oglasa klijenata.
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                Vi sami odlučujete koga ćete kontaktirati, koga ćete angažovati i pod kojim uslovima.
              </li>
              <li>
                Vi ste dužni da sami proverite reference, ponudu, cenu, rokove i sve bitne uslove pre bilo kakve
                uplate ili početka radova.
              </li>
              <li>
                Vi snosite sve rizike i posledice dogovora sa drugim korisnicima, uključujući štetu na imovini,
                povrede, kašnjenja, nekvalitetan rad i finansijske gubitke.
              </li>
              <li>
                Platforma ne snosi odgovornost ako se drugi korisnik ne pojavi, ne izvrši posao, prekrši dogovor
                ili postupi protivno zakonu.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">3. Nalog i tačnost podataka</h2>
            <p>
              Prilikom registracije morate uneti tačne i potpune podatke. Odgovorni ste za čuvanje lozinke i za sve
              radnje koje se izvrše sa vašeg naloga. Zabranjeno je kreiranje lažnih naloga, korišćenje tuđeg
              identiteta i deljenje pristupa nalogu sa trećim licima radi zloupotrebe.
            </p>
            <p className="mt-3">
              Zadržavamo pravo da odbijemo registraciju, suspendujemo ili trajno ukinemo nalog ako postoji sumnja na
              zloupotrebu, lažne podatke ili kršenje ovih uslova — bez obaveze naknade ili objašnjenja.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">4. Zabranjene radnje</h2>
            <p>Strogo je zabranjeno:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>unošenje lažnih, obmanjujućih ili nepotpunih podataka;</li>
              <li>prevara, ucena, pretnje, uznemiravanje ili uvredljivo ponašanje;</li>
              <li>objavljivanje nezakonitog sadržaja ili zahtev za nezakonite usluge;</li>
              <li>spam, masovno slanje poruka i neovlašćeno prikupljanje podataka drugih korisnika;</li>
              <li>pokušaj upada u sistem, oštećenje platforme ili zaobilaženje tehničkih zaštita;</li>
              <li>preprodaja tokena, zloupotreba plaćanja ili kreiranje više naloga radi izigravanja sistema;</li>
              <li>kopiranje, scraping ili zloupotreba sadržaja i funkcionalnosti platforme.</li>
            </ul>
            <p className="mt-3">
              Kršenje ovih pravila može dovesti do uklanjanja sadržaja, gašenja naloga i, po potrebi, prijave
              nadležnim organima.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">5. Tokeni i plaćanja — bez povraćaja</h2>
            <p>
              Tokeni su digitalna dobra koja omogućavaju pristup određenim funkcijama platforme (npr. uvid u detalje
              i kontakt klijenta). Tokeni nisu novac, nisu hartija od vrednosti i ne podležu pravu na povraćaj kao
              kod klasične robe.
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong>Nema povraćaja novca</strong> za kupljene tokene, delimično iskorišćene tokene, neiskorišćene
                tokene, greške korisnika ni nezadovoljstvo ishodom dogovora sa drugim korisnikom — osim ako je
                povraćaj izričito obavezan po važećem propisu.
              </li>
              <li>
                Uplata za tokene smatra se potvrđenom tek nakon što admin proveri uplatu i odobri zahtev.
              </li>
              <li>
                Platforma ne učestvuje u plaćanjima između klijenta i majstora/izvođača i ne garantuje naplatu,
                avans ni povraćaj tih sredstava.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">6. Ograničenje odgovornosti platforme</h2>
            <p>
              U najširoj meri dozvoljenoj zakonom, {APP_NAME}, vlasnici, administratori i saradnici ne snose
              odgovornost za:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>kvalitet, cenu, rok ili ishod bilo kog posla dogovorenog van platforme;</li>
              <li>štetu na imovini, telesne povrede ili bilo kakvu materijalnu/nematerijalnu štetu;</li>
              <li>izgubljenu dobit, propuštene poslove ili prekid poslovanja;</li>
              <li>nesuglasice, prevare ili sporove između korisnika;</li>
              <li>privremenu nedostupnost sajta, greške u prikazu podataka ili gubitak podataka;</li>
              <li>postupke trećih lica, uključujući majstore, izvođače, klijente i platne institucije.</li>
            </ul>
            <p className="mt-3">
              Platforma se pruža „kakva jeste“ i „kako je dostupna“, bez bilo kakvih izričitih ili prećutnih
              garancija.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">7. Sadržaj korisnika i intelektualna svojina</h2>
            <p>
              Korisnik je isključivo odgovoran za sve što objavi (tekst, slike, kontakt, opise). Objavljivanjem
              sadržaja dajete platformi neisključivu dozvolu da taj sadržaj prikaže u okviru funkcionisanja usluge.
            </p>
            <p className="mt-3">
              Dizajn, kod, logo, naziv i sadržaj sajta {APP_NAME} zaštićeni su i ne smeju se kopirati, menjati ni
              koristiti bez naše pisane saglasnosti.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">8. Ocene i prikazi</h2>
            <p>
              Ocene i komentari predstavljaju lično mišljenje korisnika. Ne garantujemo njihovu tačnost ni
              potpunost. Zadržavamo pravo da uklonimo ocene ili sadržaj koji krši pravila, bez obaveze da zadržimo
              bilo koji sadržaj.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">9. Izmene uslova i usluge</h2>
            <p>
              Zadržavamo pravo da u bilo kom trenutku izmenimo ove uslove, funkcionalnosti platforme, cene tokena
              ili da privremeno/trajno obustavimo deo ili celu uslugu. Nastavak korišćenja nakon izmene smatra se
              prihvatanjem novih uslova.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">10. Sporovi između korisnika</h2>
            <p>
              Svi sporovi između klijenata i majstora/izvođača rešavaju se isključivo između njih. Platforma nije
              dužna da posreduje, arbitira ni da nadoknađuje bilo kakvu štetu nastalu iz takvih sporova.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">11. Kontakt</h2>
            <p>
              Za pitanja u vezi ovih uslova koristite stranicu{" "}
              <Link href="/contact" className="font-medium text-primary-800 hover:underline">
                Kontakt
              </Link>
              . Slanje poruke ne znači da platforma preuzima bilo kakvu obavezu ili odgovornost van onoga što je
              izričito navedeno u ovim uslovima.
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
