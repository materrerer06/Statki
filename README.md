# Gra w Statki - C# Blazor Server

![Gra w Statki](screenshot.png)

## Opis

To repozytorium zawiera kod źródłowy gry w statki napisanej w języku C# z wykorzystaniem platformy Blazor Server. Gra w statki to klasyczna gra planszowa, w której gracze umieszczają swoje statki na planszy i próbują odgadnąć lokalizację statków przeciwnika, strzelając w wybrane pola. Ta wersja gry została zaimplementowana przy użyciu Blazor Server, co oznacza, że logika gry jest przetwarzana po stronie serwera, a interakcja z graczami odbywa się w czasie rzeczywistym za pośrednictwem sygnałów gniazda (WebSocket).

## Wymagania

Aby uruchomić grę lokalnie na swoim komputerze, będziesz potrzebować następujących narzędzi:

- .NET Core SDK: [link](https://dotnet.microsoft.com/download)
- Przeglądarka internetowa z obsługą JavaScript (najnowsze wersje Chrome, Firefox, Edge itp.)

## Uruchomienie

Po zainstalowaniu .NET Core SDK, wykonaj następujące kroki, aby uruchomić grę:

1. Sklonuj to repozytorium na swój komputer.
2. Przejdź do katalogu z projektem.
3. Uruchom aplikację poprzez wpisanie w konsoli następującej komendy:
    ```
    dotnet run
    ```
4. Otwórz przeglądarkę internetową i przejdź do adresu `https://localhost:5001`.

## Funkcje

- Rozgrywka w czasie rzeczywistym: Blazor Server umożliwia interakcję z graczami w czasie rzeczywistym, co pozwala na dynamiczną rozgrywkę.
- Personalizacja gry: Gracze mogą dostosowywać swoje ustawienia oraz wygląd swojej planszy.
- Wygodny interfejs użytkownika: Przyjazny interfejs użytkownika zaprojektowany w oparciu o komponenty Blazora.
- Dostępność wieloplatformowa: Dzięki Blazor, gra może być uruchamiana w wielu przeglądarkach internetowych na różnych urządzeniach.

## Autorzy

Ta gra została stworzona przez [Twoje Imię/Nazwisko/Nick] oraz [Jeśli jest więcej autorów, dodaj ich tutaj].

## Licencja

Ten projekt jest udostępniany na licencji MIT. Zobacz plik [LICENSE](LICENSE) w celu uzyskania dodatkowych informacji.
