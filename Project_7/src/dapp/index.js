
import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';

let flights = [];
let contract;


(async() => {

    let result = null;

    let contract = new Contract('localhost', () => {
        for(var i = 0; i < getRandomInt(10) + 10; i++) {
          flights.push({id: 'flight_' + i, departure: randomDate()});
        }

        displayFlightList();

        contract.flightSurety.App.events.FlightStatusInfo({
          fromBlock:0,
          toBlock:"latest"
        }, function (error, result) {
            if(error) {
              console.log(error)
            } else {
              console.log("oracles have been issued");
              console.log(result.returnValues);
            }
        });
      });

    /*    // User-submitted transaction
        DOM.elid('submit-oracle').addEventListener('click', () => {
            let flight = DOM.elid('flight-number').value;
            // Write transaction
            contract.fetchFlightStatus(flight, (error, result) => {
                display('Oracles', 'Trigger oracles', [ { label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp} ]);
            });
        })

    });
    */


})();


function displayFlightList() {
    let displayDiv = DOM.elid("display-wrapper");
    displayDiv.appendChild(DOM.h2('Flights'));
    displayDiv.appendChild(DOM.h5('Choose an insurance'));

    let length = flights.length;

    for(let i = 0; i <length; i++) {
      let rowClass = i % 2 == 0 ? 'even' : 'odd';
      let row = displayDiv.appendChild(DOM.div({className:'row' + rowClass}));
      let textinput = DOM.input({id: 'textinput_' + i, type: 'number', placeholder: 'insurance fee is maximum 1.0 Eth'});

      let button = DOM.button({id: 'button_' + i, className: 'btn btn-primary buy insurance'}, 'buy insurance');
      infobutton.setAttribute('data-id', i);
      infobutton.addEventListener('click', buyInsuranceHandler);

      let infobutton = DOM.button({id: 'infobutton_' + i, className: 'btn btn-primary'}, 'update status');
      infobutton.setAttribute('data-id',i);
      infobutton.addEventListener('click', updateStatusHandler);

      row.appendChild(DOM.div({className: 'col-sm-2 field', id: 'flightnumber_ ' + i}, flights[i].id));
      row.appendChild(DOM.div({className: 'col-sm-3 field'}, flights[i].departure.toISOString()));
      row.appendChild(DOM.div({className: 'col-sm-3 field'}, textinput));
      row.appendChild(DOM.div({className: 'col-sm-2 field'}, button));
      row.appendChild(DOM.div({className: 'col-sm-2 field'}, infobutton));
      displayDiv.appendChild(row);

    }
  /*  let section = DOM.section();
    section.appendChild(DOM.h2(title));
    section.appendChild(DOM.h5(description));
    results.map((result) => {
        let row = section.appendChild(DOM.div({className:'row'}));
        row.appendChild(DOM.div({className: 'col-sm-4 field'}, result.label));
        row.appendChild(DOM.div({className: 'col-sm-8 field-value'}, result.error ? String(result.error) : String(result.value)));
        section.appendChild(row);
    })
    displayDiv.append(section);
    */
}

    function randomDate(start, end) {
      return new Date(+(new Date()) + Math.floor(Math.random() * 1000000000));
    }

    function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    }
