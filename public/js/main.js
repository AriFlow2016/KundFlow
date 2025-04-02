document.addEventListener('DOMContentLoaded', function() {
  // Knappar för navigering
  const visaKunderBtn = document.getElementById('visa-kunder');
  const visaProjektBtn = document.getElementById('visa-projekt');
  const läggTillKundBtn = document.getElementById('lägg-till-kund');
  
  // Sektioner
  const dashboardSection = document.getElementById('dashboard');
  const kundListaSection = document.getElementById('kund-lista');
  const kunderContainer = document.getElementById('kunder-container');
  
  // Händelsehanterare för knappar
  visaKunderBtn.addEventListener('click', function() {
    dashboardSection.classList.add('hidden');
    kundListaSection.classList.remove('hidden');
    hämtaKunder();
  });
  
  // Funktion för att hämta kunder från API
  async function hämtaKunder() {
    try {
      const response = await fetch('/api/kunder');
      const kunder = await response.json();
      
      // Rensa befintligt innehåll
      kunderContainer.innerHTML = '';
      
      // Skapa HTML för varje kund
      kunder.forEach(kund => {
        const kundElement = document.createElement('div');
        kundElement.className = 'kund-kort';
        kundElement.innerHTML = `
          <h3>${kund.namn}</h3>
          <p>Kontaktperson: ${kund.kontakt}</p>
          <div class="kund-actions">
            <button class="redigera-kund" data-id="${kund.id}">Redigera</button>
            <button class="ta-bort-kund" data-id="${kund.id}">Ta bort</button>
          </div>
        `;
        kunderContainer.appendChild(kundElement);
      });
      
      // Lägg till händelsehanterare för de nya knapparna
      document.querySelectorAll('.redigera-kund').forEach(btn => {
        btn.addEventListener('click', function() {
          const kundId = this.getAttribute('data-id');
          alert(`Redigera kund ${kundId} - funktionalitet kommer snart`);
        });
      });
      
      document.querySelectorAll('.ta-bort-kund').forEach(btn => {
        btn.addEventListener('click', function() {
          const kundId = this.getAttribute('data-id');
          if (confirm('Är du säker på att du vill ta bort denna kund?')) {
            // Här skulle du anropa API för att ta bort kunden
            alert(`Kund ${kundId} borttagen - funktionalitet kommer snart`);
          }
        });
      });
      
    } catch (error) {
      console.error('Fel vid hämtning av kunder:', error);
      kunderContainer.innerHTML = '<p>Det uppstod ett fel vid hämtning av kunder.</p>';
    }
  }
  
  // Funktion för att lägga till en ny kund (kan implementeras senare)
  läggTillKundBtn.addEventListener('click', function() {
    alert('Funktionalitet för att lägga till kund kommer snart');
  });
});
