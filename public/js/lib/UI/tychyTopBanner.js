export default class TychyTopBanner {
    constructor() {
        this.template = `<div class="container container-column toolbar__container--tychy">
                <div class="container container-row toolbar--top--tychy container--space-between" style="height:25px">
                    <img class="tychy__logo--small" src="partials/tychy/img/gkstychy.png">
                    <span class="ui-text-shadow toolbar--top--tychy__title ui-text--white"><span ng-transclude></span></span>
                    <img src="partials/tychy/img/s4f-poziom.png">
                </div>
                <div style="height: 2px;" class="container container-row container--space-between">
                    <div class="width-1-3 backgrouny--tychy__first"></div>
                    <div class="width-1-3 backgrouny--tychy__second"></div>
                    <div class="backgrouny--tychy__third width-1-3"></div>
                </div>
          </div>`;

        this.transclude = true;
        this.replace = true;
    }
}