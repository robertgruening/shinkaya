# shinkaya

- [Deutsch](#deutsch)
  - [Spielressourcen](#spielressourcen)
    - [Szenebild](#szenebild)
    - [Gegenstandbild](#gegenstandbild)
    - [Detailbild](#detailbild)
    - [Konfiguration](#konfiguration)
- [English](#english)

## Deutsch

Shinkaya ist ein einfaches [Point-and-Click](https://de.wikipedia.org/wiki/Point-and-Click)-Abenteuerspiel-Framwork in [Egoperspektive](https://de.wikipedia.org/wiki/Egoperspektive) für das Web.

### Spielkonzept

- Der Spieler gewinnt das Spiel, wenn er alle Aufgaben erfüllen.
- Jede Aufgabe besteht darin, einen Gegenstand einzusammeln.
- Die Gegenstände sind an unterschiedlichen Orten platziert.
- Die Orte sind auf einer Karte verzeichnet und können über diese erreicht werden.
- Der Spieler kann sich durch die Szenen des Ortes bewegen, 
sich Informationen zu bestimmten Szenenbereichen sowie allen Gegenständen anzeigen lassen und 
alle Gegenstände einsammeln.

### Spielressourcen

Um ein konkretes Spiel mit diesem Framework zu erstellen, werden Bilddateien und eine Konfiguration benötigt.

#### Szenebild

Jeder Ort auf der Karte kann aus mehreren Szenen bestehen, zwischen denen sich der Spieler bewegen kann.
Jedes Szenebild weist folgende Merkmale auf:

- Dateiformat: JPG/JPEG
- Dateiendung: jpg
- Bildbreite: 1000px
- Bildhöhe: 750px

#### Gegenstandbild

Auf jeder Szene können sich Gegenstände befinden, zu denen der Spieler Detailinformationen einsehen kann und 
die er zudem einsammeln kann. Jedes Gegenstandsbild weist folgende Merkmale auf:

- Dateiformat: PNG
- Dateiendung: png
- Bildbreite: 50-100px
- Bildhöhe: 50-100px
- Auf dem Bild ist nur der Gegenstand zu sehen. Der Hintergrund ist eine transparente Fläche (siehe [Alphakanal](https://de.wikipedia.org/wiki/Alphakanal)).

#### Detailbild

Für jeden Gegenstand kann der Spieler einen Informationsdialog öffnen, um Details über diesen zu erfahren.
Jedes Detailbild weist folgende Merkmale auf:

- Dateiformat: JPG/JPEG
- Dateiendung: jpg
- Bildbreite: 400px
- Bildhöhe: 300px

#### Konfiguration

Alle Orte, deren Szenen, Gegenstände und informationshaltigen Szenenbereiche sind in einem 
[JSON](https://de.wikipedia.org/wiki/JavaScript_Object_Notation)-Konfigurationsobjekt registriert und 
miteinander verknüpft.



## English

Shinkaya is a simple point &amp; click adventure game framework for the web.

### Game Concept

- [First Person](https://en.wikipedia.org/wiki/First-person_(video_games))
- [Point and click](https://en.wikipedia.org/wiki/Point_and_click)
