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

        <div className="prose prose-slate mt-8 max-w-none">
          <p>
            Dobrodošli na {APP_NAME}. Korišćenjem sajta, aplikacije i usluga platforme potvrđujete da ste pročitali,
            razumeli i da prihvatate ove Uslove korišćenja. Ako se ne slažete sa bilo kojim delom ovih uslova, nemojte
            koristiti platformu.
          </p>

          <h2>1. Definicije</h2>
          <ul>
            <li>
              <strong>Platforma</strong> – veb sajt i/ili aplikacija {APP_NAME} i sve povezane funkcionalnosti.
            </li>
            <li>
              <strong>Korisnik</strong> – svako lice koje pristupa platformi (uključujući i neregistrovane posetioce).
            </li>
            <li>
              <strong>Klijent</strong> – korisnik koji objavljuje upit/posao ili traži majstora/izvođača.
            </li>
            <li>
              <strong>Majstor/Izvođač</strong> – korisnik koji nudi usluge i odgovara na upite.
            </li>
            <li>
              <strong>Sadržaj</strong> – informacije, oglasi, opisi poslova, poruke, ocene, fotografije i drugi materijali
              koje korisnici unose ili razmenjuju putem platforme.
            </li>
          </ul>

          <h2>2. Priroda usluge i uloga platforme</h2>
          <p>
            Platforma služi kao mesto za povezivanje klijenata i majstora/izvođača. {APP_NAME} nije pružalac usluga
            izvođenja radova, ne učestvuje u ugovaranju, ne garantuje ishod posla i ne preuzima odgovornost za kvalitet,
            cenu, rok, zakonitost ili bezbednost radova.
          </p>

          <h2>3. Odgovornost korisnika</h2>
          <ul>
            <li>
              Korisnik koristi platformu <strong>na sopstvenu odgovornost</strong>.
            </li>
            <li>
              Korisnik je dužan da samostalno proveri identitet, reference, licencu/registraciju (ako je primenljivo),
              kao i uslove ponude i cenu pre bilo kakvog dogovora.
            </li>
            <li>
              Svaki dogovor o poslu (uključujući cenu, rokove, garancije, materijal, račun/fakturu) je isključivo između
              klijenta i majstora/izvođača.
            </li>
          </ul>

          <h2>4. Nalog, tačnost podataka i bezbednost</h2>
          <p>
            Kada kreirate nalog, saglasni ste da unesete tačne i ažurne podatke i da čuvate pristupne podatke. Vi ste
            odgovorni za sve radnje koje se izvrše sa vašeg naloga.
          </p>

          <h2>5. Zabranjeno ponašanje</h2>
          <p>Na platformi je zabranjeno:</p>
          <ul>
            <li>unošenje lažnih podataka, lažno predstavljanje ili obmanjivanje;</li>
            <li>objavljivanje nezakonitog, uvredljivog, pretećeg, diskriminatornog ili obmanjujućeg sadržaja;</li>
            <li>spam, masovno slanje poruka i neovlašćeno prikupljanje podataka;</li>
            <li>pokušaj probijanja bezbednosti, zloupotreba sistema ili automatizovan pristup bez dozvole;</li>
            <li>kršenje prava intelektualne svojine trećih lica.</li>
          </ul>

          <h2>6. Sadržaj korisnika</h2>
          <p>
            Korisnik je isključivo odgovoran za sadržaj koji objavljuje. Zadržavamo pravo da uklonimo sadržaj koji krši
            ove uslove ili važeće propise, kao i da suspendujemo ili ukinemo nalog u slučaju zloupotrebe.
          </p>

          <h2>7. Ocene i recenzije</h2>
          <p>
            Ocene i recenzije predstavljaju lično iskustvo korisnika. Ne garantujemo tačnost, potpunost ili objektivnost
            recenzija. Zadržavamo pravo moderacije i uklanjanja sadržaja koji krši pravila.
          </p>

          <h2>8. Tokeni, plaćanja i nepovrat</h2>
          <p>
            Ako platforma omogućava kupovinu tokena, kredita ili drugih digitalnih dobara, korisnik prihvata da je reč o
            digitalnoj usluzi/dobru koje može biti iskorišćeno odmah po uplati.
          </p>
          <ul>
            <li>
              <strong>Nema povraćaja novca</strong> za kupljene tokene/kredite, osim ako je važećim propisima izričito
              drugačije obavezno.
            </li>
            <li>
              Ne odgovaramo za dogovore, sporove, naplatu ili povraćaj sredstava između klijenta i majstora/izvođača.
            </li>
            <li>
              U slučaju sumnje na zloupotrebu, možemo privremeno ograničiti nalog ili transakcije radi provere.
            </li>
          </ul>

          <h2>9. Ograničenje odgovornosti</h2>
          <p>
            U najvećoj meri dozvoljenoj zakonom, {APP_NAME} ne snosi odgovornost za bilo kakvu direktnu ili indirektnu
            štetu, izgubljenu dobit, prekid poslovanja, povrede, štetu na imovini, sporove ili potraživanja nastala iz
            korišćenja platforme ili dogovora između korisnika.
          </p>

          <h2>10. Dostupnost i izmene usluge</h2>
          <p>
            Platformu pružamo „kakva jeste“ i „kako je dostupna“. Možemo menjati, privremeno obustaviti ili trajno
            ukinuti delove usluge bez prethodne najave.
          </p>

          <h2>11. Privatnost</h2>
          <p>
            Obrada podataka vrši se u skladu sa pravilima privatnosti i važećim propisima. Ako imate pitanja, kontaktirajte
            nas putem stranice{" "}
            <Link href="/contact" className="font-medium text-primary-800 hover:underline">
              Kontakt
            </Link>
            .
          </p>

          <h2>12. Rešavanje sporova</h2>
          <p>
            Korisnici su saglasni da pokušaju mirno rešavanje nesporazuma. Platforma može, ali nije obavezna, da pruži
            posrednu pomoć kroz podršku korisnicima.
          </p>

          <h2>13. Kontakt</h2>
          <p>
            Za pitanja u vezi ovih uslova, posetite{" "}
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
