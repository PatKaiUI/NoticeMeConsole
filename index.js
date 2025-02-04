const readlineSync = require("readline-sync");
const fs = require("fs");

class Notizenmanager {
  constructor(filePath) {
    this.filePath = filePath;
    this.notizen = this.loadNotizen();
  }

  // Lädt die Notizen
  loadNotizen() {
    if (fs.existsSync(this.filePath)) {
      try {
        const data = fs.readFileSync(this.filePath, "utf-8");
        return JSON.parse(data);
      } catch (error) {
        console.error("Fehler beim Laden der Notizen:", error);
        return [];
      }
    }
    return [];
  }

  // Speichert die Notizen
  saveNotizen() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.notizen, null, 2));
    } catch (error) {
      console.error("Fehler beim Speichern der Notizen:", error);
    }
  }

  // Notiz hinzufügen
  addNotiz() {
    const neueNotiz = readlineSync.question("Gib die Notiz ein: ");
    if (neueNotiz.trim() === "") {
      console.log("Ungültige Notiz.");
      return;
    }
    this.notizen.push(neueNotiz);
    this.saveNotizen();
    console.log("Notiz hinzugefügt!");
  }

  // Alle Notizen anzeigen
  showNotizen() {
    if (this.notizen.length === 0) {
      console.log("Keine Notizen vorhanden.");
      return;
    }
    console.log("\n--- Deine Notizen ---");
    this.notizen.forEach((note, index) => console.log(`${index + 1}: ${note}`));
  }

  // Notiz bearbeiten
  editNotiz() {
    this.showNotizen();
    if (this.notizen.length === 0) return;

    const index =
      readlineSync.questionInt("Welche Notiz möchtest du bearbeiten? ") - 1;
    if (index >= 0 && index < this.notizen.length) {
      const neueNotiz = readlineSync.question("Gib die neue Notiz ein: ");
      this.notizen[index] = neueNotiz;
      this.saveNotizen();
      console.log("Notiz aktualisiert!");
    } else {
      console.log("Ungültige Auswahl.");
    }
  }

  // Notiz löschen
  deleteNotiz() {
    this.showNotizen();
    if (this.notizen.length === 0) return;

    const index =
      readlineSync.questionInt("Welche Notiz möchtest du löschen? ") - 1;
    if (index >= 0 && index < this.notizen.length) {
      this.notizen.splice(index, 1);
      this.saveNotizen(this.notizen);
      console.log("Notiz gelöscht!");
    } else {
      console.log("Ungültige Auswahl.");
    }
  }
  // Hauptmenü anzeigen
  mainMenu() {
    while (true) {
      console.log("\n--- Notizen Manager ---");
      console.log("1. Notiz hinzufügen");
      console.log("2. Alle Notizen anzeigen");
      console.log("3. Notiz bearbeiten");
      console.log("4. Notiz löschen");
      console.log("5. Beenden");

      const choice = readlineSync.questionInt("Wähle eine Option: ");

      switch (choice) {
        case 1:
          this.addNotiz();
          break;
        case 2:
          this.showNotizen();
          break;
        case 3:
          this.editNotiz();
          break;
        case 4:
          this.deleteNotiz();
          break;
        case 5:
          console.log("Programm beendet.");
          return;
        default:
          console.log("Ungültige Auswahl. Versuch es nochmal.");
      }
    }
  }
}

// Programm starten
const manager = new Notizenmanager("./notizen.json");
manager.mainMenu();
