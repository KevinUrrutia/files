const noble = require('noble');
const fs = require('fs');

const DEVICE_INFORMATION_SERVICE_UUID = 'D87B756FA997';
const SCAN_PARAMETERS_SVC_UUID = '1813';
const GET_TIME_CHAR_UUID = '2a0a';
const FILE_NAME_CHAR_UUID = '2a4a';
const FILE_DATA_CHAR_UUID = '2a27';

noble.on('stateChange', (state) => {
  console.log(`State changed: ${state}`);
  if (state === 'poweredOn') {
    noble.startScanning();
  }
});

var GET_TIME_CHAR = null;
var FILE_NAME_CHAR = null;
var FILE_DATA_CHAR = null;

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

      	peripheral.discoverServices([SCAN_PARAMETERS_SVC_UUID], (error, services) => {
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
          					else if(FILE_NAME_CHAR_UUID == characteristic.uuid) {
          						FILE_NAME_CHAR = characteristic;
          						console.log("Evaluated same characteristic\n");
          						console.log(FILE_NAME_CHAR);
          					}
          					else if (FILE_DATA_CHAR_UUID == characteristic.uuid) {
          						FILE_DATA_CHAR = characteristic;
          						console.log("Evaluated same characteristic\n");
          						console.log(FILE_DATA_CHAR);
          					}
          				})
          				if (GET_TIME_CHAR && FILE_NAME_CHAR && FILE_DATA_CHAR) {
          					SCAN_PARAMETERS_FUNCTION();
          				}
          			})

          		});
			});
  		})	
	}
});

function SCAN_PARAMETERS_FUNCTION() {
	console.log('Scan Parameters function');
	var current_time = new Date();
	current_time = current_time.toLocaleString();
	console.log(current_time + "\n");

	 time = Buffer.from(current_time, 'utf-8');

	 File_Name = Buffer.alloc(12); //allocates a buffer size 12, this is only for test and needs to be adjusted
	 char_Buffer = Buffer.alloc(1); //allocates a buffer size of 1 to read one character at a time 

		GET_TIME_CHAR.write(time, true, function(error) {
		if(!error){
		// GET_TIME_CHAR.on('write', function(data, isNotification) {
		// 	})
			console.log("Write is successful\n");
		}
		else {console.log("Write is Unsuccessful\n");}
		}.bind(this));

		File_Name = FILE_NAME_CHAR.read(){
			if(!error){
		// GET_TIME_CHAR.on('write', function(data, isNotification) {
		// 	})
			console.log("read is successful\n");
		}
		else {console.log("read is Unsuccessful\n");}
		}.bind(this);

		 while(charBuffer != 0x03){ //0x03 is the end of file character that will be sent over manually at the end of the file read
		 	charBuffer FILE_DATA_CHAR.read(){
		 		if(!error){
				// GET_TIME_CHAR.on('write', function(data, isNotification) {
				// 	})
				console.log("read is successful\n");
				}
				else {console.log("read is Unsuccessful\n");}
				}.bind(this);

			fs.writeFile(File_Name, charBuffer, 'ascii', (err)=>{
				if(err) throw err;
				console.log("Write Success");
			});
		 }
}
