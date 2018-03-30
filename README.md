## Что есть в этом проекте

* Gulp
* Препроцессор SCSS
* Autoprefixer
* Простой [шаблонизатор](https://www.npmjs.com/package/gulp-file-include) для HTML
* [Browser Sync](https://www.browsersync.io) (Livereload)
* Генератор спрайтов
* Минификация ресурсов
* Сжатие графики

## Что для этого нужно

Установить [NodeJS](https://nodejs.org/en/)  
Плагин для редактора [Editorconfig](http://editorconfig.org)  

## Старт проекта

В консоле перейти в папку с проектом
Склонировать проект  

$ git clone git://github.com/schacon/grit.git

и установить зависимости

```bash
npm install
npm install -g gulp-cli (если не установлен)
```

### projectConfig.json

В этом файле можно добавить `JS` и `CSS` файлы в проект установленные через NPM и не только.  
ВНИМАНИЕ! Это JSON. Это строгий синтаксис, у последнего элемента в любом контексте не должно быть запятой в конце строки.


