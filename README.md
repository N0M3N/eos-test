# EosTest

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.1.

## Spuštění

1. instalace balíčků pomocí příkazu `npm i`
2. spuštění aplikace pomocí příkazu `ng s -o` (otevře výchozí prohlížeč na adrese [localhost:4200](http://localhost:4200))

## Globální ovládání
- V horním panelu pravo se nachází přepínač témat - aktuálně jsou v aplikaci dvě náhodně vygenerovaná témata - zelené a pastelové, mezi nimiž lze jednoduše přepínat, přidání dalšího témata by mělo být otázkou pár minut
- Ve spodní části obrazovky se nacházejí plovoucí tlačítka (Fab button) pro přidávání položek do seznamů nebo k navigaci
- Na spodním panelu se nachází odkaz na webové stránky vývojáře

## Chování aplikace
### První spuštění
Při prvním spuštění se automaticky spustí seed dat, který v localstorage vytvoří 'databázi' s ukázkovými daty - 2 týmy a několik hráčů

### Notifikace
Veškeré události zobrazují notifikace (maximálně 3 ve stejnou dobu), aby šlo jednoduše vidět, jak reaguje rxjs na různé akce uživatele

### Vyhledávání týmů
Při filtrování týmů se zobrazují i týmy v nichž hráčovo jméno obsahuje hledaný řetězec

### Mazání týmu
Smazání týmu pro zjednodušení nemaže hráče, takže je možné zaplnit localstorage daty, ke kterým už se uživatelsky není možno dostat