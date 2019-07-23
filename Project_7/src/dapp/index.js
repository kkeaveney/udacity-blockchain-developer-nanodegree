import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';


let flights = [];
let contract;

(async() => {

    contract = new Contract('localhost', () => {

      (async() => {
        let owner = contract.owner;
         try {
           let airlineDetails = await contract.getAirline(owner);
           let address = airlineDetails[0];
           let hasPaid = airlineDetails[1];
           let isRegistered = airlineDetails[2];
           let registeredAirlines = airlineDetails[3];


         } catch(err) {
           console.log(err);
         }

        displayFlightList();


        });
    })
  });


function buyInsurance() {
    let id = this.getAttribute('data-id');
    let flightText = DOM.elid('flightnumber_' + id);
    let flight = flightText.innerHTML;
    let insuranceFeeText = DOM.elid('textinput_' + id);
    let fee= parseFloat(insuranceFeeText.value);
    let button = DOM.elid('button_' + id);

    if (!fee|| fee< 0 || fee> 1) {
        alert('insurance fee must be between 0.0 and 1.0 ETH');
    } else {
        contract.buyInsurance(flight, web3.toWei(fee, 'ether'), (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
                alert('you bought an insurance for flight ' + flight + 'worth ' + fee+ ' ether');
                insuranceFeeText.readOnly = true;
                button.disabled = true;
            }
        });
    }
}

function updateStatus() {
    let flightnumber = DOM.elid('flightnumber_' + this.getAttribute('data-id')).innerHTML;
    contract.fetchFlightStatus(flightnumber, (err, result) => {
        if (err) {
        console.log(err);
        }
        console.log(result);

    });
}

function displayFlightList() {
    let displayDiv = DOM.elid('flightlist');

    displayDiv.appendChild(DOM.h4('Flights'));

    let length = flights.length;

    for (let i = 0; i < length; i++) {
        let rowClass = i % 2 == 0 ? 'even' : 'odd';
        let row = displayDiv.appendChild(DOM.div({className:'row ' + rowClass}));
        let textinput = DOM.input({ id: 'textinput_' + i, type: 'number', placeholder: 'insurance fee (max. 1.0)'});

        let infobutton = DOM.button({ id: 'infobutton_' + i, className: 'btn btn-primary'}, 'update status');
        infobutton.setAttribute('data-id', i);
        infobutton.addEventListener('click', updateStatus);

        let button = DOM.button({ id: 'button_' + i, className: 'btn btn-primary buyInsurance'}, 'buy insurance');
        button.setAttribute('data-id', i);
        button.addEventListener('click', buyInsurance);



        row.appendChild(DOM.div({className: 'col-sm-2 field', id: 'flightnumber_' + i}, flights[i].id));
        row.appendChild(DOM.div({className: 'col-sm-3 field'}, flights[i].departure.toISOString()));
        row.appendChild(DOM.div({className: 'col-sm-2 field'}, textinput));
        row.appendChild(DOM.div({className: 'col-sm-3 field'}, button));
        row.appendChild(DOM.div({className: 'col-sm-2 field'}, infobutton));
        displayDiv.appendChild(row);
    }
}

function randomDate(start, end) {
    return new Date(+(new Date()) + Math.floor(Math.random()*1000000000));
}

function randomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
