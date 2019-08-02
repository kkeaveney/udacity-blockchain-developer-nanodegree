import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';
import {flightCodes} from "./flightData.js";


let flights = [];
let contract;

(async() => {

    let result = null;
    //console.log("test");


    let contract = new Contract('localhost', () => {

        // add onfo about the owner of the contract
        (async() => {
            let owner = contract.owner;
            try {
                let airlineInfo = await contract.getAirline(owner);
                let address = airlineInfo[0];
                let hasPaid = airlineInfo[1];
                let isRegistered = airlineInfo[2];

                let contractOwnerElement = document.getElementById("contractOwner");

                let ownerInfoList = document.createElement("ul");
                for (let c = 0; c <= 2; c++) {
                    let listElement = document.createElement("li");
                    switch (c) {
                        case 0:
                            listElement.innerHTML = `Address: ${address}`;
                            break;
                        case 1:
                            listElement.innerHTML = `has paid: ${hasPaid}`;
                            break;
                        case 2:
                            listElement.innerHTML = `Is registered: ${isRegistered}`;
                            break;

                        }
                    ownerInfoList.appendChild(listElement);
                }
                contractOwnerElement.appendChild(ownerInfoList);
                let showBalanceBtn = document.createElement("button");
                showBalanceBtn.innerHTML = "Display contract balance";
                showBalanceBtn.setAttribute("class", "btn btn-primary");
                showBalanceBtn.addEventListener("click", async function() {
                    let currentBalance = await contract.contractBalance();
                    alert(`Contract balance is: ${currentBalance / 10**18} ether`);
                });
                contractOwnerElement.appendChild(showBalanceBtn);

            } catch(e) {
                console.log(e);
            }
        })();

        (async() => {
        let setOperatingStatusBtn = document.getElementById("setOpertingStatus");
        setOperatingStatusBtn.addEventListener("click", async function() {
          let mode = document.getElementById("setOperatingStat").value;
          mode = (mode == "true");
          try {
            alert(`Operating mode changed to ${mode}`);
            await contract.setStatus(contract.owner, mode);
            let opStatusPlaceholder = document.getElementById("opStatusPlaceholder");
            let status = await contract.getOperatingStatus();
            opStatusPlaceholder.innerHTML = status;

          } catch(error) {
            alert("Error");
          }
        })
    })();

        (async() => {
          var owner = contract.owner;
          let initialAirlines = ["BritishAirlines","WelshAirlines","ScottishAirlines"];
          let numberOfAirlines = await contract.getNumberOfAirlines();
          //console.log("Number of Airlines", Number(initialAirlines));

          if(numberOfAirlines < 4) {
            for(let i = 0; i < initialAirlines.length; i++){
              try  {
              await contract.registerAirline(owner, contract.airlines[i+1],initialAirlines[i]);
              console.log(`Airline ${initialAirlines[i]} is now registered`);
            } catch(error) {
              console.log("error");
              console.log(error);
            }
          }
          numberOfAirlines = await contract.getNumberOfAirlines();
          console.log("Number of Airlines", Number(numberOfAirlines));
        }

        })();

      (async() => {
        let airlineAddress = document.getElementById("selectAddress");
        let airlines = contract.airlines;
        for (let i = 0; i < airlines.length; i++) {
          let option = document.createElement("option");
          option.setAttribute("value", airlines[i]);
          option.innerHTML = `${i}: ${airlines[i]}`;
          airlineAddress.appendChild(option);
        }
        airlineAddress.addEventListener("change", () => {
          let addressline = document.getElementById("currentAddress");
          addressline.innerHTML = airlineAddress.value;
        })

      })();

      (async() => {
        let users = contract.allAccounts;
        let registeredAirlineElement = document.getElementById("airlineReg-address");
        for (let  i = 0; i < users.length; i++) {
              let option = document.createElement("option");
              option.setAttribute('value', users[i]);
              option.innerHTML = `${i}: ${users[i]}`;
              registeredAirlineElement.appendChild(option);
        }
      })();

      (async() => {
        let users = contract.allAccounts;
        let airlineElement = document.getElementById("airlineFund-address");
         for(let i = 0; i < users.length; i++) {
           let option = document.createElement("option");
           option.setAttribute("value", users[i]);
           option.innerHTML = `${i}: ${users[i]}`;
           airlineElement.appendChild(option);
         }
      })();

      (async() => {
        let users = contract.allAccounts;
        let passengerAddresss =  document.getElementById("selectPassengerAddress");
          for(let i = 0; i < users.length; i++) {
              let option = document.createElement("option");
              option.setAttribute("value", users[i]);
              option.innerHTML = `${i}: ${users[i]}`;
              passengerAddresss.appendChild(option);
          }

          passengerAddresss.addEventListener("change", async function () {
            let passengerLineElement = document.getElementById("currentPassengerAddress");
            passengerLineElement.innerHTML = passengerAddresss.value;
          });

      })();

      (async() => {
              let flightDataKeys = Object.keys(flightCodes);
              let flightElement  = document.getElementById("flightOrigin");
              let destinationElement = document.getElementById("flightDestination");
              for (let i = 0; i < flightDataKeys.length; i++) {
                  let option = document.createElement("option");
                  option.setAttribute("value", flightDataKeys[i]);
                  option.innerHTML = flightDataKeys[i];
                  flightElement .appendChild(option);
                  option = document.createElement("option");
                  option.innerHTML = flightDataKeys[i];
                  destinationElement.appendChild(option);
              }

              flightElement.addEventListener("change", () => {
                  let codeElement = document.getElementById("originCode");
                  codeElement.innerHTML = flightCodes[flightElement .value];
              });

              destinationElement.addEventListener("change", () => {
                  let destinationCodeElement = document.getElementById("destinationCode");
                  destinationCodeElement.innerHTML = flightCodes[destinationElement.value];
              });

          })();

          (async() => {
            let flightDeptDateElement = document.getElementById("departureDay");
            flightDeptDateElement.addEventListener("change", () => {
                alert(flightDeptDateElement.value);
            })
        })();

        (async() => {
            let hourEl = document.getElementById("hour");
            let minuteEl = document.getElementById("minute");
            for (let i = 0; i < 24; i++) {
                let option = document.createElement("option");
                if (i < 10) {
                    option.setAttribute("value", `0${i}`);
                    option.innerHTML = `0${i}`;
                } else {
                    option.setAttribute("value", i);
                    option.innerHTML = i;
                }
                hourEl.appendChild(option);
            }
            for (let i = 0; i < 60; i++) {
                let option = document.createElement("option");
                if (i < 10) {
                    option.setAttribute("value", `0${i}`);
                    option.innerHTML = `0${i}`;
                } else {
                    option.setAttribute("value", i);
                    option.innerHTML = i;
                }
                minuteEl.appendChild(option);
            }
        })();

        (async() => {
          let registerFlightBtn = document.getElementById("registerFlight");
          registerFlightBtn.addEventListener("click", async function (){

            let address = document.getElementById("selectAddress").value;
            let flightID = document.getElementById("flightCode").value;
            let departure = document.getElementById("flightOrigin").value;
            let destination = document.getElementById("flightDestination").value;

            let departureDay = document.getElementById("flightDepartureDay");
            let departurehour = document.getElementById("hour");
            let departureMinute = document.getElementById("minute");

            let departureDate = new Date(departureDay + "T" + departurehour + ":" + departureMinute + ":00Z");
            departureDate = departureDate.getTime();


            console.log(flightID, "Flight ID");
            console.log(departure, "origin");
            console.log(destination, "destination");
            console.log(departureDate, "departureDate");

            try {
                    await contract.registerFlight(flightID, departure, destination, departureDate);
                } catch(err) {
                    console.log(err);
                }


          })
        })();

        (async() => {
            let flightsBtn = document.getElementById("show-flights");

            flightsBtn.addEventListener("click", displayFlights);
        })();

        (async() => {
            let airlinesBtn = document.getElementById("show-airlines");
            airlinesBtn.addEventListener("click", displayAirlines);
        })();

        (() => {
            let registeredAirlineBtn = document.getElementById("registerAirline");
            registeredAirlineBtn.addEventListener("click", async function() {
                let senderAirlineAddr = document.getElementById("selectAddress").value;
                let newAirlineAddress = document.getElementById("airlineReg-address").value;
                let newAirlineName = document.getElementById("airlineName").value;

                try {
                    await contract.registerAirline(senderAirlineAddr, newAirlineAddress, newAirlineName);
                    contract.airlines.push(newAirlineAddress);
                    console.log(contract.airlines);
                } catch(error) {
                    console.log(error);
                }
            });
        })();


      });
})();

    async function displayFlights() {

    }

    async function displayAirlines() {

    }
