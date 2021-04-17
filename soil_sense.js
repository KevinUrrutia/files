const noble = require('noble');
const DEVICE_INFORMATION_SERVICE_UUID = 'D87B756FA997';
const GET_TIME_SVC_UUID = '1805';
const GET_TIME_CHAR_UUID = '2a0a';

noble.on('stateChange', (state) => {
  console.log(`State changed: ${state}`);
  if (state === 'poweredOn') {
    noble.startScanning();
  }
});

var GET_TIME_CHAR = null;

noble.on('discover', (peripheral) => {
  console.log(
    `Found device, name: ${peripheral.advertisement.localName}, uuid: ${peripheral.uuid}`
  );

 	if (peripheral.advertisement.localName === 'SOIL_SENSE') {
		console.log('yes');
		noble.stopScanning();
   		peripheral.on('connect', () => console.log('Device connected'));
    	peripheral.on('disconnect', () => console.log('Device disconnected'));

    	peripheral.connect((error) => {
      	if (error) console.log(error);

      	peripheral.discoverServices([GET_TIME_SVC_UUID], (error, services) => {
         	if (error) console.log(error);
         		console.log('services array', services);

         		services.forEach(function(service){
          			console.log("Found Service: ", service.uuid);

          			service.discoverCharacteristics([], function(err, characteristics) {
          				characteristics.forEach(function(characteristic) {
          					console.log('found characteristic:', characteristic.uuid);
          					if(GET_TIME_CHAR_UUID == characteristic.uuid){
          						GET_TIME_CHAR = characteristic;
          						console.log("Evaluated same characteristic\n");
          						console.log(GET_TIME_CHAR);
          					}
          				})
          				if (GET_TIME_CHAR) {
          					GET_TIME_FUNCTION();
          				}
          			})

          		});
			});
  		})	
	}
});

function GET_TIME_FUNCTION() {
	console.log('time function');
	var current_time = new Date();
	current_time = JSON.stringify(current_time);

	time = Buffer.from(current_time, 'utf-8');
	test = Buffer.from("Hello",'utf-8');

	console.log(test);

	GET_TIME_CHAR.write(test, true, function(error) {
		if(!error){
			console.log("Write is successful\n");
		}
		else {console.log("Write is Unsuccessful\n");}
	}.bind(this));
}
