export default class Roller {
    link(scope, element) {
        var startMargin = 0;
        var rawElement = element[0];

        var intervalId = setInterval(() => {
            startMargin -= 500;

            if(Math.abs(startMargin) >= rawElement.scrollWidth) {
                startMargin = 0;
            }

            rawElement.style.marginLeft = startMargin + 'px';
        }, 5000);


        scope.$on('$destroy', () => clearInterval(intervalId));
    }
}