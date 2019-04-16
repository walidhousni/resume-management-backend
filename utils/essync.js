module.exports = function esSync(Subscription) {
    const stream = Subscription.synchronize();
    let count = 0;

    stream.on('data', function(err, doc){
        count++;
    });

    stream.on('close', function(){
        console.log('indexed ' + count + ' documents!');
    });
    
    stream.on('error', function(err){
        console.log(err);
    });
}