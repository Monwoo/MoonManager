# MoonManager

![alt text](https://raw.githubusercontent.com/monwoo/MoonManager/master/src/assets/logos/MoonManager-128.png) ![alt text](https://raw.githubusercontent.com/monwoo/MoonManager/master/src/assets/logos/MoonManager-64-secondary.png)

**Easy project management software for human workloads best fits**

![alt text](http://www.monwoo.com/LogoMonwoo-64.png)
Timely funded and founded by Monwoo 2018.
Financé temporellement et fondé par Monwoo 2018.

#### FR

Nos ancêtres ont fait au mieux en France pour nous apporter les 35 heures avec congés payés.

Ils ont inventés le 'travail', qui n'est qu'une forme plus intensive de l'esclavage naturel de notre relation au monde.

Ainsi, ils ont pu générer un nouveau concepte dans leur époque : le sentiment de liberté.

L'esclavage moderne ayant raison de certaine de nos raisons, il ne nous est plus suffisant de croire en des droits vieux de plus de deux siècles déjà.

Droguée au nombre de taches accomplies ou via diverses méthodes addictives, notre temps s'amenuise à notre insu.

MoonManager est là pour vous permettre de présenter la valeur de votre temps.

A vous ensuite de le négocier au mieux.

Exemple de base de calcule pour interpréter des tarifs Freelances (Facturation de business à business, pouvant inclure des frais):

- 35hr par semaines avec 2.5 jours de congé payés par mois + arrêts maladies (prkoi fo absolument être malade pour une pause ??)
- = 7hr par jours avec 2.5 jours de congé payés par mois + arrêts maladies (prkoi fo absolument être malade pour une pause ??)
- = 7hr par jours avec environ une heures de congé payés par jour + arrêts maladies (prkoi fo absolument être malade pour une pause ??)
- = 5hr par jours de travails pour un contrat Business to Business Français.

Le problème, c'est que certains métiers nécessite des durées de productions plus importantes.

L'idée est donc de produire en équipe, et là, on as tous envi de jouer comme on peut...

MoonManager essayera de limiter la durée de l'esclavage moderne via 4 codes couleurs dans le thème de base :

```diff
+ En vert les jours inférieur ou égual à 1 heure
```

```css
{ En bleu les jours inférieur ou égual à 5 heures
```

```js
' En jaune les jours entre 5 et 7 heures';
```

```diff
- En rouge les jours de plus de 7 heures
```

Humainement parlant, l'objectif c'est de faire moins de 1hr par jours pour la réussite d'un objectif de charge vendu 1 journée au TJM du marché avec un résultat satisfaisant.

La notion de résultat ne devrais donc pas être une raison pour vous faire travailler plus, mais au contraire, vous faire travailler moins... Si ce n'est pas le cas, il est urgent de vous faire payer plus...

Cependant, la modernité n'étant pas le seul maître de notre vie, nous pouvons aller jusqu'à 5 heure de travail par jour pour le respect des 35hr. Au delà, il faudra rajouter des RTT, congée maladies, avantages de travails, heures sup, etc...

De plus, avec l'expèrience ou l'exigence, votre liberté se développe.

L'idéal serait de ne plus avoir obligation de travail pour tous.
En 2018, se libérer de l'esclavage naturel de son contexte immédiat n'est pas encore accessible à tous...

#### EN

In France, work is at most 35hr/week

The fight is not done. MoonManager will help you follow your workloads in any projects linkable to git logs and/or screen captures.

For now, let's narrow workload up to 1hr/day for best case, 5hr/day for regular, more than that is too much and needs appropriates compensations

# → Quick Documentation

## Viable targets :

This project use some advanced API to work fully.
We're using it under last Chrome webbrowser for now.
It may work under others, but we did not get time to try to ensure all polyfill for browsers that may support it.

## Install project :

```bash
# installing dependencies from package.json :
yarn install
# start dev server :
yarn start
# Extract strings from code and templates to src/app/translations/template.json :
yarn run translations:extract
# Display project documentation :
yarn run docs
# Running tests via Karma in watch mode for it to launch on each change you do to the code
# Nice to be run with dev server if you wanna do some tests driven developpments in real time :
yarn test

# To generate a new component|directive|pipe|service|class|module => replace 'component' below :
yarn run generate -- component <name>
yarn run generate -- module MoonManager
yarn run generate module moon-manager/MoonManagerRouting --flat --module=moon-manager
yarn run generate component moon-manager/MoonManager --flat --module=moon-manager
yarn run generate service moon-manager/services/RoutingSentinel --flat --module=moon-manager
yarn run generate component moon-manager/components/Header --module=moon-manager
yarn run generate component moon-manager/components/Body --module=moon-manager
yarn run generate component moon-manager/components/Footer --module=moon-manager

# running tests for continous integration (will test all only once) :
yarn run test:ci

# export dev project as Zip file :
git archive --format=zip -o ~/goinfre/MonwooMoonManager.zip HEAD

# build productions file in dist folder :
yarn run build
# zip result for Production Software delivery :
zip -r "MoonManager-Prod.zip" dist
```

## Extract your data for V1 imports :

```bash
# extract you git data for times report upload :
git log --all --date=iso --pretty=format:'"%h","%an","%ad","%s"' > git_logs.csv

# extract you captures data for times report upload :
<<COMMENT
No Need to extract captures via command lines.
For version 1, MoonManager will load your picture folder under last Google Chrome Webbrowser.
You just need to ensure directory architecture following this pattern :

<author>/<project>/<subproject>/<objectif>/<captureRegex>

=> you can use command lines to do so, but simple Operting System finder tool
may be easyer to quickly look at the capture and move it to the right location...
COMMENT

```

## For advanced documentation :

You're the documentation. To learn it, you can start by learning all usages of https://github.com/ngx-rocket/starter-kit, and then, code will be self explanatory.

MoonManager is simply some configuration and some more stuffs added to it.

# → Livre d'or des métiers

**Ci-dessous l'annuaire des métiers ayant des compétances d'usages du MoonManager :**

---

**Monwoo Theater Viewer (service@monwoo.com) :** produit Monwoo utilisé pour suivre le temps de M. Miguel Monwoo.

---

> Ps : n'hésitez pas à rajoutez votre carte business ci-dessus si vous avez un usage métier du MoonManager.

# → Bibliographie et veilles :

---

Refresh you knowledge about Markdown language :

https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet

https://help.github.com/articles/basic-writing-and-formatting-syntax/

https://github.com/github/markup/issues/353 :

For bold text : It looks like it doesn't work on GitHub unless there are white spaces before and after the asterisks.

=> well, it's more like need space Before the \*\* and No space after it for start of bold séquence, opposite at end.

---

Dev stuffs :

- https://angular.io/tutorial/toh-pt5
- https://angular.io/api/router/CanActivate
- https://www.concretepage.com/angular-2/angular-2-4-route-guards-canactivate-and-canactivatechild-example
- https://github.com/zefoy/ngx-dropzone-wrapper/blob/v7.1.0/src/lib/dropzone.component.ts
- https://www.dropzonejs.com/#dropzone-methods
- https://momentjs.com/docs/
- https://medium.com/@a.yurich.zuev/angular-nested-template-driven-form-4a3de2042475
- https://blog.grossman.io/real-world-angular-reactive-forms/
- https://scotch.io/tutorials/how-to-build-nested-model-driven-forms-in-angular-2
- https://www.sitepoint.com/component-routing-angular-router/
- https://stackoverflow.com/questions/47133610/angular-4-manual-redirect-to-route
- https://www.jvandemo.com/the-7-step-process-of-angular-router-navigation/
- https://angular.io/guide/router#heroes-list-optionally-selecting-a-hero
- https://stackoverflow.com/questions/38648407/angular2-error-there-is-no-directive-with-exportas-set-to-ngform
- https://www.angularjswiki.com/angular/angular-material-2-tutorial-with-examples/

```bash
# Basic tools for time sheets web reportings :
yarn add @angular-mdc/web angular/material hammerjs
yarn add '@angular/cdk' '@angular/material' angular-calendar date-fns
yarn add ccapture.js chart.js fullcalendar gif.js moment webm-writer
yarn add primeng primeicons ngx-dropzone-wrapper
# angular2-logger may be used if src/app/core/logger.service.ts is not enought (log call statck for débug ??)
```

---

Design stuffs :

- http://www.favicomatic.com/
- https://www.wikihow.com/Woo-a-Girl
- https://www.angularjswiki.com/angular/angular-material-icons-list-mat-icon-list/

---

Pusing to this repo :

- https://help.github.com/articles/duplicating-a-repository/
- https://help.github.com/articles/fork-a-repo/
- https://gist.github.com/jacquesd/85097472043b697ab57ba1b1c7530274
- https://help.github.com/articles/creating-a-pull-request-from-a-fork/
- https://help.github.com/articles/about-forks/
- https://www.gun.io/blog/how-to-github-fork-branch-and-pull-request

**Wysiwyg Fork with www.github.com :**
Forking a repository is a simple two-step process. We've created a repository for you to practice with!
On GitHub, navigate to the Monwoo/MoonManager repository.
Look for the Fork button In the top-right corner of the page, click Fork.
That's it! Now, you have a fork of the original Monwoo/MoonManager repository.

**Manual Fork with your command line :**

```bash
# clone original repo with bare option :
git clone --bare https://github.com/Monwoo/MoonManager.git
# create you own repo with your custom git tool, then minor push the original one :
cd MoonManager
git remote add --track master upstream <your custom repo push url>
# cleaning original repo :
cd .. && rm -rf MoonManager
git clone <your custom repo push url>
cd <your clonned folder>
# If you want, add the original repo as remote to fetch (potential) future changes.
# Make sure you also disable push on the remote (as you are not allowed to push to it anyway).
git remote add upstream <your custom repo push url>
git remote set-url --push upstream DISABLE
# When you push, do so on origin with :
git push origin
# When you want to pull changes from upstream you can just fetch the remote
# and rebase on top of your work + fix conflicts if any :
git fetch upstream
git rebase upstream/master
```

**Now you're getting ready to start :**
You'll want to switch off of the 'master' branch and onto a different branch for your new feature. It's important to do this because you can only have one Pull Request per branch, so if you want to submit more than one fix, you'll need to have multiple branches. Make a new branch like this:

```bash
git branch newfeature
```

Then switch to it like this:

```bash
git checkout newfeature
```

Now you're on your new branch. You can confirm this by simply typing :

```bash
git branch
```

---

# → Credits

Please, if you push to my repo, add your crédits below with a short description :

---

**2018/11/21 :** D'après une idée de M. Miguel Monwoo.

---

**2018/11/22 :** MoonManager commence avec pour base : https://github.com/ngx-rocket/starter-kit

---

**2018/11/22 :** Start point Tutorial for Advanced Dev usage : https://github.com/ngx-rocket/starter-kit

---

**2018/11/23 :** Création du logo du MoonManager par M. Miguel Monwoo, © Monwoo 2018

---

**2018/11/24 :** Création du Module MoonManager pour centraliser la base du reporting.

---

**2018/11/24 :** Ajout des outils nécessaires pour du web reporting via MoonManager.

---

**2018/11/24 :** Génération des logos et autre formats Web/Mobile avec http://www.favicomatic.com/

---

**2018/11/24 :** Ajustements du Module MoonManager

---

**2018/11/25 :** Adding client's side file loader

---

**2018/11/25 :** 'How to pull request' Knowledge transfert

---

**2018/11/25 :** Adding parameters view + ajusting router for fluent header/body/footer factorized app.

---

**2018/11/25 : (prévisionnel)** Adding timings pivot and dependencies

---

### Liked it? Give it a star 🌟, Moon will love it :). If not, please help us woo it.
