var ctx = document.getElementById('myChart').getContext('2d');
var socket = io();
fetch('./api/sensors/hum')
    .then(
        function(response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                return;
            }

            // Examine the text in the response
            response.json().then(function(data) {
                console.log(data);
                var x = [];
                var y = [];
                data.forEach(function(valeurs){
                    x.push(valeurs.timestamp);
                    y.push(valeurs.value);
                });
                var chart = new Chart(ctx, {
                    // The type of chart we want to create
                    type: 'line',
                    // The data for our dataset
                    data: {
                        labels: x,
                        datasets: [{
                            label: 'Humidity',
                            backgroundColor: 'rgb(255, 99, 132)',
                            borderColor: 'rgb(255, 99, 132)',
                            data: y
                        }]
                    },
                    // Configuration options go here
                    options: {}
                });
                // console.log(chart);

                socket.on('humChange', function(msg){
                    console.log(msg);
                    chart.data.labels.push(Date.now());
                    chart.data.data.push(msg.newHum);
                    chart.update();
                });
            });
        }
    )
    .catch(function(err) {
        console.log('Fetch Error :-S', err);
    });
