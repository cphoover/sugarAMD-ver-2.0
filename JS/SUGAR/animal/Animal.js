console.log('animal');

sugar(function(){

    function Animal(){
     
    }   

    Animal.prototype.sleep = function(){
        console.log('zzzz');
    }

    return Animal;
 
});

console.log(sugar.getCurrentScript());

console.log('animal');
