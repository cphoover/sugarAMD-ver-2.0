console.log('dog')

console.log(sugar.getCurrentScript());
sugar(['SUGAR.animal.Animal', 'SUGAR.util.Date'], function(){

    function Dog(){
         SUGAR.animal.Animal.apply(this, arguments);
    }

    Dog.prototype = new SUGAR.animal.Animal();
    Dog.constructor = Dog;

    Dog.prototype.bark = function(){
        console.log('woof woof');
    };

    return Dog;
    
});


console.log('dog')
